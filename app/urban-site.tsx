"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { type Lang } from "./content";
import { teamMembers } from "./portfolio";
import { siteSettings, whatsappUrl } from "./site-settings";
import { track } from "./analytics";
import { MobileSiteMenu, ServicesMenu } from "./service-navigation";
import { servicePath } from "./service-pages";
import { corporatePagePath } from "./corporate-pages-data";

function Brand({ lang, footer = false }: { lang: Lang; footer?: boolean }) {
  return (
    <a className={`reference-brand${footer ? " reference-brand--footer" : ""}`} href={lang === "kz" ? "/kz" : "/"} aria-label="AAA URBAN">
      <strong>AAA</strong><span>URBAN</span>
      {footer && <small>{lang === "kz" ? "Басқарудан да артық" : "Больше, чем управление недвижимостью"}</small>}
    </a>
  );
}

function SectionHeading({ eyebrow, children, action }: { eyebrow: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="reference-section-heading" data-reveal>
      <div>
        <p className="reference-eyebrow"><span />{eyebrow}</p>
        <h2>{children}</h2>
      </div>
      {action}
    </div>
  );
}

export default function UrbanSite({ lang = "ru" }: { lang?: Lang }) {
  const kz = lang === "kz";
  const t = (ru: string, kk: string) => (kz ? kk : ru);
  const privacyPath = kz ? "/kz/privacy" : "/privacy";
  const auditMessage = t(
    "Здравствуйте! Хочу получить бесплатный первичный аудит ЖК. Название и адрес ЖК: ",
    "Сәлеметсіз бе! Тұрғын үй кешенінің тегін бастапқы аудитіне өтінім бергім келеді. ТҮК атауы мен мекенжайы: ",
  );
  const generalMessage = t(
    "Здравствуйте! Хочу обсудить управление объектом с AAA URBAN.",
    "Сәлеметсіз бе! AAA URBAN компаниясымен нысанды басқаруды талқылағым келеді.",
  );

  const navLinks = [
    { href: kz ? "/kz" : "/", label: t("Главная", "Басты бет") },
    { href: corporatePagePath("about", lang), label: t("О компании", "Компания туралы") },
    { href: corporatePagePath("objects", lang), label: t("Объекты", "Нысандар") },
    { href: corporatePagePath("contacts", lang), label: t("Контакты", "Байланыс") },
  ];

  const serviceCards = [
    { icon: Building2, title: t("Управление объектом", "Нысанды басқару"), text: t("Стратегическое и операционное управление", "Стратегиялық және операциялық басқару"), image: "/media/management.webp", href: servicePath("property-management", lang) },
    { icon: Settings2, title: t("Техническая эксплуатация", "Техникалық пайдалану"), text: t("Надёжная работа всех инженерных систем", "Барлық инженерлік жүйелердің сенімді жұмысы"), image: "/media/engineering.webp", href: servicePath("building-operation", lang) },
    { icon: BarChart3, title: t("Коммерческое управление", "Коммерциялық басқару"), text: t("Рост доходности и эффективное использование актива", "Табыстылықты арттыру және активті тиімді пайдалану"), image: "/media/business.webp", href: servicePath("commercial-property", lang) },
    { icon: ShieldCheck, title: t("Безопасность и контроль", "Қауіпсіздік және бақылау"), text: t("Комфорт и защита для арендаторов и посетителей", "Жалға алушылар мен келушілерге жайлылық пен қорғаныс"), image: "/media/security.webp", href: servicePath("engineering-systems", lang) },
    { icon: Leaf, title: t("Клининг и сервис", "Клининг және сервис"), text: t("Чистота, комфорт и высокий уровень сервиса", "Тазалық, жайлылық және жоғары сервис деңгейі"), image: "/media/corporate-lobby.webp", href: corporatePagePath("services", lang) },
  ];

  const heroValues = [
    [BarChart3, t("Повышаем стоимость актива", "Актив құнын арттырамыз")],
    [ShieldCheck, t("Обеспечиваем стабильную эксплуатацию", "Тұрақты пайдалануды қамтамасыз етеміз")],
    [Users, t("Создаём комфортную среду для людей", "Адамдарға жайлы орта жасаймыз")],
  ] as const;

  const homeObjects = [
    { title: "Esentai Tower", type: t("Бизнес-центр", "Бизнес-орталық"), city: t("Алматы", "Алматы"), image: "/reference/home-object-esentai.webp" },
    { title: t("БЦ Nexus", "Nexus БО"), type: t("Бизнес-центр", "Бизнес-орталық"), city: t("Астана", "Астана"), image: "/reference/home-object-nexus.webp" },
    { title: t("ЖК Premium Park", "Premium Park ТҮК"), type: t("Жилой комплекс", "Тұрғын үй кешені"), city: t("Алматы", "Алматы"), image: "/reference/home-object-premium.webp" },
    { title: t("ТРЦ Meridian", "Meridian СОСО"), type: t("Торговый центр", "Сауда орталығы"), city: t("Астана", "Астана"), image: "/reference/home-object-meridian.webp" },
  ];

  const ecosystem = [
    { logo: "/brands/aaa-service.svg", logoAlt: "AAA Service", title: t("Сервис, который создаёт комфорт", "Жайлылық жасайтын сервис"), text: t("Профессиональный клининг, технический сервис и эксплуатационная поддержка", "Кәсіби клининг, техникалық сервис және пайдалану қолдауы"), image: "/media/corporate-lobby.webp" },
    { logo: "/brands/prof-stroy-company.svg", logoAlt: "Prof Stroy Company", title: t("Строим надёжное будущее", "Сенімді болашақ құрамыз"), text: t("Строительно-монтажные работы и технические решения", "Құрылыс-монтаж жұмыстары және техникалық шешімдер"), image: "/media/engineering.webp" },
    { logo: "/brands/aaa-urban.svg", logoAlt: "AAA URBAN", title: t("Объединяем возможности", "Мүмкіндіктерді біріктіреміз"), text: t("Комплексное управление недвижимостью для максимальной ценности", "Максималды құндылық үшін жылжымайтын мүлікті кешенді басқару"), image: "/media/corporate-hero.webp" },
  ];

  const people = teamMembers.filter((person) => person.published && person.photo).slice(0, 4);

  useEffect(() => {
    document.documentElement.lang = kz ? "kk" : "ru";
    const seen = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target.hasAttribute("data-reveal")) entry.target.classList.add("is-visible");
        if (entry.target.id && !seen.has(entry.target.id)) {
          seen.add(entry.target.id);
          track("section_view", { section: entry.target.id, language: lang });
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal], section[id]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [kz, lang]);

  function whatsappClick(source: string) {
    track("cta_click", { source, language: lang });
    track("whatsapp_click", { source, language: lang });
  }

  return (
    <main className="urban-site urban-site--reference">
      <a className="skip-link" href="#services">{t("Перейти к содержанию", "Мазмұнға өту")}</a>

      <header className="site-header reference-header">
        <Brand lang={lang} />
        <nav aria-label={t("Главная навигация", "Негізгі навигация")}>
          <a href={kz ? "/kz" : "/"} aria-current="page">{t("Главная", "Басты бет")}</a>
          <a href={corporatePagePath("about", lang)}>{t("О компании", "Компания туралы")}</a>
          <ServicesMenu lang={lang} tone="light" overviewHref={corporatePagePath("services", lang)} />
          <a href={corporatePagePath("objects", lang)}>{t("Объекты", "Нысандар")}</a>
          <a href={corporatePagePath("contacts", lang)}>{t("Контакты", "Байланыс")}</a>
        </nav>
        <div className="header-actions">
          <div className="languages"><a href="/" lang="ru" aria-current={!kz ? "page" : undefined}>RU</a><span>/</span><a href="/kz" lang="kk" aria-current={kz ? "page" : undefined}>KZ</a></div>
          <a className="header-cta reference-header-cta" href={whatsappUrl(auditMessage)} target="_blank" rel="noopener noreferrer" onClick={() => whatsappClick("header_audit")}>{t("Получить бесплатный аудит", "Тегін аудит алу")}<ArrowRight size={16} /></a>
          <MobileSiteMenu lang={lang} links={navLinks} servicePosition={2} tone="light" overviewHref={corporatePagePath("services", lang)} />
        </div>
      </header>

      <section className="reference-hero" id="home">
        <figure className="reference-hero-media" aria-label={t("Современный бизнес-центр", "Заманауи бизнес-орталық")}>
          <img src="/reference/home-hero.webp" alt={t("Современный стеклянный бизнес-центр", "Заманауи шыны бизнес-орталық")} width="2120" height="741" fetchPriority="high" />
          <div className="reference-hero-vertical" aria-hidden="true"><span>PEOPLE</span><span>SPACES</span><span>VALUE</span></div>
          <figcaption><span>Esentai Tower</span><small>{t("Алматы, Казахстан", "Алматы, Қазақстан")}</small></figcaption>
        </figure>
        <div className="reference-hero-copy">
          <p className="reference-eyebrow" data-reveal><span />{t("БОЛЬШЕ, ЧЕМ УПРАВЛЕНИЕ НЕДВИЖИМОСТЬЮ", "ЖЫЛЖЫМАЙТЫН МҮЛІКТІ БАСҚАРУДАН ДА АРТЫҚ")}</p>
          <h1 data-reveal>{t("Весь объект —", "Бүкіл нысан —")}<br /><em>{t("под нашим контролем", "біздің бақылауымызда")}</em></h1>
          <p className="reference-hero-lead" data-reveal>{t("Управление, эксплуатация и контроль объекта в одной системе", "Нысанды басқару, пайдалану және бақылау бір жүйеде")}</p>
          <div className="reference-hero-actions" data-reveal>
            <a className="reference-button reference-button--red" href={whatsappUrl(auditMessage)} target="_blank" rel="noopener noreferrer" onClick={() => whatsappClick("hero_audit")}>{t("Получить бесплатный аудит", "Тегін аудит алу")}<ArrowRight size={17} /></a>
            <a className="reference-button reference-button--outline" href={whatsappUrl(generalMessage)} target="_blank" rel="noopener noreferrer" onClick={() => whatsappClick("hero_discuss")}>{t("Обсудить объект", "Нысанды талқылау")}<ArrowRight size={17} /></a>
          </div>
        </div>
        <div className="reference-hero-values" aria-label={t("Ключевые преимущества", "Негізгі артықшылықтар")}>
          {heroValues.map(([Icon, label], index) => <div key={label} data-reveal style={{ "--delay": `${index * 80}ms` } as CSSProperties}><span className="value-icon"><Icon size={20} aria-hidden="true" /></span><p>{label}</p></div>)}
        </div>
      </section>

      <section className="reference-section reference-services" id="services">
        <SectionHeading eyebrow={t("НАШИ УСЛУГИ", "БІЗДІҢ ҚЫЗМЕТТЕР")} action={<a className="section-round-link" href={corporatePagePath("services", lang)} aria-label={t("Все услуги", "Барлық қызметтер")}><span>{t("Все услуги", "Барлық қызметтер")}</span><ArrowRight size={17} /></a>}>
          {t("Полный цикл управления недвижимостью", "Жылжымайтын мүлікті басқарудың толық циклі")}
        </SectionHeading>
        <div className="reference-service-grid">
          {serviceCards.map(({ icon: Icon, title, text, image, href }, index) => (
            <article className="reference-service-card" key={title} data-reveal style={{ "--delay": `${index * 70}ms` } as CSSProperties}>
              <div className="reference-service-copy"><Icon size={25} aria-hidden="true" /><h3>{title}</h3><p>{text}</p><a href={href} aria-label={`${t("Подробнее: ", "Толығырақ: ")}${title}`}><ArrowRight size={16} /></a></div>
              <figure><img src={image} alt="" width="1300" height="867" loading="lazy" /></figure>
            </article>
          ))}
        </div>
      </section>

      <section className="reference-section reference-about" id="about">
        <div className="reference-about-copy" data-reveal>
          <p className="reference-eyebrow"><span />{t("О КОМПАНИИ", "КОМПАНИЯ ТУРАЛЫ")}</p>
          <h2>{t("Надёжный партнёр", "Жылжымайтын мүлікті")}<br />{t("в развитии недвижимости", "дамытудағы сенімді серіктес")}</h2>
          <p>{t("AAA URBAN — команда профессионалов, которая создаёт эффективные, безопасные и комфортные пространства, повышая ценность объектов и качество жизни людей.", "AAA URBAN — нысандардың құндылығы мен адамдардың өмір сапасын арттыратын тиімді, қауіпсіз және жайлы кеңістік жасайтын кәсіби команда.")}</p>
          <div className="reference-about-facts">
            <div><strong>10<span>+</span></strong><small>{t("лет на рынке", "жыл нарықта")}</small></div>
            <div><strong>400<span>+</span></strong><small>{t("объектов", "нысан")}</small></div>
            <div><strong>1.5<span>+ млн м²</span></strong><small>{t("в управлении", "басқаруда")}</small></div>
          </div>
          <a className="reference-button reference-button--outline" href={corporatePagePath("about", lang)}>{t("Подробнее о компании", "Компания туралы толығырақ")}<ArrowRight size={16} /></a>
        </div>
        <div className="reference-team" data-reveal>
          <div className="reference-team-heading"><p className="reference-eyebrow"><span />{t("КОМАНДА РУКОВОДСТВА", "БАСШЫЛЫҚ КОМАНДАСЫ")}</p><a href={corporatePagePath("about", lang)}>{t("Вся команда", "Бүкіл команда")}<ArrowRight size={15} /></a></div>
          <div className="reference-team-grid">
            {people.map((person) => <figure key={person.id}><img src={person.photo} alt={person.name[lang]} width="420" height="500" loading="lazy" style={{ objectPosition: person.position || "50% 18%" }} /><figcaption><strong>{person.name[lang]}</strong><span>{person.role[lang]}</span><b aria-hidden="true">in</b></figcaption></figure>)}
          </div>
        </div>
      </section>

      <section className="reference-section reference-ecosystem" id="ecosystem">
        <div className="ecosystem-intro" data-reveal>
          <p className="reference-eyebrow"><span />{t("КАК ФОРМИРОВАЛСЯ AAA URBAN", "AAA URBAN ҚАЛАЙ ҚАЛЫПТАСТЫ")}</p>
          <h2>{t("Сильная экосистема", "Кешенді шешімдерге")}<br />{t("для комплексных решений", "арналған мықты экожүйе")}</h2>
          <p>{t("AAA URBAN объединяет экспертизу в управлении, сервисе и строительстве. Мы создали экосистему, которая покрывает весь жизненный цикл объекта — от строительства до эффективной эксплуатации.", "AAA URBAN басқару, сервис және құрылыс сараптамасын біріктіреді. Экожүйе нысанның құрылысынан тиімді пайдалануына дейінгі бүкіл өмірлік циклін қамтиды.")}</p>
          <a className="reference-button reference-button--outline" href={corporatePagePath("about", lang)}>{t("Узнать больше", "Толығырақ білу")}<ArrowRight size={16} /></a>
        </div>
        <div className="ecosystem-flow">
          {ecosystem.map((item, index) => (
            <div className="ecosystem-flow-step" key={item.logoAlt}>
              <article data-reveal style={{ "--delay": `${index * 80}ms` } as CSSProperties}>
                <div className="ecosystem-card-head"><img className="ecosystem-logo" src={item.logo} alt={item.logoAlt} width="176" height="118" loading="lazy" /><img className="ecosystem-photo" src={item.image} alt="" width="154" height="206" loading="lazy" /></div>
                <h3>{item.title}</h3><p>{item.text}</p>
              </article>
              {index < ecosystem.length - 1 && <ArrowRight className="ecosystem-arrow" size={20} aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      <section className="reference-section reference-objects-results" id="objects">
        <div className="reference-objects">
          <SectionHeading eyebrow={t("НАШИ ОБЪЕКТЫ", "БІЗДІҢ НЫСАНДАР")} action={<a className="section-round-link" href={corporatePagePath("objects", lang)}><span>{t("Все объекты", "Барлық нысандар")}</span><ArrowRight size={16} /></a>}>{t("Объекты, которые вдохновляют", "Шабыт беретін нысандар")}</SectionHeading>
          <div className="reference-object-grid">
            {homeObjects.map((item, index) => <article key={item.title} data-reveal style={{ "--delay": `${index * 70}ms` } as CSSProperties}><div className="reference-object-media"><img src={item.image} alt={item.title} width="612" height="278" loading="lazy" /></div><h3>{item.title}</h3><p>{item.type}</p><small>{item.city}</small></article>)}
          </div>
        </div>
        <aside className="reference-results" data-reveal>
          <p className="reference-eyebrow"><span />{t("НАШИ РЕЗУЛЬТАТЫ", "БІЗДІҢ НӘТИЖЕЛЕР")}</p>
          <h2>{t("Доверие в цифрах", "Сандардағы сенім")}</h2>
          <div className="reference-results-grid">
            <div><Building2 size={22} /><strong>400+</strong><span>{t("объектов в управлении", "басқарудағы нысан")}</span></div>
            <div><BarChart3 size={22} /><strong>1.5+ {t("млн м²", "млн м²")}</strong><span>{t("общая площадь", "жалпы аудан")}</span></div>
            <div><ShieldCheck size={22} /><strong>98%</strong><span>{t("удовлетворённость клиентов", "клиенттердің қанағаттануы")}</span></div>
            <div><Users size={22} /><strong>50+</strong><span>{t("профессионалов в команде", "командадағы маман")}</span></div>
          </div>
        </aside>
      </section>

      <section className="reference-audit" id="contact">
        <div className="reference-audit-shade" />
        <div className="reference-audit-copy" data-reveal><p>{t("ГОТОВЫ ОБСУДИТЬ ВАШ ОБЪЕКТ?", "НЫСАНЫҢЫЗДЫ ТАЛҚЫЛАУҒА ДАЙЫНСЫЗ БА?")}</p><h2>{t("Получите бесплатный аудит", "Тегін аудит алыңыз")}</h2><span>{t("Проанализируем текущее состояние, определим оптимальные решения и покажем потенциал вашего объекта.", "Қазіргі жағдайды талдап, тиімді шешімдерді анықтаймыз және нысаныңыздың әлеуетін көрсетеміз.")}</span></div>
        <div className="reference-audit-actions" data-reveal>
          <a className="reference-button reference-button--red" href={whatsappUrl(auditMessage)} target="_blank" rel="noopener noreferrer" onClick={() => whatsappClick("final_audit")}>{t("Получить бесплатный аудит", "Тегін аудит алу")}<ArrowRight size={17} /></a>
          <a className="reference-button reference-button--ghost" href={whatsappUrl(generalMessage)} target="_blank" rel="noopener noreferrer" onClick={() => whatsappClick("final_discuss")}>{t("Обсудить объект", "Нысанды талқылау")}<ArrowRight size={17} /></a>
          <small>{t("Консультация ни к чему не обязывает", "Консультация ештеңеге міндеттемейді")}</small>
        </div>
      </section>

      <footer className="reference-footer">
        <Brand lang={lang} footer />
        <nav aria-label={t("Навигация в подвале", "Төменгі навигация")}><a href={kz ? "/kz" : "/"}>{t("Главная", "Басты бет")}</a><a href={corporatePagePath("about", lang)}>{t("О компании", "Компания туралы")}</a><a href={corporatePagePath("services", lang)}>{t("Услуги", "Қызметтер")}</a><a href={corporatePagePath("objects", lang)}>{t("Объекты", "Нысандар")}</a><a href={corporatePagePath("contacts", lang)}>{t("Контакты", "Байланыс")}</a></nav>
        <div className="reference-footer-contacts"><a href={`tel:${siteSettings.phone}`} onClick={() => track("phone_click", { language: lang })}><Phone size={14} />{siteSettings.phoneDisplay}</a><a href={`mailto:${siteSettings.email}`} onClick={() => track("email_click", { language: lang })}><Mail size={14} />{siteSettings.email}</a><p><MapPin size={14} />{siteSettings.address[lang]}</p></div>
        <div className="reference-footer-bottom"><span>© 2026 AAA URBAN. {t("Все права защищены.", "Барлық құқық қорғалған.")}</span><a href={privacyPath}>{t("Политика конфиденциальности", "Құпиялық саясаты")}</a></div>
      </footer>

      <a className="mobile-whatsapp reference-mobile-audit" href={whatsappUrl(auditMessage)} target="_blank" rel="noopener noreferrer" onClick={() => whatsappClick("mobile_audit")} aria-label={t("Получить бесплатный аудит в WhatsApp", "WhatsApp арқылы тегін аудит алу")}><MessageCircle size={18} /><span>{t("Бесплатный аудит", "Тегін аудит")}</span><ArrowUpRight size={16} /></a>
    </main>
  );
}
