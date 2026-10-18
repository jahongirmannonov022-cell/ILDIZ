// Chat-style smart assistant (rule-based, works offline).
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bot, Send, Trash2 } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { reply } from '../lib/assistant';
import { Avatar, PageHeader } from '../components/ui';
import { ChatMsg } from '../lib/types';
import { cn, uid } from '../lib/utils';

export default function Assistant() {
  const { state, update } = useUser();
  const { tx, lang } = useT();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const msgs = state.chat;

  const welcome: ChatMsg = {
    id: 'welcome',
    from: 'bot',
    text: tx(
      'Salom! Men IldizAI yordamchisiman 🤖 Javobni emas — qadamlarni koʻrsataman. Misol yozing yoki savol bering.',
      'Привет! Я помощник IldizAI 🤖 Показываю не ответ, а шаги. Напишите пример или задайте вопрос.',
      "Hi! I'm the IldizAI assistant 🤖 I show steps, not answers. Send a problem or ask a question.",
    ),
  };

  const chips = [
    '1/2 + 1/3',
    '3x + 4 = 19',
    '2/3 : 4/5',
    tx('Kasrlarni tushunmayapman', 'Не понимаю дроби', "I don't get fractions"),
    tx('Vaqt mashinasi qanday ishlaydi?', 'Как работает машина времени?', 'How does the Time Machine work?'),
    tx('Bugun nima qilay?', 'Что делать сегодня?', 'What should I do today?'),
    tx('Charchadim', 'Я устал', "I'm tired"),
    tx('Ballarim qancha?', 'Сколько у меня очков?', 'How many points do I have?'),
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs.length, typing]);

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q || typing) return;
    setText('');
    const userMsg: ChatMsg = { id: uid(), from: 'user', text: q };
    update((s) => ({ ...s, chat: [...s.chat, userMsg].slice(-60), stats: { ...s.stats, chats: s.stats.chats + 1 } }));
    setTyping(true);
    const r = reply(q, state, lang);
    window.setTimeout(() => {
      update((s) => ({ ...s, chat: [...s.chat, { id: uid(), from: 'bot' as const, text: r.text, link: r.link }].slice(-60) }));
      setTyping(false);
    }, 500 + Math.min(1200, r.text.length * 6));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(text);
  };

  return (
    <div>
      <PageHeader
        icon={<Bot className="h-6 w-6" />}
        title={tx('Aqlli yordamchi', 'Умный помощник', 'Smart assistant')}
        subtitle={tx('Kasr va tenglamalarni qadamma-qadam yechadi, mavzularni tushuntiradi. Internetsiz ishlaydi.', 'Решает дроби и уравнения по шагам, объясняет темы. Работает без интернета.', 'Solves fractions and equations step by step and explains topics. Works offline.')}
        action={
          msgs.length > 0 && (
            <button className="btn-ghost" onClick={() => update((s) => ({ ...s, chat: [] }))}>
              <Trash2 className="h-4 w-4" /> {tx('Tozalash', 'Очистить', 'Clear')}
            </button>
          )
        }
      />
      <div className="card flex h-[calc(100vh-260px)] min-h-[460px] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6" aria-live="polite">
          {[welcome, ...msgs].map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-3', m.from === 'user' && 'flex-row-reverse')}>
              {m.from === 'bot' ? (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand2 text-white">
                  <Bot className="h-4 w-4" />
                </span>
              ) : (
                <Avatar name={state.profile.name} size={36} />
              )}
              <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm', m.from === 'user' ? 'rounded-tr-sm bg-brand text-white' : 'rounded-tl-sm bg-fg/5')}>
                <p className={cn('whitespace-pre-line', /^🧮/.test(m.text) && 'font-mono')}>{m.text}</p>
                {m.link && (
                  <Link to={m.link.to} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                    {m.link.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
          <AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand2 text-white">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex gap-1 rounded-2xl bg-fg/5 px-4 py-4">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-2 w-2 rounded-full bg-muted" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
        <div className="border-t border-line p-3">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {chips.map((c) => (
              <button key={c} onClick={() => send(c)} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-brand hover:text-brand">
                {c}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="flex gap-2">
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={tx('Savol yoki misol yozing…', 'Вопрос или пример…', 'Type a question or a problem…')} aria-label={tx('Xabar', 'Сообщение', 'Message')} />
            <button className="btn-primary px-4" disabled={!text.trim() || typing} aria-label={tx('Yuborish', 'Отправить', 'Send')}>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
