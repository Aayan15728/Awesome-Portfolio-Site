import fs from "fs/promises";
import path from "path";

/**
 * Tiny key-value store used by the visitor counter and the goals page.
 *
 *  - With SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set, data lives in your Supabase project
 *    (tables created by supabase/schema.sql). Works on any serverless host.
 *  - Without them it falls back to JSON files in ./data (great for local dev; NOT persistent
 *    on serverless hosts, so `isPersistent()` lets pages warn about it).
 *
 * The service-role key bypasses Row Level Security, so it must stay server-side: never prefix it
 * with NEXT_PUBLIC_ and never import this module from a client component.
 */

const SUPABASE_URL = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(SUPABASE_URL && SERVICE_KEY);

const DATA_DIR = path.join(process.cwd(), "data");

export function isPersistent(): boolean {
  return useSupabase;
}

/* ── Supabase (PostgREST) ───────────────────────────────────────────────── */

async function rest(pathAndQuery: string, init: RequestInit & { headers?: Record<string, string> } = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SERVICE_KEY as string,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`Supabase request failed (${res.status})`);
  return res;
}

/* ── JSON file fallback ─────────────────────────────────────────────────── */

function fileFor(key: string): string {
  // keys are internal constants, but never let one escape ./data
  return path.join(DATA_DIR, `${key.replace(/[^a-z0-9_-]/gi, "_")}.json`);
}

async function readFileJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = (await fs.readFile(fileFor(key), "utf-8")).trim();
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeFileJSON(key: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(key), JSON.stringify(value, null, 2), "utf-8");
}

/* ── Public API ─────────────────────────────────────────────────────────── */

/** Returns `fallback` only when the key has never been written. */
export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  if (!useSupabase) return readFileJSON(key, fallback);
  const res = await rest(`site_kv?key=eq.${encodeURIComponent(key)}&select=value`);
  const rows = (await res.json()) as { value: T }[];
  return rows.length ? rows[0].value : fallback;
}

export async function setJSON(key: string, value: unknown): Promise<void> {
  if (!useSupabase) return writeFileJSON(key, value);
  await rest("site_kv?on_conflict=key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
  });
}

export async function setSize(key: string): Promise<number> {
  if (!useSupabase) return (await readFileJSON<string[]>(key, [])).length;
  const res = await rest(`site_set_members?set_key=eq.${encodeURIComponent(key)}&select=member`, {
    method: "HEAD",
    headers: { Prefer: "count=exact" },
  });
  // content-range looks like "0-41/42" or "*/0"
  const total = res.headers.get("content-range")?.split("/")[1];
  return total ? Number(total) || 0 : 0;
}

/** Adds a member to a set and returns the new set size. */
export async function addToSet(key: string, member: string): Promise<number> {
  if (useSupabase) {
    await rest("site_set_members?on_conflict=set_key,member", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify({ set_key: key, member }),
    });
    return setSize(key);
  }
  const members = await readFileJSON<string[]>(key, []);
  if (!members.includes(member)) {
    members.push(member);
    await writeFileJSON(key, members);
  }
  return members.length;
}
