import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearFilters,
  toggleCategoryFilter,
  togglePlatformFilter,
  toggleStatusFilter,
} from "@/store/postSlice";
import { CATEGORIES, PLATFORMS, STATUSES } from "@/lib/types";

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "focus-visible:ring-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function FilterToolbar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.posts.filters);
  const active =
    filters.platforms.length + filters.statuses.length + filters.categories.length > 0 ||
    filters.search.length > 0;

  return (
    <div className="border-border bg-card space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground w-20 text-xs font-semibold uppercase">Platform</span>
        {PLATFORMS.map((p) => (
          <Chip
            key={p}
            label={p}
            active={filters.platforms.includes(p)}
            onClick={() => dispatch(togglePlatformFilter(p))}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground w-20 text-xs font-semibold uppercase">Status</span>
        {STATUSES.map((s) => (
          <Chip
            key={s}
            label={s}
            active={filters.statuses.includes(s)}
            onClick={() => dispatch(toggleStatusFilter(s))}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground w-20 text-xs font-semibold uppercase">Category</span>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={c}
            active={filters.categories.includes(c)}
            onClick={() => dispatch(toggleCategoryFilter(c))}
          />
        ))}
        {active && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => dispatch(clearFilters())}
          >
            <X size={14} /> Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
