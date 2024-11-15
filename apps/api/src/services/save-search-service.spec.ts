import type { SavedSearchesRepository } from '@/repositories/saved-searches-repository';
import { SaveSearchService } from '@/services/save-search-service';
import type { SavedSearch } from '@prisma/client';
import { describe, expect, it, vi, type Mock } from 'vitest';

const mockSavedSearchesRepository: Partial<SavedSearchesRepository> = {
  saveSearch: vi.fn(),
};

const saveSearchService = new SaveSearchService(
  mockSavedSearchesRepository as SavedSearchesRepository
);

describe('SaveSearchService', () => {
  it('should save a search for a valid userId and return the saved search', async () => {
    const mockUserId = 'user-123';
    const mockName = 'Test Search';
    const mockCriteria = '{"baseline": {"countries": ["USA"]}}';
    const mockSavedSearch: SavedSearch = {
      id: 1,
      userId: mockUserId,
      name: mockName,
      criteria: mockCriteria,
    };

    (mockSavedSearchesRepository.saveSearch as Mock).mockResolvedValue(mockSavedSearch);

    const response = await saveSearchService.execute({
      userId: mockUserId,
      name: mockName,
      criteria: mockCriteria,
    });

    expect(response.savedSearch).toEqual(mockSavedSearch);
    expect(mockSavedSearchesRepository.saveSearch).toHaveBeenCalledWith(mockUserId, {
      name: mockName,
      criteria: mockCriteria,
    });
  });

  it('should save a search without a name if the name is not provided', async () => {
    const mockUserId = 'user-456';
    const mockCriteria = '{"comparison": {"countries": ["Canada"]}}';
    const mockSavedSearch: SavedSearch = {
      id: 2,
      userId: mockUserId,
      name: "default",
      criteria: mockCriteria,
    };

    (mockSavedSearchesRepository.saveSearch as Mock).mockResolvedValue(mockSavedSearch);

    const response = await saveSearchService.execute({
      userId: mockUserId,
      name: undefined,
      criteria: mockCriteria,
    });

    expect(response.savedSearch).toEqual(mockSavedSearch);
    expect(mockSavedSearchesRepository.saveSearch).toHaveBeenCalledWith(mockUserId, {
      name: undefined,
      criteria: mockCriteria,
    });
  });
});
