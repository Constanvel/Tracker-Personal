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

## Refinement kritik — hasil 30 Oktober 2026

- Lint sumber/test, typecheck, **18/18 unit test**, dan production build lulus.
- Suite penuh **10/10 E2E lulus**: seluruh pemeriksaan route, tautan, navigasi, download/inspeksi, axe dan overflow sebelumnya diulang. Setelah penambahan perlindungan fokus pada notifikasi, empat skenario refinement diulang pada build terbaru: **4/4 lulus**.
- Regresi mencakup dua increment dalam satu event, undo perubahan terakhir saja, favorit tidak ikut dikembalikan, penghapusan aktivitas yang diurungkan, clamp sisa 0,5, status selesai tetap manual, undo saat form edit terbuka, dan invalidasi undo setelah edit progres.
- Form diuji dengan judul spasi, fokus/error field, kategori Hobi/satuan sesi, progres melebihi total, rating 8,7 lalu null, serta judul panjang. Test navigasi juga mempertahankan rating nol. Unit test memastikan pecahan kecil 0,0001 tidak dilabeli nol.
- Pada 360/390 px, seluruh tombol kartu list berada di dalam kartu dan berukuran minimal 44×44 px. Axe list menghasilkan 0 violations. Dokumen tetap tanpa overflow horizontal; judul panjang tidak mendorong kontrol keluar.
- Dashboard ponsel kini menampilkan aksi progres pertama sekitar **y=587–631** pada viewport tinggi 844 px, dibanding kontrol baseline di bawah viewport. Ringkasan tetap tersedia setelah konten. Capture dashboard/list 360/390 diperiksa visual; form tambah/edit 390 juga diperiksa. Full-page capture menampilkan posisi nav fixed pada viewport awal, bukan bukti bahwa seluruh halaman selalu tertutup nav.
- Pemeriksaan tambahan dashboard, list, tambah dan edit pada lebar 375, 768 dan landscape 844 px: tidak ada overflow dokumen. Ini smoke layout, bukan audit perangkat fisik.
- Notifikasi progres dapat ditutup dan menyediakan Urungkan; notifikasi ditutup bila menutupi elemen yang menerima fokus keyboard. Regresi overlap fokus lulus. Tidak mengklaim seluruh alur keyboard/screen reader telah diaudit.
- Kelima prioritas kritik ditangani. **26/40 tetap baseline sebelum perbaikan**; tidak ada skor ulang yang direkayasa. Review Figma hanya membaca referensi; tidak menyinkronkan desain baru.

## Refinement pencatatan dan recovery — 31 Oktober 2026

Sumber implementasi final: `7ed0ebc` pada `feat/recording-ux-refinement`; empat commit fitur dan satu perbaikan kontras setelah baseline `38eb1e3`. Lingkungan Node.js 24.16.0, production Next.js di `http://127.0.0.1:3100`, Chrome headless lokal melalui Playwright. Tidak memakai browser Review yang terputus.

- Lint seluruh `src`/`tests`, typecheck tanpa incremental, **20/20 unit test**, dan production build lulus.
- Sepuluh test edit kontekstual lulus setelah perbaikan label textarea dan sinkronisasi draf setelah Undo. Review kode menemukan bahwa input progres sudah kembali tetapi draf dapat memulihkan angka lama setelah navigasi; regresi sekarang menguji keluar/kembali sebelum simpan, dengan kesan tetap utuh.
- Undo dan visibilitas pesan terpisah. Feedback memakai alur dokumen, bukan overlay; pesan ditutup tanpa menghapus akses Undo. Rapid increment, koreksi turun, pecahan kecil, batas total, no-op, pembatalan/Escape, fokus kembali, dan penolakan snapshot progres lama masuk suite tersimpan.
- Toolbar diuji pada 360/390/740 px, termasuk keyboard disclosure, label urutan, status tekan, grid/list, query gabungan, reset dan back/forward. Pencarian dashboard dan scope favorit tetap diuji.
- Edit umum menutup detail opsional; `section=note` tunggal dengan kapital persis membuka/fokus kesan. Intent tidak dikenal/ganda, draft lintas intent/navigasi, batal, error tersembunyi dan null/nol rating diuji.
- Test terpadu `recording-accessibility.spec.ts` lulus pada build final: dialog, feedback setelah pesan ditutup, serta edit kesan diuji axe pada 1440/390/360/740 px dengan **0 violations**; urutan fokus, target tombol minimal 44 px, overflow dan reduced motion diperiksa. Test menemukan kontras breadcrumb **4,48:1** saat header kaca melewati panel; `7ed0ebc` memakai token `--muted` dan rerun lulus.
- Simulasi reflow 200% memakai viewport 720×500 dari referensi desktop 1440×1000; aksi dialog dapat discroll dan dipakai tanpa overflow horizontal. Ini bukan pengujian zoom browser nyata. Percobaan CSS `zoom: 2` dibuang karena bukan padanan browser zoom dan menskalakan unit viewport dialog dua kali.
- Capture library desktop/mobile, dialog 1440/390 dan edit kesan 1440/390 diperiksa visual: charcoal, aksen biru/amber, pixel, urutan aksi dan peringatan demo tetap. Artefak `test-results/recording-*.png` tidak masuk Git. Capture full-page saat textarea terfokus dapat menggambar header/nav fixed di posisi scroll capture; bukan bukti overlay produk baru.
- **42/42 E2E lulus di CI GitHub** pada merge preview PR #1 (`7ed0ebc` dengan baseline `38eb1e3`), termasuk lint/typecheck/unit/build. Run [41200106623](https://github.com/Constanvel/Tracker-Personal/actions/runs/41200106623) selesai sukses. CodeRabbit melewati review otomatis, bukan persetujuan review. Rerun lokal penuh pada sumber final kemudian juga meluluskan **42/42 E2E (6,9 menit)**. Commit dokumentasi `43071a4` lulus CI [41200513974](https://github.com/Constanvel/Tracker-Personal/actions/runs/41200513974). PR #1 mengintegrasikan kode sebagai `f2a94ce`; dokumentasi menyusul karena PR sudah ditutup sebelum commit dokumentasi masuk.
- Skor **29/40 tetap provisional**, bukan skor sesudah implementasi atau bukti peningkatan atas baseline 26/40. Tidak ada skor baru. Figma tidak diubah.

## Riwayat validasi sebelum route expansion

Versi awal satu halaman memakai dialog detail/tambah. Pada 29 Oktober 2026, lint/typecheck, enam unit test, build, smoke pencarian/progres/rating/Unicode/transparansi dan refresh lulus. Axe pada dashboard desktop, dashboard ponsel dan dialog ponsel menghasilkan 0 violations setelah perbaikan kontras. Hasil dialog tersebut bersifat historis; versi sekarang memakai halaman detail/edit.

Revisi aksen biru baja/amber diperiksa ulang pada versi awal. Figma desktop/mobile serta sepuluh frame keluarga halaman diperiksa visual; teks/vector dan instance komponen editable, bukan screenshot UI. Figma bukan bukti implementasi backend.

## Batas bukti

- Belum mencakup screen reader, keyboard seluruh kontrol, perangkat fisik, seluruh browser, atau benchmark performa PRD.
- Browser desktop OpenCode tidak terhubung saat implementasi; Chrome headless lokal terpisah dari browser Review.
- `npm audit` saat instalasi melaporkan 0 vulnerabilities. ESLint 9.39.5 dipin untuk peer dependencies plugin Next dan diberi warning deprecated; migrasi menunggu dukungan plugin, bukan memakai force/legacy-peer-deps.
- Belum ada deployment Vercel, autentikasi, database, ownership, backup/restore native, atau contract test provider. Data pribadi tidak boleh dimasukkan.
