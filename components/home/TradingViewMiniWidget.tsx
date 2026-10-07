'use client'

import { useEffect, useRef, memo } from 'react'

interface TradingViewMiniWidgetProps {
  symbol: string
  height?: number
  colorTheme?: 'light' | 'dark'
  locale?: string
  dateRange?: string
}

function TradingViewMiniWidgetComponent({
  symbol,
  height = 170,
  colorTheme = 'light',
  locale = 'en',
  dateRange = '1D',
}: TradingViewMiniWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    container.appendChild(widgetDiv)

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol,
      width: '100%',
      height,
      locale,
      dateRange,
      colorTheme,
      isTransparent: true,
      autosize: false,
      largeChartUrl: '',
    })
    container.appendChild(script)

    return () => {
      if (container) container.innerHTML = ''
    }
  }, [symbol, height, colorTheme, locale, dateRange])

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full overflow-hidden"
      style={{ height }}
    />
  )
}

export const TradingViewMiniWidget = memo(TradingViewMiniWidgetComponent)
