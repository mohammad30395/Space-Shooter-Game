"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Gamepad2, Home, ListOrdered, Settings, ScrollText } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/storage";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rules", label: "Rules", icon: ScrollText },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/leaderboard", label: "Leaderboard", icon: ListOrdered }
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUserProfile());
    syncUser();
    window.addEventListener("space-shooter-storage", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("space-shooter-storage", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <header className="relative z-10 border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-200/30 bg-cyan-300/15 text-cyan-100 shadow-glow">
            <Gamepad2 size={20} />
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.24em] text-cyan-100">
              Nebula Strike
            </span>
            <span className="block text-xs text-slate-400">
              {user ? `${user.name} @${user.username}` : "Local pilot profile"}
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition",
                  active
                    ? "border-cyan-200/50 bg-cyan-200/15 text-cyan-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                ].join(" ")}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
