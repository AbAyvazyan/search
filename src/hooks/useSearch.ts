import { useState, useEffect, useRef, useCallback } from 'react';
import { logger } from '../services/logger';
import { searchAPI } from '../services/api';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  author: string;
  date: string;
}

export interface SearchState {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  query: string;
}

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, minQueryLength = 1 } = options;

  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    query: '',
  });

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search API function that uses the API service
  const performAPISearch = useCallback(
    async (query: string, signal: AbortSignal): Promise<SearchResult[]> => {
      // Determine limit based on query length
      let limit = 10;
      if (query.length < 3) {
        limit = 3;
      } else if (query.length < 6) {
        limit = 6;
      }

      // Call the API service
      const response = await searchAPI.search({ query, limit }, signal);
      return response.results;
    },
    []
  );

  const performSearch = useCallback(
    async (query: string) => {
      const startTime = performance.now();
      logger.searchStarted(query);

      if (query.length < minQueryLength) {
        setState(prev => ({
          ...prev,
          results: [],
          loading: false,
          error: null,
          query,
        }));
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Increment request ID to track the latest request
      const currentRequestId = ++requestIdRef.current;

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        query,
      }));

      try {
        const results = await performAPISearch(query, abortController.signal);

        // Only update state if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          const duration = performance.now() - startTime;
          logger.searchCompleted(query, results.length, duration);

          setState(prev => ({
            ...prev,
            results,
            loading: false,
            error: null,
          }));
        }
      } catch (error) {
        // Only update state if this is still the latest request and it wasn't cancelled
        if (
          currentRequestId === requestIdRef.current &&
          !abortController.signal.aborted
        ) {
          const errorMessage =
            error instanceof Error ? error.message : 'An error occurred';
          logger.searchError(query, new Error(errorMessage));

          setState(prev => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        }
      }
    },
    [minQueryLength, performAPISearch]
  );

  const setQuery = useCallback(
    (query: string) => {
      setState(prev => ({ ...prev, query }));

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout for debounced search
      debounceTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, debounceMs);
    },
    [debounceMs, performSearch]
  );

  const setQueryImmediate = useCallback(
    (query: string) => {
      setState(prev => ({ ...prev, query }));

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Trigger search immediately (no debounce)
      performSearch(query);
    },
    [performSearch]
  );

  const clearResults = useCallback(() => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setState({
      results: [],
      loading: false,
      error: null,
      query: '',
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    setQuery,
    setQueryImmediate,
    clearResults,
  };
}
