// i18n/routing.ts
// i18n/routing.ts (recommended pattern)
import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always' // ensures URLs are /en/... and /ar/...
});

export const {Link, useRouter, usePathname, redirect} = createNavigation(routing);
