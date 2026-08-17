import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { ScheduledPosts } from "@/pages/ScheduledPosts";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/scheduled")({
  head: () => ({
    meta: [
      { title: "Scheduled Posts — DraftDesk" },
      {
        name: "description",
        content:
          "Posts scheduled for a future date and time, stored locally and filtered by platform.",
      },
      { property: "og:title", content: "Scheduled Posts — DraftDesk" },
      {
        property: "og:description",
        content: "See what is queued to go out and when.",
      },
    ],
  }),
  beforeLoad: () => {
    requireAuth();
  },
  component: ScheduledPage,
});

function ScheduledPage() {
  return (
    <AppLayout
      title="Scheduled Posts"
      description="Upcoming posts queued with a date and time (frontend simulation only)."
    >
      <ScheduledPosts />
    </AppLayout>
  );
}
