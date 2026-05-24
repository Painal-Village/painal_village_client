import { useState, useEffect, useCallback, useMemo } from "react";
import { PrimaryFamilyDTO } from "../types/family";
// import { API_ENDPOINTS } from "../constants/api";

// Load all members from the local fallback JSON
import membersRaw from "../assets/data/members_fallback.json";

// Map the snake_case JSON to our PrimaryFamilyDTO shape once
const allMembers: PrimaryFamilyDTO[] = (membersRaw as any[]).map((m) => {
  // Find parent name from the same data
  const parent = m.parent_id
    ? (membersRaw as any[]).find((p: any) => p.id === m.parent_id)
    : null;
  return {
    id: m.id,
    parentId: m.parent_id,
    parentName: parent?.name ?? null,
    name: m.name,
    hindiName: m.hindi_name,
    birthYear: m.birth_year,
    profilePhoto: m.profile_photo
      ? m.profile_photo.startsWith("http")
        ? m.profile_photo
        : `https://pxytwvgrvlaycdnljjht.supabase.co/storage/v1/object/public/painal_village/${m.profile_photo}`
      : null,
    hasChildren: (membersRaw as any[]).some(
      (child: any) => child.parent_id === m.id
    ),
    lastUpdated: m.last_updated ?? "",
  };
});

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

const PAGE_SIZE = 10;

export const useInfinitePrimaryFamilies = (
  searchQuery: string = "",
): UseInfinitePrimaryFamiliesResult => {
  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return allMembers;
    }
    const q = searchQuery.trim().toLowerCase();
    return allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.hindiName.includes(q)
    );
  }, [searchQuery]);

  const [data, setData] = useState<PrimaryFamilyDTO[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Simulate paginated loading from local data
  const loadPage = useCallback(
    (pageToLoad: number, isRefresh = false) => {
      if (isRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const start = pageToLoad * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const pageData = filteredMembers.slice(start, end);
      const isLast = end >= filteredMembers.length;

      if (isRefresh) {
        setData(pageData);
      } else {
        setData((prev) => [...prev, ...pageData]);
      }

      setHasMore(!isLast);
      setLoading(false);
      setLoadingMore(false);
    },
    [filteredMembers],
  );

  // Reset when search changes
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    loadPage(0, true);
  }, [loadPage, searchQuery]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPage(nextPage);
    }
  }, [loadingMore, hasMore, loading, page, loadPage]);

  const refresh = useCallback(() => {
    setPage(0);
    setHasMore(true);
    loadPage(0, true);
  }, [loadPage]);

  return {
    data,
    loading,
    loadingMore,
    hasMore,
    totalElements: filteredMembers.length,
    error: null,
    loadMore,
    refresh,
  };
};

/* ────────────────────────────────────────────────────────────────────────
 * COMMENTED OUT: Original server-fetch implementation
 * ────────────────────────────────────────────────────────────────────────
 *
 * export const useInfinitePrimaryFamilies_ORIGINAL = (
 *   searchQuery: string = "",
 * ): UseInfinitePrimaryFamiliesResult => {
 *   const [data, setData] = useState<PrimaryFamilyDTO[]>([]);
 *   const [page, setPage] = useState(0);
 *   const [loading, setLoading] = useState(true);
 *   const [loadingMore, setLoadingMore] = useState(false);
 *   const [hasMore, setHasMore] = useState(true);
 *   const [totalElements, setTotalElements] = useState(0);
 *   const [error, setError] = useState<Error | null>(null);
 *
 *   const fetchFamilies = useCallback(
 *     async (pageToFetch: number, isRefresh = false) => {
 *       try {
 *         if (isRefresh) {
 *           setLoading(true);
 *         } else {
 *           setLoadingMore(true);
 *         }
 *
 *         let url = `${API_ENDPOINTS.primaryFamilies}?page=${pageToFetch}&size=10`;
 *         if (searchQuery && searchQuery.trim().length > 0) {
 *           url += `&search=${encodeURIComponent(searchQuery.trim())}`;
 *         }
 *
 *         const controller = new AbortController();
 *         const timeoutId = setTimeout(() => controller.abort(), 15000);
 *
 *         try {
 *           const response = await fetch(url, { signal: controller.signal });
 *           clearTimeout(timeoutId);
 *
 *           if (!response.ok) {
 *             throw new Error(`Error fetching data: ${response.statusText}`);
 *           }
 *
 *           const result = await response.json();
 *
 *           if (isRefresh) {
 *             setData(result.content);
 *           } else {
 *             setData((prev) => [...prev, ...result.content]);
 *           }
 *
 *           setHasMore(!result.last);
 *           setTotalElements(result.totalElements || 0);
 *           setError(null);
 *         } catch (fetchErr: any) {
 *           clearTimeout(timeoutId);
 *           if (fetchErr.name === 'AbortError') {
 *             throw new Error("Timeout Error");
 *           }
 *           throw fetchErr;
 *         }
 *       } catch (err) {
 *         console.error("Failed to fetch primary families", err);
 *         setError(err instanceof Error ? err : new Error("Unknown error"));
 *       } finally {
 *         setLoading(false);
 *         setLoadingMore(false);
 *       }
 *     },
 *     [searchQuery],
 *   );
 *
 *   useEffect(() => {
 *     setPage(0);
 *     setHasMore(true);
 *     fetchFamilies(0, true);
 *   }, [fetchFamilies, searchQuery]);
 *
 *   const loadMore = useCallback(() => {
 *     if (!loadingMore && hasMore && !loading) {
 *       const nextPage = page + 1;
 *       setPage(nextPage);
 *       fetchFamilies(nextPage);
 *     }
 *   }, [loadingMore, hasMore, loading, page, fetchFamilies]);
 *
 *   const refresh = useCallback(() => {
 *     setPage(0);
 *     setHasMore(true);
 *     fetchFamilies(0, true);
 *   }, [fetchFamilies]);
 *
 *   return {
 *     data,
 *     loading,
 *     loadingMore,
 *     hasMore,
 *     totalElements,
 *     error,
 *     loadMore,
 *     refresh,
 *   };
 * };
 * ──────────────────────────────────────────────────────────────────────── */
