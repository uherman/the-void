"use client";

import Link from "next/link";
import { ThoughtWithMeta } from "@/lib/types";
import { RelativeTime } from "./relative-time";
import { CountdownTimer } from "./countdown-timer";

function TitleBarButtons() {
  return (
    <div className="flex gap-[3px] ml-1">
      <span className="win-titlebar-btn">_</span>
      <span className="win-titlebar-btn">&#9633;</span>
      <span className="win-titlebar-btn">&times;</span>
    </div>
  );
}

export function ThoughtCard({ thought }: { thought: ThoughtWithMeta }) {
  return (
    <Link href={`/thought/${thought.id}`}>
      <article className="win-panel overflow-hidden hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer">
        <div className="win-titlebar">
          <div className="h-5 w-5 rounded-sm bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white select-none">
            {thought.author_name.charAt(0).toUpperCase()}
          </div>
          <span className="truncate flex-1 text-[13px]">
            {thought.author_name}
          </span>
          <RelativeTime
            date={thought.created_at}
            className="text-[11px] text-white/70"
          />
          <TitleBarButtons />
        </div>

        <div className="p-3">
          <div className="win-inset p-3">
            <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {thought.content}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <svg
                className="h-3.5 w-3.5"
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
              <span>
                {thought.comment_count}
                {thought.comment_count === 1 ? " comment" : " comments"}
              </span>
            </div>
            <CountdownTimer createdAt={thought.created_at} />
          </div>
        </div>
      </article>
    </Link>
  );
}
