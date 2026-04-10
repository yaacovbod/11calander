export type EventCategory = 'bagrut' | 'metakonet' | 'holiday' | 'army' | 'mivhan' | 'gdna' | 'special'

export interface EventItem {
  title: string
  cat: EventCategory
  tags: string[]
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

export const CUTOFF_DATE = new Date(2026, 4, 21) // 21/05/2026

export const schedule: MonthGroup[] = [
  {
    month: 'אפריל 2026',
    items: [
      { start: '20260414', end: '20260415', day: 'יום שלישי', display: '14/04/2026', events: [
        { title: 'מבחן בונוס מדעי המחשב', cat: 'mivhan', tags: ['מבחן'] },
      ]},
      { start: '20260415', end: '20260416', day: 'יום רביעי', display: '15/04/2026', events: [
        { title: 'מתכונת באנגלית', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260420', end: '20260421', day: 'יום שני', display: '20/04/2026', events: [
        { title: 'מתכונת ראשונה במתמטיקה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260422', end: '20260423', day: 'יום רביעי', display: '22/04/2026', events: [
        { title: 'יום העצמאות', cat: 'holiday', tags: ['חופש'] },
      ]},
      { start: '20260423', end: '20260424', day: 'יום חמישי', display: '23/04/2026', events: [
        { title: 'מתכונת באנגלית', cat: 'metakonet', tags: ['מתכונת'] },
        { title: 'מתכונת בפיזיקה',  cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260426', end: '20260501', day: '26–30', display: '26/04 – 30/04/2026', events: [
        { title: 'שבוע גדנ"ע', cat: 'army', tags: ['הכנה לצה"ל'] },
      ]},
      { start: '20260430', end: '20260501', day: 'יום חמישי', display: '30/04/2026', events: [
        { title: 'בגרות ברוסית', cat: 'bagrut', tags: ['בגרות רשמית'] },
      ]},
    ],
  },
  {
    month: 'מאי 2026',
    items: [
      { start: '20260504', end: '20260505', day: 'יום שני', display: '04/05/2026', events: [
        { title: 'מתכונת שנייה במתמטיקה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260505', end: '20260506', day: 'יום שלישי', display: '05/05/2026', events: [
        { title: 'לג בעומר (חופש) – מרתון פיזיקה', cat: 'holiday', tags: ['חופש', 'מרתון'] },
      ]},
      { start: '20260506', end: '20260507', day: 'יום רביעי', display: '06/05/2026', events: [
        { title: 'מתכונת באנגלית', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260507', end: '20260508', day: 'יום חמישי', display: '07/05/2026', events: [
        { title: 'בגרות בלשון',             cat: 'bagrut',    tags: ['בגרות רשמית'] },
        { title: 'מתכונת שיפור במתמטיקה', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260510', end: '20260511', day: 'יום ראשון', display: '10/05/2026', events: [
        { title: 'מתכונת שיפור במתמטיקה לניגשי לשון', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260512', end: '20260513', day: 'יום שלישי', display: '12/05/2026', events: [
        { title: 'בגרות מתמטיקה 3 ו4 יח"ל', cat: 'bagrut', tags: ['בגרות רשמית'] },
      ]},
      { start: '20260513', end: '20260514', day: 'יום רביעי', display: '13/05/2026', events: [
        { title: 'בגרות במתמטיקה יח"ל', cat: 'bagrut', tags: ['בגרות רשמית'] },
      ]},
      { start: '20260514', end: '20260515', day: 'יום חמישי', display: '14/05/2026', events: [
        { title: 'צו ראשון', cat: 'army', tags: ['הכנה לצה"ל'] },
      ]},
      { start: '20260518', end: '20260519', day: 'יום שני', display: '18/05/2026', events: [
        { title: 'בגרות באנגלית לרמות 3 ו5 יח"ל', cat: 'bagrut', tags: ['בגרות רשמית'] },
      ]},
      { start: '20260519', end: '20260520', day: 'יום שלישי', display: '19/05/2026', events: [
        { title: 'בגרות באנגלית 4 יח"ל', cat: 'bagrut', tags: ['בגרות רשמית'] },
      ]},
      { start: '20260520', end: '20260521', day: 'יום רביעי', display: '20/05/2026', events: [
        { title: 'מתכונת בניהול עסקי', cat: 'metakonet', tags: ['מתכונת'] },
      ]},
      { start: '20260521', end: '20260522', day: 'יום חמישי', display: '21/05/2026', events: [
        { title: 'מתכונת בפיזיקה', cat: 'metakonet', tags: ['מתכונת'] },
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
}
