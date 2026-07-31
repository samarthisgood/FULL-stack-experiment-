import { useCallback, useRef, useState } from "react";

export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  name: string;
}

interface Props {
  media: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}

export function MediaUploader({ media, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const next: MediaItem[] = [];
      Array.from(files).forEach((f) => {
        const type = f.type.startsWith("video") ? "video" : "image";
        next.push({
          id: crypto.randomUUID(),
          url: URL.createObjectURL(f),
          type,
          name: f.name,
        });
      });
      onChange([...media, ...next]);
    },
    [media, onChange],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition",
          dragging ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/60",
        ].join(" ")}
      >
        <div className="text-2xl">⇪</div>
        <div className="text-sm font-medium">Drop media or click to upload</div>
        <div className="text-xs text-muted-foreground">Images or video</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {media.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {media.map((m) => (
            <div
              key={m.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              {m.type === "image" ? (
                <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
              ) : (
                <video src={m.url} className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => onChange(media.filter((item) => item.id !== m.id))}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
