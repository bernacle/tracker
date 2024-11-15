
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompareDataService } from './compare-data-service';
import { mockBaselineCountry, mockComparisonCountry } from './mocks/data/countries';
import { mockCountriesRepository, mockCovidCasesRepository, mockVaccinationsRepository } from './mocks/repositories';

let service: CompareDataService;

beforeEach(() => {
  service = new CompareDataService(
    mockCountriesRepository,
    mockCovidCasesRepository,
    mockVaccinationsRepository
  );

  vi.clearAllMocks();
});

describe('CompareDataService', () => {
  it('should fetch only baseline data when comparison is not provided', async () => {
    const mockCountries = [mockBaselineCountry];
    const mockCovidData = [{ countryId: 1, newCases: 10, totalCases: 100 }];
    const mockVaccinationData = [{ countryId: 1, peopleVaccinated: 500 }];

    mockCountriesRepository.findAll = vi.fn().mockResolvedValue(mockCountries);
    mockCovidCasesRepository.findByMultipleCountries = vi.fn().mockResolvedValue({ 1: mockCovidData });
    mockVaccinationsRepository.findManyByCountriesAndDateRange = vi.fn().mockResolvedValue({ 1: mockVaccinationData });

    const params = {
      baseline: {
        countries: ['CA'],
        demographics: { minPopulation: 500000 },
      },
      dateRange: {
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-01'),
      },
    };

    const result = await service.execute(params);

    expect(mockCountriesRepository.findAll).toHaveBeenCalledWith({
      isoCodes: ['CA'],
      continent: undefined,
      incomeGroup: undefined,
      population: { gte: 500000, lte: undefined },
      medianAge: { gte: undefined, lte: undefined },
      gdpPerCapita: { gte: undefined, lte: undefined },
      maleSmokers: undefined,
      femaleSmokers: undefined,
    });
    expect(mockCovidCasesRepository.findByMultipleCountries).toHaveBeenCalledWith(
      [1],
      new Date('2020-01-01'),
      new Date('2021-01-01')
    );
    expect(mockVaccinationsRepository.findManyByCountriesAndDateRange).toHaveBeenCalledWith(
      [1],
      new Date('2020-01-01'),
      new Date('2021-01-01')
    );

    expect(result).toEqual({
      baseline: {
        countries: mockCountries,
        covidData: { 1: mockCovidData },
        vaccinationData: { 1: mockVaccinationData },
      },
      comparison: null,
    });
  });

  it('should fetch both baseline and comparison data when both are provided', async () => {
    const mockBaselineCountries = [mockBaselineCountry];
    const mockComparisonCountries = [mockComparisonCountry];
    const mockCovidData = [{ countryId: 1, newCases: 10, totalCases: 100 }];
    const mockVaccinationData = [{ countryId: 1, peopleVaccinated: 500 }];
    const mockComparisonCovidData = [{ countryId: 2, newCases: 20, totalCases: 200 }];
    const mockComparisonVaccinationData = [{ countryId: 2, peopleVaccinated: 1000 }];

    mockCountriesRepository.findAll = vi.fn()
      .mockResolvedValueOnce(mockBaselineCountries)
      .mockResolvedValueOnce(mockComparisonCountries);
    mockCovidCasesRepository.findByMultipleCountries = vi.fn()
      .mockResolvedValueOnce({ 1: mockCovidData })
      .mockResolvedValueOnce({ 2: mockComparisonCovidData });
    mockVaccinationsRepository.findManyByCountriesAndDateRange = vi.fn()
      .mockResolvedValueOnce({ 1: mockVaccinationData })
      .mockResolvedValueOnce({ 2: mockComparisonVaccinationData });

    const params = {
      baseline: {
        countries: ['CA'],
        demographics: { minPopulation: 500000 },
      },
      comparison: {
        countries: ['CB'],
        demographics: { minPopulation: 1000000 },
      },
      dateRange: {
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-01'),
      },
    };

    const result = await service.execute(params);

    expect(mockCountriesRepository.findAll).toHaveBeenCalledTimes(2);
    expect(mockCovidCasesRepository.findByMultipleCountries).toHaveBeenCalledTimes(2);
    expect(mockVaccinationsRepository.findManyByCountriesAndDateRange).toHaveBeenCalledTimes(2);

    expect(result).toEqual({
      baseline: {
        countries: mockBaselineCountries,
        covidData: { 1: mockCovidData },
        vaccinationData: { 1: mockVaccinationData },
      },
      comparison: {
        countries: mockComparisonCountries,
        covidData: { 2: mockComparisonCovidData },
        vaccinationData: { 2: mockComparisonVaccinationData },
      },
    });
  });
});
