"use client";

import { useState, useRef } from "react";
import { useUser } from "@/lib/user-context";
import { createThought } from "@/actions/thoughts";
import { MAX_THOUGHT_LENGTH } from "@/lib/constants";

function TitleBarButtons() {
  return (
    <div className="flex gap-[3px] ml-auto">
      <span className="win-titlebar-btn">_</span>
      <span className="win-titlebar-btn">&#9633;</span>
      <span className="win-titlebar-btn">&times;</span>
    </div>
  );
}

export function ThoughtComposer() {
  const { userId, isLoaded } = useUser();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_THOUGHT_LENGTH;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !userId) return;

    setSubmitting(true);
    setError(null);

    const result = await createThought(userId, content);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setContent("");
    setSubmitting(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (canSubmit) {
        handleSubmit(e);
      }
    }
  };

  if (!isLoaded) return null;

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="win-panel overflow-hidden">
        <div className="win-titlebar">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>New Thought</span>
          <TitleBarButtons />
        </div>

        <div className="p-3">
          <div className="win-inset p-2 mb-3">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs tabular-nums ${
                  isOverLimit
                    ? "text-red-500"
                    : charCount > MAX_THOUGHT_LENGTH * 0.9
                      ? "text-amber-500"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {charCount}/{MAX_THOUGHT_LENGTH}
              </span>
              {error && (
                <span className="text-xs text-red-500">{error}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="win-button-primary px-4 py-1.5 text-xs font-bold"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] text-white/50 text-right font-pixel">
        Press Cmd+Enter to post
      </p>
    </form>
  );
}
