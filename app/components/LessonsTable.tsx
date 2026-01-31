// app/admin/components/LessonsTable.tsx

'use client';

import {useTranslations} from 'next-intl';

interface Props {
  show: boolean;
  loading: boolean;
  lessons: any[];
  onPrint: () => void;
}

// Keep your existing helper somewhere imported
declare function subjectSortIndex(name: string): number;

export default function LessonsTable({show, loading, lessons, onPrint}: Props) {
  const t = useTranslations('LessonsTable');

  if (!show) return null;

  const sorted = [...lessons].sort(
    (a, b) =>
      subjectSortIndex(a.subject?.name ?? '') -
      subjectSortIndex(b.subject?.name ?? '')
  );

  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className="bg-[#006d77] px-6 py-4">
        <h3 className="text-lg font-semibold text-white">
          {t('title')}
        </h3>
      </div>

      {loading && (
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-full animate-pulse rounded bg-gray-100"
              />
            ))}
          </div>
        </div>
      )}

      {!loading && lessons.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">
            {t('noLessons')}
          </p>
        </div>
      )}

      {!loading && lessons.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table id="lessons-table" className="w-full table-auto text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">
                    {t('subject')}
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">
                    {t('unit')}
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">
                    {t('lesson')}
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">
                    {t('objective')}
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">
                    {t('pages')}
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">
                    {t('homework')}
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">
                    {t('comments')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sorted.map((l, i) => (
                  <tr
                    key={l.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {l.subject?.name ?? ''}
                    </td>
                    <td className="px-6 py-3">{l.unit ?? ''}</td>
                    <td className="px-6 py-3">{l.lesson ?? ''}</td>
                    <td className="px-6 py-3">{l.objective ?? ''}</td>
                    <td className="px-6 py-3">{l.pages ?? ''}</td>
                    <td className="px-6 py-3">{l.homework || t('dash')}</td>
                    <td
                      className="px-6 py-3 text-sm"
                      dir={
                        ['Islamic', 'Arabic'].includes(l.subject?.name ?? '')
                          ? 'rtl'
                          : 'ltr'
                      }
                    >
                      {l.comments || t('dash')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 p-4 text-right">
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              {t('print')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
