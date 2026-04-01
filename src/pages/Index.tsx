import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const TICKER_ITEMS = [
  "САЙТ ЗА 1 ДЕНЬ", "БЕЗ ПРОГРАММИСТА", "ИИ ДЕЛАЕТ ЗА ВАС",
  "ЛЕНДИНГ", "ИНТЕРНЕТ-МАГАЗИН", "ПОРТФОЛИО", "КОРПОРАТИВНЫЙ САЙТ",
  "30× БЫСТРЕЕ", "ВСЕГДА НА СВЯЗИ", "ПРАВКИ МГНОВЕННО",
];

const FEATURES = [
  {
    icon: "Zap",
    title: "30× быстрее",
    desc: "Сайт готов за 1–3 дня вместо месяца. Запускайтесь, пока конкуренты ещё думают.",
  },
  {
    icon: "Bot",
    title: "ИИ под капотом",
    desc: "Умный ИИ генерирует код, структуру и контент — вам остаётся только утверждать.",
  },
  {
    icon: "MessageCircle",
    title: "Просто опишите",
    desc: "Напишите что нужно — мы переведём слова в работающий сайт без технических знаний.",
  },
  {
    icon: "RefreshCw",
    title: "Правки мгновенно",
    desc: "Хотите изменить цвет, текст или структуру? Пишите — исправим за минуты.",
  },
  {
    icon: "Shield",
    title: "Надёжный хостинг",
    desc: "Ваш сайт работает 24/7 на быстрых серверах. Никаких упавших сайтов.",
  },
  {
    icon: "TrendingUp",
    title: "SEO с первого дня",
    desc: "Сайты оптимизированы под поисковики — Google и Яндекс найдут вас быстрее.",
  },
];

const EXAMPLES = [
  { tag: "Лендинг", name: "Студия красоты «Луна»", time: "14 ч" },
  { tag: "Магазин", name: "Авторские свечи ручной работы", time: "1 день" },
  { tag: "Портфолио", name: "Фотограф Николай Иванов", time: "8 ч" },
  { tag: "Корпоративный", name: "Транспортная компания «Ростэкс»", time: "2 дня" },
];

const PLANS = [
  {
    name: "Старт",
    price: "9 900",
    desc: "Для быстрого запуска",
    features: ["Одностраничный сайт", "Мобильная версия", "3 правки", "Хостинг 3 мес."],
    cta: "Начать",
    highlight: false,
  },
  {
    name: "Бизнес",
    price: "24 900",
    desc: "Для серьёзных проектов",
    features: ["До 5 страниц", "CRM-интеграция", "Безлимит правок", "Хостинг 12 мес.", "SEO-оптимизация"],
    cta: "Выбрать",
    highlight: true,
  },
  {
    name: "Магазин",
    price: "39 900",
    desc: "Продавайте онлайн",
    features: ["Каталог товаров", "Корзина и оплата", "Личный кабинет", "Хостинг 12 мес.", "Аналитика продаж"],
    cta: "Запустить",
    highlight: false,
  },
];

function AnimatedNumber({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      {value}{suffix}
    </span>
  );
}

export default function Index() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="font-golos bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-oswald font-bold text-2xl tracking-wider">
            ПОЕХАЛИ<span className="text-[#f0e020]">.</span>DEV
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Возможности</a>
            <a href="#examples" className="hover:text-white transition-colors">Примеры</a>
            <a href="#pricing" className="hover:text-white transition-colors">Цены</a>
          </div>
          <button className="bg-[#f0e020] text-black font-oswald font-semibold px-5 py-2 text-sm tracking-wider hover:bg-yellow-300 transition-colors">
            НАЧАТЬ
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #f0e020 0%, transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 border border-[#f0e020]/40 text-[#f0e020] text-xs font-medium px-4 py-2 mb-8 tracking-widest"
            style={{ animation: "fade-up 0.6s ease-out forwards", opacity: 0 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f0e020] animate-pulse" />
            ИИ-РАЗРАБОТКА САЙТОВ
          </div>

          <h1 className="font-oswald font-bold leading-none mb-6"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)", animation: "fade-up 0.7s 0.1s ease-out forwards", opacity: 0 }}>
            САЙТ ЗА<br />
            <span className="text-[#f0e020]">ОДИН</span><br />
            ДЕНЬ
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
            style={{ animation: "fade-up 0.7s 0.25s ease-out forwards", opacity: 0 }}>
            Опишите что нужно — ИИ создаст сайт за вас. Без программистов, без ожидания, без лишних расходов.
          </p>

          <div className="flex flex-col sm:flex-row gap-4"
            style={{ animation: "fade-up 0.7s 0.4s ease-out forwards", opacity: 0 }}>
            <button className="group bg-[#f0e020] text-black font-oswald font-bold px-8 py-4 text-lg tracking-wider hover:bg-yellow-300 transition-all flex items-center gap-3">
              ЗАПУСТИТЬ САЙТ
              <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/20 text-white font-oswald px-8 py-4 text-lg tracking-wider hover:border-white/50 transition-colors flex items-center gap-3">
              <Icon name="Play" size={18} />
              КАК ЭТО РАБОТАЕТ
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-12 mt-16 border-t border-white/10 pt-10"
            style={{ animation: "fade-up 0.7s 0.55s ease-out forwards", opacity: 0 }}>
            {[
              { val: "500+", label: "сайтов запущено" },
              { val: "30×", label: "быстрее обычного" },
              { val: "98%", label: "клиентов довольны" },
            ].map(s => (
              <div key={s.label}>
                <div className="font-oswald font-bold text-3xl md:text-4xl text-[#f0e020]">
                  <AnimatedNumber value={s.val} />
                </div>
                <div className="text-white/40 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="border-y border-white/10 py-4 overflow-hidden bg-[#f0e020]/5">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6 font-oswald font-medium text-sm tracking-widest text-white/70">
              {item}
              <span className="text-[#f0e020]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <div className="font-oswald text-[#f0e020] text-sm tracking-widest mb-4">ВОЗМОЖНОСТИ</div>
          <h2 className="font-oswald font-bold text-4xl md:text-6xl leading-none">
            ВСЁ ЧТО НУЖНО<br />
            <span className="text-white/30">ДЛЯ СТАРТА</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {FEATURES.map((f, i) => (
            <div key={f.title}
              className="group bg-[#0a0a0a] p-8 hover:bg-[#111] transition-all cursor-default"
              style={{ animation: `fade-up 0.6s ${0.1 * i}s ease-out both` }}>
              <div className="w-10 h-10 border border-[#f0e020]/30 flex items-center justify-center mb-6 group-hover:border-[#f0e020] transition-colors">
                <Icon name={f.icon} size={18} className="text-[#f0e020]" />
              </div>
              <h3 className="font-oswald font-semibold text-xl mb-3 tracking-wide">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-[#0e0e0e] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <div className="font-oswald text-[#f0e020] text-sm tracking-widest mb-4">КАК ЭТО РАБОТАЕТ</div>
            <h2 className="font-oswald font-bold text-4xl md:text-6xl leading-none">
              3 ШАГА<br />
              <span className="text-white/30">ДО ГОТОВОГО САЙТА</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Опишите", desc: "Напишите нам что нужно — сфера бизнеса, цель сайта, пожелания по дизайну. В свободной форме." },
              { n: "02", title: "Смотрите", desc: "Уже через несколько часов вы увидите первую версию. ИИ создаст структуру, дизайн и контент." },
              { n: "03", title: "Запускайте", desc: "Вносим правки под ваш вкус и запускаем сайт. Хостинг, домен, всё включено." },
            ].map((step, i) => (
              <div key={step.n} className="relative" style={{ animation: `fade-up 0.6s ${0.15 * i}s ease-out both` }}>
                <div className="font-oswald font-bold text-7xl text-white/5 mb-4 leading-none">{step.n}</div>
                <div className="absolute top-2 left-1 w-px h-12 bg-[#f0e020]/50" />
                <h3 className="font-oswald font-semibold text-2xl mb-3 pl-4">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed pl-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section id="examples" className="py-24 max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <div className="font-oswald text-[#f0e020] text-sm tracking-widest mb-4">ПРИМЕРЫ РАБОТ</div>
          <h2 className="font-oswald font-bold text-4xl md:text-6xl leading-none">
            РЕАЛЬНЫЕ<br />
            <span className="text-white/30">ПРОЕКТЫ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXAMPLES.map((ex, i) => (
            <div key={ex.name}
              className="group relative border border-white/10 p-8 hover:border-[#f0e020]/40 transition-all cursor-pointer overflow-hidden"
              style={{ animation: `fade-up 0.6s ${0.1 * i}s ease-out both` }}>
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f0e020]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="border border-[#f0e020]/40 text-[#f0e020] text-xs font-oswald tracking-widest px-3 py-1">
                    {ex.tag}
                  </span>
                  <span className="text-white/30 text-xs font-oswald">
                    <Icon name="Clock" size={12} className="inline mr-1" />
                    {ex.time}
                  </span>
                </div>

                <div className="h-36 bg-white/5 mb-6 flex items-center justify-center group-hover:bg-white/8 transition-colors">
                  <Icon name="Globe" size={32} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </div>

                <h3 className="font-oswald font-semibold text-xl mb-2">{ex.name}</h3>
                <div className="flex items-center gap-2 text-[#f0e020] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Смотреть проект</span>
                  <Icon name="ArrowRight" size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-[#0e0e0e] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <div className="font-oswald text-[#f0e020] text-sm tracking-widest mb-4">ТАРИФЫ</div>
            <h2 className="font-oswald font-bold text-4xl md:text-6xl leading-none">
              ПРОЗРАЧНЫЕ<br />
              <span className="text-white/30">ЦЕНЫ</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {PLANS.map((plan, i) => (
              <div key={plan.name}
                className={`relative p-8 transition-all ${plan.highlight ? "bg-[#f0e020]" : "bg-[#0e0e0e] hover:bg-[#111]"}`}
                style={{ animation: `fade-up 0.6s ${0.1 * i}s ease-out both` }}>
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-black/20" />
                )}

                <div className={`text-xs font-oswald tracking-widest mb-6 ${plan.highlight ? "text-black/50" : "text-white/40"}`}>
                  {plan.name.toUpperCase()}
                </div>

                <div className={`font-oswald font-bold text-5xl mb-1 leading-none ${plan.highlight ? "text-black" : "text-white"}`}>
                  {plan.price}
                  <span className="text-2xl">₽</span>
                </div>
                <div className={`text-sm mb-8 ${plan.highlight ? "text-black/50" : "text-white/30"}`}>{plan.desc}</div>

                <div className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <div key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? "text-black" : "text-white/60"}`}>
                      <Icon name="Check" size={14} className={plan.highlight ? "text-black" : "text-[#f0e020]"} />
                      {f}
                    </div>
                  ))}
                </div>

                <button className={`w-full font-oswald font-semibold py-3 text-sm tracking-widest transition-all
                  ${plan.highlight
                    ? "bg-black text-[#f0e020] hover:bg-black/80"
                    : "border border-white/20 text-white hover:border-[#f0e020] hover:text-[#f0e020]"}`}>
                  {plan.cta.toUpperCase()}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ background: "radial-gradient(ellipse at 50% 100%, #f0e020 0%, transparent 60%)" }} />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="font-oswald font-bold leading-none mb-8"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}>
            ГОТОВЫ<br />
            <span className="text-[#f0e020]">ЗАПУСТИТЬ</span><br />
            САЙТ?
          </div>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
            Напишите нам — первая консультация бесплатно. Обсудим ваш проект и расскажем как быстро всё сделать.
          </p>
          <button className="group bg-[#f0e020] text-black font-oswald font-bold px-10 py-5 text-lg tracking-wider hover:bg-yellow-300 transition-all flex items-center gap-3 mx-auto">
            НАПИСАТЬ НАМ
            <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-oswald font-bold text-xl tracking-wider">
            ПОЕХАЛИ<span className="text-[#f0e020]">.</span>DEV
          </div>
          <div className="text-white/30 text-sm text-center">
            © 2025 Поехали.dev — ИИ-разработка сайтов
          </div>
          <div className="flex gap-6 text-white/30 text-sm">
            <a href="#" className="hover:text-white transition-colors">Telegram</a>
            <a href="#" className="hover:text-white transition-colors">VK</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}