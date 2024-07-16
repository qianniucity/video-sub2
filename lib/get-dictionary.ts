import "server-only";

import type { Locale } from "@/config/i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types

interface Dictionary {
  // 根据你的 JSON 结构定义类型
  [key: string]: any;
}

const dictionaries = {
  en: () =>
    import("@/config/dictionaries/en.json").then((module) => module.default),
  zh: () =>
    import("@/config/dictionaries/zh.json").then((module) => module.default),
  ko: () =>
    import("@/config/dictionaries/ko.json").then((module) => module.default),
  ja: () =>
    import("@/config/dictionaries/ja.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.zh();

export const getDictionarySync = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.zh();
