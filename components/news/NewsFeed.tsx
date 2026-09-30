'use client'

import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NewsImage } from '@/components/news/NewsImage'

export type NewsArticle = {
  id: string
  title: string
  link: string
  image_url: string | null
  description: string | null
  source: string
  category: string
  published_at: string
}

const FILTERS = [
  { value: 'all', label: 'All News' },
  { value: 'gold', label: 'Gold' },
  { value: 'hangseng', label: 'Hang Seng' },
  { value: 'nikkei', label: 'Nikkei' },
] as const

type FilterValue = (typeof FILTERS)[number]['value']

function formatPublishedDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function NewsFeed({ initialArticles }: { initialArticles: NewsArticle[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')

  const filteredArticles = useMemo(() => {
    if (activeFilter === 'all') return initialArticles
    return initialArticles.filter((article) => article.category === activeFilter)
  }, [activeFilter, initialArticles])

  return (
    <div>
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex min-w-max items-center gap-3">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={[
                  'rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-sm'
                    : 'border-[#d8dfe8] bg-white text-slate-700 hover:border-slate-300',
                ].join(' ')}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <PaginatedArticles key={activeFilter} articles={filteredArticles} />
    </div>
  )
}

const PAGE_SIZE = 4

function PaginatedArticles({ articles }: { articles: NewsArticle[] }) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)

  const pageArticles = useMemo(
    () => articles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [articles, safePage],
  )

  function goTo(page: number) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No articles found for this category.
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {pageArticles.map((article) => (
          <article
            key={article.id}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            <NewsImage
              src={article.image_url}
              alt={article.title}
              fallbackSeed={article.id}
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="px-4 pb-5 pt-4">
              <div className="mb-3 flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                <span className="truncate">{article.source}</span>
                <span>{formatPublishedDate(article.published_at)}</span>
              </div>
              <h2 className="line-clamp-2 text-[clamp(1.9rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.04em] text-slate-900">
                {article.title}
              </h2>
              {article.description ? (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  {article.description}
                </p>
              ) : null}
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0d72c9] transition-colors hover:text-[#0a5bb3]"
              >
                <span>Read More</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === safePage
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goTo(page)}
                  aria-label={`Page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-[#0f172a] text-white shadow-md scale-110'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
                  ].join(' ')}
                >
                  {page}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => goTo(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <p className="text-[11px] font-medium tracking-wide text-slate-400">
            Page {safePage} of {totalPages} &middot; {articles.length} articles
          </p>
        </div>
      )}
    </div>
  )
}
