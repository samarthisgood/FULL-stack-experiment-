// localStorage helpers — safe for SSR (guards `window`).

export const STORAGE_KEYS = {
  drafts: "drafts",
  publishedPosts: "publishedPosts",
  scheduledPosts: "scheduledPosts",
  authSession: "authSession",
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota errors ignored in this experiment */
  }
}
