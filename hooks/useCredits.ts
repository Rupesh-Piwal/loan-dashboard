import { useEffect, useState } from "react";

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/user/credits")
      .then(res => res.json())
      .then(data => setCredits(data?.credits ?? 0))
      .catch(err => console.error("Error fetching credits:", err));
  }, []);

  return credits;
}
