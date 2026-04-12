"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CommentWithAuthor } from "@/lib/types";
import { RelativeTime } from "./relative-time";
import { CommentComposer } from "./comment-composer";
import { useRealtimeComments } from "@/hooks/use-realtime-comments";

export function CommentSection({
  thoughtId,
  initialComments,
}: {
  thoughtId: string;
  initialComments: CommentWithAuthor[];
}) {
  const [comments, setComments] =
    useState<CommentWithAuthor[]>(initialComments);

  const handleNewComment = useCallback((comment: CommentWithAuthor) => {
    setComments((prev) => {
      if (prev.some((c) => c.id === comment.id)) return prev;
      return [...prev, comment];
    });
  }, []);

  useRealtimeComments(thoughtId, handleNewComment);

  return (
    <div>
      <h3 className="text-xs text-white/25 mb-4">
        {comments.length} {comments.length === 1 ? "reply" : "replies"}
      </h3>

      {comments.length === 0 && (
        <p className="text-sm text-white/15 py-6 text-center">
          Nothing here yet.
        </p>
      )}

      <div className="space-y-1">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="py-3 border-t border-white/[0.04]">
                <p className="text-sm text-white/60 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/20">
                  <span>{comment.author_name}</span>
                  <span>&middot;</span>
                  <RelativeTime date={comment.created_at} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CommentComposer thoughtId={thoughtId} />
    </div>
  );
}
