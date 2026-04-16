import { put, list } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { schedule as staticSchedule } from '@/data/events'

const BLOB_PATH = 'events-data.json'

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH })
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: 'no-store' })
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (e) {
    console.error('Blob GET error:', e)
  }
  return NextResponse.json(staticSchedule)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await put(BLOB_PATH, JSON.stringify(body), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('Blob POST error:', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
