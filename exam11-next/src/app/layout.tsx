import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({
  subsets: ['latin', 'hebrew'],
  weight: ['400', '600', '700'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'לוח מבחנים שכבת י"א | נעימת הלב',
  description: 'לוח מבחנים ובגרויות שכבת י"א בית ספר נעימת הלב 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body>{children}</body>
    </html>
  )
}
