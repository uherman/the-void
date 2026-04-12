"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { ThemeToggle } from "./theme-toggle";
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
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Thoughts
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isLoaded && !editing && (
            <button
              onClick={() => {
                setInput(displayName === "Anonymous" ? "" : displayName);
                setEditing(true);
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors cursor-pointer"
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
              className="flex items-center gap-1.5"
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
                className="w-28 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || saving}
                onMouseDown={(e) => e.preventDefault()}
                className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Save
              </button>
            </form>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
