'use client'

import { useMemo } from 'react'
import { schedule, catColors, CUTOFF_DATE, type EventItem } from '@/data/events'

const MONTH_NAMES = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
const DAY_NAMES   = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳']

const MONTHS_TO_SHOW: [number, number][] = [[2026,3],[2026,4],[2026,5]]

function dateKey(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

function buildEventMap(): Record<string, EventItem[]> {
  const map: Record<string, EventItem[]> = {}
  schedule.forEach(group => {
    group.items.forEach(item => {
      // parse start / end
      const sy = +item.start.slice(0,4), sm = +item.start.slice(4,6)-1, sd = +item.start.slice(6,8)
      const ey = +item.end.slice(0,4),   em = +item.end.slice(4,6)-1,   ed = +item.end.slice(6,8)
      const cur  = new Date(sy, sm, sd)
      const stop = new Date(ey, em, ed)
      // iterate every day in the range [start, end)
      while (cur < stop) {
        const k = dateKey(cur)
        if (!map[k]) map[k] = []
        item.events.forEach(ev => map[k].push(ev))
        cur.setDate(cur.getDate() + 1)
      }
    })
  })
  return map
}

function MonthGrid({ year, month, eventMap }: {
  year: number
  month: number
  eventMap: Record<string, EventItem[]>
}) {
  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const emptyCells  = Array.from({ length: firstDow })
  const days        = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="month-grid-wrap">
      <div className="month-grid-title">{MONTH_NAMES[month]} {year}</div>

      <div className="cal-grid">
        {DAY_NAMES.map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {emptyCells.map((_, i) => (
          <div key={`e${i}`} className="cal-cell empty" />
        ))}
        {days.map(day => {
          const dk       = dateKey(new Date(year, month, day))
          const cellDate = new Date(year, month, day)
          const isWip    = cellDate > CUTOFF_DATE
          const evs      = eventMap[dk] ?? []
          const hasEvent = evs.length > 0

          return (
            <div
              key={day}
              className={['cal-cell', isWip && 'wip', hasEvent && 'has-event'].filter(Boolean).join(' ')}
            >
              <span className="cal-day-num">{day}</span>
              {isWip && <span className="cal-wip-label">🚧 בבנייה</span>}
              {!isWip && evs.map((ev, i) => {
                const c = catColors[ev.cat]
                return (
                  <span
                    key={i}
                    className="cal-event-label"
                    title={ev.title}
                    style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                  >
                    {ev.title}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CalendarView() {
  const eventMap = useMemo(() => buildEventMap(), [])

  return (
    <div id="calendar-view-inner">
      {MONTHS_TO_SHOW.map(([y, m]) => (
        <MonthGrid key={`${y}-${m}`} year={y} month={m} eventMap={eventMap} />
      ))}
    </div>
  )
}
