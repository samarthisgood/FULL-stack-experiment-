import { Link } from "@tanstack/react-router";
import { LayoutDashboard, FileText, PlusCircle, Send, CalendarClock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, show: () => true },
  { to: "/drafts", label: "Drafts", icon: FileText, show: () => true },
  {
    to: "/create",
    label: "Create Draft",
    icon: PlusCircle,
    show: (canCreate: boolean) => canCreate,
  },
  { to: "/published", label: "Published Posts", icon: Send, show: () => true },
  {
    to: "/scheduled",
    label: "Scheduled Posts",
    icon: CalendarClock,
    show: () => true,
  },
] as const;

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { canCreate } = usePermissions();
  const visibleNav = NAV.filter((item) => item.show(canCreate));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-primary-foreground">
              DM
            </span>
            <span className="text-base font-semibold tracking-tight">DraftDesk</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {visibleNav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              activeOptions={{ exact: to === "/" }}
              activeProps={{
                className:
                  "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-sidebar-border",
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-5 py-5 text-xs text-sidebar-foreground/50">
          Draft Management System
          <br />
          Frontend experiment · Redux Toolkit
        </div>
      </aside>
    </>
  );
}
