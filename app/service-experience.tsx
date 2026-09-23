import { ArrowDown, ArrowRight, ArrowUpRight, Check, ClipboardList, Droplets, Settings2, ShieldCheck, Users, Wind, Zap } from "lucide-react";
import { localizedText, servicePages, type Localized, type ServiceLang, type ServicePageKey } from "./service-pages";
import { whatsappUrl } from "./site-settings";

type Props = { pageKey: ServicePageKey; lang: ServiceLang };

const directions: ServicePageKey[] = [
  "property-management", "building-operation", "engineering-systems", "osi-management",
  "residential-complex", "business-center", "commercial-property", "residential-audit",
];

const emphasis: Record<ServicePageKey, Localized> = {
  "property-management": { ru: "недвижимостью", kz: "мүлікті" },
  "building-operation": { ru: "Эксплуатация", kz: "пайдалану" },
  "engineering-systems": { ru: "Инженерные", kz: "инженерлік" },
  "osi-management": { ru: "для ОСИ", kz: "МИБ үшін" },
  "residential-complex": { ru: "жилым комплексом", kz: "Тұрғын үй" },
  "business-center": { ru: "бизнес-центра", kz: "Бизнес-орталықты" },
  "commercial-property": { ru: "коммерческой", kz: "Коммерциялық" },
  "residential-audit": { ru: "Бесплатный", kz: "тегін" },
};

const gallery: Record<ServicePageKey, string[]> = {
  "property-management": ["/architecture.webp"],
  "building-operation": ["/media/management.webp"],
  "engineering-systems": ["/media/engineering.webp"],
  "osi-management": ["/architecture.webp"],
  "residential-complex": ["/architecture.webp", "/media/residence.webp"],
  "business-center": ["/media/business.webp"],
  "commercial-property": ["/media/hotel.webp", "/media/retail.webp", "/media/warehouse.webp"],
  "residential-audit": ["/architecture.webp"],
};

function view({ pageKey, lang }: Props) {
  const page = servicePages[pageKey];
  const t = (value: Localized) => localizedText(value, lang);
  const label = (ru: string, kz: string) => lang === "kz" ? kz : ru;
  return { page, t, label, index: String(directions.indexOf(pageKey) + 1).padStart(2, "0") };
}

function Title(props: Props) {
  const { page, t } = view(props);
  const title = t(page.title);
  const focus = t(emphasis[props.pageKey]);
  const at = title.indexOf(focus);
  if (at < 0) return <h1 className="direction-title">{title}</h1>;
  return <h1 className="direction-title">{title.slice(0, at)}<em>{focus}</em>{title.slice(at + focus.length)}</h1>;
}

function Breadcrumb(props: Props) {
  const { page, t, label } = view(props);
  return <nav className="direction-breadcrumb" aria-label={label("Хлебные крошки", "Навигация тізбегі")}>
    <a href={props.lang === "kz" ? "/kz" : "/"}>{label("Главная", "Басты бет")}</a><span>/</span><span>{t(page.title)}</span>
  </nav>;
}

function Eyebrow({ number, children }: { number?: string; children: string }) {
  return <p className="direction-eyebrow">{number && <span>{number} /</span>}{children}</p>;
}

function Actions(props: Props) {
  const { page, t, label } = view(props);
  const audit = props.pageKey === "residential-audit";
  return <div className="direction-actions">
    <a className="button primary" href={whatsappUrl(t(page.whatsappMessage))} target="_blank" rel="noopener noreferrer">
      {audit ? label("Обсудить аудит", "Аудитті талқылау") : label("Обсудить объект", "Нысанды талқылау")}<ArrowUpRight size={19} />
    </a>
    <a className="direction-scroll" href="#service-content"><ArrowDown size={18} /><span>{label("Подробнее", "Толығырақ")}</span></a>
  </div>;
}

function HeroPhoto({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return <img className="direction-photo" src={src} alt={alt} width="1500" height="1000" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} />;
}

export function DirectionHero(props: Props) {
  const { pageKey } = props;
  const { page, t, label, index } = view(props);
  const head = <><Eyebrow number={index}>{t(page.eyebrow)}</Eyebrow><Title {...props} /></>;
  const lead = <p className="direction-lead">{t(page.lead)}</p>;
  const alt = t(page.imageAlt);

  if (pageKey === "property-management") return <section className="direction-hero management-hero">
    <Breadcrumb {...props} /><div className="management-opening"><div>{head}</div><div className="management-lead">{lead}<Actions {...props} /></div></div>
    <figure className="management-panorama"><HeroPhoto src={gallery[pageKey][0]} alt={alt} eager /><figcaption><span>AAA URBAN</span><span>{label("Один объект. Одна система управления.", "Бір нысан. Бір басқару жүйесі.")}</span><ArrowDown size={20} /></figcaption></figure>
  </section>;

  if (pageKey === "building-operation") return <section className="direction-hero operation-hero">
    <Breadcrumb {...props} /><div className="operation-opening"><div>{head}<Actions {...props} /></div><aside><Settings2 size={28} /><p>{label("Техническая работа, которая поддерживает жизнь здания.", "Ғимараттың тіршілігін қамтамасыз ететін техникалық жұмыс.")}</p></aside></div>
    <div className="operation-bottom"><figure><HeroPhoto src={gallery[pageKey][0]} alt={alt} eager /><figcaption>{label("ОБОРУДОВАНИЕ / ОБСЛУЖИВАНИЕ / КОНТРОЛЬ", "ЖАБДЫҚ / ҚЫЗМЕТ КӨРСЕТУ / БАҚЫЛАУ")}</figcaption></figure><div>{lead}<i /><small>{label("От состояния систем — к плану работ.", "Жүйелердің жай-күйінен — жұмыс жоспарына.")}</small></div></div>
  </section>;

  if (pageKey === "engineering-systems") return <section className="direction-hero engineering-hero">
    <div className="engineering-copy"><Breadcrumb {...props} />{head}{lead}<Actions {...props} /><div className="engineering-icons" aria-hidden="true"><Zap /><Wind /><Droplets /><ShieldCheck /></div></div>
    <figure className="engineering-portrait"><HeroPhoto src={gallery[pageKey][0]} alt={alt} eager /><figcaption><span>{label("ИНЖЕНЕРИЯ ОБЪЕКТА", "НЫСАН ИНЖЕНЕРИЯСЫ")}</span><strong>{label("Всё связано.", "Бәрі өзара байланысты.")}</strong></figcaption></figure>
  </section>;

  if (pageKey === "osi-management") return <section className="direction-hero osi-direction-hero">
    <Breadcrumb {...props} /><div className="osi-opening"><div>{head}{lead}<Actions {...props} /><p className="osi-signature">{label("Ваш дом — место для жизни.", "Үйіңіз — өмір сүруге арналған орын.")}</p></div><figure><HeroPhoto src={gallery[pageKey][0]} alt={alt} eager /><figcaption><Users size={20} />{label("Жители · ОСИ · AAA URBAN", "Тұрғындар · МИБ · AAA URBAN")}</figcaption></figure></div>
  </section>;

  if (pageKey === "residential-complex") return <section className="direction-hero residential-hero">
    <HeroPhoto src={gallery[pageKey][0]} alt={alt} eager /><div className="residential-shade" />
    <div className="residential-opening"><Breadcrumb {...props} />{head}<div className="residential-bottom"><p>{label("Каждый день.", "Күн сайын.")}<br /><em>{label("В каждой детали.", "Әр бөлшекте.")}</em></p><div>{lead}<Actions {...props} /></div></div></div>
  </section>;

  if (pageKey === "business-center") return <section className="direction-hero business-hero">
    <figure><HeroPhoto src={gallery[pageKey][0]} alt={alt} eager /><figcaption>AAA / URBAN<span>{label("ДЕЛОВАЯ НЕДВИЖИМОСТЬ", "ІСКЕРЛІК ЖЫЛЖЫМАЙТЫН МҮЛІК")}</span></figcaption></figure>
    <div className="business-copy"><Breadcrumb {...props} />{head}{lead}<Actions {...props} /><p>{label("Инженерия. Бюджет. Ответственность.", "Инженерия. Бюджет. Жауапкершілік.")}</p></div>
  </section>;

  if (pageKey === "commercial-property") return <section className="direction-hero commercial-direction-hero">
    <Breadcrumb {...props} /><div className="commercial-opening">{head}{lead}<Actions {...props} /></div>
    <div className="commercial-filmstrip">{gallery[pageKey].map((src, i) => <figure key={src}><HeroPhoto src={src} alt={alt} eager={i === 1} /><figcaption><span>0{i + 1}</span>{[label("Отели", "Қонақүйлер"), label("Торговые объекты", "Сауда нысандары"), label("Складские объекты", "Қойма нысандары")][i]}</figcaption></figure>)}</div>
  </section>;

  return <section className="direction-hero audit-direction-hero">
    <Breadcrumb {...props} /><div className="audit-opening"><div>{head}{lead}<Actions {...props} /></div><aside><ClipboardList size={30} /><p>{label("С чего начать, если дому нужно больше внимания?", "Үйге көбірек назар қажет болса, неден бастау керек?")}</p><span>{label("Начните с текущих задач вашего ЖК.", "Тұрғын үй кешенінің ағымдағы міндеттерінен бастаңыз.")}</span></aside></div>
    <figure><HeroPhoto src={gallery[pageKey][0]} alt={alt} eager /><figcaption>{label("ПОНЯТЬ СОСТОЯНИЕ. ОПРЕДЕЛИТЬ ПРИОРИТЕТЫ.", "ЖАЙ-КҮЙІН ТҮСІНУ. БАСЫМДЫҚТАРДЫ АНЫҚТАУ.")}</figcaption></figure>
  </section>;
}

function ScopeHeading(props: Props) {
  const { page, t, label } = view(props);
  return <div className="direction-section-heading" data-reveal><Eyebrow>{label("Зона ответственности", "Жауапкершілік аймағы")}</Eyebrow><h2>{t(page.scopeTitle)}</h2><p>{t(page.scopeIntro)}</p></div>;
}

function ScopeRows(props: Props) {
  const { page, t } = view(props);
  return <div className="direction-scope-rows">{page.scope.map((item, i) => <article key={i} data-reveal><span>0{i + 1}</span><h3>{t(item.title)}</h3><p>{t(item.text)}</p></article>)}</div>;
}

function Audience(props: Props) {
  const { page, t } = view(props);
  return <aside className="direction-audience" data-reveal><h2>{t(page.audienceTitle)}</h2><ul>{page.audience.map((item, i) => <li key={i}><Check size={17} />{t(item)}</li>)}</ul></aside>;
}

function Process(props: Props) {
  const { page, t, label } = view(props);
  return <section className="direction-process"><div data-reveal><Eyebrow>{label("В работе", "Жұмыс барысында")}</Eyebrow><h2>{t(page.processTitle)}</h2><p>{t(page.processIntro)}</p></div><ol>{page.process.map((item, i) => <li key={i} data-reveal><span>0{i + 1}</span><div><h3>{t(item.title).replace(/^\d+\s*·\s*/, "")}</h3><p>{t(item.text)}</p></div><ArrowRight size={19} /></li>)}</ol></section>;
}

export function DirectionStory(props: Props) {
  const { pageKey } = props;
  const { page, t, label } = view(props);

  if (pageKey === "engineering-systems") return <>
    <section id="service-content" className="direction-section engineering-system-story"><div className="engineering-system-intro" data-reveal><Eyebrow>{label("Системы здания", "Ғимарат жүйелері")}</Eyebrow><h2>{label("Невидимая работа.", "Көзге көрінбейтін жұмыс.")}<br /><em>{label("Ощутимый комфорт.", "Сезілетін жайлылық.")}</em></h2><p>{t(page.processIntro)}</p></div><div className="engineering-system-list">{page.process.map((item, i) => { const Icon = [Zap, Droplets, ShieldCheck, Settings2][i]; return <details key={i} open={i === 0}><summary><Icon size={23} /><h3>{t(item.title)}</h3><span>+</span></summary><p>{t(item.text)}</p></details>; })}</div></section>
    <Audience {...props} /><section className="direction-section"><ScopeHeading {...props} /><ScopeRows {...props} /></section>
  </>;

  if (pageKey === "osi-management") return <>
    <section id="service-content" className="direction-section osi-ledger-section"><ScopeHeading {...props} /><div className="osi-ledger"><div><span>{label("Задача дома", "Үй міндеті")}</span><span>AAA URBAN</span></div>{page.scope.map((item, i) => <article key={i} data-reveal><h3>{t(item.title)}</h3><ArrowRight size={19} /><p>{t(item.text)}</p></article>)}</div></section><Process {...props} /><Audience {...props} />
  </>;

  if (pageKey === "residential-complex") return <>
    <section id="service-content" className="direction-section residential-story"><ScopeHeading {...props} /><div className="residential-story-grid"><figure data-reveal><HeroPhoto src="/media/residence.webp" alt={label("Пространство жилого комплекса", "Тұрғын үй кешенінің кеңістігі")} /></figure><ScopeRows {...props} /></div></section><Audience {...props} /><Process {...props} />
  </>;

  if (pageKey === "commercial-property") return <>
    <section id="service-content" className="direction-section commercial-formats"><div className="direction-section-heading" data-reveal><Eyebrow>{label("Форматы недвижимости", "Жылжымайтын мүлік түрлері")}</Eyebrow><h2>{t(page.processTitle)}</h2><p>{t(page.processIntro)}</p></div><div className="commercial-format-list">{page.process.map((item, i) => <article key={i} data-reveal><HeroPhoto src={["/media/retail.webp", "/media/hotel.webp", "/media/warehouse.webp", "/media/business.webp"][i]} alt={t(item.title)} /><div><span>0{i + 1}</span><h3>{t(item.title)}</h3><p>{t(item.text)}</p></div></article>)}</div></section><section className="direction-section"><ScopeHeading {...props} /><ScopeRows {...props} /></section>
  </>;

  if (pageKey === "residential-audit") return <>
    <div id="service-content" className="audit-first-step"><Audience {...props} /><section className="audit-checklist"><ScopeHeading {...props} /><div>{page.scope.map((item, i) => <article key={i} data-reveal><Check size={19} /><div><h3>{t(item.title)}</h3><p>{t(item.text)}</p></div></article>)}</div></section></div><Process {...props} />
  </>;

  return <>
    {pageKey === "building-operation" && <div id="service-content"><Process {...props} /></div>}
    {pageKey === "business-center" && <Audience {...props} />}
    <section id={pageKey === "building-operation" || pageKey === "business-center" ? undefined : "service-content"} className="direction-section"><ScopeHeading {...props} /><ScopeRows {...props} /></section>
    {pageKey !== "business-center" && <Audience {...props} />}
    {pageKey !== "building-operation" && <Process {...props} />}
  </>;
}
