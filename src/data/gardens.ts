// Other students' gardens, the monthly garden ranking and Top-5 prizes.
// Demo data generated deterministically from the leaderboard (fictional students).
import { tri, Tri, UserState } from '../lib/types';
import { BADGES, PLANTS, levelOf, streakOf } from '../lib/game';
import { LEADERS } from './mock';
import { seeded, shuffle } from '../lib/utils';

export interface GardenOwner {
  id: string;
  name: string;
  city: string;
  grade: number;
  badges: string[];
  level: number;
  roots: number;
  streak: number;
  waters: number;
  monthly: Record<string, number>; // 'YYYY-MM' -> points earned that month
  me?: boolean;
}

/** 'YYYY-MM' for this month (0), last month (-1), … */
export function monthKey(offset = 0) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const UZ_MONTHS_LONG = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
export function monthName(key: string, lang: 'uz' | 'ru' | 'en') {
  const [y, m] = key.split('-').map(Number);
  if (lang === 'uz') return `${UZ_MONTHS_LONG[m - 1]} ${y}`;
  const s = new Date(y, m - 1, 1).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'long' });
  return `${s.charAt(0).toUpperCase()}${s.slice(1)} ${y}`;
}

const PLANT_BADGES = BADGES.filter((b) => PLANTS[b.id]).map((b) => b.id);

/** 20 classmates across Uzbekistan, each with a garden */
export const OTHER_GARDENS: GardenOwner[] = LEADERS.map((l, i) => {
  const r = seeded(101 + i * 17);
  const count = Math.max(3, Math.min(PLANT_BADGES.length, Math.round(l.points / 330) + 2));
  const badges = shuffle(PLANT_BADGES, r).slice(0, count);
  return {
    id: 'g' + (i + 1),
    name: l.name,
    city: l.city,
    grade: l.grade,
    badges,
    level: levelOf(l.points).index,
    roots: Math.round(l.points / 260),
    streak: l.streak,
    waters: Math.round(8 + r() * 60 + l.points / 120),
    monthly: {
      [monthKey(0)]: Math.round(l.points * 0.42 * (0.6 + r() * 0.8)),
      [monthKey(-1)]: Math.round(l.points * 0.5 * (0.6 + r() * 0.8)),
      [monthKey(-2)]: Math.round(l.points * 0.48 * (0.6 + r() * 0.8)),
    },
  };
});

/** The signed-in student's own garden, built from real progress */
export function myGarden(s: UserState): GardenOwner {
  const sum = (key: string) => s.pointsLog.filter((p) => p.date.startsWith(key)).reduce((a, p) => a + p.points, 0);
  return {
    id: 'me',
    name: s.profile.role === 'parent' ? s.profile.childName || s.profile.name : s.profile.name,
    city: s.profile.city,
    grade: s.profile.grade,
    badges: s.badges.filter((b) => PLANTS[b]),
    level: levelOf(s.points).index,
    roots: s.history.filter((h) => h.closed).length + s.lessonsDone.length,
    streak: streakOf(s.activeDays),
    waters: 0,
    monthly: { [monthKey(0)]: sum(monthKey(0)), [monthKey(-1)]: sum(monthKey(-1)), [monthKey(-2)]: sum(monthKey(-2)) },
    me: true,
  };
}

export function ranking(s: UserState, month: string) {
  return [...OTHER_GARDENS, myGarden(s)]
    .map((g) => ({ g, score: g.monthly[month] ?? 0 }))
    .sort((a, b) => b.score - a.score || b.g.badges.length - a.g.badges.length);
}

export interface Prize {
  emoji: string;
  title: Tri;
  value: number; // approximate value in so'm
}

/** Different prizes every month for places 1–5 (demo — partners confirm the real list) */
const PRIZE_SETS: Prize[][] = [
  [
    { emoji: '📱', title: tri('Planshet', 'Планшет', 'Tablet'), value: 3200000 },
    { emoji: '🎧', title: tri('Simsiz quloqchinlar', 'Беспроводные наушники', 'Wireless headphones'), value: 850000 },
    { emoji: '📚', title: tri('Kitoblar toʻplami + 3 oy Premium', 'Набор книг + 3 мес. Premium', 'Book set + 3 months Premium'), value: 450000 },
    { emoji: '🧑‍🏫', title: tri('Support ustoz bilan 3 ta bepul dars', '3 бесплатных урока с учителем', '3 free tutor lessons'), value: 130000 },
    { emoji: '👕', title: tri('IldizAI futbolkasi va stikerlar', 'Футболка IldizAI и стикеры', 'IldizAI T-shirt & stickers'), value: 90000 },
  ],
  [
    { emoji: '⌚', title: tri('Aqlli soat', 'Смарт-часы', 'Smartwatch'), value: 1500000 },
    { emoji: '🔊', title: tri('Bluetooth karnay', 'Bluetooth-колонка', 'Bluetooth speaker'), value: 600000 },
    { emoji: '🧮', title: tri('Ilmiy kalkulyator va daftarlar', 'Инженерный калькулятор и тетради', 'Scientific calculator & notebooks'), value: 300000 },
    { emoji: '🎟️', title: tri('2 ta bepul dars + 1 oy Premium', '2 бесплатных урока + 1 мес. Premium', '2 free lessons + 1 month Premium'), value: 120000 },
    { emoji: '🏅', title: tri('Sertifikat va medal', 'Сертификат и медаль', 'Certificate & medal'), value: 60000 },
  ],
  [
    { emoji: '🚲', title: tri('Velosiped', 'Велосипед', 'Bicycle'), value: 2500000 },
    { emoji: '🎒', title: tri('Maktab sumkasi toʻplami bilan', 'Рюкзак с канцелярией', 'School backpack set'), value: 500000 },
    { emoji: '♟️', title: tri('Shaxmat va jumboqlar toʻplami', 'Шахматы и головоломки', 'Chess & puzzle set'), value: 250000 },
    { emoji: '⭐', title: tri('1 oylik Premium', '1 месяц Premium', '1 month Premium'), value: 49000 },
    { emoji: '🧢', title: tri('IldizAI kepkasi', 'Кепка IldizAI', 'IldizAI cap'), value: 70000 },
  ],
];

export const prizesFor = (month: string) => PRIZE_SETS[Number(month.slice(5, 7)) % PRIZE_SETS.length];

/** Time left in the current month */
export function monthCountdown() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const ms = end.getTime() - now.getTime();
  return { days: Math.floor(ms / 86400000), hours: Math.floor((ms % 86400000) / 3600000) };
}
