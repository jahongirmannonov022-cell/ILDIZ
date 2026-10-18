// Interactive prerequisite graph of grades 5–9 coloured by mastery.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { chartTip } from '../lib/motion';
import { BookOpen, Network, Rewind, X } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { TOPICS, TOPIC, dependentCount } from '../data/topics';
import { LESSONS } from '../data/lessons';
import { PageHeader, Progress } from '../components/ui';
import { Portal } from '../components/Portal';
import { cn, masteryTone } from '../lib/utils';

const W = 190;
const H = 62;
const GX = 240;
const GY = 78;

function ancestors(id: string, acc = new Set<string>()) {
  for (const p of TOPIC[id].prereqs) {
    if (!acc.has(p)) {
      acc.add(p);
      ancestors(p, acc);
    }
  }
  return acc;
}

export default function KnowledgeMap() {
  const { state, update } = useUser();
  const { tx, L } = useT();
  const [sel, setSel] = useState<string | null>(null);
  const counted = useRef(false);
  const grade = state.profile.grade;

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    update((s) => ({ ...s, stats: { ...s.stats, mapVisits: s.stats.mapVisits + 1 } }));
  }, [update]);

  // Layout: one column per grade, vertically centred
  const pos = useMemo(() => {
    const byGrade: Record<number, string[]> = {};
    TOPICS.forEach((t) => (byGrade[t.grade] = [...(byGrade[t.grade] ?? []), t.id]));
    const maxRows = Math.max(...Object.values(byGrade).map((a) => a.length));
    const p: Record<string, { x: number; y: number }> = {};
    Object.entries(byGrade).forEach(([g, ids]) => {
      const off = ((maxRows - ids.length) * GY) / 2;
      ids.forEach((id, i) => (p[id] = { x: (Number(g) - 5) * GX + 20, y: 50 + off + i * GY }));
    });
    return { p, height: 50 + maxRows * GY + 10 };
  }, []);

  const related = useMemo(() => {
    if (!sel) return null;
    const anc = ancestors(sel);
    const dep = new Set(TOPICS.filter((t) => ancestors(t.id).has(sel)).map((t) => t.id));
    return { anc, dep };
  }, [sel]);

  const counts = useMemo(() => {
    let g = 0, a = 0, r = 0, f = 0;
    TOPICS.forEach((t) => {
      const v = state.mastery[t.id] ?? 0;
      if (t.grade > grade) f++;
      else if (v >= 75) g++;
      else if (v >= 50) a++;
      else r++;
    });
    return [
      { name: tx("Oʻzlashtirilgan", 'Освоено', 'Mastered'), value: g, color: '#10b981' },
      { name: tx('Mustahkamlash kerak', 'Нужно закрепить', 'Needs practice'), value: a, color: '#f59e0b' },
      { name: tx("Boʻshliq", 'Пробел', 'Gap'), value: r, color: '#f43f5e' },
      { name: tx("Hali oʻtilmagan", 'Ещё впереди', 'Not yet studied'), value: f, color: '#9ca3af' },
    ];
  }, [state.mastery, grade, tx]);

  const t = sel ? TOPIC[sel] : null;
  const tv = sel ? state.mastery[sel] ?? 0 : 0;

  return (
    <div>
      <PageHeader
        icon={<Network className="h-6 w-6" />}
        title={tx('Bilim xaritasi', 'Карта знаний', 'Knowledge map')}
        subtitle={tx(
          "5–9-sinf matematikasining 30 mavzusi va ular orasidagi bogʻlanishlar. Mavzuni bosing — uning ildizlari va keyingi mavzulari yonadi.",
          '30 тем математики 5–9 классов и связи между ними. Нажмите на тему — подсветятся её корни и зависимые темы.',
          '30 math topics of grades 5–9 and how they connect. Tap a topic to light up its roots and what depends on it.',
        )}
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="card flex items-center gap-4 p-4 sm:p-5 lg:col-span-1 lg:block">
          <div className="h-32 w-32 shrink-0 lg:h-44 lg:w-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={counts} dataKey="value" innerRadius="62%" outerRadius="92%" paddingAngle={3} stroke="none">
                  {counts.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip {...chartTip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex-1 space-y-1.5 text-sm lg:mt-2 lg:space-y-2">
            {counts.map((c) => (
              <li key={c.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                <span className="flex-1 text-muted">{c.name}</span>
                <b>{c.value}</b>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted lg:hidden">↔ {tx("Xaritani yonga suring", "Листайте карту в сторону", "Swipe the map sideways")}</p>
        <div className="card relative overflow-x-auto p-2">
          <div className="relative" style={{ width: 4 * GX + W + 40, height: pos.height }}>
            {[5, 6, 7, 8, 9].map((g) => (
              <div key={g} className="absolute top-3 text-xs font-bold uppercase tracking-widest text-muted" style={{ left: (g - 5) * GX + 20 }}>
                {g}-{tx('sinf', 'класс', 'grade')} {g === grade && <span className="ml-1 rounded bg-brand px-1.5 py-0.5 text-[10px] text-white">{tx('siz', 'вы', 'you')}</span>}
              </div>
            ))}
            <svg className="absolute inset-0" width={4 * GX + W + 40} height={pos.height} aria-hidden>
              {TOPICS.flatMap((tp) =>
                tp.prereqs.map((pr) => {
                  const a = pos.p[pr];
                  const b = pos.p[tp.id];
                  const same = a.x === b.x;
                  const d = same
                    ? `M ${a.x} ${a.y + H / 2} C ${a.x - 40} ${a.y + H / 2}, ${b.x - 40} ${b.y + H / 2}, ${b.x} ${b.y + H / 2}`
                    : `M ${a.x + W} ${a.y + H / 2} C ${a.x + W + 30} ${a.y + H / 2}, ${b.x - 30} ${b.y + H / 2}, ${b.x} ${b.y + H / 2}`;
                  const on = related && ((related.anc.has(pr) && (related.anc.has(tp.id) || tp.id === sel)) || ((pr === sel || related.dep.has(pr)) && related.dep.has(tp.id)));
                  return <path key={pr + tp.id} d={d} fill="none" stroke={on ? 'rgb(var(--brand))' : 'rgb(var(--line))'} strokeWidth={on ? 2.5 : 1.5} opacity={related && !on ? 0.35 : 1} />;
                }),
              )}
            </svg>
            {TOPICS.map((tp, i) => {
              const v = state.mastery[tp.id] ?? 0;
              const future = tp.grade > grade;
              const tone = masteryTone(v, future);
              const dim = related && tp.id !== sel && !related.anc.has(tp.id) && !related.dep.has(tp.id);
              return (
                <motion.button
                  key={tp.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: dim ? 0.35 : 1, scale: 1 }}
                  transition={{ delay: i * 0.015 }}
                  onClick={() => setSel(sel === tp.id ? null : tp.id)}
                  className={cn('absolute flex items-center gap-2 rounded-xl border bg-card px-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-glow', sel === tp.id ? 'border-brand ring-4 ring-brand/20' : 'border-line')}
                  style={{ left: pos.p[tp.id].x, top: pos.p[tp.id].y, width: W, height: H }}
                  aria-label={`${L(tp.title)} ${future ? '' : v + '%'}`}
                >
                  <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', tone.dot)} />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-xs font-semibold leading-tight">{L(tp.title)}</span>
                  </span>
                  <span className={cn('text-xs font-bold', tone.text)}>{future ? '—' : `${v}%`}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
        </div>
      </div>

      <Portal>
      <AnimatePresence>
        {t && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="card fixed inset-x-4 bottom-24 z-30 mx-auto max-w-xl p-5 shadow-glow lg:bottom-6 lg:left-auto lg:right-6"
          >
            <button className="absolute right-3 top-3 text-muted hover:text-fg" onClick={() => setSel(null)} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              {t.grade}-{tx('sinf', 'класс', 'grade')} · {t.quarter}-{tx('chorak', 'четверть', 'quarter')}
            </p>
            <h3 className="mt-1 pr-6 text-xl font-extrabold">{L(t.title)}</h3>
            {t.grade <= grade ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={tv} tone={masteryTone(tv).dot} />
                  <b className={masteryTone(tv).text}>{tv}%</b>
                </div>
                <p className="mt-3 text-sm text-muted">
                  🔓 {dependentCount(t.id)} {tx('ta keyingi mavzu shu mavzuga tayanadi', 'следующих тем опираются на эту', 'later topics build on this one')}
                  {t.prereqs.length > 0 && (
                    <>
                      {' · '}
                      {tx('Ildizlari', 'Опирается на', 'Built on')}: {t.prereqs.map((p) => L(TOPIC[p].title)).join(', ')}
                    </>
                  )}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {LESSONS[t.id] && (
                    <Link to={`/app/lesson/${t.id}`} className="btn-primary">
                      <BookOpen className="h-4 w-4" /> {tx('Mikro-dars', 'Микро-урок', 'Micro-lesson')}
                    </Link>
                  )}
                  <Link to="/app/scan" className="btn-secondary">
                    <Rewind className="h-4 w-4" /> {tx('Xatoni tekshirish', 'Проверить ошибку', 'Check a mistake')}
                  </Link>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted">{tx("Bu mavzu hali oʻtilmagan. Uning ildizlari yashil boʻlsa, oson oʻzlashtiriladi.", 'Эта тема ещё впереди. Если её корни зелёные, она дастся легко.', 'This topic is still ahead. If its roots are green, it will come easily.')}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </div>
  );
}
