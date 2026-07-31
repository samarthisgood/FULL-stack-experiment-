import type { Draft } from "@/lib/drafts";
import { formatDate } from "@/lib/drafts";

type Props = {
  draft: Draft;
  busy: boolean;
  onEdit: (draft: Draft) => void;
  onDelete: (id: string) => void;
  onPublish: (draft: Draft) => void;
};

/** Single draft card with edit / delete / publish actions. */
export function DraftCard({ draft, busy, onEdit, onDelete, onPublish }: Props) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl leading-tight text-card-foreground">{draft.title}</h3>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          {draft.category}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {draft.description}
      </p>

      <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
        Created {formatDate(draft.createdAt)}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => onPublish(draft)}
          disabled={busy}
          className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-button)] transition hover:bg-primary/90 disabled:opacity-60"
        >
          Publish
        </button>
        <button
          onClick={() => onEdit(draft)}
          disabled={busy}
          className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-border bg-secondary text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(draft.id)}
          disabled={busy}
          className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-destructive text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
