import { getPlatform, type PlatformId } from "./platforms";

interface Props {
  platform: PlatformId;
  length: number;
}

export function CharacterCounter({ platform, length }: Props) {
  const p = getPlatform(platform);
  const pct = Math.min(100, (length / p.limit) * 100);
  const over = length > p.limit;
  const warn = length >= p.warnAt && !over;

  const color = over ? "text-red-500" : warn ? "text-amber-500" : "text-emerald-500";
  const barColor = over ? "bg-red-500" : warn ? "bg-amber-500" : "bg-emerald-500";

  const radius = 14;
  const circ = 2 * Math.PI * radius;
  const dash = (Math.min(pct, 100) / 100) * circ;

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-9 w-9">
        <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
          <circle cx="18" cy="18" r={radius} className="stroke-muted" strokeWidth="3" fill="none" />
          <circle
            cx="18"
            cy="18"
            r={radius}
            className={barColor.replace("bg-", "stroke-")}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
          />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{p.name}</span>
        <span className={`text-xs font-semibold tabular-nums ${color}`}>
          {length}/{p.limit}
        </span>
      </div>
    </div>
  );
}
