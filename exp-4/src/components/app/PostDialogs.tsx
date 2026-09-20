import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { format, parseISO } from "date-fns";
import { CalendarClock, Pencil, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformBadge, StatusBadge } from "./badges";
import { addPost, deletePost, updatePost } from "@/store/postSlice";
import { useAppDispatch } from "@/store";
import {
  CATEGORIES,
  PLATFORMS,
  STATUSES,
  TIMEZONES,
  type Category,
  type Platform,
  type Post,
  type Status,
} from "@/lib/types";
import { formatDateTime } from "@/lib/post-utils";

interface DialogApi {
  openCreate: (presetStart?: Date) => void;
  openEdit: (post: Post) => void;
  openView: (post: Post) => void;
  openDelete: (post: Post) => void;
}

const DialogCtx = createContext<DialogApi | null>(null);

export const usePostDialogs = () => {
  const ctx = useContext(DialogCtx);
  if (!ctx) throw new Error("usePostDialogs must be used inside PostDialogsProvider");
  return ctx;
};

type FieldErrors = { title?: string; content?: string; date?: string; time?: string };

interface FormState {
  title: string;
  content: string;
  platform: Platform;
  category: Category;
  status: Status;
  date: string;
  time: string;
  duration: string;
  timezone: string;
  imageUrl: string;
  hashtags: string;
  notes: string;
}

const emptyForm = (start = new Date()): FormState => ({
  title: "",
  content: "",
  platform: "Instagram",
  category: "Marketing",
  status: "Scheduled",
  date: format(start, "yyyy-MM-dd"),
  time: format(start, "HH:mm"),
  duration: "30",
  timezone: "UTC",
  imageUrl: "",
  hashtags: "",
  notes: "",
});

const formFromPost = (post: Post): FormState => ({
  title: post.title,
  content: post.content,
  platform: post.platform,
  category: post.category,
  status: post.status,
  date: format(parseISO(post.start), "yyyy-MM-dd"),
  time: format(parseISO(post.start), "HH:mm"),
  duration: String(
    Math.max(5, Math.round((+parseISO(post.end) - +parseISO(post.start)) / 60000)) || 30,
  ),
  timezone: post.timezone,
  imageUrl: post.imageUrl ?? "",
  hashtags: post.hashtags.join(", "),
  notes: post.notes ?? "",
});

export function PostDialogsProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [viewing, setViewing] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState<Post | null>(null);

  const api = useMemo<DialogApi>(
    () => ({
      openCreate: (presetStart) => {
        setEditing(null);
        setErrors({});
        setForm(emptyForm(presetStart));
        setFormOpen(true);
      },
      openEdit: (post) => {
        setViewing(null);
        setEditing(post);
        setErrors({});
        setForm(formFromPost(post));
        setFormOpen(true);
      },
      openView: (post) => setViewing(post),
      openDelete: (post) => {
        setViewing(null);
        setDeleting(post);
      },
    }),
    [],
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = useCallback(
    (status: Status) => {
      const next: FieldErrors = {};
      if (!form.title.trim()) next.title = "A title is required.";
      if (!form.content.trim()) next.content = "Post content is required.";
      if (!form.date) next.date = "Pick a date.";
      if (!form.time) next.time = "Pick a time.";
      setErrors(next);
      if (Object.keys(next).length) {
        toast.error("Please fix the highlighted fields.");
        return;
      }

      const start = new Date(`${form.date}T${form.time}`);
      const minutes = Math.max(5, Number(form.duration) || 30);
      const post: Post = {
        id: editing?.id ?? crypto.randomUUID(),
        title: form.title.trim(),
        content: form.content.trim(),
        platform: form.platform,
        category: form.category,
        status,
        start: start.toISOString(),
        end: new Date(start.getTime() + minutes * 60000).toISOString(),
        timezone: form.timezone,
        imageUrl: form.imageUrl.trim() || undefined,
        hashtags: form.hashtags
          .split(/[,\s]+/)
          .map((h) => h.replace(/^#/, "").trim())
          .filter(Boolean),
        notes: form.notes.trim() || undefined,
      };

      if (editing) {
        dispatch(updatePost(post));
        toast.success("Post updated successfully.");
      } else {
        dispatch(addPost(post));
        toast.success(status === "Draft" ? "Draft saved." : "Post scheduled successfully.");
      }
      setFormOpen(false);
    },
    [dispatch, editing, form],
  );

  return (
    <DialogCtx.Provider value={api}>
      {children}

      {/* Create / edit */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit post" : "Create a post"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details, then save it as a draft or put it on the calendar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <Field label="Title" error={errors.title} htmlFor="title">
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Autumn drop teaser reel"
                aria-invalid={!!errors.title}
              />
            </Field>

            <Field label="Content" error={errors.content} htmlFor="content">
              <Textarea
                id="content"
                rows={4}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="What goes out with this post?"
                aria-invalid={!!errors.content}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Platform" htmlFor="platform">
                <Select
                  value={form.platform}
                  onValueChange={(v) => set("platform", v as Platform)}
                >
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Category" htmlFor="category">
                <Select
                  value={form.category}
                  onValueChange={(v) => set("category", v as Category)}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status" htmlFor="status">
                <Select value={form.status} onValueChange={(v) => set("status", v as Status)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Date" error={errors.date} htmlFor="date">
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  aria-invalid={!!errors.date}
                />
              </Field>
              <Field label="Time" error={errors.time} htmlFor="time">
                <Input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  aria-invalid={!!errors.time}
                />
              </Field>
              <Field label="Duration (min)" htmlFor="duration">
                <Input
                  id="duration"
                  type="number"
                  min={5}
                  step={5}
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                />
              </Field>
              <Field label="Time zone" htmlFor="timezone">
                <Select value={form.timezone} onValueChange={(v) => set("timezone", v)}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Image / thumbnail URL (optional)" htmlFor="imageUrl">
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => set("imageUrl", e.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Hashtags (comma separated)" htmlFor="hashtags">
                <Input
                  id="hashtags"
                  value={form.hashtags}
                  onChange={(e) => set("hashtags", e.target.value)}
                  placeholder="launch, autumn"
                />
              </Field>
            </div>

            <Field label="Notes (optional)" htmlFor="notes">
              <Textarea
                id="notes"
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Internal reminders for the team"
              />
            </Field>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => submit("Draft")}>
                <Save size={15} /> Save draft
              </Button>
              <Button onClick={() => submit(form.status === "Draft" ? "Scheduled" : form.status)}>
                <CalendarClock size={15} /> {editing ? "Save changes" : "Schedule post"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display pr-6 text-left">{viewing.title}</DialogTitle>
                <DialogDescription className="text-left">
                  {formatDateTime(viewing.start)} · {viewing.timezone}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <PlatformBadge platform={viewing.platform} />
                  <StatusBadge status={viewing.status} />
                  <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium">
                    {viewing.category}
                  </span>
                </div>

                {viewing.imageUrl && (
                  <img
                    src={viewing.imageUrl}
                    alt=""
                    className="max-h-48 w-full rounded-lg object-cover"
                  />
                )}

                <p className="text-muted-foreground text-sm leading-relaxed">{viewing.content}</p>

                {viewing.hashtags.length > 0 && (
                  <p className="text-accent-foreground text-sm">
                    {viewing.hashtags.map((h) => `#${h}`).join(" ")}
                  </p>
                )}

                {viewing.notes && (
                  <div className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">
                    <span className="text-foreground font-medium">Notes: </span>
                    {viewing.notes}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:justify-between">
                <Button variant="ghost" onClick={() => setViewing(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => api.openEdit(viewing)}>
                    <Pencil size={15} /> Edit
                  </Button>
                  <Button variant="destructive" onClick={() => api.openDelete(viewing)}>
                    <Trash2 size={15} /> Delete
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this scheduled post?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) {
                  dispatch(deletePost(deleting.id));
                  toast.success("Post deleted.");
                }
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogCtx.Provider>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
