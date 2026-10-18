// Monthly ranking between gardens + Top-5 prizes. Clicking a row opens that student's garden.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarClock, Crown, Droplets, Gift, Trophy } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { monthCountdown, monthKey, monthName, prizesFor, ranking } from '../data/gardens';
import { PLANTS } from '../lib/game';
import { Avatar } from './ui';
import { T } from '../lib/motion';
import { cn, fmtNum } from '../lib/utils';

const PLACE = [
  { ring: 'from-amber-300 to-yellow-500', text: 'text-amber-600', medal: '🥇' },
  { ring: 'from-slate-200 to-slate-400', text: 'text-slate-500', medal: '🥈' },
  { ring: 'from-orange-300 to-amber-700', text: 'text-orange-600', medal: '🥉' },
  { ring: 'from-sky-300 to-sky-500', text: 'text-sky-600', medal: '4' },
  { ring: 'from-emerald-300 to-emerald-500', text: 'text-emerald-600', medal: '5' },
];

export const gardenLink = (id: string) => (id === 'me' ? '/app/achievements' : `/app/gardens/${id}`);

export function GardenRanking() {
  const { state } = useUser();
  const { tx, L, lang } = useT();
  const months = [monthKey(0), monthKey(-1), monthKey(-2)];
  const [month, setMonth] = useState(months[0]);
  const [scope, setScope] = useState<'all' | 'city' | 'grade'>('all');
  const current = month === months[0];
  const full = useMemo(() => ranking(state, month), [state, month]);
  const rows = full.map((r, i) => ({ ...r, rank: i + 1 })).filter(({ g }) => scope === 'all' || (scope === 'city' ? g.city === state.profile.city : g.grade === state.profile.grade));
  const prizes = prizesFor(month);
  const me = full.findIndex((r) => r.g.me);
  const myScore = full[me]?.score ?? 0;
  const fifth = full[4]?.score ?? 0;
  const cd = monthCountdown();

  return (
    <div className="space-y-6">
      {/* Month switcher + countdown */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-line bg-card/60 p-1">
          {months.map((m, i) => (
            <button key={m} onClick={() => setMonth(m)} className={cn('rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors', month === m ? 'bg-brand text-white shadow-glow' : 'text-muted hover:text-fg')}>
              {monthName(m, lang)}
              {i === 0 && <span className="ml-1.5 text-[10px] opacity-80">• {tx('joriy', 'текущий', 'now')}</span>}
            </button>
          ))}
        </div>
        <span className={cn('ml-auto flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold', current ? 'bg-amber-500/15 text-amber-600' : 'bg-emerald-500/15 text-emerald-600')}>
          <CalendarClock className="h-4 w-4" />
          {current ? tx(`Oy tugashiga: ${cd.days} kun ${cd.hours} soat`, `До конца месяца: ${cd.days} дн. ${cd.hours} ч`, `Month ends in ${cd.days}d ${cd.hours}h`) : tx('Gʻoliblar aniqlandi', 'Победители определены', 'Winners announced')}
        </span>
      </div>

      {/* Top-5 prizes */}
      <div>
        <h2 className="flex items-center gap-2 font-bold">
          <Gift className="h-5 w-5 text-brand" /> {tx(`${monthName(month, 'uz')} sovgʻalari — Top 5`, `Призы за ${monthName(month, 'ru')} — Топ-5`, `${monthName(month, 'en')} prizes — Top 5`)}
        </h2>
        <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {prizes.map((p, i) => {
            const w = full[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...T.base, delay: i * 0.07 }} className={cn('card relative w-52 shrink-0 overflow-hidden p-4 lg:w-auto', i === 0 && 'border-amber-300/70')}>
                <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', PLACE[i].ring)} />
                <div className="flex items-center justify-between">
                  <span className={cn('grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br text-sm font-extrabold text-white shadow', PLACE[i].ring)}>{i < 3 ? PLACE[i].medal : i + 1}</span>
                  {i === 0 && <Crown className="h-5 w-5 text-amber-500" />}
                </div>
                <motion.div className="mt-3 text-4xl" animate={i === 0 ? { rotate: [0, -6, 6, 0] } : {}} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5 }}>
                  {p.emoji}
                </motion.div>
                <p className="mt-2 text-sm font-bold leading-snug">{L(p.title)}</p>
                <p className="text-xs text-muted">≈ {fmtNum(p.value)} {tx('soʻm', 'сум', "so'm")}</p>
                {w && (
                  <Link to={gardenLink(w.g.id)} className={cn('mt-3 flex items-center gap-2 rounded-xl p-2 transition hover:bg-fg/5', w.g.me && 'bg-brand-soft')}>
                    <Avatar name={w.g.name} size={28} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{w.g.me ? tx('Siz', 'Вы', 'You') : w.g.name}</span>
                      <span className="block text-[11px] text-muted">
                        {fmtNum(w.score)} {tx('ball', 'очк.', 'pts')} · {current ? tx('hozircha', 'пока', 'so far') : tx('gʻolib', 'победитель', 'winner')}
                      </span>
                    </span>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">{tx('* Demo: sovgʻalar roʻyxati homiylar bilan kelishiladi.', '* Демо: список призов согласуется со спонсорами.', '* Demo: the final prize list is agreed with sponsors.')}</p>
      </div>

      {/* My status */}
      {me >= 0 && (
        <div className={cn('flex flex-wrap items-center gap-3 rounded-2xl p-4', me < 5 ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg' : 'border border-brand/30 bg-brand-soft')}>
          <Trophy className={cn('h-6 w-6', me < 5 ? 'text-white' : 'text-brand')} />
          <p className="flex-1 text-sm font-semibold">
            {me < 5
              ? tx(`Siz #${me + 1} oʻrindasiz! Sovgʻa: ${prizes[me].title.uz} ${prizes[me].emoji}`, `Вы на #${me + 1} месте! Приз: ${prizes[me].title.ru} ${prizes[me].emoji}`, `You're #${me + 1}! Prize: ${prizes[me].title.en} ${prizes[me].emoji}`)
              : tx(
                  `Siz #${me + 1} oʻrindasiz. Top 5 ga chiqish uchun yana ${fmtNum(fifth - myScore + 1)} ball kerak.`,
                  `Вы на #${me + 1} месте. До топ-5 не хватает ${fmtNum(fifth - myScore + 1)} очков.`,
                  `You're #${me + 1}. You need ${fmtNum(fifth - myScore + 1)} more points for the Top 5.`,
                )}
          </p>
          {current && me >= 5 && (
            <Link to="/app/scan" className="btn-primary py-2 text-sm">
              {tx('Ball yigʻish', 'Набрать очки', 'Earn points')} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {/* Full ranking */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <h2 className="font-bold">{tx('Bogʻlar reytingi', 'Рейтинг садов', 'Garden ranking')}</h2>
          <div className="inline-flex rounded-xl bg-fg/5 p-1 text-xs font-semibold">
            {(['all', 'city', 'grade'] as const).map((s) => (
              <button key={s} onClick={() => setScope(s)} className={cn('rounded-lg px-3 py-1.5 transition-colors', scope === s ? 'bg-card text-brand shadow-sm' : 'text-muted')}>
                {s === 'all' ? tx('Hammasi', 'Все', 'All') : s === 'city' ? state.profile.city : `${state.profile.grade}-${tx('sinf', 'класс', 'grade')}`}
              </button>
            ))}
          </div>
        </div>
        <p className="border-b border-line/60 px-4 py-2 text-xs text-muted">
          {tx('Ball: oy davomida skaner, mikro-dars, ustoz bilan dars va kunlik maqsaddan yigʻiladi.', 'Очки: за месяц — сканы, микро-уроки, уроки с учителем и дневные цели.', 'Points: earned this month from scans, micro-lessons, tutor lessons and daily goals.')}
        </p>
        <div className="divide-y divide-line/60">
          {rows.map(({ g, score, rank }, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...T.base, delay: Math.min(i, 12) * 0.03 }}>
              <Link to={gardenLink(g.id)} className={cn('flex items-center gap-3 px-4 py-3 transition hover:bg-fg/5', g.me && 'bg-brand-soft')}>
                <span className={cn('w-8 text-center text-sm font-extrabold', rank <= 5 ? PLACE[rank - 1].text : 'text-muted')}>{rank <= 3 ? PLACE[rank - 1].medal : `#${rank}`}</span>
                <Avatar name={g.name} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {g.name} {g.me && <span className="chip ml-1 py-0.5">{tx('Siz', 'Вы', 'You')}</span>}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {g.city} · {g.grade}-{tx('sinf', 'класс', 'grade')} ·{' '}
                    <span aria-label={`${g.badges.length} plants`}>
                      {g.badges.slice(0, 7).map((b) => (PLANTS[b].tree ? '🌳' : '🌷')).join('')}
                      {g.badges.length > 7 ? ` +${g.badges.length - 7}` : ''}
                    </span>
                  </p>
                </div>
                {!g.me && (
                  <span className="hidden items-center gap-1 text-xs font-semibold text-sky-500 sm:flex">
                    <Droplets className="h-3.5 w-3.5" /> {g.waters + (state.watered.includes(g.id) ? 1 : 0)}
                  </span>
                )}
                <span className="w-20 text-right">
                  <b>{fmtNum(score)}</b>
                  <span className="block text-[11px] text-muted">{tx('ball', 'очков', 'points')}</span>
                </span>
                <ArrowRight className="hidden h-4 w-4 text-muted sm:block" />
              </Link>
            </motion.div>
          ))}
          {!rows.length && <p className="p-6 text-center text-sm text-muted">{tx('Bu filtrda hech kim yoʻq', 'Никого нет', 'Nobody here yet')}</p>}
        </div>
      </div>
    </div>
  );
}
