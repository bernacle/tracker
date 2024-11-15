import { prisma } from "@/lib/prisma";
import type { Country } from "@prisma/client";
import type { CountriesRepository, Filters } from "../countries-repository";

export class PrismaCountriesRepository implements CountriesRepository {
  async findById(id: number): Promise<Country | null> {
    return await prisma.country.findUnique({
      where: { id }
    })
  }
  async findByIsoCode(isoCode: string): Promise<Country | null> {
    return await prisma.country.findUnique({
      where: { isoCode }
    })
  }
  async findAll(filters?: Filters): Promise<Country[]> {
    return prisma.country.findMany({
      where: {
        continent: filters?.continent,
        incomeGroup: filters?.incomeGroup,
        population: {
          gte: filters?.population?.gte,
          lte: filters?.population?.lte
        },
        medianAge: {
          gte: filters?.medianAge?.gte,
          lte: filters?.medianAge?.lte
        },
        gdpPerCapita: {
          gte: filters?.gdpPerCapita?.gte,
          lte: filters?.gdpPerCapita?.lte
        },
        hospitalBedsPerThousand: {
          gte: filters?.hospitalBedsPerThousand?.gte,
          lte: filters?.hospitalBedsPerThousand?.lte
        }
      }
    })
  }
}