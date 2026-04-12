"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { MAX_DISPLAY_NAME_LENGTH } from "@/lib/constants";
import { User } from "@/lib/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function ensureUser(userId: string): Promise<User | null> {
  if (!UUID_REGEX.test(userId)) return null;

  const supabase = getSupabaseServerClient();

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (existing) return existing as User;

  const { data, error } = await supabase
    .from("users")
    .insert({ id: userId })
    .select()
    .single();

  if (error) return null;
  return data as User;
}

export async function updateDisplayName(
  userId: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  if (!UUID_REGEX.test(userId)) {
    return { success: false, error: "Invalid user ID" };
  }

  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      success: false,
      error: `Name must be 1-${MAX_DISPLAY_NAME_LENGTH} characters`,
    };
  }

  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("users")
    .update({ display_name: trimmed })
    .eq("id", userId);

  if (error) return { success: false, error: "Failed to update name" };
  return { success: true };
}
