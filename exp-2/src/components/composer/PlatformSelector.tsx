import { PLATFORMS, type PlatformId } from "./platforms";

interface Props {
  selected: PlatformId[];
  onToggle: (id: PlatformId) => void;
}

export function PlatformSelector({ selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((p) => {
        const active = selected.includes(p.id);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onToggle(p.id)}
            aria-pressed={active}
            className={[
              "group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active
                ? `${p.accent} border-transparent shadow-sm ring-2 ${p.ring}`
                : "border-border bg-card text-foreground hover:bg-accent",
            ].join(" ")}
          >
            <span
              className={[
                "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
                active ? "bg-white/20" : "bg-muted",
              ].join(" ")}
            >
              {p.icon}
            </span>
            <span>{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}
