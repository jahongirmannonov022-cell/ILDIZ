// Offline "smart" assistant: keyword intents + a tiny step-by-step math solver.
import { Lang, UserState } from './types';
import { TOPIC } from '../data/topics';
import { recommendations } from './recommend';
import { streakOf, levelOf } from './game';

export interface BotReply {
  text: string;
  link?: { to: string; label: string };
}

type T3 = (uz: string, ru: string, en: string) => string;

// ── Fractions ───────────────────────────────────────────────
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);
interface Frac { n: number; d: number }
const simp = (f: Frac): Frac => {
  const g = gcd(f.n, f.d) || 1;
  const s = f.d < 0 ? -1 : 1;
  return { n: (s * f.n) / g, d: (s * f.d) / g };
};
const show = (f: Frac) => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`);

function parseNum(s: string): Frac | null {
  s = s.replace(',', '.');
  if (/^-?\d+\/\d+$/.test(s)) {
    const [n, d] = s.split('/').map(Number);
    return d === 0 ? null : { n, d };
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    const [, dec = ''] = s.split('.');
    const d = 10 ** dec.length;
    return simp({ n: Math.round(Number(s) * d), d });
  }
  return null;
}

function solveArithmetic(msg: string, t: T3): string | null {
  const m = msg.replace(/\s+/g, '').replace(/[−–]/g, '-').match(/^(-?\d+(?:[.,]\d+)?(?:\/\d+)?)([+\-*:x×·÷])(-?\d+(?:[.,]\d+)?(?:\/\d+)?)=?\??$/i);
  if (!m) return null;
  const a = parseNum(m[1]);
  const b = parseNum(m[3]);
  const op = m[2];
  if (!a || !b) return null;
  const steps: string[] = [];
  let r: Frac;
  if (op === '+' || op === '-') {
    if (a.d === 1 && b.d === 1) {
      r = { n: op === '+' ? a.n + b.n : a.n - b.n, d: 1 };
      if (a.n < 0 || b.n < 0 || r.n < 0) steps.push(t('Ishoralarga e’tibor bering: moduli kattaroq sonning ishorasi qoladi.', 'Следите за знаками: остаётся знак числа с большим модулем.', 'Watch the signs: the larger absolute value keeps its sign.'));
    } else {
      const L = lcm(a.d, b.d);
      const an = a.n * (L / a.d);
      const bn = b.n * (L / b.d);
      steps.push(t(`1) Umumiy maxraj: EKUK(${a.d}, ${b.d}) = ${L}`, `1) Общий знаменатель: НОК(${a.d}, ${b.d}) = ${L}`, `1) Common denominator: LCM(${a.d}, ${b.d}) = ${L}`));
      steps.push(`2) ${show(a)} = ${an}/${L} ;  ${show(b)} = ${bn}/${L}`);
      const n = op === '+' ? an + bn : an - bn;
      steps.push(`3) ${an} ${op} ${bn} = ${n}  →  ${n}/${L}`);
      r = { n, d: L };
    }
  } else if (op === ':' || op === '÷') {
    if (b.n === 0) return t("Nolga boʻlish mumkin emas 🙂", 'На ноль делить нельзя 🙂', "You can't divide by zero 🙂");
    steps.push(t(`1) Ikkinchi kasrni agʻdaramiz: ${show(b)} → ${b.d}/${b.n}`, `1) Переворачиваем вторую дробь: ${show(b)} → ${b.d}/${b.n}`, `1) Flip the second fraction: ${show(b)} → ${b.d}/${b.n}`));
    r = { n: a.n * b.d, d: a.d * b.n };
    steps.push(`2) ${show(a)} · ${b.d}/${b.n} = ${r.n}/${r.d}`);
  } else {
    r = { n: a.n * b.n, d: a.d * b.d };
    steps.push(t(`1) Surat × surat, maxraj × maxraj: ${r.n}/${r.d}`, `1) Числитель × числитель, знаменатель × знаменатель: ${r.n}/${r.d}`, `1) Top × top, bottom × bottom: ${r.n}/${r.d}`));
  }
  const s = simp(r);
  if (s.d !== r.d) steps.push(t(`Qisqartiramiz: ${show(s)}`, `Сокращаем: ${show(s)}`, `Simplify: ${show(s)}`));
  return `🧮 ${m[1]} ${op} ${m[3]}\n\n${steps.join('\n')}\n\n✅ ${t('Javob', 'Ответ', 'Answer')}: ${show(s)}${s.d !== 1 ? ` ≈ ${(s.n / s.d).toFixed(3).replace(/\.?0+$/, '')}` : ''}`;
}

function solveLinear(msg: string, t: T3): string | null {
  const m = msg.replace(/\s+/g, '').replace(/[−–]/g, '-').toLowerCase().match(/^(-?\d*)x([+-]\d+)?=(-?\d+)$/);
  if (!m) return null;
  const a = m[1] === '' ? 1 : m[1] === '-' ? -1 : Number(m[1]);
  const b = m[2] ? Number(m[2]) : 0;
  const c = Number(m[3]);
  if (a === 0) return null;
  const rhs = c - b;
  const res = simp({ n: rhs, d: a });
  const steps = [
    b !== 0 ? t(`1) ${b > 0 ? '+' : ''}${b} ni oʻngga oʻtkazamiz (ishorasi oʻzgaradi): ${a}x = ${c} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${rhs}`, `1) Переносим ${b} вправо (меняем знак): ${a}x = ${rhs}`, `1) Move ${b} to the right (sign flips): ${a}x = ${rhs}`) : `1) ${a}x = ${c}`,
    t(`2) ${a} ga boʻlamiz: x = ${rhs} : ${a}`, `2) Делим на ${a}: x = ${rhs} : ${a}`, `2) Divide by ${a}: x = ${rhs} : ${a}`),
  ];
  return `🧮 ${msg.trim()}\n\n${steps.join('\n')}\n\n✅ x = ${show(res)}\n${t("Tekshiring: x ni oʻrniga qoʻying!", 'Проверьте: подставьте x!', 'Check: plug x back in!')}`;
}

// ── Intents ─────────────────────────────────────────────────
// Apostrophe-insensitive match: o', o‘, oʻ and o’ are treated the same
const apos = (s: string) => s.replace(/['‘’ʻʼ`]/g, "'");
const has = (s: string, words: string[]) => words.some((w) => apos(s).includes(apos(w)));

export function reply(raw: string, s: UserState, lang: Lang): BotReply {
  const t: T3 = (uz, ru, en) => (lang === 'ru' ? ru : lang === 'en' ? en : uz);
  const msg = raw.toLowerCase().trim();
  const name = s.profile.childName || s.profile.name.split(' ')[0];
  const rec = recommendations(s, 1)[0];
  const recName = rec ? TOPIC[rec.topicId].title[lang] : '';

  const math = solveLinear(raw, t) ?? solveArithmetic(raw, t);
  if (math) return { text: math, link: { to: '/app/scan', label: t("Bu xato boʻlsa — ildizini toping", 'Если ошибся — найдите корень', 'Got it wrong? Find the root') } };

  const words = msg.split(/[^a-zа-яё']+/i);
  if (has(msg, ['salom', 'assalom', 'привет', 'здравств', 'hello']) || words.includes('hi') || words.includes('hey'))
    return { text: t(`Salom, ${name}! 👋 Men IldizAI yordamchisiman. Menga misol yozing (masalan 1/2+1/3 yoki 2x+3=11) yoki mavzu haqida soʻrang.`, `Привет, ${name}! 👋 Я помощник IldizAI. Напишите пример (например 1/2+1/3 или 2x+3=11) или спросите о теме.`, `Hi ${name}! 👋 I'm the IldizAI assistant. Send me a problem (like 1/2+1/3 or 2x+3=11) or ask about a topic.`) };
  if (has(msg, ['rahmat', 'спасибо', 'thank']))
    return { text: t('Arzimaydi! Har bir xato — bu xarita. Davom etamiz 💪', 'Пожалуйста! Каждая ошибка — это карта. Продолжаем 💪', "You're welcome! Every mistake is a map. Keep going 💪") };
  if (has(msg, ['vaqt mashina', 'машин', 'time machine', 'ildiz', 'корен', 'root']))
    return { text: t("Vaqt mashinasi xato javobni oʻqiydi, mavzular grafi boʻyicha oldingi sinflarga qaytadi va 3 ta savol bilan ildizni tasdiqlaydi. Sinab koʻring!", 'Машина времени читает неверный ответ, идёт назад по графу тем в прошлые классы и подтверждает корень 3 вопросами. Попробуйте!', 'The Time Machine reads the wrong answer, walks back the topic graph to earlier grades and confirms the root with 3 questions. Try it!'), link: { to: '/app/scan', label: t('Vaqt mashinasi', 'Машина времени', 'Time Machine') } };
  if (has(msg, ['nega nima', 'nega?', 'platforma', 'что такое', 'о платформ', 'what is', 'about']))
    return { text: t("IldizAI javobni emas, xatoning sababini topadi: 7-sinfdagi xato koʻpincha 5-sinfda qolgan boʻshliqdan keladi. Biz uni topamiz va 5 daqiqada yopamiz.", 'IldizAI находит не ответ, а причину ошибки: ошибка в 7 классе часто идёт из пробела в 5-м. Мы находим его и закрываем за 5 минут.', 'IldizAI finds the cause, not the answer: a grade-7 mistake often comes from a grade-5 gap. We find it and close it in 5 minutes.') };
  if (has(msg, ['javob ber', 'javobni ayt', 'дай ответ', 'скажи ответ', 'give me the answer', 'just the answer']))
    return { text: t("Tayyor javob bermayman 🙂 — lekin qadamlarini koʻrsataman. Misolni yozing, masalan: 3/4 - 1/6", 'Готовый ответ не дам 🙂 — но покажу шаги. Напишите пример, например: 3/4 - 1/6', "I won't just hand over answers 🙂 — but I'll show the steps. Type a problem, e.g. 3/4 - 1/6") };
  if (has(msg, ['kasr', 'дроб', 'fraction', 'maxraj', 'знаменат', 'denominator']))
    return { text: t('Kasrlarni qoʻshishning siri — umumiy maxraj. Non misoli: 1/2 va 1/3 boʻlaklari har xil, ikkalasini 6 boʻlakka kessak teng boʻladi: 3/6 + 2/6 = 5/6. Misol yozing — qadamlab yechaman.', 'Секрет сложения дробей — общий знаменатель. 1/2 и 1/3 — куски разные; разрежем на 6: 3/6 + 2/6 = 5/6. Напишите пример — решу по шагам.', 'The secret of adding fractions is a common denominator. 1/2 and 1/3 are different pieces; cut both into 6: 3/6 + 2/6 = 5/6. Send an example and I’ll solve it step by step.'), link: { to: '/app/lesson/lcd', label: t('Mikro-dars: umumiy maxraj', 'Микро-урок: общий знаменатель', 'Micro-lesson: common denominator') } };
  if (has(msg, ['manfiy', 'отрицат', 'negative', 'minus']))
    return { text: t('Manfiy son — qarz. 4 000 soʻm pulingiz bor, 7 000 soʻm qarzingiz bor: −7 + 4 = −3. Koʻpaytirishda: (−)·(−) = (+).', 'Отрицательное число — долг. Есть 4 000, долг 7 000: −7 + 4 = −3. При умножении: (−)·(−) = (+).', "A negative number is a debt. You have 4,000 and owe 7,000: −7 + 4 = −3. When multiplying: (−)·(−) = (+)."), link: { to: '/app/lesson/negAdd', label: t('Mikro-dars', 'Микро-урок', 'Micro-lesson') } };
  if (has(msg, ['tenglama', 'уравнен', 'equation']))
    return { text: t('Tenglama — tarozi. Hadni boshqa tomonga oʻtkazsangiz, ishorasi oʻzgaradi. Masalan, menga "3x+4=19" deb yozing.', 'Уравнение — весы. При переносе слагаемого знак меняется. Напишите мне, например, «3x+4=19».', 'An equation is a balance. Moving a term across flips its sign. Try typing "3x+4=19".'), link: { to: '/app/lesson/linearEq', label: t('Mikro-dars', 'Микро-урок', 'Micro-lesson') } };
  if (has(msg, ['foiz', 'процент', 'percent', '%']))
    return { text: t("1% = 1/100. 600 000 soʻmning 15% i: 600 000 · 0,15 = 90 000 soʻm. Koʻp uchraydigan xato: 15% ni 0,015 deb yozish.", '1% = 1/100. 15% от 600 000: 600 000 · 0,15 = 90 000. Частая ошибка — писать 15% как 0,015.', "1% = 1/100. 15% of 600,000 = 600,000 · 0.15 = 90,000. A common slip: writing 15% as 0.015."), link: { to: '/app/lesson/percent', label: t('Mikro-dars', 'Микро-урок', 'Micro-lesson') } };
  if (has(msg, ['daraja', 'степен', 'power', 'exponent']))
    return { text: t("Asoslari bir xil darajalarni koʻpaytirganda koʻrsatkichlar QOʻSHILADI: 2³ · 2² = 2⁵ = 32 (64 emas!).", 'При умножении степеней с одним основанием показатели СКЛАДЫВАЮТСЯ: 2³ · 2² = 2⁵ = 32 (а не 64!).', 'When multiplying powers with the same base, ADD the exponents: 2³ · 2² = 2⁵ = 32 (not 64!).'), link: { to: '/app/lesson/powers', label: t('Mikro-dars', 'Микро-урок', 'Micro-lesson') } };
  if (has(msg, ['charcha', 'zerik', 'qiyin', 'tushunma', 'устал', 'сложно', 'скучно', 'не понима', 'tired', 'hard', 'bored', "don't understand"]))
    return { text: t(`Tushunaman, ${name}. Qiyinligi — miyangiz oʻsayotganini bildiradi 🌱 Bugun faqat 5 daqiqa: ${recName ? `"${recName}"` : 'bitta mavzu'}. Seriyangiz ${streakOf(s.activeDays)} kun — uzmang!`, `Понимаю, ${name}. Трудно — значит мозг растёт 🌱 Сегодня всего 5 минут: ${recName ? `«${recName}»` : 'одна тема'}. Серия — ${streakOf(s.activeDays)} дн., не прерывай!`, `I get it, ${name}. Hard means your brain is growing 🌱 Just 5 minutes today: ${recName ? `"${recName}"` : 'one topic'}. Your streak is ${streakOf(s.activeDays)} days — keep it!`), link: rec ? { to: `/app/lesson/${rec.topicId}`, label: t('5 daqiqa boshlash', 'Начать 5 минут', 'Start 5 minutes') } : undefined };
  if (has(msg, ['ota-ona', 'ota ona', 'otam', 'onam', 'родител', 'папа', 'мама', 'parent', 'dad', 'mom', 'buvi', 'бабушк', 'grandma']))
    return { text: t("Ota-ona hisoboti oʻzbekcha ovozli xabar sifatida Telegramga boradi. Buvi uchun esa katta harfli kartochkalar bor — matematikani bilish shart emas.", 'Отчёт уходит родителям голосовым сообщением в Telegram. Для бабушки — карточки с крупным шрифтом, математику знать не нужно.', 'Parents get a voice report in Telegram. For grandma there are big-print cards — no math needed.'), link: { to: '/app/parent', label: t('Ota-ona hisoboti', 'Отчёт родителям', 'Parent report') } };
  if (has(msg, ['narx', 'pul', 'obuna', 'tolov', "toʻlov", 'цен', 'стоим', 'подписк', 'price', 'cost', 'subscription', 'pay']))
    return { text: t("Kuniga 3 ta tahlil — bepul. Oilaviy obuna bitta repetitor darsidan arzon. Maktab va oʻquv markazlari uchun alohida tarif bor.", '3 анализа в день — бесплатно. Семейная подписка дешевле одного занятия с репетитором. Для школ и центров — отдельный тариф.', '3 analyses a day are free. A family plan costs less than one tutoring session. Schools and centers have their own plan.') };
  if (has(msg, ["oʻqituvchi", 'oqituvchi', 'учител', 'teacher', 'sinf', 'класс', 'class']))
    return { text: t("Oʻqituvchilar uchun sinf xaritasi: 24 oʻquvchining umumiy ildizlari bir sahifada va bir tugmada mashq yuborish.", 'Для учителя — карта класса: общие корни 24 учеников на одной странице и отправка упражнения в один клик.', 'Teachers get a class map: shared roots of 24 students on one page, and one-click drills.'), link: { to: '/app/teacher', label: t('Sinf xaritasi', 'Карта класса', 'Class map') } };
  if (has(msg, ['ball', 'nishon', 'level', 'badge', 'очк', 'значк', 'уровен', 'seriya', 'streak', 'серия']))
    return { text: t(`Sizda ${s.points} ball, daraja: ${levelOf(s.points).cur.name.uz} ${levelOf(s.points).cur.emoji}, seriya: ${streakOf(s.activeDays)} kun, nishonlar: ${s.badges.length} ta.`, `У вас ${s.points} очков, уровень: ${levelOf(s.points).cur.name.ru} ${levelOf(s.points).cur.emoji}, серия: ${streakOf(s.activeDays)} дн., значков: ${s.badges.length}.`, `You have ${s.points} points, level: ${levelOf(s.points).cur.name.en} ${levelOf(s.points).cur.emoji}, streak: ${streakOf(s.activeDays)} days, badges: ${s.badges.length}.`), link: { to: '/app/achievements', label: t('Yutuqlar', 'Достижения', 'Achievements') } };
  if (has(msg, ['dtm', 'imtihon', 'экзамен', 'exam', 'test']))
    return { text: t("Imtihonga tayyorgarlik boʻshliqlardan boshlanadi: test yodlashdan oldin ildizlarni yoping. Bilim xaritasidagi qizil mavzulardan boshlang.", 'Подготовка к экзамену начинается с пробелов: закройте корни, прежде чем зубрить тесты. Начните с красных тем на карте.', 'Exam prep starts with the gaps: close the roots before drilling tests. Start with the red topics on your map.'), link: { to: '/app/map', label: t('Bilim xaritasi', 'Карта знаний', 'Knowledge map') } };
  if (has(msg, ['maxfiy', 'xavfsiz', 'данн', 'безопас', 'privacy', 'data']))
    return { text: t("Demo versiyada barcha ma'lumotlar faqat sizning brauzeringizda saqlanadi.", 'В демо все данные хранятся только в вашем браузере.', 'In this demo, all data stays in your browser only.') };
  if (has(msg, ['internet', 'интернет', 'offline', 'sekin', 'медлен', 'slow']))
    return { text: t("Sozlamalarda \"Yengil rejim\"ni yoqing — animatsiyalar oʻchadi va ilova tezroq ishlaydi.", 'Включите «Лёгкий режим» в настройках — анимации отключатся.', 'Turn on "Lite mode" in Settings — animations turn off and it runs faster.'), link: { to: '/app/settings', label: t('Sozlamalar', 'Настройки', 'Settings') } };
  if (has(msg, ['nima qilay', 'tavsiya', 'что делать', 'совет', 'recommend', 'what should']))
    return { text: rec ? t(`Bugun "${recName}" ni yoping — u ${rec.unlocks} ta keyingi mavzuga ildiz. Hozirgi oʻzlashtirish: ${rec.mastery}%.`, `Сегодня закройте «${recName}» — это корень для ${rec.unlocks} следующих тем. Сейчас: ${rec.mastery}%.`, `Close "${recName}" today — it unlocks ${rec.unlocks} later topics. Current mastery: ${rec.mastery}%.`) : t('Hammasi yashil! Yangi xatoni skanerlang.', 'Всё зелёное! Отсканируйте новую ошибку.', 'All green! Scan a new mistake.'), link: rec ? { to: `/app/lesson/${rec.topicId}`, label: t('Boshlash', 'Начать', 'Start') } : undefined };

  return { text: t('Hmm, buni hali oʻrganyapman 🤔 Misol yozib koʻring (masalan 2/3:4/5 yoki 5x-3=12) yoki pastdagi tugmalardan birini tanlang.', 'Хм, этому я ещё учусь 🤔 Напишите пример (например 2/3:4/5 или 5x-3=12) или выберите кнопку ниже.', "Hmm, I'm still learning that 🤔 Try a problem (e.g. 2/3:4/5 or 5x-3=12) or tap a suggestion below.") };
}
