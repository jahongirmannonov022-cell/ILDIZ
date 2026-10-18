// Shared domain types for the whole app

export type Lang = 'uz' | 'ru' | 'en';
/** A string translated into all three app languages */
export type Tri = { uz: string; ru: string; en: string };
/** Either a plain string (user content) or a translated string */
export type Text = string | Tri;

export const tri = (uz: string, ru: string, en: string): Tri => ({ uz, ru, en });

export type Role = 'student' | 'parent' | 'teacher';

export interface Profile {
  name: string;
  role: Role;
  grade: number;
  city: string;
  childName: string;
  goal: 'grades' | 'exam' | 'understand';
  weak: string[]; // topic areas the user marked as difficult
  parentName: string;
  parentCity: string;
  telegram: string;
  onboarded: boolean;
}

export interface ScanRecord {
  id: string;
  date: string;
  problemId: string;
  answer: string;
  rootId: string;
  chain: string[];
  confidence: number;
  closed: boolean;
}

export interface Notif {
  id: string;
  date: string;
  title: Text;
  body: Text;
  kind: 'success' | 'info' | 'warning' | 'badge' | 'reminder';
  read: boolean;
  link?: string;
}

export interface Reminder {
  id: string;
  time: string; // HH:MM
  days: number[]; // 0 = Sunday
  label: string;
  enabled: boolean;
  lastFired?: string;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: Text;
  date: string;
}

export interface Tip {
  id: string;
  author: string;
  city: string;
  tag: Role;
  text: Text;
  likes: number;
}

export interface Stats {
  scans: number;
  lessons: number;
  chats: number;
  reports: number;
  reviews: number;
  mapVisits: number;
  perfectChecks: number;
  maxRewind: number;
  grandmaCards: number;
  tips: number;
  sessions: number;
}

/** A booked 1:1 online lesson with a support teacher */
export interface Booking {
  id: string;
  tutorId: string;
  start: string; // ISO date-time
  minutes: 30 | 60;
  topicId: string;
  note: string;
  price: number;
  pay: 'click' | 'payme' | 'uzcard';
  status: 'upcoming' | 'done' | 'cancelled';
  rating?: number;
  review?: string;
}

export interface PointEntry {
  date: string;
  points: number;
  reason: Text;
}

export interface ChatMsg {
  id: string;
  from: 'user' | 'bot';
  text: string;
  link?: { to: string; label: string };
}

export interface UserState {
  profile: Profile;
  points: number;
  mastery: Record<string, number>;
  history: ScanRecord[];
  lessonsDone: string[];
  activeDays: string[];
  minutes: Record<string, number>;
  badges: string[];
  notifications: Notif[];
  reminders: Reminder[];
  reviews: Review[];
  tips: Tip[];
  liked: string[];
  stats: Stats;
  pointsLog: PointEntry[];
  progress: { date: string; value: number }[];
  dailyBonus?: string;
  chat: ChatMsg[];
  bookings: Booking[];
  /** badges whose plant has already been shown growing in the garden */
  gardenSeen: string[];
}
