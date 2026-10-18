// Pilot map of schools & learning centers (Leaflet + OpenStreetMap, no API key).
import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { MapPin, Search, School as SchoolIcon, TrendingUp, Users } from 'lucide-react';
import { useT, useUser } from '../store/AppContext';
import { SCHOOLS, School } from '../data/mock';
import { PageHeader, Stat } from '../components/ui';
import { cn, fmtNum } from '../lib/utils';

function FlyTo({ target }: { target: School | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 11, { duration: 1.2 });
  }, [target, map]);
  return null;
}

export default function SchoolsMap() {
  const { settings } = useUser();
  const { tx } = useT();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'all' | School['type']>('all');
  const [sel, setSel] = useState<School | null>(null);
  const list = useMemo(
    () => SCHOOLS.filter((s) => (type === 'all' || s.type === type) && (s.name + s.city).toLowerCase().includes(q.toLowerCase())),
    [q, type],
  );
  const dark = settings.theme === 'dark';
  const students = SCHOOLS.reduce((a, s) => a + s.students, 0);
  const roots = SCHOOLS.reduce((a, s) => a + s.roots, 0);
  const growth = Math.round(SCHOOLS.reduce((a, s) => a + s.growth, 0) / SCHOOLS.length);

  return (
    <div>
      <PageHeader icon={<MapPin className="h-6 w-6" />} title={tx('Pilot xaritasi', 'Карта пилота', 'Pilot map')} subtitle={tx("IldizAI ishlayotgan maktab va oʻquv markazlari — Nukusdan Andijongacha", 'Школы и центры с IldizAI — от Нукуса до Андижана', 'Schools and centers using IldizAI — from Nukus to Andijan')} />
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Stat icon={<SchoolIcon className="h-4 w-4" />} label={tx('Muassasalar', 'Учреждений', 'Institutions')} value={SCHOOLS.length} />
        <Stat icon={<Users className="h-4 w-4" />} tone="bg-sky-500/10 text-sky-500" label={tx("Oʻquvchilar", 'Учеников', 'Students')} value={fmtNum(students)} />
        <Stat icon={<TrendingUp className="h-4 w-4" />} tone="bg-emerald-500/10 text-emerald-500" label={tx("Oʻrtacha oʻsish", 'Средний рост', 'Avg growth')} value={`+${growth}%`} hint={`${fmtNum(roots)} ${tx('ildiz topildi', 'корней найдено', 'roots found')}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <MapContainer center={[41.2, 64.6]} zoom={5.5} scrollWheelZoom={false} className="h-[460px] w-full lg:h-[560px]" attributionControl>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className={dark ? 'brightness-[0.7] contrast-[1.1] invert hue-rotate-180' : ''}
            />
            <FlyTo target={sel} />
            {list.map((s) => (
              <CircleMarker
                key={s.id}
                center={[s.lat, s.lng]}
                radius={8 + s.students / 90}
                pathOptions={{ color: s.type === 'school' ? '#6C47FF' : '#d946ef', fillColor: s.type === 'school' ? '#6C47FF' : '#d946ef', fillOpacity: 0.45, weight: 2 }}
                eventHandlers={{ click: () => setSel(s) }}
              >
                <Popup>
                  <b>{s.name}</b>
                  <br />
                  {s.city} · {s.type === 'school' ? tx('Maktab', 'Школа', 'School') : tx("Oʻquv markazi", 'Учебный центр', 'Learning center')}
                  <br />
                  {fmtNum(s.students)} {tx("oʻquvchi", 'учеников', 'students')} · {fmtNum(s.roots)} {tx('ildiz', 'корней', 'roots')} · +{s.growth}%
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        <div className="card flex max-h-[560px] flex-col p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
            <input className="input pl-10" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx('Shahar yoki maktab…', 'Город или школа…', 'City or school…')} aria-label={tx('Qidirish', 'Поиск', 'Search')} />
          </div>
          <div className="mt-3 flex gap-2">
            {(['all', 'school', 'center'] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} className={cn('rounded-full border px-3 py-1 text-xs font-bold', type === t ? 'border-brand bg-brand text-white' : 'border-line text-muted')}>
                {t === 'all' ? tx('Hammasi', 'Все', 'All') : t === 'school' ? tx('Maktablar', 'Школы', 'Schools') : tx('Markazlar', 'Центры', 'Centers')}
              </button>
            ))}
          </div>
          <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
            {list.map((s) => (
              <button key={s.id} onClick={() => setSel(s)} className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:border-brand/50', sel?.id === s.id ? 'border-brand bg-brand-soft' : 'border-line')}>
                <span className={cn('h-3 w-3 shrink-0 rounded-full', s.type === 'school' ? 'bg-brand' : 'bg-brand2')} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{s.name}</span>
                  <span className="block text-xs text-muted">
                    {s.city} · {fmtNum(s.students)} {tx("oʻquvchi", 'уч.', 'students')}
                  </span>
                </span>
                <span className="text-xs font-bold text-emerald-500">+{s.growth}%</span>
              </button>
            ))}
            {!list.length && <p className="p-4 text-center text-sm text-muted">{tx('Hech narsa topilmadi', 'Ничего не найдено', 'Nothing found')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
