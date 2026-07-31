import { useEffect, useState } from "react";
import type { Draft } from "@/lib/drafts";
import { CATEGORIES } from "@/lib/drafts";

type Props = {
  /** Draft currently being edited, or null when creating a new one. */
  editing: Draft | null;
  /** Increments after a successful create, clearing the form. */
  resetSignal: number;
  busy: boolean;
  onSubmit: (values: { title: string; description: string; category: string }) => void;
  onCancelEdit: () => void;
};

/** Controlled form for creating and editing drafts. */
export function DraftForm({ editing, resetSignal, busy, onSubmit, onCancelEdit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Populate the form whenever an existing draft is selected for editing.
  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description);
      setCategory(editing.category);
    } else {
      setTitle("");
      setDescription("");
      setCategory(CATEGORIES[0]);
    }
    setErrors({});
  }, [editing, resetSignal]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!description.trim()) nextErrors.description = "Description is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ title: title.trim(), description: description.trim(), category });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      <h2 className="font-display text-2xl text-card-foreground">
        {editing ? "Edit draft" : "New draft"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {editing ? "Update the fields and save your changes." : "Capture an idea before it escapes."}
      </p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A headline worth clicking"
            className="h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write the body of your post..."
            className="resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          {errors.description && (
            <p className="text-xs font-medium text-destructive">{errors.description}</p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="category" className="text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-button)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
        >
          {editing ? "Update Draft" : "Save Draft"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={busy}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-secondary px-6 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
