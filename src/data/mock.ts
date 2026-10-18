// Realistic mock data (demo only — no real people).
import { tri, Tri, Review, Tip } from '../lib/types';
import { seeded } from '../lib/utils';

export const CITIES = [
  'Toshkent', 'Samarqand', 'Buxoro', "Fargʻona", 'Nukus', 'Qarshi', 'Namangan', 'Andijon', 'Termiz', 'Urganch',
  'Navoiy', 'Jizzax', 'Guliston', 'Nurafshon', 'Shahrisabz', "Qoʻqon", "Margʻilon", 'Chirchiq', 'Xiva', 'Denov',
];

export interface Testimonial { name: string; role: Tri; city: string; text: Tri; rating: number }

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Dilnoza Rahimova', role: tri('Ona', 'Мама', 'Mother'), city: 'Samarqand', rating: 5,
    text: tri("Qizim algebrani yomon koʻrardi. IldizAI 5-sinfdagi kasrlarni koʻrsatdi — 2 haftada baholari 3 dan 5 ga chiqdi.", 'Дочь ненавидела алгебру. IldizAI показал дроби из 5 класса — за 2 недели оценки выросли с 3 до 5.', 'My daughter hated algebra. IldizAI pointed to 5th-grade fractions — in 2 weeks her grades went from 3 to 5.') },
  { name: 'Rustam Karimov', role: tri('Ota, Moskvada ishlaydi', 'Отец, работает в Москве', 'Father working in Moscow'), city: 'Qarshi', rating: 5,
    text: tri("Moskvadan turib oʻgʻlimning nima oʻrganganini oʻzbekcha ovozli xabarda eshitaman. Endi faqat \"baho necha?\" deb soʻramayman.", 'Из Москвы слушаю голосовой отчёт на узбекском о том, что выучил сын. Больше не спрашиваю только «какая оценка?».', "From Moscow I hear a voice report in Uzbek about what my son learned. I no longer just ask 'what grade?'.") },
  { name: 'Gulnora Tursunova', role: tri("Matematika oʻqituvchisi", 'Учитель математики', 'Math teacher'), city: 'Buxoro', rating: 5,
    text: tri("Sinf xaritasi 32 oʻquvchining umumiy boʻshligʻini bir sahifada koʻrsatdi. Darsni 10 daqiqa oʻsha mavzudan boshladim.", 'Карта класса показала общий пробел 32 учеников на одной странице. Я начала урок с этой темы.', 'The class map showed the shared gap of 32 students on one page. I opened the lesson with that topic.') },
  { name: 'Ozoda buvi', role: tri('Buvi', 'Бабушка', 'Grandmother'), city: 'Nukus', rating: 5,
    text: tri("Men matematikani bilmayman, lekin kartochkadagi savolni nevaramga beraman. U javob beradi, men \"barakalla\" deyman.", 'Я не знаю математику, но задаю внуку вопрос с карточки. Он отвечает, а я говорю «молодец».', "I don't know math, but I ask my grandson the card's question. He answers, and I say 'well done'.") },
  { name: 'Sardor Aliyev', role: tri("8-sinf oʻquvchisi", 'Ученик 8 класса', '8th grader'), city: "Fargʻona", rating: 5,
    text: tri("Photomath javob beradi, lekin nega xato qilganimni bilmasdim. Vaqt mashinasi meni manfiy sonlarga qaytardi — va toʻgʻri qildi.", 'Photomath даёт ответ, но я не знал, почему ошибаюсь. Машина времени вернула меня к отрицательным числам — и правильно.', "Photomath gives answers, but I never knew why I was wrong. The Time Machine sent me back to negative numbers — and it was right.") },
  { name: 'Malika Yusupova', role: tri("7-sinf oʻquvchisi", 'Ученица 7 класса', '7th grader'), city: 'Toshkent', rating: 5,
    text: tri("Har kuni 5 daqiqa. Seriyam 21 kunga yetdi, endi \"Chinor\" darajasiga chiqmoqchiman.", 'Каждый день по 5 минут. Серия — 21 день, хочу дойти до уровня «Чинар».', "5 minutes a day. My streak hit 21 days — now I'm going for the 'Chinor' level.") },
  { name: 'Bekzod Nazarov', role: tri('Repetitor', 'Репетитор', 'Tutor'), city: 'Andijon', rating: 4,
    text: tri("Yangi oʻquvchining IldizAI tahlilini birinchi darsdayoq koʻraman — vaqtni boʻshliqni qidirishga emas, yopishga sarflayman.", 'Вижу анализ IldizAI нового ученика на первом занятии — трачу время не на поиск пробела, а на его закрытие.', "I see a new student's IldizAI analysis on day one — I spend time closing gaps, not hunting for them.") },
  { name: 'Nodira Saidova', role: tri('Maktab direktori', 'Директор школы', 'School principal'), city: 'Namangan', rating: 5,
    text: tri("Pilotdan keyin 7-sinflarning chorak nazorat ishi natijalari sezilarli oshdi.", 'После пилота результаты четвертных контрольных у 7-х классов заметно выросли.', 'After the pilot, our 7th graders’ quarterly test results rose noticeably.') },
  { name: 'Jahongir Ergashev', role: tri('Ota', 'Отец', 'Father'), city: 'Termiz', rating: 4,
    text: tri("Internetimiz sekin, lekin yengil rejimda hammasi ishlaydi. Rasm bir zumda yuboriladi.", 'Интернет у нас медленный, но в лёгком режиме всё работает. Фото отправляется мгновенно.', 'Our internet is slow, but lite mode just works. Photos upload instantly.') },
  { name: 'Feruza Xolmatova', role: tri('Ona', 'Мама', 'Mother'), city: 'Urganch', rating: 5,
    text: tri("Ikki farzandimning bilim xaritasini koʻrib turaman. Repetitorga ketadigan pulni tejadim.", 'Вижу карты знаний обоих детей. Сэкономила на репетиторе.', "I follow both kids' knowledge maps. I've saved on tutoring.") },
  { name: 'Aziz Qodirov', role: tri("9-sinf oʻquvchisi", 'Ученик 9 класса', '9th grader'), city: 'Jizzax', rating: 5,
    text: tri("Kvadrat tenglamada doim bitta ildizni yoʻqotardim. Endi ±7 ni hech qachon unutmayman.", 'В квадратных уравнениях всегда терял корень. Теперь ±7 не забываю.', 'I always lost a root in quadratics. Now I never forget ±7.') },
  { name: 'Shahnoza Mirzayeva', role: tri("Oʻqituvchi", 'Учитель', 'Teacher'), city: 'Navoiy', rating: 4,
    text: tri("Gʻoya ajoyib: har bir xatoning sababi bor va uni topish mumkin.", 'Идея прекрасная: у каждой ошибки есть причина, и её можно найти.', 'Brilliant idea: every mistake has a cause, and it can be found.') },
  { name: 'Otabek Rasulov', role: tri("6-sinf oʻquvchisi", 'Ученик 6 класса', '6th grader'), city: 'Guliston', rating: 5,
    text: tri("Yordamchi menga javobni emas, maslahat beradi. Avval jahlim chiqdi, keyin oʻzim yechdim!", 'Помощник даёт не ответ, а подсказку. Сначала злился, потом решил сам!', 'The assistant gives hints, not answers. I was annoyed, then I solved it myself!') },
  { name: 'Zarina Abdullayeva', role: tri('Ona, Koreyada ishlaydi', 'Мама, работает в Корее', 'Mother working in Korea'), city: "Qoʻqon", rating: 5,
    text: tri("Seuldan turib qizimga motivatsiya yozaman. Hisobot har yakshanba keladi.", 'Из Сеула пишу дочке слова поддержки. Отчёт приходит каждое воскресенье.', 'From Seoul I send my daughter encouragement. The report arrives every Sunday.') },
  { name: 'Ilhom Sobirov', role: tri("Oʻquv markazi rahbari", 'Руководитель учебного центра', 'Learning center director'), city: 'Chirchiq', rating: 4,
    text: tri("60 oʻquvchini IldizAI orqali diagnostika qildik va guruhlarni ildiz boʻyicha qayta tuzdik.", 'Провели диагностику 60 учеников через IldizAI и пересобрали группы по корневым пробелам.', 'We diagnosed 60 students with IldizAI and regrouped them by root gaps.') },
  { name: 'Kamola Hasanova', role: tri("7-sinf oʻquvchisi", 'Ученица 7 класса', '7th grader'), city: "Margʻilon", rating: 5,
    text: tri("Konfetti chiqqanda xursand boʻlaman 🎉 Kasrlar endi qoʻrqinchli emas.", 'Радуюсь, когда вылетает конфетти 🎉 Дроби больше не страшные.', 'I love the confetti 🎉 Fractions are not scary anymore.') },
];

export interface Leader { name: string; city: string; points: number; streak: number; grade: number }

export const LEADERS: Leader[] = [
  { name: 'Malika Yusupova', city: 'Toshkent', points: 4820, streak: 21, grade: 7 },
  { name: 'Aziz Qodirov', city: 'Jizzax', points: 4410, streak: 18, grade: 9 },
  { name: 'Kamola Hasanova', city: "Margʻilon", points: 3990, streak: 15, grade: 7 },
  { name: 'Sardor Aliyev', city: "Fargʻona", points: 3720, streak: 12, grade: 8 },
  { name: 'Mohinur Ismoilova', city: 'Samarqand', points: 3350, streak: 14, grade: 6 },
  { name: 'Javohir Toshpulatov', city: 'Buxoro', points: 3110, streak: 9, grade: 7 },
  { name: 'Sevara Nurmatova', city: 'Namangan', points: 2870, streak: 11, grade: 8 },
  { name: 'Otabek Rasulov', city: 'Guliston', points: 2640, streak: 8, grade: 6 },
  { name: 'Diyora Sultonova', city: 'Andijon', points: 2400, streak: 10, grade: 7 },
  { name: 'Shohruh Mamatov', city: 'Nukus', points: 2190, streak: 7, grade: 9 },
  { name: 'Madina Qosimova', city: 'Urganch', points: 1980, streak: 6, grade: 5 },
  { name: 'Bobur Xudoyberdiyev', city: 'Termiz', points: 1760, streak: 5, grade: 8 },
  { name: 'Nilufar Ahmedova', city: 'Navoiy', points: 1540, streak: 9, grade: 6 },
  { name: 'Asadbek Normurodov', city: 'Shahrisabz', points: 1380, streak: 4, grade: 7 },
  { name: "Ruxshona Gʻaniyeva", city: "Qoʻqon", points: 1210, streak: 6, grade: 5 },
  { name: 'Ulugbek Raximov', city: 'Chirchiq', points: 1090, streak: 3, grade: 8 },
  { name: 'Zilola Eshonqulova', city: 'Xiva', points: 940, streak: 5, grade: 6 },
  { name: 'Temur Abdurahmonov', city: 'Denov', points: 820, streak: 2, grade: 7 },
  { name: 'Sabina Jumayeva', city: 'Nurafshon', points: 690, streak: 3, grade: 5 },
  { name: 'Islom Haydarov', city: 'Qarshi', points: 540, streak: 1, grade: 9 },
];

export const SEED_TIPS: Tip[] = [
  { id: 't1', author: 'Dilnoza Rahimova', city: 'Samarqand', tag: 'parent', likes: 48, text: tri("Bolani xatosi uchun urishmang — \"keling, nega ekanini birga topamiz\" deng.", 'Не ругайте за ошибку — скажите «давай вместе найдём, почему».', "Don't scold the mistake — say 'let's find out why together'.") },
  { id: 't2', author: 'Gulnora Tursunova', city: 'Buxoro', tag: 'teacher', likes: 41, text: tri("Darsni sinfning eng katta ildizi bilan 10 daqiqa boshlang — qolgan dars osonlashadi.", 'Начинайте урок с 10 минут на главный пробел класса — остальное пойдёт легче.', "Open class with 10 minutes on the class's biggest root — the rest gets easier.") },
  { id: 't3', author: 'Malika Yusupova', city: 'Toshkent', tag: 'student', likes: 37, text: tri("Kechki ovqatdan keyin 5 daqiqa — eslatma qoʻyib qoʻying, seriya oʻzi davom etadi.", '5 минут после ужина — поставьте напоминание, и серия не прервётся.', '5 minutes after dinner — set a reminder and your streak keeps going.') },
  { id: 't4', author: 'Rustam Karimov', city: 'Qarshi', tag: 'parent', likes: 35, text: tri("Ovozli hisobotni eshitgach, bolaga bitta aniq maqtov yuboring: \"kasrlarni yengding!\"", 'Послушав отчёт, отправьте ребёнку конкретную похвалу: «ты победил дроби!»', "After the voice report, send one specific praise: 'you beat fractions!'") },
  { id: 't5', author: 'Aziz Qodirov', city: 'Jizzax', tag: 'student', likes: 29, text: tri("Maslahatni darrov ochmang. 2 daqiqa oʻzingiz oʻylang — keyin yaxshiroq eslab qolasiz.", 'Не открывайте подсказку сразу. Подумайте 2 минуты — так лучше запомните.', "Don't open the hint right away. Think for 2 minutes — you'll remember better.") },
  { id: 't6', author: 'Ozoda buvi', city: 'Nukus', tag: 'parent', likes: 52, text: tri("Kartochkani choy ustida bering. Imtihon emas, suhbat boʻlsin.", 'Давайте карточку за чаем. Пусть это будет беседа, а не экзамен.', "Ask the card's question over tea. A chat, not an exam.") },
  { id: 't7', author: 'Bekzod Nazarov', city: 'Andijon', tag: 'teacher', likes: 22, text: tri("Bir xil ildizli oʻquvchilarni juftlang — ular bir-biriga tushuntiradi.", 'Объединяйте в пары учеников с одним пробелом — они объясняют друг другу.', 'Pair students with the same root — they explain to each other.') },
  { id: 't8', author: 'Kamola Hasanova', city: "Margʻilon", tag: 'student', likes: 26, text: tri("Xatolarim daftarini yuritaman: har bir ildizni yozib, yonida yashil belgi qoʻyaman.", 'Веду тетрадь ошибок: записываю каждый корень и ставлю зелёную галочку.', 'I keep a mistake notebook: each root gets a green tick once closed.') },
  { id: 't9', author: 'Nodira Saidova', city: 'Namangan', tag: 'teacher', likes: 19, text: tri("Ota-onalar majlisida sinf xaritasini koʻrsating — savollar kamayadi, hamkorlik koʻpayadi.", 'Показывайте карту класса на родительском собрании — меньше вопросов, больше сотрудничества.', 'Show the class map at parent meetings — fewer complaints, more teamwork.') },
  { id: 't10', author: 'Feruza Xolmatova', city: 'Urganch', tag: 'parent', likes: 24, text: tri("Ikki bola boʻlsa, kattasini \"buvijon kartochkasi\"ni kichigiga berishga qoʻying.", 'Если детей двое, пусть старший задаёт младшему вопросы с карточки.', "With two kids, let the older one quiz the younger with the card.") },
  { id: 't11', author: 'Sardor Aliyev', city: "Fargʻona", tag: 'student', likes: 18, text: tri("Xato javobni yashirmang — skanerga bering. Xato — bu xarita.", 'Не прячьте неправильный ответ — отдайте его сканеру. Ошибка — это карта.', "Don't hide a wrong answer — scan it. A mistake is a map.") },
  { id: 't12', author: 'Ilhom Sobirov', city: 'Chirchiq', tag: 'teacher', likes: 15, text: tri("Yangi guruhni birinchi kuni 5 ta masala bilan diagnostika qiling.", 'Проводите диагностику новой группы в первый день по 5 задачам.', 'Diagnose a new group on day one with 5 problems.') },
  { id: 't13', author: 'Zarina Abdullayeva', city: "Qoʻqon", tag: 'parent', likes: 31, text: tri("Vaqt farqi boʻlsa ham, yakshanba hisobotini birga tinglang — video qoʻngʻiroqda.", 'Даже при разнице во времени слушайте воскресный отчёт вместе — по видеосвязи.', 'Even across time zones, listen to the Sunday report together on a video call.') },
  { id: 't14', author: 'Otabek Rasulov', city: 'Guliston', tag: 'student', likes: 12, text: tri("Yordamchiga \"1/2+1/3\" deb yozing — u qadamlarini koʻrsatadi.", 'Напишите помощнику «1/2+1/3» — он покажет шаги.', "Type '1/2+1/3' to the assistant — it shows the steps.") },
  { id: 't15', author: 'Shahnoza Mirzayeva', city: 'Navoiy', tag: 'teacher', likes: 11, text: tri("Analogiyalar ishlaydi: non, bozor, avtobus — bolalar hayotidan misol oling.", 'Аналогии работают: лепёшка, базар, автобус — берите примеры из жизни детей.', "Analogies work: bread, bazaar, bus — use examples from kids' lives.") },
  { id: 't16', author: 'Mohinur Ismoilova', city: 'Samarqand', tag: 'student', likes: 14, text: tri("Kunlik maqsadning 3 ta vazifasini bajarsangiz, bonus ball beriladi!", 'Выполните 3 задачи дневной цели — получите бонус!', 'Finish all 3 daily-goal tasks for bonus points!') },
];

export const SEED_REVIEWS: Review[] = [
  { id: 'r1', name: 'Dilnoza R.', city: 'Samarqand', rating: 5, date: '2026-10-12', text: tri("Eng foydali ta'lim ilovasi. Qizimning muammosi 5-sinfda ekan!", 'Самое полезное приложение. Оказывается, проблема дочери — с 5 класса!', "The most useful learning app. My daughter's problem was from grade 5!") },
  { id: 'r2', name: 'Anvar T.', city: 'Toshkent', rating: 5, date: '2026-10-11', text: tri('Vaqt mashinasi — haqiqiy WOW. Bolam o\'zi qiziqib ochadi.', 'Машина времени — настоящий вау. Сын открывает сам.', 'The Time Machine is a real wow. My son opens it on his own.') },
  { id: 'r3', name: 'Gulchehra M.', city: 'Buxoro', rating: 4, date: '2026-10-10', text: tri("Juda yaxshi, fizika ham qoʻshilsa zoʻr boʻlardi.", 'Очень хорошо, хотелось бы ещё физику.', 'Great — would love physics too.') },
  { id: 'r4', name: 'Bahodir N.', city: 'Qarshi', rating: 5, date: '2026-10-09', text: tri("Rossiyadan turib oʻgʻlimni kuzataman. Rahmat!", 'Слежу за сыном из России. Спасибо!', 'I follow my son from Russia. Thank you!') },
  { id: 'r5', name: 'Saida K.', city: 'Nukus', rating: 5, date: '2026-10-08', text: tri("Qoraqalpogʻistondagi sekin internetda ham ishladi.", 'Работает даже на медленном интернете в Каракалпакстане.', 'Works even on slow internet in Karakalpakstan.') },
  { id: 'r6', name: 'Jasur O.', city: 'Andijon', rating: 4, date: '2026-10-07', text: tri("Yaxshi, lekin koʻproq masala boʻlsin.", 'Хорошо, но хочется больше задач.', 'Good, but I want more problems.') },
  { id: 'r7', name: 'Mavluda S.', city: "Fargʻona", rating: 5, date: '2026-10-06', text: tri("Buvijon rejimi — onam uchun ajoyib. Katta harflar, oddiy savollar.", 'Режим бабушки — отлично для моей мамы. Крупный шрифт, простые вопросы.', 'Grandma mode is perfect for my mom. Big letters, simple questions.') },
  { id: 'r8', name: 'Rasul A.', city: 'Termiz', rating: 5, date: '2026-10-05', text: tri("Repetitorga oyiga 600 ming soʻm berardik. Endi kerak emas.", 'Платили репетитору 600 тысяч в месяц. Больше не нужно.', "We paid a tutor 600k soʻm a month. Not needed now.") },
  { id: 'r9', name: 'Nargiza U.', city: 'Namangan', rating: 4, date: '2026-10-04', text: tri("Oʻqituvchi sifatida sinf xaritasidan har hafta foydalanaman.", 'Как учитель пользуюсь картой класса каждую неделю.', 'As a teacher I use the class map every week.') },
  { id: 'r10', name: 'Sherzod B.', city: 'Urganch', rating: 5, date: '2026-10-03', text: tri("Javob bermaydi — bu eng yaxshi tomoni. Bola oʻylashni oʻrganadi.", 'Не даёт ответ — и это лучшее. Ребёнок учится думать.', "It won't give the answer — that's the best part. Kids learn to think.") },
  { id: 'r11', name: 'Lola H.', city: 'Navoiy', rating: 5, date: '2026-10-02', text: tri('Dizayn chiroyli, o\'zbekcha tushuntirish tushunarli.', 'Красивый дизайн, понятные объяснения на узбекском.', 'Beautiful design, clear explanations in Uzbek.') },
  { id: 'r12', name: 'Dostonbek E.', city: 'Jizzax', rating: 4, date: '2026-10-01', text: tri('Seriya meni har kuni qaytaradi 🔥', 'Серия возвращает меня каждый день 🔥', 'The streak brings me back every day 🔥') },
  { id: 'r13', name: 'Munisa X.', city: 'Guliston', rating: 5, date: '2026-09-30', text: tri("Bolam birinchi marta \"matematika qiziq\" dedi.", 'Сын впервые сказал «математика — интересно».', "My son said 'math is fun' for the first time.") },
  { id: 'r14', name: 'Akmal Y.', city: 'Chirchiq', rating: 5, date: '2026-09-29', text: tri("Oʻquv markazimizda diagnostika uchun ishlatamiz.", 'Используем в нашем учебном центре для диагностики.', 'We use it for diagnostics at our learning center.') },
  { id: 'r15', name: 'Hilola D.', city: 'Xiva', rating: 4, date: '2026-09-28', text: tri("Ruscha versiyasi ham bor ekan — rus maktabidagi oʻgʻlim uchun qulay.", 'Есть и русская версия — удобно для сына в русской школе.', 'There is a Russian version too — handy for my son at a Russian school.') },
  { id: 'r16', name: 'Farhod Q.', city: 'Denov', rating: 5, date: '2026-09-27', text: tri("Telefonim eski, lekin hammasi tez ishlaydi.", 'Телефон старый, но всё работает быстро.', 'My phone is old, but everything runs fast.') },
];

export interface School { id: string; name: string; city: string; type: 'school' | 'center'; lat: number; lng: number; students: number; roots: number; growth: number }

export const SCHOOLS: School[] = [
  { id: 's1', name: '110-maktab', city: 'Toshkent', type: 'school', lat: 41.2995, lng: 69.2401, students: 820, roots: 2310, growth: 21 },
  { id: 's2', name: '27-maktab', city: 'Samarqand', type: 'school', lat: 39.6542, lng: 66.9597, students: 640, roots: 1820, growth: 18 },
  { id: 's3', name: '5-IDUM', city: 'Buxoro', type: 'school', lat: 39.7747, lng: 64.4286, students: 510, roots: 1460, growth: 24 },
  { id: 's4', name: '14-maktab', city: "Fargʻona", type: 'school', lat: 40.3864, lng: 71.7864, students: 590, roots: 1690, growth: 19 },
  { id: 's5', name: '3-maktab', city: 'Nukus', type: 'school', lat: 42.46, lng: 59.61, students: 430, roots: 1310, growth: 27 },
  { id: 's6', name: '12-maktab', city: 'Qarshi', type: 'school', lat: 38.8606, lng: 65.7891, students: 700, roots: 2140, growth: 29 },
  { id: 's7', name: '41-maktab', city: 'Namangan', type: 'school', lat: 40.9983, lng: 71.6726, students: 560, roots: 1580, growth: 17 },
  { id: 's8', name: '9-maktab', city: 'Andijon', type: 'school', lat: 40.7821, lng: 72.3442, students: 610, roots: 1720, growth: 20 },
  { id: 's9', name: '2-maktab', city: 'Termiz', type: 'school', lat: 37.2242, lng: 67.2783, students: 380, roots: 1190, growth: 31 },
  { id: 's10', name: '18-maktab', city: 'Urganch', type: 'school', lat: 41.55, lng: 60.6333, students: 450, roots: 1270, growth: 22 },
  { id: 's11', name: '7-maktab', city: 'Navoiy', type: 'school', lat: 40.0844, lng: 65.3792, students: 400, roots: 1050, growth: 16 },
  { id: 's12', name: '6-maktab', city: 'Jizzax', type: 'school', lat: 40.1158, lng: 67.8422, students: 350, roots: 990, growth: 23 },
  { id: 's13', name: '1-maktab', city: 'Guliston', type: 'school', lat: 40.4897, lng: 68.7842, students: 300, roots: 870, growth: 25 },
  { id: 's14', name: '4-maktab', city: 'Nurafshon', type: 'school', lat: 41.0167, lng: 69.3417, students: 320, roots: 910, growth: 18 },
  { id: 's15', name: '"Bilim nuri" markazi', city: 'Shahrisabz', type: 'center', lat: 39.0578, lng: 66.8342, students: 180, roots: 640, growth: 33 },
  { id: 's16', name: '"Iqtidor" markazi', city: "Qoʻqon", type: 'center', lat: 40.5286, lng: 70.9425, students: 210, roots: 700, growth: 26 },
  { id: 's17', name: '"Zukko" markazi', city: "Margʻilon", type: 'center', lat: 40.4711, lng: 71.7247, students: 160, roots: 520, growth: 28 },
  { id: 's18', name: '"Kelajak" markazi', city: 'Chirchiq', type: 'center', lat: 41.4689, lng: 69.5822, students: 240, roots: 760, growth: 21 },
  { id: 's19', name: '"Xorazm ilmi" markazi', city: 'Xiva', type: 'center', lat: 41.3783, lng: 60.3639, students: 140, roots: 450, growth: 30 },
  { id: 's20', name: '"Surxon bilim" markazi', city: 'Denov', type: 'center', lat: 38.2667, lng: 67.9, students: 130, roots: 410, growth: 34 },
];

export const REGIONS: { name: Tri; students: number; roots: number }[] = [
  { name: tri('Toshkent sh.', 'г. Ташкент', 'Tashkent city'), students: 2140, roots: 6820 },
  { name: tri('Qashqadaryo', 'Кашкадарья', 'Kashkadarya'), students: 1680, roots: 5730 },
  { name: tri('Samarqand', 'Самарканд', 'Samarkand'), students: 1420, roots: 4510 },
  { name: tri("Fargʻona", 'Фергана', 'Fergana'), students: 1310, roots: 4170 },
  { name: tri('Andijon', 'Андижан', 'Andijan'), students: 990, roots: 3060 },
  { name: tri('Namangan', 'Наманган', 'Namangan'), students: 920, roots: 2880 },
  { name: tri('Buxoro', 'Бухара', 'Bukhara'), students: 810, roots: 2610 },
  { name: tri('Surxondaryo', 'Сурхандарья', 'Surkhandarya'), students: 760, roots: 2540 },
  { name: tri("Qoraqalpogʻiston", 'Каракалпакстан', 'Karakalpakstan'), students: 640, roots: 2190 },
  { name: tri('Xorazm', 'Хорезм', 'Khorezm'), students: 590, roots: 1870 },
  { name: tri('Toshkent vil.', 'Ташкентская обл.', 'Tashkent region'), students: 560, roots: 1690 },
  { name: tri('Navoiy', 'Навои', 'Navoi'), students: 300, roots: 960 },
  { name: tri('Jizzax', 'Джизак', 'Jizzakh'), students: 280, roots: 930 },
  { name: tri('Sirdaryo', 'Сырдарья', 'Syrdarya'), students: 210, roots: 700 },
];

/** Monthly platform growth (pilot projection) */
export const GROWTH = [
  { m: tri('Yan', 'Янв', 'Jan'), students: 420, roots: 1100 },
  { m: tri('Fev', 'Фев', 'Feb'), students: 780, roots: 2300 },
  { m: tri('Mar', 'Мар', 'Mar'), students: 1300, roots: 4000 },
  { m: tri('Apr', 'Апр', 'Apr'), students: 2100, roots: 6600 },
  { m: tri('May', 'Май', 'May'), students: 2900, roots: 9400 },
  { m: tri('Iyn', 'Июн', 'Jun'), students: 3500, roots: 11800 },
  { m: tri('Iyl', 'Июл', 'Jul'), students: 4300, roots: 14200 },
  { m: tri('Avg', 'Авг', 'Aug'), students: 5600, roots: 18100 },
  { m: tri('Sen', 'Сен', 'Sep'), students: 8200, roots: 26300 },
  { m: tri('Okt', 'Окт', 'Oct'), students: 12480, roots: 38920 },
];

/** Class used on the teacher screen: 7-B, 24 students */
export const CLASS_TOPICS = ['lcd', 'fracAdd', 'negAdd', 'negMul', 'brackets', 'likeTerms', 'linearEq', 'powers'];
const CLASS_NAMES = [
  'Jasur Karimov', 'Malika Yusupova', 'Sardor Aliyev', 'Mohinur Ismoilova', 'Javohir Toshpulatov', 'Sevara Nurmatova',
  'Otabek Rasulov', 'Diyora Sultonova', 'Shohruh Mamatov', 'Madina Qosimova', 'Bobur Xudoyberdiyev', 'Nilufar Ahmedova',
  'Asadbek Normurodov', "Ruxshona Gʻaniyeva", 'Ulugbek Raximov', 'Zilola Eshonqulova', 'Temur Abdurahmonov', 'Sabina Jumayeva',
  'Islom Haydarov', 'Kamola Hasanova', 'Abdulloh Yo\'ldoshev', 'Gulruh Sobirova', 'Behruz Olimov', 'Charos Ne\'matova',
];
const rnd = seeded(7);
// lcd and fracAdd are intentionally weak for most of the class
const BIAS: Record<string, number> = { lcd: -20, fracAdd: -14, negAdd: -5, negMul: 0, brackets: -12, likeTerms: -8, linearEq: -15, powers: 8 };
export const CLASS_STUDENTS = CLASS_NAMES.map((name, i) => ({
  id: 'c' + i,
  name,
  scores: Object.fromEntries(CLASS_TOPICS.map((t) => [t, Math.max(8, Math.min(98, Math.round(62 + BIAS[t] + (rnd() - 0.5) * 60)))])) as Record<string, number>,
}));

export const FAQ: { q: Tri; a: Tri }[] = [
  { q: tri('IldizAI oddiy ChatGPT emasmi?', 'IldizAI — это просто ChatGPT?', 'Is IldizAI just ChatGPT?'),
    a: tri("Yoʻq. Yadromiz — Oʻzbekiston maktab dasturi boʻyicha qurilgan mavzular grafi. Tashxisni graf va 3 ta tekshiruv savoli qoʻyadi, javobni oʻylab topmaydi.", 'Нет. Ядро — граф тем по школьной программе Узбекистана. Диагноз ставят граф и 3 проверочных вопроса, а не генерация.', "No. Our core is a topic graph built on Uzbekistan's school curriculum. The graph and 3 check questions make the diagnosis — nothing is made up.") },
  { q: tri('Bola javobni ko\'chirib olmaydimi?', 'Не будет ли ребёнок списывать?', 'Won’t kids just copy answers?'),
    a: tri("IldizAI tayyor javob bermaydi. Faqat ishoralar zinapoyasi: har safar bitta qadam.", 'IldizAI не даёт готовых ответов — только лестницу подсказок, по одному шагу.', 'IldizAI never gives the final answer — only a ladder of hints, one step at a time.') },
  { q: tri("AI xato tashxis qoʻysa-chi?", 'А если диагноз неверный?', 'What if the diagnosis is wrong?'),
    a: tri("Bitta xatoga qarab xulosa qilinmaydi. Gipoteza 3 savol bilan tekshiriladi va ishonch foizi koʻrsatiladi. Xato boʻlsa ham zarari — 5 daqiqa mashq.", 'Вывод не делается по одной ошибке. Гипотезу проверяют 3 вопроса, показывается уверенность. Даже при ошибке цена — 5 минут практики.', 'Never from one mistake. The hypothesis is tested with 3 questions and a confidence score is shown. Worst case: 5 minutes of extra practice.') },
  { q: tri('Internet sekin bo\'lsa ishlaydimi?', 'Работает ли при медленном интернете?', 'Does it work on slow internet?'),
    a: tri("Ha. Yengil rejim animatsiyalarni oʻchiradi, ma'lumotlar qurilmada saqlanadi.", 'Да. Лёгкий режим отключает анимации, данные хранятся на устройстве.', 'Yes. Lite mode turns off animations and data is stored on the device.') },
  { q: tri('Kim pul to\'laydi?', 'Кто платит?', 'Who pays?'),
    a: tri("Kuniga 3 ta tahlil bepul. Oilaviy obuna — bitta repetitor darsidan arzon; koʻpincha chet elda ishlayotgan ota-ona toʻlaydi. Maktablar uchun B2B.", '3 анализа в день бесплатно. Семейная подписка дешевле одного занятия с репетитором; часто платит родитель за рубежом. Для школ — B2B.', '3 analyses a day are free. A family plan costs less than one tutoring session — often paid by a parent working abroad. Schools get B2B.') },
  { q: tri('Qaysi sinflar va fanlar?', 'Какие классы и предметы?', 'Which grades and subjects?'),
    a: tri("Hozir 5–9-sinf matematikasi (30 mavzu). Keyingi bosqichda fizika va kimyo.", 'Сейчас математика 5–9 классов (30 тем). Далее — физика и химия.', 'Grades 5–9 math today (30 topics). Physics and chemistry next.') },
  { q: tri("Ota-ona smartfondan foydalana olmasa-chi?", 'А если родитель не умеет пользоваться смартфоном?', "What if a parent can't use a smartphone well?"),
    a: tri("Hisobot oʻzbekcha ovozli xabar sifatida Telegramga keladi — faqat tinglash kifoya.", 'Отчёт приходит в Telegram голосовым сообщением на узбекском — достаточно послушать.', 'The report arrives in Telegram as an Uzbek voice message — just press play.') },
  { q: tri("Ma'lumotlarim xavfsizmi?", 'Мои данные в безопасности?', 'Is my data safe?'),
    a: tri("Demo versiyada barcha ma'lumotlar faqat sizning brauzeringizda saqlanadi. Maktablar uchun faqat anonim statistika.", 'В демо все данные хранятся только в вашем браузере. Для школ — только анонимная статистика.', 'In this demo all data lives only in your browser. Schools see anonymous statistics only.') },
];
