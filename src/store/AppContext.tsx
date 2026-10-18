// Global app state: settings, auth, per-user progress, toasts and badge popups.
// Everything persists in localStorage so the stage demo never breaks.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Lang, Notif, Role, Text, Tri, UserState } from '../lib/types';
import { dateKey, storage, uid } from '../lib/utils';
import { createDemoState, createInitialState } from '../lib/seed';
import { BADGES, avgMastery } from '../lib/game';

interface Settings {
  lang: Lang;
  theme: 'light' | 'dark';
  lite: boolean;
}
interface Account {
  name: string;
  email: string;
  password: string;
}
export interface ToastItem {
  id: string;
  text: string;
  tone: 'success' | 'info' | 'error' | 'points';
}

interface Ctx {
  settings: Settings;
  setLang: (l: Lang) => void;
  toggleTheme: () => void;
  setLite: (v: boolean) => void;
  account: Account | null;
  state: UserState | null;
  signup: (name: string, email: string, password: string) => string | null;
  login: (email: string, password: string) => string | null;
  loginDemo: (role?: Role) => void;
  logout: () => void;
  update: (fn: (s: UserState) => UserState) => void;
  addPoints: (n: number, reason: Text, minutes?: number) => void;
  notify: (n: Omit<Notif, 'id' | 'date' | 'read'>) => void;
  toasts: ToastItem[];
  toast: (text: string, tone?: ToastItem['tone']) => void;
  dismissToast: (id: string) => void;
  badgePopup: string | null;
  closeBadge: () => void;
  resetDemo: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

const DEMO_EMAIL = 'demo@ildizai.uz';
const DEMO_PARENT = 'ota-ona@ildizai.uz';
const isDemo = (e: string) => e === DEMO_EMAIL || e === DEMO_PARENT;

/** Fill fields added in newer versions so old saved progress keeps working */
function migrate(s: UserState | null): UserState | null {
  if (!s) return s;
  return { ...s, bookings: s.bookings ?? [], gardenSeen: s.gardenSeen ?? s.badges ?? [], stats: { ...s.stats, sessions: s.stats?.sessions ?? 0 } };
}
const K = {
  settings: 'nega.settings',
  users: 'nega.users',
  session: 'nega.session',
  state: (email: string) => 'nega.state.v3.' + email,
};

function initialSettings(): Settings {
  const saved = storage.get<Partial<Settings>>(K.settings, {});
  let dark = false;
  try {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    /* ignore */
  }
  return { lang: saved.lang ?? 'uz', theme: saved.theme ?? (dark ? 'dark' : 'light'), lite: saved.lite ?? false };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [account, setAccount] = useState<Account | null>(() => {
    const email = storage.get<string | null>(K.session, null);
    if (!email) return null;
    return storage.get<Account[]>(K.users, []).find((u) => u.email === email) ?? null;
  });
  const [state, setState] = useState<UserState | null>(() => {
    const email = storage.get<string | null>(K.session, null);
    return email ? migrate(storage.get<UserState | null>(K.state(email), null)) : null;
  });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [badgeQueue, setBadgeQueue] = useState<string[]>([]);

  // Persist settings + apply theme
  useEffect(() => {
    storage.set(K.settings, settings);
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    document.documentElement.lang = settings.lang;
  }, [settings]);

  // Each platform (student / parent / teacher) gets its own accent colour
  const role = state?.profile.onboarded ? state.profile.role : null;
  useEffect(() => {
    if (role) document.documentElement.dataset.role = role;
    else delete document.documentElement.dataset.role;
  }, [role]);
  useEffect(() => {
  }, [settings]);

  // Persist user state
  useEffect(() => {
    if (account && state) storage.set(K.state(account.email), state);
  }, [account, state]);

  const toast = useCallback((text: string, tone: ToastItem['tone'] = 'success') => {
    const id = uid();
    setToasts((t) => [...t.slice(-3), { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const update = useCallback((fn: (s: UserState) => UserState) => {
    setState((prev) => (prev ? fn(prev) : prev));
  }, []);

  // Award newly earned badges (runs after every state change)
  useEffect(() => {
    if (!state) return;
    const earned = BADGES.filter((b) => !state.badges.includes(b.id) && b.check(state));
    if (!earned.length) return;
    setState((s) => {
      if (!s) return s;
      const fresh = earned.filter((b) => !s.badges.includes(b.id));
      if (!fresh.length) return s;
      const notes: Notif[] = fresh.map((b) => ({
        id: uid(),
        date: new Date().toISOString(),
        kind: 'badge',
        read: false,
        link: '/app/achievements',
        title: { uz: `Yangi nishon: ${b.title.uz} ${b.emoji}`, ru: `Новый значок: ${b.title.ru} ${b.emoji}`, en: `New badge: ${b.title.en} ${b.emoji}` },
        body: b.desc,
      }));
      return { ...s, badges: [...s.badges, ...fresh.map((b) => b.id)], notifications: [...notes, ...s.notifications] };
    });
    const ids = earned.map((b) => b.id);
    setBadgeQueue((q) => [...q, ...ids.filter((id) => !q.includes(id))]);
  }, [state]);

  const badgePopup = badgeQueue[0] ?? null;
  const closeBadge = useCallback(() => setBadgeQueue((q) => q.slice(1)), []);

  const addPoints = useCallback(
    (n: number, reason: Text, minutes = 3) => {
      const today = dateKey();
      update((s) => ({
        ...s,
        points: s.points + n,
        pointsLog: [...s.pointsLog, { date: today, points: n, reason }].slice(-200),
        activeDays: s.activeDays.includes(today) ? s.activeDays : [...s.activeDays, today],
        minutes: { ...s.minutes, [today]: (s.minutes[today] ?? 0) + minutes },
      }));
      const lang = settings.lang;
      const label = typeof reason === 'string' ? reason : reason[lang];
      toast(`+${n} ${lang === 'ru' ? 'очков' : lang === 'en' ? 'points' : 'ball'} · ${label}`, 'points');
    },
    [update, toast, settings.lang],
  );

  const notify = useCallback(
    (n: Omit<Notif, 'id' | 'date' | 'read'>) => {
      update((s) => ({ ...s, notifications: [{ ...n, id: uid(), date: new Date().toISOString(), read: false }, ...s.notifications].slice(0, 80) }));
    },
    [update],
  );

  const openSession = (acc: Account, st: UserState) => {
    storage.set(K.session, acc.email);
    setAccount(acc);
    setState(st);
  };

  const signup = (name: string, email: string, password: string) => {
    const users = storage.get<Account[]>(K.users, []);
    const e = email.trim().toLowerCase();
    if (users.some((u) => u.email === e)) return 'exists';
    const acc = { name: name.trim(), email: e, password };
    storage.set(K.users, [...users, acc]);
    const st = createInitialState(acc.name);
    storage.set(K.state(e), st);
    openSession(acc, st);
    return null;
  };

  const login = (email: string, password: string) => {
    const e = email.trim().toLowerCase();
    if (isDemo(e)) {
      loginDemo(e === DEMO_PARENT ? 'parent' : 'student');
      return null;
    }
    const acc = storage.get<Account[]>(K.users, []).find((u) => u.email === e);
    if (!acc || acc.password !== password) return 'invalid';
    openSession(acc, migrate(storage.get<UserState | null>(K.state(e), null)) ?? createInitialState(acc.name));
    return null;
  };

  const loginDemo = (role: Role = 'student') => {
    const email = role === 'parent' ? DEMO_PARENT : DEMO_EMAIL;
    const acc = { name: role === 'parent' ? 'Rustam Karimov' : 'Jasur Karimov', email, password: 'demo' };
    const users = storage.get<Account[]>(K.users, []);
    if (!users.some((u) => u.email === email)) storage.set(K.users, [...users, acc]);
    openSession(acc, migrate(storage.get<UserState | null>(K.state(email), null)) ?? createDemoState(role));
  };

  const logout = () => {
    storage.remove(K.session);
    setAccount(null);
    setState(null);
  };

  const resetDemo = () => {
    if (!account) return;
    const fresh = isDemo(account.email) ? createDemoState(account.email === DEMO_PARENT ? 'parent' : 'student') : { ...createInitialState(account.name), profile: { ...state!.profile } };
    if (!isDemo(account.email)) fresh.mastery = state?.mastery ?? {};
    setState(fresh);
  };

  // Track a progress point per day (average mastery)
  useEffect(() => {
    if (!state || !state.profile.onboarded) return;
    const today = dateKey();
    const value = avgMastery(state);
    const last = state.progress[state.progress.length - 1];
    if (last && last.date === today && last.value === value) return;
    setState((s) => {
      if (!s) return s;
      const p = s.progress.filter((x) => x.date !== today);
      return { ...s, progress: [...p, { date: today, value }].slice(-30) };
    });
  }, [state]);

  const value: Ctx = {
    settings,
    setLang: (lang) => setSettings((s) => ({ ...s, lang })),
    toggleTheme: () => setSettings((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' })),
    setLite: (lite) => setSettings((s) => ({ ...s, lite })),
    account,
    state,
    signup,
    login,
    loginDemo,
    logout,
    update,
    addPoints,
    notify,
    toasts,
    toast,
    dismissToast,
    badgePopup,
    closeBadge,
    resetDemo,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

/** State hook for pages that are only rendered behind auth */
export function useUser() {
  const ctx = useApp();
  return { ...ctx, state: ctx.state as UserState };
}

/** Translation helpers: tx('uz','ru','en') and L(triObject) */
export function useT() {
  const { settings } = useApp();
  const lang = settings.lang;
  return useMemo(
    () => ({
      lang,
      tx: (uz: string, ru: string, en: string) => (lang === 'ru' ? ru : lang === 'en' ? en : uz),
      L: (o: Text | Tri | undefined) => (!o ? '' : typeof o === 'string' ? o : o[lang]),
    }),
    [lang],
  );
}
