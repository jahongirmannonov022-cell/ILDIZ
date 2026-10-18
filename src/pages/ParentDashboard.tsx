// Parent platform home: the child's progress in plain language, alerts,
// upcoming tutor lessons and one thing to do today.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { AlertTriangle, ArrowRight, CalendarCheck, CheckCircle2, Clock, Flame, Flower2, HeartHandshake, Play, Send, Sparkles, Video, Wallet } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { Avatar, CountUp, Progress, SkeletonCards, Stat, useFakeLoad } from '../components/ui';
import { avgMastery, levelOf, PLANTS, streakOf } from '../lib/game';
import { recommendations } from '../lib/recommend';
import { TOPIC } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { TUTOR } from '../data/tutors';
import { chartTip, T } from '../lib/motion';
import { cn, dateKey, daysAgo, fmtDay, fmtNum, masteryTone } from '../lib/utils';

const TUTOR_LESSON = 120000;

export default function ParentDashboard() {
  const { state } = useUser();
  const { tx, L, lang } = useT();
  const loading = useFakeLoad();
  const p = state.profile;
  const child = p.childName || 'Farzandim';
  const parent = (p.parentName || p.name).split(' ')[0];
  const lvl = levelOf(state.points);
  const streak = streakOf(state.activeDays);
  const recs = recommendations(state, 3);
  const closed = state.history.filter((h) => h.closed).length;
  const lastActive = [...state.activeDays].sort().pop();
  const days = lang === 'ru' ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] : lang === 'en' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
  const chart = Array.from({ length: 7 }, (_, i) => {
    const d = daysAgo(6 - i);
    return { d: days[d.getDay()], m: state.minutes[dateKey(d)] ?? 0 };
  });
  const week = chart.reduce((a, b) => a + b.m, 0);
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming').sort((a, b) => a.start.localeCompare(b.start));
  const weakest = recs[0];
  const q = weakest && QUESTIONS[weakest.topicId]?.[0];
  const plants = state.badges.filter((b) => PLANTS[b]).length;

  if (loading)
    return (
      <div className="space-y-6">
        <div className="skeleton h-44" />
        <SkeletonCards n={4} />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Child hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand2 p-6 text-white shadow-glow sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <p className="relative text-white/85">{tx(`Assalomu alaykum, ${parent}!`, `Здравствуйте, ${parent}!`, `Hello, ${parent}!`)}</p>
        <div className="relative mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={child} size={72} className="ring-4 ring-white/30" />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold">{child}</h1>
            <p className="text-white/85">
              {p.grade}-{tx('sinf', 'класс', 'grade')} · {p.city} · {lvl.cur.emoji} {L(lvl.cur.name)}
            </p>
            <p className="mt-1 text-sm text-white/75">
              {tx('Oxirgi faollik', 'Последняя активность', 'Last active')}: {lastActive ? fmtDay(lastActive, lang) : '—'} · 🔥 {streak} {tx('kun ketma-ket', 'дней подряд', 'days in a row')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/app/parent" className="btn bg-white text-brand hover:-translate-y-0.5">
              <Play className="h-4 w-4" /> {tx('Ovozli hisobot', 'Голосовой отчёт', 'Voice report')}
            </Link>
            <Link to="/app/tutors" className="btn border border-white/40 text-white hover:bg-white/10">
              <CalendarCheck className="h-4 w-4" /> {tx('Ustoz band qilish', 'Записать к учителю', 'Book a tutor')}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat icon={<Clock className="h-4 w-4" />} label={tx('Bu hafta', 'За неделю', 'This week')} value={<><CountUp to={week} /> {tx('daq', 'мин', 'min')}</>} hint={tx('Tavsiya: kuniga 5–10 daqiqa', 'Норма: 5–10 мин в день', 'Goal: 5–10 min a day')} />
        <Stat icon={<CheckCircle2 className="h-4 w-4" />} tone="bg-emerald-500/10 text-emerald-500" label={tx('Yopilgan boʻshliqlar', 'Закрытые пробелы', 'Gaps closed')} value={<><CountUp to={closed} /> / {state.history.length}</>} />
        <Stat icon={<Sparkles className="h-4 w-4" />} tone="bg-sky-500/10 text-sky-500" label={tx('Oʻzlashtirish', 'Освоение', 'Mastery')} value={`${avgMastery(state)}%`} hint={tx('Oʻtilgan mavzular boʻyicha', 'По пройденным темам', 'Across studied topics')} />
        <Stat icon={<Wallet className="h-4 w-4" />} tone="bg-amber-500/10 text-amber-500" label={tx('Tejalgan pul', 'Сэкономлено', 'Money saved')} value={`${fmtNum((closed + state.lessonsDone.length) * TUTOR_LESSON / 1000)}k`} hint={tx("soʻm, repetitor oʻrniga", 'сум вместо репетитора', "so'm vs a tutor")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> {tx('Eʼtibor bering', 'Обратите внимание', 'Needs attention')}
          </h2>
          <p className="text-sm text-muted">{tx(`${child} qiynalayotgan mavzular — oddiy tilda`, `Темы, где ${child} испытывает трудности`, `Topics ${child} is struggling with`)}</p>
          <div className="mt-4 space-y-3">
            {recs.map((r, i) => {
              const t = TOPIC[r.topicId];
              const tone = masteryTone(r.mastery);
              return (
                <motion.div key={r.topicId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...T.base, delay: i * 0.08 }} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line p-4">
                  <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold', tone.bg, tone.text)}>{r.mastery}%</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{L(t.title)}</p>
                    <p className="text-xs text-muted">
                      {tx(`${t.grade}-sinfda oʻtilgan · keyingi ${r.unlocks} ta mavzu shunga bogʻliq`, `Пройдено в ${t.grade} классе · от неё зависят ${r.unlocks} тем`, `Grade ${t.grade} topic · ${r.unlocks} later topics depend on it`)}
                    </p>
                    <Progress value={r.mastery} className="mt-2 h-1.5" tone={tone.dot} />
                  </div>
                  <Link to={`/app/tutors?topic=${r.topicId}`} className="btn-secondary px-3 py-2 text-xs">
                    <CalendarCheck className="h-3.5 w-3.5" /> {tx('Ustoz bilan', 'С учителем', 'With a tutor')}
                  </Link>
                </motion.div>
              );
            })}
            {!recs.length && <p className="rounded-xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-600">{tx('Ajoyib! Hozircha jiddiy boʻshliq yoʻq.', 'Отлично! Серьёзных пробелов нет.', 'Great! No serious gaps right now.')}</p>}
          </div>
        </div>

        {/* Upcoming lessons */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <Video className="h-5 w-5 text-brand" /> {tx('Yaqin darslar', 'Ближайшие уроки', 'Upcoming lessons')}
          </h2>
          <div className="mt-4 space-y-3">
            {upcoming.slice(0, 3).map((b) => {
              const t = TUTOR[b.tutorId];
              return (
                <div key={b.id} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={t.name} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted">
                        {fmtDay(b.start, lang, true)} · {b.minutes} {tx('daq', 'мин', 'min')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted">{L(TOPIC[b.topicId].title)}</p>
                  <Link to={`/app/session/${b.id}`} className="btn-primary mt-3 w-full py-2 text-xs">
                    <Video className="h-3.5 w-3.5" /> {tx('Darsga kirish', 'Войти в урок', 'Join lesson')}
                  </Link>
                </div>
              );
            })}
            {!upcoming.length && (
              <div className="rounded-2xl border border-dashed border-line p-5 text-center">
                <p className="text-sm text-muted">{tx('Hali dars band qilinmagan', 'Уроков пока нет', 'No lessons booked yet')}</p>
                <Link to="/app/tutors" className="btn-primary mt-3 py-2 text-xs">
                  {tx('Ustoz tanlash', 'Выбрать учителя', 'Choose a tutor')} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's question */}
        {q && weakest && (
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <HeartHandshake className="h-5 w-5 text-brand" /> {tx('Bugun kechqurun soʻrang', 'Спросите сегодня вечером', 'Ask tonight')}
            </h2>
            <p className="mt-1 text-sm text-muted">{tx('Matematikani bilish shart emas — javob pastda', 'Знать математику не нужно — ответ ниже', 'No math needed — the answer is below')}</p>
            <p className="mt-4 text-sm font-semibold text-muted">{L(q.prompt)}</p>
            <p className="font-mono text-3xl font-extrabold text-brand">{L(q.q)}</p>
            <details className="mt-3 rounded-xl bg-fg/5 p-3 text-sm">
              <summary className="cursor-pointer font-semibold">{tx('Javobni koʻrish', 'Показать ответ', 'Show answer')}</summary>
              <p className="mt-2 font-mono text-lg font-bold text-emerald-600">{q.options[q.answer]}</p>
            </details>
            <Link to="/app/grandma" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              {tx('Yana kartochkalar', 'Ещё карточки', 'More cards')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* Weekly chart */}
        <div className="card p-6">
          <h2 className="font-bold">{tx('Hafta davomida', 'За неделю', 'This week')}</h2>
          <p className="text-sm text-muted">{tx('Kunlik shugʻullanish, daqiqa', 'Занятия по дням, мин', 'Daily practice, minutes')}</p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <XAxis dataKey="d" tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTip} cursor={{ fill: 'rgb(var(--brand) / 0.08)' }} />
                <Bar dataKey="m" name={tx('daqiqa', 'минут', 'minutes')} fill="rgb(var(--brand))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Garden teaser + latest findings */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <Flower2 className="h-5 w-5 text-emerald-500" /> {tx(`${child}ning bogʻi`, `Сад ${child}`, `${child}'s garden`)}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {tx(`Har bir yutuq — bitta gul yoki daraxt. Hozir: ${plants} ta`, `Каждое достижение — цветок или дерево. Сейчас: ${plants}`, `Every achievement plants a flower or tree. Now: ${plants}`)}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-2xl" aria-hidden>
            {state.badges.filter((b) => PLANTS[b]).map((b) => (
              <span key={b}>{PLANTS[b].tree ? '🌳' : '🌷'}</span>
            ))}
          </div>
          <Link to="/app/achievements" className="btn-secondary mt-4 w-full py-2 text-sm">
            {tx('Bogʻni koʻrish', 'Открыть сад', 'Open garden')} <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">{tx('Oxirgi topilmalar', 'Последние находки', 'Latest findings')}</p>
            <ul className="mt-2 space-y-2 text-sm">
              {state.history.slice(0, 3).map((h) => (
                <li key={h.id} className="flex gap-2">
                  <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', h.closed ? 'bg-emerald-500' : 'bg-amber-500')} />
                  <span>
                    {L(TOPIC[h.rootId].title)} ({TOPIC[h.rootId].grade}-{tx('sinf', 'кл.', 'gr.')}) — {h.closed ? tx('yopildi', 'закрыт', 'closed') : tx('ishlanmoqda', 'в работе', 'in progress')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand/30 bg-brand-soft p-5">
        <Flame className="h-6 w-6 text-brand" />
        <p className="flex-1 text-sm font-medium">
          {tx(`Maslahat: bugun ${child}ni aniq bir narsa uchun maqtang — masalan, "${streak} kun ketma-ket shugʻullanding!"`, `Совет: похвалите ${child} за конкретное — например, «${streak} дней подряд!»`, `Tip: praise ${child} for something specific — e.g. "${streak} days in a row!"`)}
        </p>
        <Link to="/app/parent" className="btn-primary py-2 text-sm">
          <Send className="h-4 w-4" /> {tx('Xabar yuborish', 'Отправить', 'Send a message')}
        </Link>
      </div>
    </div>
  );
}
