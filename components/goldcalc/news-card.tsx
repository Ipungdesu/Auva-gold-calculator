'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import type { NewsItem } from '@/lib/goldcalc-data'

interface NewsCardProps {
  item: NewsItem
  onClick?: () => void
}

export function NewsCard({ item, onClick }: NewsCardProps) {
  return (
    <article
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
    >
      {/* Image */}
      {item.image && (
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex flex-col gap-2">
          {/* Source & Date */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>{item.source}</span>
            <span>{item.published}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight group-hover:text-[#0292e3] transition-colors">
            {item.title}
          </h3>

          {/* Summary */}
          <p className="line-clamp-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {item.summary}
          </p>
        </div>

        {/* Read More Link */}
        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#241e52] group-hover:text-[#0292e3]">
          <span>Read More</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </article>
  )
}
