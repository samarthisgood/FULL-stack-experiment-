import { Heart, MessageCircle, Repeat2, Send, ThumbsUp, Share2 } from "lucide-react";
import type { Platform } from "@/types/draft";

interface PreviewProps {
  platform: Platform;
  author: string;
  content: string;
  image: string;
  hashtags: string[];
}

const Avatar = ({ author }: { author: string }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-primary-foreground">
    {(author || "U").charAt(0).toUpperCase()}
  </div>
);

const Tags = ({ hashtags }: { hashtags: string[] }) =>
  hashtags.length ? (
    <p className="mt-1 text-sm font-medium text-primary">
      {hashtags.map((t) => `#${t}`).join(" ")}
    </p>
  ) : null;

export function SocialPreview({ platform, author, content, image, hashtags }: PreviewProps) {
  const name = author || "Anonymous";
  const handle = `@${name.toLowerCase().replace(/\s+/g, "")}`;

  if (platform === "Instagram") {
    return (
      <article className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <header className="flex items-center gap-3 p-3">
          <Avatar author={name} />
          <div>
            <p className="text-sm font-semibold">{handle.slice(1)}</p>
            <p className="text-xs text-muted-foreground">Instagram · Original audio</p>
          </div>
        </header>
        {image ? (
          <img src={image} alt="Post" className="aspect-square w-full object-cover" />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-muted text-xs text-muted-foreground">
            No image selected
          </div>
        )}
        <div className="space-y-1 p-3">
          <div className="flex gap-4 text-muted-foreground">
            <Heart className="h-5 w-5" />
            <MessageCircle className="h-5 w-5" />
            <Send className="h-5 w-5" />
          </div>
          <p className="text-sm">
            <span className="font-semibold">{handle.slice(1)}</span>{" "}
            {content || "Your caption appears here..."}
          </p>
          <Tags hashtags={hashtags} />
        </div>
      </article>
    );
  }

  if (platform === "Facebook") {
    return (
      <article className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <header className="flex items-center gap-3 p-3">
          <Avatar author={name} />
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">Just now · Public</p>
          </div>
        </header>
        <div className="px-3 pb-3 text-sm">
          <p className="whitespace-pre-wrap">{content || "Your post content..."}</p>
          <Tags hashtags={hashtags} />
        </div>
        {image && <img src={image} alt="Post" className="max-h-72 w-full object-cover" />}
        <footer className="flex items-center justify-around border-t border-border p-2 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4" /> Like
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" /> Comment
          </span>
          <span className="flex items-center gap-1.5">
            <Share2 className="h-4 w-4" /> Share
          </span>
        </footer>
      </article>
    );
  }

  if (platform === "X") {
    const full = [content, hashtags.map((t) => `#${t}`).join(" ")].filter(Boolean).join(" ");
    const over = full.length > 280;
    return (
      <article className="rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="flex gap-3">
          <Avatar author={name} />
          <div className="min-w-0 flex-1">
            <p className="text-sm">
              <span className="font-semibold">{name}</span>{" "}
              <span className="text-muted-foreground">{handle} · now</span>
            </p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">
              {full.slice(0, 280) || "Your tweet content..."}
            </p>
            {image && (
              <img
                src={image}
                alt="Post"
                className="mt-2 max-h-56 w-full rounded-lg object-cover"
              />
            )}
            <div className="mt-3 flex items-center justify-between text-muted-foreground">
              <div className="flex gap-5">
                <MessageCircle className="h-4 w-4" />
                <Repeat2 className="h-4 w-4" />
                <Heart className="h-4 w-4" />
              </div>
              <span
                className={
                  over
                    ? "text-xs font-semibold text-destructive"
                    : "text-xs font-medium text-muted-foreground"
                }
              >
                {full.length}/280
              </span>
            </div>
            {over && (
              <p className="mt-1 text-xs font-medium text-destructive">
                Content exceeds 280 characters — it will be trimmed on publish.
              </p>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <header className="flex items-center gap-3 p-3">
        <Avatar author={name} />
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">Content Creator · Now</p>
        </div>
      </header>
      <div className="px-3 pb-3 text-sm">
        <p className="whitespace-pre-wrap">{content || "Your professional update..."}</p>
        <Tags hashtags={hashtags} />
      </div>
      {image && <img src={image} alt="Post" className="max-h-72 w-full object-cover" />}
      <footer className="flex items-center justify-around border-t border-border p-2 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="h-4 w-4" /> Like
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" /> Comment
        </span>
        <span className="flex items-center gap-1.5">
          <Repeat2 className="h-4 w-4" /> Repost
        </span>
        <span className="flex items-center gap-1.5">
          <Send className="h-4 w-4" /> Send
        </span>
      </footer>
    </article>
  );
}
