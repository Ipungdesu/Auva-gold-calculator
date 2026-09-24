import NestCalculatorPage from '@/components/pages/nest-calculator-page'

interface PageProps {
  params: Promise<{
    symbol: string
  }>
}

export default async function NestSymbolPage({ params }: PageProps) {
  const { symbol } = await params

  return <NestCalculatorPage symbol={symbol} />
}