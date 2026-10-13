export const dynamic = 'force-dynamic'

import { AppHeader } from '@/components/goldcalc/app-header'
import { BottomNavigation } from '@/components/goldcalc/bottom-navigation'
import { NewsFeed, type NewsArticle } from '@/components/news/NewsFeed'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export default async function NewsRoutePage() {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) {
    throw new Error(`Failed to load news: ${error.message}`)
  }

  const initialArticles: NewsArticle[] = (data ?? []).map((item) => ({
    id: String(item.id),
    title: item.title ?? 'Untitled article',
    link: item.link ?? '#',
    image_url: item.image_url ?? null,
    description: item.description ?? null,
    source: item.source ?? 'Unknown',
    category: item.category ?? 'gold',
    published_at: item.published_at ?? new Date().toISOString(),
  }))

  return (
    <div className="min-h-screen bg-[#f3f5f7] text-slate-900 antialiased">
      <AppHeader />

      <main className="mx-auto max-w-md px-4 pb-24 pt-5 sm:max-w-xl sm:px-6 lg:max-w-5xl lg:px-8">
        <NewsFeed initialArticles={initialArticles} />
      </main>

      <BottomNavigation page="news" />
    </div>
  )
}