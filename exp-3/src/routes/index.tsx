import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DraftDesk Draft Management System" },
      {
        name: "description",
        content:
          "Overview of drafts, published posts and scheduled social media posts in the DraftDesk draft management system.",
      },
      { property: "og:title", content: "Dashboard — DraftDesk" },
      {
        property: "og:description",
        content: "Track drafts, published posts and scheduled posts at a glance.",
      },
    ],
  }),
  beforeLoad: () => {
    requireAuth();
  },
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppLayout
      title="Dashboard"
      description="A quick overview of your drafts, published posts and schedule."
    >
      <Dashboard />
    </AppLayout>
  );
}
