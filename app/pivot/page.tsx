import { PivotLandingPage } from '@/components/pages/pivot-landing-page'

export const metadata = {
  title: 'AUVA APP',
  description:
    'Calculate Classic Pivot Point using historical data or manual OHLC input for Gold, Hangseng, and Nikkei.',
}

export default function Page() {
  return <PivotLandingPage mode="pivot" />
}
