import type { Country } from "@prisma/client"

export type Filters = {
  continent?: string
  incomeGroup?: string
  population?: { gte?: number; lte?: number }
  medianAge?: { gte?: number; lte?: number }
  gdpPerCapita?: { gte?: number; lte?: number }
  hospitalBedsPerThousand?: { gte?: number; lte?: number }
}

export interface CountriesRepository {
  findById(id: number): Promise<Country | null>
  findByIsoCode(isoCode: string): Promise<Country | null>
  findAll(filters?: Filters): Promise<Country[]>
}