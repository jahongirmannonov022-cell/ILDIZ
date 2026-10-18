// Teacher view: class heatmap of root topics, biggest shared gaps, actions.
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { chartTip } from '../lib/motion';
import { Download, Lightbulb, School, Send, Users, X } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { Avatar, PageHeader, Progress, Stat } from '../components/ui';
import { Portal } from '../components/Portal';
import { CLASS_STUDENTS, CLASS_TOPICS } from '../data/mock';
import { TOPIC } from '../data/topics';
import { REASON } from '../lib/seed';
import { cn, masteryTone } from '../lib/utils';
import { tri, Tri } from '../lib/types';

// Short, unambiguous column labels for the heatmap and chart
const SHORT: Record<string, Tri> = {
  lcd: tri('Umumiy maxraj', 'Общий знам.', 'Common denom.'),
  fracAdd: tri('Kasr ±', 'Дроби ±', 'Fractions ±'),
  negAdd: tri('Manfiy ±', 'Отриц. ±', 'Negatives ±'),
  negMul: tri('Manfiy ×', 'Отриц. ×', 'Negatives ×'),
  brackets: tri('Qavslar', 'Скобки', 'Brackets'),
  likeTerms: tri('Oʻxshash hadlar', 'Подобные', 'Like terms'),
  linearEq: tri('Tenglama', 'Уравнения', 'Equations'),
  powers: tri('Daraja', 'Степени', 'Powers'),
};

export default function Teacher() {
  const { addPoints, notify, toast } = useUser();
  const { tx, L } = useT();
  const [sort, setSort] = useState<string>('name');
  const [student, setStudent] = useState<(typeof CLASS_STUDENTS)[number] | null>(null);
  const [sentTopics, setSentTopics] = useState<string[]>([]);

  const gaps = useMemo(
    () =>
      CLASS_TOPICS.map((t) => ({
        id: t,
        name: L(TOPIC[t].title),
        short: L(SHORT[t]),
        count: CLASS_STUDENTS.filter((s) => s.scores[t] < 50).length,
        avg: Math.round(CLASS_STUDENTS.reduce((a, s) => a + s.scores[t], 0) / CLASS_STUDENTS.length),
      })).sort((a, b) => b.count - a.count),
    [L],
  );
  const top = gaps[0];
  const rows = useMemo(() => {
    const r = [...CLASS_STUDENTS];
    if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name));
    else r.sort((a, b) => a.scores[sort] - b.scores[sort]);
    return r;
  }, [sort]);
  const classAvg = Math.round(gaps.reduce((a, g) => a + g.avg, 0) / gaps.length);

  const sendPractice = (topicId: string) => {
    setSentTopics((s) => [...s, topicId]);
    addPoints(20, REASON.teacher, 2);
    notify({ kind: 'success', link: '/app/teacher', title: tx('Sinfga mashq yuborildi', 'Упражнение отправлено классу', 'Practice sent to class'), body: TOPIC[topicId].title });
    toast(tx(`24 oʻquvchiga 5 daqiqalik mashq yuborildi`, 'Упражнение отправлено 24 ученикам', 'Sent a 5-minute drill to 24 students'));
  };

  const exportCsv = () => {
    const header = ['Name', ...CLASS_TOPICS.map((t) => TOPIC[t].title.en)].join(',');
    const lines = CLASS_STUDENTS.map((s) => [s.name, ...CLASS_TOPICS.map((t) => s.scores[t])].join(','));
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ildizai-7B-class-map.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast(tx('CSV yuklab olindi', 'CSV скачан', 'CSV downloaded'));
  };

  return (
    <div>
      <PageHeader
        icon={<School className="h-6 w-6" />}
        title={tx('Sinf xaritasi', 'Карта класса', 'Class map')}
        subtitle={tx("7-«B» sinf · Qarshi sh., 12-maktab · 24 oʻquvchi", '7 «Б» · г. Карши, школа №12 · 24 ученика', 'Class 7-B · Qarshi, School #12 · 24 students')}
        action={
          <button className="btn-secondary" onClick={exportCsv}>
            <Download className="h-4 w-4" /> {tx('CSV yuklab olish', 'Скачать CSV', 'Download CSV')}
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Stat icon={<Users className="h-4 w-4" />} label={tx("Oʻquvchilar", 'Учеников', 'Students')} value={CLASS_STUDENTS.length} />
        <Stat icon={<School className="h-4 w-4" />} tone="bg-amber-500/10 text-amber-500" label={tx("Sinf oʻrtachasi", 'Средний по классу', 'Class average')} value={`${classAvg}%`} />
        <Stat icon={<Lightbulb className="h-4 w-4" />} tone="bg-rose-500/10 text-rose-500" label={tx('Eng katta ildiz', 'Главный корень', 'Biggest root')} value={`${top.count}/24`} hint={top.name} />
      </div>

      {/* Insight */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-brand to-brand2 p-6 text-white shadow-glow sm:flex-row sm:items-center">
        <Lightbulb className="h-10 w-10 shrink-0" />
        <div className="flex-1">
          <p className="text-lg font-extrabold">
            {tx(`24 oʻquvchidan ${top.count} tasida "${top.name}" boʻshligʻi bor.`, `У ${top.count} из 24 учеников пробел «${top.name}».`, `${top.count} of 24 students share the "${top.name}" gap.`)}
          </p>
          <p className="text-white/85">{tx("Tavsiya: ertangi darsning birinchi 10 daqiqasini shu mavzuga bering.", 'Совет: посвятите этой теме первые 10 минут завтрашнего урока.', "Tip: spend the first 10 minutes of tomorrow's lesson on it.")}</p>
        </div>
        <button className="btn shrink-0 bg-white text-brand" onClick={() => sendPractice(top.id)} disabled={sentTopics.includes(top.id)}>
          <Send className="h-4 w-4" /> {sentTopics.includes(top.id) ? tx('Yuborildi ✓', 'Отправлено ✓', 'Sent ✓') : tx('Mashq yuborish', 'Отправить упражнение', 'Send drill')}
        </button>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="font-bold">{tx("Boʻshligʻi bor oʻquvchilar soni", 'Учеников с пробелом', 'Students with a gap')}</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gaps} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" horizontal={false} />
                <XAxis type="number" domain={[0, 24]} tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="short" width={110} tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgb(var(--brand) / 0.08)' }} {...chartTip} />
                <Bar dataKey="count" name={tx("oʻquvchi", 'учеников', 'students')} radius={[0, 8, 8, 0]}>
                  {gaps.map((g, i) => (
                    <Cell key={g.id} fill={i === 0 ? '#f43f5e' : i < 3 ? '#f59e0b' : 'rgb(var(--brand))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
            <h2 className="font-bold">{tx('Issiqlik xaritasi', 'Тепловая карта', 'Heatmap')}</h2>
            <label className="flex w-full min-w-0 items-center gap-2 text-sm text-muted sm:w-auto">
              {tx('Saralash', 'Сортировка', 'Sort')}
              <select className="input min-w-0 flex-1 py-2 sm:w-56 sm:flex-none" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">{tx('Ism', 'Имя', 'Name')}</option>
                {CLASS_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {L(TOPIC[t].title)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="sticky top-0 bg-card">
                <tr>
                  <th className="p-3 text-left font-semibold text-muted">{tx("Oʻquvchi", 'Ученик', 'Student')}</th>
                  {CLASS_TOPICS.map((t) => (
                    <th key={t} className="p-2 text-center text-[11px] font-semibold text-muted" title={L(TOPIC[t].title)}>
                      {L(SHORT[t])}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="cursor-pointer border-t border-line/50 hover:bg-fg/5" onClick={() => setStudent(s)}>
                    <td className="flex items-center gap-2 p-3 font-medium">
                      <Avatar name={s.name} size={26} /> {s.name}
                    </td>
                    {CLASS_TOPICS.map((t) => {
                      const v = s.scores[t];
                      return (
                        <td key={t} className="p-1.5">
                          <div className="mx-auto grid h-8 w-12 place-items-center rounded-lg text-xs font-bold text-white" style={{ background: masteryTone(v).hex, opacity: 0.35 + v / 160 }}>
                            {v}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Portal>
      <AnimatePresence>
        {student && (
          <motion.div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setStudent(null)}>
            <motion.div className="h-full w-full max-w-md overflow-y-auto bg-card p-6" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size={44} />
                  <div>
                    <p className="font-bold">{student.name}</p>
                    <p className="text-sm text-muted">7-«B»</p>
                  </div>
                </div>
                <button className="btn-ghost h-9 w-9 px-0" onClick={() => setStudent(null)} aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {CLASS_TOPICS.map((t) => {
                  const v = student.scores[t];
                  return (
                    <div key={t}>
                      <div className="flex justify-between text-sm">
                        <span>{L(TOPIC[t].title)}</span>
                        <b className={masteryTone(v).text}>{v}%</b>
                      </div>
                      <Progress value={v} className="mt-1.5" tone={masteryTone(v).dot} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 rounded-xl bg-brand-soft p-4 text-sm">
                <b>{tx('Asosiy ildiz:', 'Главный корень:', 'Main root:')}</b>{' '}
                {L(TOPIC[CLASS_TOPICS.reduce((m, t) => (student.scores[t] < student.scores[m] ? t : m), CLASS_TOPICS[0])].title)}
              </div>
              <button
                className={cn('btn-primary mt-4 w-full')}
                onClick={() => {
                  toast(tx(`${student.name}ga shaxsiy mashq yuborildi`, `${student.name}: отправлено личное упражнение`, `Personal drill sent to ${student.name}`));
                  setStudent(null);
                }}
              >
                <Send className="h-4 w-4" /> {tx('Shaxsiy mashq yuborish', 'Отправить личное упражнение', 'Send personal drill')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </div>
  );
}
