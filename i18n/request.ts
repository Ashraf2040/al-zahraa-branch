import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? 'en'; // تأكد من وجود لغة افتراضية

  const messages = (await import(`../messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,  // <-- لازم ترجع locale هنا
    messages
  };
});
