'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { schedule } from '@/data/events'
import EventCard from './EventCard'

const CalendarView = dynamic(() => import('./CalendarView'), { ssr: false })

const LEGEND = [
  { color: '#8B2200', label: 'בגרות רשמית' },
  { color: '#1A4A6B', label: 'מתכונת' },
  { color: '#2A6030', label: 'חופש / חג' },
  { color: '#1A7A6A', label: 'מבחן' },
  { color: '#5A6B28', label: 'הכנה לצה"ל' },
]

function parseDate(yyyymmdd: string): Date {
  const y = +yyyymmdd.slice(0,4), m = +yyyymmdd.slice(4,6)-1, d = +yyyymmdd.slice(6,8)
  const dt = new Date(y, m, d)
  dt.setHours(0,0,0,0)
  return dt
}

export default function SchedulePage() {
  const [view, setView]         = useState<'events' | 'calendar'>('events')
  const [showPast, setShowPast] = useState(false)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0,0,0,0)
    return d
  }, [])

  const { upcoming, past } = useMemo(() => {
    const upcoming: typeof schedule = []
    const past:     typeof schedule = []

    schedule.forEach(group => {
      const upItems   = group.items.filter(item => parseDate(item.end) > today)
      const pastItems = group.items.filter(item => parseDate(item.end) <= today)
      if (upItems.length)   upcoming.push({ month: group.month, items: upItems })
      if (pastItems.length) past.push(    { month: group.month, items: pastItems })
    })
    return { upcoming, past }
  }, [today])

  return (
    <>
      {/* ── Main toggle ── */}
      <div className="view-toggle">
        <button
          className={`view-btn${view === 'events' ? ' active' : ''}`}
          onClick={() => setView('events')}
        >
          📋 אירועים קרובים
        </button>
        <button
          className={`view-btn${view === 'calendar' ? ' active' : ''}`}
          onClick={() => setView('calendar')}
        >
          📅 לוח שנה
        </button>
      </div>

      {/* ── Events view ── */}
      {view === 'events' && (
        <>
          <div className="legend">
            {LEGEND.map(({ color, label }) => (
              <div key={label} className="legend-item">
                <div className="legend-dot" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>

          {/* Past events toggle button */}
          {past.length > 0 && (
            <div className="past-toggle-wrap">
              <button
                className={`past-toggle-btn${showPast ? ' open' : ''}`}
                onClick={() => setShowPast(p => !p)}
              >
                🕐 אירועי עבר
                <span className="past-arrow">{showPast ? '▲' : '▼'}</span>
              </button>

              {showPast && (
                <div className="timeline timeline-past">
                  {past.map(group => (
                    <div key={group.month}>
                      <div className="month-label">{group.month}</div>
                      {group.items.map(item => (
                        <EventCard key={item.start} item={item} isPast />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming events */}
          <div className="timeline">
            {upcoming.length === 0 ? (
              <div className="no-events">כל האירועים הסתיימו</div>
            ) : (
              upcoming.map(group => (
                <div key={group.month}>
                  <div className="month-label">{group.month}</div>
                  {group.items.map(item => (
                    <EventCard key={item.start} item={item} />
                  ))}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {view === 'calendar' && <CalendarView />}
    </>
  )
}
