import { NextResponse } from 'next/server'
import { execFile } from 'child_process'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { sourceId, url, count } = await request.json()

    const script = sourceId === 'emag' ? 'mega-auto-import-emag.js' : 'mega-auto-import.js'
    const scriptPath = path.join(process.cwd(), script)

    execFile('node', [scriptPath, url], (error, stdout, stderr) => {
      if (error) console.error(`Import Error: ${error.message}`)
      if (stdout) console.log(`Import Log: ${stdout}`)
    })

    return NextResponse.json({
      success: true,
      message: `Agentul ${script} a fost pornit pentru ${count} produse.`
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
