/**
 * API service for handling search requests
 * Simulates real API calls by fetching from JSON data
 */

import { type SearchResult } from '../hooks/useSearch';

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number;
}

interface SearchParams {
  query: string;
  limit?: number;
  offset?: number;
}

class SearchAPI {
  private baseUrl: string;
  private cache: Map<string, SearchResponse> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl = '/src/data.json';
  }

  /**
   * Search for results based on query
   */
  async search(
    params: SearchParams,
    signal?: AbortSignal
  ): Promise<SearchResponse> {
    const { query, limit = 10, offset = 0 } = params;
    const cacheKey = `${query}-${limit}-${offset}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.took < this.cacheTimeout) {
      return cached;
    }

    const startTime = performance.now();

    try {
      // Fetch data from JSON file
      const response = await fetch(this.baseUrl, {
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allResults = data.searchResults as SearchResult[];

      // Filter results based on query
      const filteredResults = this.filterResults(allResults, query);

      // Sort by relevance
      const sortedResults = this.sortResults(filteredResults, query);

      // Apply pagination
      const paginatedResults = sortedResults.slice(offset, offset + limit);

      const searchResponse: SearchResponse = {
        results: paginatedResults,
        total: filteredResults.length,
        query,
        took: performance.now() - startTime,
      };

      // Cache the result
      this.cache.set(cacheKey, searchResponse);

      return searchResponse;
    } catch (error) {
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }
      throw error;
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(query: string, signal?: AbortSignal): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const response = await fetch(this.baseUrl, {
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allResults = data.searchResults as SearchResult[];

      // Extract unique suggestions from titles and categories
      const suggestions = new Set<string>();

      allResults.forEach(result => {
        if (result.title.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(result.title);
        }
        if (result.category.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(result.category);
        }
        result.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(tag);
          }
        });
      });

      return Array.from(suggestions).slice(0, 5);
    } catch (error) {
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }
      throw error;
    }
  }

  /**
   * Get trending searches or popular categories
   */
  async getTrending(signal?: AbortSignal): Promise<string[]> {
    try {
      const response = await fetch(this.baseUrl, {
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allResults = data.searchResults as SearchResult[];

      // Get most common categories
      const categoryCount = new Map<string, number>();
      allResults.forEach(result => {
        categoryCount.set(
          result.category,
          (categoryCount.get(result.category) || 0) + 1
        );
      });

      return Array.from(categoryCount.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category]) => category);
    } catch (error) {
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Filter results based on search query
   */
  private filterResults(
    results: SearchResult[],
    query: string
  ): SearchResult[] {
    const queryLower = query.toLowerCase();

    return results.filter(result => {
      const searchText =
        `${result.title} ${result.description} ${result.category} ${result.tags.join(' ')} ${result.author}`.toLowerCase();
      return searchText.includes(queryLower);
    });
  }

  /**
   * Sort results by relevance
   */
  private sortResults(results: SearchResult[], query: string): SearchResult[] {
    const queryLower = query.toLowerCase();

    return results.sort((a, b) => {
      // Exact title matches first
      const aTitleMatch = a.title.toLowerCase().includes(queryLower);
      const bTitleMatch = b.title.toLowerCase().includes(queryLower);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      // Then by category relevance
      const aCategoryMatch = a.category.toLowerCase().includes(queryLower);
      const bCategoryMatch = b.category.toLowerCase().includes(queryLower);

      if (aCategoryMatch && !bCategoryMatch) return -1;
      if (!aCategoryMatch && bCategoryMatch) return 1;

      // Finally by date (newer first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }
}

// Export singleton instance
export const searchAPI = new SearchAPI();
export type { SearchResponse, SearchParams };
