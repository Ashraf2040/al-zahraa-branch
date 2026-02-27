'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();

  const locale = params?.locale || 'en';
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (status !== 'authenticated') return;

    const role = (session?.user as any)?.role;

    if (role === 'COORDINATOR') router.replace(`/${locale}/coordin`);
    if (role === 'TEACHER') router.replace(`/${locale}/teacher`);
    if (role === 'ADMIN') router.replace(`/${locale}/admin`);

  }, [status, session, router, locale]);

  const isArabic = locale === 'ar';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-teal-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-orange-200/30 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-[20%] w-[40rem] h-[40rem] bg-emerald-300/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>

      <main className={`relative z-10 w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center ${isArabic ? 'rtl' : 'ltr'}`}>

        {/* Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-800 ring-1 ring-inset ring-teal-700/10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>

            {isArabic
              ? `نظام الإدارة الأكاديمي ${currentYear}`
              : `Academic Management System ${currentYear}`}
          </span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6 mt-8">
          <h1 className="text-5xl sm:text-6xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            {isArabic ? (
              <>
           
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-orange-400">
                 مدارس الفرقان الأهلية (القسم الثانوي)
                </span>
              </>
            ) : (
              <>
                Modernize Your <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-orange-400">
                  School Operations
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto text-xl text-slate-600 leading-8 max-w-2xl font-light">
            {isArabic
              ? 'منصة متكاملة مصممة لإدارة الحصص، المتابعة الإدارية، والتنسيق الأكاديمي الفوري.'
              : 'A unified platform designed for Al-Forqan Private Schools to streamline lesson planning, administrative oversight, and real-time academic coordination.'}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10">
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:bg-slate-800 hover:scale-105"
          >
            {isArabic ? 'دخول النظام' : 'Access Portal'}
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full">

          {/* Card 1 */}
          <div className="group relative rounded-2xl bg-white/70 backdrop-blur-sm p-8 border shadow-sm">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Image src="/file.svg" alt="" width={28} height={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {isArabic ? 'تخطيط المناهج' : 'Curriculum Planning'}
            </h3>

            <p className="text-slate-500 text-sm">
              {isArabic
                ? 'أدوات ذكية لمساعدة المعلمين في إعداد الخطط الدراسية.'
                : 'Empower teachers with intuitive lesson planning tools.'}
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl bg-white/70 backdrop-blur-sm p-8 border shadow-sm">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
              <Image src="/window.svg" alt="" width={28} height={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {isArabic ? 'الإدارة' : 'Administration'}
            </h3>

            <p className="text-slate-500 text-sm">
              {isArabic
                ? 'إدارة المعلمين والطلاب والمواد الدراسية.'
                : 'Centralized control of staff, students, and subjects.'}
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl bg-white/70 backdrop-blur-sm p-8 border shadow-sm">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <Image src="/globe.svg" alt="" width={28} height={28} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {isArabic ? 'التحديث اللحظي' : 'Real-Time Sync'}
            </h3>

            <p className="text-slate-500 text-sm">
              {isArabic
                ? 'مزامنة فورية للبيانات.'
                : 'Instant synchronization and live updates.'}
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}