'use client';

export const renderWithHighlight = (input?: string) => {
  if (!input) return '';
  let html = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/^::(.*)$/gm, (_m, p1) => `<div style="background:#fff59d">${p1}</div>`);
  html = html.replace(/==([\s\S]*?)==/g, (_m, p1) => `<mark style="background:#fff59d">${p1}</mark>`);
  html = html.replace(/~~([\s\S]*?)~~/g, (_m, p1) => `<span style="color:#c40000">${p1}</span>`);
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, (_m, p1) => `<strong>${p1}</strong>`);
  html = html.replace(/\n/g, '<br/>');
  return html;
};

export const waitForImages = async (root: HTMLElement) => {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); })));
};

export const buildSuggestedFileName = (gradeName: string, week: string, fromDate: string) => {
  const from = fromDate ? new Date(fromDate).toLocaleDateString('en-GB').replaceAll('/', '-') : '';
  const wk = week || '';
  return `Grade(${gradeName})-W${wk}-${from}`.replace(/\s+/g, '_');
};
