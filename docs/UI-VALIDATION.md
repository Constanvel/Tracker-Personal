# Validasi prototipe UI

Scope: data sintetis, antarmuka in-memory. Tidak menguji autentikasi/database/backup yang belum dibuat.

## Checklist reproduksi

1. Jalankan `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` dengan Node.js 24.
2. Jalankan `npm run dev`. Buka `http://localhost:3000` pada viewport desktop 1440 px dan ponsel 390/360 px.
3. Cari `HUJAN`; hanya Perpustakaan di Ujung Hujan ditampilkan. Hapus pencarian, filter kategori, uji hasil kosong dan reset.
4. Klik tambah progres manhwa: 42,5 menjadi 43,5; total tetap tidak diketahui; status tidak otomatis selesai.
5. Buka detail dengan keyboard, ubah rating menjadi nol lalu belum dinilai; keduanya harus berbeda. Tekan Escape, fokus kembali ke pemicu.
6. Tambahkan judul Unicode dengan kategori Buku; item muncul. Toggle daftar/grid dan favorit. Refresh menghapus perubahan demo.
7. Pengaturan → Kurangi transparansi: toolbar/nav solid dan `backdrop-filter: none`.
8. Periksa tidak ada horizontal overflow pada dokumen ponsel; kategori boleh scroll di dalam barisnya. Navigasi bawah tidak menutupi isi/dialog.
9. Emulasikan `prefers-reduced-motion: reduce`; transisi nonesensial mati. Heatmap contoh memiliki penjelasan teks dan tidak diklaim sebagai data pengguna.
10. Audit axe WCAG 2 A/AA dan 2.1 AA, console runtime, serta screenshot desktop/mobile/dialog. Audit otomatis bukan bukti semua kebutuhan aksesibilitas lulus.

## Hasil aktual

Dijalankan 29 Oktober 2026, Node.js 24.16.0, Chromium headless lokal, production build Next.js:

- `npm run lint`, `npm run typecheck`, `npm test` (6/6), dan `npm run build`: lulus.
- Smoke interaksi: pencarian case-insensitive, update 42,5 → 43,5, detail/rating nol/catatan, Escape, tambah judul Unicode, grid/daftar, kurangi transparansi, dan reset sesudah refresh: lulus.
- Viewport 1440 × 1100 dan 390 × 844: screenshot diperiksa; dokumen ponsel `scrollWidth === innerWidth === 390`, tanpa overflow horizontal.
- axe WCAG 2 A/AA + 2.1 AA: **0 violations** pada beranda desktop, beranda ponsel, dan dialog ponsel sesudah perbaikan kontras. Audit awal menemukan 8 node kontras desktop dan 2 ponsel; semuanya diperbaiki.
- Console runtime: 0 uncaught page errors pada skenario uji. Reduced motion menghasilkan `transition-duration: 0s`. Mode solid menghasilkan `backdrop-filter: none`.
- `npm audit` saat instalasi: 0 vulnerabilities dilaporkan. ESLint 9.39.5 dipin sementara agar sesuai peer dependencies plugin Next; npm menandainya tidak lagi didukung. Migrasi ESLint 10 menunggu dukungan plugin, bukan menyembunyikan warning dengan force/legacy-peer-deps.
- Figma desktop/mobile diperiksa visual; layer teks/vector dan instance komponen editable, bukan screenshot UI.
- Setelah revisi aksen biru baja/amber, production build, lint, smoke interaksi, dan axe desktop/mobile/dialog diulang: lulus, 0 violations, 0 page errors, tanpa overflow horizontal 390 px.

Artefak lokal `test-results/desktop.png`, `mobile.png`, `mobile-dialog.png`, dan `visual-report.json` diabaikan Git agar screenshot/report sementara tidak memenuhi repository. Pengujian ini belum mencakup screen reader/perangkat fisik, seluruh browser, atau benchmark performa PRD.

Browser desktop OpenCode tidak terhubung pada sesi ini. Pengujian lokal dapat memakai Chromium headless terpasang; ini terpisah dari browser Review dan bukan pengujian perangkat fisik.
