// Reusable UI building blocks shared by every page.
import { ReactNode, useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn, fmtNum } from '../lib/utils';
import { useApp } from '../store/AppContext';
import { pageVariants, T } from '../lib/motion';

export function Logo({ className = '', small = false }: { className?: string; small?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-extrabold', className)}>
      <span className={cn('grid place-items-center rounded-xl bg-gradient-to-br from-brand to-brand2 text-white shadow-glow', small ? 'h-8 w-8' : 'h-9 w-9')}>
        {/* sprout above the ground, roots below */}
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden>
          <path d="M32 34V18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 24c-2-7-8-10-14-9 1 7 7 10 14 9z" fill="currentColor" />
          <path d="M32 20c2-6 7-9 13-8-1 6-6 9-13 8z" fill="currentColor" opacity=".85" />
          <path d="M16 35h32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".7" />
          <path d="M32 35v8M32 41l-7 7M32 41l7 7M25 48l-3 5M39 48l3 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
      <span className={cn('tracking-tight', small ? 'text-lg' : 'text-xl')}>
        Ildiz<span className="text-brand">AI</span>
      </span>
    </span>
  );
}

/** Fade/slide in when scrolled into view */
export function Reveal({ children, delay = 0, className = '', y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...T.slow, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Animated number counter that starts when visible */
export function CountUp({ to, suffix = '', prefix = '', decimals = 0, className = '' }: { to: number; suffix?: string; prefix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const { settings } = useApp();
  const [v, setV] = useState(settings.lite ? to : 0);
  useEffect(() => {
    if (!inView) return;
    if (settings.lite) return setV(to);
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: setV });
    return () => c.stop();
  }, [inView, to, settings.lite]);
  const shown = decimals ? v.toFixed(decimals).replace('.', ',') : fmtNum(v);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

/** Page wrapper with enter/exit transition */
export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className={className}>
      {children}
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, icon, action }: { title: string; subtitle?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">{icon}</div>}
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Progress({ value, className = '', tone = 'bg-brand' }: { value: number; className?: string; tone?: string }) {
  return (
    <div className={cn('h-2.5 w-full overflow-hidden rounded-full bg-fg/10', className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div className={cn('h-full rounded-full', tone)} initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} transition={T.slow} />
    </div>
  );
}

export function Stars({ value, onChange, size = 16 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <div className="flex gap-0.5" role={onChange ? 'radiogroup' : undefined} aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(i)}
          className={cn('transition', onChange && 'hover:scale-125')}
          aria-label={`${i}`}
        >
          <Star style={{ width: size, height: size }} className={i <= value ? 'fill-amber-400 text-amber-400' : 'text-fg/20'} />
        </button>
      ))}
    </div>
  );
}

export function SkeletonCards({ n = 3, h = 'h-28' }: { n?: number; h?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className={cn('skeleton', h)} />
      ))}
    </div>
  );
}

/** Short fake loading state so skeletons show briefly (disabled in lite mode) */
export function useFakeLoad(ms = 550) {
  const { settings } = useApp();
  const [loading, setLoading] = useState(!settings.lite);
  useEffect(() => {
    if (settings.lite) return;
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
  }, [ms, settings.lite]);
  return loading;
}

export function Avatar({ name, size = 40, className = '' }: { name: string; size?: number; className?: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return (
    <span
      className={cn('grid shrink-0 place-items-center rounded-full font-bold text-white', className)}
      style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, hsl(${h} 70% 58%), hsl(${(h + 40) % 360} 70% 48%))` }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function Stat({ icon, label, value, hint, tone = 'text-brand bg-brand-soft' }: { icon: ReactNode; label: string; value: ReactNode; hint?: string; tone?: string }) {
  return (
    <div className="card card-hover p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted sm:text-sm">{label}</span>
        <span className={cn('hidden h-8 w-8 shrink-0 place-items-center rounded-xl sm:grid sm:h-9 sm:w-9', tone)}>{icon}</span>
      </div>
      <div className="mt-2 truncate text-xl font-extrabold sm:mt-3 sm:text-3xl">{value}</div>
      {hint && <div className="mt-1 line-clamp-2 text-[11px] text-muted sm:text-xs">{hint}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { id: T; label: string }[] }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-line bg-card/60 p-1">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          className={cn('relative rounded-xl px-4 py-2 text-sm font-semibold transition', value === it.id ? 'text-white' : 'text-muted hover:text-fg')}
        >
          {value === it.id && <motion.span layoutId={`tab-${items.map((i) => i.id).join('')}`} transition={T.spring} className="absolute inset-0 rounded-xl bg-brand shadow-glow" />}
          <span className="relative">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Soft animated gradient blobs for hero backgrounds */
export function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -left-24 -top-24 h-96 w-96 animate-blob rounded-full bg-brand/30 blur-3xl" />
      <div className="absolute -right-20 top-20 h-80 w-80 animate-blob rounded-full bg-brand2/25 blur-3xl [animation-delay:-5s]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-blob rounded-full bg-sky-400/20 blur-3xl [animation-delay:-10s]" />
    </div>
  );
}
