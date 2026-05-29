import { Gamepad2, Keyboard, ListChecks, Save, ShieldCheck, Trophy } from "lucide-react";
import PageShell from "@/components/PageShell";

const ruleSections = [
  {
    title: "Move",
    icon: Keyboard,
    text: "Use Arrow keys, WASD, mouse, or touchpad on desktop. On mobile, drag on the game screen to move the ship."
  },
  {
    title: "Shoot",
    icon: Gamepad2,
    text: "Hold F, Space, or the left mouse button on desktop. On mobile, press directly on the ship to fire."
  },
  {
    title: "Win",
    icon: ShieldCheck,
    text: "Destroy enemies to gain score. Reach the level target score or defeat the boss to complete the mission."
  },
  {
    title: "Unlock",
    icon: ListChecks,
    text: "Level 1 starts unlocked. Completing each level unlocks the next level up to the boss mission."
  },
  {
    title: "Save",
    icon: Save,
    text: "Every win and game over is saved locally under the active username. No server is used."
  },
  {
    title: "Rank",
    icon: Trophy,
    text: "Leaderboard rank is sorted by best score, then highest completed level, then total wins."
  }
];

export default function RulesPage() {
  return (
    <PageShell>
      <section className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Flight manual</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Rules</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Profiles, level progress, match records, and the leaderboard are stored in localStorage for the current browser.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ruleSections.map((section) => {
          const Icon = section.icon;
          return (
            <article key={section.title} className="glass-panel rounded-xl p-5">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg border border-cyan-200/25 bg-cyan-300/10 text-cyan-100">
                <Icon size={20} />
              </div>
              <h2 className="text-xl font-black text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{section.text}</p>
            </article>
          );
        })}
      </section>
    </PageShell>
  );
}
