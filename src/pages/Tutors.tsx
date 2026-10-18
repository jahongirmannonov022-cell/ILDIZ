// Support teachers: smart matching to the child's root gap, booking a time slot,
// instant help ("2 daqiqada ulanish") and the list of my lessons.
import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck, CalendarCheck, CalendarX, Check, Clock, Globe2, Languages, MapPin, Search, Sparkles, Star, Video, X, Zap,
} from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { TUTORS, TUTOR, Tutor, slotsFor, priceFor } from '../data/tutors';
import { TOPIC, TOPICS, AREAS, Area } from '../data/topics';
import { LESSONS } from '../data/lessons';
import { recommendations } from '../lib/recommend';
import { REASON } from '../lib/seed';
import { celebrate } from '../lib/confetti';
import { Booking } from '../lib/types';
import { Avatar, PageHeader, Stars, Tabs } from '../components/ui';
import { Portal } from '../components/Portal';
import { T } from '../lib/motion';
import { cn, dateKey, fmtDay, fmtMonth, fmtNum, fmtTime, uid } from '../lib/utils';

type Tab = 'find' | 'my';

/** Rule-based match: does this tutor specialise in the child's gap? */
function matchScore(t: Tutor, topicId: string | undefined) {
  const topic = topicId ? TOPIC[topicId] : undefined;
  let s = 60 + (t.rating - 4.5) * 20 + (t.certified ? 5 : 0);
  if (topic && t.topics.includes(topic.id)) s += 25;
  else if (topic && t.areas.includes(topic.area)) s += 12;
  return Math.max(40, Math.min(99, Math.round(s)));
}

export default function Tutors() {
  const { state } = useUser();
  const { tx, L } = useT();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'find';
  const focus = params.get('topic') || recommendations(state, 1)[0]?.topicId || 'lcd';
  const [q, setQ] = useState('');
  const [area, setArea] = useState<Area | 'all'>('all');
  const [lang, setLang] = useState<'all' | 'uz' | 'ru'>('all');
  const [maxPrice, setMaxPrice] = useState(60000);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [sort, setSort] = useState<'match' | 'rating' | 'price'>('match');
  const [booking, setBooking] = useState<Tutor | null>(null);

  const list = useMemo(() => {
    const r = TUTORS.filter(
      (t) =>
        (area === 'all' || t.areas.includes(area)) &&
        (lang === 'all' || t.langs.includes(lang)) &&
        t.price30 <= maxPrice &&
        (!onlyOnline || t.online) &&
        (t.name + L(t.title) + t.city).toLowerCase().includes(q.toLowerCase()),
    ).map((t) => ({ t, score: matchScore(t, focus) }));
    if (sort === 'match') r.sort((a, b) => b.score - a.score);
    if (sort === 'rating') r.sort((a, b) => b.t.rating - a.t.rating);
    if (sort === 'price') r.sort((a, b) => a.t.price30 - b.t.price30);
    return r;
  }, [area, lang, maxPrice, onlyOnline, q, sort, focus, L]);

  const upcoming = state.bookings.filter((b) => b.status === 'upcoming').length;

  return (
    <div>
      <PageHeader
        icon={<CalendarCheck className="h-6 w-6" />}
        title={tx('Support ustozlar', 'Support-учителя', 'Support teachers')}
        subtitle={tx(
          'Ildiz topildi — endi uni tajribali ustoz bilan onlayn yoping. 1:1 video dars, umumiy doska va chat.',
          'Корень найден — закройте его онлайн с опытным учителем. Видеоурок 1:1, общая доска и чат.',
          'The root is found — now close it online with an experienced tutor. 1:1 video, shared whiteboard and chat.',
        )}
      />
      <Tabs<Tab>
        value={tab}
        onChange={(v) => setParams(v === 'find' ? {} : { tab: v })}
        items={[
          { id: 'find', label: tx('Ustoz topish', 'Найти учителя', 'Find a tutor') },
          { id: 'my', label: `${tx('Mening darslarim', 'Мои уроки', 'My lessons')}${upcoming ? ` (${upcoming})` : ''}` },
        ]}
      />

      <div className="mt-6">
        {tab === 'find' ? (
          <div className="space-y-6">
            <InstantHelp focus={focus} />

            {/* Focus banner */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand/30 bg-brand-soft p-4 text-sm">
              <Sparkles className="h-5 w-5 text-brand" />
              <span className="flex-1">
                {tx('Moslik shu ildiz boʻyicha hisoblangan:', 'Совпадение рассчитано по корню:', 'Match is calculated for the root:')}{' '}
                <b>
                  {TOPIC[focus].grade}-{tx('sinf', 'кл.', 'gr.')} · {L(TOPIC[focus].title)}
                </b>
              </span>
              <select className="input w-auto py-2 text-sm" value={focus} onChange={(e) => setParams({ topic: e.target.value })} aria-label={tx('Mavzu', 'Тема', 'Topic')}>
                {TOPICS.filter((t) => LESSONS[t.id]).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.grade} · {L(t.title)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filters */}
            <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                <input className="input pl-10" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx('Ism yoki shahar…', 'Имя или город…', 'Name or city…')} aria-label={tx('Qidirish', 'Поиск', 'Search')} />
              </div>
              <select className="input" value={area} onChange={(e) => setArea(e.target.value as Area | 'all')} aria-label={tx('Yoʻnalish', 'Раздел', 'Area')}>
                <option value="all">{tx('Barcha yoʻnalishlar', 'Все разделы', 'All areas')}</option>
                {(Object.keys(AREAS) as Area[]).map((a) => (
                  <option key={a} value={a}>
                    {L(AREAS[a])}
                  </option>
                ))}
              </select>
              <select className="input" value={lang} onChange={(e) => setLang(e.target.value as 'all' | 'uz' | 'ru')} aria-label={tx('Til', 'Язык', 'Language')}>
                <option value="all">{tx('Istalgan til', 'Любой язык', 'Any language')}</option>
                <option value="uz">Oʻzbekcha</option>
                <option value="ru">Русский</option>
              </select>
              <select className="input" value={sort} onChange={(e) => setSort(e.target.value as 'match' | 'rating' | 'price')} aria-label={tx('Saralash', 'Сортировка', 'Sort')}>
                <option value="match">{tx('Eng mos', 'Лучшее совпадение', 'Best match')}</option>
                <option value="rating">{tx('Reyting', 'Рейтинг', 'Rating')}</option>
                <option value="price">{tx('Arzonroq', 'Дешевле', 'Cheapest')}</option>
              </select>
              <div className="flex flex-col justify-center gap-1">
                <label htmlFor="price" className="flex justify-between text-xs font-semibold text-muted">
                  <span>{tx('30 daq narxi', 'Цена 30 мин', 'Price / 30 min')}</span>
                  <span className="text-fg">≤ {fmtNum(maxPrice)}</span>
                </label>
                <input id="price" type="range" min={30000} max={60000} step={2000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="accent-[rgb(var(--brand))]" />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold sm:col-span-2 lg:col-span-5">
                <input type="checkbox" checked={onlyOnline} onChange={(e) => setOnlyOnline(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--brand))]" />
                {tx('Faqat hozir onlayn', 'Только сейчас онлайн', 'Online now only')}
              </label>
            </div>

            {/* Tutor cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <AnimatePresence>
                {list.map(({ t, score }, i) => (
                  <motion.div key={t.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ ...T.base, delay: Math.min(i, 8) * 0.04 }} className="card card-hover flex flex-col p-5">
                    <div className="flex gap-4">
                      <div className="relative">
                        <Avatar name={t.name} size={56} />
                        {t.online && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" title="online" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="flex items-center gap-1.5 font-bold">
                            {t.name} {t.certified && <BadgeCheck className="h-4 w-4 shrink-0 text-brand" aria-label="certified" />}
                          </p>
                          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-extrabold', score >= 85 ? 'bg-emerald-500/15 text-emerald-600' : 'bg-fg/5 text-muted')}>
                            {score}% {tx('mos', 'совп.', 'match')}
                          </span>
                        </div>
                        <p className="text-sm text-muted">{L(t.title)}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                          <span className="flex items-center gap-1 font-semibold text-fg">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {t.rating.toFixed(1)} <span className="font-normal text-muted">({t.reviews})</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {t.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Languages className="h-3.5 w-3.5" /> {t.langs.map((l) => l.toUpperCase()).join(' · ')}
                          </span>
                          <span>
                            {t.years} {tx('yil tajriba', 'лет опыта', 'yrs exp.')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm">{L(t.bio)}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.topics.map((id) => (
                        <span key={id} className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', id === focus ? 'bg-brand text-white' : 'bg-fg/5 text-muted')}>
                          {L(TOPIC[id].title)}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <p>
                        <span className="text-lg font-extrabold">{fmtNum(t.price30)}</span>{' '}
                        <span className="text-xs text-muted">{tx("soʻm / 30 daq", 'сум / 30 мин', "so'm / 30 min")}</span>
                      </p>
                      <button className="btn-primary py-2" onClick={() => setBooking(t)}>
                        <CalendarCheck className="h-4 w-4" /> {tx('Band qilish', 'Записаться', 'Book')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {!list.length && (
              <div className="card p-10 text-center text-muted">
                <Search className="mx-auto h-8 w-8 opacity-40" />
                <p className="mt-2">{tx('Filtrlarga mos ustoz topilmadi. Narx chegarasini oshirib koʻring.', 'Никого не найдено. Попробуйте увеличить цену.', 'No tutors match. Try raising the price limit.')}</p>
              </div>
            )}
          </div>
        ) : (
          <MyLessons />
        )}
      </div>

      <Portal>
        <AnimatePresence>{booking && <BookingModal tutor={booking} focus={focus} onClose={() => setBooking(null)} />}</AnimatePresence>
      </Portal>
    </div>
  );
}

/** "Support now": connect to an online tutor in about 2 minutes */
function InstantHelp({ focus }: { focus: string }) {
  const { update, addPoints } = useUser();
  const { tx, L } = useT();
  const nav = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const best = TUTORS.filter((t) => t.online).sort((a, b) => matchScore(b, focus) - matchScore(a, focus))[0];
  const start = () => {
    setConnecting(true);
    const id = uid();
    window.setTimeout(() => {
      const b: Booking = { id, tutorId: best.id, start: new Date().toISOString(), minutes: 30, topicId: focus, note: '', price: best.price30, pay: 'click', status: 'upcoming' };
      update((s) => ({ ...s, bookings: [b, ...s.bookings] }));
      addPoints(10, REASON.booking, 0);
      nav(`/app/session/${id}`);
    }, 1800);
  };
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand2 p-6 text-white shadow-glow">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex -space-x-3">
          {TUTORS.filter((t) => t.online)
            .slice(0, 4)
            .map((t) => (
              <Avatar key={t.id} name={t.name} size={44} className="ring-2 ring-white/40" />
            ))}
        </div>
        <div className="flex-1">
          <p className="flex items-center gap-2 text-lg font-extrabold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {tx('Tezkor yordam — hozir', 'Срочная помощь — сейчас', 'Instant help — now')}
          </p>
          <p className="text-sm text-white/85">
            {tx(
              `${TUTORS.filter((t) => t.online).length} ta ustoz onlayn. "${TOPIC[focus].title.uz}" boʻyicha eng mosi: ${best.name}`,
              `${TUTORS.filter((t) => t.online).length} учителей онлайн. Лучший по теме «${TOPIC[focus].title.ru}»: ${best.name}`,
              `${TUTORS.filter((t) => t.online).length} tutors online. Best for "${L(TOPIC[focus].title)}": ${best.name}`,
            )}
          </p>
        </div>
        <button className="btn bg-white text-brand hover:-translate-y-0.5" onClick={start} disabled={connecting}>
          {connecting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand" /> : <Zap className="h-4 w-4" />}
          {connecting ? tx('Ulanmoqda…', 'Подключение…', 'Connecting…') : tx('2 daqiqada ulanish', 'Подключиться за 2 мин', 'Connect in 2 min')}
        </button>
      </div>
    </div>
  );
}

function BookingModal({ tutor, focus, onClose }: { tutor: Tutor; focus: string; onClose: () => void }) {
  const { state, update, addPoints, notify } = useUser();
  const { tx, L, lang } = useT();
  const nav = useNavigate();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  const [day, setDay] = useState(dateKey(days[0]));
  const [time, setTime] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<30 | 60>(30);
  const [topicId, setTopicId] = useState(focus);
  const [note, setNote] = useState('');
  const [pay, setPay] = useState<Booking['pay']>('click');
  const [step, setStep] = useState<'form' | 'paying' | 'done'>('form');
  const [made, setMade] = useState<Booking | null>(null);

  const now = new Date();
  const taken = new Set(state.bookings.filter((b) => b.tutorId === tutor.id && b.status === 'upcoming').map((b) => b.start.slice(0, 13)));
  const slots = slotsFor(tutor.id, day).filter((s) => {
    const dt = new Date(`${day}T${s}:00`);
    return dt.getTime() > now.getTime() + 30 * 60000 && !taken.has(dt.toISOString().slice(0, 13));
  });
  const price = priceFor(tutor, minutes);
  const weekday = (d: Date) =>
    lang === 'ru' ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getDay()] : lang === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] : ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'][d.getDay()];

  const confirm = () => {
    if (!time) return;
    setStep('paying');
    window.setTimeout(() => {
      const b: Booking = { id: uid(), tutorId: tutor.id, start: new Date(`${day}T${time}:00`).toISOString(), minutes, topicId, note: note.trim(), price, pay, status: 'upcoming' };
      update((s) => ({ ...s, bookings: [b, ...s.bookings] }));
      addPoints(20, REASON.booking, 0);
      notify({
        kind: 'success',
        link: '/app/tutors?tab=my',
        title: tx('Dars band qilindi 📅', 'Урок забронирован 📅', 'Lesson booked 📅'),
        body: `${tutor.name} · ${fmtDay(b.start, lang, true)}`,
      });
      setMade(b);
      setStep('done');
      celebrate(false);
    }, 1400);
  };

  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-end bg-black/50 backdrop-blur-sm sm:place-items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={tx('Dars band qilish', 'Запись на урок', 'Book a lesson')}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={T.spring}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <Avatar name={tutor.name} size={48} />
          <div className="flex-1">
            <p className="font-bold">{tutor.name}</p>
            <p className="text-sm text-muted">{L(tutor.title)}</p>
          </div>
          <button className="btn-ghost h-9 w-9 px-0" onClick={onClose} aria-label={tx('Yopish', 'Закрыть', 'Close')}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'done' && made ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={T.spring} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
              <Check className="h-10 w-10" />
            </motion.div>
            <h3 className="mt-5 text-2xl font-extrabold">{tx('Dars band qilindi!', 'Урок забронирован!', 'Lesson booked!')}</h3>
            <p className="mt-2 text-muted">
              {fmtDay(made.start, lang, true)} · {made.minutes} {tx('daqiqa', 'минут', 'minutes')} · {L(TOPIC[made.topicId].title)}
            </p>
            <p className="mt-1 text-xs text-muted">{tx('Dars boshlanishidan 15 daqiqa oldin eslatma keladi.', 'Напоминание придёт за 15 минут до урока.', "You'll get a reminder 15 minutes before.")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="btn-primary" onClick={() => nav(`/app/session/${made.id}`)}>
                <Video className="h-4 w-4" /> {tx('Darsga kirish (demo)', 'Войти в урок (демо)', 'Join lesson (demo)')}
              </button>
              <Link to="/app/tutors?tab=my" className="btn-secondary" onClick={onClose}>
                {tx('Mening darslarim', 'Мои уроки', 'My lessons')}
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Day */}
            <p className="label mt-6">{tx('Kun', 'День', 'Day')}</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {days.map((d) => {
                const k = dateKey(d);
                return (
                  <button key={k} onClick={() => { setDay(k); setTime(null); }} className={cn('flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2 transition', day === k ? 'border-brand bg-brand text-white shadow-glow' : 'border-line hover:border-brand/50')}>
                    <span className="text-[11px] font-semibold opacity-80">{weekday(d)}</span>
                    <span className="text-lg font-extrabold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            {/* Time */}
            <p className="label mt-5">{tx('Vaqt', 'Время', 'Time')}</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {slots.map((s) => (
                <button key={s} onClick={() => setTime(s)} className={cn('rounded-xl border py-2 text-sm font-bold transition', time === s ? 'border-brand bg-brand-soft text-brand' : 'border-line hover:border-brand/50')}>
                  {s}
                </button>
              ))}
              {!slots.length && <p className="col-span-full flex items-center gap-2 text-sm text-muted"><CalendarX className="h-4 w-4" /> {tx('Bu kunga boʻsh vaqt yoʻq — boshqa kunni tanlang', 'На этот день мест нет — выберите другой', 'No free slots — pick another day')}</p>}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="label">{tx('Davomiylik', 'Длительность', 'Duration')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {([30, 60] as const).map((m) => (
                    <button key={m} onClick={() => setMinutes(m)} className={cn('rounded-xl border py-2.5 text-sm font-bold transition', minutes === m ? 'border-brand bg-brand-soft text-brand' : 'border-line')}>
                      <Clock className="mr-1 inline h-4 w-4" /> {m} {tx('daq', 'мин', 'min')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="btopic">{tx('Qaysi ildiz ustida ishlaymiz?', 'Над каким корнем работаем?', 'Which root do we work on?')}</label>
                <select id="btopic" className="input" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                  {TOPICS.filter((t) => LESSONS[t.id]).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.grade} · {L(t.title)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="label mt-4" htmlFor="bnote">{tx('Ustozga izoh (ixtiyoriy)', 'Комментарий учителю (необязательно)', 'Note for the tutor (optional)')}</label>
            <textarea id="bnote" className="input min-h-[70px]" value={note} onChange={(e) => setNote(e.target.value)} placeholder={tx('Masalan: kasrlarni ayirishda qiynaladi', 'Например: путается в вычитании дробей', 'e.g. struggles subtracting fractions')} />

            <p className="label mt-4">{tx('Toʻlov usuli', 'Способ оплаты', 'Payment method')}</p>
            <div className="grid grid-cols-3 gap-2">
              {(['click', 'payme', 'uzcard'] as const).map((m) => (
                <button key={m} onClick={() => setPay(m)} className={cn('rounded-xl border py-2.5 text-sm font-extrabold uppercase tracking-wide transition', pay === m ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted')}>
                  {m === 'uzcard' ? 'Uzcard' : m === 'payme' ? 'Payme' : 'Click'}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-fg/5 p-4 sm:flex-row sm:items-center">
              <div className="flex-1 text-sm">
                <p className="text-muted">{tx('Jami', 'Итого', 'Total')}</p>
                <p className="text-2xl font-extrabold">
                  {fmtNum(price)} <span className="text-sm font-semibold text-muted">{tx("soʻm", 'сум', "so'm")}</span>
                </p>
                <p className="text-xs text-muted">{tx('Demo: haqiqiy toʻlov olinmaydi', 'Демо: реальная оплата не списывается', 'Demo: no real payment is taken')}</p>
              </div>
              <button className="btn-primary btn-lg" onClick={confirm} disabled={!time || step === 'paying'}>
                {step === 'paying' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <CalendarCheck className="h-5 w-5" />}
                {step === 'paying' ? tx('Tasdiqlanmoqda…', 'Подтверждение…', 'Confirming…') : time ? tx(`${time} ga band qilish`, `Записаться на ${time}`, `Book ${time}`) : tx('Vaqtni tanlang', 'Выберите время', 'Pick a time')}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function MyLessons() {
  const { state, update, toast } = useUser();
  const { tx, L, lang } = useT();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming').sort((a, b) => a.start.localeCompare(b.start));
  const past = state.bookings.filter((b) => b.status !== 'upcoming').sort((a, b) => b.start.localeCompare(a.start));
  const spent = state.bookings.filter((b) => b.status === 'done').reduce((a, b) => a + b.price, 0);

  const cancel = (id: string) => {
    update((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)) }));
    setConfirmId(null);
    toast(tx('Dars bekor qilindi, pul qaytariladi', 'Урок отменён, деньги вернутся', 'Lesson cancelled, refund on the way'), 'info');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <h2 className="font-bold">{tx('Kelgusi darslar', 'Предстоящие уроки', 'Upcoming lessons')}</h2>
        {upcoming.map((b) => {
          const t = TUTOR[b.tutorId];
          return (
            <motion.div layout key={b.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-soft text-center text-brand">
                <span className="text-xs font-bold leading-none">{fmtMonth(b.start, lang)}</span>
                <span className="text-2xl font-extrabold leading-none">{new Date(b.start).getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-muted">
                  {fmtTime(b.start)} · {b.minutes} {tx('daq', 'мин', 'min')} · {L(TOPIC[b.topicId].title)}
                </p>
                {b.note && <p className="mt-1 text-xs italic text-muted">“{b.note}”</p>}
              </div>
              <div className="flex gap-2">
                {confirmId === b.id ? (
                  <>
                    <button className="btn bg-rose-500 px-3 py-2 text-xs text-white" onClick={() => cancel(b.id)}>
                      {tx('Ha, bekor qilish', 'Да, отменить', 'Yes, cancel')}
                    </button>
                    <button className="btn-ghost py-2 text-xs" onClick={() => setConfirmId(null)}>
                      {tx('Yoʻq', 'Нет', 'No')}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-ghost py-2 text-xs" onClick={() => setConfirmId(b.id)}>
                      {tx('Bekor qilish', 'Отменить', 'Cancel')}
                    </button>
                    <Link to={`/app/session/${b.id}`} className="btn-primary py-2 text-xs">
                      <Video className="h-4 w-4" /> {tx('Darsga kirish', 'Войти', 'Join')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
        {!upcoming.length && (
          <div className="card p-8 text-center">
            <CalendarCheck className="mx-auto h-10 w-10 text-muted/50" />
            <p className="mt-2 text-muted">{tx('Kelgusi dars yoʻq', 'Предстоящих уроков нет', 'No upcoming lessons')}</p>
            <Link to="/app/tutors" className="btn-primary mt-4">
              {tx('Ustoz topish', 'Найти учителя', 'Find a tutor')}
            </Link>
          </div>
        )}

        <h2 className="pt-4 font-bold">{tx('Oʻtgan darslar', 'Прошедшие уроки', 'Past lessons')}</h2>
        {past.map((b) => {
          const t = TUTOR[b.tutorId];
          return (
            <div key={b.id} className={cn('card flex flex-wrap items-center gap-4 p-4', b.status === 'cancelled' && 'opacity-60')}>
              <Avatar name={t.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted">
                  {fmtDay(b.start, lang, true)} · {L(TOPIC[b.topicId].title)}
                </p>
                {b.review && <p className="mt-1 text-xs italic">“{b.review}”</p>}
              </div>
              {b.status === 'cancelled' ? (
                <span className="rounded-full bg-fg/10 px-2.5 py-1 text-xs font-bold text-muted">{tx('Bekor qilingan', 'Отменён', 'Cancelled')}</span>
              ) : (
                <Stars value={b.rating ?? 0} size={14} />
              )}
            </div>
          );
        })}
        {!past.length && <p className="text-sm text-muted">{tx('Hali oʻtgan dars yoʻq', 'Прошедших уроков нет', 'No past lessons yet')}</p>}
      </div>

      <div className="space-y-4">
        <div className="card p-6">
          <h2 className="font-bold">{tx('Statistika', 'Статистика', 'Stats')}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">{tx('Oʻtgan darslar', 'Проведено уроков', 'Lessons done')}</dt><dd className="font-bold">{state.bookings.filter((b) => b.status === 'done').length}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">{tx('Kelgusi', 'Предстоит', 'Upcoming')}</dt><dd className="font-bold">{upcoming.length}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">{tx('Sarflangan', 'Потрачено', 'Spent')}</dt><dd className="font-bold">{fmtNum(spent)} {tx("soʻm", 'сум', "so'm")}</dd></div>
          </dl>
        </div>
        <div className="card p-6 text-sm">
          <p className="flex items-center gap-2 font-bold">
            <Globe2 className="h-4 w-4 text-brand" /> {tx('Dars qanday oʻtadi?', 'Как проходит урок?', 'How does a lesson work?')}
          </p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted">
            <li>{tx('Ustoz IldizAI tahlilini oldindan koʻradi', 'Учитель заранее видит анализ IldizAI', 'The tutor sees the IldizAI analysis in advance')}</li>
            <li>{tx('Video, umumiy doska va chat', 'Видео, общая доска и чат', 'Video, shared whiteboard and chat')}</li>
            <li>{tx('Darsdan keyin ota-onaga xulosa', 'После урока — итог родителям', 'A summary goes to parents after')}</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
