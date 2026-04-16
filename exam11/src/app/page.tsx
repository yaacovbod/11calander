import Image from 'next/image'
import FloatingElements from '@/components/FloatingElements'
import SchedulePage from '@/components/SchedulePage'

function buildTimestamp(): string {
  const now = new Date()
  const dd   = String(now.getDate()).padStart(2, '0')
  const mm   = String(now.getMonth() + 1).padStart(2, '0')
  const yy   = String(now.getFullYear()).slice(2)
  const hh   = String(now.getHours()).padStart(2, '0')
  const min  = String(now.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yy} ${hh}:${min}`
}

export default function Home() {
  return (
    <>
      <FloatingElements />
      <div className="page-wrap">
        <header className="page-header">
          <Image
            src="/neimat.png"
            alt="לוגו נעימת הלב"
            width={72}
            height={72}
            className="school-logo"
            priority
          />
          <h1 className="page-title">לוח מבחנים שכבת י"א<br />נעימת הלב</h1>
          <p className="page-sub">עדכון אחרון: {buildTimestamp()}</p>
        </header>
        <SchedulePage />
      </div>
    </>
  )
}
