export const DEFAULT_PLAYGROUND_ID = "deep-space";

export const PLAYGROUNDS = [
  {
    id: "deep-space",
    name: "Deep Space",
    difficulty: "Balanced",
    description: "Clean flight lanes, wide visibility, and a steady enemy rhythm.",
    accent: "#22d3ee",
    previewClass: "from-cyan-500/35 via-slate-950 to-indigo-950",
    colors: {
      backgroundStart: "#020617",
      backgroundEnd: "#10172a",
      star: "#a5f3fc",
      enemy: "#f43f5e",
      enemyAlt: "#fb7185",
      bullet: "#67e8f9"
    }
  },
  {
    id: "mars-orbit",
    name: "Mars Orbit",
    difficulty: "Aggressive",
    description: "Rust-red skies and tighter asteroid traffic near the planet line.",
    accent: "#f97316",
    previewClass: "from-orange-500/35 via-red-950 to-slate-950",
    colors: {
      backgroundStart: "#160905",
      backgroundEnd: "#1e1b4b",
      star: "#fed7aa",
      enemy: "#fb923c",
      enemyAlt: "#f43f5e",
      bullet: "#fef3c7"
    }
  },
  {
    id: "alien-nebula",
    name: "Alien Nebula",
    difficulty: "Unstable",
    description: "Bright gas clouds hide faster enemy drifts and sharp turns.",
    accent: "#d946ef",
    previewClass: "from-fuchsia-500/35 via-emerald-950 to-slate-950",
    colors: {
      backgroundStart: "#12051f",
      backgroundEnd: "#063528",
      star: "#f5d0fe",
      enemy: "#a78bfa",
      enemyAlt: "#34d399",
      bullet: "#f0abfc"
    }
  },
  {
    id: "asteroid-belt",
    name: "Asteroid Belt",
    difficulty: "Dense",
    description: "Short reaction windows with heavier targets and compact lanes.",
    accent: "#facc15",
    previewClass: "from-yellow-400/30 via-stone-900 to-slate-950",
    colors: {
      backgroundStart: "#11100c",
      backgroundEnd: "#0f172a",
      star: "#fef08a",
      enemy: "#a3a3a3",
      enemyAlt: "#facc15",
      bullet: "#fde68a"
    }
  },
  {
    id: "dark-galaxy",
    name: "Dark Galaxy",
    difficulty: "High risk",
    description: "Low-contrast space with high-speed enemy waves and neon traces.",
    accent: "#38bdf8",
    previewClass: "from-sky-500/25 via-violet-950 to-black",
    colors: {
      backgroundStart: "#00020a",
      backgroundEnd: "#1e1b4b",
      star: "#bae6fd",
      enemy: "#38bdf8",
      enemyAlt: "#c084fc",
      bullet: "#86efac"
    }
  }
];

export function getPlayground(playgroundId) {
  return PLAYGROUNDS.find((playground) => playground.id === playgroundId) ?? PLAYGROUNDS[0];
}
