// Navbar + footer for public pages (landing, impact, auth).
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './ui';
import { LangSwitch, ThemeToggle } from './Controls';
import { useApp, useT } from '../store/AppContext';
import { cn } from '../lib/utils';

export function PublicNav() {
  const { tx } = useT();
  const { state, loginDemo } = useApp();
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links = [
    { href: '/#problem', label: tx('Muammo', 'Проблема', 'Problem') },
    { href: '/#how', label: tx('Qanday ishlaydi', 'Как работает', 'How it works') },
    { href: '/#features', label: tx('Imkoniyatlar', 'Возможности', 'Features') },
    { href: '/impact', label: tx("Ta'sir", 'Влияние', 'Impact') },
    { href: '/#faq', label: tx('Savol-javob', 'Вопросы', 'FAQ') },
  ];
  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith('/#')) {
      nav('/');
      window.setTimeout(() => document.getElementById(href.slice(2))?.scrollIntoView({ behavior: 'smooth' }), 60);
    } else nav(href);
  };
  return (
    <header className={cn('fixed inset-x-0 top-0 z-40 transition-all', scrolled ? 'border-b border-line/60 bg-bg/75 backdrop-blur-xl' : 'bg-transparent')}>
      <div className="section flex h-16 items-center gap-4">
        <Link to="/" aria-label="IldizAI">
          <Logo />
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button key={l.href} onClick={() => go(l.href)} className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition hover:text-fg">
              {l.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <LangSwitch />
          <ThemeToggle />
          {state ? (
            <Link to="/app" className="btn-primary ml-2 hidden sm:inline-flex">
              {tx('Kabinet', 'Кабинет', 'Dashboard')}
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                {tx('Kirish', 'Войти', 'Log in')}
              </Link>
              <button
                className="btn-primary ml-1 hidden sm:inline-flex"
                onClick={() => {
                  loginDemo();
                  nav('/app/scan?auto=1');
                }}
              >
                {tx('Demo', 'Демо', 'Demo')}
              </button>
            </>
          )}
          <button className="btn-ghost h-10 w-10 px-0 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-line bg-bg/95 backdrop-blur md:hidden">
            <div className="section flex flex-col gap-1 py-3">
              {links.map((l) => (
                <button key={l.href} onClick={() => go(l.href)} className="rounded-lg px-3 py-2.5 text-left font-semibold hover:bg-fg/5">
                  {l.label}
                </button>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to={state ? '/app' : '/login'} className="btn-secondary" onClick={() => setOpen(false)}>
                  {state ? tx('Kabinet', 'Кабинет', 'Dashboard') : tx('Kirish', 'Войти', 'Log in')}
                </Link>
                <Link to="/signup" className="btn-primary" onClick={() => setOpen(false)}>
                  {tx('Boshlash', 'Начать', 'Start')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  const { tx } = useT();
  return (
    <footer className="border-t border-line/70 bg-card/40">
      <div className="section grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">
            {tx(
              'Javobni emas — sababni topadi. Oʻzbekiston maktab oʻquvchilari uchun xatolar ildizini topuvchi platforma.',
              'Находит не ответ, а причину. Платформа поиска корней ошибок для школьников Узбекистана.',
              'Finds the cause, not the answer. A root-cause learning platform for Uzbekistan’s students.',
            )}
          </p>
          <p className="mt-4 text-xs text-muted">Coddycamp IT Academy · {tx("Xakaton 2026 · Zamonaviy taʼlim", 'Хакатон 2026 · Современное образование', 'Hackathon 2026 · Modern education')}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">{tx('Platforma', 'Платформа', 'Platform')}</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-fg" to="/app/scan">{tx('Vaqt mashinasi', 'Машина времени', 'Time Machine')}</Link></li>
            <li><Link className="hover:text-fg" to="/app/map">{tx('Bilim xaritasi', 'Карта знаний', 'Knowledge map')}</Link></li>
            <li><Link className="hover:text-fg" to="/app/parent">{tx('Ota-ona hisoboti', 'Отчёт родителям', 'Parent report')}</Link></li>
            <li><Link className="hover:text-fg" to="/impact">{tx("Ta'sir", 'Влияние', 'Impact')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">{tx('Aloqa', 'Контакты', 'Contact')}</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>hello@ildizai.uz</li>
            <li>Telegram: @ildizai_bot</li>
            <li>{tx('Qarshi · Toshkent', 'Карши · Ташкент', 'Qarshi · Tashkent')}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60 py-5 text-center text-xs text-muted">© 2026 IldizAI · {tx('Barcha huquqlar himoyalangan', 'Все права защищены', 'All rights reserved')}</div>
    </footer>
  );
}
