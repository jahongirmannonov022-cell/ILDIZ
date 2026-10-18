// 3-step onboarding that personalizes mastery, recommendations and reports.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, GraduationCap, HeartHandshake, School } from 'lucide-react';
import { Blobs, Logo, Page } from '../components/ui';
import { useT, useUser } from '../store/AppContext';
import { Role } from '../lib/types';
import { CITIES } from '../data/mock';
import { AREAS, Area } from '../data/topics';
import { estimateMastery, REASON, seedNotifications } from '../lib/seed';
import { celebrate } from '../lib/confetti';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const { state, update, addPoints } = useUser();
  const { tx, L } = useT();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>('student');
  const [grade, setGrade] = useState(7);
  const [city, setCity] = useState('Toshkent');
  const [child, setChild] = useState(state.profile.childName);
  const [goal, setGoal] = useState<'grades' | 'exam' | 'understand'>('grades');
  const [weak, setWeak] = useState<Area[]>(['frac']);
  const [parentName, setParentName] = useState('');
  const [parentCity, setParentCity] = useState('');
  const [telegram, setTelegram] = useState('');

  const roles = [
    { id: 'student' as Role, icon: GraduationCap, t: tx("Oʻquvchiman", 'Я ученик', "I'm a student"), d: tx('5–9-sinf', '5–9 класс', 'Grades 5–9') },
    { id: 'parent' as Role, icon: HeartHandshake, t: tx('Ota-onaman', 'Я родитель', "I'm a parent"), d: tx('Farzandim uchun', 'Для ребёнка', 'For my child') },
    { id: 'teacher' as Role, icon: School, t: tx("Oʻqituvchiman", 'Я учитель', "I'm a teacher"), d: tx('Sinfim uchun', 'Для класса', 'For my class') },
  ];
  const goals = [
    { id: 'grades' as const, t: tx("Baholarni koʻtarish", 'Поднять оценки', 'Raise grades') },
    { id: 'understand' as const, t: tx('Mavzuni tushunish', 'Понять тему', 'Understand topics') },
    { id: 'exam' as const, t: tx('Imtihonga tayyorlanish', 'Подготовка к экзамену', 'Prepare for exams') },
  ];

  const finish = () => {
    update((s) => ({
      ...s,
      profile: { ...s.profile, role, grade, city, childName: child || s.profile.name.split(' ')[0], goal, weak, parentName, parentCity, telegram, onboarded: true },
      mastery: estimateMastery(grade, weak, grade * 7 + weak.length),
      notifications: seedNotifications(child || s.profile.name.split(' ')[0]).slice(0, 3),
    }));
    addPoints(100, REASON.welcome, 0);
    celebrate();
    nav('/app');
  };

  const canNext = step === 0 || (step === 1 && child.trim().length > 0) || step === 2;

  return (
    <Page className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <Blobs />
      <div className="card w-full max-w-2xl p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <Logo small />
          <span className="text-sm font-semibold text-muted">{step + 1} / 3</span>
        </div>
        <div className="mt-5 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-fg/10">
              <motion.div className="h-full bg-brand" animate={{ width: i <= step ? '100%' : '0%' }} />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="mt-8 min-h-[320px]">
            {step === 0 && (
              <>
                <h1 className="text-2xl font-extrabold">{tx('Siz kimsiz?', 'Кто вы?', 'Who are you?')}</h1>
                <p className="mt-1 text-muted">{tx('Platformani siz uchun moslaymiz.', 'Настроим платформу под вас.', "We'll tailor the platform to you.")}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={cn('card card-hover relative p-5 text-left', role === r.id && 'border-brand ring-4 ring-brand/15')}
                      aria-pressed={role === r.id}
                    >
                      {role === r.id && <Check className="absolute right-3 top-3 h-5 w-5 text-brand" />}
                      <r.icon className="h-8 w-8 text-brand" />
                      <p className="mt-3 font-bold">{r.t}</p>
                      <p className="text-sm text-muted">{r.d}</p>
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <h1 className="text-2xl font-extrabold">{role === 'student' ? tx("Oʻzingiz haqingizda", 'О себе', 'About you') : tx('Farzandingiz haqida', 'О ребёнке', 'About your child')}</h1>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="child">{role === 'student' ? tx('Ismingiz', 'Ваше имя', 'Your name') : tx('Farzand ismi', 'Имя ребёнка', "Child's name")}</label>
                    <input id="child" className="input" value={child} onChange={(e) => setChild(e.target.value)} placeholder="Jasur" />
                  </div>
                  <div>
                    <span className="label">{tx('Sinf', 'Класс', 'Grade')}</span>
                    <div className="flex gap-2">
                      {[5, 6, 7, 8, 9].map((g) => (
                        <button key={g} onClick={() => setGrade(g)} className={cn('h-11 flex-1 rounded-xl border font-bold transition', grade === g ? 'border-brand bg-brand text-white shadow-glow' : 'border-line hover:border-brand/50')}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="city">{tx('Shahar', 'Город', 'City')}</label>
                    <select id="city" className="input" value={city} onChange={(e) => setCity(e.target.value)}>
                      {CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="label">{tx('Maqsad', 'Цель', 'Goal')}</span>
                    <div className="flex flex-wrap gap-2">
                      {goals.map((g) => (
                        <button key={g.id} onClick={() => setGoal(g.id)} className={cn('rounded-full border px-4 py-2 text-sm font-semibold transition', goal === g.id ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:text-fg')}>
                          {g.t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-2xl font-extrabold">{tx('Qayerda qiynalasiz?', 'Где трудно?', 'Where is it hard?')}</h1>
                <p className="mt-1 text-muted">{tx('Bilim xaritangizning birinchi versiyasini shu asosda tuzamiz.', 'По этому построим первую версию карты знаний.', "We'll draft your first knowledge map from this.")}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(Object.keys(AREAS) as Area[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setWeak((w) => (w.includes(a) ? w.filter((x) => x !== a) : [...w, a]))}
                      className={cn('rounded-full border px-4 py-2 text-sm font-semibold transition', weak.includes(a) ? 'border-rose-400 bg-rose-500/10 text-rose-500' : 'border-line text-muted hover:text-fg')}
                      aria-pressed={weak.includes(a)}
                    >
                      {L(AREAS[a])}
                    </button>
                  ))}
                </div>
                <h2 className="mt-8 font-bold">{tx('Hisobot kimga boradi? (ixtiyoriy)', 'Кому отправлять отчёт? (необязательно)', 'Who gets the report? (optional)')}</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <input className="input" aria-label={tx('Ota-ona ismi', 'Имя родителя', 'Parent name')} value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder={tx('Ota-ona ismi', 'Имя родителя', 'Parent name')} />
                  <input className="input" aria-label={tx('Qayerda', 'Где', 'Where')} value={parentCity} onChange={(e) => setParentCity(e.target.value)} placeholder={tx('Masalan: Moskva', 'Например: Москва', 'e.g. Moscow')} />
                  <input className="input" aria-label="Telegram" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@telegram" />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-between">
          <button className="btn-ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> {tx('Orqaga', 'Назад', 'Back')}
          </button>
          {step < 2 ? (
            <button className="btn-primary" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              {tx('Keyingi', 'Далее', 'Next')} <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button className="btn-primary" onClick={finish}>
              {tx('Boshlash', 'Начать', 'Start')} 🚀
            </button>
          )}
        </div>
      </div>
    </Page>
  );
}
