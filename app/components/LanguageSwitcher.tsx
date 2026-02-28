'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

const locales = ['en', 'ar'] as const;
const localeRegex = /^\/(en|ar)(\/|$)/;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleClick = (targetLocale: (typeof locales)[number]) => {
    if (targetLocale === currentLocale) return;

    const normalized =
      pathname === '/'
        ? '/'
        : pathname.replace(localeRegex, '/') || '/';

    router.replace(normalized, { locale: targetLocale });
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-slate-100 to-indigo-50 p-1 text-xs font-semibold border border-indigo-100/50 shadow-sm">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleClick(locale)}
            disabled={isActive}
            className={[
              'px-3 py-1.5 rounded-lg transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500',
              isActive
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 cursor-default'
                : 'bg-transparent text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
            ].join(' ')}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}