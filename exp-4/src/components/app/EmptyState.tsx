import { CalendarX, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePostDialogs } from "./PostDialogs";

export function EmptyState({
  title = "No scheduled posts found",
  description = "Try clearing your filters, or add something new to the calendar.",
}: {
  title?: string;
  description?: string;
}) {
  const { openCreate } = usePostDialogs();
  return (
    <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
      <span className="bg-muted text-muted-foreground grid size-12 place-items-center rounded-full">
        <CalendarX size={22} aria-hidden />
      </span>
      <h3 className="font-display mt-4 text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">{description}</p>
      <Button className="mt-5" onClick={() => openCreate()}>
        <Plus size={16} /> Create Post
      </Button>
    </div>
  );
}
