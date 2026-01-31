'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  classes: any[];
  subjects: any[];
  pending: boolean;
  track: <T>(p: Promise<T>) => Promise<T>;
  fetchJson: (input: RequestInfo, init?: RequestInit) => Promise<any>;
  onCreated: (val: any[]) => void;
  onClose: () => void;
};

export default function TeacherCreateForm({ classes, subjects, pending, track, fetchJson, onCreated, onClose }: Props) {
  const [form, setForm] = useState({
    username: '',
    name: '',
    password: '',
    classIds: [] as string[],
    subjectIds: [] as string[],
  });

  return (
    <div className="mx-auto mb-8 max-w-3xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
      <h2 className="mb-4 text-xl font-semibold text-[#064e4f]">Create Teacher</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await toast.promise(
            track(
              (async () => {
                await fetchJson('/api/admin/teachers', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...form, role: 'TEACHER' }),
                });
                const t = await fetchJson('/api/admin/teachers');
                onCreated(t);
                setForm({ username: '', name: '', password: '', classIds: [], subjectIds: [] });
                onClose();
              })()
            ),
            { loading: 'Creating teacher…', success: 'Teacher created', error: (e) => String((e as any)?.message || e) }
          );
        }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {/* inputs same as original */}
        {/* Username */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
          <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" required />
        </div>
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" required />
        </div>
        {/* Password */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" required />
        </div>
        {/* Class multi */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Assign Classes</label>
          <select multiple value={form.classIds} onChange={(e) => setForm({ ...form, classIds: Array.from(e.target.selectedOptions, (o) => o.value) })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2">
            {classes.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {/* Subject multi */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Assign Subjects</label>
          <select multiple value={form.subjectIds} onChange={(e) => setForm({ ...form, subjectIds: Array.from(e.target.selectedOptions, (o) => o.value) })} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2">
            {subjects.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        {/* Submit */}
        <div className="sm:col-span-2">
          <button type="submit" disabled={pending} className="mt-2 w-full rounded-lg bg-[#006d77] px-4 py-2.5 text-white">
            {pending ? 'Working…' : 'Create Teacher'}
          </button>
        </div>
      </form>
    </div>
  );
}
