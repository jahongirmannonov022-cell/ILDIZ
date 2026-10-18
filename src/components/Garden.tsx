// "Yutuqlar bogʻi": every earned badge plants a flower or a tree.
// The big centre tree grows with the level, and its roots under the soil
// grow with every closed gap — the IldizAI idea made visible.
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BADGES, PLANTS, Plant } from '../lib/game';
import { cn } from '../lib/utils';

const LEAF = '#22c55e';
const LEAF_DARK = '#15803d';
const TRUNK = '#7c4a1e';

/** One plant drawn around its base point (0,0), growing upwards */
function PlantShape({ plant }: { plant: Plant }) {
  const c = plant.color;
  switch (plant.kind) {
    case 'tulip':
      return (
        <g>
          <path d="M0 0 C 2 -20, -2 -40, 0 -58" stroke={LEAF_DARK} strokeWidth="3" fill="none" />
          <path d="M0 -10 C -18 -18 -20 -34 -7 -40 C -6 -28 -3 -18 0 -10Z" fill={LEAF} />
          <path d="M0 -16 C 16 -22 18 -36 7 -42 C 6 -30 3 -22 0 -16Z" fill={LEAF_DARK} />
          <path d="M-11 -58 C -13 -74 -6 -82 0 -74 C 6 -82 13 -74 11 -58 Q 0 -50 -11 -58Z" fill={c} />
          <path d="M-4 -60 C -4 -70 0 -76 0 -74 C 0 -76 4 -70 4 -60Z" fill="#fff" opacity=".25" />
        </g>
      );
    case 'daisy':
      return (
        <g>
          <path d="M0 0 C -2 -18, 2 -36, 0 -52" stroke={LEAF_DARK} strokeWidth="2.5" fill="none" />
          <path d="M0 -14 C -14 -16 -18 -28 -8 -32 C -6 -24 -3 -18 0 -14Z" fill={LEAF} />
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={i} cx="0" cy="-64" rx="3.4" ry="9" fill={c} stroke="#e5e7eb" strokeWidth=".6" transform={`rotate(${i * 30} 0 -56)`} />
          ))}
          <circle cx="0" cy="-56" r="5.5" fill="#f59e0b" />
        </g>
      );
    case 'sunflower':
      return (
        <g>
          <path d="M0 0 C 3 -26, -3 -50, 0 -70" stroke={LEAF_DARK} strokeWidth="4" fill="none" />
          <path d="M0 -24 C -22 -26 -28 -42 -12 -48 C -10 -36 -4 -28 0 -24Z" fill={LEAF} />
          <path d="M0 -36 C 22 -38 26 -54 10 -58 C 8 -48 4 -40 0 -36Z" fill={LEAF_DARK} />
          {Array.from({ length: 16 }).map((_, i) => (
            <ellipse key={i} cx="0" cy="-86" rx="4" ry="11" fill={c} transform={`rotate(${i * 22.5} 0 -75)`} />
          ))}
          <circle cx="0" cy="-75" r="9" fill="#78350f" />
          <circle cx="-3" cy="-77" r="1.2" fill="#fbbf24" />
          <circle cx="3" cy="-73" r="1.2" fill="#fbbf24" />
        </g>
      );
    case 'rose':
      return (
        <g>
          <path d="M0 0 C 2 -18, -2 -36, 0 -52" stroke={LEAF_DARK} strokeWidth="3" fill="none" />
          <path d="M-1 -20 l-5 -3 M1 -32 l5 -3" stroke={LEAF_DARK} strokeWidth="2" />
          <path d="M0 -18 C -16 -20 -18 -32 -8 -36 C -6 -28 -3 -22 0 -18Z" fill={LEAF} />
          <circle cx="0" cy="-60" r="11" fill={c} />
          <circle cx="-3" cy="-62" r="7" fill="#000" opacity=".12" />
          <path d="M-5 -60 C -5 -66 5 -66 5 -60 C 5 -56 -1 -55 -2 -59" stroke="#fff" strokeWidth="1.4" fill="none" opacity=".45" />
        </g>
      );
    case 'fruitTree':
    case 'blossomTree': {
      const blossom = plant.kind === 'blossomTree';
      const dots = [[-14, -82], [10, -88], [20, -70], [-22, -66], [0, -72], [-8, -96], [16, -58], [-28, -80], [26, -84], [4, -102]];
      return (
        <g>
          <path d="M-5 0 L-3 -50 L3 -50 L5 0Z" fill={TRUNK} />
          <path d="M0 -38 L-14 -54 M0 -44 L12 -58" stroke={TRUNK} strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="-80" r="28" fill={blossom ? '#86efac' : LEAF} />
          <circle cx="-20" cy="-66" r="20" fill={blossom ? '#bbf7d0' : LEAF_DARK} />
          <circle cx="20" cy="-68" r="21" fill={blossom ? '#86efac' : '#16a34a'} />
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={blossom ? 3 : 3.8} fill={c} stroke={blossom ? '#f472b6' : 'none'} strokeWidth=".6" />
          ))}
        </g>
      );
    }
    case 'pine':
      return (
        <g>
          <rect x="-4" y="-16" width="8" height="16" fill={TRUNK} />
          <path d="M0 -104 L-22 -62 L22 -62Z" fill="#16a34a" />
          <path d="M0 -84 L-28 -38 L28 -38Z" fill={c} />
          <path d="M0 -62 L-34 -14 L34 -14Z" fill="#14532d" />
        </g>
      );
    case 'chinor':
      return (
        <g>
          <path d="M-9 0 C -7 -30 -6 -50 -4 -64 L4 -64 C 6 -50 7 -30 9 0Z" fill={TRUNK} />
          <path d="M-2 -50 L-24 -74 M2 -56 L22 -80" stroke={TRUNK} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="0" cy="-104" rx="46" ry="34" fill={LEAF_DARK} />
          <ellipse cx="-30" cy="-84" rx="30" ry="24" fill={c} />
          <ellipse cx="30" cy="-86" rx="30" ry="24" fill="#22c55e" />
          <ellipse cx="0" cy="-122" rx="28" ry="20" fill="#4ade80" />
        </g>
      );
  }
}

/** Plant with a growth animation; new plants get a seed drop + sparkles */
function GrowingPlant({ plant, x, y, scale, delay, isNew, title }: { plant: Plant; x: number; y: number; scale: number; delay: number; isNew: boolean; title: string }) {
  const growDelay = isNew ? delay + 0.9 : delay;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <title>{title}</title>
      {isNew && (
        <>
          <motion.circle r="4" fill="#7c4a1e" initial={{ cy: -140, opacity: 1 }} animate={{ cy: -2, opacity: [1, 1, 0] }} transition={{ duration: 0.7, delay, ease: 'easeIn' }} />
          {[-1, 1, -0.5, 0.5].map((d, i) => (
            <motion.circle key={i} r="2.4" fill="#a16207" initial={{ cx: 0, cy: 0, opacity: 0 }} animate={{ cx: d * 18, cy: -10 - (i % 2) * 6, opacity: [0, 1, 0] }} transition={{ duration: 0.6, delay: delay + 0.7 }} />
          ))}
        </>
      )}
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12, delay: growDelay }} style={{ originX: 0.5, originY: 1 }}>
        <motion.g animate={{ rotate: plant.tree ? [-1, 1, -1] : [-3, 3, -3] }} transition={{ duration: plant.tree ? 6 : 3.5, repeat: Infinity, ease: 'easeInOut', delay: growDelay + 0.5 }} style={{ originX: 0.5, originY: 1 }}>
          <PlantShape plant={plant} />
        </motion.g>
      </motion.g>
      {isNew &&
        [[-26, -70], [24, -90], [0, -118], [30, -50]].map(([sx, sy], i) => (
          <motion.path
            key={i}
            d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5Z"
            fill="#facc15"
            initial={{ x: sx, y: sy, scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, delay: growDelay + 0.5 + i * 0.15, repeat: 2, repeatDelay: 0.8 }}
          />
        ))}
    </g>
  );
}

/** The centre tree: size follows the level, roots follow closed gaps */
function RootTree({ level, roots }: { level: number; roots: number }) {
  const s = [0.35, 0.55, 0.75, 0.95, 1.15][Math.min(4, level)];
  const n = Math.max(3, Math.min(14, roots + 3));
  const rootPaths = useMemo(
    () =>
      Array.from({ length: n }).map((_, i) => {
        const dir = (i / (n - 1)) * 2 - 1; // -1 … 1
        const len = 50 + (i % 3) * 18;
        const ex = dir * (60 + (i % 4) * 25);
        return `M0 0 C ${dir * 10} ${len * 0.4}, ${ex * 0.6} ${len * 0.6}, ${ex} ${len} M${ex * 0.55} ${len * 0.62} q ${dir * 14} 10 ${dir * 22} 22`;
      }),
    [n],
  );
  return (
    <g transform="translate(500 262)">
      {rootPaths.map((d, i) => (
        <motion.path key={i} d={d} stroke="#d6a466" strokeWidth={3.2 - (i % 3) * 0.7} strokeLinecap="round" fill="none" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.95 }} transition={{ duration: 1.6, delay: 0.3 + i * 0.12, ease: 'easeOut' }} />
      ))}
      <motion.g initial={{ scale: 0 }} animate={{ scale: s }} transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.2 }} style={{ originX: 0.5, originY: 1 }}>
        <motion.g animate={{ rotate: [-0.8, 0.8, -0.8] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 0.5, originY: 1 }}>
          {level === 0 ? (
            <g>
              <path d="M0 0 V-30" stroke={LEAF_DARK} strokeWidth="5" />
              <path d="M0 -24 C -6 -44 -30 -48 -40 -40 C -32 -26 -14 -22 0 -24Z" fill={LEAF} />
              <path d="M0 -30 C 6 -50 30 -54 40 -46 C 32 -32 14 -28 0 -30Z" fill={LEAF_DARK} />
            </g>
          ) : (
            <g>
              <path d="M-14 0 C -11 -50 -9 -90 -6 -120 L6 -120 C 9 -90 11 -50 14 0Z" fill={TRUNK} />
              <path d="M-4 -90 L-40 -130 M4 -100 L40 -140 M0 -110 L-10 -150" stroke={TRUNK} strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="0" cy="-170" rx="80" ry="58" fill={LEAF_DARK} />
              <ellipse cx="-52" cy="-140" rx="48" ry="36" fill="#16a34a" />
              <ellipse cx="54" cy="-142" rx="48" ry="36" fill={LEAF} />
              <ellipse cx="0" cy="-205" rx="50" ry="34" fill="#4ade80" />
              {level >= 3 && [[-40, -170], [30, -190], [55, -150], [-60, -135], [5, -150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#fde047" opacity=".9" />)}
            </g>
          )}
        </motion.g>
      </motion.g>
    </g>
  );
}

const TREE_X = [70, 165, 260, 355, 645, 740, 835];
const FLOWER_X = [45, 125, 205, 285, 370, 630, 715, 795, 875, 955];

export function Garden({ badges, newIds, level, roots, dark, selected, onSelect }: { badges: string[]; newIds: string[]; level: number; roots: number; dark: boolean; selected: string | null; onSelect: (id: string) => void }) {
  const trees = BADGES.filter((b) => PLANTS[b.id]?.tree);
  const flowers = BADGES.filter((b) => PLANTS[b.id] && !PLANTS[b.id].tree);
  let newIndex = 0;
  const delayFor = (id: string, base: number) => (newIds.includes(id) ? 0.8 + newIndex++ * 1.2 : base);

  return (
    <svg viewBox="0 0 1000 380" className="h-auto w-full min-w-[640px]" role="img" aria-label="Garden">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dark ? '#0b1026' : '#bae6fd'} />
          <stop offset="1" stopColor={dark ? '#1e1b4b' : '#f0fdf4'} />
        </linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c4a1e" />
          <stop offset="1" stopColor="#3f230d" />
        </linearGradient>
        <radialGradient id="sun">
          <stop offset="0" stopColor={dark ? '#f8fafc' : '#fde047'} />
          <stop offset="1" stopColor={dark ? '#f8fafc' : '#fde047'} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="270" fill="url(#sky)" />
      {dark && [[80, 40], [200, 90], [330, 30], [620, 60], [760, 25], [900, 110], [450, 80]].map(([x, y], i) => <motion.circle key={i} cx={x} cy={y} r="1.6" fill="#fff" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }} />)}
      <circle cx="880" cy="62" r="70" fill="url(#sun)" opacity=".6" />
      <circle cx="880" cy="62" r="26" fill={dark ? '#e2e8f0' : '#facc15'} />
      {[0, 1].map((i) => (
        <motion.g key={i} initial={{ x: i ? 700 : 0 }} animate={{ x: i ? [700, 1100] : [-200, 1100] }} transition={{ duration: i ? 60 : 90, repeat: Infinity, ease: 'linear' }} opacity={dark ? 0.25 : 0.9}>
          <ellipse cx="60" cy={60 + i * 40} rx="40" ry="14" fill="#fff" />
          <ellipse cx="90" cy={52 + i * 40} rx="28" ry="16" fill="#fff" />
        </motion.g>
      ))}
      <path d="M0 210 C 200 160 350 190 500 175 C 650 160 800 195 1000 170 V270 H0Z" fill={dark ? '#14532d' : '#bbf7d0'} />
      <rect y="240" width="1000" height="38" fill={dark ? '#166534' : '#86efac'} />
      <rect y="272" width="1000" height="108" fill="url(#soil)" />
      {[[120, 320], [300, 350], [700, 330], [880, 355], [560, 365], [420, 340]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#a16207" opacity=".35" />)}

      <RootTree level={level} roots={roots} />

      {trees.map((b, i) => {
        const owned = badges.includes(b.id);
        const x = TREE_X[i % TREE_X.length];
        return owned ? (
          <g key={b.id} onClick={() => onSelect(b.id)} className="cursor-pointer">
            <GrowingPlant plant={PLANTS[b.id]} x={x} y={250} scale={selected === b.id ? 0.95 : 0.82} delay={delayFor(b.id, 0.3 + i * 0.1)} isNew={newIds.includes(b.id)} title={b.title.uz} />
          </g>
        ) : (
          <g key={b.id} transform={`translate(${x} 250)`} opacity=".55">
            <ellipse rx="16" ry="5" fill="#a16207" />
            <text y="-6" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? '#cbd5e1' : '#166534'}>?</text>
          </g>
        );
      })}
      {flowers.map((b, i) => {
        const owned = badges.includes(b.id);
        const x = FLOWER_X[i % FLOWER_X.length];
        return owned ? (
          <g key={b.id} onClick={() => onSelect(b.id)} className="cursor-pointer">
            <GrowingPlant plant={PLANTS[b.id]} x={x} y={276} scale={selected === b.id ? 0.95 : 0.78} delay={delayFor(b.id, 0.5 + i * 0.08)} isNew={newIds.includes(b.id)} title={b.title.uz} />
          </g>
        ) : (
          <g key={b.id} transform={`translate(${x} 276)`} opacity=".5">
            <ellipse rx="11" ry="4" fill="#a16207" />
            <text y="-5" textAnchor="middle" fontSize="11" fontWeight="700" fill={dark ? '#cbd5e1' : '#166534'}>?</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Small pot scene used in the "new badge" modal: the plant is planted live */
export function PlantingScene({ badgeId, className = '' }: { badgeId: string; className?: string }) {
  const plant = PLANTS[badgeId];
  if (!plant) return null;
  return (
    <svg viewBox="0 0 200 170" className={cn('h-40 w-48', className)} aria-hidden>
      <ellipse cx="100" cy="150" rx="70" ry="14" fill="#7c4a1e" />
      <ellipse cx="100" cy="146" rx="62" ry="10" fill="#a16207" />
      <GrowingPlant plant={plant} x={100} y={146} scale={plant.tree ? 1 : 1.35} delay={0.1} isNew title="" />
    </svg>
  );
}
