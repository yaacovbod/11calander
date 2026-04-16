'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  schedule as staticSchedule,
  catColors,
  EventCategory,
  type MonthGroup,
  type EventItem,
} from '@/data/events'

/* ── Types ─────────────────────────────────────────────────────── */

interface AdminEvent {
  id: string
  start: string   // YYYYMMDD
  end: string     // YYYYMMDD
  title: string
  cat: EventCategory
  tags: string[]
}

/* ── Constants ─────────────────────────────────────────────────── */

const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASS ?? 'neimat2026'

const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'bagrut',    label: 'בגרות' },
  { value: 'metakonet', label: 'מתכונת' },
  { value: 'mivhan',    label: 'מבחן' },
  { value: 'holiday',   label: 'חג / חופשה' },
  { value: 'memorial',  label: 'יום זיכרון' },
  { value: 'army',      label: 'הכנה לצה"ל' },
  { value: 'trip',      label: 'טיול' },
  { value: 'special',   label: 'מיוחד' },
  { value: 'gdna',      label: 'גדנ"ע' },
]

const HEB_DAYS   = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']

/* ── Date helpers ──────────────────────────────────────────────── */

function parseYYYYMMDD(s: string): Date {
  return new Date(+s.slice(0,4), +s.slice(4,6)-1, +s.slice(6,8))
}

function toYYYYMMDD(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
}

function htmlToYYYYMMDD(html: string): string {
  // html is YYYY-MM-DD
  return html.replace(/-/g, '')
}

function yyyymmddToHtml(s: string): string {
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`
}

function getMonthLabel(yyyymmdd: string): string {
  const m = +yyyymmdd.slice(4,6)-1
  const y = yyyymmdd.slice(0,4)
  return `${HEB_MONTHS[m]} ${y}`
}

function getDayLabel(start: string, end: string): string {
  const sd = parseYYYYMMDD(start)
  const ed = parseYYYYMMDD(end)
  const diff = Math.round((ed.getTime() - sd.getTime()) / 86400000)
  if (diff <= 1) return `יום ${HEB_DAYS[sd.getDay()]}`
  const lastDay = new Date(ed)
  lastDay.setDate(lastDay.getDate() - 1)
  return `${HEB_DAYS[sd.getDay()]} עד ${HEB_DAYS[lastDay.getDay()]}`
}

function formatDisplay(start: string, end: string): string {
  const sd = parseYYYYMMDD(start)
  const ed = parseYYYYMMDD(end)
  const diff = Math.round((ed.getTime() - sd.getTime()) / 86400000)

  const dd  = String(sd.getDate()).padStart(2,'0')
  const mm  = String(sd.getMonth()+1).padStart(2,'0')
  const yyyy = sd.getFullYear()

  if (diff <= 1) return `${dd}/${mm}/${yyyy}`

  const lastDay = new Date(ed)
  lastDay.setDate(lastDay.getDate() - 1)
  const edd = String(lastDay.getDate()).padStart(2,'0')
  const emm = String(lastDay.getMonth()+1).padStart(2,'0')

  if (mm === emm) return `${dd}–${edd}/${mm}/${yyyy}`
  return `${dd}/${mm} – ${edd}/${emm}/${yyyy}`
}

/* ── Data conversion ───────────────────────────────────────────── */

let _idCounter = 0
function makeId() { return `ev_${Date.now()}_${++_idCounter}` }

function scheduleToAdminEvents(sched: MonthGroup[]): AdminEvent[] {
  const events: AdminEvent[] = []
  sched.forEach(group => {
    group.items.forEach(item => {
      item.events.forEach(ev => {
        events.push({ id: makeId(), start: item.start, end: item.end, title: ev.title, cat: ev.cat, tags: ev.tags })
      })
    })
  })
  return events
}

function adminEventsToSchedule(events: AdminEvent[]): MonthGroup[] {
  const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start))

  // Group by date key (start)
  const dateMap = new Map<string, { start: string; end: string; events: EventItem[] }>()
  sorted.forEach(ev => {
    if (!dateMap.has(ev.start)) {
      dateMap.set(ev.start, { start: ev.start, end: ev.end, events: [] })
    }
    dateMap.get(ev.start)!.events.push({ title: ev.title, cat: ev.cat, tags: ev.tags })
  })

  // Group by month
  const monthMap = new Map<string, MonthGroup>()
  dateMap.forEach(dateData => {
    const monthLabel = getMonthLabel(dateData.start)
    if (!monthMap.has(monthLabel)) {
      monthMap.set(monthLabel, { month: monthLabel, items: [] })
    }
    monthMap.get(monthLabel)!.items.push({
      start:   dateData.start,
      end:     dateData.end,
      day:     getDayLabel(dateData.start, dateData.end),
      display: formatDisplay(dateData.start, dateData.end),
      events:  dateData.events,
    })
  })

  return Array.from(monthMap.values())
}

/* ── Export code generator ─────────────────────────────────────── */

function generateEventsTs(sched: MonthGroup[]): string {
  const lines: string[] = []
  lines.push(`export type EventCategory = 'bagrut' | 'metakonet' | 'holiday' | 'army' | 'mivhan' | 'gdna' | 'special' | 'memorial' | 'trip'`)
  lines.push(``)
  lines.push(`export interface EventItem {`)
  lines.push(`  title: string`)
  lines.push(`  cat: EventCategory`)
  lines.push(`  tags: string[]`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`export interface DateItem {`)
  lines.push(`  start: string`)
  lines.push(`  end: string`)
  lines.push(`  day: string`)
  lines.push(`  display: string`)
  lines.push(`  events: EventItem[]`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`export interface MonthGroup {`)
  lines.push(`  month: string`)
  lines.push(`  items: DateItem[]`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`export const CUTOFF_DATE = new Date(2026, 7, 1)`)
  lines.push(``)
  lines.push(`export const schedule: MonthGroup[] = [`)
  sched.forEach(group => {
    lines.push(`  {`)
    lines.push(`    month: '${group.month}',`)
    lines.push(`    items: [`)
    group.items.forEach(item => {
      lines.push(`      { start: '${item.start}', end: '${item.end}', day: '${item.day}', display: '${item.display}', events: [`)
      item.events.forEach(ev => {
        const tagsStr = ev.tags.map(t => `'${t}'`).join(', ')
        lines.push(`        { title: '${ev.title}', cat: '${ev.cat}', tags: [${tagsStr}] },`)
      })
      lines.push(`      ]},`)
    })
    lines.push(`    ],`)
    lines.push(`  },`)
  })
  lines.push(`]`)
  lines.push(``)
  lines.push(`export const catColors: Record<EventCategory, { bg: string; color: string; border: string }> = {`)
  Object.entries(catColors).forEach(([cat, c]) => {
    lines.push(`  ${cat}:    { bg: '${c.bg}', color: '${c.color}', border: '${c.border}' },`)
  })
  lines.push(`}`)
  return lines.join('\n')
}

/* ── Styles ────────────────────────────────────────────────────── */

const S: Record<string, React.CSSProperties> = {
  page:        { minHeight: '100vh', background: '#F8EDD0', fontFamily: 'Rubik, Arial, sans-serif', direction: 'rtl', padding: '1.5rem 1rem 4rem' },
  wrap:        { maxWidth: 860, margin: '0 auto' },
  header:      { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #D4A035', paddingBottom: '1rem' },
  h1:          { fontSize: '1.6rem', fontWeight: 700, color: '#3D2B00' },
  badge:       { background: '#D4A035', color: '#fff', borderRadius: 8, padding: '2px 10px', fontSize: '0.8rem', fontWeight: 600 },
  card:        { background: '#FEF8EA', border: '1.5px solid #D4A035', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(180,120,0,0.09)' },
  label:       { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#8A6A20', marginBottom: '0.3rem' },
  input:       { width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #D4A035', borderRadius: 8, background: '#fff', fontSize: '1rem', color: '#3D2B00', fontFamily: 'inherit', outline: 'none' },
  select:      { width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #D4A035', borderRadius: 8, background: '#fff', fontSize: '1rem', color: '#3D2B00', fontFamily: 'inherit', outline: 'none', appearance: 'none' as const },
  row:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.9rem' },
  row3:        { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.9rem' },
  formFull:    { marginBottom: '0.9rem' },
  btnPrimary:  { background: '#B87800', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.4rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnSecondary:{ background: 'transparent', color: '#B87800', border: '1.5px solid #B87800', borderRadius: 8, padding: '0.5rem 1.2rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnDanger:   { background: 'transparent', color: '#8B2200', border: '1.5px solid #8B2200', borderRadius: 7, padding: '0.3rem 0.8rem', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' },
  btnEdit:     { background: 'transparent', color: '#1A4A6B', border: '1.5px solid #1A4A6B', borderRadius: 7, padding: '0.3rem 0.8rem', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' },
  monthLabel:  { fontSize: '1.1rem', fontWeight: 700, color: '#B87800', margin: '1.2rem 0 0.5rem', borderBottom: '1px solid #D4A035', paddingBottom: '0.3rem' },
  eventRow:    { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: '1px solid #f0dda0', flexWrap: 'wrap' as const },
  dateText:    { fontSize: '0.85rem', color: '#8A6A20', minWidth: 90, flexShrink: 0 },
  titleText:   { flex: 1, fontSize: '0.97rem', color: '#3D2B00', fontWeight: 500, minWidth: 120 },
  catBadge:    { borderRadius: 6, padding: '2px 8px', fontSize: '0.78rem', fontWeight: 600, flexShrink: 0 },
  tagBadge:    { background: '#e8e0c8', color: '#6B4F00', borderRadius: 5, padding: '1px 6px', fontSize: '0.76rem' },
  btnGroup:    { display: 'flex', gap: '0.4rem', marginRight: 'auto' as const },
  overlay:     { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal:       { background: '#FEF8EA', border: '2px solid #D4A035', borderRadius: 14, padding: '1.5rem', maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  textarea:    { width: '100%', height: 340, fontFamily: 'monospace', fontSize: '0.78rem', padding: '0.75rem', border: '1.5px solid #D4A035', borderRadius: 8, resize: 'vertical' as const, background: '#f8f0dc', color: '#2a1800' },
  successBanner: { background: '#d4f0da', color: '#1a5c2a', border: '1.5px solid #90c898', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' },
  errorBanner:   { background: '#fde8e0', color: '#8B2200', border: '1.5px solid #d4a090', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' },
}

/* ── Empty form ────────────────────────────────────────────────── */

const emptyForm = () => ({
  start: '',
  end:   '',
  title: '',
  cat:   'bagrut' as EventCategory,
  tags:  '',
})

/* ── Component ─────────────────────────────────────────────────── */

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false)
  const [passInput, setPassInput] = useState('')
  const [passErr,  setPassErr] = useState(false)

  const [events,     setEvents]    = useState<AdminEvent[]>([])
  const [form,       setForm]      = useState(emptyForm())
  const [editId,     setEditId]    = useState<string | null>(null)
  const [saved,      setSaved]     = useState(false)
  const [saving,     setSaving]    = useState(false)
  const [saveError,  setSaveError] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [copied,     setCopied]    = useState(false)

  // Load from API on auth
  useEffect(() => {
    if (!authed) return
    fetch('/api/events')
      .then(r => r.json())
      .then((data: MonthGroup[]) => {
        if (Array.isArray(data)) setEvents(scheduleToAdminEvents(data))
        else setEvents(scheduleToAdminEvents(staticSchedule))
      })
      .catch(() => setEvents(scheduleToAdminEvents(staticSchedule)))
  }, [authed])

  async function saveToApi(evs: AdminEvent[]) {
    setSaving(true)
    setSaveError(false)
    try {
      const schedule = adminEventsToSchedule(evs)
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        setSaveError(true)
      }
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  function login() {
    if (passInput === PASSWORD) { setAuthed(true); setPassErr(false) }
    else { setPassErr(true) }
  }

  function handleFormChange(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function validateForm(): string | null {
    if (!form.start) return 'יש לבחור תאריך'
    if (!form.title.trim()) return 'יש להזין כותרת'
    if (form.end && form.end < form.start.replace(/-/g,'').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')) return 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה'
    return null
  }

  function submitForm() {
    const err = validateForm()
    if (err) { alert(err); return }

    const start = htmlToYYYYMMDD(form.start)
    let end = form.end ? htmlToYYYYMMDD(form.end) : ''
    if (!end || end <= start) {
      // end = start + 1 day
      const d = parseYYYYMMDD(start)
      d.setDate(d.getDate() + 1)
      end = toYYYYMMDD(d)
    }

    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)

    if (editId) {
      const updated = events.map(ev =>
        ev.id === editId ? { ...ev, start, end, title: form.title.trim(), cat: form.cat, tags } : ev
      )
      setEvents(updated)
      saveToApi(updated)
      setEditId(null)
    } else {
      const newEv: AdminEvent = { id: makeId(), start, end, title: form.title.trim(), cat: form.cat, tags }
      const updated = [...events, newEv]
      setEvents(updated)
      saveToApi(updated)
    }

    setForm(emptyForm())
  }

  function startEdit(ev: AdminEvent) {
    setEditId(ev.id)
    setForm({
      start: yyyymmddToHtml(ev.start),
      end:   yyyymmddToHtml(ev.end),
      title: ev.title,
      cat:   ev.cat,
      tags:  ev.tags.join(', '),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(emptyForm())
  }

  function deleteEvent(id: string) {
    if (!confirm('למחוק אירוע זה?')) return
    const updated = events.filter(ev => ev.id !== id)
    setEvents(updated)
    saveToApi(updated)
  }

  function resetToStatic() {
    if (!confirm('לאפס את כל הנתונים לברירת המחדל המקורית?')) return
    const reset = scheduleToAdminEvents(staticSchedule)
    setEvents(reset)
    saveToApi(reset)
  }

  const exportCode = useCallback(() => {
    return generateEventsTs(adminEventsToSchedule(events))
  }, [events])

  function copyCode() {
    navigator.clipboard.writeText(exportCode()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  // Group events by month for display
  const grouped = useMemo(() => adminEventsToSchedule(events), [events])

  /* ── Password gate ── */
  if (!authed) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...S.card, maxWidth: 360, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#3D2B00', marginBottom: '1.2rem' }}>כניסה לאדמין</h2>
          {passErr && <div style={S.errorBanner}>סיסמה שגויה</div>}
          <input
            type="password"
            placeholder="סיסמה"
            value={passInput}
            onChange={e => setPassInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ ...S.input, marginBottom: '1rem', textAlign: 'center' }}
            autoFocus
          />
          <button style={{ ...S.btnPrimary, width: '100%' }} onClick={login}>כניסה</button>
        </div>
      </div>
    )
  }

  /* ── Admin UI ── */
  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Header */}
        <div style={S.header}>
          <span style={{ fontSize: '1.8rem' }}>📋</span>
          <div>
            <h1 style={S.h1}>ניהול לוח מבחנים</h1>
            <div style={{ fontSize: '0.82rem', color: '#8A6A20' }}>שכבת י״א | נעימת הלב</div>
          </div>
          <div style={{ marginRight: 'auto', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button style={S.btnSecondary} onClick={() => setExportOpen(true)}>יצוא קוד ⬇️</button>
            <button style={{ ...S.btnDanger }} onClick={resetToStatic}>אפס לברירת מחדל</button>
          </div>
        </div>

        {saving    && <div style={{ ...S.successBanner, background: '#fff8e0', color: '#6B4F00', borderColor: '#e0c050' }}>⏳ שומר...</div>}
        {saved     && <div style={S.successBanner}>✅ נשמר בהצלחה — השינויים יופיעו באתר תוך שניות</div>}
        {saveError && <div style={S.errorBanner}>❌ שגיאה בשמירה. בדוק את חיבור ה-Blob ב-Vercel.</div>}

        {/* Add / Edit form */}
        <div style={S.card}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3D2B00', marginBottom: '1rem' }}>
            {editId ? '✏️ עריכת אירוע' : '➕ הוספת אירוע'}
          </h2>

          <div style={S.row}>
            <div>
              <label style={S.label}>תאריך התחלה *</label>
              <input type="date" style={S.input} value={form.start} onChange={e => handleFormChange('start', e.target.value)} />
            </div>
            <div>
              <label style={S.label}>תאריך סיום (אופציונלי — לאירועים מרובי ימים)</label>
              <input type="date" style={S.input} value={form.end} onChange={e => handleFormChange('end', e.target.value)} />
            </div>
          </div>

          <div style={S.formFull}>
            <label style={S.label}>כותרת האירוע *</label>
            <input type="text" style={S.input} placeholder="לדוגמה: בגרות במתמטיקה" value={form.title} onChange={e => handleFormChange('title', e.target.value)} />
          </div>

          <div style={S.row}>
            <div>
              <label style={S.label}>קטגוריה *</label>
              <select style={S.select} value={form.cat} onChange={e => handleFormChange('cat', e.target.value)}>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>תגיות (הפרד בפסיקים)</label>
              <input type="text" style={S.input} placeholder="לדוגמה: בגרות, מועד ב'" value={form.tags} onChange={e => handleFormChange('tags', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.7rem' }}>
            <button style={S.btnPrimary} onClick={submitForm}>
              {editId ? 'עדכן אירוע' : 'הוסף אירוע'}
            </button>
            {editId && (
              <button style={S.btnSecondary} onClick={cancelEdit}>ביטול</button>
            )}
          </div>
        </div>

        {/* Events list */}
        <div style={S.card}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3D2B00', marginBottom: '0.5rem' }}>
            📅 כל האירועים ({events.length})
          </h2>

          {grouped.length === 0 ? (
            <div style={{ color: '#8A6A20', padding: '1rem 0' }}>אין אירועים</div>
          ) : (
            grouped.map(group => (
              <div key={group.month}>
                <div style={S.monthLabel}>{group.month}</div>
                {group.items.map(item =>
                  item.events.map((ev, i) => {
                    const adminEv = events.find(
                      e => e.start === item.start && e.title === ev.title && e.cat === ev.cat
                    )
                    const colors = catColors[ev.cat]
                    return (
                      <div key={`${item.start}_${i}`} style={S.eventRow}>
                        <span style={S.dateText}>{item.display}</span>
                        <span style={{ ...S.catBadge, background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}>
                          {CATEGORIES.find(c => c.value === ev.cat)?.label ?? ev.cat}
                        </span>
                        <span style={S.titleText}>{ev.title}</span>
                        {ev.tags.map(tag => (
                          <span key={tag} style={S.tagBadge}>{tag}</span>
                        ))}
                        <div style={S.btnGroup}>
                          {adminEv && (
                            <>
                              <button style={S.btnEdit} onClick={() => startEdit(adminEv)}>עריכה</button>
                              <button style={S.btnDanger} onClick={() => deleteEvent(adminEv.id)}>מחק</button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* Export modal */}
      {exportOpen && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) setExportOpen(false) }}>
          <div style={S.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#3D2B00' }}>יצוא קוד — events.ts</h2>
              <button style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#8A6A20' }} onClick={() => setExportOpen(false)}>✕</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#8A6A20', marginBottom: '0.8rem' }}>
              העתק את הקוד הבא והדבק אותו בקובץ <code>src/data/events.ts</code>, ואז שלח ל-Git כדי לעדכן את האתר.
            </p>
            <button
              style={{ ...S.btnPrimary, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              onClick={copyCode}
            >
              {copied ? '✅ הועתק!' : '📋 העתק לוח הגזירים'}
            </button>
            <textarea style={S.textarea} readOnly value={exportCode()} />
          </div>
        </div>
      )}
    </div>
  )
}
