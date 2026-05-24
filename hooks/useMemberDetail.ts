import { useState, useEffect, useCallback } from "react";
import { PrimaryFamilyDTO } from "../types/family";
// import { API_ENDPOINTS } from "../constants/api";
import membersRaw from "../assets/data/members_fallback.json";

interface UseMemberDetailResult {
  member: PrimaryFamilyDTO | null;
  parent: PrimaryFamilyDTO | null;
  children: PrimaryFamilyDTO[];
  siblings: PrimaryFamilyDTO[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Map a raw member object to PrimaryFamilyDTO
const mapMember = (m: any): PrimaryFamilyDTO => {
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
};

export const useMemberDetail = (memberId: number): UseMemberDetailResult => {
  const [member, setMember] = useState<PrimaryFamilyDTO | null>(null);
  const [parent, setParent] = useState<PrimaryFamilyDTO | null>(null);
  const [children, setChildren] = useState<PrimaryFamilyDTO[]>([]);
  const [siblings, setSiblings] = useState<PrimaryFamilyDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMemberDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate a small network delay for smooth UI transition (optional)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const allMembers = membersRaw as any[];
      const rawMember = allMembers.find((m) => m.id === memberId);
      
      if (!rawMember) {
        throw new Error("Member not found");
      }
      
      const memberData = mapMember(rawMember);
      setMember(memberData);

      // Fetch parent if exists
      if (memberData.parentId) {
        const rawParent = allMembers.find((m) => m.id === memberData.parentId);
        if (rawParent) {
          setParent(mapMember(rawParent));
        } else {
          setParent(null);
        }
      } else {
        setParent(null);
      }

      // Fetch children if exists
      if (memberData.hasChildren) {
        const rawChildren = allMembers.filter((m) => m.parent_id === memberId);
        setChildren(rawChildren.map(mapMember));
      } else {
        setChildren([]);
      }

      // Fetch siblings (same parent, excluding self)
      if (memberData.parentId) {
        const rawSiblings = allMembers.filter(
          (m) => m.parent_id === memberData.parentId && m.id !== memberId
        );
        setSiblings(rawSiblings.map(mapMember));
      } else {
        setSiblings([]);
      }
    } catch (err) {
      console.error("Failed to fetch member detail", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMemberDetail();
  }, [fetchMemberDetail]);

  return { member, parent, children, siblings, loading, error, refetch: fetchMemberDetail };
};

/* ────────────────────────────────────────────────────────────────────────
 * COMMENTED OUT: Original server-fetch implementation
 * ────────────────────────────────────────────────────────────────────────
 *
 * export const useMemberDetail_ORIGINAL = (memberId: number): UseMemberDetailResult => {
 *   const [member, setMember] = useState<PrimaryFamilyDTO | null>(null);
 *   const [parent, setParent] = useState<PrimaryFamilyDTO | null>(null);
 *   const [children, setChildren] = useState<PrimaryFamilyDTO[]>([]);
 *   const [siblings, setSiblings] = useState<PrimaryFamilyDTO[]>([]);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState<Error | null>(null);
 * 
 *   const fetchMemberDetail = useCallback(async () => {
 *     try {
 *       setLoading(true);
 *       setError(null);
 * 
 *       // Fetch member details
 *       const memberRes = await fetch(API_ENDPOINTS.primaryFamilyById(memberId));
 *       if (!memberRes.ok) throw new Error("Member not found");
 *       const memberData: PrimaryFamilyDTO = await memberRes.json();
 *       setMember(memberData);
 * 
 *       // Fetch parent if exists
 *       if (memberData.parentId) {
 *         const parentRes = await fetch(
 *           API_ENDPOINTS.primaryFamilyById(memberData.parentId),
 *         );
 *         if (parentRes.ok) {
 *           setParent(await parentRes.json());
 *         }
 *       } else {
 *         setParent(null);
 *       }
 * 
 *       // Fetch children if exists
 *       if (memberData.hasChildren) {
 *         const childrenRes = await fetch(
 *           API_ENDPOINTS.primaryFamilyChildren(memberId),
 *         );
 *         if (childrenRes.ok) {
 *           setChildren(await childrenRes.json());
 *         }
 *       } else {
 *         setChildren([]);
 *       }
 * 
 *       // Fetch siblings
 *       const siblingsRes = await fetch(
 *         API_ENDPOINTS.primaryFamilySiblings(memberId),
 *       );
 *       if (siblingsRes.ok) {
 *         setSiblings(await siblingsRes.json());
 *       } else {
 *         setSiblings([]);
 *       }
 *     } catch (err) {
 *       console.error("Failed to fetch member detail", err);
 *       setError(err instanceof Error ? err : new Error("Unknown error"));
 *     } finally {
 *       setLoading(false);
 *     }
 *   }, [memberId]);
 * 
 *   useEffect(() => {
 *     fetchMemberDetail();
 *   }, [fetchMemberDetail]);
 * 
 *   return { member, parent, children, siblings, loading, error, refetch: fetchMemberDetail };
 * };
 * ──────────────────────────────────────────────────────────────────────── */
