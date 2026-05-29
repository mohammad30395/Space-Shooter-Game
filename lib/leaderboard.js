import { getHighestCompletedLevel, getHighestUnlockedLevel } from "@/lib/levels";

function getLastPlayedDate(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return null;
  }

  return records
    .map((record) => record.playedAt)
    .filter(Boolean)
    .sort()
    .at(-1) ?? null;
}

export function buildLeaderboard(users = {}) {
  return Object.values(users)
    .map((user) => {
      const records = Array.isArray(user.records) ? user.records : [];
      const totalWins = records.filter((record) => record.won || record.result === "Win").length;

      return {
        name: user.name,
        username: user.username,
        bestScore: Number(user.bestScore) || 0,
        highestUnlockedLevel: getHighestUnlockedLevel(user),
        highestCompletedLevel: getHighestCompletedLevel(user),
        totalWins,
        lastPlayedDate: getLastPlayedDate(records)
      };
    })
    .sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      if (b.highestCompletedLevel !== a.highestCompletedLevel) {
        return b.highestCompletedLevel - a.highestCompletedLevel;
      }
      return b.totalWins - a.totalWins;
    });
}
