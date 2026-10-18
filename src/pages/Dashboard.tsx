import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { chartTip } from '../lib/motion';
import { ArrowRight, CheckCircle2, Circle, Clock, Flame, Gift, Rewind, Sparkles, Target, Trophy, Video } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { CountUp, Progress, SkeletonCards, Stat, useFakeLoad } from '../components/ui';
import { avgMastery, dailyDone, DAILY_TASKS, levelOf, streakOf } from '../lib/game';
import { areaScores, recommendations } from '../lib/recommend';
import { TOPIC, AREAS } from '../data/topics';
import { PROBLEM } from '../data/problems';
import { REASON } from '../lib/seed';
import { celebrate } from '../lib/confetti';
import { cn, dateKey, daysAgo, masteryTone, fmtDay } from '../lib/utils';
import { TUTOR } from '../data/tutors';

export default function Dashboard() {
  const { state, update, addPoints } = useUser();
  const { tx, L, lang } = useT();
  const loading = useFakeLoad();
  const p = state.profile;
  const lvl = levelOf(state.points);
  const streak = streakOf(state.activeDays);
  const recs = recommendations(state);
  const done = dailyDone(state);
  const doneCount = Object.values(done).filter(Boolean).length;
  const bonusTaken = state.dailyBonus === dateKey();
  const weekMinutes = Array.from({ length: 7 }, (_, i) => state.minutes[dateKey(daysAgo(i))] ?? 0).reduce((a, b) => a + b, 0);
  const closed = state.history.filter((h) => h.closed).length;
  const nextLesson = state.bookings.filter((b) => b.status === 'upcoming').sort((a, b) => a.start.localeCompare(b.start))[0];

  const hour = new Date().getHours();
  const hello = hour < 12 ? tx('Xayrli tong', 'Доброе утро', 'Good morning') : hour < 18 ? tx('Xayrli kun', 'Добрый день', 'Good afternoon') : tx('Xayrli kech', 'Добрый вечер', 'Good evening');
  const chart = state.progress.slice(-14).map((x) => ({ d: fmtDay(x.date, lang), v: x.value }));
  const radar = areaScores(state).map((a) => ({ area: L(AREAS[a.area]), v: a.value }));

  const claimBonus = () => {
    update((s) => ({ ...s, dailyBonus: dateKey() }));
    addPoints(50, REASON.daily, 0);
    celebrate();
  };

  if (loading)
    return (
      <div className="space-y-6">
        <div className="skeleton h-40" />
        <SkeletonCards n={4} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="skeleton h-72 lg:col-span-2" />
          <div className="skeleton h-72" />
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand2 p-6 text-white shadow-glow sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-white/80">{hello},</p>
            <h1 className="text-3xl font-extrabold">{p.childName || p.name} 👋</h1>
            <p className="mt-2 max-w-md text-white/85">
              {recs[0]
                ? tx(
                    `Bugungi eng muhim qadam: "${TOPIC[recs[0].topicId].title.uz}" — u ${recs[0].unlocks} ta keyingi mavzuga ildiz.`,
                    `Главный шаг сегодня: «${TOPIC[recs[0].topicId].title.ru}» — корень для ${recs[0].unlocks} следующих тем.`,
                    `Today's key step: "${TOPIC[recs[0].topicId].title.en}" — the root of ${recs[0].unlocks} later topics.`,
                  )
                : tx('Barcha asosiy mavzular yashil! Yangi xatoni skanerlang.', 'Все базовые темы зелёные! Отсканируйте новую ошибку.', 'All core topics are green! Scan a new mistake.')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/app/scan" className="btn btn-lg bg-white text-brand hover:-translate-y-0.5">
              <Rewind className="h-5 w-5" /> {tx('Xatoni skanerlash', 'Сканировать ошибку', 'Scan a mistake')}
            </Link>
            {recs[0] && (
              <Link to={`/app/lesson/${recs[0].topicId}`} className="btn btn-lg border border-white/40 text-white hover:bg-white/10">
                {tx('Mikro-dars', 'Микро-урок', 'Micro-lesson')} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Next lesson with a support teacher */}
      {nextLesson && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-wrap items-center gap-4 p-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
            <Video className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">
              {tx('Keyingi dars', 'Следующий урок', 'Next lesson')}: {TUTOR[nextLesson.tutorId].name}
            </p>
            <p className="text-xs text-muted">
              {fmtDay(nextLesson.start, lang, true)} · {L(TOPIC[nextLesson.topicId].title)}
            </p>
          </div>
          <Link to={`/app/session/${nextLesson.id}`} className="btn-primary py-2 text-sm">
            {tx('Darsga kirish', 'Войти', 'Join')} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat icon={<Sparkles className="h-4 w-4" />} label={tx('Ballar', 'Очки', 'Points')} value={<CountUp to={state.points} />} hint={`${lvl.cur.emoji} ${L(lvl.cur.name)} · ${lvl.level}-${tx('daraja', 'уровень', 'level')}`} />
        <Stat icon={<Flame className="h-4 w-4" />} tone="bg-orange-500/10 text-orange-500" label={tx('Seriya', 'Серия', 'Streak')} value={<><CountUp to={streak} /> {tx('kun', 'дн.', 'days')}</>} hint={tx('Har kuni 5 daqiqa', 'По 5 минут в день', '5 minutes a day')} />
        <Stat icon={<Target className="h-4 w-4" />} tone="bg-emerald-500/10 text-emerald-500" label={tx('Yopilgan ildizlar', 'Закрытые корни', 'Roots closed')} value={<><CountUp to={closed} /> / {state.history.length}</>} hint={tx("Vaqt mashinasi topganlari", 'Найдены машиной времени', 'Found by the Time Machine')} />
        <Stat icon={<Clock className="h-4 w-4" />} tone="bg-sky-500/10 text-sky-500" label={tx('Bu hafta', 'За неделю', 'This week')} value={<><CountUp to={weekMinutes} /> {tx('daq', 'мин', 'min')}</>} hint={`${tx("Oʻrtacha oʻzlashtirish", 'Средний уровень', 'Average mastery')}: ${avgMastery(state)}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">{tx("Oʻzlashtirish dinamikasi", 'Динамика освоения', 'Mastery over time')}</h2>
              <p className="text-sm text-muted">{tx('Oxirgi 14 kun, %', 'Последние 14 дней, %', 'Last 14 days, %')}</p>
            </div>
            <span className="chip">+{Math.max(0, (chart[chart.length - 1]?.v ?? 0) - (chart[0]?.v ?? 0))}%</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--brand))" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="rgb(var(--brand))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTip} />
                <Area type="monotone" dataKey="v" name="%" stroke="rgb(var(--brand))" strokeWidth={3} fill="url(#gArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily goal */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">{tx('Kunlik maqsad', 'Дневная цель', 'Daily goal')}</h2>
            <span className="text-sm font-bold text-brand">{doneCount}/3</span>
          </div>
          <Progress value={(doneCount / 3) * 100} className="mt-3" />
          <ul className="mt-4 space-y-2">
            {DAILY_TASKS.map((t) => (
              <li key={t.key}>
                <Link to={t.to} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-fg/5">
                  {done[t.key] ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-muted" />}
                  <span className={cn('text-sm font-medium', done[t.key] && 'text-muted line-through')}>{L(t.title)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button className="btn-primary mt-4 w-full" disabled={doneCount < 3 || bonusTaken} onClick={claimBonus}>
            <Gift className="h-4 w-4" /> {bonusTaken ? tx('Bonus olindi ✓', 'Бонус получен ✓', 'Bonus claimed ✓') : tx('+50 bonus olish', 'Забрать +50', 'Claim +50 bonus')}
          </button>
          <div className="mt-5 rounded-xl bg-fg/5 p-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>
                {lvl.cur.emoji} {L(lvl.cur.name)}
              </span>
              {lvl.next && (
                <span className="text-muted">
                  {lvl.next.emoji} {lvl.toNext} {tx('ball qoldi', 'очков осталось', 'pts to go')}
                </span>
              )}
            </div>
            <Progress value={lvl.pct} className="mt-2 h-2" tone="bg-gradient-to-r from-brand to-brand2" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recommendations */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-bold">{tx('Shaxsiy tavsiyalar', 'Персональные рекомендации', 'Personal recommendations')}</h2>
          <p className="text-sm text-muted">{tx("Zaif + koʻp mavzuga ildiz boʻlgan mavzular birinchi", 'Сначала слабые темы, от которых зависит больше всего', 'Weak topics that unlock the most come first')}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recs.map((r, i) => {
              const t = TOPIC[r.topicId];
              const tone = masteryTone(r.mastery);
              return (
                <motion.div key={r.topicId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/app/lesson/${r.topicId}`} className="card card-hover block p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted">
                        {t.grade}-{tx('sinf', 'класс', 'grade')} · {t.quarter}-{tx('chorak', 'четв.', 'qtr')}
                      </span>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', tone.bg, tone.text)}>{r.mastery}%</span>
                    </div>
                    <p className="mt-2 font-bold">{L(t.title)}</p>
                    <p className="mt-1 text-xs text-muted">
                      🔓 {r.unlocks} {tx('ta keyingi mavzuni ochadi', 'следующих тем откроет', 'later topics unlocked')}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
            {!recs.length && <p className="text-sm text-muted">{tx("Ajoyib! Tavsiyalar yoʻq.", 'Отлично! Рекомендаций нет.', 'Great! No recommendations.')}</p>}
          </div>
        </div>

        {/* Radar */}
        <div className="card p-6">
          <h2 className="font-bold">{tx("Yoʻnalishlar boʻyicha", 'По разделам', 'By area')}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius="70%">
                <PolarGrid stroke="rgb(var(--line))" />
                <PolarAngleAxis dataKey="area" tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} />
                <Radar dataKey="v" stroke="rgb(var(--brand))" fill="rgb(var(--brand))" fillOpacity={0.35} />
                <Tooltip {...chartTip} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{tx('Topilgan ildizlar tarixi', 'История найденных корней', 'Root history')}</h2>
          <Link to="/app/achievements" className="text-sm font-semibold text-brand">
            <Trophy className="mr-1 inline h-4 w-4" />
            {tx('Yutuqlar', 'Достижения', 'Achievements')}
          </Link>
        </div>
        <div className="mt-4 divide-y divide-line/60">
          {state.history.slice(0, 6).map((h) => {
            const pr = PROBLEM[h.problemId];
            const root = TOPIC[h.rootId];
            return (
              <div key={h.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="rounded-lg bg-fg/5 px-2.5 py-1 font-mono text-sm">{pr ? L(pr.text) : '—'}</span>
                <ArrowRight className="h-4 w-4 text-muted" />
                <span className="text-sm font-semibold">
                  {root.grade}-{tx('sinf', 'кл.', 'gr.')} · {L(root.title)}
                </span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-muted">{fmtDay(h.date, lang)}</span>
                  {h.closed ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-500">{tx('Yopildi', 'Закрыт', 'Closed')}</span>
                  ) : (
                    <Link to={`/app/lesson/${h.rootId}`} className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600 hover:underline">
                      {tx('Yopish →', 'Закрыть →', 'Close →')}
                    </Link>
                  )}
                </span>
              </div>
            );
          })}
          {!state.history.length && (
            <div className="py-8 text-center">
              <p className="text-muted">{tx("Hali ildiz topilmadi. Birinchi xatoni skanerlang!", 'Корней пока нет. Отсканируйте первую ошибку!', 'No roots yet. Scan your first mistake!')}</p>
              <Link to="/app/scan" className="btn-primary mt-4">
                <Rewind className="h-4 w-4" /> {tx('Boshlash', 'Начать', 'Start')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
