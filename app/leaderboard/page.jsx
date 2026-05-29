"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import PageShell from "@/components/PageShell";
import { readGameData } from "@/lib/storage";

function formatDate(value) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const syncLeaderboard = () => {
      setLeaderboard(readGameData().leaderboard);
    };

    syncLeaderboard();
    window.addEventListener("space-shooter-storage", syncLeaderboard);
    window.addEventListener("storage", syncLeaderboard);

    return () => {
      window.removeEventListener("space-shooter-storage", syncLeaderboard);
      window.removeEventListener("storage", syncLeaderboard);
    };
  }, []);

  return (
    <PageShell>
      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Local ranking</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Leaderboard</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Rankings are generated from records saved on this device.
          </p>
        </div>
        <Button href="/play" variant="secondary">Change Pilot</Button>
      </section>

      {leaderboard.length === 0 ? (
        <section className="glass-panel rounded-xl p-8 text-center">
          <h2 className="text-2xl font-black text-white">No records yet</h2>
          <p className="mt-3 text-sm text-slate-300">Play a mission to create the first leaderboard entry.</p>
          <Button href="/play" className="mt-6">Play Now</Button>
        </section>
      ) : (
        <section className="glass-panel overflow-hidden rounded-xl">
          <div className="hidden grid-cols-[80px_1.2fr_1fr_120px_150px_120px_190px] gap-3 border-b border-white/10 bg-white/5 px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 lg:grid">
            <span>Rank</span>
            <span>Name</span>
            <span>Username</span>
            <span>Score</span>
            <span>Level</span>
            <span>Wins</span>
            <span>Last Played</span>
          </div>

          <div className="divide-y divide-white/10">
            {leaderboard.map((entry, index) => (
              <article
                key={entry.username}
                className="grid gap-3 px-5 py-4 text-sm lg:grid-cols-[80px_1.2fr_1fr_120px_150px_120px_190px] lg:items-center"
              >
                <p className="text-2xl font-black text-cyan-100">#{index + 1}</p>
                <p className="font-bold text-white">{entry.name}</p>
                <p className="text-slate-300">@{entry.username}</p>
                <p className="font-black text-white">{entry.bestScore.toLocaleString()}</p>
                <p className="text-slate-300">
                  Completed {entry.highestCompletedLevel} - Unlocked {entry.highestUnlockedLevel}
                </p>
                <p className="text-slate-300">{entry.totalWins}</p>
                <p className="text-slate-400">{formatDate(entry.lastPlayedDate)}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
