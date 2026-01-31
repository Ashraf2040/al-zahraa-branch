// components/LessonsFilter.tsx
'use client';

import {useTranslations} from 'next-intl';
import toast from 'react-hot-toast';

interface Props {
  filter: {classId: string; date: string};
  setFilter: (f: any) => void;
  classes: {id: string; name: string}[];
  onFilter: () => void;
  showLessons: boolean;
  setShowLessons: (v: boolean) => void;
  showAssigned: boolean;
  setShowAssigned: (v: boolean) => void;
  pending?: boolean;
}

export default function LessonsFilter({
  filter,
  setFilter,
  classes,
  onFilter,
  showLessons,
  setShowLessons,
  showAssigned,
  setShowAssigned,
  pending
}: Props) {
  const t = useTranslations('LessonsFilter');

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <h3 className="mb-5 text-lg font-semibold text-[#064e4f]">
        {t('title')}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('classLabel')}
          </label>
          <select
            value={filter.classId}
            onChange={(e) => setFilter({...filter, classId: e.target.value})}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#006d77] focus:ring focus:ring-[#006d77]/20"
          >
            <option value="">{t('classPlaceholder')}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('dateLabel')}
          </label>
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({...filter, date: e.target.value})}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#006d77] focus:ring focus:ring-[#006d77]/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={onFilter}
            disabled={!filter.classId || !filter.date || pending}
            className="flex-1 rounded-lg bg-[#006d77] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#064e4f] disabled:opacity-50"
          >
            {pending ? t('loading') : t('showLessonsButton')}
          </button>

          <button
            onClick={() => {
              if (!filter.classId || !filter.date) {
                toast.error(t('selectClassAndDateFirst'));
                return;
              }
              setShowAssigned(true); // Only show teachers
            }}
            disabled={!filter.classId || !filter.date}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {t('showTeachersButton')}
          </button>
        </div>
      </div>

      {/* Visibility Toggles */}
      <div className="mt-5 flex gap-6 border-t pt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLessons}
            onChange={(e) => setShowLessons(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#006d77] focus:ring-[#006d77]"
          />
          <span className="text-sm text-gray-700">
            {t('showLessonsTable')}
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showAssigned}
            onChange={(e) => setShowAssigned(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
          />
          <span className="text-sm text-gray-700">
            {t('showAssignedTeachers')}
          </span>
        </label>
      </div>
    </div>
  );
}
