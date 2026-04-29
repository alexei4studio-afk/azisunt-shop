import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL lipsă' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    clearTimeout(timeout)

    const finalUrl = response.url
    const status = response.status
    const valid = status >= 200 && status < 400

    return NextResponse.json({ valid, status, finalUrl })
  } catch (error: any) {
    return NextResponse.json({
      valid: false,
      status: 0,
      error: error.name === 'AbortError' ? 'Timeout (10s)' : error.message
    })
  }
}
