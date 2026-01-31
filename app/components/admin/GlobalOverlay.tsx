'use client';

type Props = { show: boolean };

export default function GlobalOverlay({ show }: Props) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="pointer-events-auto rounded-xl bg-white/90 px-4 py-2 text-sm text-gray-700 shadow ring-1 ring-gray-200">
        Working…
      </div>
    </div>
  );
}
