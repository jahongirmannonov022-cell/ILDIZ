// Small, dependency-free helpers

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Local date as YYYY-MM-DD */
export function dateKey(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

/** 1234567 -> "1 234 567" */
export const fmtNum = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };

/** Normalize a typed math answer so "x = 0,25" and "0.25" compare equal */
export function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => '^' + SUP[c])
    .replace(/\s+/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/^[a-z]=/, '')
    .replace(/[·*]/g, '')
    .replace(/so['‘’ʻʼ]?m|сум|uzs/g, '')
    .replace(/\+-|-\+/g, '±')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/^\+/, '');
}

/** Deterministic pseudo-random generator (stable mock data) */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function shuffle<T>(arr: T[], rnd: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** localStorage wrapper that never throws (private mode, blocked storage…) */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export function masteryTone(v: number, future = false) {
  if (future) return { bg: 'bg-fg/10', text: 'text-muted', dot: 'bg-fg/25', hex: '#9ca3af' };
  if (v >= 75) return { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', hex: '#10b981' };
  if (v >= 50) return { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', hex: '#f59e0b' };
  return { bg: 'bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500', hex: '#f43f5e' };
}

/** Built-in reminder labels are stored in Uzbek; show them in the current language */
export function reminderLabel(label: string, tx: (uz: string, ru: string, en: string) => string) {
  const known: Record<string, [string, string, string]> = {
    '5 daqiqalik mashq': ['5 daqiqalik mashq', '5 минут практики', '5-minute practice'],
    'Haftalik hisobot': ['Haftalik hisobot', 'Еженедельный отчёт', 'Weekly report'],
    'Buvijon kartochkalari': ['Buvijon kartochkalari', 'Карточки бабушки', 'Grandma cards'],
  };
  const k = known[label];
  return k ? tx(...k) : label;
}

const UZ_MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];
const LOCALE = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' } as const;

/** "18-okt" / "18 окт." / "Oct 18" — browsers lack Uzbek month names, so uz is formatted by hand */
export function fmtDay(input: string | Date, lang: 'uz' | 'ru' | 'en', withTime = false) {
  const d = typeof input === 'string' ? new Date(input.length === 10 ? input + 'T12:00:00' : input) : input;
  const time = withTime ? `, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : '';
  if (lang === 'uz') return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}${time}`;
  return d.toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'short' }) + time;
}

/** Short month name: "okt" / "окт." / "Oct" */
export function fmtMonth(input: string | Date, lang: 'uz' | 'ru' | 'en') {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (lang === 'uz') return UZ_MONTHS[d.getMonth()];
  return d.toLocaleDateString(LOCALE[lang], { month: 'short' });
}

/** "17:00" */
export const fmtTime = (input: string | Date) => {
  const d = typeof input === 'string' ? new Date(input) : input;
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
