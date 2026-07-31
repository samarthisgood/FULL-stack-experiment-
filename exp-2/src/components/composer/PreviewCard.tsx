import { getPlatform, type PlatformId } from "./platforms";
import type { MediaItem } from "./MediaUploader";

interface Props {
  platform: PlatformId;
  text: string;
  media: MediaItem[];
}

export function PreviewCard({ platform, text, media }: Props) {
  const p = getPlatform(platform);
  const first = media[0];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold ${p.accent}`}>
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[10px]">
          {p.icon}
        </span>
        {p.name} preview
      </div>
      <div className="flex gap-3 p-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-muted-foreground/40 to-muted-foreground/10" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">Your Name</span>
            <span className="text-muted-foreground">· now</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
            {highlight(text) || (
              <span className="text-muted-foreground">Your post will appear here…</span>
            )}
          </p>
          {first && (
            <div className="mt-3 overflow-hidden rounded-lg border border-border">
              {first.type === "image" ? (
                <img src={first.url} alt="" className="max-h-72 w-full object-cover" />
              ) : (
                <video src={first.url} controls className="max-h-72 w-full" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function highlight(text: string) {
  if (!text) return null;
  const parts = text.split(/(#[\p{L}0-9_]+|@[\p{L}0-9_]+|https?:\/\/\S+)/gu);
  return parts.map((part, i) => {
    if (/^#/.test(part))
      return (
        <span key={i} className="text-sky-500">
          {part}
        </span>
      );
    if (/^@/.test(part))
      return (
        <span key={i} className="text-pink-500">
          {part}
        </span>
      );
    if (/^https?:/.test(part))
      return (
        <a key={i} className="text-primary underline" href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    return <span key={i}>{part}</span>;
  });
}
