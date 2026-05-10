'use client'

import { useState, useMemo } from 'react'

const CX = 150
const CY = 150
const R  = 128
const RI = 44

function toRad(deg: number) { return deg * Math.PI / 180 }

function slicePath(startDeg: number, endDeg: number): string {
  const x1 = CX + R * Math.cos(toRad(startDeg))
  const y1 = CY + R * Math.sin(toRad(startDeg))
  const x2 = CX + R * Math.cos(toRad(endDeg))
  const y2 = CY + R * Math.sin(toRad(endDeg))
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
}

function textCenter(startDeg: number, endDeg: number, factor = 0.64) {
  const mid = (startDeg + endDeg) / 2
  return {
    x: CX + R * factor * Math.cos(toRad(mid)),
    y: CY + R * factor * Math.sin(toRad(mid)),
  }
}

export default function SubjectWheel({
  subjects,
  selected,
  onToggle,
  onReset,
}: {
  subjects: string[]
  selected: Set<string>
  onToggle: (s: string) => void
  onReset: () => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const n = subjects.length
  const step = 360 / n

  const slices = useMemo(() =>
    subjects.map((subj, i) => {
      const startDeg = -90 + i * step
      const endDeg   = startDeg + step
      const { x, y } = textCenter(startDeg, endDeg)
      const words     = subj.split(' ')
      return { subj, startDeg, endDeg, x, y, words }
    }),
  [subjects, step])

  const count = selected.size

  return (
    <div className="subject-wheel-wrap">
      <div className="subject-wheel-title">המקצועות שלי לבגרות</div>
      <svg
        viewBox="0 0 300 300"
        className="subject-wheel-svg"
        role="group"
        aria-label="בחירת מקצועות"
      >
        {slices.map(({ subj, startDeg, endDeg, x, y, words }, i) => {
          const isSel = selected.has(subj)
          const isHov = hovered === i
          const fill  = isSel
            ? (isHov ? '#0777A0' : '#0891B2')
            : (isHov ? '#BAE6FD' : '#F3F4F6')
          const textFill = isSel ? '#FFFFFF' : '#374151'
          const fontSize = subj.length > 8 ? '9' : '10.5'

          return (
            <g
              key={subj}
              style={{ cursor: 'pointer' }}
              onClick={() => onToggle(subj)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              role="button"
              aria-pressed={isSel}
              aria-label={subj}
            >
              <path
                d={slicePath(startDeg, endDeg)}
                fill={fill}
                stroke="white"
                strokeWidth="2"
                style={{ transition: 'fill 0.15s' }}
              />
              {words.length === 1 ? (
                <text
                  x={x} y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight={isSel ? '700' : '600'}
                  fill={textFill}
                  style={{ pointerEvents: 'none', fontFamily: 'Rubik, sans-serif' }}
                >
                  {subj}
                </text>
              ) : (
                <text
                  x={x} y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fontWeight={isSel ? '700' : '600'}
                  fill={textFill}
                  style={{ pointerEvents: 'none', fontFamily: 'Rubik, sans-serif' }}
                >
                  <tspan x={x} dy="-0.6em">{words[0]}</tspan>
                  <tspan x={x} dy="1.2em">{words.slice(1).join(' ')}</tspan>
                </text>
              )}
            </g>
          )
        })}

        {/* Inner ring */}
        <circle cx={CX} cy={CY} r={RI} fill="white" />
        <circle cx={CX} cy={CY} r={RI} fill="none" stroke="#E5E7EB" strokeWidth="1.5" />

        {/* Center label */}
        {count === 0 ? (
          <text textAnchor="middle" fill="#9CA3AF" fontSize="9" style={{ fontFamily: 'Rubik, sans-serif' }}>
            <tspan x={CX} y={CY - 5}>לחץ</tspan>
            <tspan x={CX} y={CY + 7}>למקצוע</tspan>
          </text>
        ) : (
          <>
            <text x={CX} y={CY - 4} textAnchor="middle" dominantBaseline="central"
              fontSize="18" fontWeight="800" fill="#0891B2"
              style={{ fontFamily: 'Rubik, sans-serif' }}>
              {count}
            </text>
            <text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="central"
              fontSize="8" fill="#6B7280"
              style={{ fontFamily: 'Rubik, sans-serif' }}>
              נבחרו
            </text>
          </>
        )}
      </svg>

      {count > 0 && (
        <button className="wheel-reset-btn" onClick={onReset}>
          הצג כל המרתונים
        </button>
      )}
    </div>
  )
}
