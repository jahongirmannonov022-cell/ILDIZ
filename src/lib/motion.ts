// One motion language for the whole app: same easing, same durations.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const T = {
  fast: { duration: 0.2, ease: EASE },
  base: { duration: 0.35, ease: EASE },
  slow: { duration: 0.6, ease: EASE },
  spring: { type: 'spring' as const, stiffness: 320, damping: 30 },
};

/** Standard enter/exit for pages and panels */
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: T.base },
  exit: { opacity: 0, y: -8, transition: T.fast },
};

/** Recharts tooltip styling that stays readable in light and dark mode */
export const chartTip = {
  contentStyle: { background: 'rgb(var(--card))', border: '1px solid rgb(var(--line))', borderRadius: 12, boxShadow: '0 12px 32px -12px rgb(0 0 0 / 0.25)' },
  labelStyle: { color: 'rgb(var(--fg))', fontWeight: 700, marginBottom: 4 },
  itemStyle: { color: 'rgb(var(--fg))' },
};
