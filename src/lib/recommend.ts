// Rule-based personalization: which topics to fix first and why.
import { UserState } from './types';
import { TOPICS, dependentCount, Area, AREAS } from '../data/topics';
import { LESSONS } from '../data/lessons';

export interface Rec {
  topicId: string;
  mastery: number;
  unlocks: number;
  score: number;
}

/** Weak topics that unlock many later topics rank first */
export function recommendations(s: UserState, n = 4): Rec[] {
  return TOPICS.filter((t) => t.grade <= s.profile.grade && LESSONS[t.id] && (s.mastery[t.id] ?? 0) < 70)
    .map((t) => {
      const m = s.mastery[t.id] ?? 0;
      const unlocks = dependentCount(t.id);
      const goalBoost = s.profile.weak.includes(t.area) ? 10 : 0;
      return { topicId: t.id, mastery: m, unlocks, score: (100 - m) * 0.7 + unlocks * 4 + goalBoost };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

export function areaScores(s: UserState) {
  return (Object.keys(AREAS) as Area[]).map((a) => {
    const ts = TOPICS.filter((t) => t.area === a && t.grade <= s.profile.grade);
    const v = ts.length ? Math.round(ts.reduce((x, t) => x + (s.mastery[t.id] ?? 0), 0) / ts.length) : 0;
    return { area: a, value: v };
  });
}
