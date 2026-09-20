import { Facebook, Instagram, Linkedin, Youtube, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORM_STYLES, STATUS_STYLES, type Platform, type Status } from "@/lib/types";

const icons: Record<Platform, typeof Instagram> = {
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  X: Hash,
};

export function PlatformBadge({ platform, className }: { platform: Platform; className?: string }) {
  const Icon = icons[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        PLATFORM_STYLES[platform].chip,
        className,
      )}
    >
      <Icon size={13} aria-hidden />
      {platform}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

export function PlatformDot({ platform }: { platform: Platform }) {
  return (
    <span
      className={cn("inline-block size-2 shrink-0 rounded-full", PLATFORM_STYLES[platform].dot)}
      aria-hidden
    />
  );
}
