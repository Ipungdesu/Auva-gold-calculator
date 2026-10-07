import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('news_articles')
      .select('id, title, link, image_url, description, source, category, published_at')
      .order('published_at', { ascending: false })
      .limit(2)

    if (error) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json({
      articles: data ?? [],
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
