// 5-minute micro-lesson: idea → worked example → practice with hint ladder → check → done.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Send, Sparkles, Timer, XCircle } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { LESSONS } from '../data/lessons';
import { TOPIC } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { REASON } from '../lib/seed';
import { celebrate } from '../lib/confetti';
import { recommendations } from '../lib/recommend';
import { cn, normalizeAnswer } from '../lib/utils';
import NotFound from './NotFound';

export default function LessonPage() {
  const { id = '' } = useParams();
  const lesson = LESSONS[id];
  const topic = TOPIC[id];
  if (!lesson || !topic) return <NotFound inApp />;
  return <LessonInner key={id} id={id} />;
}

function LessonInner({ id }: { id: string }) {
  const { state, update, addPoints, notify, toast } = useUser();
  const { tx, L } = useT();
  const nav = useNavigate();
  const lesson = LESSONS[id];
  const topic = TOPIC[id];
  const [step, setStep] = useState(0);
  const [exStep, setExStep] = useState(0);
  const [ans, setAns] = useState('');
  const [hints, setHints] = useState(0);
  const [practiceOk, setPracticeOk] = useState<boolean | null>(null);
  const [qIdx, setQIdx] = useState(() => Math.floor(Math.random() * 3));
  const [checkPick, setCheckPick] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(300);
  const questions = QUESTIONS[id] ?? [];
  const q = questions[qIdx % Math.max(1, questions.length)];
  const already = state.lessonsDone.includes(id);

  useEffect(() => {
    if (step >= 4) return;
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [step]);

  const steps = [tx("Gʻoya", 'Идея', 'Idea'), tx('Misol', 'Пример', 'Example'), tx('Mashq', 'Практика', 'Practice'), tx('Tekshiruv', 'Проверка', 'Check')];

  const checkPractice = () => {
    if (!ans.trim()) return;
    const ok = lesson.practice.answers.some((a) => normalizeAnswer(a) === normalizeAnswer(ans));
    setPracticeOk(ok);
    if (!ok) {
      if (hints < lesson.practice.hints.length) setHints((h) => h + 1);
      toast(tx("Hali emas — ishoraga qarang 💡", 'Пока нет — посмотрите подсказку 💡', 'Not yet — check the hint 💡'), 'info');
    }
  };

  const finish = () => {
    setStep(4);
    update((s) => ({
      ...s,
      mastery: { ...s.mastery, [id]: Math.max(s.mastery[id] ?? 0, 86) },
      lessonsDone: s.lessonsDone.includes(id) ? s.lessonsDone : [...s.lessonsDone, id],
      history: s.history.map((h) => (h.rootId === id ? { ...h, closed: true } : h)),
      stats: { ...s.stats, lessons: s.stats.lessons + 1 },
    }));
    addPoints(already ? 40 : 100, REASON.lesson, 5);
    notify({
      kind: 'success',
      link: '/app/map',
      title: tx('Ildiz yopildi 🌳', 'Корень закрыт 🌳', 'Root closed 🌳'),
      body: topic.title,
    });
    celebrate();
  };

  const pickCheck = (i: number) => {
    if (checkPick !== null) return;
    setCheckPick(i);
    if (i === q.answer) window.setTimeout(finish, 700);
  };

  const next = useMemo(() => recommendations({ ...state, mastery: { ...state.mastery, [id]: 90 } }, 1)[0], [state, id]);
  const mm = String(Math.floor(seconds / 60)).padStart(1, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button className="btn-ghost" onClick={() => nav(-1)}>
          <ArrowLeft className="h-4 w-4" /> {tx('Orqaga', 'Назад', 'Back')}
        </button>
        <span className="flex items-center gap-1.5 rounded-full bg-fg/5 px-3 py-1.5 text-sm font-bold tabular-nums">
          <Timer className="h-4 w-4 text-brand" /> {mm}:{ss}
        </span>
      </div>

      <p className="eyebrow">
        {topic.grade}-{tx('sinf', 'класс', 'grade')} · {topic.quarter}-{tx('chorak', 'четверть', 'quarter')} · {tx('mikro-dars', 'микро-урок', 'micro-lesson')}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold">{L(topic.title)}</h1>

      {step < 4 && (
        <div className="mt-6 grid grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <div key={s}>
              <div className="h-1.5 overflow-hidden rounded-full bg-fg/10">
                <motion.div className="h-full bg-brand" animate={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }} />
              </div>
              <p className={cn('mt-1.5 text-xs font-semibold', i <= step ? 'text-fg' : 'text-muted')}>{s}</p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="mt-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="card p-6">
                <p className="text-xl font-bold">{L(lesson.idea)}</p>
              </div>
              <div className="card flex gap-4 border-amber-400/40 bg-amber-500/5 p-6">
                <span className="text-3xl" aria-hidden>🫓</span>
                <p className="text-muted">{L(lesson.analogy)}</p>
              </div>
              <div className="card p-6">
                <p className="eyebrow">{tx('Qoida', 'Правило', 'Rule')}</p>
                <p className="mt-2 font-mono text-lg font-semibold">{L(lesson.rule)}</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="card p-6">
              <p className="text-sm font-semibold text-muted">{tx("Namuna — qadamma-qadam", 'Пример — шаг за шагом', 'Worked example — step by step')}</p>
              <p className="mt-2 font-mono text-2xl font-extrabold">{L(lesson.example.task)}</p>
              <div className="notebook mt-5 rounded-xl p-4 pl-14 font-hand text-2xl leading-9">
                {lesson.example.steps.slice(0, exStep + 1).map((s, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    {s}
                  </motion.p>
                ))}
              </div>
              {exStep < lesson.example.steps.length - 1 && (
                <button className="btn-secondary mt-4" onClick={() => setExStep((x) => x + 1)}>
                  {tx('Keyingi qadam', 'Следующий шаг', 'Next step')} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <p className="text-sm font-semibold text-muted">{tx("Endi oʻzingiz. Javob bermaymiz — faqat ishora!", 'Теперь сами. Ответ не даём — только подсказки!', "Your turn. No answers — only hints!")}</p>
              <p className="mt-2 font-mono text-3xl font-extrabold">{L(lesson.practice.task)}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  className={cn('input font-mono text-lg', practiceOk === false && 'border-rose-400', practiceOk && 'border-emerald-500')}
                  value={ans}
                  onChange={(e) => {
                    setAns(e.target.value);
                    setPracticeOk(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && checkPractice()}
                  placeholder={tx('Javobingiz', 'Ваш ответ', 'Your answer')}
                  aria-label={tx('Javobingiz', 'Ваш ответ', 'Your answer')}
                  disabled={!!practiceOk}
                />
                <button className="btn-primary shrink-0" onClick={checkPractice} disabled={!!practiceOk}>
                  {tx('Tekshirish', 'Проверить', 'Check')}
                </button>
              </div>
              {practiceOk && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 font-bold text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" /> {tx("Toʻgʻri! Oʻzingiz yechdingiz 💪", 'Верно! Решили сами 💪', 'Correct! You solved it yourself 💪')}
                </motion.p>
              )}
              <div className="mt-5 space-y-2">
                {lesson.practice.hints.slice(0, hints).map((h, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 rounded-xl bg-amber-500/10 p-3 text-sm">
                    <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>
                      <b>
                        {tx('Ishora', 'Подсказка', 'Hint')} {i + 1}:
                      </b>{' '}
                      {L(h)}
                    </span>
                  </motion.div>
                ))}
                {!practiceOk && hints < lesson.practice.hints.length && (
                  <button className="text-sm font-semibold text-amber-600 hover:underline" onClick={() => setHints((h) => h + 1)}>
                    💡 {tx('Ishora olish', 'Получить подсказку', 'Get a hint')} ({hints}/{lesson.practice.hints.length})
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && q && (
            <div className="card p-6">
              <p className="text-sm font-semibold text-muted">{L(q.prompt)}</p>
              <p className="mt-2 font-mono text-3xl font-extrabold">{L(q.q)}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {q.options.map((o, i) => (
                  <button
                    key={o}
                    onClick={() => pickCheck(i)}
                    className={cn(
                      'rounded-xl border-2 px-4 py-4 font-mono text-lg font-bold transition',
                      checkPick === null && 'border-line hover:border-brand hover:bg-brand-soft',
                      checkPick !== null && i === q.answer && 'border-emerald-500 bg-emerald-500/10 text-emerald-600',
                      checkPick === i && i !== q.answer && 'border-rose-500 bg-rose-500/10 text-rose-500',
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {checkPick !== null && checkPick !== q.answer && (
                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-rose-500/10 p-4">
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <span className="flex-1 text-sm">{tx("Toʻgʻri javob yashil bilan belgilandi. Yana bir savol?", 'Верный ответ отмечен зелёным. Ещё вопрос?', 'The correct answer is in green. One more?')}</span>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setQIdx((x) => x + 1);
                      setCheckPick(null);
                    }}
                  >
                    {tx('Yana urinish', 'Ещё попытка', 'Try again')}
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="card overflow-hidden p-8 text-center">
              <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }} className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-500 text-4xl shadow-lg">
                🌳
              </motion.div>
              <h2 className="mt-5 text-3xl font-extrabold">{tx('Ildiz yopildi!', 'Корень закрыт!', 'Root closed!')}</h2>
              <p className="mt-2 text-muted">
                {tx(`"${topic.title.uz}" endi yashil. +${already ? 40 : 100} ball.`, `«${topic.title.ru}» теперь зелёная. +${already ? 40 : 100} очков.`, `"${topic.title.en}" is now green. +${already ? 40 : 100} points.`)}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/app/parent" className="btn-primary">
                  <Send className="h-4 w-4" /> {tx('Ota-onaga yuborish', 'Отправить родителям', 'Send to parent')}
                </Link>
                {next && (
                  <Link to={`/app/lesson/${next.topicId}`} className="btn-secondary">
                    <Sparkles className="h-4 w-4" /> {tx('Keyingi', 'Следующий', 'Next')}: {L(TOPIC[next.topicId].title)}
                  </Link>
                )}
                <Link to="/app/map" className="btn-ghost">
                  {tx('Bilim xaritasi', 'Карта знаний', 'Knowledge map')}
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {step < 3 && (
        <div className="mt-6 flex justify-end">
          <button className="btn-primary" onClick={() => setStep((s) => s + 1)} disabled={(step === 1 && exStep < lesson.example.steps.length - 1) || (step === 2 && !practiceOk)}>
            {tx('Davom etish', 'Продолжить', 'Continue')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
      {step === 2 && !practiceOk && hints >= lesson.practice.hints.length && (
        <p className="mt-3 text-right text-xs text-muted">
          {tx("Qiyinmi? Ishoralarni oʻqib, qaytadan urinib koʻring.", 'Трудно? Прочитайте подсказки и попробуйте снова.', 'Hard? Read the hints and try again.')}{' '}
          <button className="font-semibold text-brand hover:underline" onClick={() => { setPracticeOk(true); setAns(lesson.practice.answers[0]); }}>
            {tx("Javobni koʻrsatish", 'Показать ответ', 'Show answer')}
          </button>
        </p>
      )}
    </div>
  );
}
