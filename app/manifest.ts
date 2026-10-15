import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AUVA APP',
    short_name: 'AUVA APP',
    description:
      'Calculate physical gold value, classic pivot points, and monitor gold market context.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f7fb',
    theme_color: '#f7f8fa',
    icons: [
      {
        src: '/pwa-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
