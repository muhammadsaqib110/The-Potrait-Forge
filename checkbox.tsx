import { useRef, useState } from "react";

export function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-square w-full select-none overflow-hidden rounded-2xl border border-border"
      onMouseDown={(e) => { dragging.current = true; update(e.clientX); }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => { dragging.current = true; update(e.touches[0].clientX); }}
      onTouchMove={(e) => dragging.current && update(e.touches[0].clientX)}
      onTouchEnd={() => (dragging.current = false)}
    >
      <img src={after} alt="after" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="before" className="absolute inset-0 h-full w-full object-cover" style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none" }} />
      </div>
      <div className="absolute inset-y-0 w-px bg-white/80 shadow-glow" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white text-black shadow-glow">
          <span className="text-xs">⇆</span>
        </div>
      </div>
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/80">Before</span>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/80">After</span>
    </div>
  );
}
