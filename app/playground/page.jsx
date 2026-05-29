"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import PlaygroundCard from "@/components/PlaygroundCard";
import { PLAYGROUNDS } from "@/lib/gameConfig";
import { getCurrentUserProfile, getSelectedPlaygroundId, setSelectedPlaygroundId } from "@/lib/storage";

export default function PlaygroundPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUserProfile();
    if (!currentUser) {
      router.replace("/play");
      return;
    }

    setSelected(getSelectedPlaygroundId());
    setReady(true);
  }, [router]);

  function handleSelect(playgroundId) {
    setSelected(playgroundId);
    setSelectedPlaygroundId(playgroundId);
    router.push("/levels");
  }

  if (!ready) {
    return (
      <PageShell>
        <div className="glass-panel mx-auto max-w-md rounded-xl p-5 text-center">Loading playgrounds...</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Choose map</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Playgrounds</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Pick a combat zone before selecting a level. The selected playground changes the game colors and flight atmosphere.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLAYGROUNDS.map((playground) => (
          <PlaygroundCard
            key={playground.id}
            playground={playground}
            selected={selected === playground.id}
            onSelect={handleSelect}
          />
        ))}
      </section>
    </PageShell>
  );
}
