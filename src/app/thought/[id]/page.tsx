import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ThoughtWithMeta, CommentWithAuthor } from "@/lib/types";
import { CommentSection } from "@/components/comment-section";
import { RelativeTime } from "@/components/relative-time";
import { CountdownTimer } from "@/components/countdown-timer";

export const dynamic = "force-dynamic";

async function getThought(id: string): Promise<ThoughtWithMeta | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("thoughts_with_meta")
    .select("*")
    .eq("id", id)
    .single();

  return data as ThoughtWithMeta | null;
}

async function getComments(thoughtId: string): Promise<CommentWithAuthor[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("comments_with_author")
    .select("*")
    .eq("thought_id", thoughtId)
    .order("created_at", { ascending: true });

  return (data ?? []) as CommentWithAuthor[];
}

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [thought, comments] = await Promise.all([
    getThought(id),
    getComments(id),
  ]);

  if (!thought) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </Link>

      <article className="rounded-lg border border-white/[0.06] bg-void-surface p-5 mb-6">
        <p className="text-base leading-relaxed text-white/80 whitespace-pre-wrap break-words">
          {thought.content}
        </p>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-white/25">
          <span>{thought.author_name}</span>
          <span>&middot;</span>
          <RelativeTime date={thought.created_at} />
          <span>&middot;</span>
          <CountdownTimer createdAt={thought.created_at} />
        </div>
      </article>

      <div className="rounded-lg border border-white/[0.06] bg-void-surface p-5">
        <CommentSection thoughtId={thought.id} initialComments={comments} />
      </div>
    </div>
  );
}
