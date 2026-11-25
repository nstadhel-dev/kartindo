// Cloudflare Pages Functions - Middleware untuk Crawler (FB / WA / X / LinkedIn)
// Masalah: Facebook tidak menjalankan JavaScript, jadi dia hanya baca OG Tag statis.
// Solusi: kalau yang buka adalah crawler + URL ada ?produk=ID, kirim HTML khusus
// dengan OG Title / Description / Image produk itu. Manusia tetap dapat SPA normal.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const ua = (context.request.headers.get('User-Agent') || '').toLowerCase();
  const isCrawler = ua.includes('facebookexternalhit') || ua.includes('facebot') || ua.includes('twitterbot') || ua.includes('linkedinbot') || ua.includes('whatsapp') || ua.includes('telegrambot');
  const pid = url.searchParams.get('produk') || url.searchParams.get('p');
  if (!isCrawler || !pid) return context.next();
  try {
    const db = context.env.DB;
    let prod = null;
    if (db) {
      const row = await db.prepare("SELECT data FROM kartindo_data WHERE id = 'main'").first();
      if (row) { const d = JSON.parse(row.data); prod = (d.products || []).find(x => String(x.id) === String(pid)); }
    }
    if (!prod) return context.next();
    const title = prod.name + ' - Kartindo';
    const desc = (prod.description || '').slice(0, 160);
    const img = prod.foto || 'https://kartindo.pages.dev/icon-192.png';
    const link = url.origin + '/?produk=' + encodeURIComponent(pid);
    const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    return new Response(`<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="${esc(img)}"><meta property="og:url" content="${esc(link)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(img)}"><meta http-equiv="refresh" content="0; url=${esc(link)}"></head><body><h1>${esc(prod.name)}</h1><p>${esc(desc)}</p><a href="${esc(link)}">Buka Produk</a></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch(e) { return context.next(); }
}
