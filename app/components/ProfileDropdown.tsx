'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SignOutButton } from './SignOutButton';

type ProfileDropdownProps = {
  name: string;
  email: string;
  role: string;
  initials: string;
  arabicName: string;
};

export function ProfileDropdown({
  name,
  email,
  arabicName,
  role,
  initials,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('ProfileDropdown');
  const locale = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 sm:gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 pl-2 pr-3 py-1.5 border border-indigo-100/50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 shadow-sm hover:shadow-md group"
      >
        <div className="relative">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all duration-200">
            {initials}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-slate-800 leading-tight">
            {locale === 'ar' ? arabicName : name}
          </p>
          <p className="text-xs text-slate-500 leading-tight">
            {role === 'ADMIN' ? t('roles.admin') : t('roles.teacher')}
          </p>
        </div>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-2xl shadow-indigo-500/10 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base truncate">{name}</p>
                {arabicName && (
                  <p className="text-white/80 text-sm truncate font-medium" dir="rtl">
                    {arabicName}
                  </p>
                )}
                {email && (
                  <p className="text-white/70 text-xs truncate mt-0.5">{email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role Badge */}
          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg
                  className="h-3.5 w-3.5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-indigo-700">
                {role === 'ADMIN' ? t('roles.admin') : t('roles.teacher')}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150"
              onClick={() => setOpen(false)}
            >
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <span className="font-medium">{t('viewProfile')}</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150"
              onClick={() => setOpen(false)}
            >
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="font-medium">{t('settings')}</span>
            </Link>
          </div>

          <div className="mx-4 border-t border-slate-100"></div>

          {/* Sign Out */}
          <div className="py-2 px-3">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
}