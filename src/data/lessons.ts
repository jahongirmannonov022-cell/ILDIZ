// 5-minute micro-lessons for every topic the Time Machine can land on.
import { tri, Text, Tri } from '../lib/types';

export interface Lesson {
  idea: Tri;
  analogy: Tri;
  rule: Tri;
  example: { task: Text; steps: string[] };
  practice: { task: Text; answers: string[]; hints: Tri[] };
}

export const LESSONS: Record<string, Lesson> = {
  lcd: {
    idea: tri("Kasrlarni qoʻshish uchun boʻlaklar bir xil oʻlchamda boʻlishi kerak.", 'Чтобы сложить дроби, доли должны быть одного размера.', 'To add fractions, the pieces must be the same size.'),
    analogy: tri("Bir nonni 2 ga, ikkinchisini 3 ga boʻldik. Boʻlaklar har xil — ularni birga sanab boʻlmaydi. Ikkalasini 6 boʻlakka kessak, hammasi teng boʻladi.", 'Одну лепёшку разрезали на 2 части, другую — на 3. Куски разные — их нельзя сложить. Разрежем обе на 6 — все куски равны.', 'One non bread is cut into 2 pieces, another into 3. The pieces differ, so you cannot count them together. Cut both into 6 and every piece is equal.'),
    rule: tri('Maxrajlarning EKUKini toping va har bir kasrni shu maxrajga keltiring.', 'Найдите НОК знаменателей и приведите каждую дробь к нему.', 'Find the LCM of the denominators and rewrite each fraction with it.'),
    example: { task: '1/2 + 1/3', steps: ['2 · 3 = 6', '1/2 = 3/6', '1/3 = 2/6', '3/6 + 2/6 = 5/6'] },
    practice: {
      task: '1/4 + 1/6', answers: ['5/12'],
      hints: [
        tri("4 ga ham, 6 ga ham boʻlinadigan eng kichik son qaysi?", 'Какое наименьшее число делится и на 4, и на 6?', 'What is the smallest number divisible by both 4 and 6?'),
        tri('Bu 12. Endi: 1/4 = ?/12 va 1/6 = ?/12', 'Это 12. Теперь: 1/4 = ?/12 и 1/6 = ?/12', "It's 12. Now: 1/4 = ?/12 and 1/6 = ?/12"),
        tri('3/12 + 2/12 = ?', '3/12 + 2/12 = ?', '3/12 + 2/12 = ?'),
      ],
    },
  },
  fracAdd: {
    idea: tri("Maxrajlar bir xil boʻlsa, faqat suratlar qoʻshiladi — maxraj oʻzgarmaydi.", 'Если знаменатели равны, складываются только числители — знаменатель не меняется.', 'With equal denominators, only numerators are added — the denominator stays.'),
    analogy: tri("3 boʻlak pitsa + 2 boʻlak pitsa = 5 boʻlak. Boʻlak oʻlchami (maxraj) oʻzgarmaydi.", '3 куска пиццы + 2 куска = 5 кусков. Размер куска (знаменатель) не меняется.', "3 slices + 2 slices = 5 slices. The slice size (denominator) doesn't change."),
    rule: tri("a/c + b/c = (a + b)/c. Maxrajlar har xil boʻlsa — avval umumiy maxraj.", 'a/c + b/c = (a + b)/c. Если знаменатели разные — сначала общий знаменатель.', 'a/c + b/c = (a + b)/c. Different denominators — common denominator first.'),
    example: { task: '2/7 + 3/7', steps: ['2 + 3 = 5', '= 5/7'] },
    practice: {
      task: '5/6 − 1/3', answers: ['1/2', '3/6'],
      hints: [
        tri('Maxrajlar har xil. 1/3 ni oltidan birlarga aylantiring.', 'Знаменатели разные. Переведите 1/3 в шестые доли.', 'Different denominators. Turn 1/3 into sixths.'),
        tri('1/3 = 2/6', '1/3 = 2/6', '1/3 = 2/6'),
        tri("5/6 − 2/6 = 3/6. Qisqartiring!", '5/6 − 2/6 = 3/6. Сократите!', '5/6 − 2/6 = 3/6. Simplify!'),
      ],
    },
  },
  linearEq: {
    idea: tri("Tenglama — tarozi. Ikki pallaga bir xil amal qilsangiz, muvozanat buzilmaydi.", 'Уравнение — весы. Делайте одно и то же с обеими чашами — равновесие сохранится.', 'An equation is a balance. Do the same to both sides and it stays balanced.'),
    analogy: tri("Bozordagi tarozi: bir pallasidan 5 kg olsangiz, ikkinchisidan ham 5 kg oling.", 'Весы на базаре: сняли 5 кг с одной чаши — снимите и с другой.', 'A bazaar scale: take 5 kg off one side, take 5 kg off the other.'),
    rule: tri("Hadni boshqa tomonga oʻtkazganda ishorasini oʻzgartiring. Oxirida x oldidagi songa boʻling.", 'При переносе слагаемого меняйте знак. В конце делите на коэффициент при x.', 'Change the sign when moving a term across. Finally divide by the coefficient of x.'),
    example: { task: '3x + 4 = 19', steps: ['3x = 19 − 4', '3x = 15', 'x = 15 : 3', 'x = 5'] },
    practice: {
      task: '5x − 3 = 2x + 9', answers: ['4'],
      hints: [
        tri("x li hadlarni chapga, sonlarni oʻngga yigʻing.", 'Соберите x слева, числа справа.', 'Collect x terms on the left, numbers on the right.'),
        tri('5x − 2x = 9 + 3', '5x − 2x = 9 + 3', '5x − 2x = 9 + 3'),
        tri('3x = 12  →  x = ?', '3x = 12  →  x = ?', '3x = 12  →  x = ?'),
      ],
    },
  },
  negAdd: {
    idea: tri('Manfiy son — qarz, musbat son — cho\'ntagingizdagi pul.', 'Отрицательное число — долг, положительное — деньги в кармане.', 'A negative number is a debt; a positive one is money in your pocket.'),
    analogy: tri("Sizda 4 000 soʻm bor, lekin 7 000 soʻm qarzingiz bor. Hisob-kitobdan keyin hali 3 000 soʻm qarzsiz: −7 + 4 = −3.", 'У вас 4 000 сумов, но долг 7 000. После расчёта вы всё ещё должны 3 000: −7 + 4 = −3.', "You have 4,000 soʻm but owe 7,000. After paying you still owe 3,000: −7 + 4 = −3."),
    rule: tri("Ishoralar har xil boʻlsa: modullarni ayiring va moduli kattaroq sonning ishorasini qoʻying.", 'Знаки разные: вычтите модули и поставьте знак числа с большим модулем.', 'Different signs: subtract absolute values and keep the sign of the larger one.'),
    example: { task: '−9 + 5', steps: ['|−9| = 9 ; |5| = 5', '9 − 5 = 4', '−9 + 5 = −4'] },
    practice: {
      task: '−6 + 10', answers: ['4'],
      hints: [
        tri('Qaysi sonning moduli kattaroq: 6 yoki 10?', 'У какого числа модуль больше: 6 или 10?', 'Which has the larger absolute value: 6 or 10?'),
        tri("10 katta va u musbat — javob ham musbat.", '10 больше и оно положительное — ответ положительный.', '10 is larger and positive — so the answer is positive.'),
        tri('10 − 6 = ?', '10 − 6 = ?', '10 − 6 = ?'),
      ],
    },
  },
  negNumbers: {
    idea: tri("Son oʻqida noldan chapdagi sonlar manfiy. Chaproqdagi son har doim kichikroq.", 'На числовой прямой левее нуля — отрицательные числа. Левее — значит меньше.', 'Left of zero on the number line are negatives. Further left always means smaller.'),
    analogy: tri('Termometr: −5°C, −2°C dan sovuqroq — demak, kichikroq.', 'Термометр: −5°C холоднее, чем −2°C, значит меньше.', 'A thermometer: −5°C is colder than −2°C, so it is smaller.'),
    rule: tri("|a| — sonning noldan masofasi, u doim musbat yoki nol. −(−a) = a.", '|a| — расстояние до нуля, оно всегда ≥ 0. −(−a) = a.', '|a| is the distance from zero, always ≥ 0. −(−a) = a.'),
    example: { task: '−5 ? −2', steps: ['… −5 … −2 … 0 …', '−5 < −2'] },
    practice: {
      task: '−(−8) + 2', answers: ['10'],
      hints: [
        tri("Minus va minus — plyus.", 'Минус на минус — плюс.', 'Minus of a minus is a plus.'),
        tri('−(−8) = 8', '−(−8) = 8', '−(−8) = 8'),
        tri('8 + 2 = ?', '8 + 2 = ?', '8 + 2 = ?'),
      ],
    },
  },
  negMul: {
    idea: tri("Koʻpaytirishda ishora alohida, son alohida hisoblanadi.", 'При умножении знак и число считаются отдельно.', 'When multiplying, handle the sign and the number separately.'),
    analogy: tri("\"Dushmanning dushmani — doʻst\": (−) · (−) = (+).", '«Враг моего врага — друг»: (−) · (−) = (+).', '"The enemy of my enemy is a friend": (−) · (−) = (+).'),
    rule: tri("(+)(+) = +,  (−)(−) = +,  (+)(−) = −", '(+)(+) = +,  (−)(−) = +,  (+)(−) = −', '(+)(+) = +,  (−)(−) = +,  (+)(−) = −'),
    example: { task: '(−6) · (−2)', steps: ['(−) · (−) = (+)', '6 · 2 = 12', '= 12'] },
    practice: {
      task: '(−4) · 5', answers: ['-20'],
      hints: [
        tri('Ishoralar har xil: (−) · (+) = ?', 'Знаки разные: (−) · (+) = ?', 'Different signs: (−) · (+) = ?'),
        tri("Natija manfiy boʻladi.", 'Результат будет отрицательным.', 'The result is negative.'),
        tri("4 · 5 = 20. Ishorasi bilan yozing.", '4 · 5 = 20. Запишите со знаком.', '4 · 5 = 20. Write it with the sign.'),
      ],
    },
  },
  brackets: {
    idea: tri("Qavs oldidagi minus — qavs ichidagi HAR BIR hadga \"teskari\" degan buyruq.", 'Минус перед скобкой — команда «наоборот» для КАЖДОГО слагаемого внутри.', 'A minus before brackets flips EVERY term inside.'),
    analogy: tri("Doʻkonga \"qaytarish\": savatdagi har bir mahsulot qaytariladi, faqat birinchisi emas.", 'Возврат в магазин: возвращается каждый товар в корзине, а не только первый.', 'A store return: every item in the basket goes back, not just the first.'),
    rule: tri("−(a − b) = −a + b. Qavs oldidagi son ichidagi har bir hadga koʻpaytiriladi.", '−(a − b) = −a + b. Множитель перед скобкой умножается на каждое слагаемое.', '−(a − b) = −a + b. The factor in front multiplies every term.'),
    example: { task: '7 − (x − 2)', steps: ['7 − x + 2', '= 9 − x'] },
    practice: {
      task: '10 − (x + 4)', answers: ['6-x', '-x+6'],
      hints: [
        tri("Minus qavs ichidagi ikkala hadga ham ta'sir qiladi.", 'Минус действует на оба слагаемых в скобке.', 'The minus affects both terms in the bracket.'),
        tri('10 − x − 4', '10 − x − 4', '10 − x − 4'),
        tri('10 − 4 = ?  Javob: ? − x', '10 − 4 = ?  Ответ: ? − x', '10 − 4 = ?  Answer: ? − x'),
      ],
    },
  },
  likeTerms: {
    idea: tri("Faqat harfi bir xil boʻlgan hadlarni qoʻshish mumkin.", 'Складывать можно только слагаемые с одинаковой буквенной частью.', 'Only terms with the same letters can be added.'),
    analogy: tri("3 ta olma + 2 ta nok ≠ 5 ta \"olmanok\". Olmalar alohida, noklar alohida.", '3 яблока + 2 груши ≠ 5 «яблогруш». Яблоки отдельно, груши отдельно.', '3 apples + 2 pears ≠ 5 "applepears". Apples apart, pears apart.'),
    rule: tri("Harfi bir xil hadlarning koeffitsiyentlarini ishorasi bilan qoʻshing.", 'Сложите коэффициенты подобных слагаемых с их знаками.', 'Add the coefficients of like terms, keeping their signs.'),
    example: { task: '5x + 3y − 2x + y', steps: ['5x − 2x = 3x', '3y + y = 4y', '= 3x + 4y'] },
    practice: {
      task: '7a − 3b − 2a + 5b', answers: ['5a+2b', '2b+5a'],
      hints: [
        tri('a lar: 7a va −2a', 'Слагаемые с a: 7a и −2a', 'The a terms: 7a and −2a'),
        tri('7a − 2a = 5a', '7a − 2a = 5a', '7a − 2a = 5a'),
        tri('b lar: −3b + 5b = ?', 'Слагаемые с b: −3b + 5b = ?', 'The b terms: −3b + 5b = ?'),
      ],
    },
  },
  powers: {
    idea: tri("Daraja — takroriy koʻpaytirish: 2³ = 2 · 2 · 2.", 'Степень — повторное умножение: 2³ = 2 · 2 · 2.', 'A power is repeated multiplication: 2³ = 2 · 2 · 2.'),
    analogy: tri("Bitta bakteriya har soatda 2 ga boʻlinadi: 3 soatdan keyin 2³ = 8 ta.", 'Бактерия делится надвое каждый час: через 3 часа их 2³ = 8.', 'A bacterium splits in two every hour: after 3 hours there are 2³ = 8.'),
    rule: tri("aᵐ · aⁿ = aᵐ⁺ⁿ,  (aᵐ)ⁿ = aᵐⁿ,  a⁰ = 1", 'aᵐ · aⁿ = aᵐ⁺ⁿ,  (aᵐ)ⁿ = aᵐⁿ,  a⁰ = 1', 'aᵐ · aⁿ = aᵐ⁺ⁿ,  (aᵐ)ⁿ = aᵐⁿ,  a⁰ = 1'),
    example: { task: '3² · 3³', steps: ['3² · 3³ = 3²⁺³', '= 3⁵', '= 243'] },
    practice: {
      task: '5² · 5', answers: ['125', '5^3'],
      hints: [
        tri('5 = 5¹', '5 = 5¹', '5 = 5¹'),
        tri("Koʻrsatkichlarni qoʻshing: 2 + 1", 'Сложите показатели: 2 + 1', 'Add the exponents: 2 + 1'),
        tri('5³ = 5 · 5 · 5 = ?', '5³ = 5 · 5 · 5 = ?', '5³ = 5 · 5 · 5 = ?'),
      ],
    },
  },
  polyMul: {
    idea: tri("Birinchi qavsdagi HAR BIR had ikkinchi qavsdagi HAR BIR hadga koʻpaytiriladi.", 'КАЖДОЕ слагаемое первой скобки умножается на КАЖДОЕ слагаемое второй.', 'EVERY term in the first bracket multiplies EVERY term in the second.'),
    analogy: tri("Toʻyda 2 mehmon 2 mezbon bilan soʻrashadi: 2 × 2 = 4 ta qoʻl berish.", 'На свадьбе 2 гостя здороваются с 2 хозяевами: 2 × 2 = 4 рукопожатия.', 'At a wedding 2 guests greet 2 hosts: 2 × 2 = 4 handshakes.'),
    rule: tri('(a + b)(c + d) = ac + ad + bc + bd', '(a + b)(c + d) = ac + ad + bc + bd', '(a + b)(c + d) = ac + ad + bc + bd'),
    example: { task: '(x + 2)(x + 5)', steps: ['x·x + x·5 + 2·x + 2·5', '= x² + 5x + 2x + 10', '= x² + 7x + 10'] },
    practice: {
      task: '(x + 1)(x + 4)', answers: ['x^2+5x+4'],
      hints: [
        tri("4 ta koʻpaytma boʻladi.", 'Получится 4 произведения.', 'There will be 4 products.'),
        tri('x² + 4x + x + 4', 'x² + 4x + x + 4', 'x² + 4x + x + 4'),
        tri("Oʻxshash hadlarni birlashtiring: 4x + x", 'Приведите подобные: 4x + x', 'Combine like terms: 4x + x'),
      ],
    },
  },
  shortMult: {
    idea: tri("(a + b)² — bu (a + b)(a + b). U faqat a² + b² emas!", '(a + b)² — это (a + b)(a + b), а не просто a² + b²!', '(a + b)² means (a + b)(a + b) — not just a² + b²!'),
    analogy: tri("Tomoni (a + b) boʻlgan kvadrat yer: a² va b² dan tashqari yana ikkita a·b toʻrtburchak bor.", 'Квадратный участок со стороной (a + b): кроме a² и b² есть ещё два прямоугольника a·b.', 'A square plot with side (a + b): besides a² and b² there are two a·b rectangles.'),
    rule: tri('(a + b)² = a² + 2ab + b²;  (a − b)² = a² − 2ab + b²;  (a − b)(a + b) = a² − b²', '(a + b)² = a² + 2ab + b²;  (a − b)² = a² − 2ab + b²;  (a − b)(a + b) = a² − b²', '(a + b)² = a² + 2ab + b²;  (a − b)² = a² − 2ab + b²;  (a − b)(a + b) = a² − b²'),
    example: { task: '(x + 4)²', steps: ['x² + 2·x·4 + 4²', '= x² + 8x + 16'] },
    practice: {
      task: '(y + 5)²', answers: ['y^2+10y+25'],
      hints: [
        tri('a = y, b = 5', 'a = y, b = 5', 'a = y, b = 5'),
        tri('2ab = 2 · y · 5 = 10y', '2ab = 2 · y · 5 = 10y', '2ab = 2 · y · 5 = 10y'),
        tri('y² + 10y + ?', 'y² + 10y + ?', 'y² + 10y + ?'),
      ],
    },
  },
  decimals: {
    idea: tri("Oʻnli kasr — maxraji 10, 100, 1000 boʻlgan kasr.", 'Десятичная дробь — дробь со знаменателем 10, 100, 1000.', 'A decimal is a fraction with denominator 10, 100, 1000.'),
    analogy: tri("0,3 kg = 300 g. Vergul — butunni oʻndan bir boʻlaklardan ajratadi.", '0,3 кг = 300 г. Запятая отделяет целое от десятых долей.', '0.3 kg = 300 g. The point separates wholes from tenths.'),
    rule: tri("Vergulsiz koʻpaytiring, soʻng ikkala sondagi verguldan keyingi xonalar sonini qoʻshib, vergul qoʻying.", 'Умножьте без запятых, затем отделите столько знаков, сколько их в обоих множителях вместе.', 'Multiply without points, then place the point using the total number of decimal places.'),
    example: { task: '0,4 · 0,3', steps: ['4 · 3 = 12', '1 + 1 = 2', '= 0,12'] },
    practice: {
      task: '0,5 · 0,7', answers: ['0.35', '.35'],
      hints: [
        tri("Avval vergulsiz: 5 · 7", 'Сначала без запятых: 5 · 7', 'First without points: 5 · 7'),
        tri('35', '35', '35'),
        tri("Jami 2 xona → 0,??", 'Всего 2 знака → 0,??', '2 decimal places total → 0.??'),
      ],
    },
  },
  percent: {
    idea: tri('Foiz — yuzdan bir qism: 1% = 1/100.', 'Процент — сотая часть: 1% = 1/100.', 'A percent is one hundredth: 1% = 1/100.'),
    analogy: tri("Doʻkonda 20% chegirma: 100 000 soʻmlik kurtka 20 000 soʻm arzonlashadi.", "Скидка 20%: куртка за 100 000 сумов дешевеет на 20 000.", "A 20% sale: a 100,000 soʻm jacket gets 20,000 cheaper."),
    rule: tri('a ning p% i = a · p / 100', 'p% от a = a · p / 100', 'p% of a = a · p / 100'),
    example: { task: '20% · 300 000', steps: ['20% = 0,2', '300 000 · 0,2 = 60 000'] },
    practice: {
      task: '10% · 250 000', answers: ['25000'],
      hints: [
        tri('10% = 0,1', '10% = 0,1', '10% = 0.1'),
        tri("10% topish uchun 10 ga boʻlish kifoya.", 'Чтобы найти 10%, достаточно разделить на 10.', 'To find 10%, just divide by 10.'),
        tri('250 000 : 10 = ?', '250 000 : 10 = ?', '250,000 : 10 = ?'),
      ],
    },
  },
  gcd: {
    idea: tri("EKUB — ikkala sonni ham qoldiqsiz boʻladigan eng katta son.", 'НОД — наибольшее число, на которое делятся оба числа.', 'The GCD is the largest number that divides both numbers.'),
    analogy: tri("12 ta olma va 18 ta nokni eng koʻpi bilan nechta bolaga teng boʻlish mumkin? 6 taga.", '12 яблок и 18 груш поровну можно раздать максимум 6 детям.', '12 apples and 18 pears can be shared equally among at most 6 kids.'),
    rule: tri("Sonlarni tub koʻpaytuvchilarga ajrating va umumiylarini koʻpaytiring.", 'Разложите на простые множители и перемножьте общие.', 'Factor into primes and multiply the common factors.'),
    example: { task: tri('EKUB(12, 18)', 'НОД(12, 18)', 'GCD(12, 18)'), steps: ['12 = 2 · 2 · 3', '18 = 2 · 3 · 3', '2 · 3 = 6'] },
    practice: {
      task: tri('EKUB(16, 24)', 'НОД(16, 24)', 'GCD(16, 24)'), answers: ['8'],
      hints: [
        tri("16 ning boʻluvchilari: 1, 2, 4, 8, 16", 'Делители 16: 1, 2, 4, 8, 16', 'Divisors of 16: 1, 2, 4, 8, 16'),
        tri("Ulardan qaysilari 24 ni ham boʻladi?", 'Какие из них делят и 24?', 'Which of them also divide 24?'),
        tri('Eng kattasini tanlang.', 'Выберите наибольший.', 'Pick the largest.'),
      ],
    },
  },
  lcm: {
    idea: tri("EKUK — ikkala songa ham boʻlinadigan eng kichik son.", 'НОК — наименьшее число, которое делится на оба числа.', 'The LCM is the smallest number divisible by both.'),
    analogy: tri("Avtobus har 4 daqiqada, tramvay har 6 daqiqada keladi. Ikkalasi birga 12 daqiqadan keyin keladi.", 'Автобус ходит раз в 4 минуты, трамвай — раз в 6. Вместе они придут через 12 минут.', 'A bus comes every 4 minutes, a tram every 6. They arrive together after 12 minutes.'),
    rule: tri("Kattaroq sonning karralilarini yozing va kichigiga boʻlinadiganini toping.", 'Выписывайте кратные большего числа, пока одно не разделится на меньшее.', 'List multiples of the larger number until one is divisible by the smaller.'),
    example: { task: tri('EKUK(4, 6)', 'НОК(4, 6)', 'LCM(4, 6)'), steps: ['6, 12', '12 : 4 = 3 ✓', '= 12'] },
    practice: {
      task: tri('EKUK(6, 8)', 'НОК(6, 8)', 'LCM(6, 8)'), answers: ['24'],
      hints: [
        tri('8 ning karralilari: 8, 16, 24…', 'Кратные 8: 8, 16, 24…', 'Multiples of 8: 8, 16, 24…'),
        tri("Qaysi biri 6 ga boʻlinadi?", 'Какое из них делится на 6?', 'Which one is divisible by 6?'),
        tri('16 : 6 — yo\'q. 24 : 6 — ?', '16 : 6 — нет. 24 : 6 — ?', '16 : 6 — no. 24 : 6 — ?'),
      ],
    },
  },
  fracSimplify: {
    idea: tri("Qisqartirish — kasrni oʻzgartirmay, kichikroq sonlar bilan yozish.", 'Сокращение — запись той же дроби меньшими числами.', 'Simplifying writes the same fraction with smaller numbers.'),
    analogy: tri("8 boʻlakdan 4 tasi — yarim pitsa. 4/8 = 1/2.", '4 куска из 8 — половина пиццы. 4/8 = 1/2.', '4 slices out of 8 is half a pizza. 4/8 = 1/2.'),
    rule: tri("Surat va maxrajni ularning EKUBiga boʻling.", 'Разделите числитель и знаменатель на их НОД.', 'Divide numerator and denominator by their GCD.'),
    example: { task: '18/24', steps: ['18 = 6 · 3', '24 = 6 · 4', '= 3/4'] },
    practice: {
      task: '14/21', answers: ['2/3'],
      hints: [
        tri("14 va 21 qaysi songa boʻlinadi?", 'На какое число делятся 14 и 21?', 'What number divides both 14 and 21?'),
        tri('7 ga', 'На 7', 'By 7'),
        tri('14 : 7 = 2 ; 21 : 7 = ?', '14 : 7 = 2 ; 21 : 7 = ?', '14 : 7 = 2 ; 21 : 7 = ?'),
      ],
    },
  },
  fracMeaning: {
    idea: tri("Kasr — butunning teng boʻlaklari: maxraj nechta boʻlakka boʻlganimizni, surat nechtasini olganimizni bildiradi.", 'Дробь — равные части целого: знаменатель — на сколько частей делим, числитель — сколько взяли.', 'A fraction is equal parts of a whole: the denominator says how many parts, the numerator how many we take.'),
    analogy: tri("Non 4 boʻlakka boʻlindi, 3 tasini yedingiz — 3/4.", 'Лепёшку разделили на 4 части, вы съели 3 — это 3/4.', 'A non bread is cut into 4; you ate 3 — that is 3/4.'),
    rule: tri("a/b = (a·k)/(b·k). Surat maxrajdan katta boʻlsa, kasr 1 dan katta.", 'a/b = (a·k)/(b·k). Если числитель больше знаменателя, дробь больше 1.', 'a/b = (a·k)/(b·k). If the numerator is bigger, the fraction is more than 1.'),
    example: { task: '3/4 = ?/8', steps: ['4 · 2 = 8', '3 · 2 = 6', '= 6/8'] },
    practice: {
      task: '2/5 = ?/15', answers: ['6'],
      hints: [
        tri("5 ni nechaga koʻpaytirsak 15 boʻladi?", 'На что умножить 5, чтобы получить 15?', 'What times 5 gives 15?'),
        tri('3 ga', 'На 3', 'By 3'),
        tri('2 · 3 = ?', '2 · 3 = ?', '2 · 3 = ?'),
      ],
    },
  },
  proportion: {
    idea: tri("Proporsiya — ikki nisbatning tengligi. U koʻpaytirish orqali ishlaydi, qoʻshish orqali emas.", 'Пропорция — равенство двух отношений. Она работает через умножение, а не сложение.', 'A proportion is two equal ratios. It works by multiplying, not adding.'),
    analogy: tri("2 kg olma 30 000 soʻm boʻlsa, 4 kg — 2 baravar, ya'ni 60 000 soʻm.", "Если 2 кг яблок стоят 30 000 сумов, то 4 кг — вдвое дороже: 60 000.", "If 2 kg of apples cost 30,000 soʻm, 4 kg cost twice as much: 60,000."),
    rule: tri("a/b = c/d boʻlsa, a · d = b · c.", 'Если a/b = c/d, то a · d = b · c.', 'If a/b = c/d, then a · d = b · c.'),
    example: { task: 'x/3 = 8/12', steps: ['x · 12 = 3 · 8', '12x = 24', 'x = 2'] },
    practice: {
      task: 'x/5 = 6/10', answers: ['3'],
      hints: [
        tri("Chetki va oʻrta hadlarni koʻpaytiring.", 'Перемножьте крест-накрест.', 'Cross-multiply.'),
        tri('10x = 30', '10x = 30', '10x = 30'),
        tri('x = 30 : 10 = ?', 'x = 30 : 10 = ?', 'x = 30 : 10 = ?'),
      ],
    },
  },
  fracMul: {
    idea: tri("Koʻpaytirish: surat suratga, maxraj maxrajga. Boʻlish: ikkinchi kasrni agʻdarib koʻpaytirish.", 'Умножение: числитель на числитель, знаменатель на знаменатель. Деление: переверните вторую дробь и умножьте.', 'Multiply tops and bottoms. To divide, flip the second fraction and multiply.'),
    analogy: tri("Yarim pitsaning yarmi — chorak: 1/2 · 1/2 = 1/4.", 'Половина половины пиццы — четверть: 1/2 · 1/2 = 1/4.', 'Half of half a pizza is a quarter: 1/2 · 1/2 = 1/4.'),
    rule: tri('a/b · c/d = ac/bd;   a/b : c/d = a/b · d/c', 'a/b · c/d = ac/bd;   a/b : c/d = a/b · d/c', 'a/b · c/d = ac/bd;   a/b : c/d = a/b · d/c'),
    example: { task: '3/4 : 1/2', steps: ['3/4 · 2/1', '= 6/4', '= 3/2'] },
    practice: {
      task: '1/3 : 2/5', answers: ['5/6'],
      hints: [
        tri("Ikkinchi kasrni agʻdaring: 2/5 → 5/2", 'Переверните вторую дробь: 2/5 → 5/2', 'Flip the second fraction: 2/5 → 5/2'),
        tri('1/3 · 5/2', '1/3 · 5/2', '1/3 · 5/2'),
        tri('(1 · 5)/(3 · 2) = ?', '(1 · 5)/(3 · 2) = ?', '(1 · 5)/(3 · 2) = ?'),
      ],
    },
  },
  sqrt: {
    idea: tri('√a — kvadrati a ga teng bo\'lgan manfiy bo\'lmagan son.', '√a — неотрицательное число, квадрат которого равен a.', '√a is the non-negative number whose square is a.'),
    analogy: tri("Maydoni 49 m² boʻlgan kvadrat xonaning tomoni √49 = 7 m.", 'Сторона квадратной комнаты площадью 49 м² — √49 = 7 м.', 'A square room of 49 m² has a side of √49 = 7 m.'),
    rule: tri('√(a²) = |a|;   √(ab) = √a · √b', '√(a²) = |a|;   √(ab) = √a · √b', '√(a²) = |a|;   √(ab) = √a · √b'),
    example: { task: '√(4 · 25)', steps: ['√4 · √25', '= 2 · 5', '= 10'] },
    practice: {
      task: '√81', answers: ['9'],
      hints: [
        tri("Qaysi son oʻziga koʻpaytirilsa 81 boʻladi?", 'Какое число, умноженное само на себя, даёт 81?', 'Which number times itself is 81?'),
        tri('8 · 8 = 64 ; 10 · 10 = 100', '8 · 8 = 64 ; 10 · 10 = 100', '8 · 8 = 64 ; 10 · 10 = 100'),
        tri("Ular orasidagi son.", 'Число между ними.', 'The number in between.'),
      ],
    },
  },
  quadEq: {
    idea: tri("x² = a (a > 0) tenglamaning ikkita yechimi bor: musbat va manfiy.", 'Уравнение x² = a (a > 0) имеет два корня: положительный и отрицательный.', 'x² = a (a > 0) has two solutions: a positive and a negative one.'),
    analogy: tri("7² = 49 va (−7)² = 49 — ikkala son ham toʻgʻri keladi.", '7² = 49 и (−7)² = 49 — подходят оба числа.', '7² = 49 and (−7)² = 49 — both numbers work.'),
    rule: tri('x² = a  ⇒  x = ±√a', 'x² = a  ⇒  x = ±√a', 'x² = a  ⇒  x = ±√a'),
    example: { task: 'x² = 25', steps: ['x = ±√25', 'x₁ = 5 ; x₂ = −5'] },
    practice: {
      task: 'x² = 36', answers: ['±6', '6;-6', '-6;6', '6,-6', '-6,6', '6va-6', '6и-6', '6and-6'],
      hints: [
        tri('√36 = ?', '√36 = ?', '√36 = ?'),
        tri('6', '6', '6'),
        tri('Manfiy ildizni unutmang! Javobni ±6 ko\'rinishida yozing.', 'Не забудьте отрицательный корень! Запишите как ±6.', "Don't forget the negative root! Write it as ±6."),
      ],
    },
  },
  wordEq: {
    idea: tri("Masalani tenglamaga \"tarjima\" qiling: noma'lumni x deb oling.", '«Переведите» задачу в уравнение: обозначьте неизвестное через x.', '"Translate" the problem into an equation: call the unknown x.'),
    analogy: tri("\"Ali 3 ta daftar oldi\" → 3x. Matn — bu yashirin tenglama.", '«Али купил 3 тетради» → 3x. Текст — это спрятанное уравнение.', '"Ali bought 3 notebooks" → 3x. The text is a hidden equation.'),
    rule: tri("1) x ni belgilang  2) tenglama tuzing  3) yeching  4) tekshiring", '1) обозначьте x  2) составьте уравнение  3) решите  4) проверьте', '1) define x  2) build the equation  3) solve  4) check'),
    example: { task: '2x + 3 000 = 11 000', steps: ['2x = 11 000 − 3 000', '2x = 8 000', 'x = 4 000'] },
    practice: {
      task: '4x + 2 000 = 14 000', answers: ['3000'],
      hints: [
        tri("2 000 ni oʻng tomonga oʻtkazing.", 'Перенесите 2 000 вправо.', 'Move 2,000 to the right side.'),
        tri('4x = 12 000', '4x = 12 000', '4x = 12,000'),
        tri('x = 12 000 : 4 = ?', 'x = 12 000 : 4 = ?', 'x = 12,000 : 4 = ?'),
      ],
    },
  },
};
