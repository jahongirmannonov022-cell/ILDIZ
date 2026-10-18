// Impact / statistics page — public (standalone) and inside the app.
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { chartTip } from '../lib/motion';
import { BarChart3, Clock, Heart, Target, Users, Wallet } from 'lucide-react';
import { useApp, useT } from '../store/AppContext';
import { CountUp, Page, PageHeader, Reveal, SkeletonCards, useFakeLoad } from '../components/ui';
import { PublicNav, Footer } from '../components/PublicNav';
import { GROWTH, REGIONS, TESTIMONIALS } from '../data/mock';
import { fmtNum } from '../lib/utils';

const TUTOR_LESSON = 120000; // so'm per tutoring session (demo assumption)

function ImpactBody() {
  const { state } = useApp();
  const { tx, L } = useT();
  const loading = useFakeLoad(500);

  const growth = GROWTH.map((g) => ({ m: L(g.m), students: g.students, roots: g.roots }));
  const regions = REGIONS.map((r) => ({ name: L(r.name), roots: r.roots, students: r.students }));
  const beforeAfter = [
    { t: tx('Kasrlar', 'Дроби', 'Fractions'), before: 41, after: 74 },
    { t: tx('Manfiy sonlar', 'Отриц. числа', 'Negatives'), before: 48, after: 77 },
    { t: tx('Tenglamalar', 'Уравнения', 'Equations'), before: 39, after: 68 },
    { t: tx('Foizlar', 'Проценты', 'Percents'), before: 52, after: 79 },
    { t: tx('Darajalar', 'Степени', 'Powers'), before: 55, after: 81 },
  ];
  const roles = [
    { name: tx("Oʻquvchilar", 'Ученики', 'Students'), value: 12480, color: 'rgb(var(--brand))' },
    { name: tx('Ota-onalar', 'Родители', 'Parents'), value: 7310, color: '#d946ef' },
    { name: tx("Oʻqituvchilar", 'Учителя', 'Teachers'), value: 640, color: '#10b981' },
    { name: tx('Buvi-bobolar', 'Бабушки и дедушки', 'Grandparents'), value: 1120, color: '#f59e0b' },
  ];

  const myClosed = state ? state.history.filter((h) => h.closed).length + state.lessonsDone.length : 0;

  if (loading)
    return (
      <div className="space-y-6">
        <SkeletonCards n={4} />
        <div className="skeleton h-80" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, v: 12480, l: tx("oʻquvchiga yordam berildi", 'ученикам помогли', 'students helped') },
          { icon: Target, v: 31200, l: tx('ildiz yopildi', 'корней закрыто', 'roots closed') },
          { icon: Wallet, v: 4.7, d: 1, s: tx(' mlrd', ' млрд', 'B'), l: tx("soʻm repetitorga tejaldi", 'сумов сэкономлено', "soʻm saved on tutors") },
          { icon: Clock, v: 52000, l: tx('soat tejaldi', 'часов сэкономлено', 'hours saved') },
        ].map((k, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div className="card card-hover p-6">
              <k.icon className="h-6 w-6 text-brand" />
              <p className="mt-3 text-3xl font-extrabold">
                <CountUp to={k.v} decimals={k.d ?? 0} suffix={k.s ?? ''} />
              </p>
              <p className="text-sm text-muted">{k.l}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {state && (
        <Reveal>
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white sm:flex-row sm:items-center">
            <Heart className="h-10 w-10 shrink-0" />
            <div>
              <p className="text-lg font-extrabold">{tx('Sizning hissangiz', 'Ваш вклад', 'Your contribution')}</p>
              <p className="text-white/90">
                {tx(
                  `${myClosed} ta ildiz yopildi ≈ ${fmtNum(myClosed * TUTOR_LESSON)} soʻm repetitor xarajati va ${myClosed * 2} soat vaqt tejaldi.`,
                  `Закрыто корней: ${myClosed} ≈ ${fmtNum(myClosed * TUTOR_LESSON)} сумов на репетиторе и ${myClosed * 2} ч времени.`,
                  `${myClosed} roots closed ≈ ${fmtNum(myClosed * TUTOR_LESSON)} soʻm of tutoring and ${myClosed * 2} hours saved.`,
                )}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-bold">{tx("Platforma oʻsishi", 'Рост платформы', 'Platform growth')}</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(var(--brand))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="rgb(var(--brand))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d946ef" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTip} />
                <Legend />
                <Area type="monotone" dataKey="roots" name={tx('Ildizlar', 'Корни', 'Roots')} stroke="#d946ef" strokeWidth={2.5} fill="url(#g2)" />
                <Area type="monotone" dataKey="students" name={tx("Oʻquvchilar", 'Ученики', 'Students')} stroke="rgb(var(--brand))" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-bold">{tx('Chorak nazorati: oldin va keyin, %', 'Четвертные: до и после, %', 'Quarterly tests: before vs after, %')}</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beforeAfter} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
                <XAxis dataKey="t" tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTip} cursor={{ fill: 'rgb(var(--brand) / 0.06)' }} />
                <Legend />
                <Bar dataKey="before" name={tx('Oldin', 'До', 'Before')} fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="after" name={tx('IldizAI bilan', 'С IldizAI', 'With IldizAI')} fill="rgb(var(--brand))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-bold">{tx("Hududlar boʻyicha topilgan ildizlar", 'Найденные корни по регионам', 'Roots found by region')}</h2>
          <div className="mt-4 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fill: 'rgb(var(--muted))', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTip} cursor={{ fill: 'rgb(var(--brand) / 0.06)' }} />
                <Bar dataKey="roots" name={tx('Ildizlar', 'Корни', 'Roots')} fill="rgb(var(--brand))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-bold">{tx('Foydalanuvchilar', 'Пользователи', 'Users')}</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roles} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                  {roles.map((r) => (
                    <Cell key={r.name} fill={r.color} />
                  ))}
                </Pie>
                <Tooltip {...chartTip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2 text-sm">
            {roles.map((r) => (
              <li key={r.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: r.color }} />
                <span className="flex-1 text-muted">{r.name}</span>
                <b>{fmtNum(r.value)}</b>
              </li>
            ))}
          </ul>
          <blockquote className="mt-6 rounded-xl bg-fg/5 p-4 text-sm italic">
            “{L(TESTIMONIALS[1].text)}”
            <footer className="mt-2 text-xs not-italic text-muted">— {TESTIMONIALS[1].name}</footer>
          </blockquote>
        </div>
      </div>
      <p className="text-center text-xs text-muted">
        {tx(
          `* Pilot prognozi va demo ma'lumotlar. Tejamkorlik formulasi: yopilgan ildiz × 1 repetitor darsi (${fmtNum(TUTOR_LESSON)} soʻm) × 2 soat.`,
          `* Прогноз пилота и демо-данные. Формула экономии: закрытый корень × 1 занятие с репетитором (${fmtNum(TUTOR_LESSON)} сум) × 2 часа.`,
          `* Pilot projection & demo data. Savings formula: closed root × 1 tutoring session (${fmtNum(TUTOR_LESSON)} soʻm) × 2 hours.`,
        )}
      </p>
    </div>
  );
}

export default function Impact({ standalone = false }: { standalone?: boolean }) {
  const { tx } = useT();
  const header = (
    <PageHeader
      icon={<BarChart3 className="h-6 w-6" />}
      title={tx("Ijtimoiy ta'sir", 'Социальное влияние', 'Social impact')}
      subtitle={tx("Kimga yordam berdik, qancha pul va vaqt tejaldi", 'Кому помогли и сколько денег и времени сэкономили', 'Who we helped and how much money and time were saved')}
    />
  );
  if (!standalone)
    return (
      <div>
        {header}
        <ImpactBody />
      </div>
    );
  return (
    <Page>
      <PublicNav />
      <main className="section pb-20 pt-28">
        {header}
        <ImpactBody />
      </main>
      <Footer />
    </Page>
  );
}
