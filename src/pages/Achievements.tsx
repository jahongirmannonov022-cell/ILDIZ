// Gamification hub: level tree, points, streak calendar, badges, daily goal, points log.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Flower2, Gift, Lock, Sparkles } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { BADGE, BADGES, DAILY_TASKS, LEVELS, PLANTS, dailyDone, levelOf, streakOf } from '../lib/game';
import { Garden } from '../components/Garden';
import { CountUp, PageHeader, Progress } from '../components/ui';
import { REASON } from '../lib/seed';
import { celebrate } from '../lib/confetti';
import { cn, dateKey, daysAgo, fmtDay } from '../lib/utils';

export default function Achievements() {
  const { state, update, addPoints, settings } = useUser();
  const { tx, L, lang } = useT();
  const lvl = levelOf(state.points);
  const streak = streakOf(state.activeDays);
  const done = dailyDone(state);
  const doneCount = Object.values(done).filter(Boolean).length;
  const bonusTaken = state.dailyBonus === dateKey();
  const days = Array.from({ length: 28 }, (_, i) => dateKey(daysAgo(27 - i)));
  const active = new Set(state.activeDays);

  const claim = () => {
    update((s) => ({ ...s, dailyBonus: dateKey() }));
    addPoints(50, REASON.daily, 0);
    celebrate();
  };

  // Garden: plants earned since the last visit get the full planting animation
  const [newIds] = useState(() => state.badges.filter((b) => PLANTS[b] && !state.gardenSeen.includes(b)));
  const [selected, setSelected] = useState<string | null>(newIds[0] ?? null);
  const planted = state.badges.filter((b) => PLANTS[b]);
  const totalPlants = BADGES.filter((b) => PLANTS[b.id]).length;
  const rootsClosed = state.history.filter((h) => h.closed).length + state.lessonsDone.length;
  useEffect(() => {
    if (!newIds.length) return;
    celebrate(false);
    const t = window.setTimeout(() => update((s) => ({ ...s, gardenSeen: [...s.badges] })), 1500 + newIds.length * 1200);
    return () => window.clearTimeout(t);
  }, [newIds, update]);
  const sel = selected ? BADGE[selected] : null;
  const isParent = state.profile.role === 'parent';
  const child = state.profile.childName;

  return (
    <div>
      <PageHeader
        icon={<Flower2 className="h-6 w-6" />}
        title={isParent ? tx(`${child}ning bogʻi`, `Сад ${child}`, `${child}'s garden`) : tx('Yutuqlar bogʻi', 'Сад достижений', 'Achievement garden')}
        subtitle={tx('Har bir yutuq — bitta gul yoki daraxt. Yopilgan har bir boʻshliq — markaziy daraxtga yangi ildiz 🌱', 'Каждое достижение — цветок или дерево. Каждый закрытый пробел — новый корень у главного дерева 🌱', 'Every achievement plants a flower or tree. Every closed gap adds a root to the big tree 🌱')}
      />

      {/* Garden */}
      <div className="card mb-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <div className="flex items-center gap-2">
            <span className="chip">
              🌷 {planted.length}/{totalPlants} {tx('ekildi', 'посажено', 'planted')}
            </span>
            <span className="chip bg-amber-500/15 text-amber-600">
              🌱 {rootsClosed} {tx('ildiz', 'корней', 'roots')}
            </span>
          </div>
          <AnimatePresence>
            {newIds.length > 0 && (
              <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow">
                ✨ {tx('Yangi ekildi', 'Только что посажено', 'Just planted')}: {newIds.map((id) => L(PLANTS[id].name)).join(', ')}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-3 overflow-x-auto">
          <Garden badges={state.badges} newIds={newIds} level={lvl.index} roots={rootsClosed} dark={settings.theme === 'dark'} selected={selected} onSelect={setSelected} />
        </div>
        <AnimatePresence mode="wait">
          {sel && PLANTS[sel.id] && (
            <motion.div key={sel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4">
              <span className="text-3xl">{sel.emoji}</span>
              <div className="flex-1">
                <p className="font-bold">
                  {L(PLANTS[sel.id].name)} · <span className="text-brand">{L(sel.title)}</span>
                </p>
                <p className="text-sm text-muted">{L(sel.desc)}</p>
              </div>
              <span className="text-xs text-muted">{tx('Oʻsimlikni bosing — nima uchun ekilganini koʻring', 'Нажмите на растение — узнайте, за что оно', 'Tap a plant to see why it grew')}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Level */}
        <div className="card relative overflow-hidden p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-6">
            <motion.div className="grid h-28 w-28 place-items-center rounded-3xl bg-gradient-to-br from-brand to-brand2 text-6xl shadow-glow" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              {lvl.cur.emoji}
            </motion.div>
            <div className="flex-1">
              <p className="eyebrow">
                {tx('Daraja', 'Уровень', 'Level')} {lvl.level}
              </p>
              <h2 className="text-3xl font-extrabold">{L(lvl.cur.name)}</h2>
              <p className="mt-1 text-muted">
                <CountUp to={state.points} className="font-bold text-fg" /> {tx('ball', 'очков', 'points')}
                {lvl.next && <> · {lvl.toNext} {tx(`ball qoldi → ${lvl.next.name.uz}`, `до «${lvl.next.name.ru}»`, `to ${lvl.next.name.en}`)}</>}
              </p>
              <Progress value={lvl.pct} className="mt-3 h-3" tone="bg-gradient-to-r from-brand to-brand2" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-5 gap-2">
            {LEVELS.map((l, i) => (
              <div key={l.min} className={cn('rounded-xl p-3 text-center transition', i <= lvl.index ? 'bg-brand-soft' : 'bg-fg/5 opacity-60')}>
                <div className="text-2xl">{l.emoji}</div>
                <p className="mt-1 text-xs font-bold">{L(l.name)}</p>
                <p className="text-[10px] text-muted">{l.min}+</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily goal */}
        <div className="card p-6">
          <h2 className="font-bold">{tx('Kunlik maqsad', 'Дневная цель', 'Daily goal')}</h2>
          <Progress value={(doneCount / 3) * 100} className="mt-3" />
          <ul className="mt-4 space-y-2">
            {DAILY_TASKS.map((t) => (
              <li key={t.key}>
                <Link to={t.to} className="flex items-center gap-3 rounded-xl p-2 hover:bg-fg/5">
                  {done[t.key] ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-muted" />}
                  <span className={cn('text-sm', done[t.key] && 'text-muted line-through')}>{L(t.title)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button className="btn-primary mt-4 w-full" disabled={doneCount < 3 || bonusTaken} onClick={claim}>
            <Gift className="h-4 w-4" /> {bonusTaken ? tx('Bonus olindi ✓', 'Бонус получен ✓', 'Bonus claimed ✓') : tx('+50 bonus', '+50 бонус', '+50 bonus')}
          </button>
        </div>
      </div>

      {/* Streak calendar */}
      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{tx('Faollik kalendari', 'Календарь активности', 'Activity calendar')}</h2>
          <span className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-bold text-orange-500">
            <Flame className="h-4 w-4" /> {streak} {tx('kunlik seriya', 'дней подряд', 'day streak')}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-[repeat(14,minmax(0,1fr))]">
          {days.map((d, i) => (
            <motion.div
              key={d}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.015 }}
              title={fmtDay(d, lang)}
              className={cn('grid aspect-square place-items-center rounded-lg text-[10px] font-bold', active.has(d) ? 'bg-gradient-to-br from-orange-400 to-rose-500 text-white' : 'bg-fg/5 text-muted', d === dateKey() && 'ring-2 ring-brand')}
            >
              {new Date(d).getDate()}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{tx('Nishonlar', 'Значки', 'Badges')}</h2>
          <span className="text-sm font-bold text-brand">
            {state.badges.length}/{BADGES.length}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGES.map((b, i) => {
            const has = state.badges.includes(b.id);
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={cn('relative rounded-2xl border p-4 text-center transition', has ? 'card-hover border-brand/30 bg-brand-soft' : 'border-line bg-fg/[0.03]')}>
                {!has && <Lock className="absolute right-3 top-3 h-3.5 w-3.5 text-muted" />}
                <div className={cn('text-4xl', !has && 'opacity-30 grayscale')}>{b.emoji}</div>
                <p className="mt-2 text-sm font-bold">{L(b.title)}</p>
                <p className="text-xs text-muted">{L(b.desc)}</p>
                {PLANTS[b.id] && <p className={cn("mt-2 text-[11px] font-semibold", has ? "text-emerald-600 dark:text-emerald-400" : "text-muted/70")}>{PLANTS[b.id].tree ? "🌳" : "🌷"} {L(PLANTS[b.id].name)}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Points log */}
      <div className="card mt-6 p-6">
        <h2 className="font-bold">{tx('Ballar tarixi', 'История очков', 'Points history')}</h2>
        <div className="mt-3 divide-y divide-line/60">
          {[...state.pointsLog].reverse().slice(0, 10).map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 text-sm">
              <Sparkles className="h-4 w-4 text-brand" />
              <span className="flex-1">{L(p.reason)}</span>
              <span className="text-xs text-muted">{fmtDay(p.date, lang)}</span>
              <b className="text-emerald-500">+{p.points}</b>
            </div>
          ))}
          {!state.pointsLog.length && <p className="py-4 text-sm text-muted">{tx("Hali ball yoʻq", 'Очков пока нет', 'No points yet')}</p>}
        </div>
      </div>
    </div>
  );
}
