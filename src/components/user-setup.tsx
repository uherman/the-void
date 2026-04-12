"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/lib/user-context";
import { MAX_DISPLAY_NAME_LENGTH } from "@/lib/constants";

export function UserSetup() {
  const { isNewUser, setName, dismissNewUser } = useUser();
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    await setName(trimmed);
    setSaving(false);
  };

  return (
    <AnimatePresence>
      {isNewUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25 }}
            className="mx-4 w-full max-w-sm rounded-lg border border-white/[0.06] bg-void-surface p-6"
          >
            <h2 className="text-base font-medium text-white/90 mb-1">
              Enter the void
            </h2>
            <p className="text-sm text-white/30 mb-5">
              Choose a name. You can change it later.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Your name"
                maxLength={MAX_DISPLAY_NAME_LENGTH}
                autoFocus
                className="w-full bg-transparent border-b border-white/10 px-1 py-2 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-void-accent transition-colors"
              />

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={dismissNewUser}
                  className="flex-1 py-2 text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || saving}
                  className="flex-1 py-2 text-sm font-medium text-black bg-white/90 rounded hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "..." : "Continue"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
