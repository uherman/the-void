"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export function RelativeTime({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  const [text, setText] = useState(() =>
    formatDistanceToNow(new Date(date), { addSuffix: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setText(formatDistanceToNow(new Date(date), { addSuffix: true }));
    }, 30_000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <time
      dateTime={date}
      className={className ?? "text-[11px] text-white/20"}
      title={new Date(date).toLocaleString()}
      suppressHydrationWarning
    >
      {text}
    </time>
  );
}
