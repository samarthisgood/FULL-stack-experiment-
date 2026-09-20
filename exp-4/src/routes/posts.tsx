import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlatformBadge, StatusBadge } from "@/components/app/badges";
import { EmptyState } from "@/components/app/EmptyState";
import { FilterToolbar } from "@/components/app/FilterToolbar";
import { usePostDialogs } from "@/components/app/PostDialogs";
import { useAppSelector } from "@/store";
import { filterPosts, formatDate, formatTime } from "@/lib/post-utils";
import type { Post } from "@/lib/types";

export const Route = createFileRoute("/posts")({
  head: () => ({
    meta: [
      { title: "All Posts — PostFlow" },
      {
        name: "description",
        content:
          "Searchable, sortable table of every social post with platform, status, category and quick actions.",
      },
      { property: "og:title", content: "All Posts — PostFlow" },
      {
        property: "og:description",
        content: "Search, sort and manage every drafted, scheduled and published post.",
      },
    ],
  }),
  component: PostsPage,
});

type SortKey = "title" | "platform" | "start" | "status" | "category";
const PAGE_SIZE = 8;

function PostsPage() {
  const posts = useAppSelector((s) => s.posts.posts);
  const filters = useAppSelector((s) => s.posts.filters);
  const { openView, openEdit, openDelete } = usePostDialogs();
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "start", dir: 1 });
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const filtered = filterPosts(posts, filters);
    return filtered.sort((a, b) => {
      const av = String(a[sort.key as keyof Post]);
      const bv = String(b[sort.key as keyof Post]);
      return av.localeCompare(bv) * sort.dir;
    });
  }, [posts, filters, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = rows.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  const header = (key: SortKey, label: string) => (
    <TableHead>
      <button
        type="button"
        className="focus-visible:ring-ring inline-flex items-center gap-1 rounded text-xs font-semibold uppercase focus-visible:ring-2 focus-visible:outline-none"
        onClick={() =>
          setSort((s) => ({ key, dir: s.key === key && s.dir === 1 ? -1 : 1 }))
        }
      >
        {label} <ArrowUpDown size={12} aria-hidden />
      </button>
    </TableHead>
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">All posts</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {rows.length} post{rows.length === 1 ? "" : "s"} match your current search and filters.
        </p>
      </header>

      <FilterToolbar />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="border-border bg-card overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {header("title", "Title")}
                  {header("platform", "Platform")}
                  {header("start", "Date")}
                  <TableHead className="text-xs font-semibold uppercase">Time</TableHead>
                  {header("status", "Status")}
                  {header("category", "Category")}
                  <TableHead className="text-right text-xs font-semibold uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-[16rem] min-w-0">
                      <span className="block truncate font-medium">{post.title}</span>
                    </TableCell>
                    <TableCell>
                      <PlatformBadge platform={post.platform} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(post.start)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatTime(post.start)}</TableCell>
                    <TableCell>
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`View ${post.title}`}
                          onClick={() => openView(post)}
                        >
                          <Eye size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${post.title}`}
                          onClick={() => openEdit(post)}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${post.title}`}
                          onClick={() => openDelete(post)}
                        >
                          <Trash2 size={15} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-border flex items-center justify-between border-t px-4 py-3">
            <span className="text-muted-foreground text-xs">
              Page {current + 1} of {pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={current >= pages - 1}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
