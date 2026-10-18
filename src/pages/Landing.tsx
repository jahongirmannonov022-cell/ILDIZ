import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, Bot, Camera, Check, ChevronDown, HeartHandshake, Minus, Network, Quote, Rewind, School, Send, Sparkles, X, Zap, BookOpen, CalendarCheck, Flower2, GraduationCap,
} from 'lucide-react';
import { Page, Reveal, CountUp, Blobs, Avatar, Stars } from '../components/ui';
import { PublicNav, Footer } from '../components/PublicNav';
import { useApp, useT } from '../store/AppContext';
import { FAQ, TESTIMONIALS } from '../data/mock';
import { cn } from '../lib/utils';

/** Looping mini Time-Machine animation shown in the hero */
function HeroDemo() {
  const { tx } = useT();
  const steps = [
    { g: 7, t: tx('Chiziqli tenglama', 'Линейное уравнение', 'Linear equation'), tone: 'bg-rose-500' },
    { g: 5, t: tx("Kasrlarni ayirish", 'Вычитание дробей', 'Subtracting fractions'), tone: 'bg-amber-500' },
    { g: 5, t: tx('Umumiy maxraj', 'Общий знаменатель', 'Common denominator'), tone: 'bg-brand' },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % 5), 1300);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="card relative mx-auto w-full max-w-md overflow-hidden p-5">
      <div className="notebook rounded-xl p-4 pl-14 font-hand text-2xl leading-9 shadow-inner">
        <p>2x + 1/3 = 5/6</p>
        <p className={cn('relative inline-block', i >= 1 && 'text-rose-600')}>
          2x = 4/3
          {i >= 1 && <motion.span layoutId="circle" className="absolute -inset-x-2 -inset-y-1 rounded-full border-2 border-rose-500" />}
        </p>
        <p>x = 2/3 ✗</p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
        <Rewind className={cn('h-4 w-4 text-brand', i >= 1 && i < 4 && 'animate-spin')} /> {tx('Vaqt mashinasi', 'Машина времени', 'Time Machine')}
      </div>
      <div className="mt-3 space-y-2">
        {steps.map((s, k) => (
          <motion.div
            key={k}
            animate={{ opacity: i >= k + 1 ? 1 : 0.25, x: i >= k + 1 ? 0 : -8 }}
            className={cn('flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5', i >= 4 && k === 2 && 'border-brand shadow-glow')}
          >
            <span className={cn('grid h-8 w-8 place-items-center rounded-lg text-xs font-extrabold text-white', s.tone)}>{s.g}</span>
            <span className="text-sm font-semibold">{s.t}</span>
            {i >= 4 && k === 2 && <span className="chip ml-auto">{tx('Ildiz', 'Корень', 'Root')} ✓</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const { tx, L } = useT();
  const { loginDemo, state } = useApp();
  const nav = useNavigate();
  const [faq, setFaq] = useState<number | null>(0);

  const startDemo = () => {
    if (!state) loginDemo();
    nav('/app/scan?auto=1');
  };

  const headline = tx('Bola xato qildi. Biz — nega ekanini topamiz.', 'Ребёнок ошибся. Мы найдём — почему.', 'Your child made a mistake. We find out why.').split(' ');

  const problems = [
    { n: 7, suffix: '/10', text: tx("ota-ona farzandi qaysi mavzuda qolib ketganini bilmaydi", 'родителей не знают, на какой теме застрял ребёнок', "parents don't know which topic their child got stuck on") },
    { n: 2, suffix: '+', text: tx('yil — bilim boʻshligʻi yashirin qolishi mumkin', 'года — пробел может оставаться незамеченным', 'years — a gap can stay hidden') },
    { n: 30, suffix: '+', text: tx("oʻquvchi — bitta oʻqituvchiga, har biriga vaqt yetmaydi", 'учеников на одного учителя — времени на каждого нет', 'students per teacher — no time for each one') },
    { n: 0, suffix: '', text: tx("oʻzbekcha vosita xatoning SABABINI koʻrsatadi", 'узбекских инструментов показывают ПРИЧИНУ ошибки', 'Uzbek tools show the CAUSE of a mistake') },
  ];

  const features = [
    { icon: Rewind, title: tx('Vaqt mashinasi', 'Машина времени', 'Time Machine'), text: tx("Xatodan boshlab sinflar boʻylab orqaga yuradi va ildizni topadi.", 'Идёт от ошибки назад по классам и находит корень.', 'Walks back through grades from a mistake to its root.'), wow: true },
    { icon: BookOpen, title: tx('5 daqiqalik mikro-dars', '5-минутный микро-урок', '5-minute micro-lesson'), text: tx("Faqat ildiz mavzu: analogiya, misol, ishoralar zinapoyasi.", 'Только корневая тема: аналогия, пример, лестница подсказок.', 'Only the root topic: analogy, example, hint ladder.') },
    { icon: Network, title: tx('Bilim xaritasi', 'Карта знаний', 'Knowledge map'), text: tx("5–9-sinf 30 mavzusi: yashil, sariq, qizil.", '30 тем 5–9 классов: зелёный, жёлтый, красный.', '30 topics of grades 5–9: green, amber, red.') },
    { icon: Send, title: tx('Ota-onaga ovozli hisobot', 'Голосовой отчёт родителям', 'Voice report for parents'), text: tx("Oʻzbekcha ovozli xabar — chet eldagi ota-ona uchun ham.", 'Голосовое сообщение на узбекском — даже для родителей за рубежом.', 'An Uzbek voice message — even for parents abroad.') },
    { icon: HeartHandshake, title: tx('Buvijon rejimi', 'Режим бабушки', 'Grandma mode'), text: tx("Katta harflar, bitta savol. Kattalar ham yordam bera oladi.", 'Крупный шрифт, один вопрос. Помочь могут и взрослые.', 'Big letters, one question. Any adult can help.') },
    { icon: School, title: tx('Sinf xaritasi', 'Карта класса', 'Class map'), text: tx("Oʻqituvchi 30 bolaning umumiy ildizini bir sahifada koʻradi.", 'Учитель видит общий корень 30 детей на одной странице.', 'Teachers see the shared root of 30 kids on one page.') },
    { icon: Bot, title: tx('Aqlli yordamchi', 'Умный помощник', 'Smart assistant'), text: tx("Javob emas — ishora beradi. Kasr va tenglamalarni qadamlab yechadi.", 'Даёт подсказки, а не ответы. Решает дроби и уравнения по шагам.', 'Hints, not answers. Solves fractions and equations step by step.') },
    { icon: CalendarCheck, title: tx('Support ustozlar', 'Support-учителя', 'Support teachers'), text: tx('Ildizga mos ustozni band qiling va onlayn yoping: video, doska, chat.', 'Запишитесь к подходящему учителю и закройте корень онлайн: видео, доска, чат.', 'Book a matched tutor and close the root online: video, whiteboard, chat.') },
  ];

  const compare = [
    { name: 'Photomath', v: [false, false, false, false, false] },
    { name: 'ChatGPT', v: ['half', false, 'half', false, false] },
    { name: tx('GDZ kanallari', 'ГДЗ-каналы', 'Answer channels'), v: [false, false, true, false, false] },
    { name: tx('Repetitor', 'Репетитор', 'Tutor'), v: [true, 'half', true, true, false] },
    { name: 'IldizAI', v: [true, true, true, true, true], us: true },
  ];
  const compareCols = [
    tx('Sababni topadi', 'Находит причину', 'Finds the cause'),
    tx('Oldingi sinflardan', 'Из прошлых классов', 'From past grades'),
    tx("Oʻzbekcha", 'На узбекском', 'In Uzbek'),
    tx('Javob bermaydi', 'Не даёт ответ', 'No answer-copying'),
    tx('Ota-onaga ovoz', 'Голос родителям', 'Voice to parents'),
  ];

  return (
    <Page>
      <PublicNav />
      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
        <Blobs />
        <div className="section grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="chip">
              <Sparkles className="h-3.5 w-3.5" /> {tx("Zamonaviy ta'lim · Xakaton 2026", 'Современное образование · Hackathon 2026', 'Modern education · Hackathon 2026')}
            </motion.span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl" aria-label={headline.join(' ')}>
              {headline.map((w, i) => (
                <motion.span
                  key={i + w}
                  aria-hidden
                  className={cn('mr-[0.25em] inline-block', i >= headline.length - 3 && 'text-gradient')}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 max-w-xl text-lg text-muted">
              {tx(
                "IldizAI daftardagi xatoni oʻqiydi va uning ildizini oldingi sinflardan topadi — hatto 5-sinfda oʻtib ketilgan mavzugacha. Keyin faqat oʻsha boʻshliqni 5 daqiqada yopadi.",
                'IldizAI читает ошибку из тетради и находит её корень в прошлых классах — вплоть до темы, пропущенной в 5 классе. Затем закрывает именно этот пробел за 5 минут.',
                'IldizAI reads the mistake in the notebook and traces its root back through earlier grades — even to a topic missed in 5th grade. Then it closes just that gap in 5 minutes.',
              )}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-8 flex flex-wrap gap-3">
              <button onClick={startDemo} className="btn-primary btn-lg group">
                <Rewind className="h-5 w-5" /> {tx("60 soniyada koʻrish", 'Смотреть за 60 секунд', 'See it in 60 seconds')}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <Link to="/signup" className="btn-secondary btn-lg">
                {tx('Bepul boshlash', 'Начать бесплатно', 'Start free')}
              </Link>
            </motion.div>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted">
              <div className="flex -space-x-2">
                {TESTIMONIALS.slice(0, 4).map((t) => (
                  <Avatar key={t.name} name={t.name} size={32} className="ring-2 ring-bg" />
                ))}
              </div>
              <span>
                <b className="text-fg">12 480+</b> {tx("oʻquvchi va ota-ona pilotda", 'учеников и родителей в пилоте', 'students & parents in the pilot')}
              </span>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <HeroDemo />
          </motion.div>
        </div>
      </section>

      {/* STORY / PROBLEM */}
      <section id="problem" className="scroll-mt-20 py-14 sm:py-20">
        <div className="section">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{tx('Muammo', 'Проблема', 'The problem')}</p>
            <h2 className="h-section mt-3">
              {tx('Jasur 7-sinfda "2" oldi.', 'Жасур получил «2» в 7 классе.', 'Jasur got a "2" in 7th grade.')}{' '}
              <span className="text-gradient">{tx('Lekin uni 5-sinfda olgan edi.', 'Но получил он её в 5-м.', 'But he earned it in 5th.')}</span>
            </h2>
            <p className="mt-4 text-muted">
              {tx(
                "Qarshi. Soat 21:00. Otasi Moskvada, onasi bozorda. Buvisi yangi dasturni bilmaydi. Jasur javobni Telegramdagi GDZ dan koʻchiradi — ertaga yana \"2\". Chunki muammo tenglamada emas: u 5-sinfda umumiy maxrajni tushunmay qolgan. Buni hech kim koʻrmaydi.",
                'Карши. 21:00. Отец в Москве, мама на базаре. Бабушка не знает новую программу. Жасур списывает из ГДЗ в Telegram — завтра снова «2». Ведь проблема не в уравнении: в 5 классе он не понял общий знаменатель. Этого никто не видит.',
                "Qarshi. 9 PM. Dad works in Moscow, mom at the bazaar. Grandma doesn't know the new curriculum. Jasur copies from a Telegram answer channel — tomorrow another '2'. The problem isn't the equation: in 5th grade he never understood common denominators. Nobody sees it.",
              )}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="card card-hover h-full p-6">
                  <div className="text-4xl font-extrabold text-brand">
                    <CountUp to={p.n} suffix={p.suffix} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            {tx(
              "* Demo koʻrsatkichlar. Taqdimotdan oldin rasmiy manbalar (stat.uz, OECD PISA 2022, World Bank) bilan tekshiring.",
              '* Демо-показатели. Перед презентацией сверьте с официальными источниками (stat.uz, OECD PISA 2022, World Bank).',
              '* Demo figures. Verify with official sources (stat.uz, OECD PISA 2022, World Bank) before presenting.',
            )}
          </p>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="scroll-mt-20 py-14 sm:py-20">
        <div className="section">
          <Reveal className="text-center">
            <p className="eyebrow">{tx('Qanday ishlaydi', 'Как это работает', 'How it works')}</p>
            <h2 className="h-section mt-3">{tx('3 qadam. 5 daqiqa.', '3 шага. 5 минут.', '3 steps. 5 minutes.')}</h2>
          </Reveal>
          <div className="relative mt-12 grid gap-6 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-transparent via-brand/40 to-transparent md:block" />
            {[
              { icon: Camera, t: tx('Xatoni yuboring', 'Отправьте ошибку', 'Send the mistake'), d: tx('Daftar rasmi yoki javobni kiriting. Qaysi qadamda xato qilinganini topamiz.', 'Фото тетради или ответ. Найдём шаг с ошибкой.', 'A notebook photo or the answer. We find the faulty step.') },
              { icon: Rewind, t: tx('Vaqt mashinasi', 'Машина времени', 'Time Machine'), d: tx("Graf boʻyicha sinflar orqaga yuradi va 3 ta savol bilan ildizni tasdiqlaydi.", 'Идём назад по графу тем и подтверждаем корень 3 вопросами.', 'Walks back the topic graph and confirms the root with 3 questions.') },
              { icon: Zap, t: tx('Yoping va xabar bering', 'Закройте и сообщите', 'Close it & share'), d: tx("5 daqiqalik mikro-dars, keyin ota-onaga oʻzbekcha ovozli hisobot.", '5-минутный микро-урок, затем голосовой отчёт родителям.', 'A 5-minute micro-lesson, then a voice report to parents.') },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="card card-hover relative h-full p-6 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand2 text-white shadow-glow">
                    <s.icon className="h-7 w-7" />
                  </div>
                  <span className="absolute right-5 top-5 text-5xl font-extrabold text-fg/5">0{i + 1}</span>
                  <h3 className="mt-5 text-lg font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-20 py-14 sm:py-20">
        <div className="section">
          <Reveal className="text-center">
            <p className="eyebrow">{tx('Imkoniyatlar', 'Возможности', 'Features')}</p>
            <h2 className="h-section mt-3">{tx('Hammasi bitta muammo uchun', 'Всё — ради одной проблемы', 'Everything serves one problem')}</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={i} delay={(i % 4) * 0.06}>
                <div className={cn('card card-hover group h-full p-6', f.wow && 'border-brand/50 bg-gradient-to-br from-brand/10 to-brand2/10')}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition group-hover:scale-110 group-hover:rotate-6">
                      <f.icon className="h-5 w-5" />
                    </span>
                    {f.wow && <span className="rounded-md bg-brand2 px-2 py-0.5 text-[10px] font-extrabold text-white">WOW</span>}
                  </div>
                  <h3 className="mt-4 font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Comparison */}
          <Reveal className="mt-16">
            <div className="card overflow-x-auto p-2">
              <table className="w-full text-xs sm:min-w-[640px] sm:text-sm">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="p-2 font-semibold sm:p-4" />
                    {compareCols.map((c) => (
                      <th key={c} className="p-1.5 text-center text-[10px] font-semibold leading-tight sm:p-4 sm:text-sm">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compare.map((r) => (
                    <tr key={r.name} className={cn('border-t border-line/60', r.us && 'bg-brand-soft')}>
                      <td className={cn("p-2 font-bold sm:p-4", r.us && "text-brand")}>{r.name}</td>
                      {r.v.map((v, i) => (
                        <td key={i} className="p-1.5 text-center sm:p-4">
                          {v === true ? <Check className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" aria-label="yes" /> : v === 'half' ? <Minus className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-amber-500" aria-label="partly" /> : <X className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-rose-400" aria-label="no" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TWO PLATFORMS */}
      <TwoPlatforms />

      {/* TESTIMONIALS */}
      <section className="overflow-hidden py-14 sm:py-20">
        <Reveal className="section text-center">
          <p className="eyebrow">{tx('Fikrlar', 'Отзывы', 'Testimonials')}</p>
          <h2 className="h-section mt-3">{tx("Ota-onalar, oʻquvchilar va oʻqituvchilar", 'Родители, ученики и учителя', 'Parents, students and teachers')}</h2>
        </Reveal>
        {[0, 1].map((row) => (
          <div key={row} className="group mt-8 flex">
            <div className={cn('flex shrink-0 gap-4 pr-4 animate-marquee group-hover:[animation-play-state:paused]', row === 1 && '[animation-direction:reverse]')}>
              {[...TESTIMONIALS.slice(row * 8, row * 8 + 8), ...TESTIMONIALS.slice(row * 8, row * 8 + 8)].map((t, i) => (
                <figure key={i} className="card w-80 shrink-0 p-5">
                  <Quote className="h-5 w-5 text-brand/50" />
                  <blockquote className="mt-2 text-sm">{L(t.text)}</blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <Avatar name={t.name} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{t.name}</p>
                      <p className="truncate text-xs text-muted">
                        {L(t.role)} · {t.city}
                      </p>
                    </div>
                    <Stars value={t.rating} size={12} />
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* IMPACT */}
      <section className="py-14 sm:py-20">
        <div className="section">
          <div className="card relative overflow-hidden p-8 sm:p-12">
            <Blobs />
            <Reveal className="text-center">
              <p className="eyebrow">{tx("Ta'sir", 'Влияние', 'Impact')}</p>
              <h2 className="h-section mt-3">{tx('Pilot natijalari', 'Результаты пилота', 'Pilot results')}</h2>
            </Reveal>
            <div className="mt-10 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
              {[
                { to: 12480, label: tx("oʻquvchi", 'учеников', 'students') },
                { to: 38920, label: tx('ildiz topildi', 'корней найдено', 'roots found') },
                { to: 4.7, d: 1, suffix: tx(' mlrd', ' млрд', 'B'), label: tx("soʻm repetitorga tejaldi", 'сумов сэкономлено на репетиторах', "soʻm saved on tutoring") },
                { to: 27, suffix: '%', label: tx("chorak natijasi oʻsdi", 'рост четвертных оценок', 'quarterly score growth') },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-4xl font-extrabold sm:text-5xl">
                    <CountUp to={s.to} decimals={s.d ?? 0} suffix={s.suffix ?? ''} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/impact" className="btn-secondary">
                {tx("Batafsil statistika", 'Подробная статистика', 'Detailed statistics')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 py-14 sm:py-20">
        <div className="section max-w-3xl">
          <Reveal className="text-center">
            <p className="eyebrow">{tx('Savol-javob', 'Вопросы и ответы', 'FAQ')}</p>
            <h2 className="h-section mt-3">{tx('Savollar', 'Вопросы', 'Questions')}</h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQ.map((f, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="card overflow-hidden">
                  <button className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold" onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>
                    {L(f.q)}
                    <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted transition', faq === i && 'rotate-180 text-brand')} />
                  </button>
                  <AnimatePresence initial={false}>
                    {faq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <p className="px-5 pb-5 text-sm text-muted">{L(f.a)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-24">
        <div className="section">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand2 p-10 text-center text-white shadow-glow sm:p-14">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <h2 className="text-3xl font-extrabold sm:text-4xl">{tx("Har bir xatoning orqasida bitta \"nega?\" bor.", 'За каждой ошибкой стоит одно «почему?».', 'Behind every mistake is one "why?".')}</h2>
              <p className="mx-auto mt-3 max-w-xl text-white/80">{tx('Biz unga javob topamiz. Bepul, 2 daqiqada.', 'Мы найдём на него ответ. Бесплатно, за 2 минуты.', 'We find the answer. Free, in 2 minutes.')}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button onClick={startDemo} className="btn btn-lg bg-white text-brand hover:-translate-y-0.5">
                  <Rewind className="h-5 w-5" /> {tx('Demoni ochish', 'Открыть демо', 'Open the demo')}
                </button>
                <Link to="/signup" className="btn btn-lg border border-white/40 text-white hover:bg-white/10">
                  {tx("Roʻyxatdan oʻtish", 'Регистрация', 'Sign up')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </Page>
  );
}

/** "Bitta oila — ikki platforma": student and parent experiences side by side */
function TwoPlatforms() {
  const { tx } = useT();
  const { loginDemo } = useApp();
  const nav = useNavigate();
  const open = (role: 'student' | 'parent') => {
    loginDemo(role);
    nav('/app');
  };
  const cards = [
    {
      role: 'student' as const,
      icon: GraduationCap,
      grad: 'from-violet-600 to-fuchsia-600',
      title: tx('Oʻquvchi platformasi', 'Платформа ученика', 'Student platform'),
      who: tx('Jasur, 13 yosh', 'Жасур, 13 лет', 'Jasur, 13'),
      items: [
        tx('Vaqt mashinasi: xatoning ildizini topadi', 'Машина времени: находит корень ошибки', 'Time Machine finds the root of a mistake'),
        tx('5 daqiqalik mikro-darslar va yordamchi', '5-минутные уроки и помощник', '5-minute lessons and an assistant'),
        tx('Support ustoz bilan onlayn dars', 'Онлайн-урок с support-учителем', 'Online lessons with a support teacher'),
        tx('Yutuqlar bogʻi: har yutuqqa gul yoki daraxt', 'Сад достижений: цветок или дерево за каждое', 'Achievement garden: a flower or tree for each'),
      ],
    },
    {
      role: 'parent' as const,
      icon: HeartHandshake,
      grad: 'from-teal-600 to-sky-600',
      title: tx('Ota-ona platformasi', 'Платформа родителя', 'Parent platform'),
      who: tx('Rustam aka, Moskvada ishlaydi', 'Рустам, работает в Москве', 'Rustam, works in Moscow'),
      items: [
        tx('Farzand natijasi oddiy tilda', 'Успехи ребёнка простым языком', "The child's progress in plain language"),
        tx('Haftalik ovozli hisobot Telegramga', 'Еженедельный голосовой отчёт в Telegram', 'A weekly voice report to Telegram'),
        tx('Ildizga mos ustozni band qilish', 'Запись к подходящему учителю', 'Book the right tutor for the gap'),
        tx('Buvijon rejimi: uyda kim boʻlsa ham yordam beradi', 'Режим бабушки: поможет любой взрослый дома', 'Grandma mode: any adult at home can help'),
      ],
    },
  ];
  return (
    <section className="py-14 sm:py-20">
      <div className="section">
        <Reveal className="text-center">
          <p className="eyebrow">{tx('Ikki platforma', 'Две платформы', 'Two platforms')}</p>
          <h2 className="h-section mt-3">{tx('Bitta oila — har kimga oʻz ekrani', 'Одна семья — у каждого свой экран', 'One family — a screen for each')}</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.role} delay={i * 0.1}>
              <div className="card card-hover h-full overflow-hidden">
                <div className={cn('flex items-center gap-4 bg-gradient-to-br p-6 text-white', c.grad)}>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20">
                    <c.icon className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold">{c.title}</h3>
                    <p className="text-sm text-white/80">{c.who}</p>
                  </div>
                </div>
                <ul className="space-y-3 p-6">
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {it}
                    </li>
                  ))}
                </ul>
                <div className="px-6 pb-6">
                  <button className="btn-secondary w-full" onClick={() => open(c.role)}>
                    {c.role === 'student' ? <Flower2 className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />}
                    {tx('Shu platformani ochish', 'Открыть эту платформу', 'Open this platform')} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
