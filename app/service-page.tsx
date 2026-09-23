import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import { siteUrl } from "@/lib/site-url";
import { siteSettings, whatsappUrl } from "./site-settings";
import { MobileSiteMenu, ServiceDirectory, ServicesMenu } from "./service-navigation";
import BackButton from "./back-button";
import ServiceReveal from "./service-reveal";
import { DirectionHero, DirectionStory } from "./service-experience";
import "./service-design.css";
import {
  localizedText,
  servicePages,
  servicePath,
  type ServiceLang,
  type ServicePageKey,
} from "./service-pages";
import { corporatePagePath } from "./corporate-pages-data";

export function buildServiceMetadata(key: ServicePageKey, lang: ServiceLang): Metadata {
  const page = servicePages[key];
  const canonical = servicePath(key, lang);
  const ruPath = servicePath(key, "ru");
  const kzPath = servicePath(key, "kz");
  const title = localizedText(page.metaTitle, lang);
  const description = localizedText(page.metaDescription, lang);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "ru-KZ": ruPath,
        "kk-KZ": kzPath,
        "x-default": ruPath,
      },
    },
    openGraph: {
      type: "website",
      siteName: "AAA URBAN",
      locale: lang === "kz" ? "kk_KZ" : "ru_KZ",
      alternateLocale: [lang === "kz" ? "ru_KZ" : "kk_KZ"],
      title: `${title} | AAA URBAN`,
      description,
      url: canonical,
    },
    robots: { index: true, follow: true },
  };
}

function serviceStructuredData(key: ServicePageKey, lang: ServiceLang) {
  const page = servicePages[key];
  const path = servicePath(key, lang);
  const pageUrl = `${siteUrl}${path}`;
  const homeUrl = `${siteUrl}${lang === "kz" ? "/kz" : "/"}`;
  const title = localizedText(page.title, lang);
  const description = localizedText(page.metaDescription, lang);
  const homeName = lang === "kz" ? "Басты бет" : "Главная";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: lang === "kz" ? "kk-KZ" : "ru-KZ",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: title,
        description,
        url: pageUrl,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "City", name: "Астана" },
        serviceType: title,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeName, item: homeUrl },
          { "@type": "ListItem", position: 2, name: title, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: localizedText(item.question, lang),
          acceptedAnswer: {
            "@type": "Answer",
            text: localizedText(item.answer, lang),
          },
        })),
      },
    ],
  };
}

function Brand({ lang }: { lang: ServiceLang }) {
  return (
    <a className="brand" href={lang === "kz" ? "/kz" : "/"} aria-label="AAA URBAN">
      <img src="/brand-logo.jpeg" alt="" width="48" height="62" />
      <span className="wordmark">AAA<span>URBAN</span></span>
    </a>
  );
}

export default function ServicePage({ pageKey, lang }: { pageKey: ServicePageKey; lang: ServiceLang }) {
  const page = servicePages[pageKey];
  const t = <T extends { ru: string; kz: string }>(value: T) => localizedText(value, lang);
  const home = lang === "kz" ? "/kz" : "/";
  const ruPath = servicePath(pageKey, "ru");
  const kzPath = servicePath(pageKey, "kz");
  const wa = whatsappUrl(t(page.whatsappMessage));
  const relatedMap: Record<ServicePageKey, ServicePageKey[]> = {
    "property-management": ["building-operation", "engineering-systems"],
    "building-operation": ["engineering-systems", "property-management"],
    "engineering-systems": ["building-operation", "business-center"],
    "osi-management": ["residential-audit", "residential-complex"],
    "residential-complex": ["osi-management", "residential-audit"],
    "business-center": ["engineering-systems", "commercial-property"],
    "commercial-property": ["property-management", "business-center"],
    "residential-audit": ["osi-management", "residential-complex"],
  };
  const related = relatedMap[pageKey];
  const jsonLd = serviceStructuredData(pageKey, lang);

  return (
    <main className="service-page-shell" data-direction={pageKey}>
      <ServiceReveal />
      <a className="skip-link" href="#service-content">{lang === "kz" ? "Мазмұнға өту" : "Перейти к содержанию"}</a>

      <header className="site-header service-site-header">
        <div className="service-header-start"><BackButton fallback={home} label={lang === "kz" ? "Артқа" : "Назад"} /><Brand lang={lang} /></div>
        <nav aria-label={lang === "kz" ? "Қызмет бетінің навигациясы" : "Навигация страницы услуги"}>
          <a href={home}>{lang === "kz" ? "Басты бет" : "Главная"}</a>
          <a href={corporatePagePath("about", lang)}>{lang === "kz" ? "Компания туралы" : "О компании"}</a>
          <ServicesMenu lang={lang} current={pageKey} overviewHref={corporatePagePath("services", lang)} />
          <a href={corporatePagePath("objects", lang)}>{lang === "kz" ? "Нысандар" : "Объекты"}</a>
          <a href={corporatePagePath("contacts", lang)}>{lang === "kz" ? "Байланыс" : "Контакты"}</a>
        </nav>
        <div className="header-actions">
          <div className="languages">
            <a href={ruPath} lang="ru" aria-current={lang === "ru" ? "page" : undefined}>RU</a><span>/</span>
            <a href={kzPath} lang="kk" aria-current={lang === "kz" ? "page" : undefined}>KZ</a>
          </div>
          <a className="header-cta" href={wa} target="_blank" rel="noopener noreferrer">
            {lang === "kz" ? "Нысанды талқылау" : "Обсудить объект"}<ArrowUpRight size={16} />
          </a>
          <MobileSiteMenu lang={lang} current={pageKey} servicePosition={2} links={[
            { href: home, label: lang === "kz" ? "Басты бет" : "Главная" },
            { href: corporatePagePath("about", lang), label: lang === "kz" ? "Компания туралы" : "О компании" },
            { href: corporatePagePath("objects", lang), label: lang === "kz" ? "Нысандар" : "Объекты" },
            { href: corporatePagePath("contacts", lang), label: lang === "kz" ? "Байланыс" : "Контакты" },
          ]} overviewHref={corporatePagePath("services", lang)} />
        </div>
      </header>

      <DirectionHero pageKey={pageKey} lang={lang} />
      <DirectionStory pageKey={pageKey} lang={lang} />

      <section className="service-faq-section" id="service-faq">
        <div className="service-section-heading compact" data-reveal>
          <p className="eyebrow"><span className="section-number">04 /</span>FAQ</p>
          <h2>{t(page.faqTitle)}</h2>
        </div>
        <div className="faq-list service-faq-list">
          {page.faq.map((item, index) => (
            <details className="faq-item" key={index} data-reveal>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{t(item.question)}<Plus size={18} /></summary>
              <p>{t(item.answer)}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="service-related-section">
        <div className="service-section-heading compact" data-reveal>
          <p className="eyebrow"><span className="section-number">05 /</span>{lang === "kz" ? "Байланысты бағыттар" : "Связанные направления"}</p>
          <h2>{lang === "kz" ? "Нысанның басқа міндеттері" : "Другие задачи объекта"}</h2>
        </div>
        <div className="service-related-grid">
          {related.map((key, index) => {
            const relatedPage = servicePages[key];
            return (
              <a href={servicePath(key, lang)} key={key} data-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{t(relatedPage.title)}</h3>
                <p>{t(relatedPage.lead)}</p>
                <ArrowUpRight size={20} />
              </a>
            );
          })}
        </div>
      </section>

      <section className="service-contact-section" id="service-contact">
        <div data-reveal>
          <p className="eyebrow"><span className="section-number">06 /</span>{lang === "kz" ? "Келесі қадам" : "Следующий шаг"}</p>
          <h2>{t(page.ctaTitle)}</h2>
          <p>{t(page.ctaText)}</p>
          <a className="button service-contact-button" href={wa} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} />{lang === "kz" ? "WhatsApp-та жазу" : "Написать в WhatsApp"}<ArrowUpRight size={18} />
          </a>
        </div>
        <address data-reveal>
          <a href={`tel:${siteSettings.phone}`}><Phone size={18} /><span>{siteSettings.phoneDisplay}</span></a>
          <a href={`mailto:${siteSettings.email}`}><Mail size={18} /><span>{siteSettings.email}</span></a>
          <span><MapPin size={18} /><span>{siteSettings.address[lang]}</span></span>
        </address>
      </section>

      <ServiceDirectory lang={lang} current={pageKey} />
      <footer className="service-footer">
        <Brand lang={lang} />
        <p>© AAA URBAN · {lang === "kz" ? "Жылжымайтын мүлікті басқару және пайдалану" : "Управление и эксплуатация недвижимости"}</p>
        <a href={home}>{lang === "kz" ? "Басты бетке" : "На главную"}<ArrowUpRight size={16} /></a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
