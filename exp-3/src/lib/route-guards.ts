import { redirect } from "@tanstack/react-router";
import { getStoredSession } from "@/lib/auth-session";
import { canCreate, canEdit } from "@/lib/permissions";
import type { AuthUser } from "@/types/auth";

export function requireAuth(): AuthUser {
  const user = getStoredSession();
  if (!user) {
    throw redirect({ to: "/login" });
  }
  return user;
}

export function requireGuest(): void {
  const user = getStoredSession();
  if (user) {
    throw redirect({ to: "/" });
  }
}

export function requireCreateAccess(): AuthUser {
  const user = requireAuth();
  if (!canCreate(user.role)) {
    throw redirect({ to: "/drafts" });
  }
  return user;
}

export function requireEditAccess(): AuthUser {
  const user = requireAuth();
  if (!canEdit(user.role)) {
    throw redirect({ to: "/drafts" });
  }
  return user;
}
