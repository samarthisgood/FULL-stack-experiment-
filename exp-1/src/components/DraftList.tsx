import type { Draft } from "@/lib/drafts";
import { DraftCard } from "./DraftCard";

type Props = {
  drafts: Draft[];
  busy: boolean;
  onEdit: (draft: Draft) => void;
  onDelete: (id: string) => void;
  onPublish: (draft: Draft) => void;
};

/** Grid of saved drafts, or an empty state. */
export function DraftList({ drafts, busy, onEdit, onDelete, onPublish }: Props) {
  if (drafts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
        <p className="font-display text-xl text-card-foreground">No Drafts Available</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Saved drafts will appear here and stay after a refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {drafts.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          busy={busy}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}
