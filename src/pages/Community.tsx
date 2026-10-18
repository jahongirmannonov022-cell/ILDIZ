// Community: leaderboard, tips (with likes), reviews with star ratings.
import { FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, Flame, Heart, Medal, MessageSquarePlus, Users } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { LEADERS } from '../data/mock';
import { Avatar, PageHeader, SkeletonCards, Stars, Tabs, useFakeLoad } from '../components/ui';
import { streakOf } from '../lib/game';
import { REASON } from '../lib/seed';
import { Role } from '../lib/types';
import { cn, uid } from '../lib/utils';

type Tab = 'leaders' | 'tips' | 'reviews';

export default function Community() {
  const { state, update, addPoints, toast } = useUser();
  const { tx, L } = useT();
  const loading = useFakeLoad();
  const [tab, setTab] = useState<Tab>('leaders');
  const [scope, setScope] = useState<'all' | 'city'>('all');
  const [tipText, setTipText] = useState('');
  const [tipTag, setTipTag] = useState<Role>('student');
  const [tipFilter, setTipFilter] = useState<Role | 'all'>('all');
  const [rText, setRText] = useState('');
  const [rRating, setRRating] = useState(5);

  const me = { name: state.profile.name, city: state.profile.city, points: state.points, streak: streakOf(state.activeDays), grade: state.profile.grade, me: true };
  const board = useMemo(() => {
    const all = [...LEADERS.map((l) => ({ ...l, me: false })), me].sort((a, b) => b.points - a.points);
    return scope === 'city' ? all.filter((x) => x.city === state.profile.city) : all;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, state.points, state.profile.city]);
  const myRank = board.findIndex((x) => x.me) + 1;

  const tips = state.tips.filter((t) => tipFilter === 'all' || t.tag === tipFilter).sort((a, b) => b.likes - a.likes);
  const avg = state.reviews.reduce((a, r) => a + r.rating, 0) / Math.max(1, state.reviews.length);

  const like = (id: string) => {
    const liked = state.liked.includes(id);
    update((s) => ({
      ...s,
      liked: liked ? s.liked.filter((x) => x !== id) : [...s.liked, id],
      tips: s.tips.map((t) => (t.id === id ? { ...t, likes: t.likes + (liked ? -1 : 1) } : t)),
    }));
  };

  const addTip = (e: FormEvent) => {
    e.preventDefault();
    if (tipText.trim().length < 5) return toast(tx('Maslahat juda qisqa', 'Совет слишком короткий', 'Tip is too short'), 'error');
    update((s) => ({ ...s, tips: [{ id: uid(), author: s.profile.name, city: s.profile.city, tag: tipTag, text: tipText.trim(), likes: 0 }, ...s.tips], stats: { ...s.stats, tips: s.stats.tips + 1 } }));
    setTipText('');
    addPoints(15, REASON.review, 1);
  };

  const addReview = (e: FormEvent) => {
    e.preventDefault();
    if (rText.trim().length < 5) return toast(tx('Sharh juda qisqa', 'Отзыв слишком короткий', 'Review is too short'), 'error');
    update((s) => ({ ...s, reviews: [{ id: uid(), name: s.profile.name, city: s.profile.city, rating: rRating, text: rText.trim(), date: new Date().toISOString().slice(0, 10) }, ...s.reviews], stats: { ...s.stats, reviews: s.stats.reviews + 1 } }));
    setRText('');
    setRRating(5);
    addPoints(15, REASON.review, 1);
  };

  const roleLabel = (r: Role) => (r === 'student' ? tx("Oʻquvchi", 'Ученик', 'Student') : r === 'parent' ? tx('Ota-ona', 'Родитель', 'Parent') : tx("Oʻqituvchi", 'Учитель', 'Teacher'));

  return (
    <div>
      <PageHeader icon={<Users className="h-6 w-6" />} title={tx('Hamjamiyat', 'Сообщество', 'Community')} subtitle={tx("Reyting, maslahatlar va sharhlar — butun Oʻzbekiston boʻylab", 'Рейтинг, советы и отзывы со всего Узбекистана', 'Leaderboard, tips and reviews from across Uzbekistan')} />
      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        items={[
          { id: 'leaders', label: tx('Reyting', 'Рейтинг', 'Leaderboard') },
          { id: 'tips', label: tx('Maslahatlar', 'Советы', 'Tips') },
          { id: 'reviews', label: tx('Sharhlar', 'Отзывы', 'Reviews') },
        ]}
      />

      <div className="mt-6">
        {loading ? (
          <SkeletonCards n={6} h="h-20" />
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'leaders' && (
              <motion.div key="l" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="inline-flex rounded-xl border border-line p-1 text-sm">
                    {(['all', 'city'] as const).map((s) => (
                      <button key={s} onClick={() => setScope(s)} className={cn('rounded-lg px-3 py-1.5 font-semibold', scope === s ? 'bg-fg/10' : 'text-muted')}>
                        {s === 'all' ? tx("Oʻzbekiston", 'Узбекистан', 'Uzbekistan') : state.profile.city}
                      </button>
                    ))}
                  </div>
                  <span className="chip">
                    {tx("Sizning oʻrningiz", 'Ваше место', 'Your rank')}: #{myRank}
                  </span>
                </div>
                {/* Podium */}
                <div className="mb-6 grid grid-cols-3 items-end gap-3">
                  {[1, 0, 2].map((idx) => {
                    const p = board[idx];
                    if (!p) return <div key={idx} />;
                    const h = idx === 0 ? 'h-36' : idx === 1 ? 'h-28' : 'h-24';
                    return (
                      <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }} className="text-center">
                        <Avatar name={p.name} size={48} className="mx-auto" />
                        <p className="mt-2 truncate text-sm font-bold">{p.name.split(' ')[0]}</p>
                        <p className="text-xs text-muted">{p.points}</p>
                        <div className={cn('mt-2 grid place-items-center rounded-t-2xl text-2xl font-extrabold text-white', h, idx === 0 ? 'bg-gradient-to-b from-amber-400 to-amber-500' : idx === 1 ? 'bg-gradient-to-b from-slate-300 to-slate-400' : 'bg-gradient-to-b from-orange-300 to-orange-400')}>
                          {idx === 0 ? <Crown className="h-8 w-8" /> : idx + 1}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="card divide-y divide-line/60 overflow-hidden">
                  {board.map((p, i) => (
                    <motion.div key={p.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 12) * 0.03 }} className={cn('flex items-center gap-3 px-4 py-3', p.me && 'bg-brand-soft')}>
                      <span className={cn('w-7 text-center font-extrabold', i < 3 ? 'text-amber-500' : 'text-muted')}>{i < 3 ? <Medal className="mx-auto h-5 w-5" /> : i + 1}</span>
                      <Avatar name={p.name} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {p.name} {p.me && <span className="chip ml-1 py-0.5">{tx('Siz', 'Вы', 'You')}</span>}
                        </p>
                        <p className="text-xs text-muted">
                          {p.city} · {p.grade}-{tx('sinf', 'класс', 'grade')}
                        </p>
                      </div>
                      <span className="hidden items-center gap-1 text-sm font-semibold text-orange-500 sm:flex">
                        <Flame className="h-4 w-4" /> {p.streak}
                      </span>
                      <b className="w-16 text-right">{p.points}</b>
                    </motion.div>
                  ))}
                  {!board.length && <p className="p-6 text-center text-muted">{tx("Bu shaharda hali hech kim yoʻq", 'В этом городе пока никого', 'Nobody from this city yet')}</p>}
                </div>
              </motion.div>
            )}

            {tab === 'tips' && (
              <motion.div key="t" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <form onSubmit={addTip} className="card mb-5 flex flex-col gap-3 p-4 sm:flex-row">
                  <input className="input" value={tipText} onChange={(e) => setTipText(e.target.value)} placeholder={tx("Foydali maslahatingizni yozing…", 'Поделитесь полезным советом…', 'Share a useful tip…')} aria-label={tx('Maslahat', 'Совет', 'Tip')} />
                  <select className="input sm:w-40" value={tipTag} onChange={(e) => setTipTag(e.target.value as Role)} aria-label={tx('Kim uchun', 'Для кого', 'For whom')}>
                    <option value="student">{roleLabel('student')}</option>
                    <option value="parent">{roleLabel('parent')}</option>
                    <option value="teacher">{roleLabel('teacher')}</option>
                  </select>
                  <button className="btn-primary shrink-0">
                    <MessageSquarePlus className="h-4 w-4" /> {tx("Qoʻshish", 'Добавить', 'Add')}
                  </button>
                </form>
                <div className="mb-4 flex flex-wrap gap-2">
                  {(['all', 'student', 'parent', 'teacher'] as const).map((f) => (
                    <button key={f} onClick={() => setTipFilter(f)} className={cn('rounded-full border px-3 py-1.5 text-xs font-bold', tipFilter === f ? 'border-brand bg-brand text-white' : 'border-line text-muted')}>
                      {f === 'all' ? tx('Hammasi', 'Все', 'All') : roleLabel(f)}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {tips.map((t) => {
                    const liked = state.liked.includes(t.id);
                    return (
                      <motion.div layout key={t.id} className="card card-hover p-5">
                        <p>{L(t.text)}</p>
                        <div className="mt-4 flex items-center gap-3">
                          <Avatar name={t.author} size={30} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{t.author}</p>
                            <p className="text-xs text-muted">
                              {roleLabel(t.tag)} · {t.city}
                            </p>
                          </div>
                          <motion.button whileTap={{ scale: 1.3 }} onClick={() => like(t.id)} className={cn('flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold', liked ? 'bg-rose-500/15 text-rose-500' : 'bg-fg/5 text-muted')} aria-pressed={liked} aria-label="Like">
                            <Heart className={cn('h-4 w-4', liked && 'fill-rose-500')} /> {t.likes}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {tab === 'reviews' && (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4">
                  <div className="card p-6 text-center">
                    <p className="text-5xl font-extrabold">{avg.toFixed(1)}</p>
                    <div className="mt-2 flex justify-center">
                      <Stars value={Math.round(avg)} size={20} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {state.reviews.length} {tx('ta sharh', 'отзывов', 'reviews')}
                    </p>
                    <div className="mt-4 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((n) => {
                        const c = state.reviews.filter((r) => r.rating === n).length;
                        return (
                          <div key={n} className="flex items-center gap-2 text-xs">
                            <span className="w-3">{n}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-fg/10">
                              <div className="h-full rounded-full bg-amber-400" style={{ width: `${(c / Math.max(1, state.reviews.length)) * 100}%` }} />
                            </div>
                            <span className="w-5 text-right text-muted">{c}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <form onSubmit={addReview} className="card space-y-3 p-5">
                    <p className="font-bold">{tx('Sharh qoldiring', 'Оставьте отзыв', 'Leave a review')}</p>
                    <Stars value={rRating} onChange={setRRating} size={24} />
                    <textarea className="input min-h-[90px]" value={rText} onChange={(e) => setRText(e.target.value)} placeholder={tx('Fikringiz…', 'Ваше мнение…', 'Your thoughts…')} aria-label={tx('Sharh', 'Отзыв', 'Review')} />
                    <button className="btn-primary w-full">{tx('Yuborish', 'Отправить', 'Submit')}</button>
                  </form>
                </div>
                <div className="space-y-3 lg:col-span-2">
                  {state.reviews.map((r) => (
                    <motion.div layout key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.name} size={36} />
                        <div className="flex-1">
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-xs text-muted">
                            {r.city} · {r.date}
                          </p>
                        </div>
                        <Stars value={r.rating} size={14} />
                      </div>
                      <p className="mt-3 text-sm">{L(r.text)}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
