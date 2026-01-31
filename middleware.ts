import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en'
});

const authMiddleware = withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // Allow NextAuth internals
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }

    // Role guards (AFTER locale)
    const role = (token as any)?.role as string | undefined;

    if (pathname.includes('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.includes('/teacher') && role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.includes('/coordin') && role !== 'COORDINATOR') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export default function middleware(req: any, event: any) {
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  return authMiddleware(req, event);
}


export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)'
  ]
};
