import type { ReactNode } from "react";
import {
  composePostBody,
  TWITTER_LIMIT,
  twitterCharCount,
  type SocialPlatform,
} from "@/lib/drafts";

type PreviewProps = {
  title: string;
  content: string;
  hashtags: string;
  imageDataUrl: string | null;
};

function Avatar({ initials, tone }: { initials: string; tone: string }) {
  return (
    <span
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${tone}`}
    >
      {initials}
    </span>
  );
}

export function FacebookPreview({ title, content, hashtags, imageDataUrl }: PreviewProps) {
  const body = composePostBody(content, hashtags);
  return (
    <div className="overflow-hidden rounded-xl border border-[#CCD0D5] bg-white text-[#050505] shadow-sm">
      <div className="flex items-center gap-3 p-3">
        <Avatar initials="DK" tone="bg-[#1877F2]" />
        <div>
          <p className="text-sm font-semibold">Draft Keeper</p>
          <p className="text-xs text-[#65676B]">Just now · Public</p>
        </div>
      </div>
      <div className="space-y-2 px-3 pb-3">
        {title.trim() && <p className="text-sm font-semibold">{title}</p>}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{body || "Your Facebook post preview…"}</p>
      </div>
      {imageDataUrl && (
        <img src={imageDataUrl} alt="" className="max-h-56 w-full object-cover" />
      )}
      <div className="flex justify-between border-t border-[#CCD0D5] px-3 py-2 text-xs text-[#65676B]">
        <span>Like</span>
        <span>Comment</span>
        <span>Share</span>
      </div>
    </div>
  );
}

export function InstagramPreview({ title, content, hashtags, imageDataUrl }: PreviewProps) {
  const caption = [title.trim(), composePostBody(content, hashtags)].filter(Boolean).join("\n\n");
  return (
    <div className="overflow-hidden rounded-xl border border-[#DBDBDB] bg-white text-[#262626] shadow-sm">
      <div className="flex items-center gap-3 p-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[2px]">
          <span className="grid h-full w-full place-items-center rounded-full bg-white text-[10px] font-bold">
            DK
          </span>
        </span>
        <p className="text-sm font-semibold">draft_keeper</p>
      </div>
      <div className="aspect-square bg-[#FAFAFA]">
        {imageDataUrl ? (
          <img src={imageDataUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-[#8E8E8E]">
            Add an image to preview your Instagram post
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <p className="text-xs font-semibold tracking-wide">♡ &nbsp; 💬 &nbsp; ✉</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          <span className="font-semibold">draft_keeper </span>
          {caption || "Your Instagram caption…"}
        </p>
      </div>
    </div>
  );
}

export function TwitterPreview({ title, content, hashtags, imageDataUrl }: PreviewProps) {
  const count = twitterCharCount(title, content, hashtags);
  const over = count > TWITTER_LIMIT;
  const body = composePostBody(content, hashtags);
  return (
    <div className="overflow-hidden rounded-xl border border-[#CFD9DE] bg-white text-[#0F1419] shadow-sm">
      <div className="flex gap-3 p-3">
        <Avatar initials="DK" tone="bg-[#0F1419]" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1 text-sm">
            <span className="font-bold">Draft Keeper</span>
            <span className="text-[#536471]">@draftkeeper · now</span>
          </div>
          {title.trim() && <p className="mt-1 text-sm font-semibold">{title}</p>}
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
            {body || "Your X post preview…"}
          </p>
          {imageDataUrl && (
            <img
              src={imageDataUrl}
              alt=""
              className="mt-3 max-h-48 w-full rounded-2xl object-cover"
            />
          )}
          <div className="mt-3 flex items-center justify-between text-xs text-[#536471]">
            <span>Reply · Repost · Like · Share</span>
            <span className={over ? "font-semibold text-[#F4212E]" : "font-medium"}>
              {count}/{TWITTER_LIMIT}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LinkedInPreview({ title, content, hashtags, imageDataUrl }: PreviewProps) {
  const body = composePostBody(content, hashtags);
  return (
    <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white text-[#000000E6] shadow-sm">
      <div className="flex items-start gap-3 p-3">
        <Avatar initials="DK" tone="bg-[#0A66C2]" />
        <div>
          <p className="text-sm font-semibold">Draft Keeper</p>
          <p className="text-xs text-[#00000099]">Content Creator · Just now</p>
        </div>
      </div>
      <div className="space-y-2 px-3 pb-3">
        {title.trim() && <p className="text-sm font-semibold">{title}</p>}
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#000000E6]">
          {body || "Your professional LinkedIn post preview…"}
        </p>
      </div>
      {imageDataUrl && (
        <img src={imageDataUrl} alt="" className="max-h-56 w-full object-cover" />
      )}
      <div className="flex justify-between border-t border-[#E0E0E0] px-4 py-2 text-xs font-semibold text-[#00000099]">
        <span>Like</span>
        <span>Comment</span>
        <span>Repost</span>
        <span>Send</span>
      </div>
    </div>
  );
}

const PREVIEW_MAP: Record<SocialPlatform, (props: PreviewProps) => ReactNode> = {
  facebook: FacebookPreview,
  instagram: InstagramPreview,
  twitter: TwitterPreview,
  linkedin: LinkedInPreview,
};

export function PlatformPreview({
  platform,
  ...props
}: PreviewProps & { platform: SocialPlatform }) {
  const Preview = PREVIEW_MAP[platform];
  return <Preview {...props} />;
}
