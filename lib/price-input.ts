export function normalizePriceInput(value: string) {
  const normalized = value.replace(/,/g, '').replace(/[^\d.]/g, '')
  const decimalIndex = normalized.indexOf('.')

  if (decimalIndex < 0) return normalized

  const integerPart = normalized.slice(0, decimalIndex)
  const decimalPart = normalized.slice(decimalIndex + 1).replace(/\./g, '').slice(0, 2)
  return `${integerPart}.${decimalPart}`
}

export function formatPriceInput(value: string, useThousandsSeparator: boolean) {
  const [integerPart, decimalPart] = value.split('.')
  const formattedInteger = useThousandsSeparator
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : integerPart

  return decimalPart === undefined
    ? formattedInteger
    : `${formattedInteger}.${decimalPart}`
}
