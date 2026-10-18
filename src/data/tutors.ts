// Support teachers ("support ustozlar") for 1:1 online lessons. Demo data — fictional people.
import { tri, Tri } from '../lib/types';
import { Area } from './topics';
import { seeded } from '../lib/utils';

export interface Tutor {
  id: string;
  name: string;
  title: Tri;
  city: string;
  areas: Area[];
  topics: string[]; // topic ids they are strongest in
  langs: ('uz' | 'ru' | 'en')[];
  rating: number;
  reviews: number;
  lessons: number;
  years: number;
  price30: number; // so'm for 30 minutes
  online: boolean; // can join an instant session right now
  certified: boolean; // passed the IldizAI root-gap method course
  bio: Tri;
}

const T = (t: Tutor) => t;

export const TUTORS: Tutor[] = [
  T({ id: 't1', name: 'Gulnora Tursunova', city: 'Buxoro', areas: ['frac', 'arith'], topics: ['lcd', 'fracAdd', 'fracSimplify', 'lcm'], langs: ['uz', 'ru'], rating: 4.9, reviews: 214, lessons: 1820, years: 14, price30: 45000, online: true, certified: true,
    title: tri('Matematika oʻqituvchisi · kasrlar mutaxassisi', 'Учитель математики · эксперт по дробям', 'Math teacher · fractions expert'),
    bio: tri('Kasrlarni non va pitsa misolida tushuntiraman. 5–7-sinf boʻshliqlarini 2–3 darsda yopamiz.', 'Объясняю дроби на примере лепёшки и пиццы. Закрываем пробелы 5–7 классов за 2–3 урока.', 'I explain fractions with bread and pizza. We close grade 5–7 gaps in 2–3 lessons.') }),
  T({ id: 't2', name: 'Bekzod Nazarov', city: 'Andijon', areas: ['algebra', 'neg'], topics: ['linearEq', 'wordEq', 'negAdd', 'brackets'], langs: ['uz'], rating: 4.8, reviews: 167, lessons: 1240, years: 9, price30: 40000, online: true, certified: true,
    title: tri('Algebra boʻyicha support ustoz', 'Support-преподаватель по алгебре', 'Algebra support teacher'),
    bio: tri('Tenglamani tarozi deb tushuntiraman. Masalani tenglamaga "tarjima" qilishni oʻrgataman.', 'Объясняю уравнение как весы. Учу «переводить» задачу в уравнение.', 'I teach equations as a balance scale and how to "translate" word problems.') }),
  T({ id: 't3', name: 'Dilfuza Karimova', city: 'Toshkent', areas: ['frac', 'neg'], topics: ['percent', 'decimals', 'negNumbers', 'negMul'], langs: ['uz', 'ru', 'en'], rating: 5.0, reviews: 98, lessons: 760, years: 11, price30: 60000, online: false, certified: true,
    title: tri('Olimpiada tayyorlovchi', 'Подготовка к олимпиадам', 'Olympiad coach'),
    bio: tri("Foiz va o'nli kasrlarni hayotiy misollar bilan: do'kon chegirmalari, bank foizlari.", 'Проценты и десятичные дроби на жизненных примерах: скидки, проценты в банке.', 'Percents and decimals with real life: store discounts and bank interest.') }),
  T({ id: 't4', name: 'Sanjar Yoʻldoshev', city: 'Samarqand', areas: ['algebra'], topics: ['powers', 'polyMul', 'shortMult', 'monomials'], langs: ['uz'], rating: 4.7, reviews: 132, lessons: 980, years: 7, price30: 35000, online: true, certified: true,
    title: tri('Algebra va formulalar', 'Алгебра и формулы', 'Algebra & formulas'),
    bio: tri("Qisqa ko'paytirish formulalarini yer maydoni chizmasi bilan ko'rsataman.", 'Показываю формулы сокращённого умножения через площадь участка.', 'I show special products with a land-plot area drawing.') }),
  T({ id: 't5', name: 'Malika Rahimova', city: 'Fargʻona', areas: ['frac', 'arith'], topics: ['fracMeaning', 'fracSimplify', 'gcd', 'lcm'], langs: ['uz'], rating: 4.9, reviews: 189, lessons: 1410, years: 12, price30: 38000, online: true, certified: true,
    title: tri("Boshlang'ich va 5-sinf mutaxassisi", 'Специалист по 5 классу', 'Grade 5 specialist'),
    bio: tri("Qo'rqqan bolalar bilan ishlashni yaxshi ko'raman. Har darsni kichik g'alaba bilan tugatamiz.", 'Люблю работать с испуганными детьми. Каждый урок заканчиваем маленькой победой.', 'I love working with anxious kids. Every lesson ends with a small win.') }),
  T({ id: 't6', name: 'Rustam Saidov', city: 'Nukus', areas: ['algebra', 'func'], topics: ['linFunc', 'quadEq', 'sqrt', 'inequalities'], langs: ['uz', 'ru'], rating: 4.6, reviews: 74, lessons: 520, years: 6, price30: 35000, online: false, certified: false,
    title: tri('8–9-sinf algebra', 'Алгебра 8–9 классов', 'Grade 8–9 algebra'),
    bio: tri("Kvadrat tenglama va funksiyalarni grafiklar orqali tushuntiraman.", 'Объясняю квадратные уравнения и функции через графики.', 'I explain quadratics and functions through graphs.') }),
  T({ id: 't7', name: 'Nodira Abdullayeva', city: 'Namangan', areas: ['neg', 'algebra'], topics: ['negAdd', 'negMul', 'likeTerms', 'brackets'], langs: ['uz'], rating: 4.8, reviews: 121, lessons: 890, years: 10, price30: 40000, online: true, certified: true,
    title: tri('Manfiy sonlar va ifodalar', 'Отрицательные числа и выражения', 'Negatives & expressions'),
    bio: tri("Manfiy sonlarni qarz va termometr misolida tushuntiraman — bir darsda tushunarli bo'ladi.", 'Объясняю отрицательные числа через долг и термометр — понятно за один урок.', 'I explain negatives with debt and a thermometer — clear in one lesson.') }),
  T({ id: 't8', name: 'Javlon Ergashev', city: 'Termiz', areas: ['arith', 'frac'], topics: ['natural', 'divisibility', 'lcm', 'proportion'], langs: ['uz'], rating: 4.5, reviews: 58, lessons: 410, years: 4, price30: 30000, online: true, certified: false,
    title: tri('Yosh ustoz · arifmetika', 'Молодой преподаватель · арифметика', 'Young tutor · arithmetic'),
    bio: tri("Talaba-ustozman, o'quvchilar bilan bir tilda gaplashaman. Arzon va samimiy.", 'Преподаю студентом, говорю с учениками на одном языке. Доступно и дружелюбно.', 'A student-teacher who speaks the kids’ language. Affordable and friendly.') }),
  T({ id: 't9', name: 'Ozoda Hamidova', city: 'Urganch', areas: ['frac'], topics: ['proportion', 'fracMul', 'percent', 'decimals'], langs: ['uz', 'ru'], rating: 4.9, reviews: 143, lessons: 1100, years: 13, price30: 45000, online: false, certified: true,
    title: tri('Nisbat, proporsiya va foizlar', 'Пропорции и проценты', 'Ratios, proportions & percents'),
    bio: tri("Bozordagi narxlar bilan proporsiya: 2 kg olma — 4 kg olma.", 'Пропорции на ценах с базара: 2 кг яблок — 4 кг яблок.', 'Proportions with bazaar prices: 2 kg of apples vs 4 kg.') }),
  T({ id: 't10', name: 'Shoxrux Qodirov', city: 'Jizzax', areas: ['algebra'], topics: ['linearEq', 'wordEq', 'progression', 'inequalities'], langs: ['uz'], rating: 4.7, reviews: 96, lessons: 700, years: 8, price30: 38000, online: true, certified: true,
    title: tri('Masalalar va DTM tayyorgarlik', 'Задачи и подготовка к ДТМ', 'Word problems & exam prep'),
    bio: tri("Imtihonga bo'shliqlarni yopishdan boshlab tayyorlayman, test yodlatmayman.", 'Готовлю к экзамену с закрытия пробелов, а не зубрёжки тестов.', 'I prep for exams by closing gaps first, not drilling tests.') }),
  T({ id: 't11', name: 'Zuhra Mirzayeva', city: 'Navoiy', areas: ['frac', 'neg'], topics: ['fracAdd', 'lcd', 'negNumbers', 'negAdd'], langs: ['uz', 'ru'], rating: 4.8, reviews: 110, lessons: 830, years: 9, price30: 40000, online: false, certified: true,
    title: tri('Kasrlar va manfiy sonlar', 'Дроби и отрицательные числа', 'Fractions & negatives'),
    bio: tri("Har darsdan keyin ota-onaga qisqa ovozli xulosa yuboraman.", 'После каждого урока отправляю родителям короткое голосовое резюме.', 'After every lesson I send parents a short voice summary.') }),
  T({ id: 't12', name: 'Alisher Usmonov', city: 'Qarshi', areas: ['algebra', 'neg'], topics: ['brackets', 'likeTerms', 'linearEq', 'negMul'], langs: ['uz'], rating: 4.9, reviews: 156, lessons: 1300, years: 11, price30: 42000, online: true, certified: true,
    title: tri("Qarshidagi eng ko'p tanlangan ustoz", 'Самый популярный учитель в Карши', 'Most booked tutor in Qarshi'),
    bio: tri("Qavslarni ochishni \"do'konga qaytarish\" o'yini bilan o'rgataman.", 'Учу раскрывать скобки через игру «возврат в магазин».', 'I teach expanding brackets with a "store return" game.') }),
  T({ id: 't13', name: 'Kamola Sobirova', city: 'Guliston', areas: ['arith', 'frac'], topics: ['gcd', 'lcm', 'fracMeaning', 'decimals'], langs: ['uz'], rating: 4.6, reviews: 63, lessons: 450, years: 5, price30: 32000, online: true, certified: false,
    title: tri('5–6-sinf arifmetika', 'Арифметика 5–6 классов', 'Grade 5–6 arithmetic'),
    bio: tri("O'yinlar va kartochkalar bilan dars o'taman. Sabrli va mehribonman.", 'Провожу уроки с играми и карточками. Терпелива и добра.', 'Lessons with games and cards. Patient and kind.') }),
  T({ id: 't14', name: 'Timur Abdurahmonov', city: 'Chirchiq', areas: ['func', 'algebra'], topics: ['coords', 'linFunc', 'quadFunc', 'powers'], langs: ['ru', 'uz'], rating: 4.7, reviews: 88, lessons: 640, years: 8, price30: 45000, online: false, certified: true,
    title: tri('Funksiyalar va grafiklar (rus tilida ham)', 'Функции и графики (на русском)', 'Functions & graphs (Russian too)'),
    bio: tri("Rus maktabida o'qiydigan bolalar uchun ikki tilda tushuntiraman.", 'Для детей из русских школ объясняю на двух языках.', 'For kids at Russian schools I explain in both languages.') }),
  T({ id: 't15', name: 'Feruza Ismoilova', city: 'Shahrisabz', areas: ['frac', 'arith'], topics: ['lcd', 'fracAdd', 'percent', 'proportion'], langs: ['uz'], rating: 4.8, reviews: 101, lessons: 760, years: 10, price30: 36000, online: true, certified: true,
    title: tri('Qishloq maktablari uchun support', 'Поддержка сельских школ', 'Support for village schools'),
    bio: tri("Sekin internetda ham ishlaymiz: ovoz + doska, video shart emas.", 'Работаем и на медленном интернете: голос + доска, видео не обязательно.', 'Works on slow internet too: voice + whiteboard, no video needed.') }),
  T({ id: 't16', name: 'Ulugʻbek Raximov', city: 'Xiva', areas: ['algebra', 'func'], topics: ['quadEq', 'sqrt', 'shortMult', 'progression'], langs: ['uz', 'ru'], rating: 4.5, reviews: 47, lessons: 330, years: 5, price30: 34000, online: false, certified: false,
    title: tri('9-sinf va imtihon', '9 класс и экзамены', 'Grade 9 & exams'),
    bio: tri("Kvadrat tenglamada ikkinchi ildizni hech kim unutmasin!", 'Чтобы никто не терял второй корень в квадратном уравнении!', 'So nobody ever loses the second root of a quadratic!') }),
];

export const TUTOR: Record<string, Tutor> = Object.fromEntries(TUTORS.map((t) => [t.id, t]));

export const SLOT_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

/** Deterministic free time slots for a tutor on a given day (YYYY-MM-DD) */
export function slotsFor(tutorId: string, day: string) {
  const seed = [...(tutorId + day)].reduce((a, c) => a + c.charCodeAt(0) * 7, 0);
  const r = seeded(seed);
  return SLOT_TIMES.filter(() => r() > 0.38);
}

export const priceFor = (t: Tutor, minutes: 30 | 60) => (minutes === 30 ? t.price30 : Math.round((t.price30 * 1.8) / 1000) * 1000);
