'use client';

import { useState } from 'react';

export function usePending() {
  const [pendingCount, setPendingCount] = useState(0);
  const track = <T,>(p: Promise<T>) => {
    setPendingCount((c) => c + 1);
    return p.finally(() => setPendingCount((c) => Math.max(0, c - 1)));
  };
  return { pendingCount, track };
}

export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  let data: unknown = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(String((data as any)?.error || res.statusText || 'Request failed'));
  return data as T;
}
