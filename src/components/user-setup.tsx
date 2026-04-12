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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mx-4 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Welcome to Thoughts
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Pick a name to get started. You can change it later.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Your name"
                maxLength={MAX_DISPLAY_NAME_LENGTH}
                autoFocus
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={dismissNewUser}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || saving}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {saving ? "Saving..." : "Continue"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
