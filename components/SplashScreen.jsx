'use client'

import { useEffect, useState } from 'react'

const SPLASH_DURATION = 1800
const EXIT_DURATION = 450

/**
 * @param {{ onComplete: () => void }} props
 */
export function SplashScreen({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setIsExiting(true), SPLASH_DURATION)
    const completeTimer = window.setTimeout(
      onComplete,
      SPLASH_DURATION + EXIT_DURATION,
    )

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`splash-screen${isExiting ? ' splash-screen--exiting' : ''}`}
      aria-label="AUVA Gold Calculation loading"
      aria-busy={!isExiting}
    >
      <main className="splash-content">
        <div className="splash-logo">
          <span className="splash-logo__orbit" aria-hidden="true" />
          <img src="/logo.svg" alt="" width="96" height="96" />
          <span className="splash-logo__shimmer" aria-hidden="true" />
        </div>

        <div className="splash-copy">
          <h1>AUVA</h1>
          <p>Gold Calculation &amp; Market Information</p>
        </div>

        <div className="splash-progress" role="progressbar" aria-label="Loading">
          <span />
        </div>
      </main>

      <footer className="splash-copyright">
        © 2026 AUVA | GOLD CALCULATION &amp; MARKET INFORMATION
      </footer>
    </div>
  )
}
