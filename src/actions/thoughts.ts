"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  MAX_THOUGHT_LENGTH,
  THOUGHT_COOLDOWN_SECONDS,
} from "@/lib/constants";
import { Thought } from "@/lib/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createThought(
  userId: string,
  content: string
): Promise<{ data?: Thought; error?: string }> {
  if (!UUID_REGEX.test(userId)) {
    return { error: "Invalid user ID" };
  }

  const trimmed = content.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_THOUGHT_LENGTH) {
    return { error: `Thought must be 1-${MAX_THOUGHT_LENGTH} characters` };
  }

  const supabase = getSupabaseServerClient();

  // Verify user exists
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (!user) {
    return { error: "User not found" };
  }

  // Rate limit: check last thought by this user
  const { data: lastThought } = await supabase
    .from("thoughts")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (lastThought) {
    const elapsed =
      (Date.now() - new Date(lastThought.created_at).getTime()) / 1000;
    if (elapsed < THOUGHT_COOLDOWN_SECONDS) {
      const wait = Math.ceil(THOUGHT_COOLDOWN_SECONDS - elapsed);
      return { error: `Please wait ${wait}s before posting again` };
    }
  }

  const { data, error } = await supabase
    .from("thoughts")
    .insert({ user_id: userId, content: trimmed })
    .select()
    .single();

  if (error) {
    return { error: "Failed to create thought" };
  }

  return { data: data as Thought };
}
