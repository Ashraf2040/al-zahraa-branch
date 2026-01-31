'use client';

import toast from 'react-hot-toast';
import { Grade, Subject, ID } from './types';

export function AssignSubjectsModal({
  open, grades, allSubjects, assignGradeId, subjectFilter, selectedSubjectIds,
  setAssignGradeId, setSubjectFilter, toggleSubject, selectAllFiltered, clearSelection,
  onClose, onSave,
}: {
  open: boolean;
  grades: Grade[];
  allSubjects: Subject[];
  assignGradeId: ID;
  subjectFilter: string;
  selectedSubjectIds: Set<ID>;
  setAssignGradeId: (v: ID) => void;
  setSubjectFilter: (v: string) => void;
  toggleSubject: (id: ID) => void;
  selectAllFiltered: () => void;
  clearSelection: () => void;
  onClose: () => void;
  onSave: () => Promise<void>;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Assign Subjects to Grade</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">Grade</label>
            <select value={assignGradeId} onChange={(e) => setAssignGradeId(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition focus:border-[#83c5be] focus:ring-2 focus:ring-[#83c5be]">
              <option value="">Select Grade</option>
              {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Search subjects</label>
            <input type="text" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} placeholder="Type to filter..." className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition focus:border-[#83c5be] focus:ring-2 focus:ring-[#83c5be]" />
          </div>
        </div>

        <div className="mt-4 max-h-[340px] overflow-auto rounded-lg border border-gray-200">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr><th className="px-3 py-2 text-left">Select</th><th className="px-3 py-2 text-left">Subject</th></tr>
            </thead>
            <tbody>
              {allSubjects.filter((s) => s.name.toLowerCase().includes(subjectFilter.toLowerCase())).map((s, idx) => {
                const checked = selectedSubjectIds.has(s.id);
                return (
                  <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2">
                      <input type="checkbox" className="h-4 w-4" checked={checked} onChange={() => toggleSubject(s.id)} />
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
            <button onClick={selectAllFiltered} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">Select filtered</button>
            <button onClick={clearSelection} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">Clear</button>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm">Cancel</button>
            <button onClick={onSave} className="rounded-lg bg-[#0ea5e9] px-4 py-2.5 text-sm font-medium text-white shadow-sm ring-1 ring-[#0ea5e9]/30 transition hover:bg-[#0284c7]">Save Assignment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
