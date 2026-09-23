# Изображения и источники данных

`public/brand-logo.jpeg`, `public/favicon.svg` и `public/architecture.webp` сохранены из существующего проекта. Архитектурное изображение — иллюстрация, не фотография подтверждённого кейса.

Иллюстративные фото направлений и типов недвижимости размещены локально в `public/media/`:

| Файл | Источник |
| --- | --- |
| engineering.webp | https://images.unsplash.com/photo-1581092918056-0c4c3acd3789 |
| management.webp | https://images.unsplash.com/photo-1556761175-5973dc0f32e7 |
| security.webp | https://images.unsplash.com/photo-1557597774-9d273605dfa9 |
| business.webp | https://images.unsplash.com/photo-1486406146926-c627a92ad1ab |
| hotel.webp | https://images.unsplash.com/photo-1564501049412-61c2a3083791 |
| retail.webp | https://images.unsplash.com/photo-1519567241046-7f570eee3ce6 |
| residence.webp | https://images.unsplash.com/photo-1600607687920-4e2a09cf159d |
| warehouse.webp | https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d |

`public/media/company-visual.webp` — оптимизированный WebP из ранее предоставленного заказчиком визуального референса. Он сохранён как брендовый исходник и сейчас не используется как фотография сотрудников.

## Команда

Единственный источник карточек сотрудников на главной, `/about` и `/kz/about` — опубликованные записи `teamMembers` из `app/portfolio.ts`, у которых заполнено поле `photo`. Сейчас массив пуст, поэтому карточки сотрудников не выводятся, а вместо них показывается нейтральная иллюстрация `public/media/management.webp` без имён.

Реальные фотографии следует хранить в `public/team/` и указывать в данных как `/team/<имя-файла>.webp`. Для каждого сотрудника нужны подтверждённые имя и должность на русском и казахском языках; `position` регулирует кадрирование, `published` управляет публикацией.

`public/team/demo-01.webp` … `demo-04.webp` — устаревшие предпросмотровые ресурсы из макета. Текущий сайт их не использует. Эти файлы не считаются фотографиями реальных сотрудников и не должны назначаться в `teamMembers`.

Фотографии команды и будущих кейсов ЖК для финальной версии предоставляет заказчик.

## Объекты и логотипы

Каталоги `/objects` и `/kz/objects` строятся только по опубликованным элементам `caseStudies` из `app/portfolio.ts`. Сейчас подтверждены:

| Запись | Логотип | Период | Назначение |
| --- | --- | --- | --- |
| Haileybury Astana | `public/clients/haileybury.png` | 2011 | Комплексное обслуживание объекта |
| Казатомпром | `public/clients/kazatomprom.png` | 2018 | Комплексное обслуживание головного офиса |
| Самрук-Казына | `public/clients/samruk.png` | 2020 | Работа с противопожарными системами головного офиса |

Поле `photo` у кейса необязательно. Если собственного согласованного фото нет, интерфейс показывает нейтральную фирменную поверхность, а не изображение другого здания. Название, период, описание и логотип берутся только из `caseStudies`.

Цветные логотипы клиентов, без перекрашивания:

- Казатомпром: https://appak.kazatomprom.kz/sites/default/files/logo2_0.png
- Самрук-Казына: https://filearchive.cnews.ru/img/book/2022/06/20/1920px-samruk_kazyna_logo.png
- Haileybury Astana: https://hbastana.files.wordpress.com/2016/09/astana_blue_big-copy.png

Логотипы размещены в разделе опыта группы и в карточках подтверждённых кейсов. Перед финальной публичной публикацией замените их предоставленными заказчиком оригиналами по тем же путям в `public/clients/`.

## Использование на новых страницах

- `/about` и `/kz/about`: `architecture.webp`, локальные иллюстрации истории, `management.webp` либо реальные фото из `teamMembers`.
- `/services` и `/kz/services`: изображения направлений из `public/media/`; это иллюстрации типов работ и недвижимости.
- `/objects` и `/kz/objects`: данные только из `caseStudies`, логотипы из `public/clients/`, согласованное `photo` либо иллюстративный fallback.
- `/contacts` и `/kz/contacts`: `media/residence.webp` в hero, `architecture.webp` в карточке офиса и карта, сформированная по адресу из `site-settings.ts`.
