"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, signIn, signOut } from "@/lib/auth";
import { addGoal, removeGoal, setGoalProgress, toggleGoal } from "@/lib/goals";

// Server Actions are reachable by direct POST, so every mutation re-checks the session.

export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  const ok = typeof password === "string" && (await signIn(password));
  redirect(ok ? "/goal" : "/goal?error=1");
}

export async function logoutAction() {
  await signOut();
  redirect("/goal");
}

export async function addGoalAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const text = formData.get("text");
  if (typeof text === "string") await addGoal(text);
  revalidatePath("/goal");
}

export async function toggleGoalAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = formData.get("id");
  if (typeof id === "string") await toggleGoal(id);
  revalidatePath("/goal");
}

export async function setProgressAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = formData.get("id");
  const progress = Number(formData.get("progress"));
  if (typeof id === "string") await setGoalProgress(id, progress);
  revalidatePath("/goal");
}

export async function deleteGoalAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = formData.get("id");
  if (typeof id === "string") await removeGoal(id);
  revalidatePath("/goal");
}
