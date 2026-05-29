import { Home, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Button from "@/components/Button";

export default function GameHUD({ hud, levelConfig, playground, soundEnabled, onPause, onRestart, onExit, onSoundToggle }) {
  const healthSlots = Array.from({ length: hud.maxHealth ?? 3 }, (_, index) => index < (hud.health ?? 0));

  return (
    <div className="glass-panel grid flex-shrink-0 grid-cols-2 gap-2 rounded-xl p-2 text-xs sm:grid-cols-[1fr_auto] sm:items-center sm:p-3">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <div className="rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2">
          <p className="text-slate-400">Level</p>
          <p className="font-black text-white">{levelConfig.level} - {levelConfig.label}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2">
          <p className="text-slate-400">Playground</p>
          <p className="font-black text-white">{playground.name}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2">
          <p className="text-slate-400">Score</p>
          <p className="font-black text-cyan-100">{(hud.score ?? 0).toLocaleString()} / {levelConfig.targetScore.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2">
          <p className="text-slate-400">Hull</p>
          <div className="mt-1 flex gap-1">
            {healthSlots.map((active, index) => (
              <span
                key={index}
                className={`h-3 w-6 rounded-full ${active ? "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.6)]" : "bg-slate-700"}`}
              />
            ))}
          </div>
        </div>
        <div className="col-span-2 rounded-lg border border-white/10 bg-slate-950/55 px-3 py-2 sm:col-span-1">
          <p className="text-slate-400">Controls</p>
          <p className="hidden font-black text-white sm:block">Arrows/WASD/Mouse - F/Click</p>
          <p className="font-black text-white sm:hidden">Drag screen - Press ship</p>
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-end gap-2 sm:col-span-1">
        <Button onClick={onSoundToggle} variant="secondary" size="sm" aria-label="Toggle sound" title="Toggle sound">
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="hidden xs:inline">{soundEnabled ? "Sound" : "Muted"}</span>
        </Button>
        <Button onClick={onPause} variant="secondary" size="sm" className="min-w-24">
          {hud.paused ? <Play size={16} /> : <Pause size={16} />}
          {hud.paused ? "Resume" : "Pause"}
        </Button>
        <Button onClick={onRestart} variant="secondary" size="sm" aria-label="Restart game" title="Restart">
          <RotateCcw size={16} />
          <span className="hidden xs:inline">Restart</span>
        </Button>
        <Button onClick={onExit} variant="ghost" size="sm" aria-label="Exit to levels" title="Exit">
          <Home size={16} />
          <span className="hidden xs:inline">Exit</span>
        </Button>
      </div>
    </div>
  );
}
