"use client";

import { useState } from "react";
import { useUser } from "@/lib/user-context";
import { createComment } from "@/actions/comments";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";

export function CommentComposer({ thoughtId }: { thoughtId: string }) {
  const { userId, isLoaded } = useUser();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_COMMENT_LENGTH;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !userId) return;

    setSubmitting(true);
    setError(null);

    const result = await createComment(userId, thoughtId, content);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setContent("");
    setSubmitting(false);
  };

  if (!isLoaded) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-white/[0.04]">
      <div className="flex gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && canSubmit) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Reply into the void..."
          maxLength={MAX_COMMENT_LENGTH + 10}
          className="flex-1 bg-transparent border-b border-white/10 px-1 py-1.5 text-sm text-white/70 placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-3 py-1.5 text-xs font-medium text-black bg-white/90 rounded hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? "..." : "Reply"}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-[11px] text-red-500">{error}</p>
      )}
    </form>
  );
}
