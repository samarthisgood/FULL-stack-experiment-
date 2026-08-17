import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/app/hooks";
import { PLATFORMS, type Platform } from "@/types/draft";
import { cn } from "@/lib/utils";

const fmtDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

export function ScheduledPosts() {
  const posts = useAppSelector((s) => s.drafts.scheduledPosts);
  const [filter, setFilter] = useState<"All" | Platform>("All");
  const visible = posts.filter((p) => filter === "All" || p.platform === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["All", ...PLATFORMS] as const).map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
              filter === p
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <CalendarClock className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-semibold">No Scheduled Posts</p>
          <p className="text-sm text-muted-foreground">
            Schedule a draft from the publish dialog to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              {p.image && <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />}
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-base font-semibold">{p.title}</h3>
                  <Badge className="bg-warning text-warning-foreground">Scheduled</Badge>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{p.content}</p>
                <p className="text-sm font-medium text-foreground">
                  Scheduled for {fmtDate(p.scheduledDate)} at {p.scheduledTime}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <Badge variant="outline">{p.platform}</Badge>
                  <span>{p.hashtags.map((t) => `#${t}`).join(" ")}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
