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
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <div className="flex-1 win-inset">
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
            placeholder="Write a comment..."
            maxLength={MAX_COMMENT_LENGTH + 10}
            className="w-full bg-transparent px-2 py-1.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="win-button-primary px-4 py-1.5 text-sm font-bold"
        >
          {submitting ? "..." : "Reply"}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </form>
  );
}
