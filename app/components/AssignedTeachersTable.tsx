import { useMemo } from 'react';
import { formatTime } from '../utils/adminClient';

interface Teacher {
  id: string;
  username: string;
  name: string;
  submitted: boolean;
  submittedAt?: string | null;
  missingSubjects: string[];
  missingSubjectIds: string[];
}

interface Props {
  show: boolean;
  data: Teacher[];
  loading?: boolean;
  scheduleInfo: { [dayIndex: number]: string[] }; // array of subjectId strings
  filter: { classId: string; date: string };
}

export default function AssignedTeachersTable({
  show,
  data,
  loading,
  scheduleInfo,
  filter,
}: Props) {
  const teachersForToday = useMemo(() => {
    if (!show || !filter.date || !scheduleInfo) {
      return [];
    }

    const dayIndex = new Date(filter.date).getDay();
    const daySchedule = scheduleInfo[dayIndex] ?? [];

    // مجموعة مواد اليوم
    const scheduledSubjectIds = new Set<string>(daySchedule);

    // هنا بدل ما نفلتر المدرسين الناقصين نعرض كل المدرسين اللي ليهم على الأقل مادة في جدول اليوم
    const filtered = data.filter(t =>
      // المدرس ليه مادة واحدة على الأقل في جدول اليوم (مش شرط يكون ناقص درس)
      t.missingSubjectIds.some(id => scheduledSubjectIds.has(id)) || 
      // أو حتى لو مفيش مواد ناقصة لكن ليه مواد مسجلة (يعني موجود)
      scheduledSubjectIds.size > 0
    );

    // أو ببساطة ممكن تعرض كل المدرسين اللي موجودين من data بدون فلترة لو حابب:
    // const filtered = data;

    return filtered;
  }, [data, scheduleInfo, filter.date, show]);

  if (!show) return null;

  if (teachersForToday.length === 0) {
    return (
      <div className="mt-6 rounded-xl bg-amber-50 p-5 text-amber-800 shadow-sm">
        <p className="font-medium">No teachers have sessions scheduled for this day.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className="bg-[#006d77] px-6 py-3">
        <h3 className="text-lg font-semibold text-white">Teachers with Sessions Today</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Username</th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Submitted At</th>
              <th className="px-6 py-3 text-left font-medium text-gray-700">Missing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachersForToday.map((t, i) => (
              <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-3 font-medium text-gray-800">{t.username}</td>
                <td className="px-6 py-3">{t.name}</td>
                <td className="px-6 py-3">
                  {t.submitted ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200">
                      Missing
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-gray-600">
                  {/* عرض التوقيت بشكل جميل */}
                  {t.submittedAt ? formatTime(t.submittedAt) : '—'}
                </td>
                <td className="px-6 py-3">
                  {t.missingSubjects.length > 0 ? (
                    <ul className="space-y-1 text-xs text-rose-700">
                      {t.missingSubjects.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1">• {s}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
