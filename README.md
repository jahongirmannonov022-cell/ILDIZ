# IldizAI — Javobni emas, sababni topadi

> Coddycamp IT Academy · Hackathon 2026 · Mavzu: **Zamonaviy ta'lim**

**IldizAI** — o'quvchi xatosining *ildizini* oldingi sinflardan topadigan platforma.
7-sinfdagi tenglamadagi xato ko'pincha 5-sinfda tushunilmay qolgan "umumiy maxraj"dan keladi.
IldizAI xato javobni tahlil qiladi, **Vaqt mashinasi** bilan mavzular grafi bo'ylab orqaga yuradi,
3 ta savol bilan ildizni tasdiqlaydi va faqat o'sha bo'shliqni 5 daqiqalik mikro-dars bilan yopadi.
Natija ota-onaga o'zbekcha ovozli hisobot sifatida yuboriladi.

## Asosiy imkoniyatlar

| | Funksiya | Qayerda |
|---|---|---|
| 👨‍👩‍👦 | **Ikki platforma** — oʻquvchi (binafsha) va ota-ona (yashil-moviy) uchun alohida menyu, bosh sahifa va rang; yon menyuda almashtirish | `/app` |
| 🧑‍🏫 | **Support ustozlar** — ildizga mos ustoz, vaqt band qilish, "2 daqiqada ulanish", onlayn dars xonasi (video, doska, chat, baholash) | `/app/tutors`, `/app/session/:id` |
| 🏆 | **Bogʻlar reytingi** — boshqa oʻquvchilarning bogʻlarini koʻrish va suv quyish, oylik reyting (oy/shahar/sinf filtri), Top 5 ga har oy har xil sovgʻalar | `/app/achievements?tab=rating`, `/app/gardens/:id` |
| 🌷 | **Yutuqlar bogʻi** — har bir yutuq gul yoki daraxt ekadi (animatsiya), markaziy daraxt darajaga qarab oʻsadi, ildizlari yopilgan boʻshliqlar | `/app/achievements` |
| ⏪ | **Vaqt mashinasi (WOW)** — xato → skaner → sinflar bo'ylab orqaga → 3 savol → ildiz | `/app/scan` |
| 📗 | 5 daqiqalik mikro-dars: g'oya, analogiya, misol, ishoralar zinapoyasi, tekshiruv | `/app/lesson/:id` |
| 🗺️ | Bilim xaritasi: 5–9-sinf 30 mavzusi va bog'lanishlari | `/app/map` |
| 📣 | Ota-ona hisoboti: avtomatik matn, ovozli o'qish, Telegram ko'rinishi | `/app/parent` |
| 👵 | Buvijon rejimi: katta harfli savol kartochkalari, chop etish | `/app/grandma` |
| 🏫 | Sinf xaritasi: 24 o'quvchi issiqlik xaritasi, CSV eksport | `/app/teacher` |
| 🤖 | Aqlli yordamchi: kasr/tenglamani qadamma-qadam yechadi (internetsiz) | `/app/assistant` |
| 🏆 | Ball, daraja (Urug' → Chinor), seriya, 16 nishon, kunlik maqsad | `/app/achievements` |
| 👥 | Reyting, maslahatlar (like), sharhlar (yulduzcha) | `/app/community` |
| 📍 | Pilot xaritasi (Leaflet + OpenStreetMap) | `/app/schools` |
| 📊 | Ijtimoiy ta'sir statistikasi | `/impact`, `/app/impact` |
| 🔔 | Bildirishnomalar va eslatmalar (vaqt bo'yicha ishga tushadi) | `/app/notifications` |
| 🌐 | O'zbek / Rus / Ingliz tillari, yorug'/tungi rejim, yengil rejim | har sahifada |

Demo: login sahifasida **Oʻquvchi** (Jasur) yoki **Ota-ona** (Rustam aka) tugmasini bosing.

## Texnologiyalar

React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · Framer Motion · Recharts · Lucide icons ·
React Router 6 · Leaflet / React-Leaflet · canvas-confetti · Fontsource (Plus Jakarta Sans, Caveat)

- **API kalitlari yo'q, pullik xizmat yo'q.** Barcha ma'lumotlar `src/data/` ichida, foydalanuvchi o'zgarishlari `localStorage`da.
- "Aqlli" qism qoidalarga asoslangan: `src/lib/diagnose.ts` (xato → noto'g'ri tushuncha → prerekvizit zanjiri),
  `src/lib/recommend.ts` (tavsiyalar formulasi), `src/lib/assistant.ts` (intentlar + matematik yechuvchi).
- Ovoz brauzerning Web Speech API orqali ishlaydi.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ papkasiga statik build
npm run preview
```

Vercel: repozitoriyni ulang — sozlash shart emas. `vercel.json` SPA rewrite'lari sahifa yangilanganda 404 bo'lishining oldini oladi.

## Papka tuzilmasi

```
src/
  components/   AppLayout, PublicNav, ui (Reveal, CountUp, Stat…), Controls, Overlays
  data/         topics (graf), problems, questions, lessons, mock
  lib/          types, utils, diagnose, recommend, assistant, game, seed, confetti
  pages/        Landing, Auth, Onboarding, Dashboard, Scan (WOW), Lesson, KnowledgeMap, …
  store/        AppContext (holat, auth, i18n, toast, nishonlar)
```

> ⚠️ Landing va Impact sahifalaridagi raqamlar — demo/pilot prognozi. Taqdimotdan oldin rasmiy
> manbalar (stat.uz, OECD PISA 2022, World Bank, vazirlik saytlari) bilan tekshiring.
