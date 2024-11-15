import type { Vaccination, VaccinationByAge, VaccinationByManufacturer } from "@prisma/client"

export interface VaccinationsRepository {
  findManyByCountriesAndDateRange(
    countryIds: number[],
    startDate: Date,
    endDate: Date
  ): Promise<Record<number, Vaccination[]>>

  findByManufacturer(
    countryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<VaccinationByManufacturer[]>

  findByAgeGroup(
    countryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<VaccinationByAge[]>

  findLatestByCountries(countryIds: number[]): Promise<Record<number, Vaccination>>
}