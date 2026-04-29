import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalid' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'data', 'leads.json')
    
    // Citim datele existente
    let leads = []
    if (fs.existsSync(filePath)) {
      leads = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }

    // Verificam daca email-ul exista deja
    if (leads.some((l: any) => l.email === email)) {
      return NextResponse.json({ message: 'Deja înregistrat' })
    }

    // Adaugam noul lead
    leads.push({
      email,
      date: new Date().toISOString(),
      source: 'landing_vip_access'
    })

    fs.writeFileSync(filePath, JSON.stringify(leads, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'leads.json')
    if (!fs.existsSync(filePath)) return NextResponse.json([])
    
    const leads = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return NextResponse.json(leads)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}
