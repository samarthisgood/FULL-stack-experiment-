import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ImagePlus, Save, Eraser, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, createEmptyDraft, type Draft } from "@/types/draft";
import { useAppDispatch } from "@/app/hooks";
import {
  addDraft,
  updateDraft as updateDraftAction,
  setLoading,
  setError,
  clearError,
} from "@/features/drafts/draftSlice";
import * as api from "@/services/mockApi";
import { notify } from "@/components/Toast";

interface Errors {
  title?: string;
  content?: string;
  category?: string;
}

export function DraftForm({ existing }: { existing?: Draft }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<Draft>(existing ?? createEmptyDraft());
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (existing) setDraft(existing);
  }, [existing]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next: Errors = {};
    if (!draft.title.trim()) next.title = "Title is required.";
    if (!draft.content.trim()) next.content = "Content is required.";
    if (!draft.category) next.category = "Category is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const addTag = () => {
    const value = tagInput.trim().replace(/^#/, "");
    if (!value) return;
    if (!draft.tags.includes(value)) set("tags", [...draft.tags, value]);
    setTagInput("");
  };

  const onImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("image", String(reader.result));
    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    setDraft(createEmptyDraft());
    setTagInput("");
    setErrors({});
    setApiError(null);
    notify.info("Form cleared.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      notify.error("Please fix the highlighted fields.");
      return;
    }

    const isEdit = Boolean(existing);
    const now = new Date().toISOString();
    const payload: Draft = {
      ...draft,
      id: draft.id || crypto.randomUUID(),
      title: draft.title.trim(),
      content: draft.content.trim(),
      author: draft.author.trim() || "Anonymous",
      createdAt: draft.createdAt || now,
      updatedAt: now,
    };

    setSaving(true);
    setApiError(null);
    dispatch(clearError());
    dispatch(
      setLoading({
        loading: true,
        message: isEdit ? "Updating draft..." : "Saving draft...",
      }),
    );

    try {
      // async/await + Promise-based mock API (simulated backend delay)
      if (isEdit) {
        const saved = await api.updateDraft(payload);
        dispatch(updateDraftAction(saved));
        notify.success("Draft updated successfully!");
      } else {
        const saved = await api.createDraft(payload);
        dispatch(addDraft(saved));
        notify.success("Draft saved successfully!");
      }
      dispatch(setLoading({ loading: false }));
      navigate({ to: "/drafts" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong!";
      setApiError(message);
      dispatch(setError(message));
      notify.error(message);
    } finally {
      setSaving(false);
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={draft.title}
            placeholder="e.g. 5 React Hooks every student should know"
            onChange={(e) => set("title", e.target.value)}
          />
          {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">
            Content / Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="content"
            rows={8}
            value={draft.content}
            placeholder="Write your post content here..."
            onChange={(e) => set("content", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{draft.content.length} characters</p>
          {errors.content && (
            <p className="text-xs font-medium text-destructive">{errors.content}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={draft.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs font-medium text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={draft.author}
              placeholder="Your name"
              onChange={(e) => set("author", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags / Hashtags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              placeholder="Type a tag and press Enter (e.g. React)"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={addTag}>
              Add
            </Button>
          </div>
          {draft.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {draft.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "tags",
                        draft.tags.filter((t) => t !== tag),
                      )
                    }
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {apiError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <p className="font-medium">{apiError}</p>
            <p className="text-xs">Your data is safe — press Save to retry.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving
              ? existing
                ? "Updating draft..."
                : "Saving draft..."
              : existing
                ? "Update Draft"
                : "Save Draft"}
          </Button>
          <Button type="button" variant="outline" onClick={clearForm} disabled={saving}>
            <Eraser className="h-4 w-4" />
            Clear Form
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-card">
          <Label>Image</Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onImage(e.target.files?.[0])}
          />
          {draft.image ? (
            <div className="space-y-3">
              <img
                src={draft.image}
                alt="Draft preview"
                className="h-48 w-full rounded-xl object-cover"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  Replace
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => set("image", "")}>
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm font-medium">Select an image</span>
              <span className="text-xs">Stored locally as a data URL</span>
            </button>
          )}
        </div>

        <div className="space-y-2 rounded-2xl border border-border bg-card p-6 text-sm shadow-card">
          <Label htmlFor="created">Created date</Label>
          <Input
            id="created"
            type="date"
            value={draft.createdAt.slice(0, 10)}
            onChange={(e) => set("createdAt", new Date(e.target.value || Date.now()).toISOString())}
          />
          <p className="pt-2 text-xs text-muted-foreground">
            Status: <span className="font-medium">{draft.status}</span>
            {existing && (
              <>
                <br />
                Last updated: {new Date(existing.updatedAt).toLocaleString("en-GB")}
              </>
            )}
          </p>
        </div>
      </div>
    </form>
  );
}
