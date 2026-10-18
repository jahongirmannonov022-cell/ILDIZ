// Parent report: weekly stats, auto-written report text, voice playback
// (browser speech synthesis — no API keys) and a Telegram-style preview.
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { chartTip } from '../lib/motion';
import { CheckCheck, Pause, Play, Save, Send, Volume2 } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { PageHeader, Stat } from '../components/ui';
import { TOPIC } from '../data/topics';
import { recommendations } from '../lib/recommend';
import { streakOf } from '../lib/game';
import { REASON } from '../lib/seed';
import { Lang, UserState } from '../lib/types';
import { cn, dateKey, daysAgo, uid } from '../lib/utils';

function buildReport(s: UserState, lang: Lang) {
  const child = s.profile.childName || s.profile.name.split(' ')[0];
  const parent = s.profile.parentName ? s.profile.parentName.split(' ')[0] : '';
  const week = Array.from({ length: 7 }, (_, i) => s.minutes[dateKey(daysAgo(i))] ?? 0).reduce((a, b) => a + b, 0);
  const since = daysAgo(7).getTime();
  const found = s.history.filter((h) => new Date(h.date).getTime() >= since);
  const closed = found.filter((h) => h.closed);
  const lastRoot = found[0] ? TOPIC[found[0].rootId] : s.history[0] ? TOPIC[s.history[0].rootId] : null;
  const next = recommendations(s, 1)[0];
  const streak = streakOf(s.activeDays);
  const tn = (id: string) => TOPIC[id].title[lang];
  if (lang === 'ru')
    return `Здравствуйте${parent ? ', ' + parent : ''}! На этой неделе ${child} занимался ${week} минут. Найдено корней: ${found.length}, закрыто: ${closed.length}.${lastRoot ? ` Главная находка — тема «${lastRoot.title.ru}» из ${lastRoot.grade} класса.` : ''}${next ? ` Следующий шаг: «${tn(next.topicId)}».` : ''} Серия — ${streak} дней. Похвалите ${child} сегодня!`;
  if (lang === 'en')
    return `Hello${parent ? ' ' + parent : ''}! This week ${child} studied for ${week} minutes. Roots found: ${found.length}, closed: ${closed.length}.${lastRoot ? ` Key finding: "${lastRoot.title.en}" from grade ${lastRoot.grade}.` : ''}${next ? ` Next step: "${tn(next.topicId)}".` : ''} Streak: ${streak} days. Please praise ${child} today!`;
  return `Assalomu alaykum${parent ? ', ' + parent + ' aka' : ''}! ${child} bu hafta ${week} daqiqa shugʻullandi. Topilgan ildizlar: ${found.length} ta, yopilgani: ${closed.length} ta.${lastRoot ? ` Asosiy topilma — ${lastRoot.grade}-sinfdagi "${lastRoot.title.uz}" mavzusi.` : ''}${next ? ` Keyingi qadam: "${tn(next.topicId)}".` : ''} Seriya — ${streak} kun. Bugun ${child}ni maqtab qoʻying!`;
}

interface Bubble { id: string; time: string; text: string; voice: boolean }

export default function ParentReport() {
  const { state, update, addPoints, notify, toast } = useUser();
  const { tx, lang } = useT();
  const p = state.profile;
  const report = useMemo(() => buildReport(state, lang), [state, lang]);
  const [playing, setPlaying] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Bubble[]>([]);
  const [form, setForm] = useState({ parentName: p.parentName, parentCity: p.parentCity, telegram: p.telegram });
  const timer = useRef<number>();
  const weekly = state.reminders.find((r) => r.label === 'Haftalik hisobot');

  const dayNames = lang === 'ru' ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] : lang === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
  const chart = Array.from({ length: 7 }, (_, i) => {
    const d = daysAgo(6 - i);
    return { d: dayNames[d.getDay()], m: state.minutes[dateKey(d)] ?? 0 };
  });
  const week = chart.reduce((a, b) => a + b.m, 0);
  const since = daysAgo(7).getTime();
  const foundWeek = state.history.filter((h) => new Date(h.date).getTime() >= since);
  const durationSec = Math.max(12, Math.round(report.split(' ').length / 2.4));

  const stop = () => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    window.clearTimeout(timer.current);
    setPlaying(false);
  };
  useEffect(() => stop, []);

  const play = () => {
    if (playing) return stop();
    setPlaying(true);
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    if (synth && typeof SpeechSynthesisUtterance !== 'undefined') {
      try {
        const u = new SpeechSynthesisUtterance(report);
        const code = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'uz';
        u.lang = code === 'uz' ? 'uz-UZ' : code === 'ru' ? 'ru-RU' : 'en-US';
        const voices = synth.getVoices();
        const v = voices.find((x) => x.lang.toLowerCase().startsWith(code)) ?? (code === 'uz' ? voices.find((x) => x.lang.toLowerCase().startsWith('tr')) : undefined);
        if (v) u.voice = v;
        u.rate = 0.95;
        u.onend = () => setPlaying(false);
        u.onerror = () => setPlaying(false);
        synth.cancel();
        synth.speak(u);
        timer.current = window.setTimeout(() => setPlaying(false), durationSec * 1000 + 4000);
        return;
      } catch {
        /* fall through to simulated playback */
      }
    }
    toast(tx("Brauzerda ovoz yoʻq — matn koʻrsatildi", 'В браузере нет синтеза речи — показан текст', 'No speech in this browser — showing text'), 'info');
    timer.current = window.setTimeout(() => setPlaying(false), 4000);
  };

  const send = () => {
    setSending(true);
    window.setTimeout(() => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setSent((s) => [...s, { id: uid(), time, text: '', voice: true }, { id: uid(), time, text: report, voice: false }]);
      setSending(false);
      update((s) => ({ ...s, stats: { ...s.stats, reports: s.stats.reports + 1 } }));
      addPoints(30, REASON.report, 1);
      notify({ kind: 'success', link: '/app/parent', title: tx('Hisobot yuborildi ✓✓', 'Отчёт отправлен ✓✓', 'Report sent ✓✓'), body: `${form.parentName || tx('Ota-ona', 'Родитель', 'Parent')} · ${form.telegram || 'Telegram'}` });
    }, 1300);
  };

  const saveContact = () => {
    update((s) => ({ ...s, profile: { ...s.profile, ...form } }));
    toast(tx('Saqlandi', 'Сохранено', 'Saved'));
  };

  const toggleWeekly = () => {
    update((s) => {
      const exists = s.reminders.find((r) => r.label === 'Haftalik hisobot');
      if (exists) return { ...s, reminders: s.reminders.map((r) => (r.id === exists.id ? { ...r, enabled: !r.enabled } : r)) };
      return { ...s, reminders: [...s.reminders, { id: uid(), time: '20:00', days: [0], label: 'Haftalik hisobot', enabled: true }] };
    });
    toast(weekly?.enabled ? tx("Avto-hisobot oʻchirildi", 'Автоотчёт выключен', 'Auto report off') : tx('Har yakshanba 20:00 da yuboriladi', 'Будет отправляться по воскресеньям в 20:00', 'Will send every Sunday at 20:00'), 'info');
  };

  const Wave = ({ active }: { active: boolean }) => (
    <div className="flex h-8 items-center gap-[3px]">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-current"
          animate={active ? { height: [6, 8 + ((i * 7) % 20), 6] } : { height: 6 + ((i * 11) % 18) }}
          transition={active ? { duration: 0.6 + (i % 5) * 0.1, repeat: Infinity } : { duration: 0.2 }}
        />
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader
        icon={<Send className="h-6 w-6" />}
        title={tx('Ota-ona hisoboti', 'Отчёт для родителей', 'Parent report')}
        subtitle={tx(
          "Haftalik natija oʻzbekcha ovozli xabar sifatida — hatto chet elda ishlayotgan ota-ona ham tinglay oladi.",
          'Итоги недели — голосовым сообщением. Даже родитель, работающий за рубежом, может послушать.',
          'The week in a voice message — even a parent working abroad can listen.',
        )}
      />
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Stat icon={<Volume2 className="h-4 w-4" />} label={tx('Bu hafta', 'За неделю', 'This week')} value={`${week} ${tx('daq', 'мин', 'min')}`} />
        <Stat icon={<Send className="h-4 w-4" />} tone="bg-amber-500/10 text-amber-500" label={tx('Topilgan ildizlar', 'Найдено корней', 'Roots found')} value={foundWeek.length} />
        <Stat icon={<CheckCheck className="h-4 w-4" />} tone="bg-emerald-500/10 text-emerald-500" label={tx('Yopilgan', 'Закрыто', 'Closed')} value={foundWeek.filter((h) => h.closed).length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="card p-6">
            <h2 className="font-bold">{tx('Kunlik faollik (daqiqa)', 'Активность по дням (мин)', 'Daily activity (min)')}</h2>
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} margin={{ left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
                  <XAxis dataKey="d" tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgb(var(--brand) / 0.08)' }} {...chartTip} />
                  <Bar dataKey="m" name={tx('daqiqa', 'минут', 'minutes')} fill="rgb(var(--brand))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">{tx('Avtomatik yozilgan hisobot', 'Автоматический отчёт', 'Auto-written report')}</h2>
              <button className="btn-secondary" onClick={play}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? tx("Toʻxtatish", 'Стоп', 'Stop') : tx('Tinglash', 'Слушать', 'Listen')}
              </button>
            </div>
            <p className="mt-4 rounded-xl bg-fg/5 p-4 leading-relaxed">{report}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <input className="input" aria-label={tx('Ota-ona ismi', 'Имя родителя', 'Parent name')} placeholder={tx('Ota-ona ismi', 'Имя родителя', 'Parent name')} value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
              <input className="input" aria-label={tx('Shahar', 'Город', 'City')} placeholder={tx('Moskva', 'Москва', 'Moscow')} value={form.parentCity} onChange={(e) => setForm({ ...form, parentCity: e.target.value })} />
              <input className="input" aria-label="Telegram" placeholder="@telegram" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button className="btn-ghost" onClick={saveContact}>
                <Save className="h-4 w-4" /> {tx('Kontaktni saqlash', 'Сохранить контакт', 'Save contact')}
              </button>
              <label className="ml-auto flex cursor-pointer items-center gap-3 text-sm font-semibold">
                {tx('Har yakshanba 20:00 avto-yuborish', 'Автоотправка по вс 20:00', 'Auto-send Sundays 20:00')}
                <button
                  role="switch"
                  aria-checked={!!weekly?.enabled}
                  onClick={toggleWeekly}
                  className={cn('relative h-6 w-11 rounded-full transition', weekly?.enabled ? 'bg-brand' : 'bg-fg/20')}
                >
                  <motion.span layout className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow', weekly?.enabled ? 'right-0.5' : 'left-0.5')} />
                </button>
              </label>
            </div>
          </div>
        </div>

        {/* Telegram phone mock */}
        <div className="lg:col-span-2">
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2.5rem] border-[10px] border-slate-900 bg-[#0e1621] shadow-2xl">
            <div className="flex items-center gap-3 bg-[#17212b] px-4 py-3 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand2 text-sm font-extrabold">AI</span>
              <div>
                <p className="text-sm font-bold">IldizAI bot</p>
                <p className="text-xs text-sky-400">{form.parentName ? `→ ${form.parentName}${form.parentCity ? ', ' + form.parentCity : ''}` : 'bot'}</p>
              </div>
            </div>
            <div className="flex min-h-[240px] sm:min-h-[420px] flex-col justify-end gap-2 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><circle cx=%222%22 cy=%222%22 r=%221%22 fill=%22%23ffffff10%22/></svg>')] p-3">
              <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-[#182533] px-3 py-2 text-sm text-white">
                {tx('Salom! Har hafta farzandingiz natijalarini shu yerga yuboraman 👋', 'Привет! Каждую неделю буду присылать сюда результаты ребёнка 👋', "Hi! I'll send your child's results here every week 👋")}
              </div>
              <AnimatePresence>
                {sent.map((b) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-[#182533] px-3 py-2 text-sm text-white">
                    {b.voice ? (
                      <button onClick={play} className="flex items-center gap-3 text-sky-400" aria-label="Play voice">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-500 text-white">{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</span>
                        <Wave active={playing} />
                        <span className="text-xs text-white/60">0:{String(durationSec).padStart(2, '0')}</span>
                      </button>
                    ) : (
                      <p className="whitespace-pre-line">{b.text}</p>
                    )}
                    <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/50">
                      {b.time} <CheckCheck className="h-3 w-3 text-sky-400" />
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {sending && (
                <div className="flex gap-1 self-start rounded-2xl bg-[#182533] px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-2 w-2 rounded-full bg-white/60" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
            </div>
            <div className="bg-[#17212b] p-3">
              <button className="btn w-full bg-sky-500 text-white hover:bg-sky-400" onClick={send} disabled={sending}>
                <Send className="h-4 w-4" /> {sending ? tx('Yuborilmoqda…', 'Отправка…', 'Sending…') : tx('Telegramga yuborish', 'Отправить в Telegram', 'Send to Telegram')}
              </button>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted">{tx('Demo: haqiqiy Telegram API ishlatilmaydi', 'Демо: реальный Telegram API не используется', 'Demo: no real Telegram API is used')}</p>
        </div>
      </div>
    </div>
  );
}
