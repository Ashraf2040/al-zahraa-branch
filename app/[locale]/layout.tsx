import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import '../globals.css';
import { Toaster } from "react-hot-toast";
import { AuthSessionProvider } from "../components/AuthSessionProvider";
import DashboardNavbar from "../components/DashboardNavbar";


const locales = ["en", "ar"] as const;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // if (!locales.includes(locale as (typeof locales)[number])) notFound();

  const messages = await getMessages({ locale });
 // <== لازم تبعته locale هنا

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>
        <AuthSessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Toaster position="top-right" />
            <DashboardNavbar />
            {children}
          </NextIntlClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}