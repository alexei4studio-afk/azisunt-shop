import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  try {
    const cwd = process.cwd()

    const { stdout: status } = await execAsync('git status --porcelain', { cwd })

    if (status.trim()) {
      await execAsync('git add -A', { cwd })
      await execAsync('git commit -m "Deploy from Control Panel"', { cwd })
    }

    const { stdout, stderr } = await execAsync('git push', { cwd, timeout: 30000 })

    return NextResponse.json({
      success: true,
      message: status.trim()
        ? 'Commit + Push reușit. Vercel va face deploy automat.'
        : 'Push reușit (nu erau modificări noi de comis). Vercel va face deploy automat.'
    })
  } catch (error: any) {
    console.error('Deploy error:', error)
    return NextResponse.json(
      { error: error.message || 'Eroare la deploy' },
      { status: 500 }
    )
  }
}
