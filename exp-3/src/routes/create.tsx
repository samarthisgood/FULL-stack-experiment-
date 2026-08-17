import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { DraftForm } from "@/components/DraftForm";
import { requireCreateAccess } from "@/lib/route-guards";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Draft — DraftDesk" },
      {
        name: "description",
        content:
          "Create a new draft with title, content, category, tags, author and image before publishing to social media.",
      },
      { property: "og:title", content: "Create Draft — DraftDesk" },
      {
        property: "og:description",
        content: "Write a new draft and save it to your workspace.",
      },
    ],
  }),
  beforeLoad: () => {
    requireCreateAccess();
  },
  component: CreateDraftPage,
});

function CreateDraftPage() {
  return (
    <AppLayout
      title="Create Draft"
      description="Fill in the details below and save your draft. Title, content and category are required."
    >
      <DraftForm />
    </AppLayout>
  );
}
