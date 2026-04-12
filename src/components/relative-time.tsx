"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export function RelativeTime({ date }: { date: string }) {
  const [text, setText] = useState(() =>
    formatDistanceToNow(new Date(date), { addSuffix: true })
  );

  useEffect(() => {
    const update = () =>
      setText(formatDistanceToNow(new Date(date), { addSuffix: true }));

    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <time
      dateTime={date}
      title={new Date(date).toLocaleString()}
      className="text-xs text-gray-400 dark:text-gray-500"
    >
      {text}
    </time>
  );
}
