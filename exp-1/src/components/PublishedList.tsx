import type { PublishedPost } from "@/lib/drafts";
import { PublishedCard } from "./PublishedCard";

type Props = {
  posts: PublishedPost[];
};

/** Grid of published posts, or an empty state. */
export function PublishedList({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
        <p className="font-display text-xl text-card-foreground">No Published Posts</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Publish a draft to see it here with platform details and status.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {posts.map((post) => (
        <PublishedCard key={post.id} post={post} />
      ))}
    </div>
  );
}
