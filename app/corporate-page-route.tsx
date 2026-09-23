import { siteUrl } from "@/lib/site-url";
import CorporatePage from "./corporate-pages";
import { corporatePageMeta, corporatePagePath, type CorporateLang, type CorporatePageKind } from "./corporate-pages-data";

export default function CorporatePageRoute({ kind, lang }: { kind: CorporatePageKind; lang: CorporateLang }) {
  const path = corporatePagePath(kind, lang);
  const meta = corporatePageMeta(kind, lang);
  const home = `${siteUrl}${lang === "kz" ? "/kz" : "/"}`;
  const url = `${siteUrl}${path}`;
  const pageTypes: Record<CorporatePageKind, string> = {
    about: "AboutPage",
    services: "CollectionPage",
    objects: "CollectionPage",
    contacts: "ContactPage",
  };
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": pageTypes[kind],
        "@id": `${url}#webpage`,
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: lang === "kz" ? "kk-KZ" : "ru-KZ",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: lang === "kz" ? "Басты бет" : "Главная", item: home },
          { "@type": "ListItem", position: 2, name: meta.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <CorporatePage kind={kind} lang={lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
