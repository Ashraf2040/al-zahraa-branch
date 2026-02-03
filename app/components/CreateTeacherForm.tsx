// app/admin/components/CreateTeacherForm.tsx
"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

interface Teacher {
  username: string;
  name: string;
  arabicName: string;
  password: string;
  classIds: string[];
  subjectIds: string[];
  role: 'TEACHER' | 'ADMIN';   // now selectable
}

interface Props {
  show: boolean;
  classes: any[];
  subjects: any[];
  track: <T>(p: Promise<T>) => Promise<T>;
  fetchJson: (input: RequestInfo, init?: RequestInit) => Promise<any>;
  toast: typeof toast;
  onSuccess: () => void;
  pending: number;
}

export default function CreateTeacherForm({
  show,
  classes,
  subjects,
  track,
  fetchJson,
  toast,
  onSuccess,
  pending,
}: Props) {
  const t = useTranslations('CreateTeacherForm');

  const [newTeacher, setNewTeacher] = useState<Teacher>({
    username: '',
    name: '',
    arabicName: '',
    password: '',
    classIds: [],
    subjectIds: [],
    role: 'TEACHER', // default
  });

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTeacher.arabicName.trim()) {
      toast.error(t('toast.arabicNameRequired') || 'Arabic name is required');
      return;
    }

    await toast.promise(
      track(
        (async () => {
          await fetchJson('/api/admin/teachers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTeacher),
          });
          onSuccess();
          setNewTeacher({
            username: '',
            name: '',
            arabicName: '',
            password: '',
            classIds: [],
            subjectIds: [],
            role: 'TEACHER',
          });
        })()
      ),
      {
        loading: t('toast.creating'),
        success: t('toast.success'),
        error: (err) => `${t('toast.error')} ${err.message || ''}`,
      }
    );
  };

  return (
    <div className="mx-auto mb-8 max-w-3xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
      <h2 className="mb-4 text-xl font-semibold text-[#064e4f]">
        {t('title')}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Username */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('labels.username')}
          </label>
          <input
            placeholder={t('placeholders.username')}
            value={newTeacher.username}
            onChange={(e) => setNewTeacher({ ...newTeacher, username: e.target.value })}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* English Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('labels.name')} (EN)
          </label>
          <input
            placeholder={t('placeholders.name')}
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Arabic Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('labels.arabicName')} (عربي)
          </label>
          <input
            placeholder={t('placeholders.arabicName') || 'الاسم بالعربية'}
            value={newTeacher.arabicName}
            onChange={(e) => setNewTeacher({ ...newTeacher, arabicName: e.target.value })}
            required
            dir="rtl"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-right"
          />
        </div>

        {/* Password */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('labels.password')}
          </label>
          <input
            type="password"
            placeholder={t('placeholders.password')}
            value={newTeacher.password}
            onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('labels.role') || 'Role'}
          </label>
          <select
            value={newTeacher.role}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, role: e.target.value as 'TEACHER' | 'ADMIN' })
            }
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          >
            <option value="TEACHER">{t('roles.teacher') || 'Teacher'}</option>
            <option value="ADMIN">{t('roles.admin') || 'Admin'}</option>
          </select>
        </div>

        {/* Classes (only shown for TEACHER) */}
        {newTeacher.role === 'TEACHER' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {t('labels.assignClasses')}
            </label>
            <select
              multiple
              value={newTeacher.classIds}
              onChange={(e) =>
                setNewTeacher({
                  ...newTeacher,
                  classIds: Array.from(e.target.selectedOptions, (o) => o.value),
                })
              }
              className="h-32 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subjects (only shown for TEACHER) */}
        {newTeacher.role === 'TEACHER' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {t('labels.assignSubjects')}
            </label>
            <select
              multiple
              value={newTeacher.subjectIds}
              onChange={(e) =>
                setNewTeacher({
                  ...newTeacher,
                  subjectIds: Array.from(e.target.selectedOptions, (o) => o.value),
                })
              }
              className="h-32 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending > 0}
            className="w-full rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {pending > 0 ? t('buttons.working') : t('buttons.create')}
          </button>
        </div>
      </form>
    </div>
  );
}