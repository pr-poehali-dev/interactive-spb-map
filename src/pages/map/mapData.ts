import L from "leaflet";

// ─── Границы Санкт-Петербурга ─────────────────────────────────────────────
export const SPB_BOUNDS = L.latLngBounds(
  L.latLng(59.644, 29.70),   // юго-запад
  L.latLng(60.245, 30.85)    // северо-восток
);
export const SPB_CENTER: [number, number] = [59.939, 30.316];

// ─── Категории ────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: "all",     label: "Все",       icon: "🗺️" },
  { id: "history", label: "История",   icon: "🏛️" },
  { id: "art",     label: "Искусство", icon: "🎨" },
  { id: "nature",  label: "Природа",   icon: "🌿" },
  { id: "cult",    label: "Культура",  icon: "🎭" },
  { id: "church",  label: "Храмы",     icon: "⛪" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  history: "#a78bfa",
  art:     "#f97316",
  nature:  "#22c55e",
  cult:    "#38bdf8",
  church:  "#f0e020",
};

export interface Place {
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
export const PLACES: Place[] = [
  { id:1,  name:"Музей политической истории России",       category:"history", lat:59.9537, lng:30.3224, desc:"Особняк Кшесинской, история политических событий XX века.", address:"ул. Куйбышева, 2/4", visits:18 },
  { id:2,  name:"Музей гигиены",                           category:"history", lat:59.9357, lng:30.3275, desc:"Необычный музей о санитарии и здоровье, основан в 1919 году.", address:"Итальянская ул., 25", visits:12 },
  { id:3,  name:"Музей «Разночинный Петербург»",           category:"history", lat:59.9215, lng:30.3471, desc:"Быт жителей Нарвской заставы конца XIX — начала XX века.", address:"Съезжинская ул., 3", visits:8 },
  { id:4,  name:"Музей Арктики и Антарктики",              category:"history", lat:59.9231, lng:30.3640, desc:"Уникальная коллекция полярных экспедиций и исследований.", address:"ул. Марата, 24А", visits:22 },
  { id:5,  name:"Музей железных дорог России",             category:"history", lat:59.9068, lng:30.3047, desc:"Крупнейшая экспозиция подвижного состава, паровозы и вагоны.", address:"Библиотечный пер., 4", visits:25 },
  { id:6,  name:"Музей «Невская застава»",                 category:"history", lat:59.8900, lng:30.4490, desc:"История рабочего движения Петербурга, предметы быта рабочих.", address:"шоссе Революции, 84", visits:5 },
  { id:7,  name:"Музей-квартира Блока",                    category:"art",     lat:59.9283, lng:30.3042, desc:"Квартира, где поэт Александр Блок прожил последние годы.", address:"ул. Декабристов, 57", visits:14 },
  { id:8,  name:"Музей-квартира Некрасова",                category:"art",     lat:59.9336, lng:30.3502, desc:"Мемориальный музей в квартире поэта Николая Некрасова.", address:"Литейный пр., 36", visits:11 },
  { id:9,  name:"Музей-квартира Ахматовой в Фонтанном доме", category:"art",  lat:59.9316, lng:30.3397, desc:"Знаменитый «Фонтанный дом» — квартира Анны Ахматовой.", address:"наб. р. Фонтанки, 34", visits:20 },
  { id:10, name:"Музей Державина",                         category:"art",     lat:59.9267, lng:30.3115, desc:"Усадьба поэта Гавриила Державина с восстановленными интерьерами.", address:"наб. р. Фонтанки, 118", visits:9 },
  { id:11, name:"Музей истории фотографии",                category:"art",     lat:59.9561, lng:30.3403, desc:"История фотографии в России с XIX века до наших дней.", address:"ул. Профессора Попова, 23", visits:7 },
  { id:12, name:"Музей петербургского авангарда",          category:"art",     lat:59.9609, lng:30.2922, desc:"Дом Матюшина — центр художественного авангарда 1920-х.", address:"ул. Профессора Попова, 10", visits:6 },
  { id:13, name:"Музей «Вселенная воды»",                  category:"history", lat:59.9303, lng:30.3455, desc:"Интерактивный музей в историческом водонапорном башне.", address:"Шпалерная ул., 56", visits:30 },
  { id:14, name:"Планетарий №1",                           category:"cult",    lat:59.9665, lng:30.2786, desc:"Исторический планетарий в Александровском парке.", address:"Александровский парк, 4", visits:28 },
  { id:15, name:"Музей восковых фигур",                    category:"cult",    lat:59.9513, lng:30.3191, desc:"Восковые копии исторических и современных знаменитостей.", address:"Петропавловская крепость", visits:15 },
  { id:16, name:"Музей современного искусства Эрарта",     category:"art",     lat:59.9309, lng:30.2503, desc:"Крупнейший частный музей современного искусства в России.", address:"29-я линия В.О., 2", visits:35 },
  { id:17, name:"Музей стрит-арта",                        category:"art",     lat:59.8989, lng:30.4413, desc:"Уникальный музей в действующем промышленном здании.", address:"шоссе Революции, 84Е", visits:18 },
  { id:18, name:"Музей советских игровых автоматов",       category:"cult",    lat:59.9403, lng:30.3318, desc:"Коллекция советских аркадных автоматов 1970–80-х годов.", address:"Конюшенная пл., 2В", visits:22 },
  { id:19, name:"Музей циркового искусства",               category:"cult",    lat:59.9406, lng:30.3323, desc:"История российского цирка, уникальные афиши и реквизит.", address:"наб. р. Фонтанки, 3", visits:10 },
  { id:20, name:"Музей истории телефона",                  category:"history", lat:59.9350, lng:30.3600, desc:"Коллекция телефонных аппаратов с 1880-х по наши дни.", address:"Шпалерная ул., 60", visits:5 },
  { id:21, name:"Музей оловянного солдатика",              category:"hist",    lat:59.9397, lng:30.3146, desc:"Более 30 000 оловянных фигурок — солдаты всех эпох.", address:"Дворцовая наб., 30", visits:8 },
  { id:22, name:"Музей печати",                            category:"history", lat:59.9484, lng:30.3145, desc:"История российской журналистики и печатного дела.", address:"наб. р. Мойки, 32", visits:6 },
  { id:23, name:"Музей кукол",                             category:"cult",    lat:59.9283, lng:30.3145, desc:"Коллекция кукол со всего мира, куклы русских мастеров.", address:"Камская ул., 8", visits:12 },
  { id:24, name:"Ботанический сад ПетрГУ (филиал)",        category:"nature",  lat:59.9659, lng:30.3060, desc:"Оранжереи с тропическими растениями и учебные коллекции.", address:"ул. Профессора Попова, 2", visits:20 },
  { id:25, name:"Елагин остров (Северная часть)",          category:"nature",  lat:59.9827, lng:30.2660, desc:"Малолюдная северная оконечность острова с дикой природой.", address:"Елагин остров, север", visits:15 },
  { id:26, name:"Удельный парк",                           category:"nature",  lat:60.0124, lng:30.3183, desc:"Старинный лесной парк в Выборгском районе, тихое место.", address:"Торжковская ул., 11", visits:18 },
  { id:27, name:"Парк Лесотехнической академии",           category:"nature",  lat:60.0006, lng:30.3440, desc:"Дендрарий с редкими породами деревьев, научная ценность.", address:"Институтский пер., 5", visits:10 },
  { id:28, name:"Парк «Сосновка»",                         category:"nature",  lat:60.0158, lng:30.3583, desc:"Огромный лесной массив, любимый местными жителями.", address:"ул. Жака Дюкло, 1", visits:30 },
  { id:29, name:"Богословское кладбище",                   category:"history", lat:59.9978, lng:30.3887, desc:"Историческое некрополь со старинными надгробиями XIX века.", address:"Бестужевская ул., 4", visits:4 },
  { id:30, name:"Церковь Казанской иконы БМ (Зеленогорск)", category:"church", lat:60.1928, lng:29.7020, desc:"Деревянная церковь начала XX века в Зеленогорске.", address:"г. Зеленогорск, Гаванная ул., 4", visits:3 },
  { id:31, name:"Церковь Покрова Пресвятой Богородицы",    category:"church",  lat:59.8782, lng:30.2892, desc:"Небольшая православная церковь в Лигово, XVII–XIX вв.", address:"пр. Ветеранов, 159", visits:6 },
  { id:32, name:"Церковь Святых Апостолов Петра и Павла в Шуваловском парке", category:"church", lat:60.0587, lng:30.2670, desc:"Романтическая церковь на острове в Шуваловском парке.", address:"Парголово, Выборгское шоссе, 106", visits:9 },
  { id:33, name:"Буддийский храм «Дацан Гунзэчойнэй»",    category:"church",  lat:59.9773, lng:30.2965, desc:"Первый в Европе буддийский храм, основан в 1909 году.", address:"Приморский пр., 91", visits:25 },
  { id:34, name:"Музей хлеба",                             category:"history", lat:59.9319, lng:30.3567, desc:"История хлебопечения от древности до наших дней.", address:"Михайловская ул., 2", visits:8 },
  { id:35, name:"Музей связи им. Попова",                  category:"history", lat:59.9301, lng:30.3041, desc:"Коллекция средств связи, старейший музей связи в России.", address:"Почтамтская ул., 7", visits:12 },
  { id:36, name:"Дом-музей Набокова",                      category:"art",     lat:59.9384, lng:30.3237, desc:"Дом детства Владимира Набокова на Большой Морской улице.", address:"Большая Морская ул., 47", visits:11 },
  { id:37, name:"Музей-квартира Пушкина",                  category:"art",     lat:59.9379, lng:30.3181, desc:"Квартира, где Александр Пушкин провёл последние месяцы.", address:"наб. р. Мойки, 12", visits:40 },
  { id:38, name:"Музей обороны и блокады Ленинграда",      category:"history", lat:59.9428, lng:30.3623, desc:"Документы и экспонаты о блокаде 1941–1944 годов.", address:"Соляной пер., 9", visits:32 },
  { id:39, name:"Музей истории религии",                   category:"church",  lat:59.9316, lng:30.3090, desc:"Крупнейший в России музей, посвящённый истории религий мира.", address:"Почтамтская ул., 14/5", visits:28 },
  { id:40, name:"Музей городской скульптуры",              category:"art",     lat:59.9264, lng:30.3839, desc:"Мемориальные надгробия и памятники, Александро-Невская лавра.", address:"пл. Александра Невского, 1", visits:20 },
  { id:41, name:"Музей «Разведчики Балтики» (подводная лодка)", category:"history", lat:59.9450, lng:30.2090, desc:"Подводная лодка Д-2 «Народоволец», настоящий экспонат.", address:"Шкиперский проток, 10", visits:10 },
  { id:42, name:"Музей Нарвские триумфальные ворота",      category:"history", lat:59.8988, lng:30.2685, desc:"Внутри ворот — музей истории Нарвских ворот и эпохи.", address:"пл. Стачек, 1", visits:7 },
  { id:43, name:"Музей мостов Петербурга",                 category:"history", lat:59.9296, lng:30.3040, desc:"История мостостроения, модели мостов, чертежи и фотографии.", address:"Почтамтский мост", visits:6 },
  { id:44, name:"Лютеранская церковь Святой Марии (Колокольня)", category:"church", lat:59.9381, lng:30.3255, desc:"Вид с колокольни на центр Петербурга, экскурсии наверх.", address:"Большая Конюшенная ул., 8", visits:8 },
  { id:45, name:"Музей уличного искусства (МИСП)",         category:"art",     lat:59.9303, lng:30.3255, desc:"Современное искусство в историческом особняке.", address:"пер. Гривцова, 28", visits:14 },
  { id:46, name:"Музей Арсенал",                           category:"history", lat:59.9568, lng:30.3452, desc:"Военно-исторический музей, оружие и снаряжение разных эпох.", address:"Литейный пр., 3", visits:9 },
  { id:47, name:"Парк «Дача Победа»",                      category:"nature",  lat:59.9738, lng:30.4162, desc:"Старинный усадебный парк с прудами у р. Охты.", address:"Большеохтинский пр., 27", visits:7 },
  { id:48, name:"Парк Малиновка",                          category:"nature",  lat:59.9910, lng:30.4388, desc:"Лесопарк с ручьями и мостиками в Красногвардейском районе.", address:"пр. Косыгина, 29", visits:12 },
  { id:49, name:"Юсуповский дворец на Мойке",              category:"art",     lat:59.9286, lng:30.3074, desc:"Роскошный дворец, домашний театр, интерьеры XIX века.", address:"наб. р. Мойки, 94", visits:35 },
  { id:50, name:"Центральный военно-морской музей",        category:"history", lat:59.9310, lng:30.3021, desc:"Крупнейший военно-морской музей мира, флаги и корабельные модели.", address:"пл. Труда, 5", visits:38 },
];

// ─── Метро ────────────────────────────────────────────────────────────────
export const METRO_LINE_COLORS: Record<string, string> = {
  "1": "#e8112d",   // Кировско-Выборгская — красная
  "2": "#0078c9",   // Московско-Петроградская — синяя
  "3": "#1db452",   // Невско-Василеостровская — зелёная
  "4": "#f47216",   // Правобережная — оранжевая
  "5": "#9659a3",   // Фрунзенско-Приморская — фиолетовая
};

export interface MetroStation {
  id: string;
  name: string;
  line: string;
  lat: number;
  lng: number;
  transfers?: string[]; // id других станций на пересадке
}

// Координаты станций метро СПб (точные)
export const METRO_STATIONS: MetroStation[] = [
  // Линия 1 — Кировско-Выборгская (красная)
  { id:"dev",   name:"Девяткино",          line:"1", lat:60.0505, lng:30.4425 },
  { id:"grazh", name:"Гражданский проспект", line:"1", lat:60.0101, lng:30.4179 },
  { id:"akad",  name:"Академическая",      line:"1", lat:60.0002, lng:30.4040 },
  { id:"polit", name:"Политехническая",    line:"1", lat:59.9878, lng:30.3718 },
  { id:"plmuzh",name:"Площадь Мужества",   line:"1", lat:59.9739, lng:30.3598, transfers:["les"] },
  { id:"les",   name:"Лесная",             line:"1", lat:59.9848, lng:30.3448, transfers:["plmuzh"] },
  { id:"vyb",   name:"Выборгская",         line:"1", lat:59.9718, lng:30.3468 },
  { id:"plleni",name:"Площадь Ленина",     line:"1", lat:59.9563, lng:30.3557 },
  { id:"che",   name:"Чернышевская",       line:"1", lat:59.9459, lng:30.3597 },
  { id:"plvos", name:"Площадь Восстания",  line:"1", lat:59.9313, lng:30.3602, transfers:["nevpr"] },
  { id:"vlad",  name:"Владимирская",       line:"1", lat:59.9261, lng:30.3484, transfers:["dos"] },
  { id:"pusk",  name:"Пушкинская",         line:"1", lat:59.9218, lng:30.3471, transfers:["zveni"] },
  { id:"tehinst",name:"Технологический институт", line:"1", lat:59.9160, lng:30.3192, transfers:["tehinst2"] },
  { id:"balt",  name:"Балтийская",         line:"1", lat:59.9075, lng:30.3017 },
  { id:"nar",   name:"Нарвская",           line:"1", lat:59.8988, lng:30.2737 },
  { id:"kzav",  name:"Кировский завод",    line:"1", lat:59.8862, lng:30.2525 },
  { id:"aut",   name:"Автово",             line:"1", lat:59.8714, lng:30.2616 },
  { id:"lenpr", name:"Ленинский проспект", line:"1", lat:59.8582, lng:30.2661 },
  { id:"pvet",  name:"Проспект Ветеранов", line:"1", lat:59.8479, lng:30.2516 },
  { id:"yuzap", name:"Юго-Западная",       line:"1", lat:59.8367, lng:30.2281 },

  // Линия 2 — Московско-Петроградская (синяя)
  { id:"par",   name:"Парнас",             line:"2", lat:60.0667, lng:30.3232 },
  { id:"prpr",  name:"Проспект Просвещения", line:"2", lat:60.0504, lng:30.3234 },
  { id:"ozer",  name:"Озерки",             line:"2", lat:60.0379, lng:30.3222 },
  { id:"udel",  name:"Удельная",           line:"2", lat:60.0178, lng:30.3127 },
  { id:"pion",  name:"Пионерская",         line:"2", lat:60.0043, lng:30.2985 },
  { id:"chre",  name:"Чёрная речка",       line:"2", lat:59.9892, lng:30.2957 },
  { id:"petro", name:"Петроградская",      line:"2", lat:59.9661, lng:30.3109, transfers:["gor"] },
  { id:"gor",   name:"Горьковская",        line:"2", lat:59.9551, lng:30.3203, transfers:["petro"] },
  { id:"nevpr", name:"Невский проспект",   line:"2", lat:59.9355, lng:30.3272, transfers:["plvos","gostdv","spask"] },
  { id:"senn",  name:"Сенная площадь",     line:"2", lat:59.9267, lng:30.3195, transfers:["sad","spask"] },
  { id:"tehinst2",name:"Технологический институт (2)", line:"2", lat:59.9160, lng:30.3192, transfers:["tehinst"] },
  { id:"frunz", name:"Фрунзенская",        line:"2", lat:59.9087, lng:30.3271 },
  { id:"mvor",  name:"Московские ворота",  line:"2", lat:59.8994, lng:30.3257 },
  { id:"elektr",name:"Электросила",        line:"2", lat:59.8901, lng:30.3282 },
  { id:"ppob",  name:"Парк Победы",        line:"2", lat:59.8797, lng:30.3281 },
  { id:"mos",   name:"Московская",         line:"2", lat:59.8693, lng:30.3236, transfers:["zvez"] },
  { id:"zvez",  name:"Звёздная",           line:"2", lat:59.8575, lng:30.3455 },
  { id:"kupc",  name:"Купчино",            line:"2", lat:59.8416, lng:30.3807 },

  // Линия 3 — Невско-Василеостровская (зелёная)
  { id:"primorsk",name:"Приморская",       line:"3", lat:59.9347, lng:30.2202 },
  { id:"vasil",  name:"Василеостровская",  line:"3", lat:59.9435, lng:30.2744 },
  { id:"gostdv", name:"Гостиный двор",     line:"3", lat:59.9334, lng:30.3335, transfers:["nevpr","spask"] },
  { id:"mayak",  name:"Маяковская",        line:"3", lat:59.9316, lng:30.3568 },
  { id:"plaleks",name:"Площадь Александра Невского", line:"3", lat:59.9237, lng:30.3834 },
  { id:"novoch", name:"Новочеркасская",    line:"3", lat:59.9299, lng:30.4094 },
  { id:"ladozh", name:"Ладожская",         line:"3", lat:59.9326, lng:30.4393 },
  { id:"prbol",  name:"Проспект Большевиков", line:"3", lat:59.9210, lng:30.4723 },
  { id:"udyb",   name:"Улица Дыбенко",     line:"3", lat:59.9143, lng:30.4917 },

  // Линия 4 — Правобережная (оранжевая)
  { id:"spask",  name:"Спасская",          line:"4", lat:59.9258, lng:30.3224, transfers:["senn","sad","gostdv","nevpr"] },
  { id:"dos",    name:"Достоевская",       line:"4", lat:59.9258, lng:30.3438, transfers:["vlad"] },
  { id:"ligpr",  name:"Лиговский проспект",line:"4", lat:59.9200, lng:30.3547 },
  { id:"elis",   name:"Елизаровская",      line:"4", lat:59.9028, lng:30.4292 },
  { id:"lom",    name:"Ломоносовская",     line:"4", lat:59.8960, lng:30.4404 },
  { id:"prolet", name:"Пролетарская",      line:"4", lat:59.8858, lng:30.4698 },
  { id:"obukhov",name:"Обухово",           line:"4", lat:59.8702, lng:30.4637 },
  { id:"ryb",    name:"Рыбацкое",          line:"4", lat:59.8310, lng:30.5072 },

  // Линия 5 — Фрунзенско-Приморская (фиолетовая)
  { id:"komp",   name:"Комендантский проспект", line:"5", lat:60.0024, lng:30.2587 },
  { id:"stardv", name:"Старая Деревня",    line:"5", lat:59.9905, lng:30.2550 },
  { id:"krest",  name:"Крестовский остров",line:"5", lat:59.9723, lng:30.2687 },
  { id:"chkal",  name:"Чкаловская",        line:"5", lat:59.9610, lng:30.2886 },
  { id:"sport",  name:"Спортивная",        line:"5", lat:59.9523, lng:30.2888 },
  { id:"admir",  name:"Адмиралтейская",    line:"5", lat:59.9360, lng:30.3146 },
  { id:"sad",    name:"Садовая",           line:"5", lat:59.9267, lng:30.3195, transfers:["senn","spask"] },
  { id:"zveni",  name:"Звенигородская",    line:"5", lat:59.9191, lng:30.3352, transfers:["pusk"] },
  { id:"obv",    name:"Обводный канал",    line:"5", lat:59.9124, lng:30.3572 },
  { id:"volkov", name:"Волковская",        line:"5", lat:59.8983, lng:30.3806 },
  { id:"bukhar", name:"Бухарестская",      line:"5", lat:59.8880, lng:30.3798 },
  { id:"mezhn",  name:"Международная",     line:"5", lat:59.8783, lng:30.3806 },
  { id:"prslav", name:"Проспект Славы",    line:"5", lat:59.8671, lng:30.4080 },
  { id:"dunaj",  name:"Дунайская",         line:"5", lat:59.8559, lng:30.4056 },
  { id:"shush",  name:"Шушары",            line:"5", lat:59.8263, lng:30.4190 },

  // Беговая и Зенит (линия 3, западный отрезок)
  { id:"beg",    name:"Беговая",           line:"3", lat:59.9802, lng:30.2140 },
  { id:"zenit",  name:"Зенит",             line:"3", lat:59.9714, lng:30.2309 },

  // Горный институт (линия 5)
  { id:"gorninst",name:"Горный институт",  line:"5", lat:59.9333, lng:30.2887 },

  // Театральная (линия 5)
  { id:"teatr",  name:"Театральная",       line:"5", lat:59.9297, lng:30.2987 },
];

// Порядок станций для каждой линии (для рисования путей)
export const METRO_LINE_ORDER: Record<string, string[]> = {
  "1": ["dev","grazh","akad","polit","plmuzh","les","vyb","plleni","che","plvos","vlad","pusk","tehinst","balt","nar","kzav","aut","lenpr","pvet","yuzap"],
  "2": ["par","prpr","ozer","udel","pion","chre","petro","gor","nevpr","senn","tehinst2","frunz","mvor","elektr","ppob","mos","zvez","kupc"],
  "3": ["beg","zenit","primorsk","vasil","gostdv","mayak","plaleks","novoch","ladozh","prbol","udyb"],
  "4": ["spask","dos","ligpr","elis","lom","prolet","obukhov","ryb"],
  "5": ["komp","stardv","krest","chkal","sport","gorninst","teatr","admir","sad","zveni","obv","volkov","bukhar","mezhn","prslav","dunaj","shush"],
};

// ─── Маршруты ─────────────────────────────────────────────────────────────
export interface Route {
  id: number;
  name: string;
  desc: string;
  color: string;
  places: number[]; // id мест из PLACES
  duration: string;
  distance: string;
}

export const ROUTES: Route[] = [
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
    name: "Зелёный Петербург",
    desc: "Малоизвестные парки, сады и природные уголки города",
    color: "#22c55e",
    places: [24, 25, 26, 27, 28],
    duration: "4–5 часов",
    distance: "~15 км",
  },
  {
    id: 5,
    name: "Духовный Петербург",
    desc: "Малоизвестные храмы разных конфессий и религиозные музеи",
    color: "#f0e020",
    places: [30, 31, 32, 33, 39, 44],
    duration: "6–7 часов",
    distance: "~20 км",
  },
];

// ─── Утилита создания иконки ───────────────────────────────────────────────
export function createColoredIcon(category: string, isHighlighted = false) {
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
