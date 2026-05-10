import { NextResponse } from 'next/server'
import { marathons } from '@/data/marathons'

export const dynamic = 'force-dynamic'

const CORS = { 'Access-Control-Allow-Origin': '*' }

export async function GET() {
  return NextResponse.json(marathons, { headers: CORS })
}
