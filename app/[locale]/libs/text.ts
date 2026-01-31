export const stripMd = (s: string) =>
  (s || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/==(.*?)==/g, '$1');
