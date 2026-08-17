import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { DraftForm } from "@/components/DraftForm";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";
import { requireEditAccess } from "@/lib/route-guards";

export const Route = createFileRoute("/drafts/$draftId/edit")({
  head: () => ({
    meta: [
      { title: "Edit Draft — DraftDesk" },
      {
        name: "description",
        content: "Edit an existing draft and update its content, category, tags and image.",
      },
      { property: "og:title", content: "Edit Draft — DraftDesk" },
      {
        property: "og:description",
        content: "Update a saved draft in your workspace.",
      },
    ],
  }),
  beforeLoad: () => {
    requireEditAccess();
  },
  component: EditDraftPage,
});

function EditDraftPage() {
  const { draftId } = Route.useParams();
  const { drafts, loading } = useAppSelector((s) => s.drafts);
  const draft = drafts.find((d) => d.id === draftId);

  return (
    <AppLayout
      title="Edit Draft"
      description="Modify the draft and save your changes. The updated timestamp refreshes automatically."
    >
      {!draft ? (
        loading ? (
          <Loader message="Loading drafts..." />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <p className="text-lg font-semibold">Draft not found</p>
            <p className="text-sm text-muted-foreground">
              It may have been deleted from your workspace.
            </p>
            <Button asChild>
              <Link to="/drafts">Back to drafts</Link>
            </Button>
          </div>
        )
      ) : (
        <DraftForm existing={draft} />
      )}
    </AppLayout>
  );
}
