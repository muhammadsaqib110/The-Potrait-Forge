import { useCallback, useRef, useState } from "react";
import { Upload, X, ImagePlus } from "lucide-react";
import { fileToCompressedDataUrl, type ReferenceImage } from "@/lib/studio";

const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp";

export function ImageUploader({
  images,
  onChange,
  max = 4,
}: {
  images: ReferenceImage[];
  onChange: (next: ReferenceImage[]) => void;
  max?: number;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => /image\/(png|jpe?g|webp)/.test(f.type));
    const remaining = Math.max(0, max - images.length);
    const slice = arr.slice(0, remaining);
    const next: ReferenceImage[] = [];
    for (const f of slice) {
      const url = await fileToCompressedDataUrl(f);
      next.push({ id: crypto.randomUUID(), url, name: f.name });
    }
    onChange([...images, ...next]);
  }, [images, max, onChange]);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`group relative cursor-pointer rounded-2xl border border-dashed p-6 text-center transition-all
          ${drag ? "border-accent/70 bg-accent/5 ring-glow" : "border-border hover:border-accent/50 hover:bg-white/[0.02]"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="grid h-12 w-12 place-items-center rounded-xl glass">
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
          </div>
          <p className="text-sm font-medium">Drop reference images</p>
          <p className="text-xs text-muted-foreground">PNG · JPG · WEBP · up to {max}</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
              <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); onChange(images.filter(i => i.id !== img.id)); }}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {images.length < max && (
            <button
              onClick={() => inputRef.current?.click()}
              className="grid aspect-square place-items-center rounded-xl border border-dashed border-border text-muted-foreground hover:border-accent/50 hover:text-accent"
              aria-label="Add more"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
