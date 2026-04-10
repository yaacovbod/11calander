import Image from 'next/image'
import FloatingElements from '@/components/FloatingElements'
import SchedulePage from '@/components/SchedulePage'

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
          <p className="page-sub">עדכון אחרון: 09/04/26 &nbsp;|&nbsp; הלוח מעודכן עד 21/05/26</p>
        </header>
        <SchedulePage />
      </div>
    </>
  )
}
