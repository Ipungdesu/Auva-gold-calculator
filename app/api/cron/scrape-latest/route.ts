import { NextRequest, NextResponse } from "next/server";
import { scrapeLatestGoldOhlc } from "@/lib/scrape-ohlc";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  // Authorization Check
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Scrape latest OHLC from Newsmaker
    const row = await scrapeLatestGoldOhlc();

    // 2. Upsert to Supabase table `ohlc_data` (unique on symbol, date)
    const { error: upsertError } = await supabaseAdmin
      .from("ohlc_data")
      .upsert(row, { onConflict: "symbol,date" });

    if (upsertError) throw upsertError;

    // 3. Automated 30-Day Retention Cleanup for XAUUSD
    const retentionDays = 30;
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const { error: retentionError } = await supabaseAdmin
      .from("ohlc_data")
      .delete()
      .eq("symbol", "XAUUSD")
      .lt("date", cutoffDate);

    if (retentionError) {
      console.warn("Retention cleanup warning:", retentionError.message);
    }

    return NextResponse.json({
      success: true,
      data: row,
      retentionCutoff: cutoffDate,
    });
  } catch (err) {
    console.error("Cron Scraping Error:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}