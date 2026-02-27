// src/components/ProfileDropdown.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { SignOutButton } from "./SignOutButton";


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
  const t = useTranslations("ProfileDropdown");
  const locale=useLocale();
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-left shadow-sm hover:border-teal-500 hover:bg-teal-50 transition"
      >
        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-slate-900">{locale === 'ar' ? arabicName : name}</p>
          <p className="text-[11px] text-slate-500">
            {role === "ADMIN" ? t("roles.admin") : t("roles.teacher")}
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-[11px] font-bold text-white shadow">
          {initials}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lg py-2 z-[100]">
          <div className="px-3 pb-2 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {name}
            </p>
            {email && (
              <p className="text-[11px] text-slate-500 truncate">{email}</p>
            )}
          </div>

          <Link
            href="/dashboard/profile"
            className="block px-3 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700"
            onClick={() => setOpen(false)}
          >
            {t("viewProfile")}
          </Link>

          <Link
            href="/dashboard/settings"
            className="block px-3 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700"
            onClick={() => setOpen(false)}
          >
            {t("settings")}
          </Link>

          <div className="border-t border-slate-100 mt-1 pt-1 px-3 pb-1.5">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
}
