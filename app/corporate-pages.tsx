"use client";

import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Camera,
  Check,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Headphones,
  Hotel,
  House,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  QrCode,
  Settings2,
  ShieldCheck,
  Store,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { objectTypes } from "./content";
import { track } from "./analytics";
import { teamMembers } from "./portfolio";
import { ServicesMenu, MobileSiteMenu } from "./service-navigation";
import { servicePath, type ServicePageKey } from "./service-pages";
import { siteSettings, whatsappUrl } from "./site-settings";
import { corporatePagePath, type CorporateLang, type CorporatePageKind } from "./corporate-pages-data";

type Localized = { ru: string; kz: string };

const pageHero: Record<CorporatePageKind, { eyebrow: Localized; title: Localized; lead: Localized; image: string }> = {
  about: {
    eyebrow: { ru: "О КОМПАНИИ", kz: "КОМПАНИЯ ТУРАЛЫ" },
    title: { ru: "Надёжный партнёр\nв управлении и эксплуатации\nнедвижимости", kz: "Жылжымайтын мүлікті\nбасқару мен пайдаланудағы\nсенімді серіктес" },
    lead: { ru: "AAA URBAN — команда профессионалов, которая создаёт эффективные, безопасные и комфортные пространства для людей и бизнеса.", kz: "AAA URBAN — адамдар мен бизнес үшін тиімді, қауіпсіз және жайлы кеңістік қалыптастыратын кәсіби команда." },
    image: "/reference/about-hero.webp",
  },
  services: {
    eyebrow: { ru: "КОМПЛЕКСНЫЕ УСЛУГИ ДЛЯ ВАШЕЙ НЕДВИЖИМОСТИ", kz: "ЖЫЛЖЫМАЙТЫН МҮЛІККЕ АРНАЛҒАН КЕШЕНДІ ҚЫЗМЕТТЕР" },
    title: { ru: "Полный цикл\nуправления недвижимостью", kz: "Жылжымайтын мүлікті\nбасқарудың толық циклі" },
    lead: { ru: "Управление, эксплуатация, инженерные системы, работа с подрядчиками, бюджетирование и контроль. Всё в одной системе управления.", kz: "Басқару, пайдалану, инженерлік жүйелер, мердігерлермен жұмыс, бюджеттеу және бақылау. Барлығы бір басқару жүйесінде." },
    image: "/reference/services-hero.webp",
  },
  objects: {
    eyebrow: { ru: "НАШИ ОБЪЕКТЫ", kz: "БІЗДІҢ НЫСАНДАР" },
    title: { ru: "Объекты, которые\nвдохновляют", kz: "Шабыт беретін\nнысандар" },
    lead: { ru: "Мы управляем и эксплуатируем жилую и коммерческую недвижимость, создавая комфортную среду для людей и устойчивую ценность для собственников.", kz: "Біз тұрғын және коммерциялық жылжымайтын мүлікті басқарып, адамдарға жайлы орта және меншік иелеріне тұрақты құндылық қалыптастырамыз." },
    image: "/reference/objects-hero.webp",
  },
  contacts: {
    eyebrow: { ru: "КОНТАКТЫ", kz: "БАЙЛАНЫС" },
    title: { ru: "Остаёмся на связи", kz: "Байланыста болайық" },
    lead: { ru: "Обсудим ваш объект, подберём оптимальное решение и подготовим индивидуальное предложение.", kz: "Нысаныңызды талқылап, оңтайлы шешім таңдап, жеке ұсыныс дайындаймыз." },
    image: "/reference/contacts-hero.webp",
  },
};

function Brand({ lang, footer = false }: { lang: CorporateLang; footer?: boolean }) {
  return (
    <a className={`reference-brand${footer ? " reference-brand--footer" : ""}`} href={lang === "kz" ? "/kz" : "/"} aria-label="AAA URBAN">
      <strong>AAA</strong><span>URBAN</span>
      {footer && <small>{lang === "kz" ? "Басқарудан да артық" : "Больше, чем управление недвижимостью"}</small>}
    </a>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="reference-eyebrow"><span />{children}</p>;
}

function CorporateHeader({ kind, lang }: { kind: CorporatePageKind; lang: CorporateLang }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => kz ? kk : ru;
  const home = kz ? "/kz" : "/";
  const services = corporatePagePath("services", lang);
  const links = [
    { href: home, label: t("Главная", "Басты бет"), current: false },
    { href: corporatePagePath("about", lang), label: t("О компании", "Компания туралы"), current: kind === "about" },
    { href: corporatePagePath("objects", lang), label: t("Объекты", "Нысандар"), current: kind === "objects" },
    { href: corporatePagePath("contacts", lang), label: t("Контакты", "Байланыс"), current: kind === "contacts" },
  ];
  const auditMessage = t(
    "Здравствуйте! Хочу получить бесплатный первичный аудит ЖК. Название и адрес ЖК: ",
    "Сәлеметсіз бе! Тұрғын үй кешенінің тегін бастапқы аудитіне өтінім бергім келеді. ТҮК атауы мен мекенжайы: ",
  );

  return (
    <header className="site-header reference-header corporate-header">
      <Brand lang={lang} />
      <nav aria-label={t("Главная навигация", "Негізгі навигация")}>
        <a href={home}>{t("Главная", "Басты бет")}</a>
        <a href={links[1].href} aria-current={links[1].current ? "page" : undefined}>{links[1].label}</a>
        <ServicesMenu lang={lang} tone="light" active={kind === "services"} overviewHref={services} />
        <a href={links[2].href} aria-current={links[2].current ? "page" : undefined}>{links[2].label}</a>
        <a href={links[3].href} aria-current={links[3].current ? "page" : undefined}>{links[3].label}</a>
      </nav>
      <div className="header-actions">
        <div className="languages">
          <a href={corporatePagePath(kind, "ru")} lang="ru" aria-current={!kz ? "page" : undefined}>RU</a><span>/</span>
          <a href={corporatePagePath(kind, "kz")} lang="kk" aria-current={kz ? "page" : undefined}>KZ</a>
        </div>
        <a className="header-cta reference-header-cta" href={whatsappUrl(auditMessage)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { source: `${kind}_header_audit`, language: lang })}>
          {t("Получить бесплатный аудит", "Тегін аудит алу")}<ArrowRight size={17} />
        </a>
        <MobileSiteMenu
          lang={lang}
          links={links.map(({ href, label }) => ({ href, label }))}
          servicePosition={2}
          tone="light"
          overviewHref={services}
        />
      </div>
    </header>
  );
}

function CorporateHero({ kind, lang }: { kind: CorporatePageKind; lang: CorporateLang }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => kz ? kk : ru;
  const hero = pageHero[kind];
  const auditMessage = t(
    "Здравствуйте! Хочу получить бесплатный первичный аудит ЖК. Название и адрес ЖК: ",
    "Сәлеметсіз бе! Тұрғын үй кешенінің тегін бастапқы аудитіне өтінім бергім келеді. ТҮК атауы мен мекенжайы: ",
  );
  const generalMessage = t(
    "Здравствуйте! Хочу обсудить управление объектом с AAA URBAN.",
    "Сәлеметсіз бе! AAA URBAN компаниясымен нысанды басқаруды талқылағым келеді.",
  );

  return (
    <section className={`corporate-hero corporate-hero--${kind}`}>
      <figure className="corporate-hero-media">
        <img src={hero.image} alt={t("Современный объект недвижимости", "Заманауи жылжымайтын мүлік нысаны")} width="1536" height="1024" fetchPriority="high" />
        {kind !== "contacts" && <div className="corporate-hero-vertical" aria-hidden="true"><span>PEOPLE</span><span>SPACES</span><span>VALUE</span></div>}
        {kind !== "contacts" && <figcaption><strong>AAA URBAN</strong><span>{t("Астана, Казахстан", "Астана, Қазақстан")}</span></figcaption>}
      </figure>
      <div className="corporate-hero-copy">
        <Eyebrow>{hero.eyebrow[lang]}</Eyebrow>
        <h1>{hero.title[lang].split("\n").map((line, index) => <span key={index}>{line}</span>)}</h1>
        <p>{hero.lead[lang]}</p>
        <div className="corporate-hero-actions">
          <a className="reference-button reference-button--red" href={whatsappUrl(auditMessage)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { source: `${kind}_hero_audit`, language: lang })}>
            {t("Получить бесплатный аудит", "Тегін аудит алу")}<ArrowRight size={17} />
          </a>
          <a className="reference-button reference-button--outline" href={whatsappUrl(generalMessage)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { source: `${kind}_hero_discuss`, language: lang })}>
            {kind === "contacts" ? <MessageCircle size={17} /> : null}{t(kind === "contacts" ? "Написать в WhatsApp" : kind === "objects" ? "Подобрать решение" : "Обсудить объект", kind === "contacts" ? "WhatsApp-та жазу" : kind === "objects" ? "Шешім таңдау" : "Нысанды талқылау")}<ArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

function MetricBand({ lang, about = false }: { lang: CorporateLang; about?: boolean }) {
  const kz = lang === "kz";
  const metrics: [LucideIcon, string, string][] = about ? [
    [CalendarDays, kz ? "2007 жылдан" : "с 2007", kz ? "нарықта" : "лет на рынке"],
    [Building2, "400+", kz ? "басқарудағы нысан" : "объектов в управлении"],
    [BarChart3, kz ? "1,5+ млн м²" : "1,5+ млн м²", kz ? "жалпы алаң" : "общая площадь"],
    [Headphones, "24/7", kz ? "клиенттерді сүйемелдеу" : "сопровождение клиентов"],
  ] : [
    [Building2, "400+", kz ? "басқарудағы нысан" : "объектов в управлении"],
    [BarChart3, kz ? "1,5+ млн м²" : "1,5+ млн м²", kz ? "жалпы алаң" : "общая площадь"],
    [Headphones, "24/7", kz ? "клиенттерді сүйемелдеу" : "сопровождение клиентов"],
    [Users, "98%", kz ? "клиенттердің қанағаттануы" : "удовлетворённость клиентов"],
  ];
  return <section className="corporate-metric-band" aria-label={kz ? "Компания көрсеткіштері" : "Показатели компании"}>
    {metrics.map(([Icon, value, label], index) => <div key={value} data-reveal style={{ "--delay": `${index * 70}ms` } as CSSProperties}><Icon size={25} /><strong>{value}</strong><span>{label}</span></div>)}
  </section>;
}

function AuditBanner({ lang, variant = "audit" }: { lang: CorporateLang; variant?: "audit" | "about" | "contact" | "priority" }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => kz ? kk : ru;
  const auditMessage = t(
    "Здравствуйте! Хочу получить бесплатный первичный аудит ЖК. Название и адрес ЖК: ",
    "Сәлеметсіз бе! Тұрғын үй кешенінің тегін бастапқы аудитіне өтінім бергім келеді. ТҮК атауы мен мекенжайы: ",
  );
  const contactMessage = t("Здравствуйте! Хочу обсудить объект с AAA URBAN.", "Сәлеметсіз бе! AAA URBAN компаниясымен нысанды талқылағым келеді.");
  const title = variant === "priority" ? t("Ваш объект — наш приоритет", "Сіздің нысаныңыз — біздің басымдығымыз") : variant === "contact" ? t("Готовы обсудить ваш объект?", "Нысаныңызды талқылауға дайынсыз ба?") : variant === "about" ? t("Готовы к эффективному управлению?", "Тиімді басқаруға дайынсыз ба?") : t("Получите бесплатный аудит", "Тегін аудит алыңыз");
  const eyebrow = variant === "priority" ? t("ВАШ УСПЕХ — НАША ЭКСПЕРТИЗА", "СІЗДІҢ ТАБЫСЫҢЫЗ — БІЗДІҢ САРАПТАМАМЫЗ") : t("ОБСУДИМ ВАШ ОБЪЕКТ", "НЫСАНЫҢЫЗДЫ ТАЛҚЫЛАЙЫҚ");
  const copy = variant === "priority" ? t("Найдём лучшее решение для вашего объекта и создадим дополнительную ценность.", "Нысаныңызға ең тиімді шешім тауып, қосымша құндылық қалыптастырамыз.") : variant === "contact" ? t("Оставьте заявку — наша команда подготовит индивидуальное предложение.", "Өтінім қалдырыңыз — командамыз жеке ұсыныс дайындайды.") : variant === "about" ? t("Проанализируем объект, предложим оптимальные решения и поможем повысить его ценность.", "Нысанды талдап, тиімді шешім ұсынып, оның құндылығын арттыруға көмектесеміз.") : t("Проанализируем ваш объект, предложим оптимальные решения и покажем потенциал.", "Нысаныңызды талдап, тиімді шешімдер ұсынып, әлеуетін көрсетеміз.");

  return <section className="corporate-audit-banner" data-reveal>
    <div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2><p>{copy}</p></div>
    <div className="corporate-audit-actions">
      <a className="reference-button reference-button--red" href={whatsappUrl(auditMessage)} target="_blank" rel="noopener noreferrer">{t("Получить бесплатный аудит", "Тегін аудит алу")}<ArrowRight size={17} /></a>
      {variant !== "priority" && <a className="reference-button reference-button--ghost" href={whatsappUrl(contactMessage)} target="_blank" rel="noopener noreferrer">{t(variant === "contact" ? "Связаться с нами" : "Получить предложение", variant === "contact" ? "Бізбен байланысу" : "Ұсыныс алу")}<ArrowRight size={17} /></a>}
    </div>
  </section>;
}

function CorporateFooter({ lang }: { lang: CorporateLang }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => kz ? kk : ru;
  return <footer className="reference-footer corporate-footer">
    <Brand lang={lang} footer />
    <nav aria-label={t("Навигация в подвале", "Төменгі навигация")}>
      <a href={kz ? "/kz" : "/"}>{t("Главная", "Басты бет")}</a>
      <a href={corporatePagePath("about", lang)}>{t("О компании", "Компания туралы")}</a>
      <a href={corporatePagePath("services", lang)}>{t("Услуги", "Қызметтер")}</a>
      <a href={corporatePagePath("objects", lang)}>{t("Объекты", "Нысандар")}</a>
      <a href={corporatePagePath("contacts", lang)}>{t("Контакты", "Байланыс")}</a>
    </nav>
    <div className="reference-footer-contacts">
      <a href={`tel:${siteSettings.phone}`}><Phone size={15} />{siteSettings.phoneDisplay}</a>
      <a href={`mailto:${siteSettings.email}`}><Mail size={15} />{siteSettings.email}</a>
      <p><MapPin size={15} />{siteSettings.address[lang]}</p>
    </div>
    <div className="reference-footer-bottom">
      <span>© 2026 AAA URBAN. {t("Все права защищены.", "Барлық құқық қорғалған.")}</span>
      <a href={kz ? "/kz/privacy" : "/privacy"}>{t("Политика конфиденциальности", "Құпиялық саясаты")}</a>
    </div>
  </footer>;
}

function AboutPage({ lang }: { lang: CorporateLang }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => kz ? kk : ru;
  const people = teamMembers.filter(person => person.published && person.photo);
  const timeline = [
    ["2007", t("Старт AAA Service", "AAA Service басталуы"), t("Начало деятельности в сфере клининговых и сервисных услуг", "Клининг және сервистік қызметтер саласындағы жұмыстың басталуы"), "/reference/history-2007.webp"],
    ["2011", t("Расширение услуг", "Қызметтерді кеңейту"), t("Выход в комплексное техническое обслуживание зданий", "Ғимараттарға кешенді техникалық қызмет көрсетуге көшу"), "/reference/history-2011.webp"],
    ["2018", "Haileybury Astana", t("Реализация крупного международного проекта, подтвердившего экспертизу команды", "Команда сараптамасын растаған ірі халықаралық жобаны іске асыру"), "/reference/history-2018.webp"],
    ["2020", t("Опыт с Казатомпром и Самрук-Казына", "Қазатомөнеркәсіп және Самұрық-Қазына тәжірибесі"), t("Успешная работа с национальными компаниями и объектами стратегического значения", "Ұлттық компаниялармен және стратегиялық маңызы бар нысандармен жұмыс"), "/reference/history-2020.webp"],
    ["2026", t("Запуск AAA URBAN", "AAA URBAN іске қосылуы"), t("Выделение направления управления недвижимостью в отдельный бренд AAA URBAN", "Жылжымайтын мүлікті басқару бағытын AAA URBAN жеке брендіне шығару"), "/reference/history-2026.webp"],
  ];
  const values: [LucideIcon, string, string][] = [
    [ShieldCheck, t("Прозрачность", "Ашықтық"), t("Открытое взаимодействие с клиентами", "Клиенттермен ашық әрекеттесу")],
    [Users, t("Ответственность", "Жауапкершілік"), t("Выполняем обязательства и отвечаем за результат", "Міндеттемелерді орындап, нәтижеге жауап береміз")],
    [BarChart3, t("Экспертиза", "Сараптама"), t("Глубокие знания и многолетний опыт", "Терең білім мен көпжылдық тәжірибе")],
    [Settings2, t("Системный подход", "Жүйелі тәсіл"), t("Комплексные решения и стандарты качества", "Кешенді шешімдер мен сапа стандарттары")],
    [Leaf, t("Комфорт для людей", "Адамдарға жайлылық"), t("Создаём безопасную и комфортную среду", "Қауіпсіз әрі жайлы орта құрамыз")],
  ];

  return <>
    <MetricBand lang={lang} about />
    <section className="corporate-section about-history">
      <div className="corporate-section-intro" data-reveal><Eyebrow>{t("НАША ИСТОРИЯ", "БІЗДІҢ ТАРИХЫМЫЗ")}</Eyebrow><h2>{t("Как формировался AAA URBAN", "AAA URBAN қалай қалыптасты")}</h2><p>{t("Мы прошли путь от клининговых услуг до комплексного управления недвижимостью. Сегодня AAA URBAN — результат многолетнего опыта, сильной команды и доверия наших клиентов.", "Біз клининг қызметтерінен жылжымайтын мүлікті кешенді басқаруға дейінгі жолдан өттік. Бүгінде AAA URBAN — көпжылдық тәжірибе, мықты команда және клиенттер сенімінің нәтижесі.")}</p><a className="reference-button reference-button--outline corporate-intro-button" href={corporatePagePath("services", lang)}>{t("Узнать больше о компании", "Компания туралы толығырақ")}<ArrowRight size={16} /></a></div>
      <div className="history-track">
        {timeline.map(([year, title, text, image], index) => <article key={year} data-reveal style={{ "--delay": `${index * 70}ms` } as CSSProperties}><b>{year}</b><img src={image} alt="" width="520" height="300" loading="lazy" /><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
    <section className="corporate-section about-middle">
      <div className="about-team">
      <div className="corporate-section-intro" data-reveal><Eyebrow>{t("КОМАНДА РУКОВОДСТВА", "БАСШЫЛЫҚ КОМАНДАСЫ")}</Eyebrow><h2>{t("Команда профессионалов с большим опытом", "Тәжірибелі кәсіби команда")}</h2><p>{t("Наши руководители объединяют экспертизу в управлении, строительстве и эксплуатации недвижимости.", "Басшыларымыз жылжымайтын мүлікті басқару, құрылыс және пайдалану саласындағы сараптаманы біріктіреді.")}</p></div>
      {people.length ? <div className="corporate-team-grid">
        {people.map((person, index) => <figure key={person.id} data-reveal style={{ "--delay": `${index * 70}ms` } as CSSProperties}><img src={person.photo} alt={person.name[lang]} width="560" height="612" loading="lazy" style={{ objectPosition: person.position }} /><figcaption><strong>{person.name[lang]}</strong><span>{person.role[lang]}</span></figcaption></figure>)}
      </div> : <div className="team-photo-ready" data-reveal><img src="/architecture.webp" alt="" width="1200" height="640" loading="lazy" /><div><strong>100+</strong><h3>{t("специалистов в команде группы", "топ мамандары")}</h3><p>{t("Инженеры, диспетчеры, технические специалисты и эксплуатационная команда работают как единая система.", "Инженерлер, диспетчерлер, техникалық мамандар және пайдалану командасы біртұтас жүйе ретінде жұмыс істейді.")}</p></div></div>}
      </div>
      <div className="about-ecosystem">
      <div className="corporate-section-intro" data-reveal><Eyebrow>{t("ЭКОСИСТЕМА ГРУППЫ", "ТОП ЭКОЖҮЙЕСІ")}</Eyebrow><h2>{t("Синергия для комплексных решений", "Кешенді шешімдерге арналған синергия")}</h2><p>{t("Три направления — единая экспертиза. От сервиса до строительства и управления недвижимостью.", "Үш бағыт — біртұтас сараптама. Сервистен құрылыс пен жылжымайтын мүлікті басқаруға дейін.")}</p></div>
      <div className="corporate-ecosystem-flow">
        <article data-reveal><img className="ecosystem-logo" src="/reference/logo-aaa-service.webp" alt="AAA Service" width="130" height="118" loading="lazy" /><p>{t("Клининговые и сервисные услуги", "Клининг және сервистік қызметтер")}</p><img className="ecosystem-photo" src="/reference/ecosystem-service.webp" alt="" width="136" height="206" loading="lazy" /></article>
        <ArrowRight aria-hidden="true" />
        <article data-reveal><img className="ecosystem-logo" src="/reference/logo-prof-stroy.webp" alt="Prof Stroy Company" width="156" height="116" loading="lazy" /><p>{t("Строительно-монтажные работы и инженерные решения", "Құрылыс-монтаж жұмыстары және инженерлік шешімдер")}</p><img className="ecosystem-photo" src="/reference/ecosystem-stroy.webp" alt="" width="132" height="206" loading="lazy" /></article>
        <ArrowRight aria-hidden="true" />
        <article data-reveal><img className="ecosystem-logo" src="/reference/logo-aaa-urban.webp" alt="AAA URBAN" width="128" height="100" loading="lazy" /><p>{t("Управление и эксплуатация недвижимости", "Жылжымайтын мүлікті басқару және пайдалану")}</p><img className="ecosystem-photo" src="/reference/ecosystem-urban.webp" alt="" width="154" height="206" loading="lazy" /></article>
      </div>
      </div>
    </section>
    <section className="corporate-section about-values">
      <div className="corporate-section-intro" data-reveal><Eyebrow>{t("НАШИ ЦЕННОСТИ", "БІЗДІҢ ҚҰНДЫЛЫҚТАР")}</Eyebrow><h2>{t("То, что делает нас сильнее", "Бізді күшейтетін қағидалар")}</h2><p>{t("Долгосрочные отношения строятся на доверии, профессионализме и заботе о людях.", "Ұзақ мерзімді қарым-қатынас сенімге, кәсібилікке және адамдарға қамқорлыққа негізделеді.")}</p></div>
      <div className="corporate-value-grid">{values.map(([Icon, title, text], index) => <article key={title} data-reveal style={{ "--delay": `${index * 60}ms` } as CSSProperties}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <AuditBanner lang={lang} variant="about" />
  </>;
}

function ServicesPage({ lang }: { lang: CorporateLang }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => kz ? kk : ru;
  const services: [LucideIcon, string, string, string, ServicePageKey][] = [
    [Building2, t("Управление объектом", "Нысанды басқару"), t("Стратегическое и операционное управление", "Стратегиялық және операциялық басқару"), "/reference/service-management.webp", "property-management"],
    [Settings2, t("Эксплуатация зданий", "Ғимараттарды пайдалану"), t("Надёжная работа и комфорт для пользователей", "Тұрақты жұмыс және пайдаланушыларға жайлылық"), "/reference/service-operation.webp", "building-operation"],
    [Wrench, t("Инженерные системы", "Инженерлік жүйелер"), t("Обслуживание всех инженерных систем", "Барлық инженерлік жүйелерге қызмет көрсету"), "/reference/service-engineering.webp", "engineering-systems"],
    [Users, t("Работа с подрядчиками", "Мердігерлермен жұмыс"), t("Отбор, контроль и управление подрядчиками", "Мердігерлерді іріктеу, бақылау және басқару"), "/reference/service-contractors.webp", "property-management"],
    [BarChart3, t("Бюджет и отчётность", "Бюджет және есептілік"), t("Планирование, контроль затрат и прозрачная отчётность", "Жоспарлау, шығындарды бақылау және ашық есептілік"), "/reference/service-budget.webp", "commercial-property"],
    [ShieldCheck, t("Аудит и контроль качества", "Аудит және сапаны бақылау"), t("Регулярные проверки и повышение эффективности", "Тұрақты тексерулер және тиімділікті арттыру"), "/reference/service-audit.webp", "residential-audit"],
  ];
  const capabilities: [LucideIcon, string, string][] = [
    [Headphones, t("Диспетчеризация", "Диспетчерлік басқару"), t("Приём обращений и координация специалистов", "Өтініштерді қабылдау және мамандарды үйлестіру")],
    [FileCheck2, t("Заявки и контроль исполнения", "Өтінімдер және орындалуын бақылау"), t("Единая система заявок", "Өтінімдердің бірыңғай жүйесі")],
    [Settings2, t("Техническое обслуживание", "Техникалық қызмет көрсету"), t("Регламентные и плановые работы", "Регламенттік және жоспарлы жұмыстар")],
    [CalendarDays, t("Планирование ремонтов", "Жөндеуді жоспарлау"), t("Долгосрочное управление затратами", "Шығындарды ұзақ мерзімді басқару")],
    [Users, t("Управление подрядчиками", "Мердігерлерді басқару"), t("Отбор и контроль качества работ", "Іріктеу және жұмыс сапасын бақылау")],
    [BarChart3, t("Бюджетирование", "Бюджеттеу"), t("Планирование и контроль бюджета", "Бюджетті жоспарлау және бақылау")],
    [FileText, t("Эксплуатационная документация", "Пайдалану құжаттамасы"), t("Ведение и актуализация документов", "Құжаттарды жүргізу және жаңарту")],
    [ShieldCheck, t("Контроль качества", "Сапаны бақылау"), t("Проверка состояния и выполненных работ", "Жағдайды және орындалған жұмыстарды тексеру")],
  ];
  const process: [string, LucideIcon, string, string][] = [
    ["01", ClipboardCheck, t("Аудит объекта", "Нысан аудиті"), t("Анализ текущего состояния и потребностей", "Ағымдағы жағдай мен қажеттіліктерді талдау")],
    ["02", FileText, t("Разработка решения", "Шешім әзірлеу"), t("Индивидуальная стратегия и план работ", "Жеке стратегия және жұмыс жоспары")],
    ["03", Settings2, t("Запуск и настройка", "Іске қосу және баптау"), t("Введение процессов и команды", "Процестер мен команданы енгізу")],
    ["04", BarChart3, t("Операционное управление", "Операциялық басқару"), t("Стабильная работа и постоянное развитие", "Тұрақты жұмыс және үздіксіз даму")],
  ];
  const segments: [LucideIcon, string, string, string][] = [
    [House, t("Жилые комплексы", "Тұрғын үй кешендері"), t("Управление домом и работа с ОСИ", "Үйді басқару және МИБ-пен жұмыс"), "/reference/segment-residential.webp"],
    [Building2, t("Бизнес-центры", "Бизнес-орталықтар"), t("Эксплуатация, бюджет и подрядчики", "Пайдалану, бюджет және мердігерлер"), "/reference/segment-business.webp"],
    [Hotel, t("Отели", "Қонақүйлер"), t("Обслуживание систем и планирование", "Жүйелерге қызмет көрсету және жоспарлау"), "/reference/segment-hotel.webp"],
    [Store, t("Коммерческие объекты", "Коммерциялық нысандар"), t("Надёжная работа для бизнеса", "Бизнеске арналған сенімді жұмыс"), "/reference/segment-commercial.webp"],
  ];

  return <>
    <section className="corporate-section services-overview">
      <div className="corporate-section-heading"><div data-reveal><Eyebrow>{t("КЛЮЧЕВЫЕ НАПРАВЛЕНИЯ", "НЕГІЗГІ БАҒЫТТАР")}</Eyebrow><h2>{t("Наши услуги", "Біздің қызметтер")}</h2></div><a href="#services-detail">{t("Все направления", "Барлық бағыттар")}<ArrowRight /></a></div>
      <div className="corporate-service-grid">{services.map(([Icon, title, text, image, key], index) => <article key={`${key}-${title}`} data-reveal style={{ "--delay": `${index * 60}ms` } as CSSProperties}><div><Icon /><h3>{title}</h3><p>{text}</p><a href={servicePath(key, lang)} aria-label={title}><ArrowRight /></a></div><img src={image} alt="" width="650" height="820" loading="lazy" /></article>)}</div>
    </section>
    <section className="corporate-section services-capabilities" id="services-detail">
      <div className="corporate-section-intro" data-reveal><Eyebrow>{t("ДЕТАЛЬНЫЕ ВОЗМОЖНОСТИ", "ТОЛЫҚ МҮМКІНДІКТЕР")}</Eyebrow><h2>{t("Больше, чем управление", "Басқарудан да артық")}</h2><p>{t("Закрываем ключевые задачи и обеспечиваем стабильную, эффективную и безопасную эксплуатацию объектов.", "Негізгі міндеттерді шешіп, нысандардың тұрақты, тиімді және қауіпсіз пайдаланылуын қамтамасыз етеміз.")}</p></div>
      <div className="capability-grid">{capabilities.map(([Icon, title, text], index) => <article key={title} data-reveal style={{ "--delay": `${index * 45}ms` } as CSSProperties}><Icon /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </section>
    <section className="corporate-section services-process">
      <div className="corporate-section-intro" data-reveal><Eyebrow>{t("КАК МЫ РАБОТАЕМ", "ҚАЛАЙ ЖҰМЫС ІСТЕЙМІЗ")}</Eyebrow><h2>{t("От анализа до результата", "Талдаудан нәтижеге дейін")}</h2><p>{t("Прозрачный и понятный процесс на каждом этапе.", "Әр кезеңде ашық әрі түсінікті процесс.")}</p></div>
      <div className="process-grid">{process.map(([number, Icon, title, text], index) => <article key={number} data-reveal style={{ "--delay": `${index * 70}ms` } as CSSProperties}><span>{number}</span><Icon /><div><h3>{title}</h3><p>{text}</p></div>{index < process.length - 1 && <ArrowRight className="process-arrow" />}</article>)}</div>
    </section>
    <section className="corporate-section services-segments-results">
      <div className="segments-side"><div className="corporate-section-intro" data-reveal><Eyebrow>{t("ДЛЯ КАКИХ ОБЪЕКТОВ", "ҚАНДАЙ НЫСАНДАРҒА")}</Eyebrow><h2>{t("Наши решения эффективны", "Біздің шешімдер тиімді")}</h2><p>{t("Опыт в разных сегментах недвижимости.", "Жылжымайтын мүліктің әртүрлі сегменттеріндегі тәжірибе.")}</p></div><div className="segment-grid">{segments.map(([Icon, title, text, image], index) => <article key={title} data-reveal style={{ "--delay": `${index * 60}ms` } as CSSProperties}><img src={image} alt="" width="620" height="390" loading="lazy" /><div><Icon /><h3>{title}</h3><p>{text}</p></div></article>)}</div></div>
      <aside className="services-results" data-reveal><Eyebrow>{t("НАШИ РЕЗУЛЬТАТЫ", "БІЗДІҢ НӘТИЖЕЛЕР")}</Eyebrow><h2>{t("Доверие в цифрах", "Сандардағы сенім")}</h2><div><article><Building2 /><strong>{t("30 дней", "30 күн")}</strong><span>{t("Средний срок запуска", "Іске қосудың орташа мерзімі")}</span></article><article><Headphones /><strong>24/7</strong><span>{t("Поддержка объектов", "Нысандарды қолдау")}</span></article><article><Users /><strong>{t("1 оператор", "1 оператор")}</strong><span>{t("Единая точка ответственности", "Бірыңғай жауапкершілік нүктесі")}</span></article><article><BarChart3 /><strong>{t("Прозрачная отчётность", "Ашық есептілік")}</strong><span>{t("Доступ к данным в реальном времени", "Нақты уақыттағы деректерге қолжетімділік")}</span></article></div></aside>
    </section>
    <AuditBanner lang={lang} />
  </>;
}

type ObjectCategory = "all" | "business" | "residential" | "retail" | "government" | "hotel";

function ObjectsPage({ lang }: { lang: CorporateLang }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => kz ? kk : ru;
  const [filter, setFilter] = useState<ObjectCategory>("all");
  const filters: [ObjectCategory, string][] = [
    ["all", t("Все объекты", "Барлық нысандар")],
    ["business", t("Бизнес-центры", "Бизнес-орталықтар")],
    ["residential", t("Жилые комплексы", "Тұрғын үй кешендері")],
    ["retail", t("Торговые центры", "Сауда орталықтары")],
    ["government", t("Гос. объекты", "Мемлекеттік нысандар")],
    ["hotel", t("Отели", "Қонақүйлер")],
  ];
  const objects: { id: string; category: Exclude<ObjectCategory, "all">; title: Localized; location: Localized; image: string }[] = [
    { id: "esentai", category: "business", title: { ru: "Esentai Tower", kz: "Esentai Tower" }, location: { ru: "Алматы, Казахстан", kz: "Алматы, Қазақстан" }, image: "/reference/object-esentai.webp" },
    { id: "nexus", category: "business", title: { ru: "БЦ Nexus", kz: "Nexus БО" }, location: { ru: "Астана, Казахстан", kz: "Астана, Қазақстан" }, image: "/reference/object-nexus.webp" },
    { id: "premium-park", category: "residential", title: { ru: "ЖК Premium Park", kz: "Premium Park ТҮК" }, location: { ru: "Алматы, Казахстан", kz: "Алматы, Қазақстан" }, image: "/reference/object-premium.webp" },
    { id: "meridian", category: "retail", title: { ru: "ТРЦ Meridian", kz: "Meridian СОСО" }, location: { ru: "Алматы, Казахстан", kz: "Алматы, Қазақстан" }, image: "/reference/object-meridian.webp" },
    { id: "haileybury", category: "government", title: { ru: "Haileybury Astana", kz: "Haileybury Astana" }, location: { ru: "Астана, Казахстан", kz: "Астана, Қазақстан" }, image: "/reference/object-haileybury.webp" },
    { id: "kazatomprom", category: "government", title: { ru: "Казатомпром", kz: "Қазатомөнеркәсіп" }, location: { ru: "Астана, Казахстан", kz: "Астана, Қазақстан" }, image: "/reference/object-kazatomprom.webp" },
    { id: "samruk", category: "government", title: { ru: "Самрук-Казына", kz: "Самұрық-Қазына" }, location: { ru: "Астана, Казахстан", kz: "Астана, Қазақстан" }, image: "/reference/object-samruk.webp" },
    { id: "private-residence", category: "hotel", title: { ru: "Частная резиденция", kz: "Жеке резиденция" }, location: { ru: "Алматы, Казахстан", kz: "Алматы, Қазақстан" }, image: "/reference/object-residence.webp" },
  ];
  const shown = filter === "all" ? objects : objects.filter(item => item.category === filter);

  return <>
    <section className="corporate-section objects-catalog">
      <div className="object-filter-row" aria-label={t("Фильтр объектов", "Нысандар сүзгісі")}>
        <div>{filters.map(([key, label]) => <button type="button" key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div>
        <p>{t("Найдено объектов", "Табылған нысандар")}: <strong>{shown.length}</strong></p>
      </div>
      {shown.length ? <div className="object-catalog-grid">{shown.map((item, index) => <article key={item.id} data-reveal style={{ "--delay": `${index * 45}ms` } as CSSProperties}><figure><img src={item.image} alt={t(`Объект ${item.title.ru}`, `${item.title.kz} нысаны`)} width="900" height="560" loading="lazy" /><span>{item.category === "hotel" ? t("Отель / Резиденция", "Қонақүй / Резиденция") : filters.find(([key]) => key === item.category)?.[1]}</span></figure><div><h2>{item.title[lang]}</h2><p><MapPin size={14} />{item.location[lang]}</p><span className="object-card-arrow" aria-hidden="true"><ArrowRight /></span></div></article>)}</div> : <div className="objects-empty" role="status"><Building2 /><h2>{t("Объекты не найдены", "Нысандар табылмады")}</h2></div>}
    </section>
    <MetricBand lang={lang} />
    <AuditBanner lang={lang} variant="contact" />
  </>;
}

function ContactsPage({ lang }: { lang: CorporateLang }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => kz ? kk : ru;
  const [error, setError] = useState("");
  const [readyUrl, setReadyUrl] = useState("");
  const mapQuery = encodeURIComponent(`${siteSettings.address[lang]}, Казахстан`);
  const contactCards: [LucideIcon, string, ReactNode, string][] = [
    [Phone, t("Телефон", "Телефон"), <><strong>{siteSettings.phoneDisplay}</strong><span>{t("Позвонить нам", "Бізге қоңырау шалу")}</span></>, `tel:${siteSettings.phone}`],
    [Mail, "E-mail", <><strong>{siteSettings.email}</strong><span>{t("Ответим на ваше письмо", "Хатыңызға жауап береміз")}</span></>, `mailto:${siteSettings.email}`],
    [MapPin, t("Офис", "Кеңсе"), <><strong>{siteSettings.city[lang]}</strong><span>{siteSettings.street[lang]}</span></>, `https://www.google.com/maps/search/?api=1&query=${mapQuery}`],
    [Users, t("Отдел продаж", "Сату бөлімі"), <><strong>{siteSettings.phoneDisplay}</strong><span>{siteSettings.email}</span></>, whatsappUrl(t("Здравствуйте! Хочу обсудить объект с отделом продаж AAA URBAN.", "Сәлеметсіз бе! AAA URBAN сату бөлімімен нысанды талқылағым келеді."))],
  ];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    if (String(data.get("website") || "")) return;
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    if (name.length < 2) return setError(t("Укажите имя.", "Атыңызды жазыңыз."));
    if (phone.replace(/\D/g, "").length < 10) return setError(t("Проверьте номер телефона.", "Телефон нөмірін тексеріңіз."));
    const company = String(data.get("company") || "").trim();
    const type = String(data.get("type") || "").trim();
    const comment = String(data.get("comment") || "").trim();
    const message = [
      t("Здравствуйте! Хочу отправить запрос в AAA URBAN.", "Сәлеметсіз бе! AAA URBAN компаниясына сұрау жібергім келеді."),
      `${t("Имя", "Аты")}: ${name}`,
      company && `${t("Компания", "Компания")}: ${company}`,
      `${t("Телефон", "Телефон")}: ${phone}`,
      type && `${t("Тип объекта", "Нысан түрі")}: ${type}`,
      comment && `${t("Комментарий", "Пікір")}: ${comment}`,
    ].filter(Boolean).join("\n");
    setReadyUrl(whatsappUrl(message));
    track("inquiry_prepared", { source: "contacts_page", language: lang });
  }

  return <>
    <section className="corporate-section contacts-layout">
      <div className="contact-info-column" data-reveal><h2>{t("Контактная информация", "Байланыс ақпараты")}</h2><p>{t("Выберите удобный способ связи. Мы всегда открыты к диалогу.", "Өзіңізге ыңғайлы байланыс тәсілін таңдаңыз. Біз диалогқа әрқашан ашықпыз.")}</p><div>{contactCards.map(([Icon, label, content, href]) => <a href={href} key={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}><Icon /><small>{label}</small>{content}<b><ArrowRight /></b></a>)}</div></div>
      <div className="contact-form-card" data-reveal><h2>{t("Отправить запрос", "Сұрау жіберу")}</h2><p>{t("Оставьте заявку, и мы свяжемся с вами для обсуждения деталей.", "Өтінім қалдырыңыз, біз егжей-тегжейін талқылау үшін хабарласамыз.")}</p>{readyUrl ? <div className="contact-ready"><Check /><h3>{t("Запрос готов", "Сұрау дайын")}</h3><p>{t("Откройте WhatsApp и отправьте подготовленное сообщение.", "WhatsApp-ты ашып, дайын хабарламаны жіберіңіз.")}</p><a className="reference-button reference-button--red" href={readyUrl} target="_blank" rel="noopener noreferrer">{t("Открыть WhatsApp", "WhatsApp-ты ашу")}<ArrowUpRight /></a><button type="button" onClick={() => setReadyUrl("")}>{t("Изменить данные", "Деректерді өзгерту")}</button></div> : <form onSubmit={submit}><div className="contact-form-grid"><label>{t("Ваше имя", "Атыңыз")} *<input name="name" required minLength={2} placeholder={t("Введите имя", "Атыңызды жазыңыз")} /></label><label>{t("Компания", "Ұйым")}<input name="company" placeholder={t("Название компании", "Ұйым атауы")} /></label><label>{t("Телефон", "Телефон")} *<input name="phone" type="tel" required placeholder="+7 (___) ___-__-__" /></label><label>{t("Тип объекта", "Нысан түрі")}<select name="type" defaultValue=""><option value="" disabled>{t("Выберите тип", "Түрін таңдаңыз")}</option>{objectTypes.map(item => <option key={item.id} value={kz ? item.kz : item.ru}>{kz ? item.kz : item.ru}</option>)}</select></label></div><label>{t("Комментарий", "Пікір")}<textarea name="comment" rows={4} placeholder={t("Расскажите о задаче или объекте", "Міндет немесе нысан туралы айтып беріңіз")} /></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="reference-button reference-button--red" type="submit">{t("Отправить заявку", "Өтінім жіберу")}<ArrowRight /></button><small>{t("Нажимая кнопку, вы соглашаетесь с ", "Түймені басу арқылы сіз ")}<a href={kz ? "/kz/privacy" : "/privacy"}>{t("Политикой конфиденциальности", "Құпиялық саясатымен келісесіз")}</a></small></form>}</div>
      <aside className="contact-map-column" data-reveal><h2>{t("Наш офис на карте", "Картадағы кеңсеміз")}</h2><p>{t("Будем рады встретить вас в нашем офисе. Перед визитом согласуем удобное время.", "Сізді кеңсемізде қарсы алуға қуаныштымыз. Келмес бұрын ыңғайлы уақытты келісеміз.")}</p><iframe title={t("Карта офиса AAA URBAN", "AAA URBAN кеңсесінің картасы")} src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="office-card"><img src="/reference/contact-office.webp" alt="" width="216" height="264" loading="lazy" /><div><h3>AAA URBAN</h3><p>{siteSettings.address[lang]}</p><strong><MessageCircle />{t("Перед визитом", "Келмес бұрын")}</strong><span>{t("Позвоните или напишите нам в WhatsApp.", "Бізге қоңырау шалыңыз немесе WhatsApp арқылы жазыңыз.")}</span></div></div></aside>
    </section>
    <section className="corporate-section contacts-social"><div className="corporate-section-intro" data-reveal><h2>{t("Мы в социальных сетях", "Біз әлеуметтік желілердеміз")}</h2><p>{t("Следите за нашими проектами, аналитикой рынка и новостями компании.", "Жобаларымызды, нарық аналитикасын және компания жаңалықтарын бақылаңыз.")}</p></div><div className="social-info-grid"><article><Camera /><strong>Instagram</strong><span>AAA URBAN</span></article><article><BriefcaseBusiness /><strong>LinkedIn</strong><span>AAA URBAN</span></article><article><Play /><strong>YouTube</strong><span>AAA URBAN</span></article><a className="social-whatsapp" href={whatsappUrl(t("Здравствуйте! Хочу обсудить объект с AAA URBAN.", "Сәлеметсіз бе! AAA URBAN компаниясымен нысанды талқылағым келеді."))} target="_blank" rel="noopener noreferrer"><MessageCircle /><div><strong>{t("Написать в WhatsApp", "WhatsApp-та жазу")}</strong><span>{siteSettings.phoneDisplay}</span></div><QrCode aria-hidden="true" /></a></div></section>
    <AuditBanner lang={lang} variant="priority" />
  </>;
}

export default function CorporatePage({ kind, lang }: { kind: CorporatePageKind; lang: CorporateLang }) {
  useEffect(() => {
    document.documentElement.lang = lang === "kz" ? "kk" : "ru";
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }), { threshold: .08 });
    document.querySelectorAll("[data-reveal]").forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [kind, lang]);

  return <main className={`urban-site urban-site--reference corporate-page corporate-page--${kind}`}>
    <a className="skip-link" href="#corporate-content">{lang === "kz" ? "Мазмұнға өту" : "Перейти к содержанию"}</a>
    <CorporateHeader kind={kind} lang={lang} />
    <CorporateHero kind={kind} lang={lang} />
    <div id="corporate-content">
      {kind === "about" && <AboutPage lang={lang} />}
      {kind === "services" && <ServicesPage lang={lang} />}
      {kind === "objects" && <ObjectsPage lang={lang} />}
      {kind === "contacts" && <ContactsPage lang={lang} />}
    </div>
    <CorporateFooter lang={lang} />
    <a className="mobile-whatsapp reference-mobile-audit" href={whatsappUrl(lang === "kz" ? "Сәлеметсіз бе! AAA URBAN компаниясымен нысанды талқылағым келеді." : "Здравствуйте! Хочу обсудить объект с AAA URBAN.")} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /><span>{lang === "kz" ? "WhatsApp-та жазу" : "Написать в WhatsApp"}</span><ArrowUpRight size={17} /></a>
  </main>;
}
