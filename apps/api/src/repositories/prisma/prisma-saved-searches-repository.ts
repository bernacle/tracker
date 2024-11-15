
import { prisma } from '@/lib/prisma';
import type { SavedSearch } from '@prisma/client';
import type { SavedSearchesRepository } from '../saved-searches-repository';

export class PrismaSavedSearchesRepository implements SavedSearchesRepository {
  async saveSearch(userId: string, searchData: Partial<SavedSearch>): Promise<SavedSearch> {
    return prisma.savedSearch.create({
      data: {
        userId,
        name: searchData.name ?? 'default',
        criteria: searchData.criteria ?? {},
      },
    });
  }

  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    return prisma.savedSearch.findMany({ where: { userId } });
  }
}
