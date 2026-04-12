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
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
      >
        <svg
          className="h-4 w-4"
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

      <article className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white select-none">
            {thought.author_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {thought.author_name}
            </span>
            <div className="flex items-center gap-2">
              <RelativeTime date={thought.created_at} />
              <span className="text-gray-300 dark:text-gray-700">&middot;</span>
              <CountdownTimer createdAt={thought.created_at} />
            </div>
          </div>
        </div>

        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {thought.content}
        </p>
      </article>

      <CommentSection thoughtId={thought.id} initialComments={comments} />
    </div>
  );
}
