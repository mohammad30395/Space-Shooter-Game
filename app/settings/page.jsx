"use client";

import PageShell from "@/components/PageShell";
import PlayerForm from "@/components/PlayerForm";

export default function SettingsPage() {
  return (
    <PageShell>
      <section className="py-8">
        <PlayerForm
          title="Settings"
          description="Update the active name or switch to another username. Existing usernames load their saved progress."
          submitLabel="Save Settings"
          redirectTo={null}
        />
      </section>
    </PageShell>
  );
}
