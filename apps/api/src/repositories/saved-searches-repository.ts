import type { SavedSearch } from "@prisma/client";

export interface SavedSearchesRepository {
  saveSearch(userId: string, searchData: Partial<SavedSearch>): Promise<SavedSearch>;
  getSavedSearches(userId: string): Promise<SavedSearch[]>;
}