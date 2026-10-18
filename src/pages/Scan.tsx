// ⏪ THE WOW FEATURE — "Vaqt mashinasi" (Time Machine).
// Flow: pick problem → type wrong answer (+ optional photo) → scan notebook →
// rewind through grades along the prerequisite graph → 3 check questions → root.
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, animate, motion } from 'framer-motion';
import {
  ArrowRight, BookOpen, Play, Camera, CheckCircle2, Gavel, History, ImagePlus, Lightbulb, Map, RotateCcw, Rewind, ScanLine, Send, Sparkles, X, XCircle,
} from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { PROBLEMS, Problem } from '../data/problems';
import { TOPIC } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { diagnose, Diagnosis, gradeGap, resolveRoot } from '../lib/diagnose';
import { REASON } from '../lib/seed';
import { celebrate } from '../lib/confetti';
import { cn, seeded, shuffle, uid } from '../lib/utils';
import { PageHeader } from '../components/ui';
import { T } from '../lib/motion';

type Phase = 'pick' | 'scan' | 'rewind' | 'check' | 'result' | 'correct';
type Wrong = Extract<Diagnosis, { kind: 'wrong' }>;

/** Lined-paper notebook with handwritten work */
function Notebook({ problem, lines, wrongIdx, scanning, photo, highlight }: { problem: Problem; lines: string[]; wrongIdx?: number; scanning?: boolean; photo?: string | null; highlight?: boolean }) {
  const { L } = useT();
  return (
    <div className="notebook relative overflow-hidden rounded-2xl p-5 pl-16 font-hand text-[26px] leading-9 shadow-soft">
      {photo && <img src={photo} alt="Uploaded notebook" className="absolute right-3 top-3 h-20 w-20 rotate-3 rounded-lg border-4 border-white object-cover shadow-lg" />}
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">{L(problem.prompt)}</p>
      <p className="font-bold">{L(problem.text)}</p>
      {lines.map((l, i) => (
        <motion.p key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i }} className="relative w-fit">
          <span className={cn(highlight && i === wrongIdx && 'text-rose-600')}>{l}</span>
          {highlight && i === wrongIdx && (
            <motion.svg viewBox="0 0 200 60" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-3 -inset-y-1 h-[calc(100%+8px)] w-[calc(100%+24px)]">
              <motion.ellipse cx="100" cy="30" rx="96" ry="26" fill="none" stroke="#e11d48" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
            </motion.svg>
          )}
        </motion.p>
      ))}
      {scanning && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 h-16 animate-scan bg-gradient-to-b from-transparent via-violet-500/25 to-transparent">
            <div className="absolute inset-x-0 bottom-1/2 h-0.5 bg-violet-500 shadow-[0_0_16px_4px_rgba(124,92,255,0.6)]" />
          </div>
        </div>
      )}
    </div>
  );
}

/** Big rewind dial counting grades backwards */
function Dial({ from, to, lite, label }: { from: number; to: number; lite: boolean; label: string }) {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (lite) return setV(to);
    const c = animate(from, to, { duration: 0.9 * Math.max(1, from - to) + 0.4, ease: 'easeInOut', onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [from, to, lite]);
  const year = 2026 - (from - v);
  return (
    <div className="relative mx-auto grid h-36 w-36 sm:h-48 sm:w-48 place-items-center">
      {/* time-tunnel rings */}
      {!lite &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-brand/40"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
          />
        ))}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(from 0deg, rgb(var(--brand)), #d946ef, rgb(var(--brand) / 0.1), rgb(var(--brand)))' }}
        animate={lite ? {} : { rotate: -720 }}
        transition={{ duration: 0.9 * Math.max(1, from - to) + 0.4, ease: 'easeInOut' }}
      />
      <div className="absolute inset-2 rounded-full bg-card" />
      <div className="relative text-center">
        <div className="text-5xl sm:text-6xl font-extrabold tabular-nums text-brand">{v}</div>
        <div className="text-xs font-bold uppercase tracking-widest text-muted">
          {label} · {year}
        </div>
      </div>
    </div>
  );
}

export default function Scan() {
  const { state, update, addPoints, notify, settings, toast } = useUser();
  const { tx, L } = useT();
  const lite = settings.lite;
  const [phase, setPhase] = useState<Phase>('pick');
  const [gradeFilter, setGradeFilter] = useState<number | 0>(0);
  const [problem, setProblem] = useState<Problem>(PROBLEMS[0]);
  const [answer, setAnswer] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [diag, setDiag] = useState<Wrong | null>(null);
  const [found, setFound] = useState(false);
  const [rewindDone, setRewindDone] = useState(false);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [judge, setJudge] = useState(false);
  const [auto, setAuto] = useState(false); // 60-second autoplay for the stage
  const inputRef = useRef<HTMLInputElement>(null);
  const savedRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [params, setParams] = useSearchParams();
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const list = PROBLEMS.filter((p) => !gradeFilter || p.grade === gradeFilter);
  const hypothesis = diag ? diag.chain[diag.chain.length - 1] : null;
  const questions = hypothesis ? QUESTIONS[hypothesis] ?? [] : [];
  const shuffled = useMemo(
    () => questions.map((q, i) => {
      const order = shuffle(q.options.map((_, k) => k), seeded(i * 13 + q.options.length));
      return { ...q, order };
    }),
    [questions],
  );
  const wrongCount = results.filter((r) => !r).length;
  const outcome = diag ? resolveRoot(diag.chain, wrongCount, !!diag.pattern) : null;

  // Scan → rewind timing
  useEffect(() => {
    if (phase !== 'scan') return;
    setFound(false);
    const t1 = window.setTimeout(() => setFound(true), lite ? 300 : 1400);
    const t2 = window.setTimeout(() => setPhase('rewind'), lite ? 900 : auto ? 4200 : 3000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase, lite, auto]);

  // On phones keep the active stage in view as the story moves forward
  useEffect(() => {
    if (phase === 'pick' || window.innerWidth >= 1024) return;
    stageRef.current?.scrollIntoView({ behavior: lite ? 'auto' : 'smooth', block: 'start' });
  }, [phase, lite]);

  useEffect(() => {
    if (phase !== 'rewind' || !diag) return;
    setRewindDone(false);
    const t = window.setTimeout(() => setRewindDone(true), lite ? 300 : 900 * diag.chain.length + 700);
    return () => window.clearTimeout(t);
  }, [phase, diag, lite]);

  // Autoplay: rewind → check
  useEffect(() => {
    if (!auto || phase !== 'rewind' || !rewindDone) return;
    const t = window.setTimeout(() => setPhase('check'), 2800);
    return () => window.clearTimeout(t);
  }, [auto, phase, rewindDone]);

  // Autoplay: answer the check questions the way the struggling child would
  useEffect(() => {
    if (!auto || phase !== 'check' || picked !== null || !shuffled[qi]) return;
    const t = window.setTimeout(() => {
      const q = shuffled[qi];
      pick(q.order.find((oi) => oi !== q.answer) ?? q.order[0]);
    }, 1900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, phase, qi, picked, shuffled]);

  useEffect(() => {
    if (phase === 'result' || phase === 'correct') setAuto(false);
  }, [phase]);

  // Presenter shortcuts: 1–4 pick an option, Enter continues
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (phase === 'check' && shuffled[qi] && /^[1-4]$/.test(e.key)) {
        const oi = shuffled[qi].order[Number(e.key) - 1];
        if (oi !== undefined) pick(oi);
      }
      if (phase === 'rewind' && rewindDone && e.key === 'Enter') setPhase('check');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qi, shuffled, rewindDone, picked, results]);

  // Save the result exactly once
  useEffect(() => {
    if (phase !== 'result' || !diag || !outcome || savedRef.current) return;
    savedRef.current = true;
    const gap = gradeGap(problem.grade, outcome.rootId);
    update((s) => ({
      ...s,
      history: [{ id: uid(), date: new Date().toISOString(), problemId: problem.id, answer, rootId: outcome.rootId, chain: diag.chain, confidence: outcome.confidence, closed: false }, ...s.history].slice(0, 50),
      mastery: { ...s.mastery, [outcome.rootId]: Math.min(s.mastery[outcome.rootId] ?? 30, outcome.confirmed ? 30 : 45) },
      stats: { ...s.stats, scans: s.stats.scans + 1, maxRewind: Math.max(s.stats.maxRewind, gap), perfectChecks: s.stats.perfectChecks + (wrongCount === 0 ? 1 : 0) },
    }));
    addPoints(50, REASON.root, 3);
    notify({
      kind: 'success',
      link: `/app/lesson/${outcome.rootId}`,
      title: tx('Ildiz topildi 🎯', 'Корень найден 🎯', 'Root found 🎯'),
      body: {
        uz: `${TOPIC[outcome.rootId].grade}-sinf: ${TOPIC[outcome.rootId].title.uz}`,
        ru: `${TOPIC[outcome.rootId].grade} класс: ${TOPIC[outcome.rootId].title.ru}`,
        en: `Grade ${TOPIC[outcome.rootId].grade}: ${TOPIC[outcome.rootId].title.en}`,
      },
    });
    celebrate(false);
  }, [phase, diag, outcome, problem, answer, wrongCount, update, addPoints, notify, tx]);

  const start = (value: string = answer, pr: Problem = problem) => {
    if (!value.trim()) {
      toast(tx('Avval bolaning javobini kiriting', 'Сначала введите ответ ребёнка', "Enter the child's answer first"), 'error');
      inputRef.current?.focus();
      return;
    }
    const d = diagnose(pr, value);
    savedRef.current = false;
    setResults([]);
    setQi(0);
    setPicked(null);
    if (d.kind === 'correct') {
      setDiag(null);
      setPhase('correct');
      addPoints(20, REASON.correct, 1);
      celebrate(false);
      return;
    }
    setDiag(d);
    setPhase('scan');
  };

  /** One click → the full story in ~45 s: types "2/3", scans, rewinds, answers as the child */
  const startAuto = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    const pr = PROBLEMS[0];
    const value = '2/3';
    setPhase('pick');
    setJudge(false);
    setGradeFilter(0);
    setProblem(pr);
    setPhoto(null);
    setAnswer('');
    setAuto(true);
    [...value].forEach((_, i) => later(() => setAnswer(value.slice(0, i + 1)), 500 + i * 260));
    later(() => start(value, pr), 500 + value.length * 260 + 700);
  };

  useEffect(() => {
    if (params.get('auto') === '1') {
      setParams({}, { replace: true });
      startAuto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setAuto(false);
    setPhase('pick');
    setAnswer('');
    setDiag(null);
    setPhoto(null);
    setResults([]);
    setQi(0);
    setPicked(null);
  };

  const onPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setPhoto(String(r.result));
      toast(tx('Rasm biriktirildi. Daftardagi javobni kiriting.', 'Фото прикреплено. Введите ответ из тетради.', 'Photo attached. Type the answer from the notebook.'), 'info');
      inputRef.current?.focus();
    };
    r.readAsDataURL(f);
  };

  const pick = (optIndex: number) => {
    if (picked !== null) return;
    setPicked(optIndex);
    const ok = optIndex === questions[qi].answer;
    window.setTimeout(() => {
      const next = [...results, ok];
      setResults(next);
      setPicked(null);
      if (qi + 1 >= questions.length) setPhase('result');
      else setQi(qi + 1);
    }, lite ? 350 : 750);
  };

  const enterJudge = () => {
    setJudge(true);
    setProblem(PROBLEMS[0]);
    setAnswer('');
    setPhase('pick');
    window.setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div>
      <PageHeader
        icon={<Rewind className="h-6 w-6" />}
        title={tx('Vaqt mashinasi', 'Машина времени', 'Time Machine')}
        subtitle={tx(
          "Xato javobni kiriting — biz uning ildizini oldingi sinflardan topamiz.",
          'Введите неверный ответ — мы найдём его корень в прошлых классах.',
          "Enter a wrong answer — we'll find its root in earlier grades.",
        )}
        action={
          <div className="flex flex-wrap gap-2">
            {phase === 'pick' && !auto ? (
              <>
                <button className="btn-primary" onClick={startAuto}>
                  <Play className="h-4 w-4" /> {tx('60 soniyalik demo', 'Демо за 60 секунд', '60-second demo')}
                </button>
                <button className={cn('btn', judge ? 'bg-brand2 text-white shadow-glow' : 'btn-secondary')} onClick={enterJudge}>
                  <Gavel className="h-4 w-4" /> {tx('Hakam rejimi', 'Режим жюри', 'Judge mode')}
                </button>
              </>
            ) : (
              <button className="btn-secondary" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> {tx('Boshqa masala', 'Другая задача', 'Another problem')}
              </button>
            )}
          </div>
        }
      />

      <AnimatePresence>
        {auto && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-4 flex items-center gap-3 rounded-2xl border border-brand/30 bg-brand-soft px-4 py-2.5 text-sm font-semibold text-brand">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
            </span>
            {tx('Avto-demo: Jasur "2/3" deb yozdi — kuzating', 'Авто-демо: Жасур написал «2/3» — смотрите', 'Auto demo: Jasur wrote "2/3" — watch')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage progress */}
      <div ref={stageRef} className="mb-6 flex scroll-mt-20 items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { k: ['pick'], l: tx('Masala', 'Задача', 'Problem') },
          { k: ['scan'], l: tx('Skaner', 'Сканер', 'Scan') },
          { k: ['rewind'], l: tx('Orqaga', 'Назад', 'Rewind') },
          { k: ['check'], l: tx('Tekshiruv', 'Проверка', 'Check') },
          { k: ['result', 'correct'], l: tx('Ildiz', 'Корень', 'Root') },
        ].map((s, i, arr) => {
          const order = ['pick', 'scan', 'rewind', 'check', 'result'];
          const cur = order.indexOf(phase === 'correct' ? 'result' : phase);
          const active = i <= cur;
          return (
            <div key={i} className="flex shrink-0 items-center gap-2">
              <span className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 transition', active ? 'bg-brand text-white' : 'bg-fg/5 text-muted')}>
                <span>{i + 1}</span> {s.l}
              </span>
              {i < arr.length - 1 && <span className={cn('h-0.5 w-6 rounded', i < cur ? 'bg-brand' : 'bg-line')} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ─────────── PICK ─────────── */}
        {phase === 'pick' && (
          <motion.div key="pick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 lg:grid-cols-5">
            <div className="order-2 min-w-0 lg:order-none lg:col-span-2">
              <div className="mb-3 flex flex-wrap gap-2">
                {[0, 5, 6, 7, 8].map((g) => (
                  <button key={g} onClick={() => setGradeFilter(g)} className={cn('rounded-full border px-3 py-1.5 text-xs font-bold transition', gradeFilter === g ? 'border-brand bg-brand text-white' : 'border-line text-muted hover:text-fg')}>
                    {g === 0 ? tx('Hammasi', 'Все', 'All') : `${g}-${tx('sinf', 'кл.', 'gr.')}`}
                  </button>
                ))}
              </div>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:max-h-[560px] lg:space-y-2 lg:overflow-y-auto lg:px-0 lg:pb-0 lg:pr-1">
                {list.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setProblem(p);
                      setAnswer('');
                    }}
                    className={cn('card card-hover flex w-[230px] shrink-0 items-center gap-3 p-3 text-left lg:w-full', problem.id === p.id && 'border-brand ring-4 ring-brand/15')}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-extrabold text-brand">{p.grade}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-sm font-semibold">{L(p.text)}</span>
                      <span className="block truncate text-xs text-muted">{L(TOPIC[p.topicId].title)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="order-1 min-w-0 space-y-4 lg:order-none lg:col-span-3">
              {judge && (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl bg-gradient-to-r from-brand2 to-brand p-5 text-white shadow-glow">
                  <p className="text-xl font-extrabold">🎤 {tx('Hurmatli hakam, xato qiling!', 'Уважаемое жюри, ошибитесь!', 'Dear judge, make a mistake!')}</p>
                  <p className="mt-1 text-sm text-white/85">
                    {tx('Istalgan notoʻgʻri javobni yozing — masalan 2/3 yoki 1/2. Vaqt mashinasi sababini topadi.', 'Напишите любой неверный ответ — например 2/3 или 1/2. Машина времени найдёт причину.', 'Type any wrong answer — e.g. 2/3 or 1/2. The Time Machine will find why.')}
                  </p>
                </motion.div>
              )}
              <Notebook problem={problem} lines={answer ? [`= ${answer}`] : ['…']} photo={photo} />
              <div className="card p-5">
                <label htmlFor="ans" className="label">
                  {tx('Bolaning javobi (daftardagidek)', 'Ответ ребёнка (как в тетради)', "The child's answer (as in the notebook)")}
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="ans"
                    ref={inputRef}
                    className={cn('input font-mono', judge && 'py-4 text-xl')}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && start()}
                    placeholder={tx('masalan: 2/3', 'например: 2/3', 'e.g. 2/3')}
                    autoComplete="off"
                  />
                  <button className="btn-primary btn-lg shrink-0" onClick={() => start()}>
                    <ScanLine className="h-5 w-5" /> {tx('Ildizni topish', 'Найти корень', 'Find the root')}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">{tx('Tipik xatolar:', 'Типичные ошибки:', 'Typical mistakes:')}</span>
                  {problem.patterns.slice(0, 3).map((pt) => (
                    <button key={pt.answers[0]} onClick={() => setAnswer(pt.answers[0])} className="rounded-full bg-rose-500/10 px-3 py-1 font-mono text-xs font-bold text-rose-500 hover:bg-rose-500/20">
                      {pt.answers[0]}
                    </button>
                  ))}
                  <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:text-fg">
                    <ImagePlus className="h-3.5 w-3.5" /> {tx('Daftar rasmi', 'Фото тетради', 'Notebook photo')}
                    <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onPhoto} />
                  </label>
                  {photo && (
                    <button onClick={() => setPhoto(null)} className="text-muted hover:text-rose-500" aria-label="Remove photo">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {state.history.length > 0 && (
                <div className="card p-5">
                  <p className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <History className="h-4 w-4 text-brand" /> {tx("Soʻnggi tahlillar", 'Последние анализы', 'Recent analyses')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {state.history.slice(0, 5).map((h) => (
                      <Link key={h.id} to={`/app/lesson/${h.rootId}`} className={cn('rounded-full px-3 py-1 text-xs font-semibold', h.closed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600')}>
                        {TOPIC[h.rootId].grade} · {L(TOPIC[h.rootId].title)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─────────── SCAN ─────────── */}
        {phase === 'scan' && diag && (
          <motion.div key="scan" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-2xl space-y-4">
            <Notebook problem={problem} lines={diag.steps} wrongIdx={diag.wrongStep} scanning={!found} highlight={found} photo={photo} />
            <div className="card flex items-center gap-4 p-5">
              {found ? <XCircle className="h-8 w-8 shrink-0 text-rose-500" /> : <Camera className="h-8 w-8 shrink-0 animate-pulse text-brand" />}
              <div>
                <p className="font-bold">
                  {found
                    ? tx(`Xato topildi: ${diag.wrongStep + 1}-qadam`, `Ошибка найдена: шаг ${diag.wrongStep + 1}`, `Mistake found: step ${diag.wrongStep + 1}`)
                    : tx("Daftar oʻqilmoqda…", 'Читаем тетрадь…', 'Reading the notebook…')}
                </p>
                <p className="text-sm text-muted">{found ? L(diag.mis) : tx("Qoʻlyozma qadamlarini tahlil qilyapmiz", 'Анализируем рукописные шаги', 'Analyzing handwritten steps')}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─────────── REWIND ─────────── */}
        {phase === 'rewind' && diag && (
          <motion.div key="rewind" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative overflow-hidden rounded-3xl border border-line bg-card/70 p-6 sm:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--brand)/0.18),transparent_60%)]" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div className="text-center">
                <p className="eyebrow mb-4">{tx('Vaqt mashinasi ishga tushdi', 'Машина времени запущена', 'Time Machine engaged')}</p>
                <Dial from={problem.grade} to={TOPIC[hypothesis!].grade} lite={lite} label={tx('sinf', 'класс', 'grade')} />
                <p className="mt-5 text-lg font-bold">
                  {gradeGap(problem.grade, hypothesis!) > 0
                    ? tx(`${gradeGap(problem.grade, hypothesis!)} sinf orqaga`, `На ${gradeGap(problem.grade, hypothesis!)} класс(а) назад`, `${gradeGap(problem.grade, hypothesis!)} grade(s) back`)
                    : tx('Shu sinf ichida', 'В пределах класса', 'Within this grade')}
                </p>
              </div>
              <div className="relative">
                <motion.div className="absolute bottom-6 left-[22px] top-6 w-0.5 origin-top bg-gradient-to-b from-rose-500 via-amber-500 to-brand" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: lite ? 0 : 0.9 * diag.chain.length, ease: 'easeInOut' }} />
                <div className="space-y-4">
                  {diag.chain.map((id, i) => {
                    const t = TOPIC[id];
                    const last = i === diag.chain.length - 1;
                    return (
                      <motion.div key={id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: lite ? 0 : 0.2 + i * 0.9 }} className="relative flex items-center gap-4">
                        <span className={cn('relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl font-extrabold text-white', i === 0 ? 'bg-rose-500' : last ? 'bg-brand' : 'bg-amber-500', last && rewindDone && 'ring-4 ring-brand/30')}>
                          {t.grade}
                        </span>
                        <div className={cn('card flex-1 p-4', last && rewindDone && 'border-brand shadow-glow')}>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted">
                            {t.grade}-{tx('sinf', 'класс', 'grade')}, {t.quarter}-{tx('chorak', 'четверть', 'quarter')}
                          </p>
                          <p className="font-bold">{L(t.title)}</p>
                          {i === 0 && <p className="mt-1 text-xs text-rose-500">{tx('Xato shu yerda koʻrindi', 'Ошибка проявилась здесь', 'The mistake showed up here')}</p>}
                          {last && rewindDone && <p className="mt-1 text-xs font-semibold text-brand">{tx('Gipoteza: ildiz shu yerda', 'Гипотеза: корень здесь', 'Hypothesis: the root is here')}</p>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
            <AnimatePresence>
              {rewindDone && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mt-8 flex flex-col items-center gap-3 text-center">
                  <p className="max-w-lg text-sm text-muted">
                    {tx('Bitta xatoga qarab xulosa qilmaymiz. 3 ta qisqa savol bilan tasdiqlaymiz — bola sifatida javob bering.', 'Не делаем вывод по одной ошибке. Подтвердим 3 вопросами — отвечайте как ребёнок.', "We never conclude from one mistake. Let's confirm with 3 quick questions — answer as the child.")}
                  </p>
                  <button className="btn-primary btn-lg" onClick={() => setPhase('check')}>
                    {tx('Tasdiqlash: 3 savol', 'Подтвердить: 3 вопроса', 'Confirm: 3 questions')} <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ─────────── CHECK ─────────── */}
        {phase === 'check' && diag && shuffled[qi] && (
          <motion.div key={'check' + qi} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="mx-auto max-w-xl">
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="chip">
                  {TOPIC[hypothesis!].grade}-{tx('sinf', 'класс', 'grade')} · {L(TOPIC[hypothesis!].title)}
                </span>
                <div className="flex gap-1.5">
                  {shuffled.map((_, i) => (
                    <span key={i} className={cn('h-2.5 w-8 rounded-full', i < results.length ? (results[i] ? 'bg-emerald-500' : 'bg-rose-500') : i === qi ? 'bg-brand' : 'bg-fg/10')} />
                  ))}
                </div>
              </div>
              <p className="mt-6 text-sm font-semibold text-muted">{L(shuffled[qi].prompt)}</p>
              <p className="mt-2 font-mono text-3xl font-extrabold">{L(shuffled[qi].q)}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {shuffled[qi].order.map((oi, k) => {
                  const isPicked = picked === oi;
                  const correct = oi === shuffled[qi].answer;
                  return (
                    <motion.button
                      key={oi}
                      whileTap={{ scale: 0.97 }}
                      animate={isPicked && !correct ? { x: [0, -6, 6, -3, 0] } : {}}
                      onClick={() => pick(oi)}
                      className={cn(
                        'relative rounded-xl border-2 px-4 py-4 font-mono text-lg font-bold transition-colors duration-200',
                        picked === null && 'border-line hover:border-brand hover:bg-brand-soft',
                        picked !== null && correct && 'border-emerald-500 bg-emerald-500/10 text-emerald-600',
                        isPicked && !correct && 'border-rose-500 bg-rose-500/10 text-rose-500',
                        picked !== null && !correct && !isPicked && 'border-line opacity-50',
                      )}
                    >
                      <span className="absolute left-3 top-2 font-sans text-[10px] font-bold text-muted/70">{k + 1}</span>
                      {shuffled[qi].options[oi]}
                    </motion.button>
                  );
                })}
              </div>
              <p className="mt-5 text-center text-xs text-muted">
                {tx("Bola sifatida javob bering · klaviaturada 1–4", 'Отвечайте как ребёнок · клавиши 1–4', 'Answer as the child · keys 1–4')}
              </p>
            </div>
          </motion.div>
        )}

        {/* ─────────── RESULT ─────────── */}
        {phase === 'result' && diag && outcome && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="grid gap-6 lg:grid-cols-5">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand2 p-8 text-white shadow-glow lg:col-span-3">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/80">
                <Sparkles className="h-4 w-4" /> {tx('Ildiz topildi', 'Корень найден', 'Root found')}
              </p>
              <p className="mt-4 text-white/80">
                {TOPIC[outcome.rootId].grade}-{tx('sinf', 'класс', 'grade')}, {TOPIC[outcome.rootId].quarter}-{tx('chorak', 'четверть', 'quarter')}
              </p>
              <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...T.slow, delay: 0.15 }} className="mt-1 text-3xl font-extrabold sm:text-4xl">
                {L(TOPIC[outcome.rootId].title)}
              </motion.h2>
              <p className="mt-4 max-w-lg text-white/90">{L(diag.mis)}</p>
              {/* Path: where the mistake showed up → where the root is */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-lg bg-white/15 px-2.5 py-1 font-mono">
                  {L(problem.text)} → <s className="opacity-80">{answer}</s>
                </span>
                {diag.chain.slice(0, diag.chain.indexOf(outcome.rootId) + 1).map((id, i) => (
                  <motion.span key={id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...T.base, delay: 0.3 + i * 0.15 }} className="flex items-center gap-2">
                    <ArrowRight className="h-3.5 w-3.5 opacity-70" />
                    <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold sm:text-sm', id === outcome.rootId ? 'bg-white text-brand' : 'bg-white/15')}>
                      {TOPIC[id].grade} · {L(TOPIC[id].title)}
                    </span>
                  </motion.span>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/15 p-3 text-center">
                  <p className="text-2xl font-extrabold">{outcome.confidence}%</p>
                  <p className="text-xs text-white/80">{tx('ishonch', 'уверенность', 'confidence')}</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 text-center">
                  <p className="text-2xl font-extrabold">{gradeGap(problem.grade, outcome.rootId)}</p>
                  <p className="text-xs text-white/80">{tx('sinf orqaga', 'кл. назад', 'grades back')}</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 text-center">
                  <p className="text-2xl font-extrabold">{wrongCount}/3</p>
                  <p className="text-xs text-white/80">{tx('xato javob', 'ошибок', 'wrong')}</p>
                </div>
              </div>
              {!outcome.confirmed && (
                <p className="mt-4 rounded-xl bg-white/15 p-3 text-sm">
                  {tx(
                    "Chuqurroq mavzuni bola biladi — demak boʻshliq bir pogʻona yuqorida.",
                    'Более глубокую тему ребёнок знает — значит, пробел на уровень выше.',
                    'The child knows the deeper topic — so the gap is one level up.',
                  )}
                </p>
              )}
            </div>
            <div className="space-y-3 lg:col-span-2">
              <Link to={`/app/lesson/${outcome.rootId}`} className="card card-hover flex items-center gap-4 p-5">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-white shadow-glow">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-bold">{tx('5 daqiqalik mikro-dars', '5-минутный микро-урок', '5-minute micro-lesson')}</span>
                  <span className="block text-sm text-muted">{tx('Faqat shu ildizni yopamiz', 'Закроем только этот корень', 'Close just this root')}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-brand" />
              </Link>
              <Link to="/app/parent" className="card card-hover flex items-center gap-4 p-5">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-sky-500/15 text-sky-500">
                  <Send className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-bold">{tx('Ota-onaga xabar', 'Сообщить родителям', 'Tell a parent')}</span>
                  <span className="block text-sm text-muted">{state.profile.parentName || tx('Ovozli hisobot', 'Голосовой отчёт', 'Voice report')}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-muted" />
              </Link>
              <Link to="/app/map" className="card card-hover flex items-center gap-4 p-5">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
                  <Map className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-bold">{tx('Bilim xaritasida koʻrish', 'Показать на карте знаний', 'See on knowledge map')}</span>
                  <span className="block text-sm text-muted">{tx('Qaysi mavzular bogʻliq', 'Какие темы связаны', 'Which topics depend on it')}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-muted" />
              </Link>
              <button className="btn-ghost w-full" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> {tx('Boshqa xatoni tekshirish', 'Проверить другую ошибку', 'Check another mistake')}
              </button>
            </div>
          </motion.div>
        )}

        {/* ─────────── CORRECT ─────────── */}
        {phase === 'correct' && (
          <motion.div key="correct" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card mx-auto max-w-xl p-8 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
            <h2 className="mt-4 text-2xl font-extrabold">{tx("Toʻgʻri! Ildiz mustahkam 🌳", 'Верно! Корень крепкий 🌳', 'Correct! The root is solid 🌳')}</h2>
            <p className="mt-2 text-muted">{tx("Bu javobda xato yoʻq. Yechim:", 'В этом ответе ошибки нет. Решение:', 'No mistake here. Solution:')}</p>
            <div className="notebook mx-auto mt-4 max-w-sm rounded-xl p-4 pl-14 text-left font-hand text-2xl leading-9">
              {problem.solution.map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button className="btn-primary" onClick={reset}>
                {tx('Yana sinash', 'Ещё раз', 'Try another')}
              </button>
              <Link to="/app/map" className="btn-secondary">
                <Lightbulb className="h-4 w-4" /> {tx('Bilim xaritasi', 'Карта знаний', 'Knowledge map')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
