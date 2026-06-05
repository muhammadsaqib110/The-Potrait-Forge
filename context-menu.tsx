import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { downloadDataUrl } from "@/lib/studio";

export function ZoomPreview({ url, onClose }: { url: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="absolute right-4 top-4 flex gap-2">
        <button onClick={() => setScale(s => Math.max(1, s - 0.5))} className="grid h-10 w-10 place-items-center rounded-full glass-strong hover:bg-white/10">
          <ZoomOut className="h-4 w-4" />
        </button>
        <button onClick={() => setScale(s => Math.min(6, s + 0.5))} className="grid h-10 w-10 place-items-center rounded-full glass-strong hover:bg-white/10">
          <ZoomIn className="h-4 w-4" />
        </button>
        <button onClick={() => downloadDataUrl(url, `portrait-${Date.now()}.png`)} className="grid h-10 w-10 place-items-center rounded-full glass-strong hover:bg-white/10">
          <Download className="h-4 w-4" />
        </button>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full glass-strong hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div
        className="max-h-full max-w-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => { drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; }}
        onMouseMove={(e) => { if (drag.current) setPos({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }); }}
        onMouseUp={() => (drag.current = null)}
        onMouseLeave={() => (drag.current = null)}
      >
        <img
          src={url}
          alt="zoom"
          draggable={false}
          className="max-h-[90vh] max-w-[90vw] rounded-2xl transition-transform"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
        />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full glass-strong px-3 py-1 text-xs text-muted-foreground">
        Zoom: {Math.round(scale * 100)}% · Drag to pan
      </div>
    </div>
  );
}
