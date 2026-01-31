import { getRequestConfig } from 'next-intl/server';

const defaultLocale = 'en';
const locales = ['en', 'ar'];

export default getRequestConfig(async ({ locale }) => {
  // ❗ تجاهل أي حاجة مش locale
  if (!locale || !locales.includes(locale)) {
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
