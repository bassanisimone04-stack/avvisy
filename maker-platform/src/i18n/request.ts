import { getRequestConfig } from "next-intl/server";
import { siteConfig } from "@/config/site";

/**
 * next-intl without locale routing (Phase 1): one published language, en-US,
 * served without a URL prefix. Prefix routing (/it, /de, …) is added only when
 * a complete, reviewed translation exists (docs/I18N_STRATEGY.md).
 */
export default getRequestConfig(async () => {
  const locale = siteConfig.defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
