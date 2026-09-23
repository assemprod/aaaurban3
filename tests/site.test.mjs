import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../dist/server/index.js";

const origin = "https://aaaurbanver2.corparationsite.workers.dev";
const corporatePages = [
  ["/about", "/kz/about", "Надёжный партнёр в управлении и эксплуатации недвижимости", "Жылжымайтын мүлікті басқару мен пайдаланудағы сенімді серіктес", "AboutPage"],
  ["/services", "/kz/services", "Полный цикл управления недвижимостью", "Жылжымайтын мүлікті басқарудың толық циклі", "CollectionPage"],
  ["/objects", "/kz/objects", "Объекты, которые вдохновляют", "Шабыт беретін нысандар", "CollectionPage"],
  ["/contacts", "/kz/contacts", "Остаёмся на связи", "Байланыста болайық", "ContactPage"],
];

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [name.toLowerCase(), value]));
}

async function request(path, options) {
  const pending = [];
  const context = { waitUntil(promise) { pending.push(promise); }, passThroughOnException() {} };
  const response = await worker.fetch(new Request(origin + path, options), {}, context);
  const html = await response.text();
  await Promise.all(pending);
  return { response, html, visible: html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "") };
}

for (const [path, language, title, audit] of [
  ["/", "ru", "Весь объект —", "Получить бесплатный аудит"],
  ["/kz", "kk", "Бүкіл нысан —", "Тегін аудит алу"],
]) {
  test(`${path}: content and language are present before JavaScript`, async () => {
    const { response, html, visible } = await request(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.ok(html.includes(`<html lang="${language}"`));
    assert.equal((visible.match(/<h1\b/g) || []).length, 1);
    assert.ok(visible.includes(title));
    assert.ok(visible.includes(audit));
    assert.doesNotMatch(visible, /your-domain|\.example/);
    assert.ok(visible.includes('href="tel:+77012200112"'));
    assert.ok(visible.includes('href="mailto:info@aaaservice.kz"'));
    assert.ok(visible.includes(path === "/" ? "Получите бесплатный аудит" : "Тегін аудит алыңыз"));
  });

  test(`${path}: navigation targets and local images resolve`, async () => {
    const { visible } = await request(path);
    const ids = [...visible.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, "Element IDs must be unique");
    for (const [, target] of visible.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(ids.includes(target), `Missing section #${target}`);
    }
    for (const [, source] of visible.matchAll(/<img\b[^>]*\bsrc="(\/[^"?]+)"/g)) {
      await access(new URL(`../public${source}`, import.meta.url));
    }
    for (const [image] of visible.matchAll(/<img\b[^>]*>/g)) {
      assert.match(image, /\balt="[^"]*"/, "Every image needs an alt attribute");
    }
  });

  test(`${path}: WhatsApp calls to action reach the configured number`, async () => {
    const { visible } = await request(path);
    const links = [...visible.matchAll(/href="(https:\/\/wa\.me\/[^\"]+)"/g)];
    assert.ok(links.length >= 3);
    for (const [, href] of links) {
      const url = new URL(href.replaceAll("&amp;", "&"));
      assert.equal(url.pathname, "/77012200112");
      const message = url.searchParams.get("text");
      assert.ok(message && !message.includes("undefined"));
      assert.ok(message.includes(language === "ru" ? "Здравствуйте" : "Сәлеметсіз"));
    }
  });

  test(`${path}: canonical, language alternatives and structured contacts are correct`, async () => {
    const { html } = await request(path);
    const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/);
    assert.equal(canonical?.[1], origin + (path === "/" ? "/" : path));
    assert.match(html, /hrefLang="ru-KZ"|hreflang="ru-KZ"/);
    assert.match(html, /hrefLang="kk-KZ"|hreflang="kk-KZ"/);
    const jsonBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert.ok(jsonBlocks.length >= 2);
    const graph = jsonBlocks.flatMap(data => data["@graph"] || []);
    const organization = graph.find(item => item["@id"] === origin + "/#organization");
    const faq = graph.find(item => item["@type"] === "FAQPage");
    assert.ok(organization);
    assert.equal(organization.name, "AAA URBAN");
    assert.equal(organization.telephone, "+77012200112");
    assert.equal(organization.email, "info@aaaservice.kz");
    assert.equal(organization.address.addressCountry, "KZ");
    assert.equal(organization.areaServed.name, "Астана");
    assert.ok(faq?.mainEntity?.length >= 5);
  });
}



test("the five reference service cards are present in server HTML", async () => {
  const { visible } = await request("/");
  for (const label of ["Управление объектом", "Техническая эксплуатация", "Коммерческое управление", "Безопасность и контроль", "Клининг и сервис"]) {
    assert.ok(visible.includes(label));
  }
  assert.match(visible, /class="[^"]*reference-service-grid[^"]*"/);
});

test("homepage links to the service overview and contains no internal placeholder copy", async () => {
  const { visible } = await request("/");
  assert.ok(visible.includes('href="/services"'));
  assert.doesNotMatch(visible, /Реальные фотографии появятся|Блок готов для настоящих фотографий/);
  assert.match(visible, /Рост доходности/);
  assert.match(visible, /Надёжная работа всех инженерных систем/);
});

test("objects page reproduces the approved eight-card reference catalog", async () => {
  const { visible } = await request("/objects");
  for (const title of ["Esentai Tower", "БЦ Nexus", "ЖК Premium Park", "ТРЦ Meridian", "Haileybury Astana", "Казатомпром", "Самрук-Казына", "Частная резиденция"]) {
    assert.ok(visible.includes(title));
  }
});

test("privacy pages describe the actual WhatsApp handoff in both languages", async () => {
  for (const [path, language, home] of [["/privacy", "ru", "/#contact"], ["/kz/privacy", "kk", "/kz#contact"]]) {
    const { response, html, visible } = await request(path);
    assert.equal(response.status, 200);
    assert.ok(html.includes(`<html lang="${language}"`));
    assert.match(visible, /WhatsApp/);
    assert.ok(visible.includes(`href="${home}"`));
    assert.match(html, /noindex/);
  }
});

test("language middleware overrides an incorrect client-supplied locale", async () => {
  const { html } = await request("/", { headers: { "x-urban-language": "kk" } });
  assert.ok(html.includes('<html lang="ru"'));
});

test("robots and sitemap point to the public website", async () => {
  const robots = await request("/robots.txt");
  const sitemap = await request("/sitemap.xml");
  assert.equal(robots.response.status, 200);
  assert.equal(sitemap.response.status, 200);
  assert.ok(robots.html.includes(origin + "/sitemap.xml"));
  assert.ok(robots.html.includes("OAI-SearchBot"));
  const pairs = [["/", "/kz"], ...servicePages, ...corporatePages];
  const entries = [...sitemap.html.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    url: body.match(/<loc>([^<]+)<\/loc>/)?.[1],
    alternatives: [...body.matchAll(/<xhtml:link\b[^>]*>/g)].map(([tag]) => attributes(tag)),
  }));
  const expectedUrls = pairs.flatMap(([ruPath, kzPath]) => [origin + ruPath, origin + kzPath]);
  assert.equal(new Set(entries.map(entry => entry.url)).size, entries.length, "Sitemap URLs must be unique");
  assert.deepEqual(entries.map(entry => entry.url).sort(), expectedUrls.sort());
  for (const [ruPath, kzPath] of pairs) {
    for (const path of [ruPath, kzPath]) {
      const entry = entries.find(item => item.url === origin + path);
      assert.equal(entry.alternatives.length, 3, `Expected both language alternatives and x-default for ${path}`);
      assert.deepEqual(Object.fromEntries(entry.alternatives.map(link => [link.hreflang, link.href])), {
        "ru-KZ": origin + ruPath,
        "kk-KZ": origin + kzPath,
        "x-default": origin + ruPath,
      });
      assert.ok(entry.alternatives.every(link => link.rel === "alternate"));
    }
  }
  assert.doesNotMatch(sitemap.html, /\.example|your-domain/);
});


const servicePages = [
  ["/upravlenie-nedvizhimostyu", "/kz/zhylzhymaytyn-mulikti-basqaru", "Управление недвижимостью в Астане", "Астанада жылжымайтын мүлікті басқару"],
  ["/ekspluataciya-zdaniy", "/kz/gimaratty-paidalanu", "Эксплуатация зданий в Астане", "Астанада ғимараттарды пайдалану"],
  ["/inzhenernye-sistemy", "/kz/inzhenerlik-zhuyeler", "Инженерные системы здания", "Ғимараттың инженерлік жүйелері"],
  ["/upravlyayushchaya-kompaniya-dlya-osi", "/kz/mib-basqarushy-kompaniya", "Управление жилым комплексом для ОСИ", "МИБ үшін тұрғын үй кешенін басқару"],
  ["/upravlenie-zhilym-kompleksom", "/kz/turgyn-ui-keshenin-basqaru", "Управление жилым комплексом", "Тұрғын үй кешенін басқару"],
  ["/upravlenie-biznes-centrom", "/kz/biznes-ortalyk-basqaru", "Управление и эксплуатация бизнес-центра", "Бизнес-орталықты басқару және пайдалану"],
  ["/kommercheskaya-nedvizhimost", "/kz/kommerciyalyk-mulik", "Управление коммерческой недвижимостью", "Коммерциялық жылжымайтын мүлікті басқару"],
  ["/audit-zhk", "/kz/turgyn-ui-audit", "Бесплатный первичный аудит ЖК", "Тұрғын үй кешенінің тегін бастапқы аудиті"],
];

for (const [ruPath, kzPath, ruH1, kzH1] of servicePages) {
  for (const [path, language, h1, alternate] of [
    [ruPath, "ru", ruH1, kzPath],
    [kzPath, "kk", kzH1, ruPath],
  ]) {
    test(`${path}: dedicated service page is indexable, localized and structured`, async () => {
      const { response, html, visible } = await request(path);
      assert.equal(response.status, 200);
      assert.ok(html.includes(`<html lang="${language}"`));
      assert.equal((visible.match(/<h1\b/g) || []).length, 1);
      assert.ok(visible.includes(h1));
      assert.ok(visible.includes(`href="${alternate}"`));
      const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/);
      assert.equal(canonical?.[1], origin + path);
      assert.match(html, /hrefLang="ru-KZ"|hreflang="ru-KZ"/);
      assert.match(html, /hrefLang="kk-KZ"|hreflang="kk-KZ"/);
      const jsonBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
      const graph = jsonBlocks.flatMap(data => data["@graph"] || []);
      assert.ok(graph.find(item => item["@type"] === "Service"));
      assert.ok(graph.find(item => item["@type"] === "BreadcrumbList"));
      const faq = graph.find(item => item["@type"] === "FAQPage");
      assert.ok(faq?.mainEntity?.length >= 3);
      assert.ok(visible.includes('href="tel:+77012200112"'));
      assert.ok(visible.includes('href="mailto:info@aaaservice.kz"'));
    });
  }
}

for (const [ruPath, kzPath, ruH1, kzH1, pageType] of corporatePages) {
  for (const [path, language, h1, alternate] of [
    [ruPath, "ru", ruH1, kzPath],
    [kzPath, "kk", kzH1, ruPath],
  ]) {
    const home = language === "ru" ? "/" : "/kz";
    const street = language === "ru" ? "ул. А. Храпатого, 21, офис 41" : "А. Храпатый көшесі, 21, 41-кеңсе";

    test(`${path}: corporate page has one localized H1 and working contact links before JavaScript`, async () => {
      const { response, html, visible } = await request(path);
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /text\/html/);
      assert.ok(html.includes(`<html lang="${language}"`));
      const headings = [...visible.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
      assert.equal(headings.length, 1);
      assert.equal(headings[0][1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), h1);
      assert.ok(visible.includes(`href="${alternate}"`));
      assert.ok(visible.includes('href="tel:+77012200112"'));
      assert.ok(visible.includes('href="mailto:info@aaaservice.kz"'));
      assert.ok(visible.includes(`Астана, ${street}`));
      assert.doesNotMatch(visible, /your-domain|\.example/);

      const whatsappLinks = [...visible.matchAll(/href="(https:\/\/wa\.me\/[^\"]+)"/g)];
      assert.ok(whatsappLinks.length > 0);
      for (const [, href] of whatsappLinks) {
        const url = new URL(href.replaceAll("&amp;", "&"));
        assert.equal(url.pathname, "/77012200112");
        const message = url.searchParams.get("text");
        assert.ok(message && !message.includes("undefined"));
        assert.ok(message.includes(language === "ru" ? "Здравствуйте" : "Сәлеметсіз"));
      }
    });

    test(`${path}: corporate page is indexable with exact canonical and reciprocal language URLs`, async () => {
      const { response, visible } = await request(path);
      const links = [...visible.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag));
      const canonicals = links.filter(link => link.rel === "canonical");
      assert.deepEqual(canonicals.map(link => link.href), [origin + path]);
      const alternatives = links.filter(link => link.rel === "alternate" && link.hreflang);
      assert.equal(alternatives.length, 3);
      assert.deepEqual(Object.fromEntries(alternatives.map(link => [link.hreflang, link.href])), {
        "ru-KZ": origin + ruPath,
        "kk-KZ": origin + kzPath,
        "x-default": origin + ruPath,
      });
      const robots = [...visible.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag)).find(meta => meta.name === "robots");
      assert.ok(robots);
      const directives = robots.content.toLowerCase().split(/\s*,\s*/);
      assert.ok(directives.includes("index") && directives.includes("follow"));
      assert.doesNotMatch(robots.content, /noindex|nofollow|none/i);
      assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /noindex|nofollow|none/i);
    });

    test(`${path}: corporate JSON-LD describes the page, localized contacts and breadcrumbs`, async () => {
      const { html } = await request(path);
      const jsonBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
      assert.ok(jsonBlocks.length >= 2);
      assert.ok(jsonBlocks.every(data => data["@context"] === "https://schema.org"));
      const graph = jsonBlocks.flatMap(data => data["@graph"] || [data]);
      const pages = graph.filter(item => item["@id"] === origin + path + "#webpage");
      assert.equal(pages.length, 1);
      const page = pages[0];
      assert.equal(page["@type"], pageType);
      assert.equal(page.url, origin + path);
      assert.equal(page.inLanguage, language === "ru" ? "ru-KZ" : "kk-KZ");
      assert.ok(typeof page.name === "string" && page.name.length > 0);
      assert.ok(typeof page.description === "string" && page.description.length > 0);
      assert.equal(page.isPartOf?.["@id"], origin + "/#website");
      assert.equal(page.about?.["@id"], origin + "/#organization");

      const organization = graph.find(item => item["@id"] === page.about["@id"]);
      assert.ok(organization);
      assert.equal(organization["@type"], "Organization");
      assert.equal(organization.name, "AAA URBAN");
      assert.equal(organization.telephone, "+77012200112");
      assert.equal(organization.email, "info@aaaservice.kz");
      assert.equal(organization.address.addressLocality, "Астана");
      assert.equal(organization.address.streetAddress, street);
      assert.equal(organization.address.addressCountry, "KZ");
      assert.equal(organization.contactPoint.telephone, "+77012200112");
      assert.deepEqual(organization.contactPoint.availableLanguage, ["ru", "kk"]);
      assert.ok(graph.some(item => item["@type"] === "WebSite" && item["@id"] === page.isPartOf["@id"]));

      const breadcrumb = graph.find(item => item["@type"] === "BreadcrumbList" && item["@id"] === origin + path + "#breadcrumb");
      assert.ok(breadcrumb);
      assert.deepEqual(breadcrumb.itemListElement, [
        { "@type": "ListItem", position: 1, name: language === "ru" ? "Главная" : "Басты бет", item: origin + home },
        { "@type": "ListItem", position: 2, name: page.name, item: origin + path },
      ]);
    });
  }
}

test("home pages link into the primary service architecture and overview", async () => {
  for (const [path, expected] of [["/", [servicePages[0][0], servicePages[1][0], servicePages[2][0], servicePages[6][0], "/services"]], ["/kz", [servicePages[0][1], servicePages[1][1], servicePages[2][1], servicePages[6][1], "/kz/services"]]]) {
    const { visible } = await request(path);
    for (const servicePath of expected) {
      assert.ok(visible.includes(`href="${servicePath}"`), `Missing internal link to ${servicePath} on ${path}`);
    }
  }
});

test("retired D1 endpoint returns an error without requesting a database", async () => {
  const { response, html } = await request("/api/inquiries", { method: "POST", body: "invalid body" });
  assert.equal(response.status, 410);
  const result = JSON.parse(html);
  assert.ok(result.error);
  assert.equal(result.success, undefined);
});
