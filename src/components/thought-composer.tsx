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
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="rounded-xl border border-white/[0.06] bg-void-surface p-4 has-[:focus]:border-white/[0.12] transition-colors">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Share a thought with the void..."
          rows={3}
          className="w-full resize-none bg-transparent text-sm text-white/80 placeholder-white/20 focus:outline-none leading-relaxed"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] tabular-nums ${
                isOverLimit
                  ? "text-red-500"
                  : charCount > MAX_THOUGHT_LENGTH * 0.9
                    ? "text-amber-500"
                    : "text-white/20"
              }`}
            >
              {charCount}/{MAX_THOUGHT_LENGTH}
            </span>
            {error && (
              <span className="text-[11px] text-red-500">{error}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-1.5 text-xs font-medium text-black bg-white/90 rounded-lg hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? "..." : "Release"}
          </button>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-white/15 text-right">
        Cmd+Enter to release
      </p>
    </form>
  );
}
