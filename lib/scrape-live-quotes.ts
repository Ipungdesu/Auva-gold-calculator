export interface LiveQuoteOhlc {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const SYMBOL_MAP: Record<string, string> = {
  XUL10: "XAUUSD",
  HKK50_BBJ: "HSI",
  JPK50_BBJ: "NIKKEI",
};

function getYesterdayWIB(): string {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  wib.setUTCDate(wib.getUTCDate() - 1);
  return wib.toISOString().split("T")[0];
}

export async function scrapeLiveQuotes(): Promise<LiveQuoteOhlc[]> {
  const res = await fetch("https://www.newsmaker.id/api/live-quotes", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Gagal fetch live-quotes, status: ${res.status}`);

  const json = await res.json();
  if (json.status !== "success") throw new Error("Response status bukan success");

  const date = getYesterdayWIB();
  const results: LiveQuoteOhlc[] = [];

  for (const item of json.data) {
    const mappedSymbol = SYMBOL_MAP[item.symbol];
    if (!mappedSymbol) continue;

    results.push({
      symbol: mappedSymbol,
      date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.last,
    });
  }

  return results;
}