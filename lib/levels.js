export const LEVELS = [
  { level: 1, label: "Very easy", enemySpeed: 1, enemySpawnRate: 1200, enemyHealth: 1, targetScore: 500 },
  { level: 2, label: "Easy", enemySpeed: 1.2, enemySpawnRate: 1100, enemyHealth: 1, targetScore: 700 },
  { level: 3, label: "Easy+", enemySpeed: 1.4, enemySpawnRate: 1000, enemyHealth: 1, targetScore: 900 },
  { level: 4, label: "Medium", enemySpeed: 1.7, enemySpawnRate: 900, enemyHealth: 2, targetScore: 1200 },
  { level: 5, label: "Medium+", enemySpeed: 2, enemySpawnRate: 800, enemyHealth: 2, targetScore: 1500 },
  { level: 6, label: "Hard", enemySpeed: 2.3, enemySpawnRate: 700, enemyHealth: 2, targetScore: 1800 },
  { level: 7, label: "Hard+", enemySpeed: 2.7, enemySpawnRate: 620, enemyHealth: 3, targetScore: 2200 },
  { level: 8, label: "Very hard", enemySpeed: 3.1, enemySpawnRate: 540, enemyHealth: 3, targetScore: 2700 },
  { level: 9, label: "Extreme", enemySpeed: 3.6, enemySpawnRate: 460, enemyHealth: 4, targetScore: 3300 },
  { level: 10, label: "Boss level", enemySpeed: 4.2, enemySpawnRate: 380, enemyHealth: 5, targetScore: 4000, boss: true }
];

export function getLevelByNumber(levelNumber) {
  const parsed = Number(levelNumber);
  return LEVELS.find((level) => level.level === parsed) ?? LEVELS[0];
}

export function getNextLevelNumber(levelNumber) {
  const current = Number(levelNumber);
  return current >= LEVELS.length ? null : current + 1;
}

export function normalizeLevelList(levels) {
  const valid = Array.isArray(levels) ? levels : [];
  return [...new Set(valid.map(Number).filter((level) => level >= 1 && level <= LEVELS.length))].sort((a, b) => a - b);
}

export function isLevelUnlocked(user, levelNumber) {
  const unlockedLevels = normalizeLevelList(user?.unlockedLevels);
  return unlockedLevels.includes(Number(levelNumber));
}

export function getHighestCompletedLevel(user) {
  const completed = normalizeLevelList(user?.completedLevels);
  return completed.length ? Math.max(...completed) : 0;
}

export function getHighestUnlockedLevel(user) {
  const unlocked = normalizeLevelList(user?.unlockedLevels);
  return unlocked.length ? Math.max(...unlocked) : 1;
}

export function getLevelState(user, levelNumber) {
  const level = Number(levelNumber);
  const completedLevels = normalizeLevelList(user?.completedLevels);
  const unlockedLevels = normalizeLevelList(user?.unlockedLevels);

  if (completedLevels.includes(level)) {
    return "completed";
  }

  if (unlockedLevels.includes(level)) {
    return "unlocked";
  }

  return "locked";
}
