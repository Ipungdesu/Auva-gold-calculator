import * as cheerio from "cheerio";

export interface OhlcRow {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Simbol di DB -> nama kategori di tabel "Data Historis" Newsmaker
const CATEGORY_MAP: Record<string, string> = {
  XAUUSD: "LGD Daily",
  HSI: "HSI Daily",
  NIKKEI: "SNI Daily",
};

// Ambil N hari trading terakhir per instrumen. Upsert idempoten, jadi hari yang
// sempat bolong (mis. cron gagal) otomatis ter-backfill di run berikutnya.
const DAYS_BACK = 10;

interface HistoricalItem {
  id: number;
  tanggal: string;
  open: string | null;
  high: string | null;
  low: string | null;
  close: string | null;
  category: string;
  isBankHoliday: boolean;
}

function parseNumber(val: string | null | undefined): number {
  if (!val) return 0;
  const num = parseFloat(val.replace(/,/g, "").trim());
  return Number.isNaN(num) ? 0 : num;
}

// Next.js mengirim data halaman sebagai potongan "flight payload":
// <script>self.__next_f.push([1,"<string JSON ter-escape>"])</script>
function readFlightPayload(html: string): string {
  const $ = cheerio.load(html);
  const prefix = "self.__next_f.push([1,";
  let flight = "";
  $("script").each((_, el) => {
    const text = ($(el).html() ?? "").trim();
    if (text.startsWith(prefix) && text.endsWith("])")) {
      flight += JSON.parse(text.slice(prefix.length, -2)) as string;
    }
  });
  return flight;
}

// Ambil array JSON tepat setelah `key` dengan bracket matching
// (aman terhadap string yang berisi tanda kurung / kutip).
function extractArray(src: string, key: string): unknown[] {
  const at = src.indexOf(key);
  if (at < 0) throw new Error(`Key ${key} tidak ditemukan di payload`);
  const start = src.indexOf("[", at);
  let depth = 0;
  let inString = false;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') {
      inString = true;
    } else if (ch === "[") {
      depth++;
    } else if (ch === "]" && --depth === 0) {
      return JSON.parse(src.slice(start, i + 1));
    }
  }
  throw new Error("Array pada payload tidak tertutup");
}

async function fetchHistoricalItems(): Promise<HistoricalItem[]> {
  const res = await fetch("https://www.newsmaker.id/id/tools/historical-data", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "id-ID,id;q=0.9",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`Gagal fetch historical-data, status: ${res.status}`);

  const flight = readFlightPayload(await res.text());
  return extractArray(flight, '"initialItems":') as HistoricalItem[];
}

function isValidOhlc(o: number, h: number, l: number, c: number): boolean {
  if (o <= 0 || h <= 0 || l <= 0 || c <= 0) return false;
  return h >= Math.max(o, l, c) && l <= Math.min(o, h, c);
}

export async function scrapeAllInstruments(): Promise<OhlcRow[]> {
  const items = await fetchHistoricalItems();
  const results: OhlcRow[] = [];

  for (const [symbol, category] of Object.entries(CATEGORY_MAP)) {
    // Satu baris per tanggal; kalau ada duplikat, ambil id terbesar (entri terbaru).
    const byDate = new Map<string, HistoricalItem>();
    for (const it of items) {
      if (it.category !== category || it.isBankHoliday) continue;
      // Buang tanggal typo di sumber, mis. "0206-01-22"
      if (!/^20\d{2}-\d{2}-\d{2}$/.test(it.tanggal)) continue;
      const prev = byDate.get(it.tanggal);
      if (!prev || it.id > prev.id) byDate.set(it.tanggal, it);
    }

    const newestFirst = [...byDate.values()].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
    const before = results.length;

    for (const it of newestFirst) {
      if (results.length - before >= DAYS_BACK) break;

      const open = parseNumber(it.open);
      const high = parseNumber(it.high);
      const low = parseNumber(it.low);
      const close = parseNumber(it.close);

      if (!isValidOhlc(open, high, low, close)) {
        console.warn(`Skip ${symbol} ${it.tanggal}: OHLC tidak valid`, { open, high, low, close });
        continue;
      }
      results.push({ symbol, date: it.tanggal, open, high, low, close });
    }

    if (results.length === before) {
      throw new Error(`Tidak ada baris valid untuk ${symbol} (${category})`);
    }
  }

  return results;
}