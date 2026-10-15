import { PivotLandingPage } from '@/components/pages/pivot-landing-page'

export const metadata = {
  title: 'AUVA APP',
  description: 'Calculate NEST transaction signal using historical Open and Close data.',
}

export default function NestLandingPage() {
  return <PivotLandingPage mode="nest" />
}
