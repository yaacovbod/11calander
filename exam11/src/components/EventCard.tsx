'use client'

import { useState } from 'react'
import { type DateItem, type EventCategory, catColors } from '@/data/events'

function googleCalUrl(start: string, end: string, title: string) {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}`
}

function downloadICS(start: string, end: string, title: string) {
  const uid = `exam-${start}-${Math.random().toString(36).slice(2)}@exam-schedule`
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'CALSCALE:GREGORIAN',
    'PRODID:-//לוח מבחנים 2026//HE', 'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${title}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  a.download = `${title.replace(/[^א-תa-z0-9]/gi, '_')}.ics`
  a.click()
  URL.revokeObjectURL(a.href)
}

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const AppleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 127.4-297.5 252.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" fill="white"/>
  </svg>
)

function CalButtons({ start, end, title }: { start: string; end: string; title: string }) {
  return (
    <div className="cal-buttons">
      <a className="cal-btn cal-btn-google" href={googleCalUrl(start, end, title)} target="_blank" rel="noopener">
        <GoogleIcon /><span>Google</span>
      </a>
      <button className="cal-btn cal-btn-apple" onClick={() => downloadICS(start, end, title)}>
        <AppleIcon /><span>Apple</span>
      </button>
    </div>
  )
}

function CountdownBadge({ days, cat }: { days: number; cat: EventCategory }) {
  const c = catColors[cat]
  return (
    <div
      className="countdown-badge"
      style={{ background: c.bg, color: c.color, border: `2px solid ${c.border}` }}
    >
      {days === 0 ? (
        <span className="countdown-today">היום</span>
      ) : days === 1 ? (
        <span className="countdown-today">מחר</span>
      ) : (
        <>
          <span className="countdown-num">{days}</span>
          <span className="countdown-unit">ימים</span>
        </>
      )}
    </div>
  )
}

export default function EventCard({
  item,
  isPast,
  countdown,
}: {
  item: DateItem
  isPast?: boolean
  countdown?: { days: number; cat: EventCategory }
}) {
  const [activeTab, setActiveTab] = useState(0)
  const isMulti = item.events.length > 1
  const activeCat = item.events[activeTab]?.cat ?? item.events[0].cat

  return (
    <div className={`card cat-${activeCat}${isPast ? ' card-past' : ''}`}>
      <div className="dot" />
      <div className="card-body">
        <div className="card-date">{item.day} &nbsp;|&nbsp; {item.display}</div>

        {isMulti ? (
          <>
            <div className="tabs-header">
              {item.events.map((ev, i) => (
                <button
                  key={i}
                  className={`tab-btn${i === activeTab ? ' active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {ev.title}
                </button>
              ))}
            </div>
            {item.events.map((ev, i) => {
              const c = catColors[ev.cat]
              return (
                <div key={i} className={`tab-panel${i === activeTab ? ' active' : ''}`}>
                  <div className="card-title" style={{ marginTop: '0.5rem' }}>{ev.title}</div>
                  <div className="card-footer">
                    <div className="tags">
                      {ev.tags.map(t => (
                        <span key={t} className={`tag${t === 'מרתון' ? ' tag-marathon' : ''}`}
                          style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <CalButtons start={item.start} end={item.end} title={ev.title} />
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <>
            <div className="card-title">{item.events[0].title}</div>
            <div className="card-footer">
              <div className="tags">
                {item.events[0].tags.map(t => {
                  const c = catColors[item.events[0].cat]
                  return (
                    <span key={t} className={`tag${t === 'מרתון' ? ' tag-marathon' : ''}`}
                      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                      {t}
                    </span>
                  )
                })}
              </div>
              <CalButtons start={item.start} end={item.end} title={item.events[0].title} />
            </div>
          </>
        )}
      </div>
      {countdown && <CountdownBadge days={countdown.days} cat={countdown.cat} />}
    </div>
  )
}
