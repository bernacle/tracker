import type { CountriesRepository } from "@/repositories/countries-repository";
import type { Country } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { FetchCountriesService } from "./fetch-countries";
import { mockBaselineCountry, mockComparisonCountry } from "./mocks/data/countries";

const mockCountriesRepository: Partial<CountriesRepository> = {
  findAll: vi.fn(),
};

const fetchCountriesService = new FetchCountriesService(
  mockCountriesRepository as CountriesRepository
);

describe("FetchCountriesService", () => {
  it("should return all countries when no filters are applied", async () => {
    const mockData: Country[] = [
      mockBaselineCountry,
      mockComparisonCountry,
    ];

    mockCountriesRepository.findAll = vi.fn().mockResolvedValue(mockData);

    const result = await fetchCountriesService.execute();

    expect(result.countries).toEqual(mockData);
    expect(mockCountriesRepository.findAll).toHaveBeenCalledOnce();
  });

  it("should return an empty array if no countries are found", async () => {
    mockCountriesRepository.findAll = vi.fn().mockResolvedValue([]);

    const result = await fetchCountriesService.execute();

    expect(result.countries).toEqual([]);
    expect(mockCountriesRepository.findAll).toHaveBeenCalledOnce();
  });
});
