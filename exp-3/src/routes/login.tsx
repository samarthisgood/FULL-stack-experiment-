import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/Login";
import { requireGuest } from "@/lib/route-guards";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — DraftDesk" },
      {
        name: "description",
        content: "Sign in to DraftDesk with your admin, editor or viewer account.",
      },
      { property: "og:title", content: "Sign In — DraftDesk" },
      {
        property: "og:description",
        content: "Role-based access to the draft management workspace.",
      },
    ],
  }),
  beforeLoad: () => {
    requireGuest();
  },
  component: LoginPage,
});
