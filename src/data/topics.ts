// Prerequisite graph of Uzbek school math (grades 5–9).
// This graph is the "brain" of the Time Machine: it walks prerequisites backwards.
import { tri, Tri } from '../lib/types';

export type Area = 'arith' | 'frac' | 'neg' | 'algebra' | 'func';

export interface Topic {
  id: string;
  grade: number;
  quarter: number;
  area: Area;
  title: Tri;
  prereqs: string[];
}

export const AREAS: Record<Area, Tri> = {
  arith: tri('Arifmetika', 'Арифметика', 'Arithmetic'),
  frac: tri('Kasrlar', 'Дроби', 'Fractions'),
  neg: tri('Manfiy sonlar', 'Отрицательные числа', 'Negative numbers'),
  algebra: tri('Algebra', 'Алгебра', 'Algebra'),
  func: tri('Funksiyalar', 'Функции', 'Functions'),
};

export const TOPICS: Topic[] = [
  { id: 'natural', grade: 5, quarter: 1, area: 'arith', title: tri('Natural sonlar ustida amallar', 'Действия с натуральными числами', 'Whole number operations'), prereqs: [] },
  { id: 'divisibility', grade: 5, quarter: 1, area: 'arith', title: tri("Boʻlinish belgilari", 'Признаки делимости', 'Divisibility rules'), prereqs: ['natural'] },
  { id: 'gcd', grade: 5, quarter: 2, area: 'arith', title: tri("EKUB — eng katta umumiy boʻluvchi", 'НОД — наибольший общий делитель', 'GCD — greatest common divisor'), prereqs: ['divisibility'] },
  { id: 'lcm', grade: 5, quarter: 2, area: 'arith', title: tri('EKUK — eng kichik umumiy karrali', 'НОК — наименьшее общее кратное', 'LCM — least common multiple'), prereqs: ['divisibility'] },
  { id: 'fracMeaning', grade: 5, quarter: 2, area: 'frac', title: tri('Oddiy kasr tushunchasi', 'Понятие обыкновенной дроби', 'What a fraction means'), prereqs: ['natural'] },
  { id: 'fracSimplify', grade: 5, quarter: 3, area: 'frac', title: tri('Kasrlarni qisqartirish', 'Сокращение дробей', 'Simplifying fractions'), prereqs: ['fracMeaning', 'gcd'] },
  { id: 'lcd', grade: 5, quarter: 3, area: 'frac', title: tri('Umumiy maxrajga keltirish', 'Приведение к общему знаменателю', 'Common denominator'), prereqs: ['fracMeaning', 'lcm'] },
  { id: 'fracAdd', grade: 5, quarter: 3, area: 'frac', title: tri("Kasrlarni qoʻshish va ayirish", 'Сложение и вычитание дробей', 'Adding & subtracting fractions'), prereqs: ['lcd'] },
  { id: 'decimals', grade: 5, quarter: 4, area: 'frac', title: tri("Oʻnli kasrlar", 'Десятичные дроби', 'Decimals'), prereqs: ['fracMeaning'] },
  { id: 'percent', grade: 5, quarter: 4, area: 'frac', title: tri('Foizlar', 'Проценты', 'Percentages'), prereqs: ['decimals'] },
  { id: 'fracMul', grade: 6, quarter: 1, area: 'frac', title: tri("Kasrlarni koʻpaytirish va boʻlish", 'Умножение и деление дробей', 'Multiplying & dividing fractions'), prereqs: ['fracSimplify'] },
  { id: 'proportion', grade: 6, quarter: 2, area: 'frac', title: tri('Nisbat va proporsiya', 'Отношения и пропорции', 'Ratio & proportion'), prereqs: ['fracMeaning', 'fracMul'] },
  { id: 'negNumbers', grade: 6, quarter: 3, area: 'neg', title: tri('Musbat va manfiy sonlar', 'Положительные и отрицательные числа', 'Positive & negative numbers'), prereqs: ['natural'] },
  { id: 'negAdd', grade: 6, quarter: 3, area: 'neg', title: tri("Manfiy sonlarni qoʻshish va ayirish", 'Сложение и вычитание отрицательных чисел', 'Adding & subtracting negatives'), prereqs: ['negNumbers'] },
  { id: 'negMul', grade: 6, quarter: 3, area: 'neg', title: tri("Manfiy sonlarni koʻpaytirish va boʻlish", 'Умножение и деление отрицательных чисел', 'Multiplying & dividing negatives'), prereqs: ['negNumbers'] },
  { id: 'brackets', grade: 6, quarter: 4, area: 'algebra', title: tri('Qavslarni ochish', 'Раскрытие скобок', 'Expanding brackets'), prereqs: ['negMul'] },
  { id: 'likeTerms', grade: 6, quarter: 4, area: 'algebra', title: tri("Oʻxshash hadlarni ixchamlash", 'Приведение подобных слагаемых', 'Combining like terms'), prereqs: ['negAdd', 'brackets'] },
  { id: 'coords', grade: 6, quarter: 4, area: 'func', title: tri('Koordinata tekisligi', 'Координатная плоскость', 'Coordinate plane'), prereqs: ['negNumbers'] },
  { id: 'linearEq', grade: 7, quarter: 1, area: 'algebra', title: tri('Chiziqli tenglama', 'Линейное уравнение', 'Linear equations'), prereqs: ['likeTerms', 'fracAdd'] },
  { id: 'wordEq', grade: 7, quarter: 1, area: 'algebra', title: tri('Tenglama tuzib masala yechish', 'Решение задач с помощью уравнений', 'Word problems with equations'), prereqs: ['linearEq'] },
  { id: 'powers', grade: 7, quarter: 2, area: 'algebra', title: tri("Natural koʻrsatkichli daraja", 'Степень с натуральным показателем', 'Powers & exponents'), prereqs: ['natural'] },
  { id: 'monomials', grade: 7, quarter: 2, area: 'algebra', title: tri('Birhadlar', 'Одночлены', 'Monomials'), prereqs: ['powers'] },
  { id: 'polyMul', grade: 7, quarter: 3, area: 'algebra', title: tri("Koʻphadlarni koʻpaytirish", 'Умножение многочленов', 'Multiplying polynomials'), prereqs: ['monomials', 'brackets'] },
  { id: 'shortMult', grade: 7, quarter: 3, area: 'algebra', title: tri("Qisqa koʻpaytirish formulalari", 'Формулы сокращённого умножения', 'Special products'), prereqs: ['polyMul'] },
  { id: 'linFunc', grade: 7, quarter: 4, area: 'func', title: tri('Chiziqli funksiya', 'Линейная функция', 'Linear functions'), prereqs: ['coords', 'linearEq'] },
  { id: 'sqrt', grade: 8, quarter: 2, area: 'algebra', title: tri('Kvadrat ildiz', 'Квадратный корень', 'Square roots'), prereqs: ['powers'] },
  { id: 'quadEq', grade: 8, quarter: 3, area: 'algebra', title: tri('Kvadrat tenglama', 'Квадратное уравнение', 'Quadratic equations'), prereqs: ['sqrt', 'shortMult'] },
  { id: 'inequalities', grade: 8, quarter: 4, area: 'algebra', title: tri('Tengsizliklar', 'Неравенства', 'Inequalities'), prereqs: ['linearEq', 'negMul'] },
  { id: 'quadFunc', grade: 9, quarter: 1, area: 'func', title: tri('Kvadrat funksiya', 'Квадратичная функция', 'Quadratic functions'), prereqs: ['quadEq', 'linFunc'] },
  { id: 'progression', grade: 9, quarter: 3, area: 'algebra', title: tri('Progressiyalar', 'Прогрессии', 'Sequences & progressions'), prereqs: ['linearEq'] },
];

export const TOPIC: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** How many later topics (directly or indirectly) depend on this one */
export function dependentCount(id: string): number {
  const seen = new Set<string>();
  const walk = (cur: string) => {
    for (const t of TOPICS) {
      if (t.prereqs.includes(cur) && !seen.has(t.id)) {
        seen.add(t.id);
        walk(t.id);
      }
    }
  };
  walk(id);
  return seen.size;
}
