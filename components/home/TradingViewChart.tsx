'use client'

import { useEffect, useRef, memo } from 'react'

interface TradingViewChartProps {
  symbol: string
  height?: number
  colorTheme?: 'light' | 'dark'
  locale?: string
}

function TradingViewChartComponent({
  symbol,
  height = 400,
  colorTheme = 'light',
  locale = 'en',
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    widgetDiv.style.height = `${height}px`
    widgetDiv.style.width = '100%'
    container.appendChild(widgetDiv)

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: false,
      symbol,
      interval: '60',
      timezone: 'Asia/Jakarta',
      theme: colorTheme,
      style: '1',
      locale,
      allow_symbol_change: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      height,
      width: '100%',
      support_host: 'https://www.tradingview.com',
    })
    container.appendChild(script)

    return () => {
      if (container) container.innerHTML = ''
    }
  }, [symbol, height, colorTheme, locale])

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full overflow-hidden rounded-xl"
      style={{ height }}
    />
  )
}

export const TradingViewChart = memo(TradingViewChartComponent)
