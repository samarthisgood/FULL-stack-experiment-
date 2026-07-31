import type { Issue } from "./platforms";

interface Props {
  issues: Issue[];
}

export function ValidationMessage({ issues }: Props) {
  if (issues.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2">
      {issues.map((i, idx) => (
        <li
          key={idx}
          className={[
            "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
            i.level === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
          ].join(" ")}
        >
          <span aria-hidden className="mt-0.5">
            {i.level === "error" ? "✕" : "!"}
          </span>
          <span className="min-w-0">{i.message}</span>
        </li>
      ))}
    </ul>
  );
}
