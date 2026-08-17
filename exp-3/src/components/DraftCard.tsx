import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash2, Send, Loader2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Draft } from "@/types/draft";
import { useAppDispatch } from "@/app/hooks";
import { deleteDraft, setError, setLoading } from "@/features/drafts/draftSlice";
import * as api from "@/services/mockApi";
import { notify } from "@/components/Toast";
import { usePermissions } from "@/hooks/use-permissions";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-success/15 text-success",
  scheduled: "bg-warning/20 text-warning-foreground",
};

export function DraftCard({
  draft,
  onPublish,
}: {
  draft: Draft;
  onPublish: (draft: Draft) => void;
}) {
  const dispatch = useAppDispatch();
  const { canEdit, canDelete, canPublish } = usePermissions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!canDelete) {
      notify.error("You do not have permission to delete posts.");
      return;
    }
    setDeleting(true);
    dispatch(setLoading({ loading: true, message: "Deleting draft..." }));
    try {
      await api.deleteDraft(draft.id);
      dispatch(deleteDraft(draft.id));
      notify.success("Draft deleted successfully!");
      setConfirmOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong!";
      dispatch(setError(message));
      notify.error(message);
    } finally {
      setDeleting(false);
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      {draft.image && (
        <img src={draft.image} alt={draft.title} className="h-40 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-foreground">{draft.title}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[draft.status]}`}
          >
            {draft.status}
          </span>
        </div>

        <p className="line-clamp-3 text-sm text-muted-foreground">{draft.content}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{draft.category}</Badge>
          {draft.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary">
              #{t}
            </Badge>
          ))}
          {draft.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{draft.tags.length - 3}</span>
          )}
        </div>

        <div className="mt-auto space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <p>By {draft.author}</p>
          <p className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Created {fmt(draft.createdAt)} · Updated {fmt(draft.updatedAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" variant="secondary" onClick={() => setViewOpen(true)}>
            <Eye className="h-4 w-4" /> View
          </Button>
          {canEdit && (
            <Button size="sm" variant="outline" asChild>
              <Link to="/drafts/$draftId/edit" params={{ draftId: draft.id }}>
                <Pencil className="h-4 w-4" /> Edit
              </Link>
            </Button>
          )}
          {canPublish && (
            <Button size="sm" onClick={() => onPublish(draft)}>
              <Send className="h-4 w-4" /> Publish
            </Button>
          )}
          {canDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this draft?</AlertDialogTitle>
            <AlertDialogDescription>
              “{draft.title}” will be permanently removed from your workspace and local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting draft..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.title}</DialogTitle>
          </DialogHeader>
          {draft.image && (
            <img
              src={draft.image}
              alt={draft.title}
              className="max-h-72 w-full rounded-xl object-cover"
            />
          )}
          <p className="whitespace-pre-wrap text-sm text-foreground">{draft.content}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{draft.category}</Badge>
            {draft.tags.map((t) => (
              <Badge key={t} variant="secondary">
                #{t}
              </Badge>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>
              <dt className="font-medium text-foreground">Author</dt>
              <dd>{draft.author}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Status</dt>
              <dd className="capitalize">{draft.status}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Created</dt>
              <dd>{fmt(draft.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Last updated</dt>
              <dd>{fmt(draft.updatedAt)}</dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>
    </article>
  );
}
