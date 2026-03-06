/**
 * Guest resume storage in localStorage.
 * Key: "guest_resumes" — JSON array of GuestResume.
 * Limit: 3 resumes for guests.
 */

export const GUEST_RESUMES_KEY = 'guest_resumes';
export const GUEST_RESUME_LIMIT = 3;

export interface GuestResume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  data: Record<string, unknown>;
}

function getStored(): GuestResume[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_RESUMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStored(resumes: GuestResume[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_RESUMES_KEY, JSON.stringify(resumes));
}

export function getGuestResumes(): GuestResume[] {
  return getStored().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getGuestResumeById(id: string): GuestResume | null {
  return getStored().find((r) => r.id === id) ?? null;
}

export function getGuestResumesCount(): number {
  return getStored().length;
}

export function saveGuestResume(
  payload: { id?: string; title: string; data: Record<string, unknown> }
): { success: true; resume: GuestResume } | { success: false; reason: 'limit' } {
  const list = getStored();
  const now = new Date().toISOString();
  const existingIndex = payload.id ? list.findIndex((r) => r.id === payload.id) : -1;

  if (existingIndex >= 0) {
    const updated: GuestResume = {
      ...list[existingIndex],
      title: payload.title,
      data: payload.data,
      updatedAt: now,
    };
    const next = [...list];
    next[existingIndex] = updated;
    setStored(next);
    return { success: true, resume: updated };
  }

  if (list.length >= GUEST_RESUME_LIMIT) {
    return { success: false, reason: 'limit' };
  }

  const newResume: GuestResume = {
    id: payload.id ?? `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: payload.title,
    createdAt: now,
    updatedAt: now,
    data: payload.data,
  };
  setStored([...list, newResume]);
  return { success: true, resume: newResume };
}

export function deleteGuestResume(id: string): void {
  const list = getStored().filter((r) => r.id !== id);
  setStored(list);
}

export function duplicateGuestResume(id: string): GuestResume | null {
  const list = getStored();
  if (list.length >= GUEST_RESUME_LIMIT) return null;
  const source = list.find((r) => r.id === id);
  if (!source) return null;
  const now = new Date().toISOString();
  const copy: GuestResume = {
    id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: `Copy of ${source.title}`,
    createdAt: now,
    updatedAt: now,
    data: JSON.parse(JSON.stringify(source.data)),
  };
  setStored([...list, copy]);
  return copy;
}

export function hasGuestResumes(): boolean {
  return getStored().length > 0;
}

export function clearGuestResumes(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_RESUMES_KEY);
}
