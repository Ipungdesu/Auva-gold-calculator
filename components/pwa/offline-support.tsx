'use client'

import { useEffect, useState } from 'react'
import { useOffline } from 'next/offline'
import { useTranslation } from '@/lib/LanguageContext'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const isOffline = useOffline()

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    updateOnlineStatus()
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return isOnline && !isOffline
}

export function OfflineSupport() {
  const isOnline = useOnlineStatus()
  const { translate } = useTranslation()

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
        console.error('Failed to register the offline service worker:', error)
      })
    }

    const openCachedRoute = (event: MouseEvent) => {
      if (isOnline || event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!(event.target instanceof Element)) return

      const link = event.target.closest('a[href]')
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute('download')) {
        return
      }

      const destination = new URL(link.href)
      if (destination.origin !== window.location.origin) return

      event.preventDefault()
      event.stopImmediatePropagation()
      window.location.assign(destination.href)
    }

    document.addEventListener('click', openCachedRoute, true)
    return () => document.removeEventListener('click', openCachedRoute, true)
  }, [isOnline])

  if (isOnline) return null

  return (
    <div
      className="fixed inset-x-0 top-16 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900 shadow-sm"
      role="status"
      aria-live="polite"
    >
      {translate(
        'Offline mode: calculations remain available using saved data. Market data may be outdated.',
      )}
    </div>
  )
}
