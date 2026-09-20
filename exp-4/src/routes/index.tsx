import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  FileEdit,
  LayoutList,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlatformBadge, StatusBadge } from "@/components/app/badges";
import { EmptyState } from "@/components/app/EmptyState";
import { usePostDialogs } from "@/components/app/PostDialogs";
import { useAppSelector } from "@/store";
import { formatDateTime, metrics, sortByStart } from "@/lib/post-utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PostFlow Social Media Scheduler" },
      {
        name: "description",
        content:
          "See every drafted, scheduled and published social post at a glance, then plan what is next.",
      },
      { property: "og:title", content: "Dashboard — PostFlow Social Media Scheduler" },
      {
        property: "og:description",
        content: "Metrics, upcoming posts and quick scheduling for your whole content plan.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const posts = useAppSelector((s) => s.posts.posts);
  const weekStart = useAppSelector((s) => s.posts.settings.weekStart);
  const hydrated = useAppSelector((s) => s.posts.hydrated);
  const { openCreate, openView } = usePostDialogs();

  const m = metrics(posts, weekStart);
  const upcoming = sortByStart(posts.filter((p) => p.status !== "Published")).slice(0, 6);
  const recent = sortByStart(posts.filter((p) => p.status === "Published"))
    .reverse()
    .slice(0, 4);

  const cards = [
    { label: "Total posts", value: m.total, icon: LayoutList },
    { label: "Scheduled", value: m.scheduled, icon: CalendarCheck },
    { label: "Published", value: m.published, icon: CheckCircle2 },
    { label: "Drafts", value: m.drafts, icon: FileEdit },
    { label: "Posts this week", value: m.thisWeek, icon: CalendarDays },
    { label: "Posts this month", value: m.thisMonth, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="font-display truncate text-2xl font-semibold">Good day, Samarth</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here is how your content plan looks right now.
          </p>
        </div>
        <Button onClick={() => openCreate()}>
          <Plus size={16} /> <span className="hidden sm:inline">New post</span>
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border-border bg-card rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {label}
              </span>
              <Icon size={16} className="text-accent" aria-hidden />
            </div>
            <p className="font-display mt-3 text-3xl font-semibold">{hydrated ? value : "—"}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="border-border bg-card rounded-xl border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Upcoming posts</h2>
            <Link
              to="/calendar"
              className="text-accent-foreground inline-flex items-center gap-1 text-sm hover:underline"
            >
              Open calendar <ArrowRight size={14} />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState description="Nothing queued yet. Schedule your first post to fill the calendar." />
          ) : (
            <ul className="divide-border divide-y">
              {upcoming.map((post) => (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => openView(post)}
                    className="focus-visible:ring-ring hover:bg-muted/60 grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-3 text-left focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{post.title}</span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {formatDateTime(post.start)} · {post.category}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <PlatformBadge platform={post.platform} className="hidden sm:inline-flex" />
                      <StatusBadge status={post.status} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border-border bg-card rounded-xl border p-4">
          <h2 className="font-display mb-3 text-base font-semibold">Recent activity</h2>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">No posts published yet.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((post) => (
                <li key={post.id} className="flex items-start gap-3">
                  <span className="bg-success/15 text-success mt-0.5 grid size-7 shrink-0 place-items-center rounded-full">
                    <CheckCircle2 size={14} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{post.title}</span>
                    <span className="text-muted-foreground block truncate text-xs">
                      Published · {formatDateTime(post.start)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button variant="outline" className="mt-4 w-full" onClick={() => openCreate()}>
            <Plus size={15} /> Quick create
          </Button>
        </section>
      </div>
    </div>
  );
}
