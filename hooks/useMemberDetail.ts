import { useState, useEffect, useCallback } from "react";
import { PrimaryFamilyDTO } from "../types/family";
import { API_ENDPOINTS } from "../constants/api";

interface UseMemberDetailResult {
  member: PrimaryFamilyDTO | null;
  parent: PrimaryFamilyDTO | null;
  children: PrimaryFamilyDTO[];
  siblings: PrimaryFamilyDTO[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

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

      // Fetch member details
      const memberRes = await fetch(API_ENDPOINTS.primaryFamilyById(memberId));
      if (!memberRes.ok) throw new Error("Member not found");
      const memberData: PrimaryFamilyDTO = await memberRes.json();
      setMember(memberData);

      // Fetch parent if exists
      if (memberData.parentId) {
        const parentRes = await fetch(
          API_ENDPOINTS.primaryFamilyById(memberData.parentId),
        );
        if (parentRes.ok) {
          setParent(await parentRes.json());
        }
      } else {
        setParent(null);
      }

      // Fetch children if exists
      if (memberData.hasChildren) {
        const childrenRes = await fetch(
          API_ENDPOINTS.primaryFamilyChildren(memberId),
        );
        if (childrenRes.ok) {
          setChildren(await childrenRes.json());
        }
      } else {
        setChildren([]);
      }

      // Fetch siblings
      const siblingsRes = await fetch(
        API_ENDPOINTS.primaryFamilySiblings(memberId),
      );
      if (siblingsRes.ok) {
        setSiblings(await siblingsRes.json());
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
