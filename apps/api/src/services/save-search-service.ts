import type { SavedSearchesRepository } from "@/repositories/saved-searches-repository";
import type { SavedSearch } from "@prisma/client";

type SaveSearchServiceRequest = {
  name?: string;
  criteria: string;
  userId: string;
};

type SaveSearchServiceResponse = {
  savedSearch: SavedSearch;
};

export class SaveSearchService {
  constructor(private savedSearchesRepository: SavedSearchesRepository) { }

  async execute({ userId, name, criteria }: SaveSearchServiceRequest): Promise<SaveSearchServiceResponse> {
    const savedSearch = await this.savedSearchesRepository.saveSearch(userId, {
      name,
      criteria,
    });

    return { savedSearch };
  }
}
