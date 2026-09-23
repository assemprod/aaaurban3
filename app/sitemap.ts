import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { servicePageKeys, servicePath } from "./service-pages";
import { corporatePagePath, type CorporatePageKind } from "./corporate-pages-data";

const homeLanguages = {
  "ru-KZ": `${siteUrl}/`,
  "kk-KZ": `${siteUrl}/kz`,
  "x-default": `${siteUrl}/`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${siteUrl}/kz`,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: homeLanguages },
    },
  ];

  for (const key of servicePageKeys) {
    const ru = `${siteUrl}${servicePath(key, "ru")}`;
    const kz = `${siteUrl}${servicePath(key, "kz")}`;
    const languages = { "ru-KZ": ru, "kk-KZ": kz, "x-default": ru };
    pages.push(
      { url: ru, changeFrequency: "monthly", priority: 0.8, alternates: { languages } },
      { url: kz, changeFrequency: "monthly", priority: 0.75, alternates: { languages } },
    );
  }

  for (const key of ["about", "services", "objects", "contacts"] as CorporatePageKind[]) {
    const ru = `${siteUrl}${corporatePagePath(key, "ru")}`;
    const kz = `${siteUrl}${corporatePagePath(key, "kz")}`;
    const languages = { "ru-KZ": ru, "kk-KZ": kz, "x-default": ru };
    pages.push(
      { url: ru, changeFrequency: "monthly", priority: 0.85, alternates: { languages } },
      { url: kz, changeFrequency: "monthly", priority: 0.8, alternates: { languages } },
    );
  }

  return pages;
}
