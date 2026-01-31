// hooks/useAssignedTeachers.ts
import { useMemo } from 'react';

// ——— Types ———
interface Teacher {
  id: string;
  username: string;
  name: string;
  classes: { id: string }[];
  subjects: { id: string }[];
}

interface Subject {
  id: string;
  name: string;
}

interface Lesson {
  teacherId: string;
  subjectId: string;
  createdAt?: string;
}

interface ScheduleItem {
  session: number;
  subjectId: string;
}

interface Props {
  lessons: Lesson[];
  teachers: Teacher[];
  filter: { classId: string; date: string };
  scheduleInfo: { [dayIndex: number]: ScheduleItem[] };
  subjects: Subject[];
}

// ——— Hook ———
export const useAssignedTeachers = ({
  lessons,
  teachers,
  filter,
  scheduleInfo,
  subjects,
}: Props) =>
  useMemo(() => {
    if (!filter.classId || !filter.date) return [];

    const dayIndex = new Date(filter.date).getDay();
    const daySchedule = scheduleInfo?.[dayIndex] ?? [];

    const scheduledSubjectIds = new Set<string>(
      daySchedule
        .filter((item): item is ScheduleItem => !!item?.subjectId)
        .map((item) => item.subjectId)
    );

    // 🟢 Fallback: if there’s no schedule for the selected date, show all lessons instead of empty
    const showAllSubjects = scheduledSubjectIds.size === 0;

    // Map subjectId → name
    const subjectMap = new Map<string, string>();
    subjects.forEach((s) => subjectMap.set(s.id, s.name));

    return teachers
      .filter((t) => (t.classes ?? []).some((c) => c.id === filter.classId))
      .map((t) => {
        const teacherSubjectIds = (t.subjects ?? []).map((s) => s.id);

        // 🟢 If no schedule found, consider all teacher subjects relevant
        const relevantSubjectIds = showAllSubjects
          ? teacherSubjectIds
          : teacherSubjectIds.filter((id) => scheduledSubjectIds.has(id));

        const teacherLessons = lessons.filter(
          (l) => l.teacherId === t.id && relevantSubjectIds.includes(l.subjectId)
        );

        const missingSubjectIds = relevantSubjectIds.filter(
          (id) => !teacherLessons.some((l) => l.subjectId === id)
        );

        return {
          id: t.id,
          username: t.username,
          name: t.name,
          submitted: missingSubjectIds.length === 0,
          submittedAt:
            teacherLessons.length > 0 ? teacherLessons[0].createdAt : null,
          missingSubjectIds,
          missingSubjects: missingSubjectIds.map(
            (id) => subjectMap.get(id) ?? 'Unknown'
          ),
        };
      })
      // 🟢 Always show all teachers for the class — don’t hide them when no lessons match
      .filter((t) => showAllSubjects || t.missingSubjectIds.length > 0 || t.submitted);
  }, [lessons, teachers, filter, scheduleInfo, subjects]);