import { useEffect, useId, useRef, useState } from "react";
import { Loader } from "@/components/Loader";
import { PlatformPreview } from "@/components/PlatformPreviews";
import {
  PLATFORMS,
  TWITTER_LIMIT,
  mockPublishPost,
  twitterCharCount,
  type Draft,
  type PublishedPost,
  type SocialPlatform,
} from "@/lib/drafts";

type Props = {
  draft: Draft;
  onClose: () => void;
  onPublished: (post: PublishedPost) => void;
};

/** Modal to preview, edit, and simulate publishing a draft to social platforms. */
export function PublishModal({ draft, onClose, onPublished }: Props) {
  const titleId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.description);
  const [hashtags, setHashtags] = useState("");
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(["facebook"]);
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>("facebook");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !publishing) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, publishing]);

  function togglePlatform(id: SocialPlatform) {
    setPlatforms((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      if (next.length > 0 && !next.includes(previewPlatform)) {
        setPreviewPlatform(next[0]);
      }
      return next;
    });
  }

  function handleImageChange(file: File | null) {
    if (!file) {
      setImageDataUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === "string" ? reader.result : null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handlePublish() {
    setError(null);
    if (platforms.length === 0) {
      setError("Select at least one platform.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (platforms.includes("twitter") && twitterCharCount(title, content, hashtags) > TWITTER_LIMIT) {
      setError(`X (Twitter) posts must be ${TWITTER_LIMIT} characters or fewer.`);
      return;
    }

    setPublishing(true);
    try {
      await mockPublishPost({
        platforms,
        title: title.trim(),
        content: content.trim(),
        hashtags: hashtags.trim(),
        imageDataUrl,
        scheduledAt: scheduledAt || null,
      });

      const post: PublishedPost = {
        id: crypto.randomUUID(),
        draftId: draft.id,
        title: title.trim(),
        content: content.trim(),
        hashtags: hashtags.trim(),
        platforms: [...platforms],
        imageDataUrl,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        publishedAt: new Date().toISOString(),
        status: "Published",
      };
      onPublished(post);
    } finally {
      setPublishing(false);
    }
  }

  const twitterCount = twitterCharCount(title, content, hashtags);
  const twitterOver = platforms.includes("twitter") && twitterCount > TWITTER_LIMIT;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={() => {
        if (!publishing) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-[var(--shadow-hover)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="font-display text-xl text-card-foreground sm:text-2xl">
              Publish post
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Preview for each platform, edit content, then simulate publishing.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={publishing}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-lg text-muted-foreground transition hover:bg-accent disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-2">
          <div className="space-y-5 border-b border-border p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">Platforms</legend>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const active = platforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      disabled={publishing}
                      className={`inline-flex h-10 items-center rounded-xl border px-3 text-sm font-semibold transition disabled:opacity-60 ${
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
                          : "border-border bg-secondary text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-2">
              <label htmlFor="publish-title" className="text-sm font-medium text-foreground">
                Title
              </label>
              <input
                id="publish-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={publishing}
                className="h-11 rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="publish-content" className="text-sm font-medium text-foreground">
                Content
              </label>
              <textarea
                id="publish-content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={publishing}
                className="resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="publish-hashtags" className="text-sm font-medium text-foreground">
                Hashtags
              </label>
              <input
                id="publish-hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#drafts #social #ideas"
                disabled={publishing}
                className="h-11 rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium text-foreground">Image (preview only)</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={publishing}
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex h-10 items-center rounded-xl border border-border bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60"
                >
                  {imageDataUrl ? "Change image" : "Upload image"}
                </button>
                {imageDataUrl && (
                  <button
                    type="button"
                    disabled={publishing}
                    onClick={() => {
                      setImageDataUrl(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="text-sm font-medium text-destructive hover:underline disabled:opacity-60"
                  >
                    Remove
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                />
              </div>
              {imageDataUrl && (
                <img
                  src={imageDataUrl}
                  alt="Upload preview"
                  className="mt-1 h-28 w-full rounded-xl border border-border object-cover"
                />
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="publish-schedule" className="text-sm font-medium text-foreground">
                Schedule (optional)
              </label>
              <input
                id="publish-schedule"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                disabled={publishing}
                className="h-11 rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
              />
            </div>

            {platforms.includes("twitter") && (
              <p
                className={`text-xs font-medium ${twitterOver ? "text-destructive" : "text-muted-foreground"}`}
              >
                X character count: {twitterCount}/{TWITTER_LIMIT}
              </p>
            )}

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            {publishing && <Loader label="Publishing..." />}
          </div>

          <div className="space-y-4 bg-secondary/40 p-5 sm:p-6">
            <div>
              <p className="text-sm font-medium text-foreground">Platform preview</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(platforms.length > 0 ? platforms : PLATFORMS.map((p) => p.id)).map((id) => {
                  const label = PLATFORMS.find((p) => p.id === id)?.label ?? id;
                  const active = previewPlatform === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPreviewPlatform(id)}
                      className={`h-8 rounded-lg px-3 text-xs font-semibold transition ${
                        active
                          ? "bg-foreground text-background"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <PlatformPreview
              platform={previewPlatform}
              title={title}
              content={content}
              hashtags={hashtags}
              imageDataUrl={imageDataUrl}
            />
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-border px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={publishing}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-secondary px-5 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || platforms.length === 0 || twitterOver}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
          >
            {publishing ? "Publishing..." : "Publish now"}
          </button>
        </footer>
      </div>
    </div>
  );
}
