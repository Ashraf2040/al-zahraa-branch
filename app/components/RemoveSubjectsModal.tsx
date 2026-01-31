'use client';

import { Grade, Subject, ID } from './types';

export function RemoveSubjectsModal({
  open, grades, removeGradeId, removeSubjectFilter, removeCandidates, removeSelected,
  setRemoveOpen, setRemoveGradeId, setRemoveSubjectFilter, toggle, selectFiltered, clear, onSubmit, onLoadCandidates,
}: {
  open: boolean;
  grades: Grade[];
  removeGradeId: ID;
  removeSubjectFilter: string;
  removeCandidates: Subject[];
  removeSelected: Set<ID>;
  setRemoveOpen: (v: boolean) => void;
  setRemoveGradeId: (v: ID) => void;
  setRemoveSubjectFilter: (v: string) => void;
  toggle: (id: ID) => void;
  selectFiltered: () => void;
  clear: () => void;
  onSubmit: () => Promise<void>;
  onLoadCandidates: (gradeId: ID) => Promise<void>;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Remove Subjects from Grade</h3>
          <button onClick={() => setRemoveOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">Grade</label>
            <select
              value={removeGradeId}
              onChange={async (e) => { const v = e.target.value; setRemoveGradeId(v); await onLoadCandidates(v); }}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition focus:border-[#83c5be] focus:ring-2 focus:ring-[#83c5be]"
            >
              <option value="">Select Grade</option>
              {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Search subjects</label>
            <input
              type="text"
              value={removeSubjectFilter}
              onChange={(e) => setRemoveSubjectFilter(e.target.value)}
              placeholder="Type to filter..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition focus:border-[#83c5be] focus:ring-2 focus:ring-[#83c5be]"
            />
          </div>
        </div>

        <div className="mt-4 max-h-[340px] overflow-auto rounded-lg border border-gray-200">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr><th className="px-3 py-2 text-left">Select</th><th className="px-3 py-2 text-left">Subject</th></tr>
            </thead>
            <tbody>
              {removeCandidates
                .filter((s) => s.name.toLowerCase().includes(removeSubjectFilter.toLowerCase()))
                .map((s, idx) => {
                  const checked = removeSelected.has(s.id);
                  return (
                    <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2">
                        <input type="checkbox" className="h-4 w-4" checked={checked} onChange={() => toggle(s.id)} />
                      </td>
                      <td className="px-3 py-2">{s.name}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button onClick={selectFiltered} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">Select filtered</button>
            <button onClick={clear} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">Clear</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setRemoveOpen(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm">Cancel</button>
            <button onClick={onSubmit} className="rounded-lg bg-[#f95959] px-4 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-[#b91c1c]/30 transition hover:bg-[#991b1b]">Remove Selected</button>
          </div>
        </div>
      </div>
    </div>
  );
}
