import { prisma } from "@/lib/prisma"
import type { Vaccination, VaccinationByAge, VaccinationByManufacturer } from "@prisma/client"
import type { VaccinationsRepository } from "../vaccinations-repository"

export class PrismaVaccinationRepository implements VaccinationsRepository {
  async findByCountryAndDateRange(
    countryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Vaccination[]> {
    return prisma.vaccination.findMany({
      where: {
        countryId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
  }

  async findByManufacturer(
    countryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<VaccinationByManufacturer[]> {
    return prisma.vaccinationByManufacturer.findMany({
      where: {
        countryId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
  }

  async findByAgeGroup(
    countryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<VaccinationByAge[]> {
    return prisma.vaccinationByAge.findMany({
      where: {
        countryId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
  }

  async findLatestByCountries(countryIds: number[]): Promise<Record<number, Vaccination>> {
    const latestVaccinations = await prisma.vaccination.findMany({
      where: {
        countryId: { in: countryIds }
      },
      orderBy: {
        date: 'desc'
      },
      distinct: ['countryId']
    })

    return latestVaccinations.reduce((acc, curr) => {
      acc[curr.countryId] = curr
      return acc
    }, {} as Record<number, Vaccination>)
  }
}
