// Initial state factories: the stage demo account and brand-new users.
import { tri, Notif, Profile, Role, Stats, UserState } from './types';
import { dateKey, daysAgo, seeded, uid } from './utils';
import { TOPICS } from '../data/topics';
import { SEED_REVIEWS, SEED_TIPS } from '../data/mock';

/** Point-log reasons. `en` prefixes are used by daily goals — keep them stable. */
export const REASON = {
  root: tri('Ildiz topildi', 'Найден корень', 'Root found'),
  lesson: tri('Mikro-dars tugatildi', 'Микро-урок завершён', 'Lesson completed'),
  card: tri('Buvijon kartochkasi', 'Карточка бабушки', 'Card answered'),
  correct: tri("Toʻgʻri javob", 'Верный ответ', 'Correct answer'),
  report: tri('Ota-onaga hisobot', 'Отчёт родителям', 'Report sent'),
  daily: tri('Kunlik maqsad bonusi', 'Бонус дневной цели', 'Daily goal bonus'),
  review: tri('Hamjamiyatga hissa', 'Вклад в сообщество', 'Community contribution'),
  teacher: tri("Sinfga mashq yuborildi", 'Упражнение отправлено классу', 'Class practice sent'),
  booking: tri('Dars band qilindi', 'Урок забронирован', 'Lesson booked'),
  session: tri('Ustoz bilan dars', 'Урок с учителем', 'Lesson with a tutor'),
  water: tri('Doʻstning bogʻiga suv quyildi', 'Полит сад друга', "Watered a friend's garden"),
  welcome: tri('Xush kelibsiz bonusi', 'Приветственный бонус', 'Welcome bonus'),
};

const emptyStats = (): Stats => ({ scans: 0, lessons: 0, chats: 0, reports: 0, reviews: 0, mapVisits: 0, perfectChecks: 0, maxRewind: 0, grandmaCards: 0, tips: 0, sessions: 0 });

const iso = (n: number, h = 18) => {
  const d = daysAgo(n);
  d.setHours(h, 15, 0, 0);
  return d.toISOString();
};

export function seedNotifications(childName: string): Notif[] {
  const c = childName || 'Jasur';
  const list: Omit<Notif, 'id'>[] = [
    { date: iso(0, 9), kind: 'reminder', read: false, link: '/app/scan', title: tri('Bugungi 5 daqiqa', 'Сегодняшние 5 минут', "Today's 5 minutes"), body: tri("Seriyani uzmang — bitta xatoni skanerlang.", 'Не прерывайте серию — отсканируйте одну ошибку.', "Keep the streak — scan one mistake.") },
    { date: iso(0, 8), kind: 'info', read: false, link: '/app/map', title: tri('Yangi tavsiya', 'Новая рекомендация', 'New recommendation'), body: tri("\"Umumiy maxraj\" — 6 ta keyingi mavzuga ildiz.", '«Общий знаменатель» — корень для 6 следующих тем.', "'Common denominator' unlocks 6 later topics.") },
    { date: iso(1), kind: 'success', read: false, link: '/app/achievements', title: tri('Seriya: 5 kun 🔥', 'Серия: 5 дней 🔥', 'Streak: 5 days 🔥'), body: tri("Zoʻr! Yana 2 kun — \"Haftalik chaqmoq\" nishoni.", 'Отлично! Ещё 2 дня — значок «Недельная молния».', "Great! 2 more days for the 'Weekly lightning' badge.") },
    { date: iso(1, 20), kind: 'info', read: true, link: '/app/parent', title: tri('Hisobot tinglandi', 'Отчёт прослушан', 'Report played'), body: tri(`Rustam aka ${c}ning hisobotini tingladi ❤️`, `Рустам-ака прослушал отчёт ${c} ❤️`, `Rustam listened to ${c}'s report ❤️`) },
    { date: iso(2), kind: 'success', read: true, link: '/app/map', title: tri('Ildiz yopildi', 'Корень закрыт', 'Root closed'), body: tri("\"Manfiy sonlarni qoʻshish\" endi yashil.", '«Сложение отрицательных» теперь зелёная.', "'Adding negatives' is now green.") },
    { date: iso(2, 10), kind: 'badge', read: true, link: '/app/achievements', title: tri('Yangi nishon: Mergan 🎯', 'Новый значок: Снайпер 🎯', 'New badge: Sharpshooter 🎯'), body: tri('Tekshiruvda 3/3!', '3 из 3 в проверке!', '3/3 on a check!') },
    { date: iso(3), kind: 'warning', read: true, link: '/app/scan', title: tri('Takroriy xato', 'Повторная ошибка', 'Repeated mistake'), body: tri('Kasrlarda yana bir xil xato. Vaqt mashinasini ishga tushiring.', 'Снова та же ошибка в дробях. Запустите машину времени.', 'Same fraction mistake again. Launch the Time Machine.') },
    { date: iso(3, 12), kind: 'info', read: true, link: '/app/community', title: tri('Reytingda +3 o\'rin', '+3 места в рейтинге', '+3 places on the leaderboard'), body: tri("Qashqadaryo boʻyicha top-20 dasiz.", 'Вы в топ-20 по Кашкадарье.', "You're in Kashkadarya's top 20.") },
    { date: iso(4), kind: 'reminder', read: true, link: '/app/grandma', title: tri('Buvijon vaqti', 'Время бабушки', 'Grandma time'), body: tri('Buvingiz uchun 2 ta yangi kartochka tayyor.', 'Для бабушки готовы 2 новые карточки.', '2 new cards ready for grandma.') },
    { date: iso(4, 9), kind: 'success', read: true, link: '/app/achievements', title: tri('1000 ball!', '1000 очков!', '1000 points!'), body: tri("Siz \"Koʻchat\" darajasidasiz 🌿", 'Вы на уровне «Саженец» 🌿', "You're at the 'Sapling' level 🌿") },
    { date: iso(5), kind: 'info', read: true, link: '/app/teacher', title: tri("Oʻqituvchidan xabar", 'Сообщение от учителя', 'Message from teacher'), body: tri('Gulnora opa sinfga kasrlar bo\'yicha mashq yubordi.', 'Гулнора-опа отправила классу упражнение по дробям.', 'Ms. Gulnora sent the class a fractions drill.') },
    { date: iso(6), kind: 'success', read: true, link: '/app/lesson/negAdd', title: tri('Mikro-dars tugadi', 'Микро-урок завершён', 'Lesson finished'), body: tri('+100 ball. Ajoyib ish!', '+100 очков. Отличная работа!', '+100 points. Great job!') },
    { date: iso(7), kind: 'badge', read: true, link: '/app/achievements', title: tri("Yangi nishon: Vaqt sayyohi ⏪", 'Новый значок: Путешественник ⏪', 'New badge: Time traveler ⏪'), body: tri('2 sinf orqaga qaytdingiz.', 'Вы вернулись на 2 класса.', 'You went back 2 grades.') },
    { date: iso(8), kind: 'info', read: true, link: '/app/schools', title: tri('Maktabingiz pilotda', 'Ваша школа в пилоте', 'Your school is in the pilot'), body: tri('Qarshi, 12-maktab IldizAI pilotiga qo\'shildi.', 'Школа №12, Карши, присоединилась к пилоту.', 'School #12 in Qarshi joined the pilot.') },
    { date: iso(9), kind: 'info', read: true, link: '/app', title: tri('Xush kelibsiz!', 'Добро пожаловать!', 'Welcome!'), body: tri('IldizAI xatolarning sababini topadi. Boshlaymizmi?', 'IldizAI находит причины ошибок. Начнём?', 'IldizAI finds why mistakes happen. Shall we start?') },
  ];
  return list.map((n) => ({ ...n, id: uid() }));
}

function baseState(profile: Profile): UserState {
  return {
    profile,
    points: 0,
    mastery: {},
    history: [],
    lessonsDone: [],
    activeDays: [dateKey()],
    minutes: {},
    badges: [],
    notifications: [],
    reminders: [
      { id: uid(), time: '19:00', days: [1, 2, 3, 4, 5], label: '5 daqiqalik mashq', enabled: true },
      { id: uid(), time: '20:00', days: [0], label: 'Haftalik hisobot', enabled: true },
    ],
    reviews: [...SEED_REVIEWS],
    tips: [...SEED_TIPS],
    liked: [],
    stats: emptyStats(),
    pointsLog: [],
    progress: [],
    chat: [],
    bookings: [],
    gardenSeen: [],
    watered: [],
  };
}

/** Mastery estimated from onboarding answers (grade + weak areas) */
export function estimateMastery(grade: number, weak: string[], seed = 3) {
  const r = seeded(seed);
  const m: Record<string, number> = {};
  for (const t of TOPICS) {
    if (t.grade > grade) {
      m[t.id] = 0;
      continue;
    }
    let v = t.grade < grade ? 72 : 52;
    if (weak.includes(t.area)) v -= 32;
    v += Math.round((r() - 0.5) * 24);
    m[t.id] = Math.max(12, Math.min(95, v));
  }
  return m;
}

export function createInitialState(name: string): UserState {
  return baseState({
    name, role: 'student', grade: 7, city: 'Toshkent', childName: name.split(' ')[0], goal: 'grades', weak: [],
    parentName: '', parentCity: '', telegram: '', onboarded: false,
  });
}

/** The polished stage account: Jasur, 13, Qarshi — father works in Moscow */
export function createDemoState(role: Role = 'student'): UserState {
  const s = baseState({
    name: role === 'parent' ? 'Rustam Karimov' : 'Jasur Karimov', role, grade: 7, city: 'Qarshi', childName: 'Jasur', goal: 'grades', weak: ['frac'],
    parentName: 'Rustam Karimov', parentCity: 'Moskva', telegram: '@rustam_karimov', onboarded: true,
  });
  s.mastery = {
    natural: 92, divisibility: 85, gcd: 70, lcm: 48, fracMeaning: 66, fracSimplify: 58, lcd: 28, fracAdd: 34, decimals: 74, percent: 62,
    fracMul: 52, proportion: 60, negNumbers: 80, negAdd: 86, negMul: 64, brackets: 47, likeTerms: 55, coords: 78,
    linearEq: 38, wordEq: 30, powers: 84, monomials: 60, polyMul: 40, shortMult: 22, linFunc: 18,
    sqrt: 0, quadEq: 0, inequalities: 0, quadFunc: 0, progression: 0,
  };
  s.points = 1240;
  s.activeDays = [1, 2, 3, 4, 5].map((n) => dateKey(daysAgo(n)));
  const mins = [14, 22, 9, 18, 25, 16, 0];
  mins.forEach((v, i) => {
    if (v) s.minutes[dateKey(daysAgo(6 - i + 0))] = v;
  });
  s.lessonsDone = ['negAdd', 'powers'];
  s.badges = ['first_scan', 'time_traveler', 'lesson_1', 'perfect', 'streak_3', 'points_500', 'explorer'];
  s.stats = { ...emptyStats(), scans: 4, lessons: 2, chats: 3, mapVisits: 2, perfectChecks: 1, maxRewind: 2, grandmaCards: 1, sessions: 1 };
  s.badges.push('tutor_1');
  s.gardenSeen = [...s.badges];
  s.bookings = [
    { id: uid(), tutorId: 't12', start: slotIso(1, 17), minutes: 30, topicId: 'lcd', note: 'Kasrlarni ayirishda umumiy maxraj', price: 42000, pay: 'click', status: 'upcoming' },
    { id: uid(), tutorId: 't1', start: slotIso(-3, 16), minutes: 60, topicId: 'negAdd', note: '', price: 81000, pay: 'payme', status: 'done', rating: 5, review: 'Juda tushunarli tushuntirdi!' },
  ];
  s.history = [
    { id: uid(), date: iso(1), problemId: 'p5', answer: '2', rootId: 'negAdd', chain: ['linearEq', 'negAdd'], confidence: 88, closed: true },
    { id: uid(), date: iso(3), problemId: 'p2', answer: '2/5', rootId: 'lcd', chain: ['fracAdd', 'lcd'], confidence: 91, closed: false },
    { id: uid(), date: iso(5), problemId: 'p7', answer: '64', rootId: 'powers', chain: ['powers'], confidence: 84, closed: true },
    { id: uid(), date: iso(7), problemId: 'p8', answer: 'a^2+9', rootId: 'polyMul', chain: ['shortMult', 'polyMul'], confidence: 79, closed: false },
  ];
  const pts = [60, 120, 40, 150, 90, 110, 70, 130, 100, 80, 160, 90, 140];
  s.pointsLog = pts.map((p, i) => ({ date: dateKey(daysAgo(13 - i)), points: p, reason: i % 3 === 0 ? REASON.root : i % 3 === 1 ? REASON.lesson : REASON.card }));
  const prog = [41, 42, 42, 44, 45, 45, 47, 48, 50, 51, 52, 53, 55, 56];
  s.progress = prog.map((v, i) => ({ date: dateKey(daysAgo(13 - i)), value: v }));
  s.notifications = seedNotifications('Jasur');
  s.reminders.push({ id: uid(), time: '17:30', days: [6], label: 'Buvijon kartochkalari', enabled: false });
  return s;
}

/** ISO time for a lesson slot `days` from now at `hour`:00 (negative = past) */
function slotIso(days: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}
