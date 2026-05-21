import { useState, useEffect, useCallback } from "react";
import { PrimaryFamilyDTO } from "../types/family";
import { API_ENDPOINTS } from "../constants/api";

interface UseInfinitePrimaryFamiliesResult {
  data: PrimaryFamilyDTO[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  totalElements: number;
  loadMore: () => void;
  refresh: () => void;
}

export const useInfinitePrimaryFamilies = (
  searchQuery: string = "",
): UseInfinitePrimaryFamiliesResult => {
  const [data, setData] = useState<PrimaryFamilyDTO[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const fetchFamilies = useCallback(
    async (pageToFetch: number, isRefresh = false) => {
      try {
        if (isRefresh) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        let url = `${API_ENDPOINTS.primaryFamilies}?page=${pageToFetch}&size=10`;
        if (searchQuery && searchQuery.trim().length > 0) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
          }

          const result = await response.json();

          if (isRefresh) {
            setData(result.content);
          } else {
            setData((prev) => [...prev, ...result.content]);
          }

          setHasMore(!result.last);
          setTotalElements(result.totalElements || 0);
          setError(null);
        } catch (fetchErr: any) {
          clearTimeout(timeoutId);
          if (fetchErr.name === 'AbortError') {
            throw new Error("Timeout Error");
          }
          throw fetchErr;
        }
      } catch (err) {
        console.error("Failed to fetch primary families", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery],
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchFamilies(0, true);
  }, [fetchFamilies, searchQuery]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFamilies(nextPage);
    }
  }, [loadingMore, hasMore, loading, page, fetchFamilies]);

  const refresh = useCallback(() => {
    setPage(0);
    setHasMore(true);
    fetchFamilies(0, true);
  }, [fetchFamilies]);

  return {
    data,
    loading,
    loadingMore,
    hasMore,
    totalElements,
    error,
    loadMore,
    refresh,
  };
};
