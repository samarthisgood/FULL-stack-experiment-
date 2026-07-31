/** Small inline loading indicator used for simulated async operations. */
export function Loader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {label}
    </div>
  );
}
