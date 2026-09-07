'use client'

import { useState } from 'react'
import { ChevronDown, Radio } from 'lucide-react'
import { NewsCard } from '@/components/goldcalc/news-card'
import { TradingViewNewsWidget } from '@/components/goldcalc/tradingview-news-widget'
import { news, categories, type NewsItem } from '@/lib/goldcalc-data'

interface NewsPageProps {
  showNews: (n: NewsItem) => void
}

export function NewsPage({ showNews }: NewsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All News')
  const [showLiveStream, setShowLiveStream] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  const filteredNews =
    selectedCategory === 'All News'
      ? news
      : news.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory.toLowerCase() ||
            (selectedCategory === 'Interest Rates' && item.category === 'Interest Rate') ||
            (selectedCategory === 'Global Economy' && item.category === 'Economy')
        )

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-6 sm:max-w-xl sm:px-6 lg:max-w-4xl lg:px-8">
      {/* Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Gold Fundamental News
          </h1>

          <button
            onClick={() => setShowLiveStream(!showLiveStream)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:border-[#0292e3]"
          >
            <Radio className="h-3.5 w-3.5 text-[#0292e3]" />
            {showLiveStream ? 'Show Card View' : 'TradingView Feed'}
          </button>
        </div>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Stay informed with important news related to gold and global financial markets.
        </p>
      </div>

      {showLiveStream ? (
        /* TradingView News Stream Container */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <TradingViewNewsWidget symbol="OANDA:XAUUSD" height={650} />
        </div>
      ) : (
        /* Curated News Stream Layout matching Screenshot 2 */
        <div className="flex flex-col gap-6">
          {/* Categories Pill Buttons */}
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'border border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Vertical Stack / Grid of News Cards */}
          {filteredNews.length > 0 ? (
            <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2">
              {filteredNews.slice(0, visibleCount).map((item) => (
                <NewsCard key={item.id} item={item} onClick={() => showNews(item)} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              No news items available for this category.
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredNews.length && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
              >
                <span>Load More News</span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
