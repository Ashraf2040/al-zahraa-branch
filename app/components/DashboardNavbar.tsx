'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import LanguageSwitcher from './LanguageSwitcher';
import { ProfileDropdown } from './ProfileDropdown';

export default function DashboardNavbar() {
  const { data: session, status } = useSession();
  const t = useTranslations('DashboardNavbar');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (status === 'loading' || !session?.user) return null;

  const role = session.user.role;
  const initials =
    session.user.name
      ?.split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-indigo-500/5 border-b border-indigo-100/50'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200/40'
      }`}
    >
      <div className="w-full h-14 sm:h-16 md:h-20 px-3 sm:px-4 lg:px-8">
        <div className="flex h-full items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href={role === 'ADMIN' ? '/admin' : '/teacher'}
            className="flex items-center gap-2 sm:gap-4 group transition-transform active:scale-95"
          >
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
              <span className="font-bold text-sm sm:text-base md:text-lg tracking-tight">SM</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                {t('appName')}
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {role === 'ADMIN' ? t('adminDashboard') : t('teacherDashboard')}
              </p>
            </div>
          </Link>

          {/* Center Navigation */}
          {/* <div className="hidden lg:flex items-center gap-1">
            <Link
              href={role === 'ADMIN' ? '/admin' : '/teacher'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>{t('home')}</span>
            </Link>
            <Link
              href={role === 'ADMIN' ? '/admin/students' : '/teacher/lessons'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
              <span>{role === 'ADMIN' ? t('students') : t('myLessons')}</span>
            </Link>
          </div> */}

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            {/* Mobile Menu */}
            <button className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 border border-indigo-100/50 text-slate-600 hover:text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 shadow-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <LanguageSwitcher />

            <div className="h-6 w-px bg-gradient-to-b from-transparent via-indigo-200 to-transparent hidden md:block"></div>

            <ProfileDropdown
              name={session.user.name || t('user')}
              email={session.user.email || ''}
              arabicName={session.user.arabicName || ''}
              role={role}
              initials={initials}
            />
          </div>
        </div>
      </div>
    </header>
  );
}