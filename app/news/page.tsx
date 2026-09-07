'use client'

import { AppHeader } from '@/components/goldcalc/app-header'
import { BottomNavigation } from '@/components/goldcalc/bottom-navigation'
import { SidebarNavigation } from '@/components/goldcalc/sidebar-navigation'
import { NewsPage } from '@/components/pages/news-page'
import { useRouter } from 'next/navigation'

export default function NewsRoutePage() {
  const router = useRouter()

  const handleSetPage = (p: string) => {
    if (p === 'home') router.push('/')
    else if (p === 'gold') router.push('/gold')
    else if (p === 'pivot') router.push('/pivot')
    else if (p === 'news') router.push('/news')
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 font-sans antialiased">
      <SidebarNavigation page="news" setPage={handleSetPage} />

      <div className="lg:pl-64">
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)] pb-24 lg:pb-12">
          <NewsPage showNews={() => {}} />
        </main>
      </div>

      <BottomNavigation page="news" setPage={handleSetPage} />
    </div>
  )
}
