'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Newspaper, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/lib/LanguageContext'
import { NewsImage } from '@/components/news/NewsImage'

interface NewsArticle {
  id: number | string
  title: string
  link: string
  image_url: string | null
  description: string | null
  source: string
  category: string
  published_at: string
}

export function HomeNewsSection() {
  const { t, lang } = useTranslation()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchLatestNews() {
      try {
        const res = await fetch('/api/news/latest')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (isMounted && data.articles) {
          setArticles(data.articles)
        }
      } catch {
        // Fallback: empty array
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchLatestNews()

    return () => {
      isMounted = false
    }
  }, [])

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      if (Number.isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <section className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Newspaper className="h-4 w-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
            {t.newsTitle}
          </h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            {t.newsHighlights}
          </span>
        </div>

        <Link
          href="/news"
          className="flex items-center gap-1 text-xs font-bold text-[#0292e3] transition-colors hover:text-[#0e3d7a] hover:underline"
        >
          <span>{t.viewAllNews}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* News Card Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[0, 1].map((item) => (
              <div
                key={item}
                className={`flex gap-3 ${item === 1 ? 'border-t border-slate-100 pt-3' : ''}`}
              >
                <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="py-4 text-center text-xs text-slate-400">
            {t.noNewsAvailable}
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {articles.slice(0, 2).map((article, idx) => (
              <article
                key={article.id}
                className={`flex gap-3 ${idx === 0 ? 'pb-3.5' : 'pt-3.5'}`}
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-28">
                  <NewsImage
                    src={article.image_url}
                    alt={article.title}
                    fallbackSeed={String(article.id)}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex min-w-0 items-center justify-between gap-2 text-[10px] text-slate-400 sm:text-[11px]">
                    <span className="truncate font-semibold uppercase tracking-wider text-slate-600">
                      {article.source}
                    </span>
                    <span className="shrink-0">{formatDate(article.published_at)}</span>
                  </div>

                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-1"
                  >
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#0292e3]">
                      {article.title}
                    </h3>
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>

                  {article.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {article.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA to view all news */}
        <div className="mt-4 border-t border-slate-100 pt-3 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14509b] transition-colors hover:text-[#0292e3]"
          >
            <span>{t.viewAllNews}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
