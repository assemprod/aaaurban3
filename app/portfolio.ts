/** Фото поместите в public/team, путь в данных начинается с /team/. */
export type Localized = { ru: string; kz: string };
export type TeamMember = {
  id: string;
  name: Localized;
  role: Localized;
  photo: string;
  position?: string; // Например, "50% 30%" — положение лица в кадре.
  published: boolean;
};

// Демонстрационное наполнение по утверждённому референсу. Замените фото, имена и должности
// на согласованные данные сотрудников перед публичным запуском.
export const teamMembers: TeamMember[] = [
  {
    id: "aidos-nurgaliev",
    name: { ru: "Айдос Нургалиев", kz: "Айдос Нұрғалиев" },
    role: { ru: "Генеральный директор", kz: "Бас директор" },
    photo: "/team/demo-01.webp",
    position: "50% 18%",
    published: true,
  },
  {
    id: "aliya-sultanova",
    name: { ru: "Алия Султанова", kz: "Әлия Сұлтанова" },
    role: { ru: "Коммерческий директор", kz: "Коммерциялық директор" },
    photo: "/team/demo-02.webp",
    position: "50% 18%",
    published: true,
  },
  {
    id: "marat-kasenov",
    name: { ru: "Марат Касенов", kz: "Марат Қасенов" },
    role: { ru: "Технический директор", kz: "Техникалық директор" },
    photo: "/team/demo-03.webp",
    position: "50% 18%",
    published: true,
  },
  {
    id: "dinara-ibrayeva",
    name: { ru: "Динара Ибраева", kz: "Динара Ибраева" },
    role: { ru: "Директор по развитию", kz: "Даму жөніндегі директор" },
    photo: "/team/demo-04.webp",
    position: "50% 18%",
    published: true,
  },
];

export type CaseStudy = {
  id: string;
  category: "corporate" | "residential";
  title: Localized;
  scope: Localized;
  period: string;
  attribution: "group" | "urban";
  logo?: string;
  photo?: string;
  published: boolean;
};

// Добавляйте подтверждённые кейсы ЖК с category: "residential".
// Не публикуйте адреса, фото и результаты без согласования с заказчиком.
export const caseStudies: CaseStudy[] = [
  {
    id: "kazatomprom", category: "corporate", published: true, attribution: "group",
    title: { ru: "Казатомпром", kz: "Қазатомөнеркәсіп" }, period: "2018",
    scope: { ru: "Комплексное обслуживание головного офиса", kz: "Бас кеңсеге кешенді қызмет көрсету" },
    logo: "/clients/kazatomprom.png",
  },
  {
    id: "samruk", category: "corporate", published: true, attribution: "group",
    title: { ru: "Самрук-Казына", kz: "Самұрық-Қазына" }, period: "2020",
    scope: { ru: "Работа с противопожарными системами головного офиса", kz: "Бас кеңсенің өртке қарсы жүйелерімен жұмыс" },
    logo: "/clients/samruk.png",
  },
  {
    id: "haileybury", category: "corporate", published: true, attribution: "group",
    title: { ru: "Haileybury Astana", kz: "Haileybury Astana" }, period: "2011",
    scope: { ru: "Комплексное обслуживание объекта", kz: "Нысанға кешенді қызмет көрсету" },
    logo: "/clients/haileybury.png",
  },
];
