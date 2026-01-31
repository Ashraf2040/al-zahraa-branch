'use client';

import { Dispatch, SetStateAction } from 'react';

type ClassType = { id: string; name: string };
type Filter = { classId: string; date: string };

type Props = {
  classes: ClassType[];
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  pending: boolean;
  onShow: () => void;
  onToggleAssigned: () => void;
  assignedEnabled: boolean;
  assignedShown: boolean;
  lessonsShown: boolean;
  onHideLessons: () => void;
};

export default function LessonsFilter({
  classes,
  filter,
  setFilter,
  pending,
  onShow,
  onToggleAssigned,
  assignedEnabled,
  assignedShown,
  lessonsShown,
  onHideLessons,
}: Props) {
  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-[#064e4f]">View Lessons</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Class</label>
          <select
            value={filter.classId}
            onChange={(e) => setFilter((f) => ({ ...f, classId: e.target.value }))}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2"
            disabled={pending}
          >
            <option value="">Select a class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter((f) => ({ ...f, date: e.target.value }))}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2"
            disabled={pending}
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={onShow}
            disabled={pending}
            className="rounded-lg bg-[#006d77] px-4 py-2.5 text-white shadow-sm ring-1 ring-[#006d77]/20 transition hover:bg-[#006d77]/90"
          >
            Show Lessons
          </button>

          {lessonsShown && (
            <button
              onClick={onHideLessons}
              disabled={pending}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 transition hover:bg-gray-50"
            >
              Hide
            </button>
          )}

          <button
            onClick={onToggleAssigned}
            disabled={!assignedEnabled || pending}
            className={`rounded-lg px-4 py-2.5 text-white shadow-sm transition ${
              assignedShown ? 'bg-[#83c5be] hover:bg-[#83c5be]/90' : 'bg-[#0ea5e9] hover:bg-sky-500'
            }`}
            title="Show assigned teachers and submission status"
          >
            {assignedShown ? 'Hide Teachers' : 'Teachers Status'}
          </button>
        </div>
      </div>
    </div>
  );
}
