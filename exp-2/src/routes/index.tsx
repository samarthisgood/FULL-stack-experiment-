import { createFileRoute } from "@tanstack/react-router";
import { PostComposer } from "@/components/composer/PostComposer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Draft Management System" },
      {
        name: "description",
        content:
          "Compose and manage drafts once, then publish across Twitter, Instagram, LinkedIn and Facebook with real-time character and hashtag validation.",
      },
      { property: "og:title", content: "Draft Management System" },
      {
        property: "og:description",
        content:
          "Multi-platform draft management with live character counts, hashtag detection and platform previews.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <PostComposer />;
}
