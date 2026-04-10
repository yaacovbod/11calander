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
  const [view, setView] = useState<'events' | 'calendar' | 'past'>('events')

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

  const showingEvents = view === 'events' || view === 'past'
  const currentGroups = view === 'past' ? past : upcoming

  return (
    <>
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
        <button
          className={`view-btn view-btn-past${view === 'past' ? ' active' : ''}`}
          onClick={() => setView('past')}
        >
          🕐 אירועי עבר
        </button>
      </div>

      {showingEvents && (
        <div className="legend">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="legend-item">
              <div className="legend-dot" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      )}

      {showingEvents && (
        <div className={`timeline${view === 'past' ? ' timeline-past' : ''}`}>
          {currentGroups.length === 0 ? (
            <div className="no-events">אין אירועים להצגה</div>
          ) : (
            currentGroups.map(group => (
              <div key={group.month}>
                <div className="month-label">{group.month}</div>
                {group.items.map(item => (
                  <EventCard key={item.start} item={item} isPast={view === 'past'} />
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {view === 'calendar' && <CalendarView />}
    </>
  )
}
