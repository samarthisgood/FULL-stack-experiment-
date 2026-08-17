import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { GlobalLoadingBar } from "@/components/Loader";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadDrafts, setError, setLoading } from "@/features/drafts/draftSlice";
import * as api from "@/services/mockApi";
import { notify } from "@/components/Toast";

export function AppLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const loadingMessage = useAppSelector((s) => s.drafts.loadingMessage);

  // Bootstrap: async load from localStorage through the mock API on app start.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      dispatch(setLoading({ loading: true, message: "Loading drafts..." }));
      try {
        const [drafts, publishedPosts, scheduledPosts] = await Promise.all([
          api.getDrafts(),
          api.getPublishedPosts(),
          api.getScheduledPosts(),
        ]);
        if (cancelled) return;
        dispatch(loadDrafts({ drafts, publishedPosts, scheduledPosts }));
        dispatch(setLoading({ loading: false }));
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Something went wrong!";
        dispatch(setError(message));
        notify.error(message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
      </div>
      <GlobalLoadingBar message={loadingMessage} />
    </div>
  );
}
