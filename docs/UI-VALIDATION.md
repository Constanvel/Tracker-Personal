# Validasi prototipe UI

Scope: data sintetis, antarmuka in-memory. Tidak menguji autentikasi/database/backup yang belum dibuat. Semua perubahan demo hilang saat refresh/full navigation; navigasi client-side mempertahankan state.

## Reproduksi

1. Jalankan `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, dan `npm run build` dengan Node.js 24.
2. Pasang Chromium: `npx playwright install chromium`. Jalankan `npm run test:e2e`. Windows dapat memakai `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` seperti contoh di [tests/README.md](../tests/README.md).
3. Untuk pemeriksaan manual, jalankan `npm run dev` dan buka `http://localhost:3000`. Ikuti [peta route](ROUTES.md).
4. Cari `HUJAN`, buka detail/edit, bedakan rating nol dari belum dinilai. Tambahkan judul Unicode, progres pecahan, favorit, jurnal, dan koleksi. Uji back/forward dan refresh.
5. Pengaturan → Kurangi transparansi harus menghasilkan `backdrop-filter: none`. Reduced motion harus mematikan transisi nonesensial.
6. Periksa desktop 1440 px dan ponsel 390/360 px. Kategori boleh scroll di dalam baris; dokumen tidak boleh overflow horizontal. Navigasi bawah tidak menutupi aksi terakhir.
7. Periksa keyboard, screen reader dan perangkat fisik secara manual sebelum rilis. Axe otomatis bukan bukti seluruh kebutuhan aksesibilitas lulus.

## Halaman routed — hasil 29 Oktober 2026

Lingkungan: Node.js 24.16.0, Chrome headless lokal, production build Next.js. Suite tersimpan di `tests/e2e/navigation.spec.ts`; bukan skrip smoke sementara.

- Lint, typecheck, **9/9 unit test**, dan production build: lulus.
- **32 URL langsung** mencakup seluruh route yang diiklankan, enam detail/edit item demo, dan dua koleksi demo: HTTP 200, satu heading utama, tanpa not-found atau uncaught page error. Seluruh tautan internal yang ditemukan juga mengembalikan HTTP 200.
- Tambah judul Unicode, edit progres pecahan/rating nol, favorit lintas halaman, browser back, serta pesan pemulihan setelah full navigation: lulus.
- Buat koleksi, ubah keanggotaan, tulis jurnal, lihat aktivitas, kurangi transparansi, dan pertahankan query pencarian setelah refresh: lulus.
- Axe WCAG 2 A/AA + 2.1 AA: **0 violations** pada 19 halaman representatif di lebar 1440 dan 390 px. Dokumen tidak overflow horizontal pada halaman yang sama di 1440/390/360 px. Ini pemeriksaan otomatis, bukan sertifikasi aksesibilitas.
- Screenshot library 1440 dan 390 px diperiksa visual. Artefak `test-results/library-1440.png`, `library-390.png`, `library-360.png` dan trace kegagalan diabaikan Git.
- Uji download menghasilkan JSON sintetis dengan enam item; file yang diunduh berhasil diinspeksi. JSON rusak menampilkan pesan penolakan. Assertion awal terlalu luas karena juga menangkap route announcer Next.js; selector dibatasi ke konten utama untuk rerun.
- Navigasi ponsel dan reduced motion lulus pada run sebelumnya. Pemeriksaan Enter keyboard, active tab subroute, serta rerun penuh dicatat setelah selesai.
- Tidak ada klaim koneksi/pekerjaan server yang sukses. Integrasi, autentikasi, penyimpanan permanen dan backup native belum tersedia.

## Riwayat validasi sebelum route expansion

Versi awal satu halaman memakai dialog detail/tambah. Pada 29 Oktober 2026, lint/typecheck, enam unit test, build, smoke pencarian/progres/rating/Unicode/transparansi dan refresh lulus. Axe pada dashboard desktop, dashboard ponsel dan dialog ponsel menghasilkan 0 violations setelah perbaikan kontras. Hasil dialog tersebut bersifat historis; versi sekarang memakai halaman detail/edit.

Revisi aksen biru baja/amber diperiksa ulang pada versi awal. Figma desktop/mobile serta sepuluh frame keluarga halaman diperiksa visual; teks/vector dan instance komponen editable, bukan screenshot UI. Figma bukan bukti implementasi backend.

## Batas bukti

- Belum mencakup screen reader, keyboard seluruh kontrol, perangkat fisik, seluruh browser, atau benchmark performa PRD.
- Browser desktop OpenCode tidak terhubung saat implementasi; Chrome headless lokal terpisah dari browser Review.
- `npm audit` saat instalasi melaporkan 0 vulnerabilities. ESLint 9.39.5 dipin untuk peer dependencies plugin Next dan diberi warning deprecated; migrasi menunggu dukungan plugin, bukan memakai force/legacy-peer-deps.
- Belum ada deployment Vercel, autentikasi, database, ownership, backup/restore native, atau contract test provider. Data pribadi tidak boleh dimasukkan.
