// app/teacherData/page.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      role: string;
    } & DefaultSession['user'];
  }
}

type TTeacher = {
  id: string;
  username: string;
  name: string;
  role?: string | null | undefined;
  password?: string | null;
  classes: { id: string; name: string }[];
  subjects?: { id: string; name: string }[];
};

export default function TeacherDataPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('TeacherDataPage');

  const [teachers, setTeachers] = useState<TTeacher[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const loadedOnce = useRef(false);

  const track = <T,>(p: Promise<T>) => {
    setPendingCount((c) => c + 1);
    return p.finally(() => setPendingCount((c) => Math.max(0, c - 1)));
  };

  const fetchJson = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
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
    },
    [t] // ← مهم
  );


  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    if (loadedOnce.current) return;
    loadedOnce.current = true;

    const load = async () => {
      await toast.promise(
        track(fetchJson('/api/admin/teachers').then((tchs) => setTeachers(tchs))),
        {
          loading: t('toast.loading'),
          success: t('toast.success'),
          error: (e) =>
            t('toast.error', { message: String((e as any)?.message || e) })
        }
      );
    };

    load();
  }, [session, status, router, t, fetchJson]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f1fbf9] to-[#eaf7f5] p-6 pt-20">
      <div className="mx-auto mb-6 h-1 w-full max-w-7xl rounded-full bg-[#006d77]" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#064e4f]">
              {t('header.title')}
            </h1>
            <p className="text-sm text-gray-600">
              {t('header.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#83c5be] focus:ring-offset-2"
            >
              {t('actions.back')}
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-[#006d77] px-4 py-2.5 font-medium text-white shadow-sm ring-1 ring-[#006d77]/20 transition hover:bg-[#006d77]/90 focus:outline-none focus:ring-2 focus:ring-[#006d77] focus:ring-offset-2"
            >
              {t('actions.print')}
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-100"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#064e4f]">
                  {teacher.name}
                </h3>
                <span className="rounded-full bg-[#83c5be]/30 px-3 py-1 text-xs text-[#064e4f]">
                  {t('card.classesCount', {
                    count: teacher.classes?.length ?? 0
                  })}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">
                    {t('card.username')}
                  </span>
                  <span className="ml-2 font-medium text-gray-800">
                    {teacher.username}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t('card.password')}
                  </span>
                  <span className="ml-2 font-medium text-gray-800">
                    {teacher.password ?? t('card.noneDash')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t('card.classes')}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(teacher.classes ?? []).map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
                      >
                        {c.name}
                      </span>
                    ))}
                    {(teacher.classes ?? []).length === 0 && (
                      <span className="text-gray-400">
                        {t('card.none')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {teachers.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-lg ring-1 ring-gray-100">
              {t('empty')}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {pendingCount > 0 && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-lg ring-1 ring-gray-200">
            <span className="h-3 w-3 animate-ping rounded-full bg-[#006d77]" />
            <span className="text-sm text-gray-700">
              {t('loading.working')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
