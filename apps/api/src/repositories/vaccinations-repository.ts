import type { Vaccination, VaccinationByAge, VaccinationByManufacturer } from "@prisma/client"

export interface VaccinationsRepository {
  findManyByCountriesAndDateRange(
    countryIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, Vaccination[]>>

  findByManufacturer(
    countryId: string,
    startDate: Date,
    endDate: Date
  ): Promise<VaccinationByManufacturer[]>

  findByAgeGroup(
    countryId: string,
    startDate: Date,
    endDate: Date
  ): Promise<VaccinationByAge[]>

  findLatestByCountries(countryIds: string[]): Promise<Record<string, Vaccination>>
}