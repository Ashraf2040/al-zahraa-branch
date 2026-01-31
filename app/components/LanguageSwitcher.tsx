'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

const locales = ['en', 'ar'] as const;
const localeRegex = /^\/(en|ar)(\/|$)/;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();        // can be "/dashboard" or "/en/dashboard" etc.
  const currentLocale = useLocale();     // "en" | "ar"

  const handleClick = (targetLocale: (typeof locales)[number]) => {
    if (targetLocale === currentLocale) return;

    // Normalize pathname: always remove any leading /en or /ar
    const normalized =
      pathname === '/'
        ? '/'
        : pathname.replace(localeRegex, '/') || '/';

    // Navigate with the new locale; next-intl will prefix it
    router.replace(normalized, {locale: targetLocale});
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1 text-xs font-medium">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleClick(locale)}
            disabled={isActive}
            className={[
              'px-3 py-1 rounded-full transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500',
              isActive
                ? 'bg-blue-600 text-white shadow-sm cursor-default'
                : 'bg-transparent text-gray-600 hover:bg-white hover:text-blue-600'
            ].join(' ')}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
