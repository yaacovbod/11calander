'use client'

import { useState } from 'react'
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

export default function SchedulePage() {
  const [view, setView] = useState<'events' | 'calendar'>('events')

  return (
    <>
      <div className="view-toggle">
        <button
          className={`view-btn${view === 'events' ? ' active' : ''}`}
          onClick={() => setView('events')}
        >
          📋 תצוגת אירועים
        </button>
        <button
          className={`view-btn${view === 'calendar' ? ' active' : ''}`}
          onClick={() => setView('calendar')}
        >
          📅 תצוגת לוח שנה
        </button>
      </div>

      {view === 'events' && (
        <div className="legend">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="legend-item">
              <div className="legend-dot" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      )}

      {view === 'events' && (
        <div className="timeline">
          {schedule.map(group => (
            <div key={group.month}>
              <div className="month-label">{group.month}</div>
              {group.items.map(item => (
                <EventCard key={item.start} item={item} />
              ))}
            </div>
          ))}
        </div>
      )}

      {view === 'calendar' && <CalendarView />}
    </>
  )
}
