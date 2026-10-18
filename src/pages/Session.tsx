// Online 1:1 lesson room with a support teacher: video tiles, shared whiteboard,
// chat with a rule-based tutor that teaches the root topic, and a rating at the end.
// No external services: the camera is the browser's own, the tutor is scripted.
import { FormEvent, PointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, CameraOff, Eraser, Hand, MessageSquare, Mic, MicOff, PenLine, PhoneOff, Presentation, Send, Trash2, Video } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { TUTOR } from '../data/tutors';
import { TOPIC } from '../data/topics';
import { LESSONS } from '../data/lessons';
import { REASON } from '../lib/seed';
import { celebrate } from '../lib/confetti';
import { Avatar, Stars } from '../components/ui';
import { Portal } from '../components/Portal';
import { T } from '../lib/motion';
import { cn, normalizeAnswer, uid } from '../lib/utils';
import NotFound from './NotFound';

interface Msg {
  id: string;
  from: 'tutor' | 'me';
  text: string;
}

export default function Session() {
  const { id = '' } = useParams();
  const { state } = useUser();
  const booking = state.bookings.find((b) => b.id === id);
  if (!booking) return <NotFound inApp />;
  if (booking.status !== 'upcoming') return <Finished />;
  return <Room key={id} bookingId={id} />;
}

function Finished() {
  const { tx } = useT();
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <Video className="mx-auto h-10 w-10 text-muted/50" />
      <h1 className="mt-3 text-xl font-extrabold">{tx('Bu dars yakunlangan', 'Этот урок завершён', 'This lesson has ended')}</h1>
      <Link to="/app/tutors?tab=my" className="btn-primary mt-5">
        {tx('Mening darslarim', 'Мои уроки', 'My lessons')}
      </Link>
    </div>
  );
}

/** Shared whiteboard: draw with pen/eraser; the tutor can write lines on it */
function Whiteboard({ tutorLines }: { tutorLines: string[] }) {
  const { tx } = useT();
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#6C47FF');
  const [eraser, setEraser] = useState(false);

  const ctx = () => canvas.current?.getContext('2d') ?? null;

  // Size the canvas to its box (sharp on retina)
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const prev = document.createElement('canvas');
      prev.width = c.width;
      prev.height = c.height;
      prev.getContext('2d')?.drawImage(c, 0, 0);
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      const g = c.getContext('2d');
      if (!g) return;
      g.drawImage(prev, 0, 0);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  // Tutor "writes" the worked example in handwriting
  useEffect(() => {
    const g = ctx();
    const c = canvas.current;
    if (!g || !c || !tutorLines.length) return;
    const w = c.getBoundingClientRect().width;
    g.save();
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = '#e11d48';
    g.font = '600 28px Caveat, cursive';
    tutorLines.forEach((line, i) => g.fillText(line, Math.min(40, w * 0.06), 96 + i * 40));
    g.restore();
  }, [tutorLines]);

  const pos = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    const g = ctx();
    if (!drawing.current || !g || !last.current) return;
    const p = pos(e);
    g.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
    g.strokeStyle = color;
    g.lineWidth = eraser ? 22 : 3;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(last.current.x, last.current.y);
    g.lineTo(p.x, p.y);
    g.stroke();
    last.current = p;
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
  };
  const clear = () => {
    const c = canvas.current;
    const g = ctx();
    if (c && g) g.clearRect(0, 0, c.width, c.height);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#fffdf6]">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgb(148 163 184 / 0.45) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <canvas
        ref={canvas}
        className="relative h-full w-full touch-none"
        style={{ cursor: eraser ? 'cell' : 'crosshair' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        aria-label={tx('Umumiy doska', 'Общая доска', 'Shared whiteboard')}
      />
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-xl bg-white/90 p-1.5 shadow-md">
        {['#6C47FF', '#e11d48', '#0f766e', '#111827'].map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              setEraser(false);
            }}
            className={cn('h-6 w-6 rounded-full ring-offset-2 transition', !eraser && color === c && 'ring-2 ring-slate-400')}
            style={{ background: c }}
            aria-label={c}
          />
        ))}
        <button onClick={() => setEraser((x) => !x)} className={cn('grid h-7 w-7 place-items-center rounded-lg text-slate-600', eraser && 'bg-slate-200')} aria-label={tx('Oʻchirgich', 'Ластик', 'Eraser')}>
          <Eraser className="h-4 w-4" />
        </button>
        <button onClick={clear} className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 hover:bg-slate-100" aria-label={tx('Tozalash', 'Очистить', 'Clear')}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Room({ bookingId }: { bookingId: string }) {
  const { state, update, addPoints, notify, toast } = useUser();
  const { tx, L, lang } = useT();
  const nav = useNavigate();
  const booking = state.bookings.find((b) => b.id === bookingId)!;
  const tutor = TUTOR[booking.tutorId];
  const topic = TOPIC[booking.topicId];
  const lesson = LESSONS[booking.topicId];
  const child = state.profile.childName || state.profile.name.split(' ')[0];

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(false);
  const [view, setView] = useState<'video' | 'board'>('video');
  const [panel, setPanel] = useState<'chat' | 'plan'>('chat');
  const [boardLines, setBoardLines] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hints, setHints] = useState(0);
  const [solved, setSolved] = useState(false);
  const [ending, setEnding] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const say = useCallback((t: string, delay = 0) => {
    timers.current.push(
      window.setTimeout(() => setTyping(true), Math.max(0, delay - 900)),
      window.setTimeout(() => {
        setTyping(false);
        setSpeaking(true);
        setMsgs((m) => [...m, { id: uid(), from: 'tutor', text: t }]);
        timers.current.push(window.setTimeout(() => setSpeaking(false), 1800));
      }, delay),
    );
  }, []);

  // The tutor's lesson script, built from the micro-lesson for this root
  useEffect(() => {
    const first = tutor.name.split(' ')[0];
    say(tx(`Assalomu alaykum, ${child}! Men ${first} ustozman 👋 Ovozim eshitilyaptimi?`, `Здравствуй, ${child}! Я ${first} 👋 Меня слышно?`, `Hi ${child}! I'm ${first} 👋 Can you hear me?`), 1200);
    say(tx(`IldizAI tahlilini koʻrdim: muammo "${topic.title.uz}" mavzusida (${topic.grade}-sinf). Bugun aynan shuni yopamiz.`, `Я видела анализ IldizAI: пробел в теме «${topic.title.ru}» (${topic.grade} класс). Сегодня закроем именно его.`, `I saw the IldizAI analysis: the gap is "${topic.title.en}" (grade ${topic.grade}). Today we close exactly that.`), 5000);
    say(`💡 ${L(lesson.idea)}`, 10000);
    say(`🫓 ${L(lesson.analogy)}`, 16000);
    say(tx('Doskaga qarang — misolni yozyapman ✍️', 'Смотри на доску — пишу пример ✍️', 'Look at the whiteboard — writing an example ✍️'), 22000);
    timers.current.push(
      window.setTimeout(() => {
        setView('board');
        setBoardLines([L(lesson.example.task), ...lesson.example.steps]);
      }, 23500),
    );
    say(tx(`Endi oʻzing: ${L(lesson.practice.task)} = ? Javobni chatga yoz.`, `Теперь сам: ${L(lesson.practice.task)} = ? Напиши ответ в чат.`, `Your turn: ${L(lesson.practice.task)} = ? Type the answer in the chat.`), 30000);
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      window.clearInterval(t);
      timers.current.forEach((x) => window.clearTimeout(x));
    };
    // run once per room
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs.length, typing]);

  // Stop the camera when leaving the room
  useEffect(() => () => stream.current?.getTracks().forEach((t) => t.stop()), []);

  const toggleCam = async () => {
    if (cam) {
      stream.current?.getTracks().forEach((t) => t.stop());
      stream.current = null;
      setCam(false);
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.current = s;
      setCam(true);
      window.setTimeout(() => {
        if (video.current) video.current.srcObject = s;
      }, 0);
    } catch {
      toast(tx('Kameraga ruxsat berilmadi — ovoz va doska bilan davom etamiz', 'Нет доступа к камере — продолжим голосом и доской', 'No camera access — continuing with voice and whiteboard'), 'info');
    }
  };

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    const q = text.trim();
    if (!q) return;
    setText('');
    setMsgs((m) => [...m, { id: uid(), from: 'me', text: q }]);
    const lower = q.toLowerCase();
    const isAnswer = /[\d±x]/.test(q) && !solved;
    if (isAnswer) {
      const ok = lesson.practice.answers.some((a) => normalizeAnswer(a) === normalizeAnswer(q));
      if (ok) {
        setSolved(true);
        say(tx(`Barakalla, ${child}! 🎉 Toʻgʻri! Oʻzing yechding — mana shu muhim.`, `Молодец, ${child}! 🎉 Верно! Ты решил сам — это главное.`, `Well done, ${child}! 🎉 Correct — and you solved it yourself.`), 1400);
        say(tx('Darsni yakunlashimiz mumkin. Pastdagi qizil tugmani bosing va darsni baholang 🙂', 'Можем заканчивать. Нажми красную кнопку и оцени урок 🙂', 'We can wrap up. Press the red button and rate the lesson 🙂'), 4200);
      } else {
        const h = lesson.practice.hints[Math.min(hints, lesson.practice.hints.length - 1)];
        setHints((x) => x + 1);
        say(tx(`Yaqin! Ishora: ${h.uz}`, `Почти! Подсказка: ${h.ru}`, `Close! Hint: ${h.en}`), 1400);
      }
      return;
    }
    if (/tushunma|понима|understand|qiyin|сложно|hard/.test(lower)) say(tx(`Hechqisi yoʻq. Boshqacha aytaman: ${lesson.rule.uz}`, `Ничего страшного. Скажу иначе: ${lesson.rule.ru}`, `No problem. Let me put it differently: ${lesson.rule.en}`), 1300);
    else if (/rahmat|спасибо|thank/.test(lower)) say(tx('Arzimaydi! Sen zoʻrsan 💪', 'Пожалуйста! Ты молодец 💪', "You're welcome! You're doing great 💪"), 1100);
    else if (/eshit|слыш|hear|ha\b|да\b|yes/.test(lower)) say(tx('Ajoyib, unda boshlaymiz!', 'Отлично, тогда начнём!', 'Great, let’s begin!'), 1100);
    else say(tx('Yaxshi savol! Keling, doskada koʻrib chiqamiz.', 'Хороший вопрос! Давай разберём на доске.', 'Good question! Let’s look at it on the board.'), 1300);
  };

  const raiseHand = () => {
    toast(tx('Qoʻl koʻtarildi ✋', 'Рука поднята ✋', 'Hand raised ✋'), 'info');
    say(tx(`Ha, ${child}, savolingni bemalol yoz yoki ayt 🙂`, `Да, ${child}, спрашивай 🙂`, `Yes ${child}, go ahead and ask 🙂`), 1200);
  };

  const finish = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    update((s) => ({
      ...s,
      bookings: s.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'done', rating, review: review.trim() || undefined } : b)),
      stats: { ...s.stats, sessions: (s.stats.sessions ?? 0) + 1 },
      mastery: { ...s.mastery, [booking.topicId]: Math.min(95, (s.mastery[booking.topicId] ?? 0) + (solved ? 20 : 10)) },
      history: s.history.map((h) => (h.rootId === booking.topicId && solved ? { ...h, closed: true } : h)),
    }));
    addPoints(solved ? 80 : 50, REASON.session, Math.max(1, Math.round(elapsed / 60)));
    notify({
      kind: 'success',
      link: '/app/tutors?tab=my',
      title: tx('Dars yakunlandi ✅', 'Урок завершён ✅', 'Lesson finished ✅'),
      body: { uz: `${tutor.name} · ${topic.title.uz}`, ru: `${tutor.name} · ${topic.title.ru}`, en: `${tutor.name} · ${topic.title.en}` },
    });
    celebrate();
    nav('/app/tutors?tab=my');
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" /> {tx('JONLI', 'В ЭФИРЕ', 'LIVE')}
        </span>
        <h1 className="text-lg font-extrabold sm:text-xl">
          {tutor.name} · <span className="text-brand">{L(topic.title)}</span>
        </h1>
        <span className="ml-auto rounded-full bg-fg/5 px-3 py-1 font-mono text-sm font-bold tabular-nums">
          {mm}:{ss} / {booking.minutes}:00
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Stage */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-900 sm:aspect-video">
            {/* The board stays mounted (only hidden) so drawings survive switching views */}
            <motion.div animate={{ opacity: view === 'board' ? 1 : 0 }} transition={T.base} className={cn('absolute inset-2', view === 'board' ? 'visible z-10' : 'invisible')}>
              <Whiteboard tutorLines={boardLines} />
            </motion.div>
            <AnimatePresence>
              {view === 'video' && (
                <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-800 via-slate-900 to-brand/40">
                  <div className="relative">
                    {[0, 1].map((i) => (
                      <motion.span
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-emerald-400"
                        animate={speaking ? { scale: [1, 1.5], opacity: [0.7, 0] } : { scale: 1, opacity: 0 }}
                        transition={{ duration: 1.2, repeat: speaking ? Infinity : 0, delay: i * 0.6 }}
                      />
                    ))}
                    <Avatar name={tutor.name} size={120} className="ring-4 ring-white/10" />
                  </div>
                  <p className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-2.5 py-1 text-sm font-semibold text-white">{tutor.name}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Self tile */}
            <div className="absolute bottom-3 right-3 h-24 w-32 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-800 shadow-xl sm:h-28 sm:w-40">
              {cam ? <video ref={video} autoPlay playsInline muted className="h-full w-full scale-x-[-1] object-cover" /> : <div className="grid h-full w-full place-items-center"><Avatar name={state.profile.name} size={44} /></div>}
              {!mic && (
                <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white">
                  <MicOff className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button className={cn('btn h-12 w-12 rounded-full p-0', mic ? 'bg-fg/10 text-fg' : 'bg-rose-500 text-white')} onClick={() => setMic((m) => !m)} aria-label={mic ? tx('Mikrofonni oʻchirish', 'Выключить микрофон', 'Mute') : tx('Mikrofonni yoqish', 'Включить микрофон', 'Unmute')}>
              {mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button className={cn('btn h-12 w-12 rounded-full p-0', cam ? 'bg-brand text-white' : 'bg-fg/10 text-fg')} onClick={toggleCam} aria-label={tx('Kamera', 'Камера', 'Camera')}>
              {cam ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
            </button>
            <button className={cn('btn h-12 rounded-full px-4', view === 'board' ? 'bg-brand text-white' : 'bg-fg/10 text-fg')} onClick={() => setView((v) => (v === 'board' ? 'video' : 'board'))}>
              {view === 'board' ? <Video className="h-5 w-5" /> : <PenLine className="h-5 w-5" />}
              <span className="hidden sm:inline">{view === 'board' ? tx('Video', 'Видео', 'Video') : tx('Doska', 'Доска', 'Whiteboard')}</span>
            </button>
            <button className="btn h-12 w-12 rounded-full bg-fg/10 p-0 text-fg" onClick={raiseHand} aria-label={tx('Qoʻl koʻtarish', 'Поднять руку', 'Raise hand')}>
              <Hand className="h-5 w-5" />
            </button>
            <button className="btn h-12 rounded-full bg-rose-500 px-5 text-white hover:bg-rose-600" onClick={() => setEnding(true)}>
              <PhoneOff className="h-5 w-5" /> {tx('Yakunlash', 'Завершить', 'End')}
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div className="card flex h-[460px] flex-col overflow-hidden lg:h-auto">
          <div className="flex border-b border-line">
            {(['chat', 'plan'] as const).map((p) => (
              <button key={p} onClick={() => setPanel(p)} className={cn('flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors', panel === p ? 'border-b-2 border-brand text-brand' : 'text-muted')}>
                {p === 'chat' ? <MessageSquare className="h-4 w-4" /> : <Presentation className="h-4 w-4" />}
                {p === 'chat' ? tx('Chat', 'Чат', 'Chat') : tx('Dars rejasi', 'План урока', 'Lesson plan')}
              </button>
            ))}
          </div>
          {panel === 'chat' ? (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
                {msgs.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={T.fast} className={cn('flex', m.from === 'me' && 'justify-end')}>
                    <p className={cn('max-w-[85%] rounded-2xl px-3.5 py-2 text-sm', m.from === 'me' ? 'rounded-br-sm bg-brand text-white' : 'rounded-bl-sm bg-fg/5')}>{m.text}</p>
                  </motion.div>
                ))}
                {typing && (
                  <div className="flex w-fit gap-1 rounded-2xl bg-fg/5 px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="h-2 w-2 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>
              <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
                <input className="input py-2.5" value={text} onChange={(e) => setText(e.target.value)} placeholder={tx('Javob yoki savol…', 'Ответ или вопрос…', 'Answer or question…')} aria-label={tx('Xabar', 'Сообщение', 'Message')} />
                <button className="btn-primary px-3.5" disabled={!text.trim()} aria-label={tx('Yuborish', 'Отправить', 'Send')}>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
              <div>
                <p className="eyebrow">{tx('Ildiz', 'Корень', 'Root')}</p>
                <p className="mt-1 font-bold">
                  {topic.grade}-{tx('sinf', 'класс', 'grade')} · {L(topic.title)}
                </p>
              </div>
              <div>
                <p className="eyebrow">{tx('Gʻoya', 'Идея', 'Idea')}</p>
                <p className="mt-1">{L(lesson.idea)}</p>
              </div>
              <div>
                <p className="eyebrow">{tx('Qoida', 'Правило', 'Rule')}</p>
                <p className="mt-1 font-mono">{L(lesson.rule)}</p>
              </div>
              <div>
                <p className="eyebrow">{tx('Mashq', 'Практика', 'Practice')}</p>
                <p className="mt-1 font-mono text-lg font-bold">{L(lesson.practice.task)}</p>
                <p className={cn('mt-1 text-xs font-semibold', solved ? 'text-emerald-500' : 'text-muted')}>{solved ? tx('✓ Yechildi', '✓ Решено', '✓ Solved') : tx('Javobni chatga yozing', 'Ответ — в чат', 'Answer in the chat')}</p>
              </div>
              {booking.note && (
                <div>
                  <p className="eyebrow">{tx('Izoh', 'Комментарий', 'Note')}</p>
                  <p className="mt-1 italic">“{booking.note}”</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating at the end */}
      <Portal>
      <AnimatePresence>
        {ending && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEnding(false)}>
            <motion.div role="dialog" aria-modal="true" className="card w-full max-w-sm p-6 text-center" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} transition={T.spring} onClick={(e) => e.stopPropagation()}>
              <Avatar name={tutor.name} size={64} className="mx-auto" />
              <h2 className="mt-3 text-xl font-extrabold">{tx('Dars qanday oʻtdi?', 'Как прошёл урок?', 'How was the lesson?')}</h2>
              <p className="text-sm text-muted">{tutor.name}</p>
              <div className="mt-4 flex justify-center">
                <Stars value={rating} onChange={setRating} size={32} />
              </div>
              <textarea className="input mt-4 min-h-[80px]" value={review} onChange={(e) => setReview(e.target.value)} placeholder={tx('Fikringiz (ixtiyoriy)', 'Ваш отзыв (необязательно)', 'Your feedback (optional)')} aria-label={tx('Fikr', 'Отзыв', 'Feedback')} />
              <p className="mt-2 text-xs text-muted">{tx('Ota-onaga dars xulosasi avtomatik yuboriladi', 'Итог урока автоматически уйдёт родителям', 'A lesson summary is sent to parents automatically')}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="btn-secondary" onClick={() => setEnding(false)}>
                  {tx('Davom etish', 'Продолжить', 'Keep going')}
                </button>
                <button className="btn bg-rose-500 text-white hover:bg-rose-600" onClick={finish}>
                  <PhoneOff className="h-4 w-4" /> {tx('Yakunlash', 'Завершить', 'End')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </div>
  );
}
