import { Gauge, MapPinned } from "lucide-react";
import Button from "@/components/Button";

export default function PlaygroundCard({ playground, selected = false, onSelect }) {
  return (
    <article className="glass-panel flex h-full flex-col overflow-hidden rounded-xl">
      <div className={`relative h-36 bg-gradient-to-br ${playground.previewClass}`}>
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,white_0_1px,transparent_1px),radial-gradient(circle_at_72%_42%,white_0_1px,transparent_1px),radial-gradient(circle_at_40%_80%,white_0_1px,transparent_1px)] [background-size:42px_42px,58px_58px,70px_70px]" />
        <div
          className="absolute bottom-4 left-4 h-10 w-10 rounded-full border border-white/25"
          style={{ backgroundColor: `${playground.accent}33`, boxShadow: `0 0 28px ${playground.accent}66` }}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white">{playground.name}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-cyan-100">
              <Gauge size={15} />
              {playground.difficulty}
            </p>
          </div>
          {selected ? (
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-100">
              Selected
            </span>
          ) : null}
        </div>

        <p className="mt-4 flex-1 text-sm leading-6 text-slate-300">{playground.description}</p>

        <Button onClick={() => onSelect(playground.id)} className="mt-5 w-full" variant={selected ? "secondary" : "primary"}>
          <MapPinned size={17} />
          Select
        </Button>
      </div>
    </article>
  );
}
