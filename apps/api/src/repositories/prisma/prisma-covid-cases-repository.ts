import { prisma } from "@/lib/prisma"
import type { CovidCase } from "@prisma/client"
import type { CovidCasesRepository } from "../covid-cases-repository"

export class PrismaCovidCaseRepository implements CovidCasesRepository {
  async findByMultipleCountries(
    countryIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, CovidCase[]>> {
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
    }, {} as Record<string, CovidCase[]>)
  }

  async findLatestByCountries(countryIds: string[]): Promise<Record<string, CovidCase>> {
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
    }, {} as Record<string, CovidCase>)
  }
}