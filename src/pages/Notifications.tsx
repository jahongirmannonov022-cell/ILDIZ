// In-app notifications + reminder scheduler.
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlarmClock, Award, Bell, BellRing, CheckCheck, CheckCircle2, Info, Plus, Trash2, TriangleAlert, Zap } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { PageHeader, Tabs } from '../components/ui';
import { Notif } from '../lib/types';
import { cn, reminderLabel, uid, fmtDay } from '../lib/utils';

const ICON: Record<Notif['kind'], { i: typeof Bell; c: string }> = {
  success: { i: CheckCircle2, c: 'bg-emerald-500/15 text-emerald-500' },
  info: { i: Info, c: 'bg-sky-500/15 text-sky-500' },
  warning: { i: TriangleAlert, c: 'bg-amber-500/15 text-amber-500' },
  badge: { i: Award, c: 'bg-brand-soft text-brand' },
  reminder: { i: AlarmClock, c: 'bg-brand2/15 text-brand2' },
};

export default function Notifications() {
  const { state, update, toast, notify } = useUser();
  const { tx, L, lang } = useT();
  const nav = useNavigate();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [time, setTime] = useState('19:00');
  const [label, setLabel] = useState('');
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const dayNames = lang === 'ru' ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] : lang === 'en' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
  const list = state.notifications.filter((n) => tab === 'all' || !n.read);
  const unread = state.notifications.filter((n) => !n.read).length;

  const addReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!days.length) return toast(tx('Kamida bitta kun tanlang', 'Выберите хотя бы один день', 'Pick at least one day'), 'error');
    update((s) => ({ ...s, reminders: [...s.reminders, { id: uid(), time, days: [...days].sort(), label: label.trim() || tx('5 daqiqalik mashq', '5 минут практики', '5-minute practice'), enabled: true }] }));
    setLabel('');
    toast(tx('Eslatma qoʻshildi', 'Напоминание добавлено', 'Reminder added'));
  };

  const testNow = (text: string) => {
    notify({ kind: 'reminder', link: '/app/scan', title: tx('⏰ Eslatma', '⏰ Напоминание', '⏰ Reminder'), body: text });
    toast(`⏰ ${text}`, 'info');
    try {
      if ('Notification' in window && Notification.permission === 'granted') new Notification('IldizAI', { body: text, icon: '/favicon.svg' });
    } catch {
      /* ignore */
    }
  };

  const askPermission = async () => {
    try {
      if (!('Notification' in window)) return toast(tx('Brauzer qoʻllab-quvvatlamaydi', 'Браузер не поддерживает', 'Not supported by this browser'), 'error');
      const p = await Notification.requestPermission();
      toast(p === 'granted' ? tx('Brauzer bildirishnomalari yoqildi', 'Уведомления браузера включены', 'Browser notifications on') : tx('Ruxsat berilmadi', 'Разрешение не дано', 'Permission denied'), p === 'granted' ? 'success' : 'error');
    } catch {
      toast(tx('Xatolik', 'Ошибка', 'Error'), 'error');
    }
  };

  return (
    <div>
      <PageHeader
        icon={<Bell className="h-6 w-6" />}
        title={tx('Bildirishnomalar', 'Уведомления', 'Notifications')}
        subtitle={tx(`${unread} ta oʻqilmagan`, `${unread} непрочитанных`, `${unread} unread`)}
        action={
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }))}>
              <CheckCheck className="h-4 w-4" /> {tx("Hammasi oʻqildi", 'Прочитать все', 'Mark all read')}
            </button>
            <button className="btn-ghost" onClick={() => update((s) => ({ ...s, notifications: [] }))} aria-label={tx('Tozalash', 'Очистить', 'Clear')}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        }
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Tabs<'all' | 'unread'>
            value={tab}
            onChange={setTab}
            items={[
              { id: 'all', label: tx('Hammasi', 'Все', 'All') },
              { id: 'unread', label: `${tx("Oʻqilmagan", 'Непрочитанные', 'Unread')} (${unread})` },
            ]}
          />
          <div className="mt-4 space-y-2">
            <AnimatePresence initial={false}>
              {list.map((n) => {
                const ic = ICON[n.kind];
                return (
                  <motion.div key={n.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }} className={cn('card flex gap-4 p-4', !n.read && 'border-brand/40')}>
                    <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', ic.c)}>
                      <ic.i className="h-5 w-5" />
                    </span>
                    <button
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        update((s) => ({ ...s, notifications: s.notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)) }));
                        if (n.link) nav(n.link);
                      }}
                    >
                      <p className="font-semibold">{L(n.title)}</p>
                      <p className="text-sm text-muted">{L(n.body)}</p>
                      <p className="mt-1 text-xs text-muted">{fmtDay(n.date, lang, true)}</p>
                    </button>
                    <div className="flex flex-col items-end gap-2">
                      {!n.read && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                      <button className="text-muted hover:text-rose-500" onClick={() => update((s) => ({ ...s, notifications: s.notifications.filter((x) => x.id !== n.id) }))} aria-label={tx("Oʻchirish", 'Удалить', 'Delete')}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {!list.length && (
              <div className="card p-10 text-center text-muted">
                <BellRing className="mx-auto h-10 w-10 opacity-40" />
                <p className="mt-3">{tx("Yangi bildirishnoma yoʻq", 'Новых уведомлений нет', 'No new notifications')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <form onSubmit={addReminder} className="card space-y-4 p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <AlarmClock className="h-5 w-5 text-brand" /> {tx('Yangi eslatma', 'Новое напоминание', 'New reminder')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="rtime">{tx('Vaqt', 'Время', 'Time')}</label>
                <input id="rtime" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="rlabel">{tx('Matn', 'Текст', 'Label')}</label>
                <input id="rlabel" className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder={tx('5 daqiqa mashq', '5 минут', '5 min practice')} />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dayNames.map((d, i) => (
                <button type="button" key={d} onClick={() => setDays((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]))} className={cn('h-9 w-10 rounded-lg text-xs font-bold transition', days.includes(i) ? 'bg-brand text-white' : 'bg-fg/5 text-muted')} aria-pressed={days.includes(i)}>
                  {d}
                </button>
              ))}
            </div>
            <button className="btn-primary w-full">
              <Plus className="h-4 w-4" /> {tx("Qoʻshish", 'Добавить', 'Add')}
            </button>
          </form>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{tx('Eslatmalarim', 'Мои напоминания', 'My reminders')}</h2>
              <button className="text-xs font-semibold text-brand hover:underline" onClick={askPermission}>
                {tx('Brauzerda ham', 'Также в браузере', 'Also in browser')}
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {state.reminders.map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                  <div className="flex-1">
                    <p className="font-mono text-lg font-bold">{r.time}</p>
                    <p className="text-xs text-muted">
                      {reminderLabel(r.label, tx)} · {r.days.map((d) => dayNames[d]).join(', ')}
                    </p>
                  </div>
                  <button className="btn-ghost h-8 px-2 text-xs" onClick={() => testNow(reminderLabel(r.label, tx))} title={tx('Hozir sinash', 'Проверить сейчас', 'Test now')}>
                    <Zap className="h-4 w-4" />
                  </button>
                  <button
                    role="switch"
                    aria-checked={r.enabled}
                    onClick={() => update((s) => ({ ...s, reminders: s.reminders.map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)) }))}
                    className={cn('relative h-6 w-11 shrink-0 rounded-full transition', r.enabled ? 'bg-brand' : 'bg-fg/20')}
                    aria-label={reminderLabel(r.label, tx)}
                  >
                    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', r.enabled ? 'left-[22px]' : 'left-0.5')} />
                  </button>
                  <button className="text-muted hover:text-rose-500" onClick={() => update((s) => ({ ...s, reminders: s.reminders.filter((x) => x.id !== r.id) }))} aria-label={tx("Oʻchirish", 'Удалить', 'Delete')}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {!state.reminders.length && <p className="text-sm text-muted">{tx("Eslatmalar yoʻq", 'Напоминаний нет', 'No reminders')}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
