import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Globe, LogOut, Moon, RotateCcw, Save, Settings as SettingsIcon, Sun, Zap } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { Avatar, PageHeader } from '../components/ui';
import { CITIES } from '../data/mock';
import { Lang, Role } from '../lib/types';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  const { state, update, settings, setLang, toggleTheme, setLite, logout, resetDemo, toast } = useUser();
  const { tx } = useT();
  const nav = useNavigate();
  const p = state.profile;
  const [form, setForm] = useState({ name: p.name, childName: p.childName, grade: p.grade, city: p.city, role: p.role });
  const [confirm, setConfirm] = useState(false);

  const save = () => {
    update((s) => ({ ...s, profile: { ...s.profile, ...form } }));
    toast(tx('Profil saqlandi', 'Профиль сохранён', 'Profile saved'));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ildizai-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const Switch = ({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) => (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onClick} className={cn('relative h-7 w-12 shrink-0 rounded-full transition', on ? 'bg-brand' : 'bg-fg/20')}>
      <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-6' : 'left-1')} />
    </button>
  );

  return (
    <div>
      <PageHeader icon={<SettingsIcon className="h-6 w-6" />} title={tx('Sozlamalar', 'Настройки', 'Settings')} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <Avatar name={form.name} size={56} />
            <div>
              <p className="text-lg font-bold">{form.name}</p>
              <p className="text-sm text-muted">{form.city}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="sn">{tx('Ism', 'Имя', 'Name')}</label>
              <input id="sn" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="sc">{tx('Bola ismi', 'Имя ребёнка', "Child's name")}</label>
              <input id="sc" className="input" value={form.childName} onChange={(e) => setForm({ ...form, childName: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="sg">{tx('Sinf', 'Класс', 'Grade')}</label>
              <select id="sg" className="input" value={form.grade} onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}>
                {[5, 6, 7, 8, 9].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="sct">{tx('Shahar', 'Город', 'City')}</label>
              <select id="sct" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="sr">{tx('Rol', 'Роль', 'Role')}</label>
              <select id="sr" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                <option value="student">{tx("Oʻquvchi", 'Ученик', 'Student')}</option>
                <option value="parent">{tx('Ota-ona', 'Родитель', 'Parent')}</option>
                <option value="teacher">{tx("Oʻqituvchi", 'Учитель', 'Teacher')}</option>
              </select>
            </div>
          </div>
          <button className="btn-primary mt-5" onClick={save}>
            <Save className="h-4 w-4" /> {tx('Saqlash', 'Сохранить', 'Save')}
          </button>
        </div>

        <div className="space-y-6">
          <div className="card divide-y divide-line/60 p-2">
            <div className="flex items-center gap-4 p-4">
              <Globe className="h-5 w-5 text-brand" />
              <span className="flex-1 font-semibold">{tx('Til', 'Язык', 'Language')}</span>
              <div className="flex gap-1 rounded-xl bg-fg/5 p-1">
                {(['uz', 'ru', 'en'] as Lang[]).map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={cn('rounded-lg px-3 py-1.5 text-xs font-bold uppercase', settings.lang === l ? 'bg-brand text-white' : 'text-muted')}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              {settings.theme === 'dark' ? <Moon className="h-5 w-5 text-brand" /> : <Sun className="h-5 w-5 text-brand" />}
              <span className="flex-1 font-semibold">{tx("Tungi rejim", 'Тёмная тема', 'Dark mode')}</span>
              <Switch on={settings.theme === 'dark'} onClick={toggleTheme} label="Dark mode" />
            </div>
            <div className="flex items-center gap-4 p-4">
              <Zap className="h-5 w-5 text-brand" />
              <span className="flex-1">
                <span className="block font-semibold">{tx('Yengil rejim', 'Лёгкий режим', 'Lite mode')}</span>
                <span className="block text-xs text-muted">{tx("Sekin internet va eski telefonlar uchun: animatsiyalar oʻchadi", 'Для медленного интернета: без анимаций', 'For slow internet: animations off')}</span>
              </span>
              <Switch on={settings.lite} onClick={() => setLite(!settings.lite)} label="Lite mode" />
            </div>
          </div>

          <div className="card space-y-3 p-6">
            <h2 className="font-bold">{tx("Ma'lumotlar", 'Данные', 'Data')}</h2>
            <p className="text-sm text-muted">{tx("Barcha ma'lumotlar faqat shu brauzerda saqlanadi.", 'Все данные хранятся только в этом браузере.', 'All data is stored only in this browser.')}</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={exportData}>
                <Download className="h-4 w-4" /> {tx('Yuklab olish (JSON)', 'Скачать (JSON)', 'Download (JSON)')}
              </button>
              {confirm ? (
                <>
                  <button
                    className="btn bg-rose-500 text-white"
                    onClick={() => {
                      resetDemo();
                      setConfirm(false);
                      toast(tx('Demo ma’lumotlar tiklandi', 'Данные сброшены', 'Demo data reset'));
                    }}
                  >
                    {tx('Ha, tiklash', 'Да, сбросить', 'Yes, reset')}
                  </button>
                  <button className="btn-ghost" onClick={() => setConfirm(false)}>
                    {tx('Bekor', 'Отмена', 'Cancel')}
                  </button>
                </>
              ) : (
                <button className="btn-secondary" onClick={() => setConfirm(true)}>
                  <RotateCcw className="h-4 w-4" /> {tx('Progressni tiklash', 'Сбросить прогресс', 'Reset progress')}
                </button>
              )}
            </div>
          </div>

          <button
            className="btn-secondary w-full text-rose-500"
            onClick={() => {
              logout();
              nav('/');
            }}
          >
            <LogOut className="h-4 w-4" /> {tx('Chiqish', 'Выйти', 'Log out')}
          </button>
        </div>
      </div>
    </div>
  );
}
