import type { Country } from "@prisma/client";

export interface Filters {
  isoCodes?: string[];
  continent?: string;
  incomeGroup?: string;
  population?: {
    gte?: number;
    lte?: number;
  };
  medianAge?: {
    gte?: number;
    lte?: number;
  };
  gdpPerCapita?: {
    gte?: number;
    lte?: number;
  };
  maleSmokers?: {
    not?: null;
  };
  femaleSmokers?: {
    not?: null;
  };
}

export interface CountriesRepository {
  findById(id: number): Promise<Country | null>
  findByIsoCode(isoCode: string): Promise<Country | null>
  findAll(filters?: Filters): Promise<Country[]>
}