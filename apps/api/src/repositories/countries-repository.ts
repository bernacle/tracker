import type { Country } from "@prisma/client";

export type Filters = {
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
  findById(id: string): Promise<Country | null>
  findByIsoCode(isoCode: string): Promise<Country | null>
  findAll(filters?: Filters): Promise<Country[]>
}