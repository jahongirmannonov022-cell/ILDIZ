// Authenticated shell: sidebar (desktop), bottom nav + drawer (mobile),
// top bar with notifications, and animated page transitions.
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CalendarCheck, Flame, Flower2, LayoutDashboard, LogOut, Menu, Network, Rewind, School, Send, X } from 'lucide-react';
import { useApp, useT, useUser } from '../store/AppContext';
import { ALL_NAV, navFor, ROLE_LABEL } from './nav';
import { Role } from '../lib/types';
import { Avatar, Logo } from './ui';
import { LangSwitch, ThemeToggle } from './Controls';
import { levelOf, streakOf } from '../lib/game';
import { cn, dateKey, reminderLabel } from '../lib/utils';
import { pageVariants, T } from '../lib/motion';

/** Switch between the student, parent and teacher platforms (same family data) */
function RoleSwitcher() {
  const { state, update, toast } = useUser();
  const { L, tx } = useT();
  const nav = useNavigate();
  const roles: Role[] = ['student', 'parent', 'teacher'];
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-fg/5 p-1" role="radiogroup" aria-label={tx('Platforma', 'Платформа', 'Platform')}>
      {roles.map((r) => (
        <button
          key={r}
          role="radio"
          aria-checked={state.profile.role === r}
          onClick={() => {
            if (state.profile.role === r) return;
            update((s) => ({ ...s, profile: { ...s.profile, role: r } }));
            toast(tx(`${ROLE_LABEL[r].uz} platformasi`, `Платформа: ${ROLE_LABEL[r].ru}`, `${ROLE_LABEL[r].en} platform`), 'info');
            nav('/app');
          }}
          className={cn('rounded-lg py-1.5 text-[11px] font-bold transition-colors', state.profile.role === r ? 'bg-card text-brand shadow-sm' : 'text-muted hover:text-fg')}
        >
          {L(ROLE_LABEL[r])}
        </button>
      ))}
    </div>
  );
}

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { state } = useUser();
  const { L } = useT();
  return (
    <nav className="space-y-5" aria-label="Main">
      {navFor(state.profile.role).map((g) => (
        <div key={g.title.en}>
          <p className="mb-1.5 px-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted/60">{L(g.title)}</p>
          <div className="space-y-0.5">
            {g.items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/app'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn('group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200', isActive ? 'text-white' : 'text-muted hover:bg-fg/5 hover:text-fg')
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId={onNavigate ? 'nav-active-m' : 'nav-active'} transition={T.spring} className="absolute inset-0 rounded-xl bg-brand shadow-glow" />}
                    <it.icon className="relative h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
                    <span className="relative flex-1">{L(it.label)}</span>
                    {it.wow && <span className="relative rounded-md bg-gradient-to-r from-brand2 to-brand px-1.5 py-0.5 text-[10px] font-extrabold text-white ring-1 ring-white/30">WOW</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function NotificationBell() {
  const { state, update } = useUser();
  const { L, tx } = useT();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = state.notifications.filter((n) => !n.read).length;
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button className="btn-ghost relative h-10 w-10 px-0" onClick={() => setOpen((o) => !o)} aria-label={tx('Bildirishnomalar', 'Уведомления', 'Notifications')}>
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <motion.span key={unread} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </motion.span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="card absolute right-0 z-50 mt-2 w-[min(92vw,360px)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-bold">{tx('Bildirishnomalar', 'Уведомления', 'Notifications')}</span>
              <button className="text-xs font-semibold text-brand" onClick={() => update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }))}>
                {tx("Hammasini oʻqildi", 'Прочитать все', 'Mark all read')}
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {state.notifications.slice(0, 6).map((n) => (
                <button
                  key={n.id}
                  className="flex w-full gap-3 border-b border-line/60 px-4 py-3 text-left hover:bg-fg/5"
                  onClick={() => {
                    update((s) => ({ ...s, notifications: s.notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)) }));
                    setOpen(false);
                    if (n.link) nav(n.link);
                  }}
                >
                  <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-brand')} />
                  <span>
                    <span className="block text-sm font-semibold">{L(n.title)}</span>
                    <span className="block text-xs text-muted">{L(n.body)}</span>
                  </span>
                </button>
              ))}
            </div>
            <Link to="/app/notifications" onClick={() => setOpen(false)} className="block px-4 py-3 text-center text-sm font-semibold text-brand hover:bg-fg/5">
              {tx("Barchasini koʻrish", 'Смотреть все', 'View all')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Fires in-app reminders at their scheduled time */
function ReminderWatcher() {
  const { state, update, toast } = useUser();
  const { tx } = useT();
  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const tick = () => {
      const s = stateRef.current;
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const stamp = `${dateKey()} ${hm}`;
      const due = s.reminders.filter((r) => r.enabled && r.time === hm && r.days.includes(now.getDay()) && r.lastFired !== stamp);
      if (!due.length) return;
      update((st) => ({
        ...st,
        reminders: st.reminders.map((r) => (due.some((d) => d.id === r.id) ? { ...r, lastFired: stamp } : r)),
        notifications: [
          ...due.map((r) => ({ id: r.id + stamp, date: now.toISOString(), kind: 'reminder' as const, read: false, link: '/app/scan', title: { uz: '⏰ Eslatma', ru: '⏰ Напоминание', en: '⏰ Reminder' }, body: r.label })),
          ...st.notifications,
        ],
      }));
      due.forEach((r) => toast(`⏰ ${reminderLabel(r.label, tx)}`, 'info'));
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, [update, toast, tx]);
  return null;
}

export default function AppLayout() {
  const { state, logout, settings } = useUser();
  const { L, tx } = useT();
  const location = useLocation();
  const outlet = useOutlet();
  const nav = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const lvl = levelOf(state.points);
  const streak = streakOf(state.activeDays);
  const roleItems = navFor(state.profile.role).flatMap((g) => g.items);
  const match = (n: { to: string }) => (n.to === '/app' ? location.pathname === '/app' : location.pathname.startsWith(n.to));
  const current = roleItems.find(match) ?? ALL_NAV.find(match);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: settings.lite ? 'auto' : 'smooth' });
  }, [location.pathname, settings.lite]);

  // Mobile bottom bar — the big centre button is each platform's main action
  const role = state.profile.role;
  const bottom =
    role === 'parent'
      ? [
          { to: '/app', icon: LayoutDashboard, label: tx('Panel', 'Панель', 'Home') },
          { to: '/app/parent', icon: Send, label: tx('Hisobot', 'Отчёт', 'Report') },
          { to: '/app/tutors', icon: CalendarCheck, label: tx('Ustoz', 'Учитель', 'Tutor'), big: true },
          { to: '/app/achievements', icon: Flower2, label: tx('Bogʻ', 'Сад', 'Garden') },
        ]
      : role === 'teacher'
        ? [
            { to: '/app', icon: School, label: tx('Sinf', 'Класс', 'Class') },
            { to: '/app/map', icon: Network, label: tx('Xarita', 'Карта', 'Map') },
            { to: '/app/scan', icon: Rewind, label: tx('Skaner', 'Сканер', 'Scan'), big: true },
            { to: '/app/tutors', icon: CalendarCheck, label: tx('Ustozlar', 'Учителя', 'Tutors') },
          ]
        : [
            { to: '/app', icon: LayoutDashboard, label: tx('Bosh', 'Главная', 'Home') },
            { to: '/app/map', icon: Network, label: tx('Xarita', 'Карта', 'Map') },
            { to: '/app/scan', icon: Rewind, label: tx('Skaner', 'Сканер', 'Scan'), big: true },
            { to: '/app/tutors', icon: CalendarCheck, label: tx('Ustoz', 'Учитель', 'Tutor') },
          ];

  return (
    <div className="relative min-h-screen">
      <ReminderWatcher />
      {/* Soft ambient glow behind the app */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-brand2/[0.07] blur-3xl" />
      </div>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line/70 bg-card/60 backdrop-blur-xl lg:flex">
        <div className="px-6 py-4">
          <Link to="/" aria-label="IldizAI">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <SideNav />
        </div>
        <div className="space-y-3 border-t border-line/70 p-4">
          <RoleSwitcher />
          <div className="flex items-center gap-3">
            <Avatar name={state.profile.name} size={38} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{state.profile.name}</p>
              <p className="text-xs text-muted">
                {lvl.cur.emoji} {L(lvl.cur.name)} · {state.points} {tx('ball', 'очк.', 'pts')}
              </p>
            </div>
            <button
              className="btn-ghost h-9 w-9 px-0"
              onClick={() => {
                logout();
                nav('/');
              }}
              aria-label={tx('Chiqish', 'Выйти', 'Log out')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-line/60 bg-bg/75 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
            <button className="btn-ghost h-10 w-10 px-0 lg:hidden" onClick={() => setDrawer(true)} aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <Logo small />
            </div>
            <p className="hidden text-sm font-semibold text-muted lg:block">{current ? L(current.label) : ''}</p>
            <div className="ml-auto flex items-center gap-1">
              <Link to="/app/achievements" className="mr-1 hidden items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-sm font-bold text-orange-500 sm:flex" title={tx('Seriya', 'Серия', 'Streak')}>
                <Flame className="h-4 w-4" /> {streak}
              </Link>
              <LangSwitch />
              <ThemeToggle />
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-card/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="Bottom">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2">
          {bottom.map((b) => (
            <NavLink
              key={b.to}
              to={b.to}
              end={b.to === '/app'}
              className={({ isActive }) => cn('flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold', isActive ? 'text-brand' : 'text-muted')}
            >
              {b.big ? (
                <span className="-mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand2 text-white shadow-glow">
                  <b.icon className="h-6 w-6" />
                </span>
              ) : (
                <b.icon className="h-5 w-5" />
              )}
              {b.label}
            </NavLink>
          ))}
          <button className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted" onClick={() => setDrawer(true)}>
            <Menu className="h-5 w-5" />
            {tx("Koʻproq", 'Ещё', 'More')}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)}>
            <motion.aside
              className="h-full w-[82%] max-w-xs overflow-y-auto bg-card p-4"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo small />
                <button className="btn-ghost h-9 w-9 px-0" onClick={() => setDrawer(false)} aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-5">
                <RoleSwitcher />
              </div>
              <SideNav onNavigate={() => setDrawer(false)} />
              <button
                className="btn-secondary mt-6 w-full"
                onClick={() => {
                  logout();
                  nav('/');
                }}
              >
                <LogOut className="h-4 w-4" /> {tx('Chiqish', 'Выйти', 'Log out')}
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
