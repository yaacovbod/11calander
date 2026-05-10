'use client'

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
  return (
    <div className="subject-wheel-wrap">
      <div className="subject-wheel-title">סנן לפי מקצוע</div>
      <div className="subject-chips">
        {subjects.map(subj => (
          <button
            key={subj}
            className={`subject-chip${selected.has(subj) ? ' active' : ''}`}
            onClick={() => onToggle(subj)}
          >
            {subj}
          </button>
        ))}
      </div>
      {selected.size > 0 && (
        <button className="wheel-reset-btn" onClick={onReset}>
          הצג הכל
        </button>
      )}
    </div>
  )
}
