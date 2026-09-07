import * as cheerio from "cheerio";

const url = "https://www.newsmaker.id/id/tools/historical-data";

async function main() {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "id-ID,id;q=0.9",
    },
  });

  console.log("Status code:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("❌ Kena block / redirect. Cuplikan respons:");
    console.log(text.slice(0, 500));
    return;
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const table = $("table").first();

  if (table.length > 0) {
    const rows = table.find("tr");
    console.log(`✅ Ketemu <table>, ada ${rows.length} baris.`);

    const firstDataRow = rows.eq(1); // baris ke-2 (setelah header)
    const cols = firstDataRow
      .find("td, th")
      .map((i, el) => $(el).text().trim())
      .get();
    console.log("Baris pertama:", cols);
  } else {
    console.log("⚠️ Nggak ketemu <table>. Kemungkinan tabelnya pakai <div>.");
    const dateRegex = /\d{4}-\d{2}-\d{2}/;
    let found = null;
    $("*").each((i, el) => {
      const text = $(el).text().trim();
      if (!found && dateRegex.test(text) && text.length < 15) {
        found = el;
      }
    });
    if (found) {
      console.log("Elemen yang mengandung pola tanggal, HTML induknya:");
      console.log($.html($(found).parent().parent()).slice(0, 1000));
    } else {
      console.log("Nggak ketemu pola tanggal sama sekali di HTML.");
    }
  }

  // Simpan buat inspect manual
  const fs = await import("fs");
  fs.writeFileSync("scripts/page_raw.html", html);
  console.log("\nHTML mentah disimpan ke scripts/page_raw.html");
}

main().catch((err) => console.error("Error:", err));