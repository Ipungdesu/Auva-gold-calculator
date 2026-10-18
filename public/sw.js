const CACHE_NAME = 'auva-offline-v1'
const NETWORK_TIMEOUT_MS = 3000
const PRECACHE_PATHS = [
  '/',
  '/gold',
  '/news',
  '/pivot',
  '/pivot/nest',
  '/pivot/gold',
  '/pivot/hangseng',
  '/pivot/nikkei',
  '/pivot/nest/gold',
  '/pivot/nest/hangseng',
  '/pivot/nest/nikkei',
]
const PRECACHE_API_PATHS = [
  '/api/nest/historical?symbol=gold',
  '/api/nest/historical?symbol=hangseng',
  '/api/nest/historical?symbol=nikkei',
]

async function fetchWithTimeout(request) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS)

  try {
    return await fetch(request, { signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const precachedAssets = new Set()

      await Promise.all(
        PRECACHE_PATHS.map(async (path) => {
          const url = new URL(path, self.location.origin)

          try {
            const response = await fetchWithTimeout(url.href)
            if (!response.ok) {
              throw new Error(`Unable to precache ${path}: ${response.status}`)
            }

            await cache.put(url.href, response.clone())

            const html = await response.text()
            const assetUrls = new Set(
              [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
                .map((match) => new URL(match[1], self.location.origin))
                .filter(
                  (assetUrl) =>
                    assetUrl.origin === self.location.origin &&
                    assetUrl.pathname.startsWith('/_next/static/') &&
                    !precachedAssets.has(assetUrl.href),
                )
                .map((assetUrl) => assetUrl.href),
            )

            assetUrls.forEach((assetUrl) => precachedAssets.add(assetUrl))
            await Promise.all(
              [...assetUrls].map(async (assetUrl) => {
                try {
                  const assetResponse = await fetchWithTimeout(assetUrl)
                  if (assetResponse.ok) {
                    await cache.put(assetUrl, assetResponse)
                  }
                } catch (error) {
                  console.error('Failed to precache an application asset:', error)
                }
              }),
            )
          } catch (error) {
            console.error(`Failed to precache ${path}:`, error)
          }
        }),
      )

      await Promise.all(
        PRECACHE_API_PATHS.map(async (path) => {
          const url = new URL(path, self.location.origin)

          try {
            const response = await fetchWithTimeout(url.href)
            if (response.ok) {
              await cache.put(url.href, response)
            }
          } catch (error) {
            console.error(`Failed to precache ${path}:`, error)
          }
        }),
      )

      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('auva-offline-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  const isRsc = request.headers.get('RSC') === '1' || url.searchParams.has('_rsc')
  const cacheKey = isRsc
    ? new Request(`${url.origin}${url.pathname}?__auva_rsc=1`)
    : request

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)

      try {
        const response = await fetchWithTimeout(request)
        if (response.ok && response.status === 200) {
          try {
            await cache.put(cacheKey, response.clone())
          } catch (error) {
            console.error('Failed to update the offline cache:', error)
          }
        }
        return response
      } catch {
        const cachedResponse = await cache.match(cacheKey)
        if (cachedResponse) return cachedResponse

        if (request.mode === 'navigate') {
          const fallback = await cache.match(url.pathname)
          if (fallback) return fallback

          const appShell = await cache.match('/')
          if (appShell) return appShell
        }

        return Response.error()
      }
    })(),
  )
})
