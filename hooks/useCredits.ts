import { useEffect, useState, useCallback } from "react";

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/user/credits");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCredits(data?.credits ?? 0);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setCredits(0); // Fallback to 0 on failure
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return { credits, fetchCredits };
}
