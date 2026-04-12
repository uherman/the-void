"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { MAX_DISPLAY_NAME_LENGTH } from "@/lib/constants";

export function Header() {
  const { displayName, isLoaded, setName } = useUser();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = input.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    await setName(trimmed);
    setSaving(false);
    setEditing(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-2xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-medium tracking-widest uppercase text-white/50 hover:text-white/80 transition-colors"
        >
          void
        </Link>

        <div className="flex items-center gap-2">
          {isLoaded && !editing && (
            <button
              onClick={() => {
                setInput(displayName === "Anonymous" ? "" : displayName);
                setEditing(true);
              }}
              className="px-2 py-1 text-xs text-white/40 hover:text-white/70 transition-colors"
              title="Change name"
            >
              {displayName}
            </button>
          )}

          {editing && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_DISPLAY_NAME_LENGTH}
                autoFocus
                onBlur={() => {
                  if (!saving) setEditing(false);
                }}
                className="w-24 bg-void-surface border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white/80 focus:outline-none focus:border-white/20 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || saving}
                onMouseDown={(e) => e.preventDefault()}
                className="px-2.5 py-1 text-xs text-void-accent bg-void-surface rounded-lg hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
