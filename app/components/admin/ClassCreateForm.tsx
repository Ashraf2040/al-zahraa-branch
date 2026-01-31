'use client';

import { useState } from 'react';

type Props = {
  pending: boolean;
  track: <T>(p: Promise<T>) => Promise<T>;
  fetchJson: (input: RequestInfo, init?: RequestInit) => Promise<any>;
  onCreated: (val: any[]) => void;
  onClose: () => void;
};

export default function ClassCreateForm({ pending, track, fetchJson, onCreated, onClose }: Props) {
  const [form, setForm] = useState({ name: '' });

  return (
    <div className="mx-auto mb-8 max-w-3xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
      <h2 className="mb-4 text-xl font-semibold text-[#064e4f]">Create Class</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await track(
            (async () => {
              await fetchJson('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
              });
              const c = await fetchJson('/api/classes');
              onCreated(c);
              setForm({ name: '' });
              onClose();
            })()
          );
        }}
        className="space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Class Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-[#83c5be] px-4 py-2.5 text-slate-900">
          {pending ? 'Working…' : 'Create Class'}
        </button>
      </form>
    </div>
  );
}
