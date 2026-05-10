'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'exam11.selectedSubjects'

export function useSelectedSubjects() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setSelected(new Set(JSON.parse(stored) as string[]))
    } catch {}
  }, [])

  const toggle = (subject: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(subject)) next.delete(subject)
      else next.add(subject)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }

  const reset = () => {
    setSelected(new Set())
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  return { selected, toggle, reset }
}
