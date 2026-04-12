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
    <header className="sticky top-0 z-40 win-panel">
      <div className="mx-auto flex h-12 max-w-2xl items-center justify-between px-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="h-7 w-7 flex items-center justify-center bg-blue-600 text-white"
            style={{
              boxShadow:
                "inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.3)",
            }}
          >
            <svg
              className="h-4 w-4"
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
          <span className="font-pixel text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            Thoughts
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isLoaded && !editing && (
            <button
              onClick={() => {
                setInput(displayName === "Anonymous" ? "" : displayName);
                setEditing(true);
              }}
              className="win-button px-2 py-1 text-xs text-gray-700 dark:text-gray-300"
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
              <div className="win-inset">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_DISPLAY_NAME_LENGTH}
                  autoFocus
                  onBlur={() => {
                    if (!saving) setEditing(false);
                  }}
                  className="w-24 bg-transparent px-1.5 py-0.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || saving}
                onMouseDown={(e) => e.preventDefault()}
                className="win-button-primary px-2 py-0.5 text-xs font-bold"
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
