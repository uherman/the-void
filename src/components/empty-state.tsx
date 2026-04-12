export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="win-panel p-4 mb-4">
        <svg
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </div>
      <h3 className="text-sm font-pixel text-white dark:text-gray-300">
        No thoughts yet
      </h3>
      <p className="mt-1 text-sm text-white/70 dark:text-gray-500">
        Be the first to share what&apos;s on your mind.
      </p>
    </div>
  );
}
