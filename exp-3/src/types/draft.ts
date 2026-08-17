export type DraftStatus = "draft" | "published" | "scheduled";

export interface Draft {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  status: DraftStatus;
}

export type Platform = "Instagram" | "Facebook" | "X" | "LinkedIn";

export const PLATFORMS: Platform[] = ["Instagram", "Facebook", "X", "LinkedIn"];

export const CATEGORIES = [
  "Technology",
  "Education",
  "Sports",
  "Entertainment",
  "Personal",
  "Other",
] as const;

export interface PublishedPost {
  id: string;
  draftId: string;
  title: string;
  content: string;
  platform: Platform;
  image: string;
  hashtags: string[];
  publishedAt: string;
  status: "published";
}

export interface ScheduledPost {
  id: string;
  draftId: string;
  title: string;
  content: string;
  platform: Platform;
  image: string;
  hashtags: string[];
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  status: "scheduled";
}

export function createEmptyDraft(): Draft {
  const now = new Date().toISOString();
  return {
    id: "",
    title: "",
    content: "",
    category: "",
    tags: [],
    author: "",
    image: "",
    createdAt: now,
    updatedAt: now,
    status: "draft",
  };
}
