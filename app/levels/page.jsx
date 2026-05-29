"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import LevelCard from "@/components/LevelCard";
import PageShell from "@/components/PageShell";
import { DEFAULT_PLAYGROUND_ID, getPlayground } from "@/lib/gameConfig";
import { getLevelState, isLevelUnlocked, LEVELS } from "@/lib/levels";
import { getCurrentUserProfile, getSelectedPlaygroundId, setSelectedPlaygroundId } from "@/lib/storage";

export default function LevelsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [playground, setPlayground] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUserProfile();
    if (!currentUser) {
      router.replace("/play");
      return;
    }

    const selectedPlaygroundId = getSelectedPlaygroundId() || DEFAULT_PLAYGROUND_ID;
    if (!getSelectedPlaygroundId()) {
      setSelectedPlaygroundId(selectedPlaygroundId);
    }

    setUser(currentUser);
    setPlayground(getPlayground(selectedPlaygroundId));
    setReady(true);
  }, [router]);

  function handleSelect(levelNumber) {
    if (!isLevelUnlocked(user, levelNumber)) return;
    router.push(`/game?level=${levelNumber}`);
  }

  if (!ready || !user || !playground) {
    return (
      <PageShell>
        <div className="glass-panel mx-auto max-w-md rounded-xl p-5 text-center">Loading levels...</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Mission ladder</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Select level</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Current pilot: <span className="font-bold text-white">{user.name}</span> @{user.username}. Current playground:{" "}
            <span className="font-bold text-white">{playground.name}</span>.
          </p>
        </div>
        <Button href="/playground" variant="secondary">Change Playground</Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {LEVELS.map((level) => (
          <LevelCard
            key={level.level}
            level={level}
            state={getLevelState(user, level.level)}
            onSelect={handleSelect}
          />
        ))}
      </section>
    </PageShell>
  );
}
