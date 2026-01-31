// src/proxy.ts
import {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',

  // IMPORTANT for your issue:
  localePrefix: 'always',
  localeDetection: false
});

export default function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
