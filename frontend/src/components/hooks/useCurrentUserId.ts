import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function useCurrentUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserId() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setUserId(data.user.id);
      } else {
        setUserId(null);
      }
    }
    fetchUserId();
  }, []);

  return userId;
}
