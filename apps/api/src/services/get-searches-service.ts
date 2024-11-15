import type { SavedSearchesRepository } from "@/repositories/saved-searches-repository";
import type { SavedSearch } from "@prisma/client";

type GetSearchesServiceRequest = {
  userId: string;
};

type GetSearchesServiceResponse = {
  searches: SavedSearch[];
};

export class GetSearchesService {
  constructor(private savedSearchesRepository: SavedSearchesRepository) { }

  async execute({ userId }: GetSearchesServiceRequest): Promise<GetSearchesServiceResponse> {
    const searches = await this.savedSearchesRepository.getSavedSearches(userId);

    return { searches };
  }
}
