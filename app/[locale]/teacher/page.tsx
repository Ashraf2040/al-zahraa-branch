

'use client';

import { useEffect, useMemo, useState, useRef } from 'react'; // Import useRef
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

type Lesson = {
  id: string;
  classId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  unit: string;
  lesson: string;
  objective: string;
  homework?: string | null;
  pages: string;
  comments?: string | null;
  class?: { id: string; name: string };
  subject?: { id: string; name: string };
};

const getTodayStr = () => new Date().toISOString().slice(0, 10);

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('TeacherDashboard');

  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [todayLessons, setTodayLessons] = useState<Lesson[]>([]);

  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    date: getTodayStr(),
    unit: '',
    lesson: '',
    objective: '',
    homework: '',
    pages: '',
    comments: ''
  });

  // Global pending counter
  const [pendingCount, setPendingCount] = useState(0);
  const track = <T,>(p: Promise<T>) => {
    setPendingCount((c) => c + 1);
    return p.finally(() => setPendingCount((c) => Math.max(0, c - 1)));
  };

  // JSON fetch helper
  const fetchJson = async (input: RequestInfo, init?: RequestInit) => {
    const res = await fetch(input, init);
    let data: any = null;
    try {
      data = await res.json();
    } catch { }
    if (!res.ok) {
      const message =
        data?.error || res.statusText || t('errors.requestFailed');
      throw new Error(message);
    }
    return data;
  };

  const teacherId = session?.user?.id as string | undefined;
  const today = useMemo(getTodayStr, []);

  // FIX: Use useRef to track if we have already loaded the initial data
  const hasInitialized = useRef(false);

  // Initial load
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !session.user) {
      router.push('/login');
      return;
    }

    // FIX: If we have already loaded data once, don't reload just because session updated
    // (e.g. when switching tabs)
    if (hasInitialized.current) {
      return;
    }

    const load = async () => {
      await toast.promise(
        track(
          Promise.all([
            fetchJson(`/api/users/${session.user.id}/classes`),
            fetchJson(`/api/users/${session.user.id}/subjects`),
            fetchJson(
              `/api/lessons?teacherId=${session.user.id}&date=${today}`
            )
          ]).then(([c, s, l]) => {
            setClasses(c);
            setSubjects(s);
            setTodayLessons(l);
          })
        ),
        {
          loading: t('toast.loadingDashboard'),
          success: t('toast.dashboardReady'),
          error: (e) =>
            t('toast.loadFailed', {
              message: String((e as any)?.message || e)
            })
        }
      );
    };

    load();

    // Mark as initialized so it doesn't run again
    hasInitialized.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, today, t]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete') || "Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      await toast.promise(
        track(fetchJson(`/api/lessons/${id}`, { method: 'DELETE' })),
        {
          loading: t('toast.deleting'),
          success: t('toast.lessonDeleted'),
          error: (e) => `${t('toast.deleteFailed')}: ${String((e as any)?.message || e)}`,
        }
      ).then(() => refreshTodayLessons());
    } catch (err) {
      console.error(err);
    }
  };

  const refreshTodayLessons = async () => {
    if (!teacherId) return;
    await toast
      .promise(
        track(
          fetchJson(`/api/lessons?teacherId=${teacherId}&date=${today}`)
        ),
        {
          loading: t('toast.refreshLoading'),
          success: t('toast.refreshSuccess'),
          error: (e) =>
            t('toast.refreshFailed', {
              message: String((e as any)?.message || e)
            })
        }
      )
      .then((data) => setTodayLessons(data as Lesson[]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) {
      toast.error(t('errors.notAuthenticated'));
      return;
    }

    const payload = { ...formData, teacherId };
    try {
      await toast.promise(
        track(
          (async () => {
            await fetchJson('/api/lessons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            await refreshTodayLessons();
          })()
        ),
        {
          loading: t('toast.submitLoading'),
          success: t('toast.submitSuccess'),
          error: (e) =>
            t('toast.submitFailed', {
              message: String((e as any)?.message || e)
            })
        }
      );
    } catch { }
  };

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Lesson>>({});

  const startEdit = (row: Lesson) => {
    setEditingId(row.id);
    setEditData({
      unit: row.unit,
      lesson: row.lesson,
      objective: row.objective,
      homework: row.homework ?? '',
      pages: row.pages,
      comments: row.comments ?? ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await toast.promise(
        track(
          (async () => {
            await fetchJson(`/api/lessons/${editingId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editData)
            });
            await refreshTodayLessons();
            cancelEdit();
          })()
        ),
        {
          loading: t('toast.saveLoading'),
          success: t('toast.saveSuccess'),
          error: (e) =>
            t('toast.saveFailed', {
              message: String((e as any)?.message || e)
            })
        }
      );
    } catch { }
  };

  const todaysTeacherLessons = todayLessons.filter(
    (l: any) => l.teacherId === teacherId
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="inline-flex items-center gap-3 text-teal-700">
          <span className="h-3 w-3 animate-ping rounded-full bg-teal-500" />
          <span className="text-lg font-medium">
            {t('loading.fullscreen')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8  space-y-8">
      {/* Global loading overlay */}
      {pendingCount > 0 && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-2xl ring-1 ring-slate-900/5">
            <span className="h-3 w-3 animate-ping rounded-full bg-teal-600" />
            <span className="text-sm font-medium text-slate-700">
              {t('loading.processing')}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto pt-24 w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {t('header.title')}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {t('header.welcome', {
                name: session?.user?.name ?? ''
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="font-semibold text-teal-700">
              {t('header.todayLabel')}
            </span>
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Form (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t('form.title')}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {t('form.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                      {t('form.classLabel')}
                    </label>
                    <select
                      value={formData.classId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          classId: e.target.value
                        })
                      }
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm"
                      required
                      disabled={pendingCount > 0}
                    >
                      <option value="">
                        {t('form.classPlaceholder')}
                      </option>
                      {classes.map((cls: any) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                      {t('form.subjectLabel')}
                    </label>
                    <select
                      value={formData.subjectId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjectId: e.target.value
                        })
                      }
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm"
                      required
                      disabled={pendingCount > 0}
                    >
                      <option value="">
                        {t('form.subjectPlaceholder')}
                      </option>
                      {subjects.map((sub: any) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                      {t('form.dateLabel')}
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date: e.target.value
                        })
                      }
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm"
                      required
                      disabled={pendingCount > 0}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                      {t('form.unitTitleLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('form.unitPlaceholder')}
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          unit: e.target.value
                        })
                      }
                      className="mb-3 block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm"
                      required
                      disabled={pendingCount > 0}
                    />
                    <input
                      type="text"
                      placeholder={t('form.lessonPlaceholder')}
                      value={formData.lesson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lesson: e.target.value
                        })
                      }
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm"
                      required
                      disabled={pendingCount > 0}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                      {t('form.objectiveLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('form.objectivePlaceholder')}
                      value={formData.objective}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          objective: e.target.value
                        })
                      }
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm"
                      required
                      disabled={pendingCount > 0}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                        {t('form.pagesLabel')}
                      </label>
                      <input
                        type="text"
                        value={formData.pages}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pages: e.target.value
                          })
                        }
                        className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm"
                        required
                        disabled={pendingCount > 0}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                        {t('form.homeworkLabel')}
                      </label>
                      <input
                        type="text"
                        value={formData.homework}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            homework: e.target.value
                          })
                        }
                        className="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm"
                        disabled={pendingCount > 0}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                      {t('form.commentsLabel')}
                    </label>
                    <textarea
                      value={formData.comments}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          comments: e.target.value
                        })
                      }
                      className="min-h-[80px] block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition shadow-sm resize-none"
                      disabled={pendingCount > 0}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        classId: '',
                        subjectId: '',
                        date: formData.date,
                        unit: '',
                        lesson: '',
                        objective: '',
                        homework: '',
                        pages: '',
                        comments: ''
                      })
                    }
                    disabled={pendingCount > 0}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                  >
                    {t('form.resetButton')}
                  </button>
                  <button
                    type="submit"
                    disabled={pendingCount > 0}
                    className="flex-[2] inline-flex items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 ring-1 ring-teal-700/10 transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60"
                  >
                    {pendingCount > 0
                      ? t('form.submitting')
                      : t('form.submitButton')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Table (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {t('table.title')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('table.subtitle')}
                  </p>
                </div>
                <button
                  onClick={refreshTodayLessons}
                  disabled={pendingCount > 0}
                  className="rounded-lg bg-white p-2 text-slate-500 transition hover:text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                  title={t('table.refreshTitle')}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-x-scroll min-w-[800px]">
                {todaysTeacherLessons?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <svg
                        className="h-6 w-6 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">
                      {t('table.emptyTitle')}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {t('table.emptySubtitle')}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/80 text-slate-900 font-semibold text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-4">
                          {t('table.columns.classSubject')}
                        </th>
                        <th className="px-6 py-4">
                          {t('table.columns.unit')}
                        </th>
                        <th className="px-6 py-4">
                          {t('table.columns.lesson')}
                        </th>
                        <th className="px-6 py-4">
                          {t('table.columns.objective')}
                        </th>
                        <th className="px-6 py-4">
                          {t('table.columns.pages')}
                        </th>
                        <th className="px-6 py-4">
                          {t('table.columns.homework')}
                        </th>
                        <th className="px-6 py-4">
                          {t('table.columns.comments')}
                        </th>
                        <th className="px-6 py-4 text-right">
                          {t('table.columns.action')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {todaysTeacherLessons?.map((row) => {
                        const isEditing = editingId === row.id;
                        return (
                          <tr
                            key={row.id}
                            className={`group transition-colors duration-200 ${isEditing
                                ? 'bg-teal-50/30'
                                : 'hover:bg-slate-50'
                              }`}
                          >
                            {/* Class/Subject */}
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">
                                {row.class?.name || ''}
                              </div>
                              <div className="text-xs text-slate-500">
                                {row.subject?.name || ''}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={String(editData.unit ?? '')}
                                  onChange={(e) =>
                                    setEditData((d) => ({
                                      ...d,
                                      unit: e.target.value
                                    }))
                                  }
                                  className="w-full rounded-lg border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                                  disabled={pendingCount > 0}
                                />
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
                                  {row.unit}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={String(editData.lesson ?? '')}
                                  onChange={(e) =>
                                    setEditData((d) => ({
                                      ...d,
                                      lesson: e.target.value
                                    }))
                                  }
                                  className="w-full rounded-lg border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                                  disabled={pendingCount > 0}
                                />
                              ) : (
                                <span className="font-medium text-slate-700">
                                  {row.lesson}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4 max-w-[200px]">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={String(
                                    editData.objective ?? ''
                                  )}
                                  onChange={(e) =>
                                    setEditData((d) => ({
                                      ...d,
                                      objective: e.target.value
                                    }))
                                  }
                                  className="w-full rounded-lg border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                                  disabled={pendingCount > 0}
                                />
                              ) : (
                                <span
                                  className="truncate block"
                                  title={row.objective}
                                >
                                  {row.objective}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={String(editData.pages ?? '')}
                                  onChange={(e) =>
                                    setEditData((d) => ({
                                      ...d,
                                      pages: e.target.value
                                    }))
                                  }
                                  className="w-full rounded-lg border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                                  disabled={pendingCount > 0}
                                />
                              ) : (
                                row.pages
                              )}
                            </td>

                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={String(
                                    editData.homework ?? ''
                                  )}
                                  onChange={(e) =>
                                    setEditData((d) => ({
                                      ...d,
                                      homework: e.target.value
                                    }))
                                  }
                                  className="w-full rounded-lg border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                                  disabled={pendingCount > 0}
                                />
                              ) : row.homework ? (
                                row.homework
                              ) : (
                                <span className="text-slate-300">
                                  {t('table.emptyDash')}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={String(
                                    editData.comments ?? ''
                                  )}
                                  onChange={(e) =>
                                    setEditData((d) => ({
                                      ...d,
                                      comments: e.target.value
                                    }))
                                  }
                                  className="w-full rounded-lg border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                                  disabled={pendingCount > 0}
                                />
                              ) : (
                                <span
                                  className="truncate block max-w-[150px] italic text-slate-400"
                                  title={row.comments || ''}
                                >
                                  {row.comments || ''}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={saveEdit}
                                    disabled={pendingCount > 0}
                                    className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-teal-800 transition disabled:opacity-50"
                                  >
                                    {t('table.saveButton')}
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    disabled={pendingCount > 0}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition disabled:opacity-50"
                                  >
                                    {t('table.cancelButton')}
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(row)}
                                    disabled={pendingCount > 0}
                                    className="group/btn rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-teal-700 shadow-sm hover:bg-teal-600 hover:text-white transition disabled:opacity-50"
                                  >
                                    {t('table.editButton')}
                                  </button>
                                  <button
                                    onClick={() => handleDelete(row.id)}
                                    disabled={pendingCount > 0}
                                    className="rounded-md bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 shadow-sm ring-1 ring-red-100 transition disabled:opacity-60"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
