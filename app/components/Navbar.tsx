// app/components/Navbar.tsx
'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useLocale } from 'next-intl';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
const locale = useLocale();
  const isAuthed = status === 'authenticated';
  const role = session?.user?.role as 'ADMIN' | 'TEACHER' | undefined;
  const name = locale === 'ar' ? session?.user?.arabicName : session?.user?.name; 
  
  const username = session?.user?.username ?? '';
  const destination = role === 'ADMIN' ? '/admin' : '/teacher';

  return (
    <header className="w-full border-b border-gray-200 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-semibold text-[#064e4f] hover:text-[#006d77]">
           <Image src='/logo.png' alt='' width={100} height={100} />
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((s) => !s)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        <div className={`items-center gap-6 ${open ? 'block' : 'hidden'} md:flex`}>
          <Link href="/" className="block py-2 text-gray-800 hover:text-[#006d77] md:py-0">
            Home
          </Link>

          {isAuthed && (
            <Link href={destination} className="block py-2 text-gray-800 hover:text-[#006d77] md:py-0">
              Dashboard
            </Link>
          )}

          {!isAuthed && (
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/' })}
              className="w-full rounded-lg bg-[#006d77] px-4 py-2 text-white shadow-sm ring-1 ring-[#006d77]/20 transition hover:bg-[#006d77]/90 focus:outline-none focus:ring-2 focus:ring-[#006d77] focus:ring-offset-2 md:w-auto"
            >
              Login
            </button>
          )}

          {isAuthed && (
            <div className="relative">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded px-2 py-2 hover:bg-gray-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006d77] text-white">
                    {name?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden text-left md:block">
                    <div className="text-sm font-medium leading-tight text-gray-900">{name || username}</div>
                    <div className="text-xs text-gray-500">{role}</div>
                  </div>
                </summary>
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg ring-1 ring-gray-100">
                  <Link
                    href={destination}
                    className="block rounded px-3 py-2 text-sm text-gray-800 hover:bg-[#83c5be]/20 focus:outline-none focus:ring-2 focus:ring-[#83c5be]"
                  >
                    Go to {role === 'ADMIN' ? 'Admin' : 'Teacher'} Panel
                  </Link>
                  <Link
                    href="/profile"
                    className="mt-1 block rounded px-3 py-2 text-sm text-gray-800 hover:bg-[#83c5be]/20 focus:outline-none focus:ring-2 focus:ring-[#83c5be]"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="mt-1 w-full rounded px-3 py-2 text-left text-sm text-[#064e4f] hover:bg-[#e29578]/20 focus:outline-none focus:ring-2 focus:ring-[#e29578]"
                  >
                    Logout
                  </button>
                </div>
              </details>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
