import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { DraftList } from "@/components/DraftList";
import { Loader } from "@/components/Loader";
import { useAppSelector } from "@/app/hooks";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/drafts/")({
  head: () => ({
    meta: [
      { title: "Drafts — DraftDesk" },
      {
        name: "description",
        content:
          "Browse, search, filter and sort every saved draft. View, edit, delete or publish each one.",
      },
      { property: "og:title", content: "Drafts — DraftDesk" },
      {
        property: "og:description",
        content: "All your saved drafts with search, filter and sort.",
      },
    ],
  }),
  beforeLoad: () => {
    requireAuth();
  },
  component: DraftsPage,
});

function DraftsPage() {
  const { drafts, loading, loadingMessage } = useAppSelector((s) => s.drafts);

  return (
    <AppLayout
      title="Drafts"
      description="Search, filter and sort your drafts. Actions available depend on your role."
    >
      {loading && drafts.length === 0 ? (
        <Loader message={loadingMessage || "Loading drafts..."} />
      ) : (
        <DraftList drafts={drafts} />
      )}
    </AppLayout>
  );
}
