// Currency utility functions

export const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    AED: "د.إ",
    BGN: "лв",
  }
  return symbols[currency] || currency
}

export const formatCurrency = (amount: number | any, currency: string): string => {
  const symbol = getCurrencySymbol(currency)
  // Convert to number in case it's a Decimal, string, or other type
  const numAmount = typeof amount === 'number' ? amount : Number(amount)
  const formattedAmount = numAmount.toFixed(2)

  // For some currencies, symbol goes after the amount
  if (currency === "BGN") {
    return `${formattedAmount} ${symbol}`
  }

  return `${symbol}${formattedAmount}`
}
