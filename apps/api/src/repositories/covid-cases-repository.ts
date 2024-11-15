import type { CovidCase } from "@prisma/client"

export interface CovidCasesRepository {
  findByMultipleCountries(
    countryIds: number[],
    startDate: Date,
    endDate: Date
  ): Promise<Record<number, CovidCase[]>>

  findLatestByCountries(countryIds: number[]): Promise<Record<number, CovidCase>>
}