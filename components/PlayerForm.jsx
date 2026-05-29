"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRound, AtSign, Save } from "lucide-react";
import Button from "@/components/Button";
import { getCurrentUserProfile, upsertCurrentUser } from "@/lib/storage";

export default function PlayerForm({
  title = "Pilot profile",
  description = "Set the profile used for progress, records, and leaderboard ranking.",
  submitLabel = "Continue",
  redirectTo = "/playground"
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUserProfile();
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setSavedMessage("");

    const result = upsertCurrentUser(name, username);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setName(result.user.name);
    setUsername(result.user.username);

    if (redirectTo) {
      router.push(redirectTo);
      return;
    }

    setSavedMessage("Profile saved. Existing progress for this username is now active.");
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel mx-auto w-full max-w-xl rounded-xl p-5 sm:p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Profile</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <UserRound size={16} />
            Name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-200/20"
            placeholder="Alex Nova"
            autoComplete="name"
          />
          {errors.name ? <span className="mt-2 block text-sm text-rose-300">{errors.name}</span> : null}
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <AtSign size={16} />
            Username
          </span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-200/20"
            placeholder="alex123"
            autoComplete="username"
          />
          {errors.username ? (
            <span className="mt-2 block text-sm text-rose-300">{errors.username}</span>
          ) : (
            <span className="mt-2 block text-xs text-slate-400">
              Usernames are stored in lowercase and uniquely identify saved progress.
            </span>
          )}
        </label>
      </div>

      {savedMessage ? (
        <p className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
          {savedMessage}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full" size="lg">
        <Save size={18} />
        {submitLabel}
      </Button>
    </form>
  );
}
