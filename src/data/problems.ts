// Homework problems with known misconception patterns.
// A wrong answer is matched against `patterns`; each pattern carries a
// prerequisite chain from the current topic back to the suspected root.
import { tri, Text, Tri } from '../lib/types';

export interface Pattern {
  answers: string[];
  mis: Tri;
  chain: string[];
  steps?: string[];
  wrongStep?: number;
}

export interface Problem {
  id: string;
  grade: number;
  topicId: string;
  prompt: Tri;
  text: Text;
  accepted: string[];
  patterns: Pattern[];
  defaultChain: string[];
  solution: string[];
}

const solve = tri('Tenglamani yeching', 'Решите уравнение', 'Solve the equation');
const calc = tri('Hisoblang', 'Вычислите', 'Calculate');
const simplify = tri('Soddalashtiring', 'Упростите', 'Simplify');

export const PROBLEMS: Problem[] = [
  {
    id: 'p1', grade: 7, topicId: 'linearEq', prompt: solve, text: '2x + 1/3 = 5/6',
    accepted: ['1/4', '0.25', '2/8'],
    patterns: [
      {
        answers: ['2/3', '4/6'],
        mis: tri('Kasrlarni ayirishda suratlar alohida, maxrajlar alohida ayirilgan: 5/6 − 1/3 = 4/3', 'При вычитании дробей отдельно вычли числители и знаменатели: 5/6 − 1/3 = 4/3', 'Numerators and denominators were subtracted separately: 5/6 − 1/3 = 4/3'),
        chain: ['linearEq', 'fracAdd', 'lcd'],
        steps: ['2x = 5/6 − 1/3', '2x = 4/3', 'x = 4/6 = 2/3'],
        wrongStep: 1,
      },
      {
        answers: ['1/2', '3/6'],
        mis: tri("Oxirida 2x ni 2 ga boʻlish unutilgan", 'В конце забыли разделить 2x на 2', 'Forgot to divide 2x by 2 at the end'),
        chain: ['linearEq'],
        steps: ['2x = 5/6 − 2/6', '2x = 3/6 = 1/2', 'x = 1/2'],
        wrongStep: 2,
      },
      {
        answers: ['7/12', '7/6'],
        mis: tri("1/3 boshqa tomonga ishorasi oʻzgartirilmay oʻtkazilgan", '1/3 перенесли в другую часть без смены знака', '1/3 was moved across without changing its sign'),
        chain: ['linearEq', 'negAdd'],
        steps: ['2x = 5/6 + 1/3', '2x = 7/6', 'x = 7/12'],
        wrongStep: 0,
      },
    ],
    defaultChain: ['linearEq', 'fracAdd', 'lcd'],
    solution: ['2x = 5/6 − 2/6', '2x = 3/6 = 1/2', 'x = 1/4'],
  },
  {
    id: 'p2', grade: 5, topicId: 'fracAdd', prompt: calc, text: '1/2 + 1/3',
    accepted: ['5/6'],
    patterns: [
      {
        answers: ['2/5'],
        mis: tri("Suratlar qoʻshilgan va maxrajlar ham qoʻshilgan", 'Сложили числители и сложили знаменатели', 'Added numerators and also added denominators'),
        chain: ['fracAdd', 'lcd'], steps: ['1/2 + 1/3 = (1+1)/(2+3)', '= 2/5'], wrongStep: 0,
      },
      {
        answers: ['2/6', '1/3'],
        mis: tri("Maxrajlar koʻpaytirilgan, lekin suratlar kengaytirilmagan", 'Знаменатели перемножили, а числители не домножили', 'Denominators multiplied, numerators not scaled'),
        chain: ['fracAdd', 'lcd'], steps: ['1/2 + 1/3 = (1+1)/(2·3)', '= 2/6'], wrongStep: 0,
      },
    ],
    defaultChain: ['fracAdd', 'lcd'],
    solution: ['1/2 = 3/6 ; 1/3 = 2/6', '3/6 + 2/6 = 5/6'],
  },
  {
    id: 'p3', grade: 6, topicId: 'negAdd', prompt: calc, text: '−7 + 4',
    accepted: ['-3'],
    patterns: [
      {
        answers: ['3'],
        mis: tri("Natija ishorasi notoʻgʻri: moduli kattaroq son manfiy edi", 'Неверный знак: число с большим модулем было отрицательным', 'Wrong sign: the number with the larger absolute value was negative'),
        chain: ['negAdd', 'negNumbers'], steps: ['−7 + 4 = 7 − 4', '= 3'], wrongStep: 0,
      },
      {
        answers: ['-11', '11'],
        mis: tri("Modullar ayirilish oʻrniga qoʻshilgan", 'Модули сложили вместо вычитания', 'Absolute values were added instead of subtracted'),
        chain: ['negAdd', 'negNumbers'], steps: ['−7 + 4 = −(7 + 4)', '= −11'], wrongStep: 0,
      },
    ],
    defaultChain: ['negAdd', 'negNumbers'],
    solution: ['|−7| = 7 ; |4| = 4', '7 − 4 = 3', '−7 + 4 = −3'],
  },
  {
    id: 'p4', grade: 6, topicId: 'negMul', prompt: calc, text: '(−3) · (−4)',
    accepted: ['12'],
    patterns: [
      {
        answers: ['-12'],
        mis: tri("Ikki manfiy sonning koʻpaytmasi musbat ekani bilinmaydi", 'Не знает, что произведение двух отрицательных — положительно', "Doesn't know that negative × negative is positive"),
        chain: ['negMul', 'negNumbers'], steps: ['(−3)·(−4) = −12'], wrongStep: 0,
      },
      {
        answers: ['-7', '7'],
        mis: tri("Koʻpaytirish oʻrniga qoʻshilgan", 'Сложили вместо умножения', 'Added instead of multiplying'),
        chain: ['negMul'], steps: ['(−3) + (−4) = −7'], wrongStep: 0,
      },
    ],
    defaultChain: ['negMul', 'negNumbers'],
    solution: ['(−) · (−) = (+)', '3 · 4 = 12'],
  },
  {
    id: 'p5', grade: 7, topicId: 'linearEq', prompt: solve, text: '3x − 5 = 2x + 7',
    accepted: ['12'],
    patterns: [
      {
        answers: ['2'],
        mis: tri("Hadlar boshqa tomonga ishorasi oʻzgartirilmay oʻtkazilgan", 'Слагаемые перенесли без смены знака', 'Terms were moved across without changing sign'),
        chain: ['linearEq', 'negAdd'], steps: ['3x − 2x = 7 − 5', 'x = 2'], wrongStep: 0,
      },
      {
        answers: ['-12'],
        mis: tri("−5 ni oʻtkazishda va manfiy sonlar bilan amalda xato", 'Ошибка при переносе −5 и в действиях с отрицательными', 'Error moving −5 and working with negatives'),
        chain: ['linearEq', 'negAdd', 'negNumbers'], steps: ['3x − 2x = −5 − 7', 'x = −12'], wrongStep: 0,
      },
      {
        answers: ['2.4', '12/5'],
        mis: tri("Oʻxshash hadlar notoʻgʻri birlashtirilgan: 3x + 2x", 'Неверно приведены подобные: 3x + 2x', 'Like terms combined wrongly: 3x + 2x'),
        chain: ['linearEq', 'likeTerms'], steps: ['3x + 2x = 7 + 5', '5x = 12', 'x = 12/5'], wrongStep: 0,
      },
    ],
    defaultChain: ['linearEq', 'likeTerms', 'negAdd'],
    solution: ['3x − 2x = 7 + 5', 'x = 12'],
  },
  {
    id: 'p6', grade: 6, topicId: 'brackets', prompt: simplify, text: '5 − (x − 3)',
    accepted: ['8-x', '-x+8'],
    patterns: [
      {
        answers: ['2-x', '-x+2'],
        mis: tri("Qavs oldidagi minus ichidagi −3 ga ta'sir qilmagan", 'Минус перед скобкой не изменил знак у −3', "The minus before the bracket didn't flip −3"),
        chain: ['brackets', 'negMul'], steps: ['5 − (x − 3) = 5 − x − 3', '= 2 − x'], wrongStep: 0,
      },
      {
        answers: ['2+x', 'x+2'],
        mis: tri('Qavs ochilmay, sonlar shunchaki ayirilgan', 'Скобки не раскрыты, числа просто вычтены', 'Brackets ignored, numbers just subtracted'),
        chain: ['brackets', 'negMul', 'negNumbers'], steps: ['5 − (x − 3) = 5 − 3 + x', '= 2 + x'], wrongStep: 0,
      },
    ],
    defaultChain: ['brackets', 'negMul'],
    solution: ['5 − (x − 3) = 5 − x + 3', '= 8 − x'],
  },
  {
    id: 'p7', grade: 7, topicId: 'powers', prompt: calc, text: '2³ · 2²',
    accepted: ['32', '2^5'],
    patterns: [
      {
        answers: ['64', '2^6'],
        mis: tri("Darajalarni koʻpaytirganda koʻrsatkichlar koʻpaytirilgan (qoʻshilishi kerak)", 'При умножении степеней показатели перемножили (нужно сложить)', 'Exponents were multiplied instead of added'),
        chain: ['powers'], steps: ['2³ · 2² = 2⁶', '= 64'], wrongStep: 0,
      },
      {
        answers: ['4^5', '1024'],
        mis: tri("Asoslar ham koʻpaytirib yuborilgan", 'Основания тоже перемножили', 'The bases were multiplied too'),
        chain: ['powers'], steps: ['2³ · 2² = 4⁵'], wrongStep: 0,
      },
      {
        answers: ['24'],
        mis: tri("Daraja oddiy koʻpaytma deb tushunilgan: 2³ = 2 · 3", 'Степень понята как произведение: 2³ = 2 · 3', 'Power read as a product: 2³ = 2 · 3'),
        chain: ['powers'], steps: ['2³ = 6 ; 2² = 4', '6 · 4 = 24'], wrongStep: 0,
      },
    ],
    defaultChain: ['powers'],
    solution: ['2³ · 2² = 2³⁺²', '= 2⁵ = 32'],
  },
  {
    id: 'p8', grade: 7, topicId: 'shortMult', prompt: tri('Qavslarni oching', 'Раскройте скобки', 'Expand'), text: '(a + 3)²',
    accepted: ['a^2+6a+9', '9+6a+a^2'],
    patterns: [
      {
        answers: ['a^2+9'],
        mis: tri("(a + b)² = a² + b² deb oʻylangan — 2ab hadi tushib qolgan", 'Считает, что (a + b)² = a² + b² — потерян член 2ab', 'Thinks (a + b)² = a² + b² — the 2ab term is missing'),
        chain: ['shortMult', 'polyMul'], steps: ['(a + 3)² = a² + 3²', '= a² + 9'], wrongStep: 0,
      },
      {
        answers: ['a^2+3a+9'],
        mis: tri("Oʻrta had 2ab oʻrniga ab olingan", 'Средний член взят как ab вместо 2ab', 'Middle term taken as ab instead of 2ab'),
        chain: ['shortMult', 'polyMul'], steps: ['(a + 3)² = a² + 3a + 9'], wrongStep: 0,
      },
      {
        answers: ['2a+6'],
        mis: tri("Kvadrat 2 ga koʻpaytirish deb tushunilgan", 'Квадрат понят как умножение на 2', 'Squaring read as multiplying by 2'),
        chain: ['shortMult', 'powers'], steps: ['(a + 3)² = 2(a + 3)', '= 2a + 6'], wrongStep: 0,
      },
    ],
    defaultChain: ['shortMult', 'polyMul', 'brackets'],
    solution: ['(a + 3)(a + 3)', '= a² + 3a + 3a + 9', '= a² + 6a + 9'],
  },
  {
    id: 'p9', grade: 5, topicId: 'percent', prompt: tri("600 000 soʻmning 15% ini toping", 'Найдите 15% от 600 000 сумов', "Find 15% of 600,000 soʻm"), text: '15% · 600 000',
    accepted: ['90000'],
    patterns: [
      {
        answers: ['9000'],
        mis: tri("Foizni oʻnli kasrga aylantirishda xona xatosi: 15% = 0,015", 'Ошибка разряда при переводе: 15% = 0,015', 'Place-value error converting: 15% = 0.015'),
        chain: ['percent', 'decimals'], steps: ['15% = 0,015', '600 000 · 0,015 = 9 000'], wrongStep: 0,
      },
      {
        answers: ['40000'],
        mis: tri("Foiz boʻlish deb tushunilgan: 600 000 : 15", 'Процент понят как деление: 600 000 : 15', 'Percent read as division: 600,000 : 15'),
        chain: ['percent', 'fracMeaning'], steps: ['600 000 : 15 = 40 000'], wrongStep: 0,
      },
      {
        answers: ['9000000'],
        mis: tri("15% oʻrniga 15 ga koʻpaytirilgan", 'Умножили на 15 вместо 15%', 'Multiplied by 15 instead of 15%'),
        chain: ['percent', 'decimals'], steps: ['600 000 · 15 = 9 000 000'], wrongStep: 0,
      },
    ],
    defaultChain: ['percent', 'decimals'],
    solution: ['15% = 0,15', '600 000 · 0,15 = 90 000'],
  },
  {
    id: 'p10', grade: 5, topicId: 'decimals', prompt: calc, text: '0,3 · 0,2',
    accepted: ['0.06', '.06'],
    patterns: [
      {
        answers: ['0.6'],
        mis: tri("Verguldan keyingi xonalar soni notoʻgʻri sanalgan", 'Неверно посчитано число знаков после запятой', 'Counted the decimal places wrongly'),
        chain: ['decimals', 'fracMeaning'], steps: ['3 · 2 = 6', '0,3 · 0,2 = 0,6'], wrongStep: 1,
      },
      {
        answers: ['0.5'],
        mis: tri("Koʻpaytirish oʻrniga qoʻshilgan", 'Сложили вместо умножения', 'Added instead of multiplying'),
        chain: ['decimals'], steps: ['0,3 + 0,2 = 0,5'], wrongStep: 0,
      },
      {
        answers: ['6'],
        mis: tri('Vergul butunlay tashlab yuborilgan', 'Запятую просто отбросили', 'The decimal point was dropped'),
        chain: ['decimals', 'fracMeaning'], steps: ['3 · 2 = 6'], wrongStep: 0,
      },
    ],
    defaultChain: ['decimals', 'fracMeaning'],
    solution: ['0,3 · 0,2 = 3/10 · 2/10', '= 6/100 = 0,06'],
  },
  {
    id: 'p11', grade: 5, topicId: 'fracSimplify', prompt: tri('Kasrni oxirigacha qisqartiring', 'Сократите дробь до конца', 'Simplify the fraction fully'), text: '12/18',
    accepted: ['2/3'],
    patterns: [
      {
        answers: ['6/9', '4/6'],
        mis: tri('Kasr oxirigacha qisqartirilmagan — EKUB topilmagan', 'Дробь сокращена не до конца — НОД не найден', 'Not fully simplified — the GCD was not found'),
        chain: ['fracSimplify', 'gcd'], steps: ['12/18 = 6/9'], wrongStep: 0,
      },
      {
        answers: ['3/2', '1.5'],
        mis: tri("Surat va maxraj oʻrni almashib ketgan", 'Перепутаны числитель и знаменатель', 'Numerator and denominator were swapped'),
        chain: ['fracSimplify', 'fracMeaning'], steps: ['12/18 → 18/12 = 3/2'], wrongStep: 0,
      },
      {
        answers: ['1/6'],
        mis: tri("Qisqartirish oʻrniga ayirilgan: 18 − 12 = 6", 'Вместо сокращения вычли: 18 − 12 = 6', 'Subtracted instead of simplifying: 18 − 12 = 6'),
        chain: ['fracSimplify', 'fracMeaning'], steps: ['18 − 12 = 6', '= 1/6'], wrongStep: 0,
      },
    ],
    defaultChain: ['fracSimplify', 'gcd'],
    solution: ['12 = 6 · 2 ; 18 = 6 · 3', '12/18 = 2/3'],
  },
  {
    id: 'p12', grade: 6, topicId: 'proportion', prompt: solve, text: 'x/4 = 9/12',
    accepted: ['3'],
    patterns: [
      {
        answers: ['1'],
        mis: tri("Proporsiya koʻpaytirish emas, ayirish deb tushunilgan: 12 − 9 = 3, 4 − 3 = 1", 'Пропорцию решали вычитанием: 12 − 9 = 3, 4 − 3 = 1', 'Proportion treated additively: 12 − 9 = 3, 4 − 3 = 1'),
        chain: ['proportion', 'fracMeaning'], steps: ['12 − 9 = 3', 'x = 4 − 3 = 1'], wrongStep: 0,
      },
      {
        answers: ['27', '16'],
        mis: tri("Chetki va oʻrta hadlar adashtirilgan", 'Перепутаны крайние и средние члены', 'Mixed up the means and extremes'),
        chain: ['proportion', 'fracMul'], steps: ['x = 9 · 12 : 4 = 27'], wrongStep: 0,
      },
    ],
    defaultChain: ['proportion', 'fracMeaning'],
    solution: ['x · 12 = 4 · 9', 'x = 36 : 12 = 3'],
  },
  {
    id: 'p13', grade: 6, topicId: 'likeTerms', prompt: simplify, text: '3a + 2b − a + 4b',
    accepted: ['2a+6b', '6b+2a'],
    patterns: [
      {
        answers: ['8ab'],
        mis: tri('Har xil hadlar (a va b) birlashtirib yuborilgan', 'Объединены разные слагаемые (a и b)', 'Unlike terms (a and b) were combined'),
        chain: ['likeTerms'], steps: ['3 + 2 − 1 + 4 = 8', '= 8ab'], wrongStep: 0,
      },
      {
        answers: ['4a+6b'],
        mis: tri("−a dagi minus ishorasi e'tiborga olinmagan", 'Не учтён минус перед a', 'The minus before a was ignored'),
        chain: ['likeTerms', 'negAdd'], steps: ['3a + a = 4a', '2b + 4b = 6b'], wrongStep: 0,
      },
      {
        answers: ['2a+2b'],
        mis: tri("b li hadlar qoʻshilish oʻrniga ayirilgan", 'Слагаемые с b вычтены вместо сложения', 'The b terms were subtracted instead of added'),
        chain: ['likeTerms', 'negAdd'], steps: ['3a − a = 2a', '4b − 2b = 2b'], wrongStep: 1,
      },
    ],
    defaultChain: ['likeTerms', 'negAdd'],
    solution: ['3a − a = 2a', '2b + 4b = 6b', '= 2a + 6b'],
  },
  {
    id: 'p14', grade: 6, topicId: 'fracMul', prompt: calc, text: '2/3 : 4/5',
    accepted: ['5/6', '10/12'],
    patterns: [
      {
        answers: ['8/15'],
        mis: tri("Boʻlish oʻrniga koʻpaytirilgan", 'Умножили вместо деления', 'Multiplied instead of dividing'),
        chain: ['fracMul'], steps: ['2/3 : 4/5 = (2·4)/(3·5)', '= 8/15'], wrongStep: 0,
      },
      {
        answers: ['6/5', '12/10'],
        mis: tri("Ikkinchi emas, birinchi kasr agʻdarilgan", 'Перевернули первую дробь, а не вторую', 'Flipped the first fraction instead of the second'),
        chain: ['fracMul', 'fracMeaning'], steps: ['3/2 · 4/5 = 12/10', '= 6/5'], wrongStep: 0,
      },
    ],
    defaultChain: ['fracMul', 'fracSimplify'],
    solution: ['2/3 : 4/5 = 2/3 · 5/4', '= 10/12 = 5/6'],
  },
  {
    id: 'p15', grade: 5, topicId: 'lcm', prompt: calc, text: tri('EKUK(4, 6)', 'НОК(4, 6)', 'LCM(4, 6)'),
    accepted: ['12'],
    patterns: [
      {
        answers: ['24'],
        mis: tri("Sonlar shunchaki koʻpaytirilgan — bu har doim ham eng kichik emas", 'Числа просто перемножили — это не всегда наименьшее', 'Just multiplied the numbers — not always the least'),
        chain: ['lcm'], steps: ['4 · 6 = 24'], wrongStep: 0,
      },
      {
        answers: ['2'],
        mis: tri('EKUK va EKUB adashtirilgan', 'Перепутаны НОК и НОД', 'Confused LCM with GCD'),
        chain: ['lcm', 'gcd'], steps: ['4 = 2·2 ; 6 = 2·3', '= 2'], wrongStep: 1,
      },
    ],
    defaultChain: ['lcm'],
    solution: ['4 → 4, 8, 12', '6 → 6, 12', '= 12'],
  },
  {
    id: 'p16', grade: 8, topicId: 'quadEq', prompt: solve, text: 'x² = 49',
    accepted: ['±7', '7;-7', '-7;7', '7,-7', '-7,7', '7va-7', '7и-7', '7and-7', '-7va7'],
    patterns: [
      {
        answers: ['7'],
        mis: tri("Ikkinchi (manfiy) ildiz yoʻqotilgan: (−7)² ham 49", 'Потерян второй (отрицательный) корень: (−7)² тоже 49', 'Lost the negative root: (−7)² is also 49'),
        chain: ['quadEq', 'sqrt', 'negMul'], steps: ['x = √49', 'x = 7'], wrongStep: 0,
      },
      {
        answers: ['24.5', '49/2'],
        mis: tri("Kvadrat 2 ga koʻpaytirish deb tushunilgan", 'Квадрат понят как умножение на 2', 'Squaring read as multiplying by 2'),
        chain: ['quadEq', 'sqrt', 'powers'], steps: ['2x = 49', 'x = 24,5'], wrongStep: 0,
      },
    ],
    defaultChain: ['quadEq', 'sqrt'],
    solution: ['x = ±√49', 'x₁ = 7 ; x₂ = −7'],
  },
  {
    id: 'p17', grade: 7, topicId: 'wordEq',
    prompt: tri("Ali 3 ta daftar va 5 000 soʻmlik ruchka uchun 23 000 soʻm toʻladi. Bitta daftar necha soʻm?", 'Али заплатил 23 000 сумов за 3 тетради и ручку за 5 000. Сколько стоит тетрадь?', "Ali paid 23,000 soʻm for 3 notebooks and a 5,000 soʻm pen. How much is one notebook?"),
    text: '3x + 5 000 = 23 000',
    accepted: ['6000'],
    patterns: [
      {
        answers: ['18000'],
        mis: tri("Tenglama toʻgʻri tuzilgan, lekin oxirida 3 ga boʻlish unutilgan", 'Уравнение верное, но в конце забыли разделить на 3', 'Equation was right, but forgot to divide by 3'),
        chain: ['wordEq', 'linearEq'], steps: ['3x = 23 000 − 5 000', 'x = 18 000'], wrongStep: 1,
      },
      {
        answers: ['28000', '9333', '9333.33', '9333.3'],
        mis: tri("5 000 ayirilish oʻrniga qoʻshilgan", '5 000 прибавили вместо вычитания', 'Added 5,000 instead of subtracting'),
        chain: ['wordEq', 'linearEq', 'negAdd'], steps: ['3x = 23 000 + 5 000', '3x = 28 000'], wrongStep: 0,
      },
      {
        answers: ['7667', '7666', '7666.67'],
        mis: tri('Ruchka narxi hisobga olinmagan', 'Цена ручки не учтена', 'The pen price was ignored'),
        chain: ['wordEq'], steps: ['3x = 23 000', 'x ≈ 7 667'], wrongStep: 0,
      },
    ],
    defaultChain: ['wordEq', 'linearEq'],
    solution: ['3x = 23 000 − 5 000 = 18 000', 'x = 6 000'],
  },
];

export const PROBLEM: Record<string, Problem> = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
