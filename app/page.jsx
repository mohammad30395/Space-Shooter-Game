import { Play, Settings, Trophy, ScrollText } from "lucide-react";
import Button from "@/components/Button";
import PageShell from "@/components/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <section className="grid min-h-[calc(100dvh-132px)] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-200">Local arcade mission</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            Nebula Strike
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Pilot through hostile sectors, unlock ten escalating levels, and push your best score onto a
            local leaderboard stored entirely in your browser.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
            <Button href="/play" size="lg">
              <Play size={20} />
              Play
            </Button>
            <Button href="/rules" size="lg" variant="secondary">
              <ScrollText size={20} />
              Rules
            </Button>
            <Button href="/settings" size="lg" variant="secondary">
              <Settings size={20} />
              Settings
            </Button>
            <Button href="/leaderboard" size="lg" variant="secondary">
              <Trophy size={20} />
              Leaderboard
            </Button>
          </div>
        </div>

        <div className="glass-panel neon-ring rounded-xl p-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-slate-950 via-indigo-950 to-cyan-950">
            <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_16%_18%,white_0_1px,transparent_1px),radial-gradient(circle_at_72%_32%,white_0_1px,transparent_1px),radial-gradient(circle_at_44%_74%,white_0_1px,transparent_1px)] [background-size:54px_54px,92px_92px,68px_68px]" />
            <div className="absolute left-1/2 top-[62%] h-20 w-16 -translate-x-1/2 [clip-path:polygon(50%_0,100%_100%,50%_78%,0_100%)] bg-cyan-300 shadow-glow" />
            <div className="absolute left-[22%] top-[18%] h-12 w-12 rotate-45 rounded-md border border-rose-200/40 bg-rose-500/70 shadow-magenta" />
            <div className="absolute right-[20%] top-[36%] h-10 w-10 rotate-45 rounded-md border border-fuchsia-200/40 bg-fuchsia-500/65 shadow-magenta" />
            <div className="absolute left-[42%] top-[28%] h-16 w-1 rounded-full bg-cyan-200 shadow-glow" />
            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">
              {["Score", "Hull", "Level"].map((label) => (
                <div key={label} className="rounded-lg border border-white/10 bg-slate-950/65 p-3">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-black text-white">{label === "Hull" ? "3/3" : label === "Level" ? "1" : "000"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
