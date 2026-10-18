// "Buvijon rejimi": big-print question cards any adult can ask a child,
// built from the child's weakest topics. No math knowledge needed.
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, HeartHandshake, Minus, Plus, Printer, ThumbsDown, ThumbsUp, Volume2 } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { PageHeader } from '../components/ui';
import { QUESTIONS } from '../data/questions';
import { TOPIC, TOPICS } from '../data/topics';
import { REASON } from '../lib/seed';
import { cn } from '../lib/utils';

export default function Grandma() {
  const { state, update, addPoints, toast } = useUser();
  const { tx, L, lang } = useT();
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [scale, setScale] = useState(1);
  const child = state.profile.childName || state.profile.name.split(' ')[0];

  // Cards from weakest studied topics (that have questions)
  const cards = useMemo(() => {
    const topics = TOPICS.filter((t) => t.grade <= state.profile.grade && QUESTIONS[t.id]).sort((a, b) => (state.mastery[a.id] ?? 0) - (state.mastery[b.id] ?? 0));
    return topics.flatMap((t) => QUESTIONS[t.id].map((q) => ({ topicId: t.id, q }))).slice(0, 18);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.profile.grade]);
  const card = cards[i % cards.length];

  const go = (d: number) => {
    setShow(false);
    setI((x) => (x + d + cards.length) % cards.length);
  };

  const mark = (ok: boolean) => {
    update((s) => ({
      ...s,
      mastery: { ...s.mastery, [card.topicId]: Math.max(0, Math.min(100, (s.mastery[card.topicId] ?? 0) + (ok ? 3 : -2))) },
      stats: { ...s.stats, grandmaCards: s.stats.grandmaCards + 1 },
    }));
    if (ok) addPoints(10, REASON.card, 1);
    else {
      addPoints(5, REASON.card, 1);
      toast(tx('Ertaga shu mavzu boʻyicha mikro-dars tavsiya qilinadi', 'Завтра порекомендуем микро-урок по этой теме', "We'll suggest a micro-lesson on this tomorrow"), 'info');
    }
    go(1);
  };

  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(`${L(card.q.prompt)}. ${L(card.q.q)}`);
      u.lang = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      toast(tx("Brauzerda ovoz yoʻq", 'Нет синтеза речи', 'Speech not available'), 'error');
    }
  };

  const praise = [
    tx('"Barakalla! Qanday topding?" — deb soʻrang.', 'Спросите: «Молодец! Как ты догадался?»', 'Ask: "Well done! How did you figure it out?"'),
    tx('Xato qilsa: "Hechqisi yoʻq, keling birga koʻramiz".', 'Если ошибся: «Ничего, давай посмотрим вместе».', 'If wrong: "That’s okay, let’s look together."'),
    tx('Javobni oʻzingiz aytmang — 1 daqiqa kuting.', 'Не подсказывайте — подождите 1 минуту.', "Don't say the answer — wait one minute."),
  ];

  return (
    <div>
      <PageHeader
        icon={<HeartHandshake className="h-6 w-6" />}
        title={tx('Buvijon rejimi', 'Режим бабушки', 'Grandma mode')}
        subtitle={tx(
          `Matematikani bilish shart emas. Kartochkadagi savolni ${child}ga bering, javobini solishtiring va maqtang.`,
          `Знать математику не нужно. Задайте ${child} вопрос с карточки, сверьте ответ и похвалите.`,
          `No math needed. Ask ${child} the card's question, compare the answer and praise.`,
        )}
        action={
          <div className="no-print flex gap-2">
            <button className="btn-secondary h-10 w-10 px-0" onClick={() => setScale((s) => Math.max(0.8, s - 0.15))} aria-label="Smaller text">
              <Minus className="h-4 w-4" />
            </button>
            <button className="btn-secondary h-10 w-10 px-0" onClick={() => setScale((s) => Math.min(1.6, s + 0.15))} aria-label="Bigger text">
              <Plus className="h-4 w-4" />
            </button>
            <button className="btn-secondary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> {tx('Chop etish', 'Печать', 'Print')}
            </button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, rotateY: -15, x: 40 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, rotateY: 15, x: -40 }} transition={{ duration: 0.3 }} className="card p-8 sm:p-10" style={{ fontSize: `${scale}rem` }}>
              <div className="flex items-center justify-between text-[0.8em]">
                <span className="chip">{L(TOPIC[card.topicId].title)}</span>
                <span className="font-bold text-muted">
                  {(i % cards.length) + 1} / {cards.length}
                </span>
              </div>
              <p className="mt-8 text-[1.4em] font-semibold text-muted">
                {tx(`${child}dan soʻrang:`, `Спросите у ${child}:`, `Ask ${child}:`)}
              </p>
              <p className="mt-2 text-[1.5em] font-bold">{L(card.q.prompt)}</p>
              <p className="mt-4 font-mono text-[3em] font-extrabold leading-tight text-brand">{L(card.q.q)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="btn-secondary btn-lg" onClick={speak}>
                  <Volume2 className="h-5 w-5" /> {tx("Oʻqib berish", 'Прочитать вслух', 'Read aloud')}
                </button>
                {!show && (
                  <button className="btn-primary btn-lg" onClick={() => setShow(true)}>
                    <Eye className="h-5 w-5" /> {tx("Javobni koʻrish", 'Показать ответ', 'Show answer')}
                  </button>
                )}
              </div>
              <AnimatePresence>
                {show && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                    <div className="mt-6 rounded-2xl bg-emerald-500/10 p-5">
                      <p className="text-[0.9em] font-semibold text-emerald-600">{tx("Toʻgʻri javob:", 'Правильный ответ:', 'Correct answer:')}</p>
                      <p className="font-mono text-[2.2em] font-extrabold text-emerald-600">{card.q.options[card.q.answer]}</p>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button className="btn btn-lg bg-emerald-500 text-white hover:bg-emerald-600" onClick={() => mark(true)}>
                        <ThumbsUp className="h-5 w-5" /> {tx("Toʻgʻri aytdi", 'Ответил верно', 'Got it right')}
                      </button>
                      <button className="btn btn-lg bg-rose-500 text-white hover:bg-rose-600" onClick={() => mark(false)}>
                        <ThumbsDown className="h-5 w-5" /> {tx('Qiynaldi', 'Затруднился', 'Struggled')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
          <div className="no-print mt-4 flex justify-between">
            <button className="btn-ghost" onClick={() => go(-1)}>
              <ChevronLeft className="h-4 w-4" /> {tx('Oldingi', 'Назад', 'Previous')}
            </button>
            <button className="btn-ghost" onClick={() => go(1)}>
              {tx('Keyingi', 'Далее', 'Next')} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-bold">{tx('Qanday maqtash kerak', 'Как хвалить', 'How to praise')}</h2>
            <ul className="mt-3 space-y-3">
              {praise.map((p, k) => (
                <li key={k} className="flex gap-3 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">{k + 1}</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="font-bold">{tx('Bugungi kartochkalar', 'Карточки на сегодня', "Today's cards")}</h2>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {cards.map((c, k) => (
                <button
                  key={k}
                  onClick={() => {
                    setI(k);
                    setShow(false);
                  }}
                  className={cn('aspect-square rounded-lg text-xs font-bold transition', k === i % cards.length ? 'bg-brand text-white' : 'bg-fg/5 hover:bg-fg/10')}
                  aria-label={`Card ${k + 1}`}
                >
                  {k + 1}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              {tx('Jami javob berilgan:', 'Всего отвечено:', 'Answered so far:')} <b className="text-fg">{state.stats.grandmaCards}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
