import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const config = {
      urls: body.urls || [],
      steps: {
        trendScout: body.steps?.trendScout ?? true,
        import: body.steps?.import ?? true,
        rewrite: body.steps?.rewrite ?? true,
        qc: body.steps?.qc ?? true,
        socialKit: body.steps?.socialKit ?? true,
      }
    }

    const scriptPath = path.join(process.cwd(), 'conductor.js')

    const child = spawn('node', [scriptPath], {
      env: {
        ...process.env,
        ORCHESTRA_CONFIG: JSON.stringify(config),
      },
    })

    const logPath = path.join(process.cwd(), 'maintenance.log')
    const activeSteps = Object.entries(config.steps).filter(([, v]) => v).map(([k]) => k).join(', ')
    fs.appendFileSync(logPath, `[${new Date().toLocaleString()}] Orchestra started — steps: ${activeSteps}, custom URLs: ${config.urls.length}\n`)

    return NextResponse.json({
      message: 'Orchestra a început reprezentația',
      config
    })
  } catch (error) {
    return NextResponse.json({ error: 'Eroare la pornirea orchestrei' }, { status: 500 })
  }
}
