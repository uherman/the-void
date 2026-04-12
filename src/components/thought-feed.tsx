"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThoughtWithMeta } from "@/lib/types";
import { ThoughtCard } from "./thought-card";
import { EmptyState } from "./empty-state";
import { useRealtimeThoughts } from "@/hooks/use-realtime-thoughts";

export function ThoughtFeed({
  initialThoughts,
}: {
  initialThoughts: ThoughtWithMeta[];
}) {
  const [thoughts, setThoughts] = useState<ThoughtWithMeta[]>(initialThoughts);

  const handleNewThought = useCallback((thought: ThoughtWithMeta) => {
    setThoughts((prev) => {
      if (prev.some((t) => t.id === thought.id)) return prev;
      return [thought, ...prev];
    });
  }, []);

  useRealtimeThoughts(handleNewThought);

  if (thoughts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {thoughts.map((thought) => (
          <motion.div
            key={thought.id}
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            layout
          >
            <ThoughtCard thought={thought} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
