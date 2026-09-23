import type { Metadata } from "next";

export type CorporatePageKind = "about" | "services" | "objects" | "contacts";
export type CorporateLang = "ru" | "kz";

export const corporatePagePaths: Record<CorporatePageKind, Record<CorporateLang, string>> = {
  about: { ru: "/about", kz: "/kz/about" },
  services: { ru: "/services", kz: "/kz/services" },
  objects: { ru: "/objects", kz: "/kz/objects" },
  contacts: { ru: "/contacts", kz: "/kz/contacts" },
};

const pageMeta: Record<CorporatePageKind, Record<CorporateLang, { title: string; description: string }>> = {
  about: {
    ru: {
      title: "О компании",
      description: "История, команда, ценности и опыт AAA URBAN в управлении и эксплуатации недвижимости.",
    },
    kz: {
      title: "Компания туралы",
      description: "AAA URBAN компаниясының тарихы, командасы, құндылықтары және жылжымайтын мүлікті басқару тәжірибесі.",
    },
  },
  services: {
    ru: {
      title: "Услуги по управлению недвижимостью",
      description: "Полный цикл управления и эксплуатации недвижимости: инженерные системы, подрядчики, бюджет, отчётность и контроль качества.",
    },
    kz: {
      title: "Жылжымайтын мүлікті басқару қызметтері",
      description: "Жылжымайтын мүлікті басқару және пайдаланудың толық циклі: инженерлік жүйелер, мердігерлер, бюджет, есептілік және сапаны бақылау.",
    },
  },
  objects: {
    ru: {
      title: "Объекты",
      description: "Подтверждённый опыт группы, на базе которого создан AAA URBAN. Кейсы жилых комплексов будут добавляться после согласования.",
    },
    kz: {
      title: "Нысандар",
      description: "AAA URBAN бренді қалыптасқан топтың нысандарға қызмет көрсетудегі расталған тәжірибесі. Тұрғын үй кешендерінің кейстері келісілгеннен кейін қосылады.",
    },
  },
  contacts: {
    ru: {
      title: "Контакты",
      description: "Свяжитесь с AAA URBAN, чтобы обсудить управление, эксплуатацию объекта или бесплатный первичный аудит ЖК.",
    },
    kz: {
      title: "Байланыс",
      description: "Нысанды басқару, пайдалану немесе тұрғын үй кешенінің тегін бастапқы аудитін талқылау үшін AAA URBAN компаниясына хабарласыңыз.",
    },
  },
};

export function corporatePagePath(kind: CorporatePageKind, lang: CorporateLang) {
  return corporatePagePaths[kind][lang];
}

export function buildCorporateMetadata(kind: CorporatePageKind, lang: CorporateLang): Metadata {
  const current = pageMeta[kind][lang];
  const ruPath = corporatePagePath(kind, "ru");
  const kzPath = corporatePagePath(kind, "kz");
  const canonical = corporatePagePath(kind, lang);

  return {
    title: current.title,
    description: current.description,
    alternates: {
      canonical,
      languages: { "ru-KZ": ruPath, "kk-KZ": kzPath, "x-default": ruPath },
    },
    openGraph: {
      type: "website",
      siteName: "AAA URBAN",
      locale: lang === "kz" ? "kk_KZ" : "ru_KZ",
      alternateLocale: [lang === "kz" ? "ru_KZ" : "kk_KZ"],
      title: `${current.title} | AAA URBAN`,
      description: current.description,
      url: canonical,
    },
    robots: { index: true, follow: true },
  };
}

export function corporatePageMeta(kind: CorporatePageKind, lang: CorporateLang) {
  return pageMeta[kind][lang];
}
