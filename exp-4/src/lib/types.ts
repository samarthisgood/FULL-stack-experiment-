export const PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "X", "YouTube"] as const;
export const STATUSES = ["Draft", "Scheduled", "Published", "Failed"] as const;
export const CATEGORIES = [
  "Marketing",
  "Education",
  "Announcement",
  "Promotion",
  "Personal",
] as const;

export type Platform = (typeof PLATFORMS)[number];
export type Status = (typeof STATUSES)[number];
export type Category = (typeof CATEGORIES)[number];

export interface Post {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  category: Category;
  status: Status;
  /** ISO timestamp */
  start: string;
  /** ISO timestamp */
  end: string;
  timezone: string;
  imageUrl?: string | undefined;
  hashtags: string[];
  notes?: string | undefined;
}

export interface Settings {
  defaultView: "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek";
  timezone: string;
  weekStart: 0 | 1;
  notifications: boolean;
}

export const PLATFORM_STYLES: Record<Platform, { dot: string; chip: string; hex: string }> = {
  Instagram: {
    dot: "bg-platform-instagram",
    chip: "bg-platform-instagram/12 text-platform-instagram",
    hex: "#c2418a",
  },
  Facebook: {
    dot: "bg-platform-facebook",
    chip: "bg-platform-facebook/12 text-platform-facebook",
    hex: "#2b62c4",
  },
  LinkedIn: {
    dot: "bg-platform-linkedin",
    chip: "bg-platform-linkedin/12 text-platform-linkedin",
    hex: "#0a6e8f",
  },
  X: { dot: "bg-platform-x", chip: "bg-platform-x/12 text-platform-x", hex: "#2a2a2e" },
  YouTube: {
    dot: "bg-platform-youtube",
    chip: "bg-platform-youtube/12 text-platform-youtube",
    hex: "#c2352c",
  },
};

export const STATUS_STYLES: Record<Status, string> = {
  Draft: "bg-muted text-muted-foreground border border-border",
  Scheduled: "bg-accent/15 text-accent-foreground border border-accent/30",
  Published: "bg-success/15 text-success border border-success/30",
  Failed: "bg-destructive/12 text-destructive border border-destructive/30",
};

export const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
];
