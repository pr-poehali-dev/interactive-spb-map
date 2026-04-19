import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Границы Санкт-Петербурга ─────────────────────────────────────────────
const SPB_BOUNDS = L.latLngBounds(
  L.latLng(59.644, 29.70),   // юго-запад
  L.latLng(60.245, 30.85)    // северо-восток
);
const SPB_CENTER: [number, number] = [59.939, 30.316];

// ─── Категории ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",     label: "Все",       icon: "🗺️" },
  { id: "history", label: "История",   icon: "🏛️" },
  { id: "art",     label: "Искусство", icon: "🎨" },
  { id: "nature",  label: "Природа",   icon: "🌿" },
  { id: "cult",    label: "Культура",  icon: "🎭" },
  { id: "church",  label: "Храмы",     icon: "⛪" },
];

const CATEGORY_COLORS: Record<string, string> = {
  history: "#a78bfa",
  art:     "#f97316",
  nature:  "#22c55e",
  cult:    "#38bdf8",
  church:  "#f0e020",
};

interface Place {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  desc: string;
  address: string;
  visits: number; // посещаемость в тыс. чел/год
}

// 50 малопосещаемых мест Санкт-Петербурга
const PLACES: Place[] = [
  // ул. Куйбышева, 2/4 — особняк Кшесинской, у Петропавловской крепости
  { id:1,  name:"Музей политической истории России",       category:"history", lat:59.9540, lng:30.3268, desc:"Особняк Кшесинской, история политических событий XX века.", address:"ул. Куйбышева, 2/4", visits:18 },
  // Итальянская ул., 25 — рядом с Михайловским театром
  { id:2,  name:"Музей гигиены",                           category:"history", lat:59.9361, lng:30.3324, desc:"Необычный музей о санитарии и здоровье, основан в 1919 году.", address:"Итальянская ул., 25", visits:12 },
  // Съезжинская ул., 3 — Петроградская сторона
  { id:3,  name:"Музей «Разночинный Петербург»",           category:"history", lat:59.9579, lng:30.3070, desc:"Быт жителей Нарвской заставы конца XIX — начала XX века.", address:"Съезжинская ул., 3", visits:8 },
  // ул. Марата, 24А — между Невским и Лиговским
  { id:4,  name:"Музей Арктики и Антарктики",              category:"history", lat:59.9268, lng:30.3551, desc:"Уникальная коллекция полярных экспедиций и исследований.", address:"ул. Марата, 24А", visits:22 },
  // Библиотечный пер., 4 — рядом с Балтийским вокзалом
  { id:5,  name:"Музей железных дорог России",             category:"history", lat:59.9069, lng:30.3000, desc:"Крупнейшая экспозиция подвижного состава, паровозы и вагоны.", address:"Библиотечный пер., 4", visits:25 },
  // шоссе Революции, 84 — Невский район
  { id:6,  name:"Музей «Невская застава»",                 category:"history", lat:59.8971, lng:30.4469, desc:"История рабочего движения Петербурга, предметы быта рабочих.", address:"шоссе Революции, 84", visits:5 },
  // ул. Декабристов, 57 — Коломна
  { id:7,  name:"Музей-квартира Блока",                    category:"art",     lat:59.9221, lng:30.2906, desc:"Квартира, где поэт Александр Блок прожил последние годы.", address:"ул. Декабристов, 57", visits:14 },
  // Литейный пр., 36 — центр
  { id:8,  name:"Музей-квартира Некрасова",                category:"art",     lat:59.9393, lng:30.3498, desc:"Мемориальный музей в квартире поэта Николая Некрасова.", address:"Литейный пр., 36", visits:11 },
  // наб. р. Фонтанки, 34 — Фонтанный дом
  { id:9,  name:"Музей-квартира Ахматовой в Фонтанном доме", category:"art",  lat:59.9355, lng:30.3453, desc:"Знаменитый «Фонтанный дом» — квартира Анны Ахматовой.", address:"наб. р. Фонтанки, 34", visits:20 },
  // наб. р. Фонтанки, 118 — южнее центра
  { id:10, name:"Музей Державина",                         category:"art",     lat:59.9207, lng:30.3073, desc:"Усадьба поэта Гавриила Державина с восстановленными интерьерами.", address:"наб. р. Фонтанки, 118", visits:9 },
  // ул. Профессора Попова, 23 — Петроградская сторона
  { id:11, name:"Музей истории фотографии",                category:"art",     lat:59.9700, lng:30.3186, desc:"История фотографии в России с XIX века до наших дней.", address:"ул. Профессора Попова, 23", visits:7 },
  // ул. Профессора Попова, 10 — Петроградская сторона
  { id:12, name:"Музей петербургского авангарда",          category:"art",     lat:59.9692, lng:30.3143, desc:"Дом Матюшина — центр художественного авангарда 1920-х.", address:"ул. Профессора Попова, 10", visits:6 },
  // Шпалерная ул., 56 — водонапорная башня у Таврического сада
  { id:13, name:"Музей «Вселенная воды»",                  category:"history", lat:59.9465, lng:30.3776, desc:"Интерактивный музей в историческом водонапорном башне.", address:"Шпалерная ул., 56", visits:30 },
  // Александровский парк, 4 — Петроградская сторона
  { id:14, name:"Планетарий №1",                           category:"cult",    lat:59.9545, lng:30.3182, desc:"Исторический планетарий в Александровском парке.", address:"Александровский парк, 4", visits:28 },
  // Петропавловская крепость — Заячий остров
  { id:15, name:"Музей восковых фигур",                    category:"cult",    lat:59.9500, lng:30.3161, desc:"Восковые копии исторических и современных знаменитостей.", address:"Петропавловская крепость", visits:15 },
  // 29-я линия В.О., 2 — Васильевский остров
  { id:16, name:"Музей современного искусства Эрарта",     category:"art",     lat:59.9311, lng:30.2487, desc:"Крупнейший частный музей современного искусства в России.", address:"29-я линия В.О., 2", visits:35 },
  // шоссе Революции, 84Е — Невский район (рядом с №6)
  { id:17, name:"Музей стрит-арта",                        category:"art",     lat:59.8979, lng:30.4490, desc:"Уникальный музей в действующем промышленном здании.", address:"шоссе Революции, 84Е", visits:18 },
  // Конюшенная пл., 2В — рядом с Эрмитажем
  { id:18, name:"Музей советских игровых автоматов",       category:"cult",    lat:59.9416, lng:30.3229, desc:"Коллекция советских аркадных автоматов 1970–80-х годов.", address:"Конюшенная пл., 2В", visits:22 },
  // наб. р. Фонтанки, 3 — цирк у Михайловского замка
  { id:19, name:"Музей циркового искусства",               category:"cult",    lat:59.9393, lng:30.3408, desc:"История российского цирка, уникальные афиши и реквизит.", address:"наб. р. Фонтанки, 3", visits:10 },
  // Шпалерная ул., 60 — рядом с Таврическим садом
  { id:20, name:"Музей истории телефона",                  category:"history", lat:59.9469, lng:30.3800, desc:"Коллекция телефонных аппаратов с 1880-х по наши дни.", address:"Шпалерная ул., 60", visits:5 },
  // Дворцовая наб., 30 — у Эрмитажа
  { id:21, name:"Музей оловянного солдатика",              category:"hist",    lat:59.9430, lng:30.3159, desc:"Более 30 000 оловянных фигурок — солдаты всех эпох.", address:"Дворцовая наб., 30", visits:8 },
  // наб. р. Мойки, 32 — центр
  { id:22, name:"Музей печати",                            category:"history", lat:59.9425, lng:30.3168, desc:"История российской журналистики и печатного дела.", address:"наб. р. Мойки, 32", visits:6 },
  // Камская ул., 8 — Васильевский остров
  { id:23, name:"Музей кукол",                             category:"cult",    lat:59.9362, lng:30.2716, desc:"Коллекция кукол со всего мира, куклы русских мастеров.", address:"Камская ул., 8", visits:12 },
  // ул. Профессора Попова, 2 — Ботанический сад
  { id:24, name:"Ботанический сад ПетрГУ (филиал)",        category:"nature",  lat:59.9707, lng:30.3153, desc:"Оранжереи с тропическими растениями и учебные коллекции.", address:"ул. Профессора Попова, 2", visits:20 },
  // Елагин остров — северная часть
  { id:25, name:"Елагин остров (Северная часть)",          category:"nature",  lat:59.9826, lng:30.2575, desc:"Малолюдная северная оконечность острова с дикой природой.", address:"Елагин остров, север", visits:15 },
  // Торжковская ул., 11 — Удельный парк, Выборгский район
  { id:26, name:"Удельный парк",                           category:"nature",  lat:60.0136, lng:30.3195, desc:"Старинный лесной парк в Выборгском районе, тихое место.", address:"Торжковская ул., 11", visits:18 },
  // Институтский пер., 5 — Лесотехническая академия
  { id:27, name:"Парк Лесотехнической академии",           category:"nature",  lat:59.9997, lng:30.3413, desc:"Дендрарий с редкими породами деревьев, научная ценность.", address:"Институтский пер., 5", visits:10 },
  // ул. Жака Дюкло, 1 — Сосновка, Выборгский район
  { id:28, name:"Парк «Сосновка»",                         category:"nature",  lat:60.0143, lng:30.3629, desc:"Огромный лесной массив, любимый местными жителями.", address:"ул. Жака Дюкло, 1", visits:30 },
  // Бестужевская ул., 4 — Богословское кладбище
  { id:29, name:"Богословское кладбище",                   category:"history", lat:59.9964, lng:30.3902, desc:"Историческое некрополь со старинными надгробиями XIX века.", address:"Бестужевская ул., 4", visits:4 },
  // Зеленогорск, Гаванная ул., 4
  { id:30, name:"Церковь Казанской иконы БМ (Зеленогорск)", category:"church", lat:60.1930, lng:29.6988, desc:"Деревянная церковь начала XX века в Зеленогорске.", address:"г. Зеленогорск, Гаванная ул., 4", visits:3 },
  // пр. Ветеранов, 159 — Лигово
  { id:31, name:"Церковь Покрова Пресвятой Богородицы",    category:"church",  lat:59.8504, lng:30.1854, desc:"Небольшая православная церковь в Лигово, XVII–XIX вв.", address:"пр. Ветеранов, 159", visits:6 },
  // Шуваловский парк, Парголово
  { id:32, name:"Церковь Святых Апостолов Петра и Павла в Шуваловском парке", category:"church", lat:60.0614, lng:30.2618, desc:"Романтическая церковь на острове в Шуваловском парке.", address:"Парголово, Выборгское шоссе, 106", visits:9 },
  // Приморский пр., 91 — Дацан, Старая Деревня
  { id:33, name:"Буддийский храм «Дацан Гунзэчойнэй»",    category:"church",  lat:59.9808, lng:30.2628, desc:"Первый в Европе буддийский храм, основан в 1909 году.", address:"Приморский пр., 91", visits:25 },
  // Михайловская ул., 2 — рядом с Невским
  { id:34, name:"Музей хлеба",                             category:"history", lat:59.9363, lng:30.3298, desc:"История хлебопечения от древности до наших дней.", address:"Михайловская ул., 2", visits:8 },
  // Почтамтская ул., 7 — центр, рядом с Исаакием
  { id:35, name:"Музей связи им. Попова",                  category:"history", lat:59.9303, lng:30.3055, desc:"Коллекция средств связи, старейший музей связи в России.", address:"Почтамтская ул., 7", visits:12 },
  // Большая Морская ул., 47 — центр
  { id:36, name:"Дом-музей Набокова",                      category:"art",     lat:59.9339, lng:30.3096, desc:"Дом детства Владимира Набокова на Большой Морской улице.", address:"Большая Морская ул., 47", visits:11 },
  // наб. р. Мойки, 12 — рядом с Дворцовой площадью
  { id:37, name:"Музей-квартира Пушкина",                  category:"art",     lat:59.9403, lng:30.3147, desc:"Квартира, где Александр Пушкин провёл последние месяцы.", address:"наб. р. Мойки, 12", visits:40 },
  // Соляной пер., 9 — Соляной городок
  { id:38, name:"Музей обороны и блокады Ленинграда",      category:"history", lat:59.9437, lng:30.3452, desc:"Документы и экспонаты о блокаде 1941–1944 годов.", address:"Соляной пер., 9", visits:32 },
  // Почтамтская ул., 14/5 — рядом с Исаакием
  { id:39, name:"Музей истории религии",                   category:"church",  lat:59.9299, lng:30.3031, desc:"Крупнейший в России музей, посвящённый мировым религиям.", address:"Почтамтская ул., 14/5", visits:20 },
  // наб. р. Монастырки, 1 — Александро-Невская лавра
  { id:40, name:"Музей городской скульптуры (некрополи)",  category:"history", lat:59.9197, lng:30.3876, desc:"Уникальные некрополи Александро-Невской лавры, надгробная скульптура.", address:"наб. р. Монастырки, 1", visits:28 },
  // наб. р. Фонтанки, 115 — Лендок, юг Фонтанки
  { id:41, name:"Открытая киностудия «Лендок»",            category:"cult",    lat:59.9151, lng:30.3237, desc:"Исторические кинопавильоны, открытые для посетителей.", address:"наб. р. Фонтанки, 115", visits:14 },
  // ул. Итальянская, 27 — Дом Радио, рядом с Михайловским театром
  { id:42, name:"Дом Радио (исторический корпус)",         category:"cult",    lat:59.9358, lng:30.3313, desc:"Легендарный «Дом Радио» с историческими студиями.", address:"ул. Итальянская, 27", visits:7 },
  // наб. Лейтенанта Шмидта — подводная лодка у В.О.
  { id:43, name:"Музей «Подводная лодка С-189»",           category:"history", lat:59.9278, lng:30.2400, desc:"Реальная боевая подводная лодка, превращённая в музей.", address:"наб. Лейтенанта Шмидта", visits:22 },
  // Кронштадт, Якорная пл.
  { id:44, name:"Кронштадтский собор (Морской)",           category:"church",  lat:59.9916, lng:29.7742, desc:"Грандиозный Морской собор в Кронштадте в византийском стиле.", address:"г. Кронштадт, Якорная пл.", visits:30 },
  // Кронштадт, Кронштадтское шоссе — форт на западе
  { id:45, name:"Форт «Константин» (Кронштадт)",           category:"history", lat:59.9987, lng:29.6501, desc:"Исторический форт на острове, уникальная архитектура XIX века.", address:"г. Кронштадт, Кронштадтское шоссе", visits:12 },
  // Александровский парк, 7 — Петроградская сторона
  { id:46, name:"Музей «Россия в Великой войне»",          category:"history", lat:59.9543, lng:30.3188, desc:"Документы и артефакты Первой мировой войны.", address:"Александровский парк, 7", visits:5 },
  // Стрельна, Санкт-Петербургское ш., 109
  { id:47, name:"Дворец Петра II (Стрельна)",              category:"history", lat:59.8526, lng:30.0303, desc:"Петровский дворец в Стрельне, архитектурный памятник.", address:"г. Стрельна, Санкт-Петербургское ш., 109", visits:8 },
  // Каменный остров — церковь-ротонда
  { id:48, name:"Церковь Рождества Иоанна Предтечи",       category:"church",  lat:59.9737, lng:30.2965, desc:"Редкая купольная ротонда XVIII века на Каменном острове.", address:"Каменный остров, 1", visits:6 },
  // Стрельна, парк Новознаменка
  { id:49, name:"Парк «Новознаменка»",                     category:"nature",  lat:59.8502, lng:30.0520, desc:"Тихий исторический парк в Стрельне с прудами.", address:"Стрельна, Санкт-Петербургское ш., 111", visits:4 },
  // наб. Адмиралтейского канала, 2 — у Новой Голландии
  { id:50, name:"Музей мостов Санкт-Петербурга",           category:"history", lat:59.9253, lng:30.2885, desc:"История мостостроения Петербурга, макеты и чертежи.", address:"наб. Адмиралтейского канала, 2", visits:5 },
];

// ─── Линии метро СПб ──────────────────────────────────────────────────────
// Цвета линий
const METRO_LINE_COLORS: Record<string, string> = {
  "1": "#e8483e",   // Кировско-Выборгская — красная
  "2": "#2c6db5",   // Московско-Петроградская — синяя
  "3": "#1db452",   // Невско-Василеостровская — зелёная
  "4": "#f47216",   // Правобережная — оранжевая
  "5": "#9659a3",   // Фрунзенско-Приморская — фиолетовая
};

interface MetroStation {
  id: string;
  name: string;
  line: string;
  lat: number;
  lng: number;
  transfers?: string[]; // id других станций на пересадке
}

// Координаты станций метро СПб (схема 2026)
// Пересадочные узлы: Невский пр / Гостиный двор / Адмиралтейская (сдвинуты по lng для видимости)
// Сенная / Садовая / Спасская
// Технологический институт 1/2
// Площадь Восстания / Маяковская
// Владимирская / Достоевская
// Пушкинская / Звенигородская
// Пл. Александра Невского 1/2
const METRO_STATIONS: MetroStation[] = [
  // ── Линия 1 — Кировско-Выборгская (красная) ──────────────────────────────
  { id:"dev",      name:"Девяткино",                      line:"1", lat:60.0505, lng:30.4425 },
  { id:"grazh",    name:"Гражданский проспект",           line:"1", lat:60.0101, lng:30.4179 },
  { id:"akad",     name:"Академическая",                  line:"1", lat:60.0002, lng:30.4040 },
  { id:"polit",    name:"Политехническая",                line:"1", lat:59.9878, lng:30.3718 },
  { id:"plmuzh",   name:"Площадь Мужества",               line:"1", lat:59.9739, lng:30.3598 },
  { id:"les",      name:"Лесная",                         line:"1", lat:59.9660, lng:30.3560 },
  { id:"vyb",      name:"Выборгская",                     line:"1", lat:59.9610, lng:30.3558 },
  { id:"plleni",   name:"Площадь Ленина",                 line:"1", lat:59.9563, lng:30.3557 },
  { id:"che",      name:"Чернышевская",                   line:"1", lat:59.9459, lng:30.3597 },
  // Пересадка: Площадь Восстания (Л1) ↔ Маяковская (Л3)
  { id:"plvos",    name:"Площадь Восстания",              line:"1", lat:59.9313, lng:30.3602, transfers:["mayak"] },
  { id:"vlad",     name:"Владимирская",                   line:"1", lat:59.9261, lng:30.3484, transfers:["dos"] },
  { id:"pusk",     name:"Пушкинская",                     line:"1", lat:59.9218, lng:30.3471, transfers:["zveni"] },
  { id:"tehinst",  name:"Технологический институт 1",     line:"1", lat:59.9165, lng:30.3192, transfers:["tehinst2"] },
  { id:"balt",     name:"Балтийская",                     line:"1", lat:59.9075, lng:30.3017 },
  { id:"nar",      name:"Нарвская",                       line:"1", lat:59.8988, lng:30.2737 },
  { id:"kzav",     name:"Кировский завод",                line:"1", lat:59.8862, lng:30.2525 },
  { id:"putilv",   name:"Путиловская",                    line:"1", lat:59.8770, lng:30.2460 },
  { id:"aut",      name:"Автово",                         line:"1", lat:59.8714, lng:30.2616 },
  { id:"lenpr",    name:"Ленинский проспект",             line:"1", lat:59.8582, lng:30.2661 },
  { id:"pvet",     name:"Проспект Ветеранов",             line:"1", lat:59.8479, lng:30.2516 },
  { id:"yuzap",    name:"Юго-Западная",                   line:"1", lat:59.8367, lng:30.2281 },

  // ── Линия 2 — Московско-Петроградская (синяя) ────────────────────────────
  { id:"par",      name:"Парнас",                         line:"2", lat:60.0667, lng:30.3232 },
  { id:"prpr",     name:"Проспект Просвещения",           line:"2", lat:60.0504, lng:30.3234 },
  { id:"ozer",     name:"Озерки",                         line:"2", lat:60.0379, lng:30.3222 },
  { id:"udel",     name:"Удельная",                       line:"2", lat:60.0178, lng:30.3127 },
  { id:"pion",     name:"Пионерская",                     line:"2", lat:60.0043, lng:30.2985 },
  { id:"chre",     name:"Чёрная речка",                   line:"2", lat:59.9892, lng:30.2957 },
  { id:"petro",    name:"Петроградская",                  line:"2", lat:59.9661, lng:30.3109 },
  { id:"gor",      name:"Горьковская",                    line:"2", lat:59.9551, lng:30.3203 },
  // Пересадочный узел: Невский пр (Л2) / Гостиный двор (Л2) ↔ Садовая/Спасская (Л4,5)
  { id:"nevpr",    name:"Невский проспект",               line:"2", lat:59.9355, lng:30.3272, transfers:["gostdv","sad","spask"] },
  { id:"gostdv",   name:"Гостиный двор",                  line:"2", lat:59.9334, lng:30.3300, transfers:["nevpr","sad","spask"] },
  { id:"senn",     name:"Сенная площадь",                 line:"2", lat:59.9267, lng:30.3210, transfers:["sad","spask"] },
  { id:"tehinst2", name:"Технологический институт 2",     line:"2", lat:59.9155, lng:30.3192, transfers:["tehinst"] },
  { id:"frunz",    name:"Фрунзенская",                    line:"2", lat:59.9087, lng:30.3271 },
  { id:"mvor",     name:"Московские ворота",              line:"2", lat:59.8994, lng:30.3257 },
  { id:"elektr",   name:"Электросила",                    line:"2", lat:59.8901, lng:30.3282 },
  { id:"ppob",     name:"Парк Победы",                    line:"2", lat:59.8797, lng:30.3281 },
  { id:"mos",      name:"Московская",                     line:"2", lat:59.8693, lng:30.3236 },
  { id:"zvez",     name:"Звёздная",                       line:"2", lat:59.8575, lng:30.3455 },
  { id:"kupc",     name:"Купчино",                        line:"2", lat:59.8416, lng:30.3807 },

  // ── Линия 3 — Невско-Василеостровская (зелёная) ──────────────────────────
  { id:"beg",      name:"Беговая",                        line:"3", lat:59.9802, lng:30.2140 },
  { id:"zenit",    name:"Зенит",                          line:"3", lat:59.9714, lng:30.2309 },
  { id:"primorsk", name:"Приморская",                     line:"3", lat:59.9500, lng:30.2202 },
  { id:"vasil",    name:"Василеостровская",               line:"3", lat:59.9435, lng:30.2744 },
  { id:"admir",    name:"Адмиралтейская",                 line:"3", lat:59.9360, lng:30.3146 },
  { id:"admir5",   name:"Адмиралтейская",                 line:"5", lat:59.9360, lng:30.3146 },
  // Пересадка: Маяковская (Л3) ↔ Площадь Восстания (Л1)
  { id:"mayak",    name:"Маяковская",                     line:"3", lat:59.9316, lng:30.3568, transfers:["plvos"] },
  // Пересадка: Пл.Александра Невского 1 (Л3) ↔ Пл.Александра Невского 2 (Л4)
  { id:"plaleks1", name:"Пл. Александра Невского 1",      line:"3", lat:59.9237, lng:30.3834, transfers:["plaleks2"] },
  { id:"elis",     name:"Елизаровская",                   line:"3", lat:59.9028, lng:30.4292 },
  { id:"lom",      name:"Ломоносовская",                  line:"3", lat:59.8960, lng:30.4404 },
  { id:"prolet",   name:"Пролетарская",                   line:"3", lat:59.8858, lng:30.4698 },
  { id:"obukhov",  name:"Обухово",                        line:"3", lat:59.8702, lng:30.4637 },
  { id:"ryb",      name:"Рыбацкое",                       line:"3", lat:59.8310, lng:30.5072 },

  // ── Линия 4 — Правобережная (оранжевая) ──────────────────────────────────
  { id:"gorninst", name:"Горный институт",                line:"4", lat:59.9310, lng:30.2787 },
  // Пересадка: Спасская (Л4) ↔ Садовая (Л5) ↔ Сенная (Л2) ↔ Невский/Гостиный (Л2)
  { id:"spask",    name:"Спасская",                       line:"4", lat:59.9258, lng:30.3224, transfers:["senn","sad","gostdv","nevpr"] },
  // Пересадка: Достоевская (Л4) ↔ Владимирская (Л1)
  { id:"dos",      name:"Достоевская",                    line:"4", lat:59.9267, lng:30.3438, transfers:["vlad"] },
  { id:"ligpr",    name:"Лиговский проспект",             line:"4", lat:59.9200, lng:30.3547 },
  { id:"plaleks2", name:"Пл. Александра Невского 2",      line:"4", lat:59.9250, lng:30.3850, transfers:["plaleks1"] },
  { id:"novoch",   name:"Новочеркасская",                 line:"4", lat:59.9299, lng:30.4094 },
  { id:"ladozh",   name:"Ладожская",                      line:"4", lat:59.9326, lng:30.4393 },
  { id:"prbol",    name:"Проспект Большевиков",           line:"4", lat:59.9210, lng:30.4723 },
  { id:"udyb",     name:"Улица Дыбенко",                  line:"4", lat:59.9143, lng:30.4917 },

  // ── Линия 5 — Фрунзенско-Приморская (фиолетовая) ─────────────────────────
  { id:"komp",     name:"Комендантский проспект",         line:"5", lat:60.0024, lng:30.2587 },
  { id:"stardv",   name:"Старая Деревня",                 line:"5", lat:59.9905, lng:30.2550 },
  { id:"krest",    name:"Крестовский остров",             line:"5", lat:59.9723, lng:30.2687 },
  { id:"chkal",    name:"Чкаловская",                     line:"5", lat:59.9610, lng:30.2886 },
  { id:"sport",    name:"Спортивная",                     line:"5", lat:59.9523, lng:30.2888 },
  // Пересадка: Садовая (Л5) ↔ Сенная (Л2) ↔ Спасская (Л4)
  { id:"sad",      name:"Садовая",                        line:"5", lat:59.9267, lng:30.3180, transfers:["senn","spask","nevpr","gostdv"] },
  // Пересадка: Звенигородская (Л5) ↔ Пушкинская (Л1)
  { id:"zveni",    name:"Звенигородская",                 line:"5", lat:59.9191, lng:30.3352, transfers:["pusk"] },
  { id:"obv",      name:"Обводный канал",                 line:"5", lat:59.9124, lng:30.3572 },
  { id:"volkov",   name:"Волковская",                     line:"5", lat:59.8983, lng:30.3806 },
  { id:"bukhar",   name:"Бухарестская",                   line:"5", lat:59.8880, lng:30.3798 },
  { id:"mezhn",    name:"Международная",                  line:"5", lat:59.8783, lng:30.3806 },
  { id:"prslav",   name:"Проспект Славы",                 line:"5", lat:59.8671, lng:30.4080 },
  { id:"dunaj",    name:"Дунайская",                      line:"5", lat:59.8559, lng:30.4056 },
  { id:"shush",    name:"Шушары",                         line:"5", lat:59.8263, lng:30.4190 },
];

// Порядок станций для каждой линии (для рисования путей)
const METRO_LINE_ORDER: Record<string, string[]> = {
  // Линия 1 (красная): Девяткино → Юго-Западная
  "1": ["dev","grazh","akad","polit","plmuzh","les","vyb","plleni","che","plvos","vlad","pusk","tehinst","balt","nar","kzav","putilv","aut","lenpr","pvet","yuzap"],
  // Линия 2 (синяя): Парнас → Купчино
  "2": ["par","prpr","ozer","udel","pion","chre","petro","gor","nevpr","gostdv","senn","tehinst2","frunz","mvor","elektr","ppob","mos","zvez","kupc"],
  // Линия 3 (зелёная): Беговая → Рыбацкое (через Адмиралтейскую, Невский/Гостиный, Маяковскую)
  "3": ["beg","zenit","primorsk","vasil","admir","nevpr","gostdv","mayak","plaleks1","elis","lom","prolet","obukhov","ryb"],
  // Линия 4 (оранжевая): Горный институт → Улица Дыбенко
  "4": ["gorninst","spask","dos","ligpr","plaleks2","novoch","ladozh","prbol","udyb"],
  // Линия 5 (фиолетовая): Комендантский проспект → Шушары (через Адмиралтейскую, Садовую)
  "5": ["komp","stardv","krest","chkal","sport","admir5","sad","zveni","obv","volkov","bukhar","mezhn","prslav","dunaj","shush"],
};

// ─── Маршруты ─────────────────────────────────────────────────────────────
interface Route {
  id: number;
  name: string;
  desc: string;
  color: string;
  places: number[]; // id мест из PLACES
  duration: string;
  distance: string;
}

const ROUTES: Route[] = [
  {
    id: 1,
    name: "Тайны петербургских вод",
    desc: "Малоизвестные музеи у воды — от подводной лодки до истории мостов",
    color: "#38bdf8",
    places: [43, 50, 35, 13],
    duration: "3–4 часа",
    distance: "~5 км",
  },
  {
    id: 2,
    name: "Литературный Петербург",
    desc: "Квартиры и дома писателей, поэтов и их малоизвестные адреса",
    color: "#a78bfa",
    places: [7, 8, 9, 10, 36, 37],
    duration: "4–5 часов",
    distance: "~6 км",
  },
  {
    id: 3,
    name: "Промышленный авангард",
    desc: "Уличное искусство, авангардные музеи и история рабочего Петербурга",
    color: "#f97316",
    places: [17, 12, 3, 6],
    duration: "5–6 часов",
    distance: "~12 км",
  },
  {
    id: 4,
    name: "Духовный Петербург",
    desc: "Нетуристические храмы и религиозные памятники города",
    color: "#f0e020",
    places: [31, 33, 39, 48, 32],
    duration: "4–5 часов",
    distance: "~15 км",
  },
  {
    id: 5,
    name: "Зелёный побег",
    desc: "Скрытые парки и природные уголки за пределами туристических троп",
    color: "#22c55e",
    places: [24, 25, 26, 27, 28, 49],
    duration: "6–7 часов",
    distance: "~20 км",
  },
];

function createColoredIcon(category: string, isHighlighted = false) {
  const color = CATEGORY_COLORS[category] || "#ffffff";
  const size = isHighlighted ? 36 : 28;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:${isHighlighted ? "3px solid #fff" : "2px solid rgba(0,0,0,0.6)"};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px ${isHighlighted ? "12px" : "6px"} rgba(0,0,0,0.5);
      transition:all .2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size - 4],
  });
}

// ─── Компонент карты метро (SVG overlay) ──────────────────────────────────
interface MetroMapModalProps {
  onClose: () => void;
}

function MetroMapModal({ onClose }: MetroMapModalProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-[#1a1a2e] rounded-lg shadow-2xl max-w-5xl w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚇</span>
            <div>
              <h2 className="font-bold text-white text-lg leading-none">Схема метро</h2>
              <p className="text-white/40 text-xs mt-0.5">Санкт-Петербург</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none transition-colors">×</button>
        </div>
        <div className="p-2 overflow-auto max-h-[80vh]">
          <img
            src="https://cdn.poehali.dev/projects/8158b767-5bd7-4a0f-b803-9274fb9efd92/bucket/75ba4c17-2523-4023-a422-24ccf6f5aa00.jpg"
            alt="Схема метро Санкт-Петербурга 2026"
            className="w-full h-auto object-contain rounded"
            style={{ maxHeight: "75vh" }}
          />
        </div>
        <div className="px-5 py-3 border-t border-white/10 flex flex-wrap gap-3 text-xs">
          {Object.entries(METRO_LINE_COLORS).map(([line, color]) => {
            const names: Record<string, string> = {
              "1": "Кировско-Выборгская",
              "2": "Московско-Петроградская",
              "3": "Невско-Василеостровская",
              "4": "Правобережная",
              "5": "Фрунзенско-Приморская",
            };
            return (
              <div key={line} className="flex items-center gap-1.5">
                <div className="w-4 h-3 rounded" style={{ backgroundColor: color }} />
                <span className="text-white/60">{names[line]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Главная страница ──────────────────────────────────────────────────────
type ViewMode = "map" | "routes";

export default function MapPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showMetroModal, setShowMetroModal] = useState(false);
  const [showMetroOnMap, setShowMetroOnMap] = useState(true);

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const metroLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const filtered = PLACES.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());
    // если активен маршрут — показываем только его места
    if (selectedRoute) return selectedRoute.places.includes(p.id) && matchCat && matchSearch;
    return matchCat && matchSearch;
  });

  // Инициализация карты
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: SPB_CENTER,
      zoom: 12,
      zoomControl: false,
      minZoom: 10,
      maxZoom: 18,
      maxBounds: SPB_BOUNDS,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }
    ).addTo(map);

    // Слой метро
    const metroLayer = L.layerGroup().addTo(map);
    metroLayerRef.current = metroLayer;

    // Слой маршрутов
    const routeLayer = L.layerGroup().addTo(map);
    routeLayerRef.current = routeLayer;

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Отрисовка метро на карте
  useEffect(() => {
    const layer = metroLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!showMetroOnMap) return;

    // Рисуем линии
    Object.entries(METRO_LINE_ORDER).forEach(([lineId, stationIds]) => {
      const color = METRO_LINE_COLORS[lineId];
      const coords: [number, number][] = stationIds
        .map(id => METRO_STATIONS.find(s => s.id === id))
        .filter(Boolean)
        .map(s => [s!.lat, s!.lng]);

      if (coords.length > 1) {
        L.polyline(coords, {
          color,
          weight: 4,
          opacity: 0.85,
        }).addTo(layer);
      }
    });

    // Группируем пересадочные станции: собираем все линии по уникальным координатам
    // Ключ — строка "lat,lng", значение — набор линий
    const transferGroups: Map<string, { lines: string[]; names: string[]; lat: number; lng: number }> = new Map();

    METRO_STATIONS.forEach(station => {
      if (station.transfers && station.transfers.length > 0) {
        const key = `${station.lat.toFixed(4)},${station.lng.toFixed(4)}`;
        if (!transferGroups.has(key)) {
          // Собираем все станции на пересадке (сама + её transfers)
          const allIds = [station.id, ...station.transfers];
          const uniqueLines: string[] = [];
          const names: string[] = [];
          allIds.forEach(sid => {
            const s = METRO_STATIONS.find(x => x.id === sid);
            if (s && !uniqueLines.includes(s.line)) {
              uniqueLines.push(s.line);
            }
            if (s && !names.includes(s.name)) {
              names.push(s.name);
            }
          });
          transferGroups.set(key, { lines: uniqueLines, names, lat: station.lat, lng: station.lng });
        }
      }
    });

    // Рисуем обычные станции (без пересадок)
    METRO_STATIONS.forEach(station => {
      const isTransfer = station.transfers && station.transfers.length > 0;
      if (isTransfer) return; // пересадочные рисуем отдельно

      const color = METRO_LINE_COLORS[station.line];
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:10px;
          height:10px;
          background:#fff;
          border:2.5px solid ${color};
          border-radius:50%;
          box-shadow:0 1px 4px rgba(0,0,0,0.6);
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const marker = L.marker([station.lat, station.lng], { icon });
      marker.bindTooltip(station.name, {
        permanent: false,
        direction: "top",
        className: "metro-tooltip",
        offset: [0, -8],
      });
      marker.addTo(layer);
    });

    // Рисуем пересадочные узлы: ряд цветных кружков в рамке
    transferGroups.forEach(({ lines, names, lat, lng }) => {
      const dotSize = 12;
      const gap = 2;
      const n = lines.length;
      const totalW = n * dotSize + (n - 1) * gap;
      const totalH = dotSize;
      const padding = 3;

      const dotsHtml = lines.map((lineId, i) => {
        const c = METRO_LINE_COLORS[lineId] || "#888";
        return `<div style="
          width:${dotSize}px;
          height:${dotSize}px;
          background:${c};
          border-radius:50%;
          border:2px solid #fff;
          flex-shrink:0;
          box-shadow:0 1px 3px rgba(0,0,0,0.5);
        "></div>`;
      }).join(`<div style="width:${gap}px;"></div>`);

      const html = `<div style="
        display:flex;
        align-items:center;
        background:rgba(20,20,30,0.85);
        border:1.5px solid rgba(255,255,255,0.5);
        border-radius:${(totalH + padding * 2) / 2}px;
        padding:${padding}px ${padding + 1}px;
        box-shadow:0 2px 6px rgba(0,0,0,0.7);
        gap:${gap}px;
      ">${dotsHtml}</div>`;

      const iconW = totalW + (padding + 1) * 2;
      const iconH = totalH + padding * 2;
      const icon = L.divIcon({
        className: "",
        html,
        iconSize: [iconW, iconH],
        iconAnchor: [iconW / 2, iconH / 2],
      });

      const marker = L.marker([lat, lng], { icon });
      marker.bindTooltip(names.join(" / "), {
        permanent: false,
        direction: "top",
        className: "metro-tooltip",
        offset: [0, -(iconH / 2) - 4],
      });
      marker.addTo(layer);
    });
  }, [showMetroOnMap]);

  // Обновление маркеров мест
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const routePlaceIds = selectedRoute?.places ?? null;

    filtered.forEach((place) => {
      const isHighlighted = routePlaceIds ? routePlaceIds.includes(place.id) : false;
      const marker = L.marker([place.lat, place.lng], {
        icon: createColoredIcon(place.category, isHighlighted),
        zIndexOffset: isHighlighted ? 1000 : 0,
      });

      const cat = CATEGORIES.find((c) => c.id === place.category);
      marker.bindPopup(`
        <div style="background:#1a1a1a;color:#fff;padding:12px;min-width:210px;font-family:sans-serif;">
          <div style="font-weight:bold;font-size:13px;margin-bottom:4px;">${place.name}</div>
          <div style="color:rgba(255,255,255,0.45);font-size:11px;margin-bottom:6px;">${cat?.icon ?? ""} ${place.address}</div>
          <div style="color:rgba(255,255,255,0.65);font-size:11px;line-height:1.5;">${place.desc}</div>
          <div style="color:#9ca3af;font-size:10px;margin-top:6px;">~${place.visits}тыс. посетителей/год</div>
        </div>
      `, { className: "custom-dark-popup" });

      marker.on("click", () => setSelectedPlace(place));
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [filtered.map((p) => p.id).join(","), selectedRoute?.id]);

  // Маршрутная линия на карте
  useEffect(() => {
    const layer = routeLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!selectedRoute) return;

    const coords: [number, number][] = selectedRoute.places
      .map(id => PLACES.find(p => p.id === id))
      .filter(Boolean)
      .map(p => [p!.lat, p!.lng]);

    if (coords.length > 1) {
      L.polyline(coords, {
        color: selectedRoute.color,
        weight: 3,
        opacity: 0.8,
        dashArray: "8, 6",
      }).addTo(layer);
    }

    // Центрируем карту на маршруте
    if (mapRef.current && coords.length > 0) {
      mapRef.current.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
    }
  }, [selectedRoute?.id]);

  function handlePlaceClick(place: Place) {
    setSelectedPlace(place);
    if (mapRef.current) {
      mapRef.current.flyTo([place.lat, place.lng], 15, { duration: 1.0 });
    }
  }

  function handleRouteSelect(route: Route) {
    if (selectedRoute?.id === route.id) {
      setSelectedRoute(null);
    } else {
      setSelectedRoute(route);
      setSelectedPlace(null);
    }
  }

  function handleZoomIn() { mapRef.current?.zoomIn(); }
  function handleZoomOut() { mapRef.current?.zoomOut(); }

  return (
    <div className="font-golos bg-[#0a0a0a] text-white h-screen flex flex-col overflow-hidden">
      {/* Модальное окно схемы метро */}
      {showMetroModal && <MetroMapModal onClose={() => setShowMetroModal(false)} />}

      {/* TOP BAR */}
      <header className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur z-50 flex-shrink-0">
        <a href="https://preview--interactive-spb-map.poehali.dev/map" className="font-oswald font-bold text-xl tracking-wider mr-1">
          ПОЕХАЛИ<span className="text-[#f0e020]">.</span>DEV
        </a>
        <div className="w-px h-5 bg-white/20" />
        <span className="text-white/40 text-sm font-medium tracking-wide hidden sm:block">КАРТА САНКТ-ПЕТЕРБУРГА</span>

        <div className="flex-1" />

        {/* Кнопки */}
        <button
          onClick={() => setShowMetroModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[#1a1a2e] border border-[#2c6db5]/50 text-[#38bdf8] hover:bg-[#2c6db5]/20 transition-colors"
        >
          🚇 Схема метро
        </button>

        <button
          onClick={() => setShowMetroOnMap(v => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border transition-colors ${
            showMetroOnMap
              ? "bg-[#2c6db5]/20 border-[#2c6db5]/50 text-[#38bdf8]"
              : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
          }`}
        >
          {showMetroOnMap ? "🗺️ Метро вкл." : "🗺️ Метро выкл."}
        </button>

        <div className="relative hidden md:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск мест..."
            className="bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm px-4 py-1.5 pr-8 w-56 focus:outline-none focus:border-[#f0e020]/50 transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">⌕</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white/50 hover:text-white text-sm px-3 py-1.5 border border-white/10 hover:border-white/30 transition-colors hidden md:flex items-center gap-2"
        >
          {sidebarOpen ? "← Скрыть" : "→ Список"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`flex-shrink-0 bg-[#111] border-r border-white/10 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0"}`}>
          <div className="flex flex-col h-full min-w-80">

            {/* View mode tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setViewMode("map")}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${viewMode === "map" ? "bg-[#f0e020]/10 text-[#f0e020] border-b-2 border-[#f0e020]" : "text-white/40 hover:text-white/70"}`}
              >
                🗺️ Места
              </button>
              <button
                onClick={() => setViewMode("routes")}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${viewMode === "routes" ? "bg-[#f0e020]/10 text-[#f0e020] border-b-2 border-[#f0e020]" : "text-white/40 hover:text-white/70"}`}
              >
                🧭 Маршруты
              </button>
            </div>

            {viewMode === "map" ? (
              <>
                {/* Categories */}
                <div className="p-3 border-b border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-all ${
                          activeCategory === cat.id
                            ? "bg-[#f0e020] text-black"
                            : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile search */}
                <div className="p-3 border-b border-white/10 md:hidden">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск мест..."
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm px-3 py-2 focus:outline-none focus:border-[#f0e020]/50"
                  />
                </div>

                {/* Count */}
                <div className="px-4 py-2 text-white/30 text-xs border-b border-white/5 flex items-center justify-between">
                  <span>{filtered.length} мест · малопосещаемые</span>
                  {selectedRoute && (
                    <button onClick={() => setSelectedRoute(null)} className="text-[#f0e020] hover:text-white text-xs">× маршрут</button>
                  )}
                </div>

                {/* Places list */}
                <div className="flex-1 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <div className="p-6 text-center text-white/30 text-sm">Ничего не найдено</div>
                  ) : (
                    filtered.map((place) => {
                      const cat = CATEGORIES.find((c) => c.id === place.category);
                      const isSelected = selectedPlace?.id === place.id;
                      return (
                        <div
                          key={place.id}
                          onClick={() => handlePlaceClick(place)}
                          className={`px-4 py-3 cursor-pointer border-b border-white/5 transition-all ${
                            isSelected
                              ? "bg-[#f0e020]/10 border-l-2 border-l-[#f0e020]"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs">{cat?.icon}</span>
                                <span className={`font-medium text-sm truncate ${isSelected ? "text-[#f0e020]" : "text-white"}`}>
                                  {place.name}
                                </span>
                              </div>
                              <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{place.desc}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-white/25 text-xs">📍 {place.address}</span>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-white/30 text-xs font-medium text-right">
                              <span className="block">{place.visits}тыс.</span>
                              <span className="text-white/20">/год</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              /* МАРШРУТЫ */
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <p className="text-white/30 text-xs px-1 pb-1">Тематические маршруты по малоизвестным местам</p>
                {ROUTES.map((route) => {
                  const isActive = selectedRoute?.id === route.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => handleRouteSelect(route)}
                      className={`cursor-pointer border transition-all p-3 ${
                        isActive
                          ? "border-opacity-100 bg-black/30"
                          : "border-white/10 hover:border-white/25 hover:bg-white/5"
                      }`}
                      style={isActive ? { borderColor: route.color } : {}}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-medium text-sm" style={{ color: isActive ? route.color : "white" }}>
                          {route.name}
                        </span>
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: route.color }} />
                      </div>
                      <p className="text-white/45 text-xs leading-relaxed mb-2">{route.desc}</p>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span>⏱ {route.duration}</span>
                        <span>📏 {route.distance}</span>
                        <span>📍 {route.places.length} мест</span>
                      </div>
                      {isActive && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p className="text-xs text-white/30 mb-1.5">Маршрут:</p>
                          <div className="space-y-1">
                            {route.places.map((pid, idx) => {
                              const p = PLACES.find(pl => pl.id === pid);
                              if (!p) return null;
                              return (
                                <div
                                  key={pid}
                                  onClick={(e) => { e.stopPropagation(); handlePlaceClick(p); }}
                                  className="flex items-start gap-2 text-xs text-white/60 hover:text-white cursor-pointer transition-colors"
                                >
                                  <span style={{ color: route.color }} className="font-bold flex-shrink-0">{idx + 1}.</span>
                                  <span className="truncate">{p.name}</span>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedRoute(null); setViewMode("map"); }}
                            className="mt-3 w-full py-1.5 text-xs border transition-colors hover:bg-white/10"
                            style={{ borderColor: route.color + "60", color: route.color }}
                          >
                            Показать на карте
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* MAP */}
        <main className="flex-1 relative overflow-hidden">
          <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

          {/* Zoom controls */}
          <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-1">
            <button onClick={handleZoomIn} className="w-9 h-9 bg-[#1a1a1a] border border-white/20 text-white text-lg flex items-center justify-center hover:bg-white/10 transition-colors">+</button>
            <button onClick={handleZoomOut} className="w-9 h-9 bg-[#1a1a1a] border border-white/20 text-white text-lg flex items-center justify-center hover:bg-white/10 transition-colors">−</button>
          </div>

          {/* Active route badge */}
          {selectedRoute && (
            <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 px-3 py-2 bg-[#111]/90 border backdrop-blur text-sm" style={{ borderColor: selectedRoute.color + "80" }}>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedRoute.color }} />
              <span style={{ color: selectedRoute.color }} className="font-medium">{selectedRoute.name}</span>
              <button onClick={() => setSelectedRoute(null)} className="text-white/30 hover:text-white ml-2 text-base">×</button>
            </div>
          )}

          {/* Selected place card */}
          {selectedPlace && (
            <div className="absolute bottom-6 left-4 z-[1000] max-w-xs w-full bg-[#111] border border-white/20 p-4 shadow-2xl">
              <button onClick={() => setSelectedPlace(null)} className="absolute top-3 right-3 text-white/30 hover:text-white text-lg leading-none">×</button>
              <div className="flex items-center gap-2 mb-2">
                <span>{CATEGORIES.find((c) => c.id === selectedPlace.category)?.icon}</span>
                <span className="font-oswald font-bold text-base text-[#f0e020]">{selectedPlace.name}</span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed mb-3">{selectedPlace.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs">📍 {selectedPlace.address}</span>
                <span className="text-white/30 text-xs">{selectedPlace.visits}тыс. чел/год</span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 right-4 z-[1000] bg-[#111]/90 border border-white/10 p-3 backdrop-blur">
            <div className="text-white/30 text-xs mb-2 font-medium tracking-wider">ЛЕГЕНДА</div>
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat.id] || "#fff" }} />
                <span className="text-white/50 text-xs">{cat.label}</span>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="text-white/30 text-xs mb-1.5 font-medium tracking-wider">МЕТРО 2026</div>
              {(Object.entries(METRO_LINE_COLORS) as [string, string][]).map(([line, color]) => {
                const lineNames: Record<string, string> = {
                  "1": "Кировско-Выборгская",
                  "2": "Московско-Петроградская",
                  "3": "Невско-Василеостровская",
                  "4": "Правобережная",
                  "5": "Фрунзенско-Приморская",
                };
                return (
                  <div key={line} className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-1.5 rounded flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-white/40 text-xs">{lineNames[line]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-dark-popup .leaflet-popup-content-wrapper {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.6);
          padding: 0;
        }
        .custom-dark-popup .leaflet-popup-content { margin: 0; }
        .custom-dark-popup .leaflet-popup-tip { background: #1a1a1a; }
        .custom-dark-popup .leaflet-popup-close-button { color: rgba(255,255,255,0.4); font-size: 18px; top: 8px; right: 8px; }
        .custom-dark-popup .leaflet-popup-close-button:hover { color: #fff; }
        .metro-tooltip {
          background: rgba(20,20,30,0.92) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          border-radius: 3px !important;
          color: #fff !important;
          font-size: 11px !important;
          padding: 3px 7px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
          white-space: nowrap !important;
        }
        .metro-tooltip::before { display: none !important; }
        .leaflet-container { background: #0d1117; }
      `}</style>
    </div>
  );
}