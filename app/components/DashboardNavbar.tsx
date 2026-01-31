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

  const initials =
    session.user.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-lg shadow-sm transition-all duration-300">
      {/* Gradient Accent Bar */}
    
      
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4 max-w-7xl mx-auto">
          
          {/* Branding / Logo */}
          <Link
            href={role === "ADMIN" ? "/admin" : "/teacher"}
            className="flex items-center gap-3 group transition-transform hover:scale-[1.01]"
          >
            {/* Logo Box */}
            <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 transition-all duration-300 group-hover:rotate-3 group-hover:shadow-teal-600/40">
              <span className="font-bold text-lg tracking-tighter">SM</span>
            </div>
            
            {/* Text */}
            <div className="leading-tight hidden sm:block group-hover:text-slate-900 transition-colors">
              <p className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                {t("appName")}
              </p>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                {role === "ADMIN" ? t("adminDashboard") : t("teacherDashboard")}
              </p>
            </div>
          </Link>

          {/* Right Actions (Profile & Language) */}
          <div className="flex items-center gap-2 sm:gap-4">
         
            <LanguageSwitcher />
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <ProfileDropdown
              name={session.user.name || t("user")}
              email={session.user.email || ""}
              role={role}
              initials={initials}
            />
          </div>
        </div>
      </div>
    </header>
  );
}