'use client'

import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { schedule as staticSchedule, EventCategory, DateItem, type MonthGroup } from '@/data/events'
import { marathons as staticMarathons, MARATHON_SUBJECTS } from '@/data/marathons'
import { useSelectedSubjects } from '@/hooks/useSelectedSubjects'
import EventCard from './EventCard'
import MarathonCard from './MarathonCard'
import SubjectWheel from './SubjectWheel'

const EXAM_CATS = new Set<EventCategory>(['mivhan', 'metakonet', 'bagrut'])
const SCHOOL_YEAR_END = new Date(2026, 5, 19)
const ALL_EXAMS_DONE  = new Date(2026, 6, 11)

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

function splitUpcomingPast(groups: MonthGroup[], today: Date) {
  const upcoming: MonthGroup[] = []
  const past:     MonthGroup[] = []
  groups.forEach(group => {
    const upItems   = group.items.filter(item => parseDate(item.end) > today)
    const pastItems = group.items.filter(item => parseDate(item.end) <= today)
    if (upItems.length)   upcoming.push({ month: group.month, items: upItems })
    if (pastItems.length) past.push(    { month: group.month, items: pastItems })
  })
  return { upcoming, past }
}

export default function SchedulePage() {
  const [view, setView]                 = useState<'events' | 'calendar'>('events')
  const [showPast, setShowPast]         = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [schedule, setSchedule]         = useState<MonthGroup[]>(staticSchedule)
  const [marathons, setMarathons]       = useState<MonthGroup[]>(staticMarathons)

  const { selected, toggle, reset } = useSelectedSubjects()

  useEffect(() => {
    Promise.all([
      fetch('/api/events').then(r => r.json()).catch(() => null),
      fetch('/api/marathons').then(r => r.json()).catch(() => null),
    ]).then(([evData, mData]) => {
      if (Array.isArray(evData))  setSchedule(evData)
      if (Array.isArray(mData))   setMarathons(mData)
    })
  }, [])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0,0,0,0)
    return d
  }, [])

  if (today >= ALL_EXAMS_DONE) return null

  if (today >= SCHOOL_YEAR_END) {
    return (
      <div className="year-end-wrap">
        <div className="year-end-emoji">🎓</div>
        <h2 className="year-end-title">סוף שנת הלימודים!</h2>
      </div>
    )
  }

  const countdownMap = useMemo(() => {
    const allItems = schedule.flatMap(g => g.items)
    const map = new Map<string, { days: number; cat: EventCategory; festive?: boolean }>()
    const examItems = allItems.filter(item =>
      parseDate(item.end) > today && item.events.some(e => EXAM_CATS.has(e.cat))
    )
    examItems.slice(0, 3).forEach(item => {
      const examEvent = item.events.find(e => EXAM_CATS.has(e.cat))!
      const days = Math.round((parseDate(item.start).getTime() - today.getTime()) / 86400000)
      map.set(item.start, { days, cat: examEvent.cat })
    })
    const lastDay = allItems.find(item =>
      parseDate(item.end) > today && item.events.some(e => e.cat === 'special')
    )
    if (lastDay) {
      const days = Math.round((parseDate(lastDay.start).getTime() - today.getTime()) / 86400000)
      map.set(lastDay.start, { days, cat: 'special', festive: true })
    }
    return map
  }, [schedule, today])

  const { upcoming, past } = useMemo(() => splitUpcomingPast(schedule, today), [schedule, today])

  const { upcoming: upcomingMarathons } = useMemo(() => splitUpcomingPast(marathons, today), [marathons, today])

  const filteredUpcoming = useMemo(() =>
    upcoming.map(group => ({ ...group, items: applyFilter(group.items, activeFilter) }))
      .filter(group => group.items.length > 0),
  [upcoming, activeFilter])

  const filteredPast = useMemo(() =>
    past.map(group => ({ ...group, items: applyFilter(group.items, activeFilter) }))
      .filter(group => group.items.length > 0),
  [past, activeFilter])

  const filteredMarathons = useMemo(() => {
    if (selected.size === 0) return upcomingMarathons
    return upcomingMarathons.map(group => ({
      ...group,
      items: group.items
        .map(item => ({
          ...item,
          events: item.events.filter(ev => ev.subject && selected.has(ev.subject)),
        }))
        .filter(item => item.events.length > 0),
    })).filter(group => group.items.length > 0)
  }, [upcomingMarathons, selected])

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

      {/* ── Two-column events view ── */}
      {view === 'events' && (
        <div className="timeline-grid">

          {/* ── Events column ── */}
          <div className="timeline-col">
            <div className="col-heading">📋 אירועי השכבה</div>

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
          </div>

          {/* ── Marathons column ── */}
          <div className="timeline-col marathon-col">
            <div className="col-heading">🎯 ימי מרתון</div>

            <SubjectWheel
              subjects={MARATHON_SUBJECTS}
              selected={selected}
              onToggle={toggle}
              onReset={reset}
            />


            <div className="timeline" style={{ marginTop: '0.75rem' }}>
              {filteredMarathons.length === 0 ? (
                <div className="no-events">אין מרתונים בתקופה הקרובה</div>
              ) : (
                filteredMarathons.map(group => (
                  <div key={group.month}>
                    <div className="month-label">{group.month}</div>
                    {group.items.map(item => (
                      <MarathonCard key={item.start} item={item} />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {view === 'calendar' && (
        <CalendarView
          schedule={schedule}
          marathons={upcomingMarathons}
          selectedSubjects={selected}
        />
      )}
    </>
  )
}
