'use client';

export type FetchJson = (input: RequestInfo, init?: RequestInit) => Promise<any>;

export const createTracker = (setPending: (fn: (n: number) => number) => void) => {
  const track = <T,>(p: Promise<T>) => {
    setPending((c) => c + 1);
    return p.finally(() => setPending((c) => Math.max(0, c - 1)));
  };
  return track;
};

export const fetchJson: FetchJson = async (input, init) => {
  const res = await fetch(input, init);
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // allow empty bodies
  }
  if (!res.ok) {
    throw new Error(data?.error || res.statusText || 'Request failed');
  }
  return data;
};

export const formatTime = (ts?: string | Date | null) => {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};