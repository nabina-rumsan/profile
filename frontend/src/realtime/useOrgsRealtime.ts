"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { Org } from "@/types/org";
import { ORG_KEYS } from "@/queries/orgs";

export function useOrgsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("orgs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orgs" },
        (payload) => {
          // INSERT
          if (payload.eventType === "INSERT") {
            queryClient.setQueryData<Org[]>(ORG_KEYS.orgs, (old = []) => [payload.new as Org, ...old]);
          }
          // UPDATE
          if (payload.eventType === "UPDATE") {
            queryClient.setQueryData<Org[]>(ORG_KEYS.orgs, (old = []) =>
              old.map((org) => (org.id === (payload.new as Org).id ? (payload.new as Org) : org))
            );
            queryClient.setQueryData(ORG_KEYS.org(payload.new.id), payload.new);
            queryClient.invalidateQueries({ queryKey: ORG_KEYS.org(payload.new.id) });
          }
          // DELETE
          if (payload.eventType === "DELETE") {
            queryClient.setQueryData<Org[]>(ORG_KEYS.orgs, (old = []) =>
              old.filter((org) => org.id !== (payload.old as Org).id)
            );
            queryClient.removeQueries({ queryKey: ORG_KEYS.org(payload.old.id) });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
