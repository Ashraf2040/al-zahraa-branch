'use client';

import { Link } from "@/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";
import { ProfileDropdown } from "./ProfileDropdown";

export default function DashboardNavbar() {
  const { data: session, status } = useSession();
  const t = useTranslations("DashboardNavbar");

  // Return null while loading or if no user
  if (status === "loading" || !session?.user) return null;

  const role = session.user.role;
   console.log(session.user.arabicName);
  const initials =
    session.user.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="w-full h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">

          {/* Branding / Logo */}
          <Link
            href={role === "ADMIN" ? "/admin" : "/teacher"}
            className="flex items-center gap-4 group transition-transform active:scale-95"
          >
            {/* Logo Box */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20 group-hover:shadow-lg group-hover:shadow-teal-500/40 transition-all duration-300 group-hover:-translate-y-0.5">
              <span className="font-bold text-lg tracking-tighter">SM</span>
            </div>

            {/* Text */}
            <div className="leading-tight hidden sm:block">
              <p className="text-base font-bold text-slate-900">
                {t("appName")}
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-teal-600">
                {role === "ADMIN" ? t("adminDashboard") : t("teacherDashboard")}
              </p>
            </div>
          </Link>

          {/* Right Actions (Profile & Language) */}
          <div className="flex items-center gap-2 sm:gap-6">

            <LanguageSwitcher />

            {/* Vertical Divider - Hidden on mobile for space */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <ProfileDropdown
              name={session.user.name || t("user")}
              email={session.user.email || ""}
              arabicName={session.user.arabicName || ""}
              role={role}
              initials={initials}
            />
          </div>
        </div>
      </div>
    </header>
  );
}