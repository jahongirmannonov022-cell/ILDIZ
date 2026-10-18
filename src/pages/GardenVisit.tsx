// Visit another student's garden: their plants, roots, rank — and water it (a "like").
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Droplets, Flame, Flower2, Gift, Sprout, Trophy } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { OTHER_GARDENS, monthKey, myGarden, prizesFor, ranking } from '../data/gardens';
import { BADGE, BADGES, LEVELS, PLANTS } from '../lib/game';
import { Garden } from '../components/Garden';
import { Avatar, Progress, Stat } from '../components/ui';
import { REASON } from '../lib/seed';
import { T } from '../lib/motion';
import { cn, fmtNum } from '../lib/utils';
import NotFound from './NotFound';

export default function GardenVisit() {
  const { id = '' } = useParams();
  const owner = OTHER_GARDENS.find((g) => g.id === id);
  if (!owner) return <NotFound inApp />;
  return <Visit key={id} id={id} />;
}

function Visit({ id }: { id: string }) {
  const { state, update, addPoints, settings, toast } = useUser();
  const { tx, L } = useT();
  const owner = OTHER_GARDENS.find((g) => g.id === id)!;
  const month = monthKey(0);
  const rank = ranking(state, month).findIndex((r) => r.g.id === id) + 1;
  const prize = rank <= 5 ? prizesFor(month)[rank - 1] : null;
  const watered = state.watered.includes(id);
  const [rain, setRain] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const mine = myGarden(state);
  const total = BADGES.filter((b) => PLANTS[b.id]).length;
  const first = owner.name.split(' ')[0];

  const water = () => {
    if (watered) return;
    setRain(true);
    update((s) => ({ ...s, watered: [...s.watered, id] }));
    addPoints(2, REASON.water, 0);
    toast(tx(`${first}ning bogʻiga suv quydingiz 💧`, `Вы полили сад ${first} 💧`, `You watered ${first}'s garden 💧`));
    window.setTimeout(() => setRain(false), 2600);
  };

  const sel = selected ? BADGE[selected] : null;

  return (
    <div className="space-y-6">
      <Link to="/app/achievements?tab=rating" className="btn-ghost -ml-3 w-fit">
        <ArrowLeft className="h-4 w-4" /> {tx('Bogʻlar reytingi', 'Рейтинг садов', 'Garden ranking')}
      </Link>

      {/* Owner */}
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={owner.name} size={64} />
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{tx(`${first}ning bogʻi`, `Сад: ${first}`, `${first}'s garden`)}</h1>
          <p className="text-muted">
            {owner.name} · {owner.city} · {owner.grade}-{tx('sinf', 'класс', 'grade')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="chip py-1.5">
            <Trophy className="h-3.5 w-3.5" /> #{rank} {tx('bu oy', 'в этом месяце', 'this month')}
          </span>
          {prize && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-600">
              <Gift className="h-3.5 w-3.5" /> {prize.emoji} {L(prize.title)}
            </span>
          )}
        </div>
      </div>

      {/* Garden */}
      <div className="card relative overflow-hidden">
        <div className="overflow-x-auto">
          <Garden badges={owner.badges} newIds={[]} level={owner.level} roots={owner.roots} dark={settings.theme === 'dark'} selected={selected} onSelect={setSelected} />
        </div>
        {/* Watering animation */}
        <AnimatePresence>
          {rain && (
            <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: 26 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-lg"
                  style={{ left: `${(i * 37) % 100}%` }}
                  initial={{ top: '-8%', opacity: 0 }}
                  animate={{ top: '62%', opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.1, delay: (i % 9) * 0.12, ease: 'easeIn' }}
                >
                  💧
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4">
          {sel ? (
            <p className="flex-1 text-sm">
              <b>{L(PLANTS[sel.id].name)}</b> · <span className="text-brand">{L(sel.title)}</span> — <span className="text-muted">{L(sel.desc)}</span>
            </p>
          ) : (
            <p className="flex-1 text-sm text-muted">{tx('Oʻsimlikni bosing — u qaysi yutuq uchun ekilganini koʻring', 'Нажмите на растение — узнайте, за что оно', 'Tap a plant to see which achievement grew it')}</p>
          )}
          <motion.button whileTap={{ scale: 0.94 }} className={cn('btn', watered ? 'bg-sky-500/15 text-sky-600' : 'bg-sky-500 text-white shadow-lg hover:bg-sky-600')} onClick={water} disabled={watered}>
            <Droplets className="h-4 w-4" /> {watered ? tx('Suv quyildi', 'Полито', 'Watered') : tx('Suv quyish', 'Полить', 'Water it')} · {owner.waters + (watered ? 1 : 0)}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat icon={<Flower2 className="h-4 w-4" />} tone="bg-emerald-500/10 text-emerald-500" label={tx('Oʻsimliklar', 'Растения', 'Plants')} value={`${owner.badges.length}/${total}`} />
        <Stat icon={<Sprout className="h-4 w-4" />} tone="bg-amber-500/10 text-amber-500" label={tx('Ildizlar', 'Корни', 'Roots')} value={owner.roots} />
        <Stat icon={<Trophy className="h-4 w-4" />} label={tx('Daraja', 'Уровень', 'Level')} value={`${LEVELS[owner.level].emoji} ${L(LEVELS[owner.level].name)}`} />
        <Stat icon={<Flame className="h-4 w-4" />} tone="bg-orange-500/10 text-orange-500" label={tx('Seriya', 'Серия', 'Streak')} value={`${owner.streak} ${tx('kun', 'дн.', 'days')}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-bold">{tx('Bogʻdagi oʻsimliklar', 'Растения в саду', 'Plants in the garden')}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {owner.badges.map((b) => (
              <button key={b} onClick={() => setSelected(b)} className={cn('rounded-full border px-3 py-1 text-xs font-semibold transition', selected === b ? 'border-brand bg-brand-soft text-brand' : 'border-line hover:border-brand/50')}>
                {PLANTS[b].tree ? '🌳' : '🌷'} {L(PLANTS[b].name)}
              </button>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={T.base} className="card p-6">
          <h2 className="font-bold">{tx('Mening bogʻim bilan solishtirish', 'Сравнение с моим садом', 'Compared with my garden')}</h2>
          {[
            { l: tx('Oʻsimliklar', 'Растения', 'Plants'), a: mine.badges.length, b: owner.badges.length, max: total },
            { l: tx('Ildizlar', 'Корни', 'Roots'), a: mine.roots, b: owner.roots, max: Math.max(mine.roots, owner.roots, 1) },
            { l: tx('Bu oy ball', 'Очки за месяц', 'Points this month'), a: mine.monthly[monthKey(0)], b: owner.monthly[monthKey(0)], max: Math.max(mine.monthly[monthKey(0)], owner.monthly[monthKey(0)], 1) },
          ].map((r) => (
            <div key={r.l} className="mt-4">
              <p className="text-sm font-semibold">{r.l}</p>
              <div className="mt-1.5 grid grid-cols-[48px_1fr_56px] items-center gap-2 text-xs">
                <span className="text-muted">{tx('Siz', 'Вы', 'You')}</span>
                <Progress value={(r.a / r.max) * 100} className="h-2" />
                <b className="text-right">{fmtNum(r.a)}</b>
                <span className="truncate text-muted">{first}</span>
                <Progress value={(r.b / r.max) * 100} className="h-2" tone="bg-emerald-500" />
                <b className="text-right">{fmtNum(r.b)}</b>
              </div>
            </div>
          ))}
          <Link to="/app/achievements" className="btn-secondary mt-5 w-full">
            <Flower2 className="h-4 w-4" /> {tx('Mening bogʻim', 'Мой сад', 'My garden')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
