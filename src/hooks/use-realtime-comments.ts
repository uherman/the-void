"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { CommentWithAuthor } from "@/lib/types";

export function useRealtimeComments(
  thoughtId: string,
  onNewComment: (comment: CommentWithAuthor) => void
) {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`comments-${thoughtId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `thought_id=eq.${thoughtId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("comments_with_author")
            .select("*")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            onNewComment(data as CommentWithAuthor);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [thoughtId, onNewComment]);
}
