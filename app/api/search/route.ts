import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')?.trim() || ''

  if (!query) return NextResponse.json([])

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(8)

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
