'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { schedule, EventCategory, DateItem } from '@/data/events'
import EventCard from './EventCard'

const EXAM_CATS = new Set<EventCategory>(['mivhan', 'metakonet', 'bagrut'])

const CalendarView = dynamic(() => import('./CalendarView'), { ssr: false })

const FILTER_GROUPS: { label: string; cats: EventCategory[]; color: string }[] = [
  { label: 'מבחן',           cats: ['mivhan', 'metakonet'], color: '#5A6B28' },
  { label: 'בגרויות',        cats: ['bagrut'],              color: '#8B2200' },
  { label: 'מועדים וחגים',   cats: ['holiday', 'memorial', 'special'], color: '#2A6030' },
  { label: 'פעילות וטיולים', cats: ['army', 'trip'],        color: '#1A7A6A' },
]

function parseDate(yyyymmdd: string): Date {
  const y = +yyyymmdd.slice(0,4), m = +yyyymmdd.slice(4,6)-1, d = +yyyymmdd.slice(6,8)
  const dt = new Date(y, m, d)
  dt.setHours(0,0,0,0)
  return dt
}

function applyFilter(items: DateItem[], activeFilter: string | null): DateItem[] {
  if (!activeFilter) return items
  const group = FILTER_GROUPS.find(g => g.label === activeFilter)
  if (!group) return items
  return items.filter(item => item.events.some(e => group.cats.includes(e.cat)))
}

export default function SchedulePage() {
  const [view, setView]               = useState<'events' | 'calendar'>('events')
  const [showPast, setShowPast]       = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0,0,0,0)
    return d
  }, [])

  const countdownMap = useMemo(() => {
    const allItems = schedule.flatMap(g => g.items)
    const examItems = allItems.filter(item =>
      parseDate(item.end) > today && item.events.some(e => EXAM_CATS.has(e.cat))
    )
    const top3 = examItems.slice(0, 3)
    const map = new Map<string, { days: number; cat: EventCategory }>()
    top3.forEach(item => {
      const examEvent = item.events.find(e => EXAM_CATS.has(e.cat))!
      const days = Math.round((parseDate(item.start).getTime() - today.getTime()) / 86400000)
      map.set(item.start, { days, cat: examEvent.cat })
    })
    return map
  }, [today])

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

  const filteredUpcoming = useMemo(() =>
    upcoming.map(group => ({
      ...group,
      items: applyFilter(group.items, activeFilter),
    })).filter(group => group.items.length > 0),
  [upcoming, activeFilter])

  const filteredPast = useMemo(() =>
    past.map(group => ({
      ...group,
      items: applyFilter(group.items, activeFilter),
    })).filter(group => group.items.length > 0),
  [past, activeFilter])

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

      {/* ── Filter bar ── */}
      {view === 'events' && (
        <div className="filter-bar">
          {FILTER_GROUPS.map(({ label, color }) => (
            <button
              key={label}
              className={`filter-btn${activeFilter === label ? ' active' : ''}`}
              style={{ '--filter-color': color } as React.CSSProperties}
              onClick={() => setActiveFilter(prev => prev === label ? null : label)}
            >
              <span className="filter-dot" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Events view ── */}
      {view === 'events' && (
        <>
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
                  {filteredPast.map(group => (
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
            {filteredUpcoming.length === 0 ? (
              <div className="no-events">אין אירועים בקטגוריה זו</div>
            ) : (
              filteredUpcoming.map(group => (
                <div key={group.month}>
                  <div className="month-label">{group.month}</div>
                  {group.items.map(item => (
                    <EventCard
                      key={item.start}
                      item={item}
                      countdown={countdownMap.get(item.start)}
                    />
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
