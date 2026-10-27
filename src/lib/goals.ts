import { randomUUID } from "crypto";
import { getJSON, setJSON } from "@/lib/store";

export interface Goal {
  id: string;
  text: string;
  /** 0-100. Ignored for display once `done` is true (a done goal is always 100%). */
  progress: number;
  done: boolean;
  createdAt: string;
  completedAt?: string;
}

const KEY = "goals";
export const MAX_GOAL_LENGTH = 200;
const MAX_GOALS = 200;

/** Shown until the owner makes the first change; after that the stored list is the truth. */
const SEED_GOALS: Goal[] = [
  { id: "seed-1k-dollars", text: "Make $1k", progress: 0, done: false, createdAt: "2026-10-27T00:00:00.000Z" },
  { id: "seed-1k-followers", text: "Reach 1K followers", progress: 0, done: false, createdAt: "2026-10-27T00:00:01.000Z" },
  { id: "seed-physique", text: "Build a good physique", progress: 0, done: false, createdAt: "2026-10-27T00:00:02.000Z" },
];

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

/** What a goal counts for in totals: finished goals are 100%, unfinished ones never show above 99%. */
export function effectiveProgress(goal: Goal): number {
  return goal.done ? 100 : Math.min(99, clamp(goal.progress));
}

export async function listGoals(): Promise<Goal[]> {
  const goals = await getJSON<Goal[]>(KEY, SEED_GOALS);
  // goals saved before progress existed
  return goals.map((g) => ({ ...g, progress: typeof g.progress === "number" ? g.progress : g.done ? 100 : 0 }));
}

export async function addGoal(text: string): Promise<void> {
  const clean = text.trim().slice(0, MAX_GOAL_LENGTH);
  if (!clean) return;
  const goals = await listGoals();
  if (goals.length >= MAX_GOALS) return;
  goals.push({ id: randomUUID(), text: clean, progress: 0, done: false, createdAt: new Date().toISOString() });
  await setJSON(KEY, goals);
}

export async function toggleGoal(id: string): Promise<void> {
  const goals = await listGoals();
  const goal = goals.find((g) => g.id === id);
  if (!goal) return;
  goal.done = !goal.done;
  goal.completedAt = goal.done ? new Date().toISOString() : undefined;
  await setJSON(KEY, goals);
}

export async function setGoalProgress(id: string, value: number): Promise<void> {
  if (!Number.isFinite(value)) return;
  const goals = await listGoals();
  const goal = goals.find((g) => g.id === id);
  if (!goal) return;
  goal.progress = clamp(value);
  const nowDone = goal.progress >= 100;
  if (nowDone && !goal.done) goal.completedAt = new Date().toISOString();
  if (!nowDone) goal.completedAt = undefined;
  goal.done = nowDone;
  await setJSON(KEY, goals);
}

export async function removeGoal(id: string): Promise<void> {
  const goals = await listGoals();
  await setJSON(
    KEY,
    goals.filter((g) => g.id !== id)
  );
}
