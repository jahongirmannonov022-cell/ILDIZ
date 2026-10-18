// Navigation is different for each platform: student, parent and teacher.
import {
  BarChart3, Bell, Bot, CalendarCheck, Flower2, HeartHandshake, LayoutDashboard, MapPin, Network, Rewind, School, Send, Settings, Users, LucideIcon,
} from 'lucide-react';
import { Role, tri, Tri } from '../lib/types';

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: Tri;
  wow?: boolean;
}
export interface NavGroup {
  title: Tri;
  items: NavItem[];
}

const account: NavGroup = {
  title: tri('Hisob', 'Аккаунт', 'Account'),
  items: [
    { to: '/app/notifications', icon: Bell, label: tri('Bildirishnomalar', 'Уведомления', 'Notifications') },
    { to: '/app/settings', icon: Settings, label: tri('Sozlamalar', 'Настройки', 'Settings') },
  ],
};

const STUDENT: NavGroup[] = [
  {
    title: tri('Oʻqish', 'Учёба', 'Learn'),
    items: [
      { to: '/app', icon: LayoutDashboard, label: tri('Bosh sahifa', 'Главная', 'Home') },
      { to: '/app/scan', icon: Rewind, label: tri('Vaqt mashinasi', 'Машина времени', 'Time Machine'), wow: true },
      { to: '/app/map', icon: Network, label: tri('Bilim xaritasi', 'Карта знаний', 'Knowledge map') },
      { to: '/app/assistant', icon: Bot, label: tri('Aqlli yordamchi', 'Умный помощник', 'Smart assistant') },
    ],
  },
  {
    title: tri('Ustozlar', 'Учителя', 'Tutors'),
    items: [{ to: '/app/tutors', icon: CalendarCheck, label: tri('Support ustozlar', 'Support-учителя', 'Support teachers') }],
  },
  {
    title: tri('Mening bogʻim', 'Мой сад', 'My garden'),
    items: [
      { to: '/app/achievements', icon: Flower2, label: tri('Yutuqlar bogʻi', 'Сад достижений', 'Achievement garden') },
      { to: '/app/community', icon: Users, label: tri('Hamjamiyat', 'Сообщество', 'Community') },
    ],
  },
  account,
];

const PARENT: NavGroup[] = [
  {
    title: tri('Farzandim', 'Мой ребёнок', 'My child'),
    items: [
      { to: '/app', icon: LayoutDashboard, label: tri('Ota-ona paneli', 'Панель родителя', 'Parent home') },
      { to: '/app/parent', icon: Send, label: tri('Haftalik hisobot', 'Недельный отчёт', 'Weekly report') },
      { to: '/app/map', icon: Network, label: tri('Bilim xaritasi', 'Карта знаний', 'Knowledge map') },
      { to: '/app/achievements', icon: Flower2, label: tri('Farzandim bogʻi', 'Сад ребёнка', "Child's garden") },
    ],
  },
  {
    title: tri('Yordam', 'Помощь', 'Help'),
    items: [
      { to: '/app/tutors', icon: CalendarCheck, label: tri('Ustoz band qilish', 'Записаться к учителю', 'Book a tutor'), wow: true },
      { to: '/app/grandma', icon: HeartHandshake, label: tri('Buvijon rejimi', 'Режим бабушки', 'Grandma mode') },
      { to: '/app/scan', icon: Rewind, label: tri('Xatoni tekshirish', 'Проверить ошибку', 'Check a mistake') },
    ],
  },
  {
    title: tri('Hamjamiyat', 'Сообщество', 'Community'),
    items: [
      { to: '/app/community', icon: Users, label: tri('Ota-onalar maslahati', 'Советы родителей', 'Parent tips') },
      { to: '/app/impact', icon: BarChart3, label: tri('Taʼsir', 'Влияние', 'Impact') },
    ],
  },
  account,
];

const TEACHER: NavGroup[] = [
  {
    title: tri('Sinfim', 'Мой класс', 'My class'),
    items: [
      { to: '/app', icon: School, label: tri('Sinf xaritasi', 'Карта класса', 'Class map') },
      { to: '/app/map', icon: Network, label: tri('Bilim xaritasi', 'Карта знаний', 'Knowledge map') },
      { to: '/app/scan', icon: Rewind, label: tri('Vaqt mashinasi', 'Машина времени', 'Time Machine'), wow: true },
    ],
  },
  {
    title: tri('Hamjamiyat', 'Сообщество', 'Community'),
    items: [
      { to: '/app/tutors', icon: CalendarCheck, label: tri('Support ustozlar', 'Support-учителя', 'Support teachers') },
      { to: '/app/community', icon: Users, label: tri('Hamjamiyat', 'Сообщество', 'Community') },
      { to: '/app/schools', icon: MapPin, label: tri('Pilot xaritasi', 'Карта пилота', 'Pilot map') },
      { to: '/app/impact', icon: BarChart3, label: tri('Taʼsir', 'Влияние', 'Impact') },
    ],
  },
  account,
];

export const navFor = (role: Role): NavGroup[] => (role === 'parent' ? PARENT : role === 'teacher' ? TEACHER : STUDENT);

/** Every page title for the top bar, regardless of role */
export const ALL_NAV: NavItem[] = [...STUDENT, ...PARENT, ...TEACHER].flatMap((g) => g.items);

export const ROLE_LABEL: Record<Role, Tri> = {
  student: tri('Oʻquvchi', 'Ученик', 'Student'),
  parent: tri('Ota-ona', 'Родитель', 'Parent'),
  teacher: tri('Oʻqituvchi', 'Учитель', 'Teacher'),
};
