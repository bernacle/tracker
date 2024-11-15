import type { CovidCase } from "@prisma/client"

export interface CovidCasesRepository {
  findByMultipleCountries(
    countryIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, CovidCase[]>>

  findLatestByCountries(countryIds: string[]): Promise<Record<string, CovidCase>>
}