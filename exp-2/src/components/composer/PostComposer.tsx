import { useEffect, useMemo, useState } from "react";
import { PlatformSelector } from "./PlatformSelector";
import { CharacterCounter } from "./CharacterCounter";
import { ValidationMessage } from "./ValidationMessage";
import { MediaUploader, type MediaItem } from "./MediaUploader";
import { PreviewCard } from "./PreviewCard";
import { countHashtags, validate, type PlatformId } from "./platforms";

export function PostComposer() {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<PlatformId[]>(["twitter"]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [dark, setDark] = useState(false);
  const [posted, setPosted] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const issues = useMemo(() => validate(text, selected), [text, selected]);
  const hasError = issues.some((i) => i.level === "error");
  const hashtags = countHashtags(text);

  const toggle = (id: PlatformId) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const canPost = selected.length > 0 && text.trim().length > 0 && !hasError;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Multi-platform composer
            </div>
            <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">
              Compose once. Post everywhere.
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
            aria-label="Toggle theme"
          >
            {dark ? "☀︎" : "☾"}
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* LEFT: composer */}
          <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-semibold">Platforms</label>
              <PlatformSelector selected={selected} onToggle={toggle} />
            </div>

            <div>
              <label htmlFor="post" className="mb-2 block text-sm font-semibold">
                Your post
              </label>
              <textarea
                id="post"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="What do you want to share?"
                className="w-full resize-y rounded-xl border border-input bg-background p-3 text-sm outline-none ring-0 focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {hashtags} hashtag{hashtags === 1 ? "" : "s"} · {media.length} media
                </div>
                {selected.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {selected.map((id) => (
                      <CharacterCounter key={id} platform={id} length={text.length} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Media</label>
              <MediaUploader media={media} onChange={setMedia} />
            </div>

            <ValidationMessage issues={issues} />

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="text-xs text-muted-foreground">
                {canPost
                  ? "Ready to publish."
                  : hasError
                    ? "Fix errors to enable posting."
                    : "Add content and pick a platform."}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setMedia([]);
                    setPosted(null);
                  }}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={!canPost}
                  onClick={() =>
                    setPosted(
                      `Posted to ${selected.map((s) => s).join(", ")} at ${new Date().toLocaleTimeString()}`,
                    )
                  }
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Post now
                </button>
              </div>
            </div>
            {posted && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                ✓ {posted}
              </div>
            )}
          </section>

          {/* RIGHT: previews */}
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Live previews
            </h2>
            {selected.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Select a platform to preview your post.
              </div>
            ) : (
              selected.map((id) => <PreviewCard key={id} platform={id} text={text} media={media} />)
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
