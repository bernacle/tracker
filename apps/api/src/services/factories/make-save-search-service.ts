import { PrismaSavedSearchesRepository } from '@/repositories/prisma/prisma-saved-searches-repository'
import { SaveSearchService } from '../save-search-service'

export function makeSaveSearchService() {
  return new SaveSearchService(new PrismaSavedSearchesRepository())
}
