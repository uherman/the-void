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
      <h3 className="text-sm font-pixel text-gray-500 dark:text-gray-400 mb-3">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </h3>

      {comments.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
          No comments yet. Be the first to reply.
        </p>
      )}

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="win-inset p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-5 w-5 rounded-sm bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-[8px] font-bold text-white select-none">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {comment.author_name}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">
                    &middot;
                  </span>
                  <RelativeTime date={comment.created_at} />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words pl-7 font-mono">
                  {comment.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CommentComposer thoughtId={thoughtId} />
    </div>
  );
}
