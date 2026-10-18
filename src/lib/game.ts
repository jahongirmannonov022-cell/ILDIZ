// Gamification rules: levels, streaks, badges and daily goals.
import { tri, Tri, UserState } from './types';
import { dateKey, daysAgo } from './utils';
import { TOPICS } from '../data/topics';

export const LEVELS: { min: number; name: Tri; emoji: string }[] = [
  { min: 0, name: tri("Urugʻ", 'Семя', 'Seed'), emoji: '🌰' },
  { min: 300, name: tri('Nihol', 'Росток', 'Sprout'), emoji: '🌱' },
  { min: 800, name: tri("Koʻchat", 'Саженец', 'Sapling'), emoji: '🌿' },
  { min: 1500, name: tri('Daraxt', 'Дерево', 'Tree'), emoji: '🌳' },
  { min: 2500, name: tri('Chinor', 'Чинар', 'Plane tree'), emoji: '🏞️' },
];

export function levelOf(points: number) {
  let idx = 0;
  LEVELS.forEach((l, i) => {
    if (points >= l.min) idx = i;
  });
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const pct = next ? Math.round(((points - cur.min) / (next.min - cur.min)) * 100) : 100;
  return { index: idx, level: idx + 1, cur, next, pct, toNext: next ? next.min - points : 0 };
}

/** Consecutive active days ending today (or yesterday) */
export function streakOf(activeDays: string[]) {
  const set = new Set(activeDays);
  let start = 0;
  if (!set.has(dateKey())) {
    if (!set.has(dateKey(daysAgo(1)))) return 0;
    start = 1;
  }
  let n = 0;
  while (set.has(dateKey(daysAgo(start + n)))) n++;
  return n;
}

export const avgMastery = (s: UserState) => {
  const known = TOPICS.filter((t) => t.grade <= s.profile.grade);
  if (!known.length) return 0;
  return Math.round(known.reduce((a, t) => a + (s.mastery[t.id] ?? 0), 0) / known.length);
};

export interface Badge {
  id: string;
  emoji: string;
  title: Tri;
  desc: Tri;
  check: (s: UserState) => boolean;
}

export const BADGES: Badge[] = [
  { id: 'first_scan', emoji: '🔍', title: tri('Birinchi ildiz', 'Первый корень', 'First root'), desc: tri("Birinchi xatoni skanerlang", 'Отсканируйте первую ошибку', 'Scan your first mistake'), check: (s) => s.stats.scans >= 1 },
  { id: 'root_hunter', emoji: '🕵️', title: tri('Ildiz ovchisi', 'Охотник за корнями', 'Root hunter'), desc: tri('5 ta ildiz toping', 'Найдите 5 корней', 'Find 5 roots'), check: (s) => s.stats.scans >= 5 },
  { id: 'time_traveler', emoji: '⏪', title: tri('Vaqt sayyohi', 'Путешественник во времени', 'Time traveler'), desc: tri('2 sinf orqaga qayting', 'Вернитесь на 2 класса назад', 'Go back 2 grades'), check: (s) => s.stats.maxRewind >= 2 },
  { id: 'lesson_1', emoji: '📗', title: tri('Birinchi dars', 'Первый урок', 'First lesson'), desc: tri('Mikro-darsni tugating', 'Завершите микро-урок', 'Finish a micro-lesson'), check: (s) => s.stats.lessons >= 1 },
  { id: 'lesson_5', emoji: '📚', title: tri("Bilim bogʻboni", 'Садовник знаний', 'Knowledge gardener'), desc: tri('5 ta mikro-dars', '5 микро-уроков', '5 micro-lessons'), check: (s) => s.stats.lessons >= 5 },
  { id: 'perfect', emoji: '🎯', title: tri('Mergan', 'Снайпер', 'Sharpshooter'), desc: tri('Tekshiruvda 3/3', '3 из 3 в проверке', '3/3 on a check'), check: (s) => s.stats.perfectChecks >= 1 },
  { id: 'streak_3', emoji: '🔥', title: tri('3 kunlik olov', 'Огонь 3 дня', '3-day fire'), desc: tri('3 kun ketma-ket', '3 дня подряд', '3 days in a row'), check: (s) => streakOf(s.activeDays) >= 3 },
  { id: 'streak_7', emoji: '⚡', title: tri('Haftalik chaqmoq', 'Недельная молния', 'Weekly lightning'), desc: tri('7 kun ketma-ket', '7 дней подряд', '7 days in a row'), check: (s) => streakOf(s.activeDays) >= 7 },
  { id: 'points_500', emoji: '⭐', title: tri('500 ball', '500 очков', '500 points'), desc: tri("500 ball toʻplang", 'Наберите 500 очков', 'Earn 500 points'), check: (s) => s.points >= 500 },
  { id: 'points_2000', emoji: '🌟', title: tri('2000 ball', '2000 очков', '2000 points'), desc: tri("2000 ball toʻplang", 'Наберите 2000 очков', 'Earn 2000 points'), check: (s) => s.points >= 2000 },
  { id: 'family', emoji: '👨‍👩‍👦', title: tri("Oila bogʻlandi", 'Семья на связи', 'Family linked'), desc: tri('Ota-onaga hisobot yuboring', 'Отправьте отчёт родителям', 'Send a report to a parent'), check: (s) => s.stats.reports >= 1 },
  { id: 'grandma', emoji: '👵', title: tri('Buvijon yordamchisi', 'Помощник бабушки', "Grandma's helper"), desc: tri('3 ta kartochka', '3 карточки', '3 cards'), check: (s) => s.stats.grandmaCards >= 3 },
  { id: 'curious', emoji: '💬', title: tri('Qiziquvchan', 'Любознательный', 'Curious'), desc: tri('Yordamchiga 5 ta savol', '5 вопросов помощнику', '5 questions to the assistant'), check: (s) => s.stats.chats >= 5 },
  { id: 'explorer', emoji: '🗺️', title: tri('Kashfiyotchi', 'Исследователь', 'Explorer'), desc: tri('Bilim xaritasini oching', 'Откройте карту знаний', 'Open the knowledge map'), check: (s) => s.stats.mapVisits >= 1 },
  { id: 'voice', emoji: '📣', title: tri('Hamjamiyat ovozi', 'Голос сообщества', 'Community voice'), desc: tri('Sharh yoki maslahat qoldiring', 'Оставьте отзыв или совет', 'Leave a review or tip'), check: (s) => s.stats.reviews + s.stats.tips >= 1 },
  { id: 'green_10', emoji: '🌳', title: tri("Yashil oʻrmon", 'Зелёный лес', 'Green forest'), desc: tri("10 ta mavzu yashil", '10 зелёных тем', '10 green topics'), check: (s) => Object.values(s.mastery).filter((v) => v >= 75).length >= 10 },
];

BADGES.push({
  id: 'tutor_1',
  emoji: '🧑‍🏫',
  title: tri('Ustoz bilan birinchi dars', 'Первый урок с учителем', 'First lesson with a tutor'),
  desc: tri('Support ustoz bilan onlayn dars', 'Онлайн-урок с support-учителем', 'An online lesson with a support teacher'),
  check: (s) => (s.stats.sessions ?? 0) >= 1,
});

export const BADGE: Record<string, Badge> = Object.fromEntries(BADGES.map((b) => [b.id, b]));

// ── Garden: every badge plants a flower or a tree ─────────────────────────
export type PlantKind = 'tulip' | 'daisy' | 'sunflower' | 'rose' | 'fruitTree' | 'blossomTree' | 'pine' | 'chinor';

export interface Plant {
  kind: PlantKind;
  name: Tri;
  color: string; // petals / fruit / blossom
  tree: boolean;
}

const flower = (kind: PlantKind, color: string, uz: string, ru: string, en: string): Plant => ({ kind, color, name: tri(uz, ru, en), tree: false });
const tree = (kind: PlantKind, color: string, uz: string, ru: string, en: string): Plant => ({ kind, color, name: tri(uz, ru, en), tree: true });

export const PLANTS: Record<string, Plant> = {
  first_scan: flower('tulip', '#ef4444', 'Qizil lola', 'Красный тюльпан', 'Red tulip'),
  lesson_1: flower('daisy', '#ffffff', 'Moychechak', 'Ромашка', 'Chamomile'),
  perfect: flower('sunflower', '#facc15', 'Kungaboqar', 'Подсолнух', 'Sunflower'),
  streak_3: flower('rose', '#e11d48', 'Atirgul', 'Роза', 'Rose'),
  points_500: flower('tulip', '#facc15', 'Sariq lola', 'Жёлтый тюльпан', 'Yellow tulip'),
  family: flower('tulip', '#a855f7', 'Binafsha lola', 'Фиолетовый тюльпан', 'Purple tulip'),
  grandma: flower('daisy', '#fde68a', 'Sariq moychechak', 'Жёлтая ромашка', 'Yellow daisy'),
  curious: flower('sunflower', '#fb923c', 'Toʻq sariq kungaboqar', 'Оранжевый подсолнух', 'Orange sunflower'),
  voice: flower('rose', '#f472b6', 'Pushti atirgul', 'Розовая роза', 'Pink rose'),
  tutor_1: flower('tulip', '#38bdf8', 'Moviy lola', 'Голубой тюльпан', 'Blue tulip'),
  root_hunter: tree('fruitTree', '#dc2626', 'Anor daraxti', 'Гранатовое дерево', 'Pomegranate tree'),
  time_traveler: tree('blossomTree', '#f9a8d4', 'Gullagan oʻrik', 'Цветущий абрикос', 'Apricot in bloom'),
  lesson_5: tree('fruitTree', '#22c55e', 'Olma daraxti', 'Яблоня', 'Apple tree'),
  streak_7: tree('pine', '#15803d', 'Archa', 'Ель', 'Pine'),
  points_2000: tree('chinor', '#16a34a', 'Chinor', 'Чинар', 'Plane tree'),
  explorer: tree('fruitTree', '#7c2d12', 'Tut daraxti', 'Тутовник', 'Mulberry tree'),
  green_10: tree('blossomTree', '#ffffff', 'Gullagan olcha', 'Цветущая вишня', 'Cherry in bloom'),
};

/** Daily goal: 3 tasks tracked through today's point log reasons */
export const DAILY_TASKS = [
  { key: 'scan', title: tri('1 ta xatoni skanerlang', 'Отсканируйте 1 ошибку', 'Scan 1 mistake'), to: '/app/scan' },
  { key: 'lesson', title: tri('1 ta mikro-dars', '1 микро-урок', '1 micro-lesson'), to: '/app/map' },
  { key: 'card', title: tri('1 ta buvijon kartochkasi', '1 карточка бабушки', '1 grandma card'), to: '/app/grandma' },
] as const;

export function dailyDone(s: UserState) {
  const today = dateKey();
  const tags = s.pointsLog.filter((p) => p.date === today).map((p) => (typeof p.reason === 'string' ? p.reason : p.reason.en));
  return {
    scan: tags.some((t) => t.startsWith('Root')),
    lesson: tags.some((t) => t.startsWith('Lesson')),
    card: tags.some((t) => t.startsWith('Card')),
  };
}
