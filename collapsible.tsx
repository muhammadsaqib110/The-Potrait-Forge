import { useEffect, useState } from "react";
import { Download, Trash2, ZoomIn } from "lucide-react";
import { loadGallery, removeGalleryItem, downloadDataUrl, type GalleryItem } from "@/lib/studio";

export function Gallery({ refreshKey, onZoom }: { refreshKey: number; onZoom: (url: string) => void }) {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => { setItems(loadGallery()); }, [refreshKey]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl glass p-10 text-center">
        <p className="text-sm text-muted-foreground">Your generations will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
          <img src={it.url} alt={it.prompt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <p className="line-clamp-2 text-xs text-white/90">{it.prompt}</p>
            <div className="mt-2 flex gap-1.5">
              <button onClick={() => onZoom(it.url)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20"><ZoomIn className="h-3.5 w-3.5" /></button>
              <button onClick={() => downloadDataUrl(it.url, `portrait-${it.id}.png`)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20"><Download className="h-3.5 w-3.5" /></button>
              <button onClick={() => { removeGalleryItem(it.id); setItems(loadGallery()); }} className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-destructive/40"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
          <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/80">{it.style}</span>
        </div>
      ))}
    </div>
  );
}
