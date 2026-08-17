import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { PublishedPosts } from "@/pages/PublishedPosts";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/published")({
  head: () => ({
    meta: [
      { title: "Published Posts — DraftDesk" },
      {
        name: "description",
        content:
          "Every simulated published post across Instagram, Facebook, X and LinkedIn with platform filters.",
      },
      { property: "og:title", content: "Published Posts — DraftDesk" },
      {
        property: "og:description",
        content: "Review posts published to each social platform.",
      },
    ],
  }),
  beforeLoad: () => {
    requireAuth();
  },
  component: PublishedPage,
});

function PublishedPage() {
  return (
    <AppLayout
      title="Published Posts"
      description="Posts that have been published (simulated) to your selected platforms."
    >
      <PublishedPosts />
    </AppLayout>
  );
}
