import { useCallback, useEffect, useState } from "react";
import { PROGRAM, TOTAL_SESSIONS, sessionKey } from "@/data/kettlebell/program";

// All progress lives in localStorage — this app is personal and offline-first,
// so there's no account and nothing leaves the device.

const STORAGE_KEY = "kb-progress-v1";

export interface SessionLog {
  completedAt: string; // ISO date
  /** Per-set completion, keyed by a stable set id. */
  sets: Record<string, boolean>;
  /** Logged weights per exercise id, in whatever unit the user prefers. */
  weights: Record<string, number>;
  /** Free-text note for the session. */
  note?: string;
}

export interface ProgressState {
  /** Map of sessionKey -> log. Presence with completedAt means "done". */
  logs: Record<string, SessionLog>;
  /** Last weight used per exercise, remembered across the whole program. */
  lastWeights: Record<string, number>;
  unit: "kg" | "lb";
}

const EMPTY: ProgressState = { logs: {}, lastWeights: {}, unit: "kg" };

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function save(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — nothing we can meaningfully do in a
    // personal offline app, so fail quietly.
  }
}

export function useWorkoutProgress() {
  const [state, setState] = useState<ProgressState>(EMPTY);

  // Hydrate on mount (and stay in sync if another tab changes it).
  useEffect(() => {
    setState(load());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const isSessionComplete = useCallback(
    (week: number, sessionId: string) => {
      const log = state.logs[sessionKey(week, sessionId)];
      return Boolean(log?.completedAt);
    },
    [state.logs]
  );

  const getLog = useCallback(
    (week: number, sessionId: string): SessionLog | undefined =>
      state.logs[sessionKey(week, sessionId)],
    [state.logs]
  );

  const toggleSet = useCallback(
    (week: number, sessionId: string, setId: string) => {
      update((prev) => {
        const key = sessionKey(week, sessionId);
        const log = prev.logs[key] ?? { completedAt: "", sets: {}, weights: {} };
        const sets = { ...log.sets, [setId]: !log.sets[setId] };
        return { ...prev, logs: { ...prev.logs, [key]: { ...log, sets } } };
      });
    },
    [update]
  );

  const setWeight = useCallback(
    (week: number, sessionId: string, exercise: string, weight: number) => {
      update((prev) => {
        const key = sessionKey(week, sessionId);
        const log = prev.logs[key] ?? { completedAt: "", sets: {}, weights: {} };
        const weights = { ...log.weights, [exercise]: weight };
        const lastWeights = { ...prev.lastWeights, [exercise]: weight };
        return {
          ...prev,
          lastWeights,
          logs: { ...prev.logs, [key]: { ...log, weights } },
        };
      });
    },
    [update]
  );

  const finishSession = useCallback(
    (week: number, sessionId: string, isoDate: string, done: boolean) => {
      update((prev) => {
        const key = sessionKey(week, sessionId);
        const log = prev.logs[key] ?? { completedAt: "", sets: {}, weights: {} };
        return {
          ...prev,
          logs: { ...prev.logs, [key]: { ...log, completedAt: done ? isoDate : "" } },
        };
      });
    },
    [update]
  );

  const setNote = useCallback(
    (week: number, sessionId: string, note: string) => {
      update((prev) => {
        const key = sessionKey(week, sessionId);
        const log = prev.logs[key] ?? { completedAt: "", sets: {}, weights: {} };
        return { ...prev, logs: { ...prev.logs, [key]: { ...log, note } } };
      });
    },
    [update]
  );

  const setUnit = useCallback(
    (unit: "kg" | "lb") => update((prev) => ({ ...prev, unit })),
    [update]
  );

  const resetAll = useCallback(() => {
    update(() => EMPTY);
  }, [update]);

  // --- Derived stats ---------------------------------------------------------

  const completedCount = Object.values(state.logs).filter((l) => l.completedAt).length;
  const percentComplete = Math.round((completedCount / TOTAL_SESSIONS) * 100);

  // Current week = first week with an unfinished session, else the last week.
  const currentWeek =
    PROGRAM.find((w) => w.sessions.some((s) => !isSessionComplete(w.number, s.id)))?.number ??
    PROGRAM[PROGRAM.length - 1].number;

  // Streak = consecutive distinct calendar days with a completed session,
  // counting back from the most recent completion.
  const streak = computeStreak(state.logs);

  return {
    state,
    unit: state.unit,
    completedCount,
    totalSessions: TOTAL_SESSIONS,
    percentComplete,
    currentWeek,
    streak,
    isSessionComplete,
    getLog,
    toggleSet,
    setWeight,
    finishSession,
    setNote,
    setUnit,
    resetAll,
  };
}

function computeStreak(logs: Record<string, SessionLog>): number {
  const days = Array.from(
    new Set(
      Object.values(logs)
        .filter((l) => l.completedAt)
        .map((l) => l.completedAt.slice(0, 10))
    )
  ).sort();
  if (days.length === 0) return 0;

  const dayMs = 24 * 60 * 60 * 1000;
  const toDay = (s: string) => Math.floor(new Date(s + "T00:00:00").getTime() / dayMs);

  const today = Math.floor(Date.now() / dayMs);
  const latest = toDay(days[days.length - 1]);
  // Streak only counts if the latest workout was today or yesterday.
  if (today - latest > 1) return 0;

  let streak = 1;
  for (let i = days.length - 1; i > 0; i--) {
    if (toDay(days[i]) - toDay(days[i - 1]) === 1) streak++;
    else break;
  }
  return streak;
}
