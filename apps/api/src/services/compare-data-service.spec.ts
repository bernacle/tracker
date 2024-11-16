import type { Vaccination } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompareDataService } from "./compare-data-service";
import {
  mockBaselineCountry,
  mockComparisonCountry,
} from "./mocks/data/countries";
import {
  mockCountriesRepository,
  mockCovidCasesRepository,
  mockVaccinationsRepository,
} from "./mocks/repositories";

let service: CompareDataService;

beforeEach(() => {
  service = new CompareDataService(
    mockCountriesRepository,
    mockCovidCasesRepository,
    mockVaccinationsRepository
  );
  vi.clearAllMocks();
});


describe("CompareDataService", () => {
  it("should fetch only baseline data when comparison is not provided", async () => {
    const mockCountries = [mockBaselineCountry];
    const mockCovidData: { countryId: string; newCases: number; totalCases: number }[] = [
      { countryId: "66f85e86-8960-4e56-b3ad-ce3895e0b84d", newCases: 10, totalCases: 100 },
    ];
    const mockVaccinationData: Vaccination[] = [];


    mockCountriesRepository.findAll = vi.fn().mockResolvedValue(mockCountries);
    mockCovidCasesRepository.findByMultipleCountries = vi.fn().mockResolvedValue(mockCovidData);
    mockVaccinationsRepository.findManyByCountriesAndDateRange = vi.fn().mockResolvedValue(mockVaccinationData);

    const params = {
      baseline: {
        countries: ["CA"],
        demographics: { minPopulation: 500000 },
        category: "COVID" as const,
      },
      dateRange: {
        startDate: new Date("2020-01-01"),
        endDate: new Date("2021-01-01"),
      },
    };

    const result = await service.execute(params);

    expect(result).toEqual({
      baseline: {
        countries: mockCountries,
        covidData: mockCovidData,
        vaccinationData: mockVaccinationData,
      },
      comparison: null,
    });
  });

  it("should fetch both baseline and comparison data when both are provided", async () => {
    const mockBaselineCountries = [mockBaselineCountry];
    const mockComparisonCountries = [mockComparisonCountry];
    const mockCovidDataBaseline: { countryId: string; newCases: number; totalCases: number }[] = [
      { countryId: "66f85e86-8960-4e56-b3ad-ce3895e0b84d", newCases: 10, totalCases: 100 },
    ];
    const mockCovidDataComparison: { countryId: string; newCases: number; totalCases: number }[] = [
      { countryId: "cf2a4c9b-3d8f-487f-91f9-f13a2e3d3c7c", newCases: 20, totalCases: 200 },
    ];
    const mockVaccinationDataBaseline: Vaccination[] = [];
    const mockVaccinationDataComparison: Vaccination[] = [];


    mockCountriesRepository.findAll = vi
      .fn()
      .mockResolvedValueOnce(mockBaselineCountries)
      .mockResolvedValueOnce(mockComparisonCountries);
    mockCovidCasesRepository.findByMultipleCountries = vi
      .fn()
      .mockResolvedValueOnce(mockCovidDataBaseline)
      .mockResolvedValueOnce(mockCovidDataComparison);
    mockVaccinationsRepository.findManyByCountriesAndDateRange = vi
      .fn()
      .mockResolvedValueOnce(mockVaccinationDataBaseline)
      .mockResolvedValueOnce(mockVaccinationDataComparison);

    const params = {
      baseline: {
        countries: ["CA"],
        demographics: { minPopulation: 500000 },
        category: "COVID" as const,
      },
      comparison: {
        countries: ["CB"],
        demographics: { minPopulation: 1000000 },
        category: "COVID" as const,
      },
      dateRange: {
        startDate: new Date("2020-01-01"),
        endDate: new Date("2021-01-01"),
      },
    };

    const result = await service.execute(params);

    expect(result).toEqual({
      baseline: {
        countries: mockBaselineCountries,
        covidData: mockCovidDataBaseline,
        vaccinationData: mockVaccinationDataBaseline,
      },
      comparison: {
        countries: mockComparisonCountries,
        covidData: mockCovidDataComparison,
        vaccinationData: mockVaccinationDataComparison,
      },
    });
  });
});



