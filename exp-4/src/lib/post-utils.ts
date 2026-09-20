import { format, isSameMonth, isSameWeek, parseISO } from "date-fns";
import type { Filters } from "@/store/postSlice";
import type { Post } from "./types";

export const filterPosts = (posts: Post[], filters: Filters): Post[] => {
  const q = filters.search.trim().toLowerCase();
  return posts.filter((p) => {
    if (filters.platforms.length && !filters.platforms.includes(p.platform)) return false;
    if (filters.statuses.length && !filters.statuses.includes(p.status)) return false;
    if (filters.categories.length && !filters.categories.includes(p.category)) return false;
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.hashtags.some((h) => h.toLowerCase().includes(q))
    );
  });
};

export const sortByStart = (posts: Post[]) =>
  [...posts].sort((a, b) => a.start.localeCompare(b.start));

export const formatDate = (iso: string) => format(parseISO(iso), "EEE d MMM yyyy");
export const formatTime = (iso: string) => format(parseISO(iso), "HH:mm");
export const formatDateTime = (iso: string) => format(parseISO(iso), "EEE d MMM yyyy 'at' HH:mm");

export const countsBy = <K extends string>(posts: Post[], key: (p: Post) => K) =>
  posts.reduce<Record<string, number>>((acc, p) => {
    const k = key(p);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

export const metrics = (posts: Post[], weekStart: 0 | 1) => {
  const now = new Date();
  return {
    total: posts.length,
    scheduled: posts.filter((p) => p.status === "Scheduled").length,
    published: posts.filter((p) => p.status === "Published").length,
    drafts: posts.filter((p) => p.status === "Draft").length,
    thisWeek: posts.filter((p) =>
      isSameWeek(parseISO(p.start), now, { weekStartsOn: weekStart }),
    ).length,
    thisMonth: posts.filter((p) => isSameMonth(parseISO(p.start), now)).length,
  };
};
