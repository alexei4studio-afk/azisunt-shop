import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

export async function POST() {
  try {
    const scriptPath = path.join(process.cwd(), 'agent-quality-control.js')
    const logPath = path.join(process.cwd(), 'maintenance.log')

    if (fs.existsSync(logPath)) fs.unlinkSync(logPath)

    const out = fs.openSync(logPath, 'a')
    const err = fs.openSync(logPath, 'a')

    const child = spawn('node', [scriptPath], {
      detached: true,
      stdio: ['ignore', out, err]
    })

    child.unref()

    return NextResponse.json({
      success: true,
      message: 'Agentul de mentenanță a pornit în fundal. Verificarea poate dura câteva minute.'
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to start maintenance',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const logPath = path.join(process.cwd(), 'maintenance.log')
    if (!fs.existsSync(logPath)) return NextResponse.json({ status: 'idle' })

    const content = fs.readFileSync(logPath, 'utf8')
    const isFinished = content.includes('CURĂȚENIE FINALIZATĂ') || content.includes('Catalogul este impecabil')

    return NextResponse.json({
      status: isFinished ? 'finished' : 'running',
      log: content.split('\n').slice(-10).join('\n')
    })
  } catch (error) {
    return NextResponse.json({ status: 'error' })
  }
}
