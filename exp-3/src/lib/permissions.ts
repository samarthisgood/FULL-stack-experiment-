import type { UserRole } from "@/types/auth";

export function canView(_role: UserRole): boolean {
  return true;
}

export function canCreate(role: UserRole): boolean {
  return role === "admin" || role === "editor";
}

export function canEdit(role: UserRole): boolean {
  return role === "admin" || role === "editor";
}

export function canDelete(role: UserRole): boolean {
  return role === "admin";
}

export function canPublish(role: UserRole): boolean {
  return role === "admin" || role === "editor";
}

export function roleLabel(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
