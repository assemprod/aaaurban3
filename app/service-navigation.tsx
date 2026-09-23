"use client";

import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { servicePath, type ServiceLang, type ServicePageKey } from "./service-pages";

const directions: { key: ServicePageKey; ru: string; kz: string }[] = [
  { key: "property-management", ru: "Управление недвижимостью", kz: "Жылжымайтын мүлікті басқару" },
  { key: "building-operation", ru: "Эксплуатация зданий", kz: "Ғимараттарды пайдалану" },
  { key: "engineering-systems", ru: "Инженерные системы", kz: "Инженерлік жүйелер" },
  { key: "osi-management", ru: "Управление для ОСИ", kz: "МИБ үшін басқару" },
  { key: "residential-complex", ru: "Управление ЖК", kz: "Тұрғын үй кешенін басқару" },
  { key: "business-center", ru: "Управление бизнес-центром", kz: "Бизнес-орталықты басқару" },
  { key: "commercial-property", ru: "Коммерческая недвижимость", kz: "Коммерциялық жылжымайтын мүлік" },
  { key: "residential-audit", ru: "Бесплатный аудит ЖК", kz: "Тұрғын үй кешенінің тегін аудиті" },
];

type ServiceNavigationProps = {
  lang: ServiceLang;
  current?: ServicePageKey;
  tone?: "dark" | "light";
  active?: boolean;
  overviewHref?: string;
};

export function ServicesMenu({ lang, current, tone = "dark", active = false, overviewHref }: ServiceNavigationProps) {
  return <DropdownMenu modal={false}>
    <DropdownMenuTrigger className={`services-menu-trigger${active ? " is-active" : ""}`}>
      {lang === "kz" ? "Қызметтер" : "Услуги"}<ChevronDown size={14} aria-hidden="true" />
    </DropdownMenuTrigger>
    <DropdownMenuContent className={`services-menu-content${tone === "light" ? " services-menu-content--light" : ""}`} align="start" sideOffset={16} collisionPadding={20}>
      {overviewHref && <DropdownMenuItem asChild className="services-menu-item services-menu-overview">
        <a href={overviewHref}>
          <span>{lang === "kz" ? "Барлық қызметтер" : "Все услуги"}</span><ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </DropdownMenuItem>}
      {directions.map(item => <DropdownMenuItem key={item.key} asChild className="services-menu-item">
        <a href={servicePath(item.key, lang)} aria-current={current === item.key ? "page" : undefined}>
          <span>{item[lang]}</span><ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </DropdownMenuItem>)}
    </DropdownMenuContent>
  </DropdownMenu>;
}

export function MobileSiteMenu({ lang, current, links, servicePosition = links.length, tone = "dark", overviewHref }: ServiceNavigationProps & { links: { href: string; label: string }[]; servicePosition?: number }) {
  const kz = lang === "kz";
  const beforeServices = links.slice(0, servicePosition);
  const afterServices = links.slice(servicePosition);
  return <Sheet>
    <SheetTrigger className="menu-button" aria-label={kz ? "Мәзірді ашу" : "Открыть меню"}><Menu /></SheetTrigger>
    <SheetContent className={`mobile-sheet${tone === "light" ? " mobile-sheet--light" : ""}`} showCloseButton={false}>
      <div className="sheet-heading"><SheetTitle>AAA URBAN</SheetTitle><SheetClose aria-label={kz ? "Мәзірді жабу" : "Закрыть меню"}><X /></SheetClose></div>
      <SheetDescription className="sr-only">{kz ? "Қызметтер және сайт бөлімдері" : "Услуги и разделы сайта"}</SheetDescription>
      <p className="mobile-menu-label">{kz ? "Навигация" : "Навигация"}</p>
      <nav className="mobile-section-links" aria-label={kz ? "Сайт бөлімдері" : "Разделы сайта"}>
        {beforeServices.map(link => <SheetClose asChild key={link.href}><a href={link.href}>{link.label}</a></SheetClose>)}
      </nav>
      <details className="mobile-services-submenu">
        <summary>{kz ? "Қызметтер" : "Услуги"}<span>08</span><ChevronDown size={18} aria-hidden="true" /></summary>
        <nav className="mobile-service-links" aria-label={kz ? "Қызметтер" : "Услуги"}>
          {overviewHref && <SheetClose asChild>
            <a href={overviewHref}>{kz ? "Барлық қызметтер" : "Все услуги"}<ArrowUpRight size={17} aria-hidden="true" /></a>
          </SheetClose>}
          {directions.map(item => <SheetClose asChild key={item.key}>
            <a href={servicePath(item.key, lang)} aria-current={current === item.key ? "page" : undefined}>{item[lang]}<ArrowUpRight size={17} aria-hidden="true" /></a>
          </SheetClose>)}
        </nav>
      </details>
      {afterServices.length > 0 && <nav className="mobile-section-links mobile-section-links-after" aria-label={kz ? "Қосымша бөлімдер" : "Дополнительные разделы"}>
        {afterServices.map(link => <SheetClose asChild key={link.href}><a href={link.href}>{link.label}</a></SheetClose>)}
      </nav>}
    </SheetContent>
  </Sheet>;
}

export function ServiceDirectory({ lang, current }: ServiceNavigationProps) {
  return <nav className="service-directory" id="services" aria-label={lang === "kz" ? "Барлық қызметтер" : "Все услуги"}>
    <p className="eyebrow">{lang === "kz" ? "Қызметтер" : "Услуги"}<span>08 /</span></p>
    <div className="service-directory-links">
      {directions.map(item => <a key={item.key} href={servicePath(item.key, lang)} aria-current={current === item.key ? "page" : undefined}>
        <span>{item[lang]}</span><ArrowUpRight size={17} aria-hidden="true" />
      </a>)}
    </div>
  </nav>;
}
