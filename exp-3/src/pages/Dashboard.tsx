import { Link } from "@tanstack/react-router";
import { FileText, Send, CalendarClock, Clock, PlusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/app/hooks";
import { Loader } from "@/components/Loader";
import { usePermissions } from "@/hooks/use-permissions";

const fmt = (iso: string) => new Date(iso).toLocaleString("en-GB");

export function Dashboard() {
  const { drafts, publishedPosts, scheduledPosts, loading, loadingMessage } = useAppSelector(
    (s) => s.drafts,
  );
  const { canCreate, canPublish } = usePermissions();

  const recentlyUpdated = [...drafts].sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
  );

  const stats = [
    {
      label: "Total Drafts",
      value: drafts.length,
      icon: FileText,
      to: "/drafts" as const,
    },
    {
      label: "Published Posts",
      value: publishedPosts.length,
      icon: Send,
      to: "/published" as const,
    },
    {
      label: "Scheduled Posts",
      value: scheduledPosts.length,
      icon: CalendarClock,
      to: "/scheduled" as const,
    },
    {
      label: "Recently Updated",
      value: recentlyUpdated[0]
        ? new Date(recentlyUpdated[0].updatedAt).toLocaleDateString("en-GB")
        : "—",
      icon: Clock,
      to: "/drafts" as const,
    },
  ];

  if (loading && drafts.length === 0) {
    return <Loader message={loadingMessage || "Loading drafts..."} />;
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl bg-brand-gradient p-8 text-primary-foreground shadow-lift">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Draft Management System
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-primary-foreground/85">
          Create, edit and organise drafts, then publish or schedule them across Instagram,
          Facebook, X and LinkedIn — fully simulated on the frontend with Redux Toolkit,
          localStorage and mock APIs.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {canCreate && (
            <Button asChild variant="secondary">
              <Link to="/create">
                <PlusCircle className="h-4 w-4" /> Create Draft
              </Link>
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link to="/drafts">
              <FileText className="h-4 w-4" /> View Drafts
            </Link>
          </Button>
          {canPublish && (
            <Button asChild variant="secondary">
              <Link to="/published">
                <Send className="h-4 w-4" /> Publish Post
              </Link>
            </Button>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent drafts</h2>
            <Link
              to="/drafts"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentlyUpdated.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No Drafts Available</p>
          ) : (
            <ul className="space-y-3">
              {recentlyUpdated.slice(0, 5).map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.category} · updated {fmt(d.updatedAt)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {d.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recently published</h2>
            <Link
              to="/published"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {publishedPosts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nothing published yet</p>
          ) : (
            <ul className="space-y-3">
              {publishedPosts.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.platform} · {fmt(p.publishedAt)}
                    </p>
                  </div>
                  <Badge className="bg-success text-success-foreground">Published</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
