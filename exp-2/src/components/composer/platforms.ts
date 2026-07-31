export type PlatformId = "twitter" | "instagram" | "linkedin" | "facebook";

export interface Platform {
  id: PlatformId;
  name: string;
  limit: number;
  warnAt: number;
  accent: string; // tailwind class
  ring: string;
  icon: string;
  maxHashtags?: number;
  softLimit?: boolean; // facebook: warn only
}

export const PLATFORMS: Platform[] = [
  {
    id: "twitter",
    name: "Twitter / X",
    limit: 280,
    warnAt: 250,
    accent: "bg-sky-500 text-white",
    ring: "ring-sky-500/40",
    icon: "𝕏",
  },
  {
    id: "instagram",
    name: "Instagram",
    limit: 2200,
    warnAt: 2000,
    accent: "bg-pink-500 text-white",
    ring: "ring-pink-500/40",
    icon: "◉",
    maxHashtags: 30,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    limit: 3000,
    warnAt: 2700,
    accent: "bg-blue-700 text-white",
    ring: "ring-blue-700/40",
    icon: "in",
  },
  {
    id: "facebook",
    name: "Facebook",
    limit: 5000,
    warnAt: 4500,
    accent: "bg-indigo-600 text-white",
    ring: "ring-indigo-600/40",
    icon: "f",
    softLimit: true,
  },
];

export function getPlatform(id: PlatformId): Platform {
  return PLATFORMS.find((p) => p.id === id)!;
}

export function countHashtags(text: string): number {
  const matches = text.match(/#[\p{L}0-9_]+/gu);
  return matches ? matches.length : 0;
}

export interface Issue {
  platform: PlatformId;
  level: "error" | "warning";
  message: string;
}

export function validate(text: string, selected: PlatformId[]): Issue[] {
  const issues: Issue[] = [];
  const hashtags = countHashtags(text);
  const len = text.length;

  for (const id of selected) {
    const p = getPlatform(id);
    if (len > p.limit) {
      issues.push({
        platform: id,
        level: p.softLimit ? "warning" : "error",
        message: p.softLimit
          ? `Long posts (${len}) may be truncated on ${p.name}.`
          : `Character limit exceeded for ${p.name} (${len}/${p.limit}).`,
      });
    } else if (len >= p.warnAt) {
      issues.push({
        platform: id,
        level: "warning",
        message: `Approaching ${p.name} limit (${len}/${p.limit}).`,
      });
    }

    if (p.maxHashtags && hashtags > p.maxHashtags) {
      issues.push({
        platform: id,
        level: "error",
        message: `Too many hashtags for ${p.name} (${hashtags}/${p.maxHashtags}).`,
      });
    }

    if (id === "linkedin" && /\b(lol|omg|lmao|wtf|bruh)\b/i.test(text)) {
      issues.push({
        platform: id,
        level: "warning",
        message: "Casual language detected — consider a more professional tone for LinkedIn.",
      });
    }
  }
  return issues;
}
