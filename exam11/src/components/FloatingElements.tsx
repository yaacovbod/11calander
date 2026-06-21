'use client'

import { useEffect, useRef } from 'react'

const SCHOOL_ITEMS = [
  '✏️','📚','📐','📏','🔬','📓','🖊️','🧮','⚗️','🎒',
  '📌','💡','✂️','🖍️','📎','🔭','📊','📋','✏️','📚',
  '📐','🔬','🎒','💡',
]

const SUMMER_ITEMS = [
  '☀️','🌊','🏖️','🌴','🍦','🏄','🐚','🌺','🍉','🕶️',
  '⛱️','🦋','🌸','🎈','🐠','🌅','🏊','🌻','🍧','🌈',
  '🦀','🐬','🎡','🎠','🍹','🌞','🦜','🌊','☀️','🏄',
]

const TEXT_ITEMS = [
  { text: 'π',       style: 'font-family:serif;font-weight:bold;color:#C88A00;font-size:1.6rem' },
  { text: '∑',       style: 'font-family:serif;font-weight:bold;color:#C88A00;font-size:1.8rem' },
  { text: 'ABC',     style: 'font-family:serif;font-weight:bold;color:#9B7020;font-size:1rem;letter-spacing:2px' },
  { text: '∫',       style: 'font-family:serif;font-weight:bold;color:#C88A00;font-size:1.7rem' },
  { text: 'x²',      style: 'font-family:serif;font-weight:bold;color:#9B7020;font-size:1.2rem' },
]

const IS_SUMMER = new Date() >= new Date(2026, 5, 19)

export default function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const emojiSource = IS_SUMMER ? SUMMER_ITEMS : SCHOOL_ITEMS
    const emojiList = emojiSource.map((icon, i) => ({ type: 'emoji' as const, icon, size: 1.5 + (i % 3) * 0.25 }))
    const all = IS_SUMMER
      ? emojiList
      : [...emojiList, ...TEXT_ITEMS.map(t => ({ type: 'text' as const, ...t }))]

    all.forEach((item, i) => {
      const el = document.createElement('span')
      el.style.cssText = `
        position: absolute;
        bottom: -80px;
        opacity: 0;
        animation: floatUp linear infinite;
        user-select: none;
        pointer-events: none;
      `
      if (item.type === 'emoji') {
        el.textContent = item.icon
        el.style.fontSize = `${item.size}rem`
      } else {
        el.textContent = item.text
        el.style.cssText += item.style + ';'
      }

      const left     = 3 + (i * 97 / all.length) + (Math.random() * 3 - 1.5)
      const duration = 12 + Math.random() * 14
      const delay    = -(Math.random() * duration)

      el.style.left                  = `${left.toFixed(1)}%`
      el.style.animationDuration     = `${duration.toFixed(1)}s`
      el.style.animationDelay        = `${delay.toFixed(1)}s`

      container.appendChild(el)
    })

    if (!IS_SUMMER) {
      const logoPositions = [8, 28, 50, 72, 90]
      logoPositions.forEach((left, i) => {
        const img = document.createElement('img')
        img.src    = '/neimat.png'
        img.width  = 38 + (i % 3) * 10
        img.style.cssText = `
          position: absolute;
          bottom: -80px;
          left: ${left}%;
          opacity: 0;
          animation: floatUp linear infinite;
          animation-duration: ${(16 + i * 3.5).toFixed(1)}s;
          animation-delay: ${(-(Math.random() * 20)).toFixed(1)}s;
          filter: drop-shadow(0 2px 4px #d4a03530);
          pointer-events: none;
        `
        container.appendChild(img)
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  )
}
