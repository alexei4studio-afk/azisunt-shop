import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('products')
      .select('category')

    if (error) throw error

    const categories = [...new Set((data || []).map((r: any) => r.category).filter(Boolean))].sort()

    return NextResponse.json(categories)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
