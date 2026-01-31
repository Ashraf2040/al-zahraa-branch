'use client';

import { useMemo } from 'react';

type Lesson = {
  id: string;
  classId: string;
  teacher?: { name?: string; username?: string } | null;
  subject?: { name?: string } | null;
  objectives?: string;
  activities?: string;
  assessments?: string;
  homework?: string;
  date?: string;
  createdAt?: string;
};

type ClassType = { id: string; name: string };

type Props = {
  lessons: Lesson[];
  classes: ClassType[];
  selectedClassId: string;
};

export default function LessonsTable({ lessons, classes, selectedClassId }: Props) {
  const className = useMemo(
    () => classes.find((c) => c.id === selectedClassId)?.name ?? '-',
    [classes, selectedClassId]
  );

  const handlePrint = () => {
    const table = document.getElementById('lessons-table');
    if (!table) return;

    const html = `
      <html>
        <head>
          <title>Lessons - ${className}</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; padding: 24px; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #D1D5DB; padding: 8px; font-size: 12px; vertical-align: top; }
            th { background: #F3F4F6; text-align: left; }
            .muted { color: #6B7280; }
          </style>
        </head>
        <body>
          <h1>Lessons - ${className}</h1>
          ${table.outerHTML}
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#064e4f]">Lessons for {className}</h3>
        <button
          onClick={handlePrint}
          className="rounded-lg bg-[#10b981] px-4 py-2.5 text-white shadow-sm ring-1 ring-emerald-200 transition hover:bg-emerald-600"
        >
          Print Table
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl ring-1 ring-gray-200">
        <table id="lessons-table" className="w-full table-auto text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 font-semibold">Teacher</th>
              <th className="px-3 py-2 font-semibold">Subject</th>
              <th className="px-3 py-2 font-semibold">Objectives</th>
              <th className="px-3 py-2 font-semibold">Activities</th>
              <th className="px-3 py-2 font-semibold">Assessments</th>
              <th className="px-3 py-2 font-semibold">Homework</th>
              <th className="px-3 py-2 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lessons.map((l, i) => (
              <tr key={l.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2">
                  {l.teacher?.name || l.teacher?.username || '-'}
                </td>
                <td className="px-3 py-2">{l.subject?.name || '-'}</td>
                <td className="px-3 py-2 whitespace-pre-wrap">{l.objectives || '-'}</td>
                <td className="px-3 py-2 whitespace-pre-wrap">{l.activities || '-'}</td>
                <td className="px-3 py-2 whitespace-pre-wrap">{l.assessments || '-'}</td>
                <td className="px-3 py-2 whitespace-pre-wrap">{l.homework || '-'}</td>
                <td className="px-3 py-2">
                  {l.date ? new Date(l.date).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
            {lessons.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={7}>
                  No lessons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
