// Diagnostic questions per topic. Used by the Time Machine (3-question check),
// lessons and Grandma cards. `answer` is the index of the correct option.
import { tri, Text, Tri } from '../lib/types';

export interface Question {
  prompt: Tri;
  q: Text;
  options: string[];
  answer: number;
}

const P = {
  calc: tri('Hisoblang', 'Вычислите', 'Calculate'),
  solve: tri('Tenglamani yeching', 'Решите уравнение', 'Solve the equation'),
  simplify: tri('Soddalashtiring', 'Упростите', 'Simplify'),
  reduce: tri('Oxirigacha qisqartiring', 'Сократите до конца', 'Simplify fully'),
  lcd: tri('Eng kichik umumiy maxrajni toping', 'Найдите наименьший общий знаменатель', 'Find the least common denominator'),
  expand: tri('Qavslarni oching', 'Раскройте скобки', 'Expand the brackets'),
  compare: tri('Taqqoslang', 'Сравните', 'Compare'),
  smaller: tri('Qaysi son kichikroq?', 'Какое число меньше?', 'Which number is smaller?'),
  abs: tri('Modulini toping', 'Найдите модуль', 'Find the absolute value'),
  missing: tri('Yetishmayotgan sonni toping', 'Найдите недостающее число', 'Find the missing number'),
  bigger1: tri('Qaysi kasr 1 dan katta?', 'Какая дробь больше 1?', 'Which fraction is greater than 1?'),
};

export const QUESTIONS: Record<string, Question[]> = {
  lcd: [
    { prompt: P.lcd, q: '1/3 , 1/4', options: ['12', '7', '4', '1'], answer: 0 },
    { prompt: P.missing, q: '2/5 = ?/10', options: ['4', '2', '5', '7'], answer: 0 },
    { prompt: P.lcd, q: '1/6 , 3/4', options: ['12', '24', '10', '6'], answer: 0 },
  ],
  fracAdd: [
    { prompt: P.calc, q: '1/4 + 2/4', options: ['3/4', '3/8', '2/4', '1/8'], answer: 0 },
    { prompt: P.calc, q: '1/2 + 1/4', options: ['3/4', '2/6', '1/6', '2/4'], answer: 0 },
    { prompt: P.calc, q: '5/6 − 1/3', options: ['1/2', '4/3', '4/6', '1/3'], answer: 0 },
  ],
  linearEq: [
    { prompt: P.solve, q: 'x + 5 = 12', options: ['7', '17', '−7', '60'], answer: 0 },
    { prompt: P.solve, q: '3x = 18', options: ['6', '15', '54', '21'], answer: 0 },
    { prompt: P.solve, q: '2x − 4 = 10', options: ['7', '3', '12', '14'], answer: 0 },
  ],
  negNumbers: [
    { prompt: P.smaller, q: '−5 ? −2', options: ['−5', '−2', '='], answer: 0 },
    { prompt: P.abs, q: '|−8|', options: ['8', '−8', '0', '1/8'], answer: 0 },
    { prompt: P.calc, q: '−(−6)', options: ['6', '−6', '0', '−12'], answer: 0 },
  ],
  negAdd: [
    { prompt: P.calc, q: '−7 + 4', options: ['−3', '3', '−11', '11'], answer: 0 },
    { prompt: P.calc, q: '−2 − 5', options: ['−7', '3', '−3', '7'], answer: 0 },
    { prompt: P.calc, q: '6 + (−9)', options: ['−3', '15', '3', '−15'], answer: 0 },
  ],
  negMul: [
    { prompt: P.calc, q: '(−3) · (−4)', options: ['12', '−12', '−7', '7'], answer: 0 },
    { prompt: P.calc, q: '(−5) · 2', options: ['−10', '10', '−3', '3'], answer: 0 },
    { prompt: P.calc, q: '(−20) : (−4)', options: ['5', '−5', '−16', '80'], answer: 0 },
  ],
  brackets: [
    { prompt: P.expand, q: '5 − (x − 3)', options: ['8 − x', '2 − x', '8 + x', '2 + x'], answer: 0 },
    { prompt: P.expand, q: '−(a + b)', options: ['−a − b', '−a + b', 'a − b', 'a + b'], answer: 0 },
    { prompt: P.expand, q: '3(x − 2)', options: ['3x − 6', '3x − 2', 'x − 6', '3x + 6'], answer: 0 },
  ],
  likeTerms: [
    { prompt: P.simplify, q: '3a + 2b − a + 4b', options: ['2a + 6b', '8ab', '4a + 6b', '2a + 2b'], answer: 0 },
    { prompt: P.simplify, q: '5x − 7x', options: ['−2x', '2x', '−2', '12x'], answer: 0 },
    { prompt: P.simplify, q: '4y + y', options: ['5y', '4y²', '5', '4y'], answer: 0 },
  ],
  powers: [
    { prompt: P.calc, q: '2³ · 2²', options: ['2⁵', '2⁶', '4⁵', '4⁶'], answer: 0 },
    { prompt: P.simplify, q: '(3²)³', options: ['3⁶', '3⁵', '9⁵', '3⁸'], answer: 0 },
    { prompt: P.calc, q: '5⁰', options: ['1', '0', '5', '50'], answer: 0 },
  ],
  polyMul: [
    { prompt: P.expand, q: '(x + 2)(x + 3)', options: ['x² + 5x + 6', 'x² + 6', 'x² + 5x + 5', '2x + 5'], answer: 0 },
    { prompt: P.expand, q: '(a + 1)(a − 1)', options: ['a² − 1', 'a² + 1', 'a² − 2a − 1', '2a'], answer: 0 },
    { prompt: P.expand, q: 'x(x − 4)', options: ['x² − 4x', 'x² − 4', '2x − 4', 'x − 4x'], answer: 0 },
  ],
  shortMult: [
    { prompt: P.expand, q: '(a + 3)²', options: ['a² + 6a + 9', 'a² + 9', 'a² + 3a + 9', '2a + 6'], answer: 0 },
    { prompt: P.expand, q: '(x − 5)²', options: ['x² − 10x + 25', 'x² − 25', 'x² + 25', 'x² − 5x + 25'], answer: 0 },
    { prompt: P.expand, q: '(m + n)(m − n)', options: ['m² − n²', 'm² + n²', '(m − n)²', '2mn'], answer: 0 },
  ],
  decimals: [
    { prompt: P.calc, q: '0,3 · 0,2', options: ['0,06', '0,6', '6', '0,006'], answer: 0 },
    { prompt: P.calc, q: '1,5 + 0,25', options: ['1,75', '1,30', '0,40', '17,5'], answer: 0 },
    { prompt: P.calc, q: '2,4 : 0,6', options: ['4', '0,4', '40', '1,8'], answer: 0 },
  ],
  percent: [
    { prompt: P.calc, q: '10% · 200', options: ['20', '2', '10', '190'], answer: 0 },
    { prompt: tri('50% qaysi kasrga teng?', '50% — это какая дробь?', 'Which fraction equals 50%?'), q: '50% = ?', options: ['1/2', '1/5', '1/50', '5'], answer: 0 },
    { prompt: P.calc, q: tri("25% · 80 000 soʻm", '25% · 80 000 сум', "25% · 80,000 soʻm"), options: ['20 000', '2 000', '25 000', '32 000'], answer: 0 },
  ],
  gcd: [
    { prompt: P.calc, q: tri('EKUB(12, 18)', 'НОД(12, 18)', 'GCD(12, 18)'), options: ['6', '36', '3', '2'], answer: 0 },
    { prompt: P.calc, q: tri('EKUB(8, 20)', 'НОД(8, 20)', 'GCD(8, 20)'), options: ['4', '40', '2', '8'], answer: 0 },
    { prompt: P.calc, q: tri('EKUB(9, 14)', 'НОД(9, 14)', 'GCD(9, 14)'), options: ['1', '126', '3', '7'], answer: 0 },
  ],
  lcm: [
    { prompt: P.calc, q: tri('EKUK(4, 6)', 'НОК(4, 6)', 'LCM(4, 6)'), options: ['12', '24', '2', '10'], answer: 0 },
    { prompt: P.calc, q: tri('EKUK(3, 5)', 'НОК(3, 5)', 'LCM(3, 5)'), options: ['15', '8', '1', '30'], answer: 0 },
    { prompt: P.calc, q: tri('EKUK(6, 9)', 'НОК(6, 9)', 'LCM(6, 9)'), options: ['18', '54', '3', '15'], answer: 0 },
  ],
  fracSimplify: [
    { prompt: P.reduce, q: '12/18', options: ['2/3', '6/9', '4/6', '3/2'], answer: 0 },
    { prompt: P.reduce, q: '15/25', options: ['3/5', '5/3', '1/5', '3/25'], answer: 0 },
    { prompt: P.reduce, q: '8/32', options: ['1/4', '2/8', '1/8', '4/1'], answer: 0 },
  ],
  fracMeaning: [
    { prompt: P.compare, q: '1/2 ? 1/3', options: ['1/2 > 1/3', '1/2 < 1/3', '1/2 = 1/3'], answer: 0 },
    { prompt: P.missing, q: '3/4 = ?/8', options: ['6', '3', '7', '4'], answer: 0 },
    { prompt: P.bigger1, q: '?', options: ['5/4', '3/4', '4/5', '1/4'], answer: 0 },
  ],
  proportion: [
    { prompt: P.solve, q: 'x/4 = 9/12', options: ['3', '1', '16', '27'], answer: 0 },
    { prompt: P.solve, q: '2 : 5 = 6 : x', options: ['15', '9', '12', '3'], answer: 0 },
    {
      prompt: tri("3 ta daftar 6 000 soʻm. 5 ta daftar necha soʻm?", '3 тетради стоят 6 000 сумов. Сколько стоят 5?', "3 notebooks cost 6,000 soʻm. How much are 5?"),
      q: '3 → 6 000 ; 5 → ?',
      options: ['10 000', '8 000', '30 000', '11 000'],
      answer: 0,
    },
  ],
  fracMul: [
    { prompt: P.calc, q: '2/3 · 3/4', options: ['1/2', '5/7', '6/7', '8/9'], answer: 0 },
    { prompt: P.calc, q: '2/3 : 4/5', options: ['5/6', '8/15', '6/5', '4/3'], answer: 0 },
    { prompt: P.calc, q: '3 · 2/7', options: ['6/7', '6/21', '5/7', '3/14'], answer: 0 },
  ],
  sqrt: [
    { prompt: P.calc, q: '√49', options: ['7', '24,5', '49', '14'], answer: 0 },
    { prompt: P.calc, q: '√(9 · 16)', options: ['12', '25', '7', '144'], answer: 0 },
    { prompt: P.calc, q: '(√5)²', options: ['5', '25', '√5', '10'], answer: 0 },
  ],
  quadEq: [
    { prompt: P.solve, q: 'x² = 49', options: ['x = ±7', 'x = 7', 'x = 24,5', 'x = −7'], answer: 0 },
    { prompt: P.solve, q: 'x² − 9 = 0', options: ['x = ±3', 'x = 3', 'x = 9', 'x = ±9'], answer: 0 },
    { prompt: P.solve, q: 'x(x − 2) = 0', options: ['x = 0; 2', 'x = 2', 'x = 0', 'x = −2'], answer: 0 },
  ],
  wordEq: [
    {
      prompt: tri("Son 3 ga koʻpaytirilib, 4 qoʻshilsa 19 chiqadi. Son nechaga teng?", 'Число умножили на 3 и прибавили 4 — получилось 19. Что это за число?', 'A number times 3, plus 4, equals 19. What is the number?'),
      q: '3x + 4 = 19',
      options: ['5', '7', '15', '23'],
      answer: 0,
    },
    {
      prompt: tri("Ali Validan 2 baravar koʻp olma terdi, birga 24 ta. Vali nechta terdi?", 'Али собрал в 2 раза больше яблок, чем Вали, вместе 24. Сколько собрал Вали?', 'Ali picked twice as many apples as Vali, 24 in total. How many did Vali pick?'),
      q: 'x + 2x = 24',
      options: ['8', '12', '16', '6'],
      answer: 0,
    },
    {
      prompt: tri("3 ta daftar va 5 000 soʻmlik ruchka — 23 000 soʻm. Daftar narxi?", '3 тетради и ручка за 5 000 — 23 000 сумов. Цена тетради?', "3 notebooks and a 5,000 soʻm pen cost 23,000 soʻm. Price of a notebook?"),
      q: '3x + 5 000 = 23 000',
      options: ['6 000', '9 000', '18 000', '7 000'],
      answer: 0,
    },
  ],
};
