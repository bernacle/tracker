import { PrismaCountriesRepository } from '@/repositories/prisma/prisma-countries-repository'
import { FetchCountriesService } from '../fetch-countries'

export function makeFetchCountriesService() {
  return new FetchCountriesService(new PrismaCountriesRepository())
}
