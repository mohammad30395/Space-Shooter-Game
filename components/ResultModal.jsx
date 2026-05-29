import { Trophy, XCircle } from "lucide-react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

export default function ResultModal({ result, onPlayAgain, onNextLevel, onBackToLevels, onHome }) {
  if (!result) return null;

  const won = result.result === "Win";

  return (
    <Modal title={won ? "Mission complete" : "Mission failed"} showClose={false}>
      <div className="flex items-center gap-4">
        <div className={`grid h-14 w-14 place-items-center rounded-xl border ${won ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-100" : "border-rose-300/30 bg-rose-300/15 text-rose-100"}`}>
          {won ? <Trophy size={26} /> : <XCircle size={26} />}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Result</p>
          <p className="text-2xl font-black text-white">{result.result}</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        {[
          ["Player", result.name],
          ["Username", `@${result.username}`],
          ["Level", result.level],
          ["Playground", result.playgroundName],
          ["Score", result.score.toLocaleString()]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <dt className="text-slate-400">{label}</dt>
            <dd className="mt-1 font-bold text-white">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button onClick={onPlayAgain} variant="primary">Play Again</Button>
        {won && result.nextLevelAvailable ? (
          <Button onClick={onNextLevel} variant="secondary">Next Level</Button>
        ) : null}
        <Button onClick={onBackToLevels} variant="secondary">Back to Levels</Button>
        <Button onClick={onHome} variant="ghost">Home</Button>
      </div>
    </Modal>
  );
}
