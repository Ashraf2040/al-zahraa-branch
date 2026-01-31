'use client';

import { RefObject } from 'react';

export const wrapSelectionIn = (ta: HTMLTextAreaElement, delimiter: string) => {
  const { selectionStart, selectionEnd, value } = ta;
  if (selectionStart == null || selectionEnd == null || selectionStart === selectionEnd) return value;
  return value.slice(0, selectionStart) + delimiter + value.slice(selectionStart, selectionEnd) + delimiter + value.slice(selectionEnd);
};

export function Toolbar({ onWrap }: { onWrap: (delim: string) => void }) {
  return (
    <div className="flex items-center">
      <button type="button" className="ml-2 rounded-md border px-2 py-1 text-xs" title="Bold (**...**)" onClick={() => onWrap('**')}>Bold</button>
      <button type="button" className="ml-2 rounded-md border px-2 py-1 text-xs" title="Red highlight (~~...~~)" onClick={() => onWrap('~~')}>Red</button>
      <button type="button" className="ml-2 rounded-md border px-2 py-1 text-xs" title="Yellow highlight (==...==)" onClick={() => onWrap('==')}>Highlight</button>
    </div>
  );
}

export function makeWrapHandler(ref: RefObject<HTMLTextAreaElement>, onChange: (v: string) => void) {
  return (delimiter: string) => {
    const ta = ref.current;
    if (!ta) return;
    const newVal = wrapSelectionIn(ta, delimiter);
    onChange(newVal);
    requestAnimationFrame(() => ta.focus());
  };
}
