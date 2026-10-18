// Language switcher and theme toggle used in every navbar.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Globe, Moon, Sun } from 'lucide-react';
import { Lang } from '../lib/types';
import { useApp } from '../store/AppContext';
import { cn } from '../lib/utils';

const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: 'uz', label: "Oʻzbekcha", short: 'UZ' },
  { id: 'ru', label: 'Русский', short: 'RU' },
  { id: 'en', label: 'English', short: 'EN' },
];

export function LangSwitch() {
  const { settings, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const cur = LANGS.find((l) => l.id === settings.lang)!;
  return (
    <div className="relative" ref={ref}>
      <button className="btn-ghost h-10 px-2.5" onClick={() => setOpen((o) => !o)} aria-label="Language" aria-expanded={open}>
        <Globe className="h-4 w-4" />
        <span className="text-xs font-bold">{cur.short}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="card absolute right-0 z-50 mt-2 w-44 overflow-hidden p-1"
          >
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setLang(l.id);
                  setOpen(false);
                }}
                className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-fg/5', l.id === settings.lang && 'font-bold text-brand')}
              >
                {l.label}
                {l.id === settings.lang && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ThemeToggle() {
  const { settings, toggleTheme } = useApp();
  const dark = settings.theme === 'dark';
  return (
    <button className="btn-ghost h-10 w-10 px-0" onClick={toggleTheme} aria-label={dark ? 'Light mode' : 'Dark mode'}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? 'd' : 'l'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
