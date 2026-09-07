import * as cheerio from "cheerio";

export interface OhlcRow {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

function parseNumber(val: string): number {
  if (!val) return 0;
  // Clean commas or formatting e.g. "2,743.20" -> "2743.20"
  const cleaned = val.replace(/,/g, "").trim();
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export async function scrapeLatestGoldOhlc(): Promise<OhlcRow> {
  const url = "https://www.newsmaker.id/id/tools/historical-data";

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "id-ID,id;q=0.9",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Gagal fetch Newsmaker, status: ${res.status}`);

  const html = await res.text();
  const $ = cheerio.load(html);

  const firstDataRow = $("table").first().find("tr").eq(1);
  const cols = firstDataRow
    .find("td, th")
    .map((_, el) => $(el).text().trim())
    .get();

  if (cols.length < 5) throw new Error("Struktur tabel berubah — cek ulang selector-nya");

  const [dateStr, openStr, highStr, lowStr, closeStr] = cols;

  const open = parseNumber(openStr);
  const high = parseNumber(highStr);
  const low = parseNumber(lowStr);
  const close = parseNumber(closeStr);

  // Data Validation
  if (!dateStr || dateStr.length < 6) {
    throw new Error(`Date string invalid: "${dateStr}"`);
  }
  if (open <= 0 || high <= 0 || low <= 0 || close <= 0) {
    throw new Error(`OHLC values must be positive numbers. Got: O=${open}, H=${high}, L=${low}, C=${close}`);
  }
  if (high < low) {
    throw new Error(`High (${high}) cannot be lower than Low (${low})`);
  }

  // Standardize date format YYYY-MM-DD if possible
  let formattedDate = dateStr;
  try {
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) {
      formattedDate = d.toISOString().split("T")[0];
    }
  } catch {}

  return {
    symbol: "XAUUSD",
    date: formattedDate,
    open,
    high,
    low,
    close,
  };
}