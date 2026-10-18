// Global overlays: toast stack and the "new badge" celebration modal.
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, Sparkles, X, XCircle } from 'lucide-react';
import { useApp, useT } from '../store/AppContext';
import { BADGE, PLANTS } from '../lib/game';
import { PlantingScene } from './Garden';
import { useNavigate } from 'react-router-dom';
import { celebrate } from '../lib/confetti';
import { cn } from '../lib/utils';

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:pr-6" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            className="card pointer-events-auto flex max-w-sm items-center gap-3 px-4 py-3 text-sm font-medium"
          >
            <span
              className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-full',
                t.tone === 'error' ? 'bg-rose-500/15 text-rose-500' : t.tone === 'info' ? 'bg-sky-500/15 text-sky-500' : t.tone === 'points' ? 'bg-brand-soft text-brand' : 'bg-emerald-500/15 text-emerald-500',
              )}
            >
              {t.tone === 'error' ? <XCircle className="h-4 w-4" /> : t.tone === 'info' ? <Info className="h-4 w-4" /> : t.tone === 'points' ? <Sparkles className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </span>
            <span className="flex-1">{t.text}</span>
            <button onClick={() => dismissToast(t.id)} className="text-muted hover:text-fg" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function BadgeModal() {
  const { badgePopup, closeBadge } = useApp();
  const nav = useNavigate();
  const { L, tx } = useT();
  const badge = badgePopup ? BADGE[badgePopup] : null;
  useEffect(() => {
    if (badge) celebrate(false);
  }, [badge]);
  return (
    <AnimatePresence>
      {badge && (
        <motion.div className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeBadge}>
          <motion.div
            role="dialog"
            aria-modal="true"
            className="card w-full max-w-sm p-8 text-center"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* The achievement is planted live: seed drops, it sprouts and blooms */}
            <div className="relative mx-auto -mt-2 w-fit">
              <div className="absolute inset-x-6 bottom-4 top-6 rounded-full bg-gradient-to-b from-sky-200/60 to-emerald-200/40 blur-xl dark:from-sky-500/20 dark:to-emerald-500/10" />
              <PlantingScene badgeId={badge.id} className="relative" />
              <motion.span className="absolute -right-2 top-2 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand2 text-2xl shadow-glow" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.2 }}>
                {badge.emoji}
              </motion.span>
            </div>
            <p className="eyebrow mt-2">{tx('Yangi nishon!', 'Новый значок!', 'New badge!')}</p>
            <h3 className="mt-2 text-2xl font-extrabold">{L(badge.title)}</h3>
            <p className="mt-1 text-sm text-muted">{L(badge.desc)}</p>
            {PLANTS[badge.id] && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                🌱 {tx(`Bogʻingizga ekildi: ${PLANTS[badge.id].name.uz}`, `В ваш сад посажено: ${PLANTS[badge.id].name.ru}`, `Planted in your garden: ${PLANTS[badge.id].name.en}`)}
              </motion.p>
            )}
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                className="btn-secondary"
                onClick={() => {
                  closeBadge();
                  nav('/app/achievements');
                }}
              >
                🌳 {tx('Bogʻni koʻrish', 'Открыть сад', 'See garden')}
              </button>
              <button className="btn-primary" onClick={closeBadge}>
                {tx('Zoʻr!', 'Отлично!', 'Awesome!')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
