import { prisma } from "@/lib/prisma";
import { CountriesMapper } from "@/services/mapper/countries-mapper";
import type { Country } from "@prisma/client";
import type { CountriesRepository, Filters } from "../countries-repository";

export class PrismaCountriesRepository implements CountriesRepository {
  async findById(id: string): Promise<Country | null> {
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



    const countries = await prisma.country.findMany({
      where: {
        isoCode: filters?.isoCodes ? { in: filters.isoCodes } : undefined,
        continent: filters?.continent,
        incomeGroup: filters?.incomeGroup,
        population: {
          gte: filters?.population?.gte,
          lte: filters?.population?.lte,
        },
        medianAge: {
          gte: filters?.medianAge?.gte,
          lte: filters?.medianAge?.lte,
        },
        gdpPerCapita: {
          gte: filters?.gdpPerCapita?.gte,
          lte: filters?.gdpPerCapita?.lte,
        },
        maleSmokers: filters?.maleSmokers,
        femaleSmokers: filters?.femaleSmokers,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return countries.map(country => CountriesMapper.toCapitalize(country))

  }
}