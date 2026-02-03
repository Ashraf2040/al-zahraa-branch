'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
 const currentYear = new Date().getFullYear();
  useEffect(() => {
    if (status !== 'authenticated') return;
    const role = (session?.user as any)?.role;
    // Redirect logic remains intact
    if (role === 'COORDINATOR') router.replace('/coordin');
    if (role === 'TEACHER') router.replace('/teacher');
    if (role === 'ADMIN') router.replace('/admin');
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      
      {/* ================= BACKGROUND ELEMENTS ================= */}
      {/* 1. Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* 2. Ambient Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-teal-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-orange-200/30 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-[20%] w-[40rem] h-[40rem] bg-emerald-300/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="relative z-10 w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* --- TOP BADGE --- */}
        <div className="animate-[fadeInDown_0.8s_ease-out]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-800 ring-1 ring-inset ring-teal-700/10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
           Academic Management System {currentYear}
          </span>
        </div>

        {/* --- BRANDING & LOGO --- */}
        <div className="mt-8 mb-10 flex justify-center animate-[fadeInUp_0.8s_ease-out_0.1s_both]">
          <div className="relative group">
            {/* Glowing Ring */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-teal-600 to-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-700 ease-in-out"></div>
            
            {/* Logo Container */}
            {/* <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-2xl flex items-center justify-center p-3 ring-1 ring-gray-900/5">
              <Image 
                src="/zahraa.png" 
                alt="Al-Zahraa Private Schools Logo" 
                width={200}
                height={200}
                className="object-contain w-full h-full"
                priority
              />
            </div> */}
          </div>
        </div>

        {/* --- HERO TEXT --- */}
        <div className="text-center max-w-4xl mx-auto space-y-6 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Modernize Your <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-orange-400">
                School Operations
              </span>
              {/* Underline effect */}
              <svg className="absolute bottom-1 left-0 w-full h-3 -z-0 text-orange-200 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="mx-auto text-xl text-slate-600 leading-8 max-w-2xl font-light">
            A unified platform designed for <strong className="text-slate-800 font-medium">Al-Zahraa Private Schools</strong> to streamline lesson planning, administrative oversight, and real-time academic coordination.
          </p>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:bg-slate-800 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Access Portal
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

        
        </div>

        {/* --- FEATURE CARDS --- */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
          
          {/* Card 1 */}
          <div className="group relative rounded-2xl bg-white/70 backdrop-blur-sm p-8 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white hover:border-teal-100">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white group-hover:ring-transparent">
              <Image src="/file.svg" alt="Lesson Planning" width={28} height={28} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">Curriculum Planning</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Empower teachers with intuitive tools to design, organize, and submit detailed lesson plans efficiently.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl bg-white/70 backdrop-blur-sm p-8 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white hover:border-slate-200">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-800 group-hover:text-white group-hover:ring-transparent">
              <Image src="/window.svg" alt="Admin Tools" width={28} height={28} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">Administration</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Centralized control for managing staff, student allocations, and subject assignments with precision.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl bg-white/70 backdrop-blur-sm p-8 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white hover:border-orange-100">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 ring-1 ring-orange-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white group-hover:ring-transparent">
              <Image src="/globe.svg" alt="Real-Time Updates" width={28} height={28} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">Real-Time Sync</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Ensure all stakeholders stay informed with instant data synchronization and live schedule updates.
            </p>
          </div>

        </div>

        {/* --- FOOTER ACCENT --- */}
        <div className="mt-24 flex items-center justify-center space-x-2 opacity-40">
           <div className="h-[2px] w-8 rounded-full bg-slate-300"></div>
           <div className="h-[2px] w-8 rounded-full bg-slate-400"></div>
           <div className="h-[2px] w-8 rounded-full bg-slate-500"></div>
        </div>

      </main>
    </div>
  );
}