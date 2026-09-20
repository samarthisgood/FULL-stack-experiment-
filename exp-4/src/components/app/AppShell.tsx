import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  Menu,
  Plus,
  Search,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSearch } from "@/store/postSlice";
import { usePostDialogs } from "./PostDialogs";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/posts", label: "Posts", icon: ListChecks },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-sidebar-ring data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none data-[status=active]:shadow-sm"
        >
          <Icon size={17} aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <span className="bg-sidebar-primary text-sidebar-primary-foreground grid size-9 shrink-0 place-items-center rounded-xl">
        <Sparkles size={18} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="font-display text-sidebar-foreground block truncate text-base font-semibold">
          PostFlow
        </span>
        <span className="text-sidebar-foreground/60 block truncate text-xs">Content scheduler</span>
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const search = useAppSelector((s) => s.posts.filters.search);
  const upcoming = useAppSelector(
    (s) => s.posts.posts.filter((p) => p.status === "Scheduled").length,
  );
  const { openCreate } = usePostDialogs();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <aside className="bg-sidebar border-sidebar-border fixed inset-y-0 left-0 hidden w-64 flex-col justify-between border-r p-4 lg:flex">
        <div className="space-y-6">
          <Brand />
          <NavLinks />
        </div>
        <div className="bg-sidebar-accent/60 text-sidebar-foreground/80 rounded-xl p-3 text-xs">
          <p className="text-sidebar-foreground font-medium">{upcoming} posts queued</p>
          <p className="mt-1">Drag events on the calendar to reschedule instantly.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="bg-background/85 border-border sticky top-0 z-30 border-b backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-sidebar w-72 p-4">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="space-y-6">
                    <Brand />
                    <NavLinks onNavigate={() => setMobileOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="relative min-w-0">
              <Search
                size={16}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                placeholder="Search posts, captions, hashtags…"
                aria-label="Search posts"
                className="bg-card pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell size={18} />
                <span className="bg-accent absolute top-2 right-2 size-2 rounded-full" />
              </Button>
              <span className="border-border bg-card hidden items-center gap-2 rounded-full border py-1 pr-3 pl-1 sm:flex">
                <span className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-full text-xs font-semibold">
                  SP
                </span>
                <span className="text-sm font-medium">Samarth</span>
              </span>
              <Button onClick={() => openCreate()} className="shrink-0">
                <Plus size={16} />
                <span className="hidden sm:inline">Create Post</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
