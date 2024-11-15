import { PrismaSavedSearchesRepository } from '@/repositories/prisma/prisma-saved-searches-repository'
import { GetSearchesService } from '../get-searches-service'

export function makeGetSearchesService() {
  return new GetSearchesService(new PrismaSavedSearchesRepository())
}
