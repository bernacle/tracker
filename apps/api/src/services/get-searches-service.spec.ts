import type { SavedSearchesRepository } from '@/repositories/saved-searches-repository';
import { GetSearchesService } from '@/services/get-searches-service';
import type { SavedSearch } from '@prisma/client';
import { describe, expect, it, vi, type Mock } from 'vitest';

const mockSavedSearchesRepository: Partial<SavedSearchesRepository> = {
  getSavedSearches: vi.fn(),
};

const getSearchesService = new GetSearchesService(
  mockSavedSearchesRepository as SavedSearchesRepository
);

describe('GetSearchesService', () => {
  it('should return saved searches for a valid userId', async () => {
    const mockUserId = 'user-123';
    const mockSavedSearches: SavedSearch[] = [
      { id: 1, userId: mockUserId, name: 'Search 1', criteria: '{}' },
      { id: 2, userId: mockUserId, name: 'Search 2', criteria: '{}' },
    ];

    (mockSavedSearchesRepository.getSavedSearches as Mock).mockResolvedValue(mockSavedSearches);

    const response = await getSearchesService.execute({ userId: mockUserId });

    expect(response.searches).toEqual(mockSavedSearches);
    expect(mockSavedSearchesRepository.getSavedSearches).toHaveBeenCalledWith(mockUserId);
  });

  it('should return an empty array if no searches are found', async () => {
    const mockUserId = 'user-456';

    (mockSavedSearchesRepository.getSavedSearches as Mock).mockResolvedValue([]);

    const response = await getSearchesService.execute({ userId: mockUserId });

    expect(response.searches).toEqual([]);
    expect(mockSavedSearchesRepository.getSavedSearches).toHaveBeenCalledWith(mockUserId);
  });
});
