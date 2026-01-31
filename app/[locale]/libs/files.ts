export const buildSuggestedFileName = (gradeName: string, week: string, fromDateISO: string) => {
  const d = new Date(fromDateISO);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const safeGrade = (gradeName || 'Grade').replace(/[^\p{L}\p{N}\s\-_()]/gu, '').trim();
  return `${safeGrade} - Week ${String(week).trim()} - ${y}-${m}-${day}`;
};
