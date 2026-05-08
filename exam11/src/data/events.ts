export type EventCategory = 'bagrut' | 'metakonet' | 'holiday' | 'army' | 'mivhan' | 'gdna' | 'special' | 'memorial' | 'trip'

export interface EventItem {
  title: string
  cat: EventCategory
  tags: string[]
  time?: string   // HH:MM
}

export interface DateItem {
  start: string   // YYYYMMDD
  end: string     // YYYYMMDD
  day: string
  display: string
  events: EventItem[]
}

export interface MonthGroup {
  month: string
  items: DateItem[]
}

export const CUTOFF_DATE = new Date(2026, 7, 1) // 01/08/2026 — past end of calendar

export const schedule: MonthGroup[] = [
  {
    month: 'אפריל 2026',
    items: [
      { start: '20260409', end: '20260410', day: 'יום חמישי', display: '09/04/2026', events: [
        { title: 'חזרה מחופשת הפסח', cat: 'holiday', tags: [] },
      ]},
      { start: '20260414', end: '20260415', day: 'יום שלישי', display: '14/04/2026', events: [
        { title: 'יום השואה', cat: 'memorial', tags: ['יום זיכרון'] },
      ]},
      { start: '20260415', end: '20260416', day: 'יום רביעי', display: '15/04/2026', events: [
        { title: 'מתכונת באנגלית', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260420', end: '20260421', day: 'יום שני', display: '20/04/2026', events: [
        { title: 'מתכונת ראשונה במתמטיקה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260421', end: '20260422', day: 'יום שלישי', display: '21/04/2026', events: [
        { title: 'יום הזיכרון', cat: 'memorial', tags: ['יום זיכרון'] },
      ]},
      { start: '20260422', end: '20260423', day: 'יום רביעי', display: '22/04/2026', events: [
        { title: 'יום העצמאות', cat: 'holiday', tags: ['חופש'] },
      ]},
      { start: '20260423', end: '20260424', day: 'יום חמישי', display: '23/04/2026', events: [
        { title: 'מתכונת באנגלית', cat: 'metakonet', tags: ['מתכונת'] },
        { title: 'מתכונת בפיזיקה',  cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260426', end: '20260501', day: 'ראשון עד חמישי', display: '26/04 – 30/04/2026', events: [
        { title: 'שבוע גדנ"ע', cat: 'army', tags: ['הכנה לצה"ל'] },
      ]},
      { start: '20260430', end: '20260501', day: 'יום חמישי', display: '30/04/2026', events: [
        { title: 'בגרות ברוסית', cat: 'bagrut', tags: ['בגרות'] },
      ]},
    ],
  },
  {
    month: 'מאי 2026',
    items: [
      { start: '20260504', end: '20260505', day: 'יום שני', display: '04/05/2026', events: [
        { title: 'מתכונת שנייה במתמטיקה', cat: 'metakonet', tags: ['מתכונת'] },
        { title: 'מתכונת בניהול עסקי (כיתת אתגר)', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260505', end: '20260506', day: 'יום שלישי', display: '05/05/2026', events: [
        { title: 'לג בעומר', cat: 'holiday', tags: ['חופש'] },
      ]},
      { start: '20260506', end: '20260507', day: 'יום רביעי', display: '06/05/2026', events: [
        { title: 'מתכונת באנגלית', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260507', end: '20260508', day: 'יום חמישי', display: '07/05/2026', events: [
        { title: 'בגרות בלשון',             cat: 'bagrut',    tags: ['בגרות'], time: '13:00' },
        { title: 'מתכונת שיפור במתמטיקה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260510', end: '20260511', day: 'יום ראשון', display: '10/05/2026', events: [
        { title: 'מתכונת שיפור במתמטיקה לניגשי לשון', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260512', end: '20260513', day: 'יום שלישי', display: '12/05/2026', events: [
        { title: 'בגרות מתמטיקה 4 יח"ל', cat: 'bagrut', tags: ['בגרות'], time: '09:00' },
        { title: 'בגרות מתמטיקה 3 יח"ל', cat: 'bagrut', tags: ['בגרות'], time: '14:00' },
      ]},
      { start: '20260513', end: '20260514', day: 'יום רביעי', display: '13/05/2026', events: [
        { title: 'בגרות במתמטיקה 5 יח"ל', cat: 'bagrut', tags: ['בגרות'], time: '09:00' },
        { title: 'מתכונת משלימים באנגלית', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260514', end: '20260515', day: 'יום חמישי', display: '14/05/2026', events: [
        { title: 'צו ראשון', cat: 'army', tags: ['הכנה לצה"ל'] },
      ]},
      { start: '20260517', end: '20260518', day: 'יום ראשון', display: '17/05/2026', events: [
        { title: 'מתכונת בפיזיקה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260518', end: '20260519', day: 'יום שני', display: '18/05/2026', events: [
        { title: 'בגרות באנגלית 5 יח"ל', cat: 'bagrut', tags: ['בגרות'], time: '11:00' },
        { title: 'בגרות באנגלית 3 יח"ל', cat: 'bagrut', tags: ['בגרות'], time: '13:30' },
      ]},
      { start: '20260519', end: '20260520', day: 'יום שלישי', display: '19/05/2026', events: [
        { title: 'בגרות באנגלית 4 יח"ל', cat: 'bagrut', tags: ['בגרות'], time: '11:30' },
      ]},
      { start: '20260520', end: '20260521', day: 'יום רביעי', display: '20/05/2026', events: [
        { title: 'מתכונת בניהול עסקי', cat: 'metakonet', tags: ['מתכונת'] },
        { title: 'מתכונת מידע ונתונים', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260521', end: '20260523', day: 'חמישי ושישי', display: '21–22/05/2026', events: [
        { title: 'שבועות', cat: 'holiday', tags: ['חופש'] },
      ]},
      { start: '20260524', end: '20260525', day: 'יום ראשון', display: '24/05/2026', events: [
        { title: 'טיול לעיר דוד בירושלים', cat: 'trip', tags: ['טיול'] },
      ]},
      { start: '20260528', end: '20260529', day: 'יום חמישי', display: '28/05/2026', events: [
        { title: 'מתכונת במדעי המחשב', cat: 'metakonet', tags: ['מתכונת'] },
        { title: 'בגרות תנ"ך', cat: 'bagrut', tags: ['בגרות'], time: '12:00' },
      ]},
      { start: '20260531', end: '20260601', day: 'יום ראשון', display: '31/05/2026', events: [
        { title: 'הדמייה מידע ונתונים', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
    ],
  },
  {
    month: 'יוני 2026',
    items: [
      { start: '20260601', end: '20260602', day: 'יום שני', display: '01/06/2026', events: [
        { title: 'מבחן בביולוגיה', cat: 'mivhan', tags: ['מבחן'] },
        { title: 'מתכונת בפסיכולוגיה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260602', end: '20260603', day: 'יום שלישי', display: '02/06/2026', events: [
        { title: 'מתכונת בפיזיקה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260604', end: '20260605', day: 'יום חמישי', display: '04/06/2026', events: [
        { title: 'בגרות בניהול עסקי', cat: 'bagrut', tags: ['בגרות'], time: '13:00' },
        { title: 'מבחן באומנות', cat: 'mivhan', tags: ['מבחן'] },
        { title: 'מבחן בתקשורת', cat: 'mivhan', tags: ['מבחן'] },
        { title: 'מתכונת במוט"ל', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260608', end: '20260609', day: 'יום שני', display: '08/06/2026', events: [
        { title: 'בגרות פנימית בספרות', cat: 'bagrut', tags: ['בגרות'] },
      ]},
      { start: '20260610', end: '20260611', day: 'יום רביעי', display: '10/06/2026', events: [
        { title: 'מתכונת בפיזיקה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260611', end: '20260612', day: 'יום חמישי', display: '11/06/2026', events: [
        { title: 'בגרות פנימית בספרות מועד ב\'', cat: 'bagrut', tags: ['בגרות', 'מועד ב\''] },
      ]},
      { start: '20260615', end: '20260616', day: 'יום שני', display: '15/06/2026', events: [
        { title: 'בגרות במוט"ל', cat: 'bagrut', tags: ['בגרות'], time: '10:00' },
        { title: 'בגרות בפיזיקה', cat: 'bagrut', tags: ['בגרות'], time: '13:00' },
        { title: 'מתכונת בפסיכולוגיה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260616', end: '20260617', day: 'יום שלישי', display: '16/06/2026', events: [
        { title: 'טיול לדרום רמת הגולן', cat: 'trip', tags: ['טיול'] },
      ]},
      { start: '20260618', end: '20260619', day: 'יום חמישי', display: '18/06/2026', events: [
        { title: '🎓 יום אחרון ללימודים! 🎓', cat: 'special', tags: ['יום אחרון'] },
      ]},
      { start: '20260622', end: '20260623', day: 'יום שני', display: '22/06/2026', events: [
        { title: 'בגרות בפסיכולוגיה', cat: 'bagrut', tags: ['בגרות'], time: '09:00' },
      ]},
      { start: '20260625', end: '20260626', day: 'יום חמישי', display: '25/06/2026', events: [
        { title: 'בגרות במידע ונתונים', cat: 'bagrut', tags: ['בגרות'], time: '12:45' },
        { title: 'בגרות במדעי המחשב', cat: 'bagrut', tags: ['בגרות'], time: '12:30' },
      ]},
      { start: '20260629', end: '20260630', day: 'יום שני', display: '29/06/2026', events: [
        { title: 'בגרות מדעי המחשב (תלמידי מידע ונתונים)', cat: 'bagrut', tags: ['בגרות'] },
      ]},
      { start: '20260630', end: '20260701', day: 'יום שלישי', display: '30/06/2026', events: [
        { title: 'בגרות באנגלית (מועד ב\')', cat: 'bagrut', tags: ['בגרות', 'מועד ב\''] },
      ]},
    ],
  },
  {
    month: 'יולי 2026',
    items: [
      { start: '20260706', end: '20260707', day: 'יום שני', display: '06/07/2026', events: [
        { title: 'בגרות במתמטיקה (מועד ב\')', cat: 'bagrut', tags: ['בגרות', 'מועד ב\''] },
      ]},
      { start: '20260709', end: '20260710', day: 'יום חמישי', display: '09/07/2026', events: [
        { title: 'בגרות בלשון (מועד ב\')', cat: 'bagrut', tags: ['בגרות', 'מועד ב\''] },
      ]},
    ],
  },
]

export const catColors: Record<EventCategory, { bg: string; color: string; border: string }> = {
  bagrut:    { bg: '#fceee8', color: '#8B2200', border: '#d4a090' },
  metakonet: { bg: '#e8f0f8', color: '#1A4A6B', border: '#90b8d8' },
  holiday:   { bg: '#eaf4ec', color: '#2A6030', border: '#90c898' },
  army:      { bg: '#eaedda', color: '#3D4E1A', border: '#8A9A50' },
  mivhan:    { bg: '#e4f5f2', color: '#1A7A6A', border: '#80c4b8' },
  gdna:      { bg: '#fdf5d8', color: '#7A5000', border: '#e0c050' },
  special:   { bg: '#fdf0e0', color: '#7A3000', border: '#e0b070' },
  memorial:  { bg: '#ededf0', color: '#2a2a3a', border: '#9090a8' },
  trip:      { bg: '#e8f4fd', color: '#1A4A6B', border: '#80b8d8' },
}
