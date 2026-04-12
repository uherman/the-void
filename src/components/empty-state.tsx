export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-void-glow/20 to-transparent mb-6 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full bg-black border border-white/[0.06]" />
      </div>
      <p className="text-sm text-white/30">
        The void is empty.
      </p>
      <p className="mt-1 text-xs text-white/15">
        Be the first to send something into it.
      </p>
    </div>
  );
}
