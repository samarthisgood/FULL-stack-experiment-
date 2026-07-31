import { formatDate, platformLabel, type PublishedPost } from "@/lib/drafts";

type Props = {
  post: PublishedPost;
};

/** Card for a published social post. */
export function PublishedCard({ post }: Props) {
  const body = post.hashtags.trim()
    ? `${post.content}\n\n${post.hashtags}`
    : post.content;

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-xl leading-tight text-card-foreground">{post.title}</h3>
        <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          {post.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {post.platforms.map((platform) => (
          <span
            key={platform}
            className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
          >
            {platformLabel(platform)}
          </span>
        ))}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>

      {post.imageDataUrl && (
        <img
          src={post.imageDataUrl}
          alt=""
          className="mt-4 h-40 w-full rounded-xl border border-border object-cover"
        />
      )}

      <div className="mt-4 space-y-1 text-xs uppercase tracking-wide text-muted-foreground">
        <p>Published {formatDate(post.publishedAt)}</p>
        {post.scheduledAt && <p>Scheduled for {formatDate(post.scheduledAt)}</p>}
      </div>
    </article>
  );
}
