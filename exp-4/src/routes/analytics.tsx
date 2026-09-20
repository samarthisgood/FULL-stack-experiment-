import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PLATFORMS, PLATFORM_STYLES, STATUSES } from "@/lib/types";
import { useAppSelector } from "@/store";
import { countsBy } from "@/lib/post-utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — PostFlow" },
      {
        name: "description",
        content:
          "Breakdowns of posting volume by platform, status and day so you can balance your content mix.",
      },
      { property: "og:title", content: "Analytics — PostFlow" },
      {
        property: "og:description",
        content: "Charts for platform mix, status split and posting volume over time.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const posts = useAppSelector((s) => s.posts.posts);

  const byPlatform = PLATFORMS.map((p) => ({
    name: p,
    value: posts.filter((x) => x.platform === p).length,
    fill: PLATFORM_STYLES[p].hex,
  }));

  const byStatus = STATUSES.map((s) => ({
    name: s,
    value: posts.filter((x) => x.status === s).length,
  }));

  const perDay = Object.entries(countsBy(posts, (p) => format(parseISO(p.start), "yyyy-MM-dd")))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, value]) => ({ day: format(parseISO(day), "d MMM"), value }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          A quick read on where your content is going and how evenly it is spread.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {byPlatform.map((p) => (
          <div key={p.name} className="border-border bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: p.fill }}
                aria-hidden
              />
              <span className="text-muted-foreground text-xs font-semibold uppercase">
                {p.name}
              </span>
            </div>
            <p className="font-display mt-2 text-2xl font-semibold">{p.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border-border bg-card rounded-xl border p-4">
          <h2 className="font-display mb-4 text-base font-semibold">Posts by platform</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPlatform}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {byPlatform.map((p) => (
                    <Cell key={p.name} fill={p.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="border-border bg-card rounded-xl border p-4">
          <h2 className="font-display mb-4 text-base font-semibold">Posts by status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {byStatus.map((s, i) => (
                    <Cell key={s.name} fill={`var(--chart-${i + 1})`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-3">
            {byStatus.map((s, i) => (
              <li key={s.name} className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: `var(--chart-${i + 1})` }}
                  aria-hidden
                />
                {s.name} ({s.value})
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="border-border bg-card rounded-xl border p-4">
        <h2 className="font-display mb-4 text-base font-semibold">Posting volume over time</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={perDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
