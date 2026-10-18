// Rule-based diagnosis engine: answer → misconception → prerequisite chain → root.
import { Problem, Pattern } from '../data/problems';
import { TOPIC } from '../data/topics';
import { tri, Tri } from './types';
import { normalizeAnswer } from './utils';

export type Diagnosis =
  | { kind: 'correct' }
  | { kind: 'wrong'; pattern: Pattern | null; chain: string[]; mis: Tri; steps: string[]; wrongStep: number };

export function diagnose(problem: Problem, answer: string): Diagnosis {
  const a = normalizeAnswer(answer);
  if (problem.accepted.some((x) => normalizeAnswer(x) === a)) return { kind: 'correct' };
  const pattern = problem.patterns.find((p) => p.answers.some((x) => normalizeAnswer(x) === a)) ?? null;
  if (pattern) {
    return { kind: 'wrong', pattern, chain: pattern.chain, mis: pattern.mis, steps: pattern.steps ?? [answer], wrongStep: pattern.wrongStep ?? 0 };
  }
  // Unknown wrong answer: fall back to the most common chain and let the check questions decide
  return {
    kind: 'wrong',
    pattern: null,
    chain: problem.defaultChain,
    mis: tri(
      "Xato turi bazamizda yoʻq — eng koʻp uchraydigan ildizni 3 ta savol bilan tekshiramiz",
      'Такого типа ошибки нет в базе — проверим самый частый корень 3 вопросами',
      "This mistake isn't in our database — we'll test the most common root with 3 questions",
    ),
    steps: [`= ${answer}`],
    wrongStep: 0,
  };
}

/** Decide the root from the 3 check answers */
export function resolveRoot(chain: string[], wrongCount: number, knownPattern: boolean) {
  const deepest = chain[chain.length - 1];
  if (wrongCount >= 2) {
    return { rootId: deepest, confirmed: true, confidence: Math.min(97, (wrongCount === 3 ? 93 : 82) + (knownPattern ? 3 : -6)) };
  }
  if (chain.length > 1) {
    return { rootId: chain[chain.length - 2], confirmed: false, confidence: knownPattern ? 74 : 66 };
  }
  return { rootId: chain[0], confirmed: false, confidence: 62 };
}

export const gradeGap = (problemGrade: number, rootId: string) => Math.max(0, problemGrade - TOPIC[rootId].grade);
