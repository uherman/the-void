"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ThoughtWithMeta } from "@/lib/types";

export function useRealtimeThoughts(
  onNewThought: (thought: ThoughtWithMeta) => void
) {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel("thoughts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "thoughts" },
        async (payload) => {
          const { data } = await supabase
            .from("thoughts_with_meta")
            .select("*")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            onNewThought(data as ThoughtWithMeta);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewThought]);
}
