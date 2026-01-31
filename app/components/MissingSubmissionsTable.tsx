import React, { useMemo } from 'react';

interface Teacher {
  id: string;
  name: string;
  submitted: boolean;
  missingSubjects: string[];
  missingSubjectIds: string[];
  assignedSubjectIds: string[];
}

interface Props {
  data: Teacher[];
  scheduleInfo: { [dayIndex: number]: string[] };
  date: string;
}

export default function MissingSubmissionsTable({ data, scheduleInfo, date }: Props) {
  const dayIndex = new Date(date).getDay();

  const teachersMissing = useMemo(() => {
    // FIX: Moved Set creation inside useMemo callback
    const todaysScheduledSubjects = new Set(scheduleInfo[dayIndex] || []);
    
    return data.filter(teacher => {
      const assignedIds = Array.isArray(teacher.assignedSubjectIds) ? teacher.assignedSubjectIds : [];
      const hasSessionToday = assignedIds.some(subjectId => todaysScheduledSubjects.has(subjectId));
      const notSubmitted = !teacher.submitted;
      return hasSessionToday && notSubmitted;
    });
  }, [data, scheduleInfo, dayIndex]); // Added dayIndex to dependencies

  if (teachersMissing.length === 0) {
    return <p>No missing submissions for this day.</p>;
  }

  return (
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-left">Teacher Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Missing Submissions</th>
        </tr>
      </thead>
      <tbody>
        {teachersMissing.map(teacher => (
          <tr key={teacher.id} className="even:bg-gray-100">
            <td className="border border-gray-300 px-4 py-2">{teacher.name}</td>
            <td className="border border-gray-300 px-4 py-2">
              {teacher.missingSubjects && teacher.missingSubjects.length > 0
                ? teacher.missingSubjects.join(', ')
                : 'None'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}