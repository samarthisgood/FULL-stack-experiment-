import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DraftCard } from "@/components/DraftCard";
import { PublishModal } from "@/components/PublishModal";
import { CATEGORIES, type Draft } from "@/types/draft";
import { usePermissions } from "@/hooks/use-permissions";

type SortKey = "newest" | "oldest" | "az" | "za";

export function DraftList({ drafts }: { drafts: Draft[] }) {
  const { canCreate, canPublish } = usePermissions();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("newest");
  const [publishing, setPublishing] = useState<Draft | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = drafts.filter((d) => {
      const matchesSearch =
        !q ||
        [d.title, d.content, d.category, d.author, d.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesCategory = category === "All" || d.category === category;
      return matchesSearch && matchesCategory;
    });

    list = [...list].sort((a, b) => {
      if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sort === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
      if (sort === "az") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });

    return list;
  }, [drafts, search, category, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, content, category, author or tag..."
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="az">Title A-Z</SelectItem>
            <SelectItem value="za">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <FileText className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">
            {drafts.length === 0 ? "No Drafts Available" : "No matching drafts"}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {drafts.length === 0
              ? "Create your first draft to get started with publishing."
              : "Try a different search term, category or sort order."}
          </p>
          {drafts.length === 0 && canCreate && (
            <Button asChild className="mt-1">
              <Link to="/create">Create Draft</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((d) => (
            <DraftCard
              key={d.id}
              draft={d}
              onPublish={canPublish ? setPublishing : () => undefined}
            />
          ))}
        </div>
      )}

      {canPublish && (
        <PublishModal
          draft={publishing}
          open={publishing !== null}
          onOpenChange={(o) => !o && setPublishing(null)}
        />
      )}
    </div>
  );
}
