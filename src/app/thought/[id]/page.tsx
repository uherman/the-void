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

function TitleBarButtons() {
  return (
    <div className="flex gap-[3px] ml-auto">
      <span className="win-titlebar-btn">_</span>
      <span className="win-titlebar-btn">&#9633;</span>
      <span className="win-titlebar-btn">&times;</span>
    </div>
  );
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
        className="inline-flex items-center gap-1.5 win-button px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 mb-4 font-pixel"
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

      <article className="win-panel overflow-hidden mb-6">
        <div className="win-titlebar">
          <div className="h-6 w-6 rounded-sm bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white select-none">
            {thought.author_name.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1">{thought.author_name}</span>
          <TitleBarButtons />
        </div>
        <div className="p-4">
          <div className="win-inset p-4 mb-3">
            <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {thought.content}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <RelativeTime date={thought.created_at} />
            <span className="text-gray-300 dark:text-gray-600">&middot;</span>
            <CountdownTimer createdAt={thought.created_at} />
          </div>
        </div>
      </article>

      <div className="win-panel overflow-hidden">
        <div className="win-titlebar">
          <span>Comments</span>
          <TitleBarButtons />
        </div>
        <div className="p-4">
          <CommentSection thoughtId={thought.id} initialComments={comments} />
        </div>
      </div>
    </div>
  );
}
