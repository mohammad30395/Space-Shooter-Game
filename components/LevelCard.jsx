import { CheckCircle2, Lock, Play, Target } from "lucide-react";
import Button from "@/components/Button";

const stateStyles = {
  completed: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
  unlocked: "border-cyan-300/35 bg-cyan-300/10 text-cyan-100",
  locked: "border-white/10 bg-white/5 text-slate-400"
};

export default function LevelCard({ level, state, onSelect }) {
  const locked = state === "locked";
  const completed = state === "completed";
  const Icon = locked ? Lock : completed ? CheckCircle2 : Play;

  return (
    <article className={`rounded-xl border p-5 transition ${stateStyles[state]} ${locked ? "opacity-70" : "hover:-translate-y-0.5"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Level</p>
          <h2 className="mt-1 text-3xl font-black text-white">{level.level}</h2>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-slate-950/45">
          <Icon size={18} />
        </span>
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <p className="font-semibold text-white">{level.label}</p>
        <p className="flex items-center gap-2 text-slate-300">
          <Target size={15} />
          Target {level.targetScore.toLocaleString()} pts
        </p>
      </div>

      <Button
        onClick={() => onSelect(level.level)}
        disabled={locked}
        className="mt-5 w-full"
        variant={locked ? "secondary" : completed ? "secondary" : "primary"}
      >
        {locked ? "Locked" : completed ? "Replay" : "Start"}
      </Button>
    </article>
  );
}
