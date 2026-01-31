// utils.ts
import Papa from 'papaparse'; // <-- REQUIRED for parseFixedScheduleCsv

// ------------------------------------------------------------
// 1. TIME & DATE helpers
// ------------------------------------------------------------
export const formatTime = (ts?: string | Date | null) => {
  if (!ts) return '-';
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const weekdayNameFromDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });

// ------------------------------------------------------------
// 2. STRING normalisation helpers
// ------------------------------------------------------------
export const normalizeSubj = (s?: string) =>
  (s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

/** Normalise class names (used for CSV ↔ DB matching) */
// utils.ts
export const normalizeClass = (s: string): string => {
  const cleaned = s.trim().replace(/\s+/g, ' ').toLowerCase();
  // "Grade 4B" → "grade 4b"
  // "4B" → "4b" → then add "grade "
  const match = cleaned.match(/^grade\s*(\d+)([a-z]?)$/i) || cleaned.match(/^(\d+)([a-z]?)$/);
  if (match) {
    const num = match[1];
    const letter = match[2] ? match[2].toLowerCase() : '';
    return `grade ${num}${letter}`;
  }
  return cleaned; // fallback
};

// ------------------------------------------------------------
// 3. CSV export helpers
// ------------------------------------------------------------
export const toCsv = (rows: string[][]) => {
  const esc = (v: string) =>
    /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  return rows.map(r => r.map(esc).join(',')).join('\n');
};

export const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ------------------------------------------------------------
// 4. Fixed-schedule CSV parser (kept for tests / utilities)
// ------------------------------------------------------------
export const parseFixedScheduleCsv = (csv: string) => {
  const result = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim(),
  });

  const map: Record<string, Record<string, string[]>> = {};

  for (const row of result.data as any[]) {
    const rawCls = (row.class ?? row.Class ?? '').trim();
    const cls = normalizeClass(rawCls);               // <-- normalised key
    const day = (row.weekday ?? row.Weekday ?? '').trim();

    const subjects = (row.subjects ?? row.Subjects ?? '')
      .toString()
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (!cls || !day) continue;
    if (!map[cls]) map[cls] = {};
    map[cls][day] = subjects;
  }

  return map;
};

// ------------------------------------------------------------
// 5. Subject sorting (for the lessons table)
// ------------------------------------------------------------
export const subjectOrder = [
  'English',
  'Math',
  'Science',
  'Social Studies',
  'Life Skills',
  'ICT',
  'French',
  'Computer',
  'Arabic',
  'S.S in Arabic',
  'Islamic Studies',
] as const;

export const subjectSortIndex = (name: string) => {
  const i = subjectOrder.findIndex(k =>
    name.trim().toLowerCase().startsWith(k.trim().toLowerCase())
  );
  return i === -1 ? 999 : i;
};

