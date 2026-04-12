"use client";

import { useState, useRef } from "react";
import { useUser } from "@/lib/user-context";
import { createThought } from "@/actions/thoughts";
import { MAX_THOUGHT_LENGTH } from "@/lib/constants";

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
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 focus-within:border-blue-300 dark:focus-within:border-blue-700 transition-colors">
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
          className="w-full resize-none bg-transparent text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none leading-relaxed"
        />

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs tabular-nums ${
                isOverLimit
                  ? "text-red-500"
                  : charCount > MAX_THOUGHT_LENGTH * 0.9
                    ? "text-amber-500"
                    : "text-gray-400 dark:text-gray-500"
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
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-600 text-right">
        Press <kbd className="font-mono">Cmd+Enter</kbd> to post
      </p>
    </form>
  );
}
