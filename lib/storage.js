import { buildLeaderboard } from "@/lib/leaderboard";
import { getNextLevelNumber, normalizeLevelList } from "@/lib/levels";

export const STORAGE_KEY = "spaceShooterGame:v1";

const DEFAULT_DATA = {
  currentUser: null,
  selectedPlayground: null,
  users: {},
  leaderboard: []
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneDefaultData() {
  return {
    currentUser: DEFAULT_DATA.currentUser,
    selectedPlayground: DEFAULT_DATA.selectedPlayground,
    users: {},
    leaderboard: []
  };
}

function saveToLocalStorage(data) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // If storage is blocked or full, keep the app running with in-memory defaults for this render.
  }
}

export function normalizeUsername(username) {
  return String(username ?? "").trim().toLowerCase();
}

export function normalizeName(name) {
  return String(name ?? "").trim();
}

function createUserProfile(name, username) {
  return {
    name,
    username,
    unlockedLevels: [1],
    completedLevels: [],
    records: [],
    bestScore: 0
  };
}

function sanitizeUser(user, usernameKey) {
  const username = normalizeUsername(user?.username || usernameKey);
  const name = normalizeName(user?.name) || username;

  return {
    name,
    username,
    unlockedLevels: normalizeLevelList(user?.unlockedLevels).length
      ? normalizeLevelList(user?.unlockedLevels)
      : [1],
    completedLevels: normalizeLevelList(user?.completedLevels),
    records: Array.isArray(user?.records) ? user.records : [],
    bestScore: Number(user?.bestScore) || 0
  };
}

function sanitizeData(data) {
  const users = data?.users && typeof data.users === "object" ? data.users : {};
  const sanitizedUsers = Object.entries(users).reduce((acc, [username, user]) => {
    const normalizedUsername = normalizeUsername(username);
    if (!normalizedUsername) return acc;
    acc[normalizedUsername] = sanitizeUser(user, normalizedUsername);
    return acc;
  }, {});

  const currentUser = normalizeUsername(data?.currentUser);
  const selectedPlayground = data?.selectedPlayground ? String(data.selectedPlayground) : null;

  return {
    currentUser: currentUser && sanitizedUsers[currentUser] ? currentUser : null,
    selectedPlayground,
    users: sanitizedUsers,
    leaderboard: buildLeaderboard(sanitizedUsers)
  };
}

function emitStorageEvent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("space-shooter-storage"));
  }
}

export function readGameData() {
  if (!canUseStorage()) {
    return cloneDefaultData();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialData = cloneDefaultData();
      saveToLocalStorage(initialData);
      return initialData;
    }

    const parsed = JSON.parse(raw);
    const sanitized = sanitizeData(parsed);
    saveToLocalStorage(sanitized);
    return sanitized;
  } catch {
    const initialData = cloneDefaultData();
    saveToLocalStorage(initialData);
    return initialData;
  }
}

export function writeGameData(data) {
  const sanitized = sanitizeData(data);

  if (canUseStorage()) {
    saveToLocalStorage(sanitized);
    emitStorageEvent();
  }

  return sanitized;
}

export function getCurrentUserProfile() {
  const data = readGameData();
  return data.currentUser ? data.users[data.currentUser] ?? null : null;
}

export function getSelectedPlaygroundId() {
  return readGameData().selectedPlayground;
}

export function setSelectedPlaygroundId(playgroundId) {
  const data = readGameData();
  data.selectedPlayground = playgroundId;
  return writeGameData(data);
}

export function upsertCurrentUser(nameValue, usernameValue) {
  const name = normalizeName(nameValue);
  const username = normalizeUsername(usernameValue);
  const errors = {};

  if (!name) {
    errors.name = "Name is required.";
  }

  if (!username) {
    errors.username = "Username is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const data = readGameData();
  const existingUser = data.users[username];
  data.users[username] = existingUser
    ? { ...existingUser, name, username }
    : createUserProfile(name, username);
  data.currentUser = username;

  const saved = writeGameData(data);

  return {
    ok: true,
    user: saved.users[username],
    data: saved
  };
}

export function saveGameRecord(recordInput) {
  const data = readGameData();
  const username = normalizeUsername(recordInput.username || data.currentUser);

  if (!username) {
    return null;
  }

  const user = data.users[username] ?? createUserProfile(recordInput.name || username, username);
  const won = recordInput.result === "Win" || recordInput.won === true;
  const score = Math.max(0, Math.round(Number(recordInput.score) || 0));
  const level = Number(recordInput.level) || 1;
  const playedAt = new Date().toISOString();
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: user.name,
    username,
    level,
    playgroundId: recordInput.playgroundId,
    playgroundName: recordInput.playgroundName,
    score,
    result: won ? "Win" : "Game Over",
    won,
    playedAt
  };

  const completedLevels = new Set(normalizeLevelList(user.completedLevels));
  const unlockedLevels = new Set(normalizeLevelList(user.unlockedLevels).length ? normalizeLevelList(user.unlockedLevels) : [1]);

  if (won) {
    completedLevels.add(level);
    const nextLevel = getNextLevelNumber(level);
    if (nextLevel) {
      unlockedLevels.add(nextLevel);
    }
  }

  data.users[username] = {
    ...user,
    records: [...(Array.isArray(user.records) ? user.records : []), record],
    completedLevels: [...completedLevels].sort((a, b) => a - b),
    unlockedLevels: [...unlockedLevels].sort((a, b) => a - b),
    bestScore: Math.max(Number(user.bestScore) || 0, score)
  };
  data.currentUser = username;

  const saved = writeGameData(data);

  return {
    record,
    user: saved.users[username],
    leaderboard: saved.leaderboard
  };
}
