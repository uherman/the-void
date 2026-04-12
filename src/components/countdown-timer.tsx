"use client";

import { useEffect, useState } from "react";
import { THOUGHT_TTL_MS } from "@/lib/constants";

function getTimeRemaining(createdAt: string): number {
  const expiresAt = new Date(createdAt).getTime() + THOUGHT_TTL_MS;
  return Math.max(0, expiresAt - Date.now());
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "expired";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return "<1m";
}

export function CountdownTimer({ createdAt }: { createdAt: string }) {
  const [remaining, setRemaining] = useState(() =>
    getTimeRemaining(createdAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getTimeRemaining(createdAt));
    }, 60_000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const text = formatRemaining(remaining);
  const isUrgent = remaining > 0 && remaining < 60 * 60 * 1000;
  const isWarning = remaining > 0 && remaining < 3 * 60 * 60 * 1000;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        isUrgent
          ? "text-red-500 dark:text-red-400"
          : isWarning
            ? "text-amber-500 dark:text-amber-400"
            : "text-gray-400 dark:text-gray-500"
      }`}
      title={`Expires ${new Date(new Date(createdAt).getTime() + THOUGHT_TTL_MS).toLocaleString()}`}
      suppressHydrationWarning
    >
      <svg
        className="h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 7v5l3 3" />
      </svg>
      {text}
    </span>
  );
}
