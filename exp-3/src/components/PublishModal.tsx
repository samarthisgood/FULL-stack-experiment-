import { useMemo, useState } from "react";
import { CalendarClock, Loader2, Send, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SocialPreview } from "@/components/SocialPreview";
import {
  PLATFORMS,
  type Draft,
  type Platform,
  type PublishedPost,
  type ScheduledPost,
} from "@/types/draft";
import { useAppDispatch } from "@/app/hooks";
import {
  publishDraft,
  schedulePost as schedulePostAction,
  setError,
  setLoading,
} from "@/features/drafts/draftSlice";
import * as api from "@/services/mockApi";
import { notify } from "@/components/Toast";
import { cn } from "@/lib/utils";

export function PublishModal({
  draft,
  open,
  onOpenChange,
}: {
  draft: Draft | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const [platforms, setPlatforms] = useState<Platform[]>(["Instagram"]);
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState<"publish" | "schedule" | null>(null);
  const [initialisedFor, setInitialisedFor] = useState<string | null>(null);

  // Sync local editable copy when a new draft is opened.
  if (draft && initialisedFor !== draft.id) {
    setInitialisedFor(draft.id);
    setContent(draft.content);
    setHashtags(draft.tags);
    setPlatforms(["Instagram"]);
    setDate("");
    setTime("");
  }

  const activePreview = platforms[0] ?? "Instagram";
  const previewTabs = useMemo(
    () => (platforms.length ? platforms : ([activePreview] as Platform[])),
    [platforms, activePreview],
  );

  if (!draft) return null;

  const toggle = (p: Platform) =>
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const addTag = () => {
    const value = tagInput.trim().replace(/^#/, "");
    if (value && !hashtags.includes(value)) setHashtags([...hashtags, value]);
    setTagInput("");
  };

  const handlePublish = async () => {
    if (!platforms.length) {
      notify.error("Select at least one platform.");
      return;
    }
    setBusy("publish");
    dispatch(setLoading({ loading: true, message: "Publishing post..." }));
    try {
      const posts: PublishedPost[] = platforms.map((platform) => ({
        id: crypto.randomUUID(),
        draftId: draft.id,
        title: draft.title,
        content: platform === "X" ? content.slice(0, 280) : content,
        platform,
        image: draft.image,
        hashtags,
        publishedAt: new Date().toISOString(),
        status: "published",
      }));
      const saved = await api.publishPost(posts);
      dispatch(publishDraft({ draftId: draft.id, posts: saved }));
      notify.success("Post published successfully!");
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong!";
      dispatch(setError(message));
      notify.error(message);
    } finally {
      setBusy(null);
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleSchedule = async () => {
    if (!platforms.length) {
      notify.error("Select at least one platform.");
      return;
    }
    if (!date || !time) {
      notify.error("Pick a date and a time to schedule.");
      return;
    }
    setBusy("schedule");
    dispatch(setLoading({ loading: true, message: "Scheduling post..." }));
    try {
      const posts: ScheduledPost[] = platforms.map((platform) => ({
        id: crypto.randomUUID(),
        draftId: draft.id,
        title: draft.title,
        content: platform === "X" ? content.slice(0, 280) : content,
        platform,
        image: draft.image,
        hashtags,
        scheduledDate: date,
        scheduledTime: time,
        status: "scheduled",
      }));
      const saved = await api.schedulePost(posts);
      dispatch(schedulePostAction({ draftId: draft.id, posts: saved }));
      const [y, m, d] = date.split("-");
      notify.success(`Post scheduled successfully! Scheduled for ${d}/${m}/${y} at ${time}`);
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong!";
      dispatch(setError(message));
      notify.error(message);
    } finally {
      setBusy(null);
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish “{draft.title}”</DialogTitle>
          <DialogDescription>
            Choose platforms, tweak the copy and preview before publishing or scheduling. All
            publishing is simulated on the frontend.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggle(p)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                      platforms.includes(p)
                        ? "border-primary bg-primary text-primary-foreground shadow-card"
                        : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pubcontent">Content</Label>
              <Textarea
                id="pubcontent"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {content.length} characters
                {platforms.includes("X") && " · X limit is 280"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pubtags">Hashtags</Label>
              <div className="flex gap-2">
                <Input
                  id="pubtags"
                  value={tagInput}
                  placeholder="React, WebDevelopment..."
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
              <div className="flex flex-wrap gap-2 pt-1">
                {hashtags.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    #{t}
                    <button
                      type="button"
                      onClick={() => setHashtags(hashtags.filter((x) => x !== t))}
                      aria-label={`Remove ${t}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Schedule date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Schedule time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handlePublish} disabled={busy !== null}>
                {busy === "publish" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {busy === "publish" ? "Publishing post..." : "Publish Now"}
              </Button>
              <Button variant="outline" onClick={handleSchedule} disabled={busy !== null}>
                {busy === "schedule" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CalendarClock className="h-4 w-4" />
                )}
                {busy === "schedule" ? "Scheduling post..." : "Schedule Post"}
              </Button>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Live preview</Label>
            <Tabs value={activePreview} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {previewTabs.map((p) => (
                  <TabsTrigger
                    key={p}
                    value={p}
                    onClick={() => setPlatforms((prev) => [p, ...prev.filter((x) => x !== p)])}
                  >
                    {p}
                  </TabsTrigger>
                ))}
              </TabsList>
              {previewTabs.map((p) => (
                <TabsContent key={p} value={p} className="mt-4">
                  <SocialPreview
                    platform={p}
                    author={draft.author}
                    content={content}
                    image={draft.image}
                    hashtags={hashtags}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
