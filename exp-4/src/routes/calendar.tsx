import { createFileRoute } from "@tanstack/react-router";
import { CalendarBoard } from "@/components/app/CalendarBoard";
import { FilterToolbar } from "@/components/app/FilterToolbar";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Content Calendar — PostFlow" },
      {
        name: "description",
        content:
          "Drag-and-drop social media calendar with month, week, day and agenda views for every scheduled post.",
      },
      { property: "og:title", content: "Content Calendar — PostFlow" },
      {
        property: "og:description",
        content: "Reschedule posts by dragging them across month, week, day and agenda views.",
      },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Content calendar</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Drag posts across dates and time slots to reschedule. Click an empty slot to create.
          </p>
        </div>
      </header>
      <FilterToolbar />
      <CalendarBoard />
    </div>
  );
}
