import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, HeartHandshake, Lock, Mail, User } from 'lucide-react';
import { Blobs, Logo, Page } from '../components/ui';
import { LangSwitch, ThemeToggle } from '../components/Controls';
import { useApp, useT } from '../store/AppContext';

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const { tx } = useT();
  const { login, signup, loginDemo, toast } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const isLogin = mode === 'login';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!isLogin && name.trim().length < 2) return setErr(tx('Ismingizni kiriting', 'Введите имя', 'Enter your name'));
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr(tx("Email notoʻgʻri", 'Неверный email', 'Invalid email'));
    if (pass.length < 4) return setErr(tx("Parol kamida 4 belgi boʻlsin", 'Пароль — минимум 4 символа', 'Password must be at least 4 characters'));
    setBusy(true);
    window.setTimeout(() => {
      const res = isLogin ? login(email, pass) : signup(name, email, pass);
      setBusy(false);
      if (res === 'exists') return setErr(tx("Bu email roʻyxatdan oʻtgan", 'Этот email уже зарегистрирован', 'This email is already registered'));
      if (res === 'invalid') return setErr(tx("Email yoki parol notoʻgʻri", 'Неверный email или пароль', 'Wrong email or password'));
      toast(isLogin ? tx('Xush kelibsiz!', 'С возвращением!', 'Welcome back!') : tx('Hisob yaratildi!', 'Аккаунт создан!', 'Account created!'));
      nav(isLogin ? '/app' : '/onboarding');
    }, 500);
  };

  const demo = (role: 'student' | 'parent') => {
    loginDemo(role);
    toast(
      role === 'parent'
        ? tx('Ota-ona platformasi: Rustam aka, oʻgʻli Jasur', 'Платформа родителя: Рустам, сын Жасур', 'Parent platform: Rustam, son Jasur')
        : tx('Oʻquvchi platformasi: Jasur, 7-sinf, Qarshi', 'Платформа ученика: Жасур, 7 класс, Карши', 'Student platform: Jasur, grade 7, Qarshi'),
      'info',
    );
    nav('/app');
  };

  return (
    <Page className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <Blobs />
      <div className="absolute right-4 top-4 flex gap-1">
        <LangSwitch />
        <ThemeToggle />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-8">
        <Link to="/" aria-label="IldizAI">
          <Logo />
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold">{isLogin ? tx('Qaytganingizdan xursandmiz', 'Рады вас видеть', 'Welcome back') : tx('Hisob yarating', 'Создайте аккаунт', 'Create your account')}</h1>
        <p className="mt-1 text-sm text-muted">{isLogin ? tx('Davom etish uchun kiring', 'Войдите, чтобы продолжить', 'Log in to continue') : tx('2 daqiqa — va birinchi ildizni topamiz', '2 минуты — и найдём первый корень', '2 minutes — and we find your first root')}</p>

        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {!isLogin && (
            <div>
              <label className="label" htmlFor="name">{tx('Ism familiya', 'Имя и фамилия', 'Full name')}</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                <input id="name" className="input pl-10" value={name} onChange={(e) => setName(e.target.value)} placeholder="Madina Rahimova" autoComplete="name" />
              </div>
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
              <input id="email" type="email" className="input pl-10" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="madina@mail.uz" autoComplete="email" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="pass">{tx('Parol', 'Пароль', 'Password')}</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
              <input id="pass" type={show ? 'text' : 'password'} className="input px-10" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••" autoComplete={isLogin ? 'current-password' : 'new-password'} />
              <button type="button" className="absolute right-3 top-3 text-muted hover:text-fg" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {err && (
            <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: [0, -6, 6, 0] }} className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-500" role="alert">
              {err}
            </motion.p>
          )}
          <button className="btn-primary w-full py-3" disabled={busy}>
            {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : isLogin ? tx('Kirish', 'Войти', 'Log in') : tx("Roʻyxatdan oʻtish", 'Зарегистрироваться', 'Sign up')}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" /> {tx('yoki', 'или', 'or')} <span className="h-px flex-1 bg-line" />
        </div>
        <p className="mb-2 text-center text-xs font-semibold text-muted">{tx('Demo: qaysi platformani koʻrasiz?', 'Демо: какую платформу открыть?', 'Demo: which platform?')}</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-card/70 p-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-violet-400" onClick={() => demo('student')}>
            <GraduationCap className="h-6 w-6 text-violet-500" />
            {tx('Oʻquvchi', 'Ученик', 'Student')}
            <span className="text-[11px] font-normal text-muted">Jasur, 7-{tx('sinf', 'класс', 'grade')}</span>
          </button>
          <button className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-card/70 p-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-teal-400" onClick={() => demo('parent')}>
            <HeartHandshake className="h-6 w-6 text-teal-500" />
            {tx('Ota-ona', 'Родитель', 'Parent')}
            <span className="text-[11px] font-normal text-muted">Rustam aka</span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {isLogin ? tx("Hisobingiz yoʻqmi?", 'Нет аккаунта?', 'No account?') : tx('Hisobingiz bormi?', 'Уже есть аккаунт?', 'Have an account?')}{' '}
          <Link className="font-semibold text-brand" to={isLogin ? '/signup' : '/login'}>
            {isLogin ? tx("Roʻyxatdan oʻting", 'Зарегистрируйтесь', 'Sign up') : tx('Kiring', 'Войдите', 'Log in')}
          </Link>
        </p>
      </motion.div>
    </Page>
  );
}
