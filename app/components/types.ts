'use client';

export type ID = string;

export interface Grade { id: ID; name: string; }
export interface Subject { id: ID; name: string; }
export interface WeeklyPlanItem {
  subjectId: ID;
  unit?: string | null;
  lessons?: string | null;
  pages?: string | null;
  homework?: string | null;
  classwork?: string | null;
}
export interface WeeklyPlan {
  id: ID;
  gradeId: ID;
  week: string;
  fromDate: string;
  toDate: string;
  grade: Grade;
  note?: string | null;
  dictation?: string | null;
  items: (WeeklyPlanItem & { subject: Subject })[];
}

export type PlanFields = { unit: string; lessons: string; pages: string; homework: string; classwork: string };
