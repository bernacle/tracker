import type { Vaccination, VaccinationByAge, VaccinationByManufacturer } from "@prisma/client"

export interface VaccinationsRepository {
  findByCountryAndDateRange(
    countryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Vaccination[]>

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