/** Shared draft / publish types + localStorage helpers. */

export type Draft = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
};

export type SocialPlatform = "facebook" | "instagram" | "twitter" | "linkedin";

export type PublishedPost = {
  id: string;
  draftId: string;
  title: string;
  content: string;
  hashtags: string;
  platforms: SocialPlatform[];
  imageDataUrl: string | null;
  scheduledAt: string | null;
  publishedAt: string;
  status: "Published";
};

export const STORAGE_KEY = "draft-management-system:drafts";
export const PUBLISHED_STORAGE_KEY = "draft-management-system:published";

export const CATEGORIES = ["General", "Tech", "Personal", "Work", "Ideas"] as const;

export const PLATFORMS: {
  id: SocialPlatform;
  label: string;
  short: string;
}[] = [
  { id: "facebook", label: "Facebook", short: "FB" },
  { id: "instagram", label: "Instagram", short: "IG" },
  { id: "twitter", label: "X (Twitter)", short: "X" },
  { id: "linkedin", label: "LinkedIn", short: "IN" },
];

export const TWITTER_LIMIT = 280;

/** Read drafts from localStorage, tolerating corrupt data. */
export function loadDrafts(): Draft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Draft[]) : [];
  } catch {
    return [];
  }
}

/** Persist drafts to localStorage. */
export function saveDrafts(drafts: Draft[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

/** Read published posts from localStorage. */
export function loadPublished(): PublishedPost[] {
  try {
    const raw = localStorage.getItem(PUBLISHED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PublishedPost[]) : [];
  } catch {
    return [];
  }
}

/** Persist published posts to localStorage. */
export function savePublished(posts: PublishedPost[]) {
  localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(posts));
}

/** Simulated network latency for async/await feedback. */
export const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mock social publish API — no real network call. */
export async function mockPublishPost(_payload: {
  platforms: SocialPlatform[];
  title: string;
  content: string;
  hashtags: string;
  imageDataUrl: string | null;
  scheduledAt: string | null;
}): Promise<{ ok: true }> {
  await delay(2000);
  return { ok: true };
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function platformLabel(id: SocialPlatform) {
  return PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

/** Build the full post body used for character counts and previews. */
export function composePostBody(content: string, hashtags: string) {
  const tags = hashtags.trim();
  if (!tags) return content.trim();
  return `${content.trim()}\n\n${tags}`.trim();
}

export function twitterCharCount(title: string, content: string, hashtags: string) {
  const body = composePostBody(content, hashtags);
  const combined = title.trim() ? `${title.trim()}\n\n${body}` : body;
  return combined.length;
}
