'use client'

import { useEffect, useRef, memo } from 'react'

interface TradingViewNewsWidgetProps {
  symbol?: string
  colorTheme?: 'light' | 'dark'
  width?: string | number
  height?: string | number
  feedMode?: 'symbol' | 'all_symbols' | 'market'
  market?: string
  className?: string
}

function TradingViewNewsWidgetComponent({
  symbol = 'OANDA:XAUUSD',
  colorTheme = 'light',
  width = '100%',
  height = 650,
  feedMode = 'symbol',
  market = 'commodities',
  className = '',
}: TradingViewNewsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear previous widget content on updates
    container.innerHTML = ''

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    widgetDiv.style.width = '100%'
    widgetDiv.style.height = typeof height === 'number' ? `${height}px` : height
    container.appendChild(widgetDiv)

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js'
    script.type = 'text/javascript'
    script.async = true

    const widgetConfig: Record<string, unknown> = {
      displayMode: 'adaptive',
      colorTheme: colorTheme,
      isTransparent: false,
      locale: 'en',
      width: '100%',
      height: height,
    }

    if (feedMode === 'symbol') {
      widgetConfig.feedMode = 'symbol'
      widgetConfig.symbol = symbol
    } else if (feedMode === 'market') {
      widgetConfig.feedMode = 'market'
      widgetConfig.market = market
    } else {
      widgetConfig.feedMode = 'all_symbols'
    }

    script.innerHTML = JSON.stringify(widgetConfig)
    container.appendChild(script)

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [symbol, colorTheme, width, height, feedMode, market])

  return (
    <div className={`tradingview-widget-container w-full overflow-hidden rounded-lg border bg-card ${className}`}>
      <div ref={containerRef} className="w-full flex justify-center min-h-[500px]" />
      <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
        <span>Real-time news feed for {symbol}</span>
        <a
          href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/news/`}
          target="_blank"
          rel="noopener nofollow noreferrer"
          className="font-medium text-gold hover:underline"
        >
          TradingView Live News ↗
        </a>
      </div>
    </div>
  )
}

export const TradingViewNewsWidget = memo(TradingViewNewsWidgetComponent)
