'use client'

import { useState } from 'react'
import { type DateItem } from '@/data/events'

function timeToHHMM(t: string) { return t.replace(':', '') + '00' }
function addMins(t: string, m: number) {
  const [h, mn] = t.split(':').map(Number)
  const total = h * 60 + mn + m
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}${String(total % 60).padStart(2, '0')}00`
}

function googleUrl(start: string, end: string, title: string, time?: string) {
  if (time) {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}T${timeToHHMM(time)}/${start}T${addMins(time, 180)}&ctz=Asia/Jerusalem`
  }
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}`
}

function downloadICS(start: string, end: string, title: string, time?: string) {
  const uid = `marathon-${start}-${Math.random().toString(36).slice(2)}@exam-schedule`
  const dtStart = time ? `DTSTART;TZID=Asia/Jerusalem:${start}T${timeToHHMM(time)}` : `DTSTART;VALUE=DATE:${start}`
  const dtEnd   = time ? `DTEND;TZID=Asia/Jerusalem:${start}T${addMins(time, 180)}` : `DTEND;VALUE=DATE:${end}`
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN',
    'PRODID:-//לוח מבחנים 2026//HE','BEGIN:VEVENT',
    `UID:${uid}`, dtStart, dtEnd, `SUMMARY:${title}`,
    'END:VEVENT','END:VCALENDAR'].join('\r\n')
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

export default function MarathonCard({ item }: { item: DateItem }) {
  const [activeTab, setActiveTab] = useState(0)
  const isMulti = item.events.length > 1
  const ev = item.events[activeTab] ?? item.events[0]

  return (
    <div className="card cat-marathon marathon-card">
      <div className="dot" />
      <div className="card-body">
        <div className="card-date">{item.day} &nbsp;|&nbsp; {item.display}</div>

        {isMulti ? (
          <>
            <div className="tabs-header">
              {item.events.map((e, i) => (
                <button
                  key={i}
                  className={`tab-btn marathon-tab${i === activeTab ? ' active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {e.subject ?? e.title}
                </button>
              ))}
            </div>
            {item.events.map((e, i) => (
              <div key={i} className={`tab-panel${i === activeTab ? ' active' : ''}`}>
                <div className="card-title" style={{ marginTop: '0.5rem' }}>{e.title}</div>
                {e.teacher && <div className="marathon-teacher">המורה: {e.teacher}</div>}
                <div className="card-footer">
                  <span className="tag" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc' }}>מרתון</span>
                  <div className="cal-buttons">
                    <a className="cal-btn cal-btn-google" href={googleUrl(item.start, item.end, e.title, e.time)} target="_blank" rel="noopener">
                      <GoogleIcon /><span>Google</span>
                    </a>
                    <button className="cal-btn cal-btn-apple" onClick={() => downloadICS(item.start, item.end, e.title, e.time)}>
                      <AppleIcon /><span>Apple</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="card-title">{ev.title}</div>
            {ev.teacher && <div className="marathon-teacher">המורה: {ev.teacher}</div>}
            <div className="card-footer">
              <span className="tag" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc' }}>מרתון</span>
              <div className="cal-buttons">
                <a className="cal-btn cal-btn-google" href={googleUrl(item.start, item.end, ev.title, ev.time)} target="_blank" rel="noopener">
                  <GoogleIcon /><span>Google</span>
                </a>
                <button className="cal-btn cal-btn-apple" onClick={() => downloadICS(item.start, item.end, ev.title, ev.time)}>
                  <AppleIcon /><span>Apple</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
