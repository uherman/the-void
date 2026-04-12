"use client";

import { useEffect, useState } from "react";
import { THOUGHT_TTL_MS } from "@/lib/constants";

function getTimeRemaining(createdAt: string): number {
  const expiresAt = new Date(createdAt).getTime() + THOUGHT_TTL_MS;
  return Math.max(0, expiresAt - Date.now());
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "gone";

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
      className={`inline-flex items-center gap-1 text-[11px] ${
        isUrgent
          ? "text-red-500/70"
          : isWarning
            ? "text-amber-500/50"
            : "text-white/20"
      }`}
      title={`Expires ${new Date(new Date(createdAt).getTime() + THOUGHT_TTL_MS).toLocaleString()}`}
      suppressHydrationWarning
    >
      {text}
    </span>
  );
}
