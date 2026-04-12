"use client";

import Link from "next/link";
import { ThoughtWithMeta } from "@/lib/types";
import { RelativeTime } from "./relative-time";
import { CountdownTimer } from "./countdown-timer";

export function ThoughtCard({ thought }: { thought: ThoughtWithMeta }) {
  return (
    <Link href={`/thought/${thought.id}`}>
      <article className="group rounded-lg border border-white/[0.06] bg-void-surface p-4 hover:border-white/[0.1] hover:bg-void-edge transition-all duration-300 cursor-pointer">
        <p className="text-[15px] leading-relaxed text-white/75 whitespace-pre-wrap break-words group-hover:text-white/85 transition-colors">
          {thought.content}
        </p>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-white/25">
          <span>{thought.author_name}</span>
          <span>&middot;</span>
          <RelativeTime date={thought.created_at} />
          <span className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {thought.comment_count}
            </span>
            <CountdownTimer createdAt={thought.created_at} />
          </span>
        </div>
      </article>
    </Link>
  );
}
