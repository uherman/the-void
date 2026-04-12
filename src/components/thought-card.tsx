"use client";

import Link from "next/link";
import { ThoughtWithMeta } from "@/lib/types";
import { RelativeTime } from "./relative-time";
import { CountdownTimer } from "./countdown-timer";

export function ThoughtCard({ thought }: { thought: ThoughtWithMeta }) {
  return (
    <Link href={`/thought/${thought.id}`}>
      <article className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white select-none">
            {thought.author_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {thought.author_name}
            </span>
            <span className="text-gray-300 dark:text-gray-700">&middot;</span>
            <RelativeTime date={thought.created_at} />
          </div>
        </div>

        <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {thought.content}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
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
      </article>
    </Link>
  );
}
