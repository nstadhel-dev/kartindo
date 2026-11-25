KARTINDO LOCKED-v53 - Fix Share FB (FINAL)
KENAPA DI SCREENSHOT MASIH MUNCUL JUDUL UMUM?
Ada 3 penyebab, cek satu-satu (kalau 1 saja belum, preview tetap lama):
1. ZIP v51/v52 belum di-deploy ulang. Middleware hanya jalan kalau file functions/ ikut ter-upload + Redeploy di Pages.
   Cek: buka https://kartindo.pages.dev/produk/TEST - kalau 404 / halaman depan, berarti functions belum deploy.
2. D1 belum ada data produk. Middleware ambil produk dari D1.
   Cek: di website (yang sudah deploy) -> Setting Admin -> Cloudflare D1 -> Aktifkan -> klik Sinkron ke D1.
   Kalau belum Sinkron, D1 kosong -> middleware tidak ketemu produk -> fallback ke judul umum.
3. Cache Facebook belum di-clear. FB simpan preview lama berminggu-minggu.
   WAJIB: buka https://developers.facebook.com/tools/debug/ -> paste link BARU:
   https://kartindo.pages.dev/produk/ID_PRODUK -> klik Scrape Again sampai preview berubah.
   ID produk bisa dilihat di URL saat buka detail produk / di Setting? Atau klik Salin Link di card produk.
   Kalau tidak Scrape Again, FB akan tampilkan preview lama terus walau server sudah benar.

CARA TEST YANG BENAR (urut):
A. Upload ZIP v53 -> Cloudflare Pages -> Redeploy -> tunggu selesai.
B. Buka https://kartindo.pages.dev/ -> Setting Admin -> D1 -> Aktifkan -> Sinkron ke D1.
C. Ambil link share dari card produk (tombol Salin Link) -> link-nya sekarang https://kartindo.pages.dev/produk/ID
D. Paste link itu ke Sharing Debugger -> Scrape Again -> lihat preview harusnya nama+foto produk.
E. Baru share ke FB.

Kalau setelah A-D masih judul umum, kirim screenshot hasil Sharing Debugger (bagian 'When and how we last scraped the URL') - dari situ ketahuan FB baca apa.
