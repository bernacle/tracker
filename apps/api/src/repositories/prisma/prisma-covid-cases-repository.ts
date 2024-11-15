import { prisma } from "@/lib/prisma"
import type { CovidCase } from "@prisma/client"
import type { CovidCasesRepository } from "../covid-cases-repository"

export class PrismaCovidCaseRepository implements CovidCasesRepository {

  async findByCountryAndDateRange(
    countryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<CovidCase[]> {
    return prisma.covidCase.findMany({
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

  async findByMultipleCountries(
    countryIds: number[],
    startDate: Date,
    endDate: Date
  ): Promise<Record<number, CovidCase[]>> {
    const cases = await prisma.covidCase.findMany({
      where: {
        countryId: { in: countryIds },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    return cases.reduce((acc, curr) => {
      if (!acc[curr.countryId]) {
        acc[curr.countryId] = []
      }
      acc[curr.countryId].push(curr)
      return acc
    }, {} as Record<number, CovidCase[]>)
  }

  async findLatestByCountries(countryIds: number[]): Promise<Record<number, CovidCase>> {
    const latestCases = await prisma.covidCase.findMany({
      where: {
        countryId: { in: countryIds }
      },
      orderBy: {
        date: 'desc'
      },
      distinct: ['countryId']
    })

    return latestCases.reduce((acc, curr) => {
      acc[curr.countryId] = curr
      return acc
    }, {} as Record<number, CovidCase>)
  }
}