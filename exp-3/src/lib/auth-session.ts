import type { AuthUser } from "@/types/auth";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

export const AUTH_STORAGE_KEY = "authSession";

export function getStoredSession(): AuthUser | null {
  return loadFromStorage<AuthUser | null>(AUTH_STORAGE_KEY, null);
}

export function saveSession(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    saveToStorage(AUTH_STORAGE_KEY, user);
    return;
  }
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
