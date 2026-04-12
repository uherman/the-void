"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  MAX_COMMENT_LENGTH,
  COMMENT_COOLDOWN_SECONDS,
} from "@/lib/constants";
import { Comment } from "@/lib/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createComment(
  userId: string,
  thoughtId: string,
  content: string
): Promise<{ data?: Comment; error?: string }> {
  if (!UUID_REGEX.test(userId) || !UUID_REGEX.test(thoughtId)) {
    return { error: "Invalid ID" };
  }

  const trimmed = content.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_COMMENT_LENGTH) {
    return { error: `Comment must be 1-${MAX_COMMENT_LENGTH} characters` };
  }

  const supabase = getSupabaseServerClient();

  // Verify user and thought exist
  const [{ data: user }, { data: thought }] = await Promise.all([
    supabase.from("users").select("id").eq("id", userId).single(),
    supabase.from("thoughts").select("id").eq("id", thoughtId).single(),
  ]);

  if (!user) return { error: "User not found" };
  if (!thought) return { error: "Thought not found" };

  // Rate limit
  const { data: lastComment } = await supabase
    .from("comments")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (lastComment) {
    const elapsed =
      (Date.now() - new Date(lastComment.created_at).getTime()) / 1000;
    if (elapsed < COMMENT_COOLDOWN_SECONDS) {
      const wait = Math.ceil(COMMENT_COOLDOWN_SECONDS - elapsed);
      return { error: `Please wait ${wait}s before commenting again` };
    }
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ thought_id: thoughtId, user_id: userId, content: trimmed })
    .select()
    .single();

  if (error) return { error: "Failed to create comment" };
  return { data: data as Comment };
}
