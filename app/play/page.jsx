"use client";

import PageShell from "@/components/PageShell";
import PlayerForm from "@/components/PlayerForm";

export default function PlayPage() {
  return (
    <PageShell>
      <section className="py-8">
        <PlayerForm
          title="Enter pilot details"
          description="Your username controls which saved progress and records are loaded."
          submitLabel="Continue to Playgrounds"
          redirectTo="/playground"
        />
      </section>
    </PageShell>
  );
}
