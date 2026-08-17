import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({
  message = "Loading...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-14 text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function GlobalLoadingBar({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-card px-5 py-3 shadow-lift ring-1 ring-border">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-sm font-medium text-foreground">{message}</span>
    </div>
  );
}
