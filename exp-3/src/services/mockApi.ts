// Mock API — simulates backend communication with Promises + async/await + setTimeout.
import type { Draft, PublishedPost, ScheduledPost } from "@/types/draft";
import type { UserRole } from "@/types/auth";
import { getStoredSession } from "@/lib/auth-session";
import { canCreate, canDelete, canEdit, canPublish } from "@/lib/permissions";
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from "@/utils/storage";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function maybeFail(message: string, rate = 0) {
  if (Math.random() < rate) throw new Error(message);
}

function requireRole(check: (role: UserRole) => boolean, action: string) {
  const user = getStoredSession();
  if (!user) {
    throw new Error("You must be signed in to perform this action.");
  }
  if (!check(user.role)) {
    throw new Error(`You do not have permission to ${action}.`);
  }
  return user;
}

export const getDrafts = async (): Promise<Draft[]> => {
  requireRole(() => true, "view posts");
  await delay(900);
  maybeFail("Unable to load drafts. Please try again.");
  return loadFromStorage<Draft[]>(STORAGE_KEYS.drafts, []);
};

export const getPublishedPosts = async (): Promise<PublishedPost[]> => {
  requireRole(() => true, "view published posts");
  await delay(300);
  return loadFromStorage<PublishedPost[]>(STORAGE_KEYS.publishedPosts, []);
};

export const getScheduledPosts = async (): Promise<ScheduledPost[]> => {
  requireRole(() => true, "view scheduled posts");
  await delay(300);
  return loadFromStorage<ScheduledPost[]>(STORAGE_KEYS.scheduledPosts, []);
};

export const createDraft = async (draft: Draft): Promise<Draft> => {
  requireRole(canCreate, "create posts");
  await delay(1000);
  maybeFail("Unable to save draft. Please try again.");
  const drafts = loadFromStorage<Draft[]>(STORAGE_KEYS.drafts, []);
  saveToStorage(STORAGE_KEYS.drafts, [draft, ...drafts]);
  return draft;
};

export const updateDraft = async (draft: Draft): Promise<Draft> => {
  requireRole(canEdit, "edit posts");
  await delay(1000);
  maybeFail("Unable to update draft. Please try again.");
  const drafts = loadFromStorage<Draft[]>(STORAGE_KEYS.drafts, []);
  saveToStorage(
    STORAGE_KEYS.drafts,
    drafts.map((d) => (d.id === draft.id ? draft : d)),
  );
  return draft;
};

export const deleteDraft = async (id: string): Promise<string> => {
  requireRole(canDelete, "delete posts");
  await delay(900);
  maybeFail("Unable to delete draft. Please try again.");
  const drafts = loadFromStorage<Draft[]>(STORAGE_KEYS.drafts, []);
  saveToStorage(
    STORAGE_KEYS.drafts,
    drafts.filter((d) => d.id !== id),
  );
  return id;
};

export const publishPost = async (posts: PublishedPost[]): Promise<PublishedPost[]> => {
  requireRole(canPublish, "publish posts");
  await delay(1500);
  maybeFail("Unable to publish post. Please try again.");
  const existing = loadFromStorage<PublishedPost[]>(STORAGE_KEYS.publishedPosts, []);
  saveToStorage(STORAGE_KEYS.publishedPosts, [...posts, ...existing]);
  return posts;
};

export const schedulePost = async (posts: ScheduledPost[]): Promise<ScheduledPost[]> => {
  requireRole(canPublish, "schedule posts");
  await delay(1500);
  maybeFail("Unable to schedule post. Please try again.");
  const existing = loadFromStorage<ScheduledPost[]>(STORAGE_KEYS.scheduledPosts, []);
  saveToStorage(STORAGE_KEYS.scheduledPosts, [...posts, ...existing]);
  return posts;
};
