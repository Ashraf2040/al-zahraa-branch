// hooks/useFixedSchedule.ts
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { normalizeClass } from '@/utils';

const normalizeDay = (s: string): string => {
  return s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase();
};

export const useFixedSchedule = () => {
  const [map, setMap] = useState<Record<string, Record<string, string[]>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('Fetching fixed-schedule.csv...');
        const res = await fetch('/fixed-schedule.csv');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const txt = await res.text();

        const parsed = Papa.parse(txt, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(),
        });

        const out: Record<string, Record<string, string[]>> = {};

        for (const row of parsed.data as any[]) {
          const rawClass = (row.class ?? row.Class ?? '').trim();
          const cls = normalizeClass(rawClass);
          const rawDay = (row.weekday ?? row.Weekday ?? '').trim();
          const day = normalizeDay(rawDay); // ← "monday" → "Monday"

          const subjects = (row.subjects ?? row.Subjects ?? '')
            .toString()
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);

          if (!cls || !day) continue;

          if (!out[cls]) out[cls] = {};
          out[cls][day] = subjects;
        }

        console.log('CSV schedule map (normalized):', out);
        setMap(out);
        setLoading(false);
      } catch (e: any) {
        console.error('CSV load failed:', e);
        setError(e.message);
        setLoading(false);
      }
    })();
  }, []);

  return { map, loading, error };
};