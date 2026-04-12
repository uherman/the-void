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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mx-4 w-full max-w-sm win-panel overflow-hidden"
          >
            <div className="win-titlebar">
              <span className="flex-1">Welcome</span>
              <div className="flex gap-[3px]">
                <span className="win-titlebar-btn">&times;</span>
              </div>
            </div>

            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 font-pixel">
                Welcome to Thoughts
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Pick a name to get started. You can change it later.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="win-inset">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Your name"
                    maxLength={MAX_DISPLAY_NAME_LENGTH}
                    autoFocus
                    className="w-full bg-transparent px-2 py-1.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={dismissNewUser}
                    className="flex-1 win-button px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || saving}
                    className="flex-1 win-button-primary px-3 py-2 text-sm font-bold"
                  >
                    {saving ? "Saving..." : "Continue"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
