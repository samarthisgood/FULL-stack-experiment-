import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { usePermissions } from "@/hooks/use-permissions";
import { roleLabel } from "@/lib/permissions";
import { notify } from "@/components/Toast";

export function Navbar({ onMenu }: { onMenu: () => void }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const drafts = useAppSelector((s) => s.drafts.drafts);
  const user = useAppSelector((s) => s.auth.user);
  const { canCreate } = usePermissions();

  const handleLogout = () => {
    dispatch(logout());
    notify.success("Signed out successfully.");
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/85 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">Draft Management System</p>
        <p className="truncate text-xs text-muted-foreground">
          {drafts.length} draft{drafts.length === 1 ? "" : "s"} in workspace
          {user ? ` · signed in as ${user.name}` : ""}
        </p>
      </div>

      {user && (
        <Badge variant="outline" className="hidden sm:inline-flex">
          {roleLabel(user.role)}
        </Badge>
      )}

      {canCreate && (
        <Button asChild size="sm">
          <Link to="/create">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Draft</span>
          </Link>
        </Button>
      )}

      <Button size="sm" variant="outline" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </header>
  );
}
