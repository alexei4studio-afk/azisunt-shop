import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID lipsă' }, { status: 400 })

    const scriptPath = path.join(process.cwd(), 'scripts', 'luxury-rewrite.js')

    const child = spawn('node', [scriptPath, id])

    return NextResponse.json({ message: 'Rescrierea a început în fundal' })
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}
