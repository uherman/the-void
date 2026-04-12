import { createClient } from "@supabase/supabase-js";
import { ThoughtWithMeta } from "@/lib/types";
import { FEED_PAGE_SIZE } from "@/lib/constants";
import { ThoughtComposer } from "@/components/thought-composer";
import { ThoughtFeed } from "@/components/thought-feed";

export const dynamic = "force-dynamic";

async function getThoughts(): Promise<ThoughtWithMeta[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("thoughts_with_meta")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(FEED_PAGE_SIZE);

  return (data ?? []) as ThoughtWithMeta[];
}

export default async function Home() {
  const thoughts = await getThoughts();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <ThoughtComposer />
      <ThoughtFeed initialThoughts={thoughts} />
    </div>
  );
}
