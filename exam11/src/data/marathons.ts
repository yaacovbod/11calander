import { type MonthGroup } from './events'

export const MARATHON_SUBJECTS = [
  'פסיכולוגיה',
  'מידע ונתונים',
  'מוט"ל',
  'פיזיקה',
  'ניהול עסקי',
  'ספרות',
  'מדעי המחשב',
]

export const marathons: MonthGroup[] = [
  {
    month: 'מאי 2026',
    items: [
      {
        start: '20260520', end: '20260521', day: 'יום רביעי', display: '20/05/2026',
        events: [
          { title: 'מרתון פסיכולוגיה', cat: 'marathon', tags: ['מרתון'], teacher: 'אדר ארביב רוטנברג', subject: 'פסיכולוגיה' },
        ],
      },
      {
        start: '20260525', end: '20260526', day: 'יום שני', display: '25/05/2026',
        events: [
          { title: 'מרתון מידע ונתונים', cat: 'marathon', tags: ['מרתון'], teacher: 'אילנית דדון', subject: 'מידע ונתונים' },
        ],
      },
      {
        start: '20260526', end: '20260527', day: 'יום שלישי', display: '26/05/2026',
        events: [
          { title: 'מרתון מוט"ל', cat: 'marathon', tags: ['מרתון'], teacher: 'נעמה יעקובי', subject: 'מוט"ל' },
          { title: 'מרתון פיזיקה', cat: 'marathon', tags: ['מרתון'], teacher: 'לירז עזרן', subject: 'פיזיקה' },
          { title: 'מרתון ניהול עסקי', cat: 'marathon', tags: ['מרתון'], teacher: 'גיא חגי', subject: 'ניהול עסקי' },
        ],
      },
      {
        start: '20260527', end: '20260528', day: 'יום רביעי', display: '27/05/2026',
        events: [
          { title: 'מרתון ניהול עסקי', cat: 'marathon', tags: ['מרתון'], teacher: 'גיא חגי', subject: 'ניהול עסקי' },
        ],
      },
      {
        start: '20260531', end: '20260601', day: 'יום ראשון', display: '31/05/2026',
        events: [
          { title: 'מרתון פסיכולוגיה', cat: 'marathon', tags: ['מרתון'], teacher: 'אדר ארביב רוטנברג', subject: 'פסיכולוגיה' },
        ],
      },
    ],
  },
  {
    month: 'יוני 2026',
    items: [
      {
        start: '20260601', end: '20260602', day: 'יום שני', display: '01/06/2026',
        events: [
          { title: 'מרתון פסיכולוגיה', cat: 'marathon', tags: ['מרתון'], teacher: 'אדר ארביב רוטנברג', subject: 'פסיכולוגיה' },
          { title: 'מרתון פיזיקה', cat: 'marathon', tags: ['מרתון'], teacher: 'לירז עזרן', subject: 'פיזיקה' },
        ],
      },
      {
        start: '20260602', end: '20260603', day: 'יום שלישי', display: '02/06/2026',
        events: [
          { title: 'מרתון מוט"ל', cat: 'marathon', tags: ['מרתון'], teacher: 'נעמה יעקובי', subject: 'מוט"ל' },
          { title: 'מרתון ניהול עסקי', cat: 'marathon', tags: ['מרתון'], teacher: 'גיא חגי', subject: 'ניהול עסקי' },
        ],
      },
      {
        start: '20260603', end: '20260604', day: 'יום רביעי', display: '03/06/2026',
        events: [
          { title: 'מרתון ספרות', cat: 'marathon', tags: ['מרתון'], teacher: 'בלה מירושניצנקו', subject: 'ספרות' },
        ],
      },
      {
        start: '20260604', end: '20260605', day: 'יום חמישי', display: '04/06/2026',
        events: [
          { title: 'מרתון פסיכולוגיה', cat: 'marathon', tags: ['מרתון'], teacher: 'אדר ארביב רוטנברג', subject: 'פסיכולוגיה' },
        ],
      },
      {
        start: '20260607', end: '20260608', day: 'יום ראשון', display: '07/06/2026',
        events: [
          { title: 'מרתון ספרות', cat: 'marathon', tags: ['מרתון'], teacher: 'בלה מירושניצנקו', subject: 'ספרות' },
        ],
      },
      {
        start: '20260609', end: '20260610', day: 'יום שלישי', display: '09/06/2026',
        events: [
          { title: 'מרתון מוט"ל', cat: 'marathon', tags: ['מרתון'], teacher: 'נעמה יעקובי', subject: 'מוט"ל' },
          { title: 'מרתון פיזיקה', cat: 'marathon', tags: ['מרתון'], teacher: 'לירז עזרן', subject: 'פיזיקה' },
          { title: 'מרתון מדעי המחשב', cat: 'marathon', tags: ['מרתון'], teacher: 'הודיה הדאלי לוי', subject: 'מדעי המחשב' },
        ],
      },
      {
        start: '20260611', end: '20260612', day: 'יום חמישי', display: '11/06/2026',
        events: [
          { title: 'מרתון פסיכולוגיה', cat: 'marathon', tags: ['מרתון'], teacher: 'אדר ארביב רוטנברג', subject: 'פסיכולוגיה' },
        ],
      },
      {
        start: '20260614', end: '20260615', day: 'יום ראשון', display: '14/06/2026',
        events: [
          { title: 'מרתון פסיכולוגיה', cat: 'marathon', tags: ['מרתון'], teacher: 'אדר ארביב רוטנברג', subject: 'פסיכולוגיה' },
          { title: 'מרתון פיזיקה', cat: 'marathon', tags: ['מרתון'], teacher: 'לירז עזרן', subject: 'פיזיקה' },
        ],
      },
      {
        start: '20260621', end: '20260622', day: 'יום ראשון', display: '21/06/2026',
        events: [
          { title: 'מרתון פסיכולוגיה', cat: 'marathon', tags: ['מרתון'], teacher: 'אדר ארביב רוטנברג', subject: 'פסיכולוגיה' },
        ],
      },
    ],
  },
]
