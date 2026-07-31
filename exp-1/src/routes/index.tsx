import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DraftForm } from "@/components/DraftForm";
import { DraftList } from "@/components/DraftList";
import { Loader } from "@/components/Loader";
import { PublishModal } from "@/components/PublishModal";
import { PublishedList } from "@/components/PublishedList";
import {
  delay,
  loadDrafts,
  loadPublished,
  saveDrafts,
  savePublished,
  type Draft,
  type PublishedPost,
} from "@/lib/drafts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Draft Management System — Write, Save & Publish Social Posts" },
      {
        name: "description",
        content:
          "Create drafts, preview them for Facebook, Instagram, X, and LinkedIn, then simulate publishing — all in the browser.",
      },
      { property: "og:title", content: "Draft Management System" },
      {
        property: "og:description",
        content:
          "A fast, offline-friendly draft manager with social publish previews and localStorage persistence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Status = "idle" | "saving" | "updating" | "deleting";
type ViewFilter = "drafts" | "published";

const STATUS_LABEL: Record<Exclude<Status, "idle">, string> = {
  saving: "Saving...",
  updating: "Updating...",
  deleting: "Deleting...",
};

function App() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [published, setPublished] = useState<PublishedPost[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [publishingDraft, setPublishingDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [loaded, setLoaded] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [view, setView] = useState<ViewFilter>("drafts");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(loadDrafts());
    setPublished(loadPublished());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveDrafts(drafts);
  }, [drafts, loaded]);

  useEffect(() => {
    if (loaded) savePublished(published);
  }, [published, loaded]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  async function handleSubmit(values: {
    title: string;
    description: string;
    category: string;
  }) {
    if (editing) {
      setStatus("updating");
      await delay();
      setDrafts((prev) =>
        prev.map((draft) => (draft.id === editing.id ? { ...draft, ...values } : draft)),
      );
      setEditing(null);
    } else {
      setStatus("saving");
      await delay();
      const newDraft: Draft = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...values,
      };
      setDrafts((prev) => [newDraft, ...prev]);
      setResetSignal((n) => n + 1);
    }
    setStatus("idle");
  }

  async function handleDelete(id: string) {
    setStatus("deleting");
    await delay(500);
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    if (editing?.id === id) setEditing(null);
    if (publishingDraft?.id === id) setPublishingDraft(null);
    setStatus("idle");
  }

  function handleEdit(draft: Draft) {
    setEditing(draft);
    setView("drafts");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePublished(post: PublishedPost) {
    setPublished((prev) => [post, ...prev]);
    setDrafts((prev) => prev.filter((d) => d.id !== post.draftId));
    if (editing?.id === post.draftId) setEditing(null);
    setPublishingDraft(null);
    setSuccessMessage("Post Published Successfully!");
    setView("published");
  }

  const busy = status !== "idle";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-display text-lg text-primary-foreground">
              D
            </span>
            <span className="font-display text-lg tracking-tight text-foreground sm:text-xl">
              Draft Management System
            </span>
          </div>
          <span className="hidden text-sm text-muted-foreground sm:block">
            {drafts.length} drafts · {published.length} published
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
          Keep every idea in one tidy place
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Write a draft, preview it for social platforms, and simulate publishing — everything stays
          in your browser.
        </p>

        {successMessage && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
          >
            {successMessage}
          </div>
        )}

        <div className="mt-8">
          <DraftForm
            editing={editing}
            resetSignal={resetSignal}
            busy={busy}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditing(null)}
          />
        </div>

        {busy && (
          <div className="mt-5">
            <Loader label={STATUS_LABEL[status as Exclude<Status, "idle">]} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView("drafts")}
            className={`inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold transition ${
              view === "drafts"
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
                : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            All Drafts ({drafts.length})
          </button>
          <button
            type="button"
            onClick={() => setView("published")}
            className={`inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold transition ${
              view === "published"
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
                : "border border-border bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            Published Posts ({published.length})
          </button>
        </div>

        {view === "drafts" ? (
          <section className="mt-6">
            <h2 className="font-display text-2xl text-foreground">Saved drafts</h2>
            <div className="mt-5">
              <DraftList
                drafts={drafts}
                busy={busy}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPublish={setPublishingDraft}
              />
            </div>
          </section>
        ) : (
          <section className="mt-6">
            <h2 className="font-display text-2xl text-foreground">Published posts</h2>
            <div className="mt-5">
              <PublishedList posts={published} />
            </div>
          </section>
        )}
      </main>

      {publishingDraft && (
        <PublishModal
          draft={publishingDraft}
          onClose={() => setPublishingDraft(null)}
          onPublished={handlePublished}
        />
      )}
    </div>
  );
}
