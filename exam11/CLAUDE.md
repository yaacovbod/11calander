@AGENTS.md

# exam11 — לוח מבחנים שכבת י"א נעימת הלב

## מטרת הפרויקט
לוח מבחנים ואירועים לשכבת י"א בבית הספר נעימת הלב, עם תצוגת אירועים כרונולוגית ולוח שנה.

## טכנולוגיות
- Next.js 16.2.3, React 19
- TypeScript, Tailwind CSS v4
- פריסה: GitHub repo `yaacovbod/11calander`

## מבנה קבצים מרכזי
- `src/app/page.tsx` — דף הבית: כותרת, לוגו, תאריך עדכון אחרון
- `src/app/globals.css` — עיצוב גלובלי, ערכת צבעים Golden Hour, RTL
- `src/data/events.ts` — כל הנתונים: אירועים, קטגוריות, צבעים, CUTOFF_DATE
- `src/components/SchedulePage.tsx` — תצוגת אירועים עם פיצ'ר עבר/עתיד
- `src/components/EventCard.tsx` — כרטיס אירוע עם טאבים, תגיות, כפתורי Google/Apple Calendar
- `src/components/CalendarView.tsx` — תצוגת לוח שנה חודשי (אפריל–יולי 2026)
- `src/components/FloatingElements.tsx` — אנימציית אלמנטים צפים ברקע
- `public/neimat.png` — לוגו בית הספר

## נתוני האירועים (`events.ts`)
- **קטגוריות:** `bagrut`, `metakonet`, `holiday`, `army`, `mivhan`, `gdna`, `special`, `memorial`, `trip`
- **CUTOFF_DATE:** 10/07/2026 — תאריך שמעבר לו CalendarView מציג "🚧 בבנייה"
- **טווח אירועים:** אפריל 2026 עד יולי 2026
- **מבנה DateItem:** `start/end` בפורמט YYYYMMDD, `day` (שם היום בעברית), `display` (תצוגה), `events[]`
- אירועים מרובי-ימים: שדה `day` מכיל "ראשון עד חמישי" (לא מספרים)

## פילטר קטגוריות (`SchedulePage.tsx`)
הלג'נד הוחלף בכפתורי פילטר לחיצים. קליק על אותו כפתור שוב מבטל את הסינון (toggle). ארבע קבוצות מאוחדות:
- **מבחן** — כולל `mivhan` + `metakonet` (מבחנים ומתכונות)
- **בגרויות** — כולל `bagrut`
- **מועדים וחגים** — כולל `holiday` + `memorial` + `special`
- **פעילות וטיולים** — כולל `army` + `trip` (גדנ"ע, צו ראשון, טיול שנתי)

## קהל יעד
תלמידי ומורי שכבת י"א, הורים — צפייה בלוח מבחנים ומתכונות לשנת הלימודים תשפ"ו
