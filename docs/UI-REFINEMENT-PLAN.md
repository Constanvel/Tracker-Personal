# Rencana refinement UI Folio — pencatatan dan recovery

Tanggal: 31 Oktober 2026. Status: empat tahap implementasi selesai; hasil verifikasi terpadu dicatat di [UI-VALIDATION.md](UI-VALIDATION.md). Dokumen ini mempertahankan rencana dan batas commit awal.

## Scope dan dasar

Menangani empat temuan dari [kritik ulang](../.impeccable/critique/2026-10-31T11-36-14Z__src-components-tracker-tsx.md): notifikasi/Undo, pencatatan progres langsung, toolbar ponsel, dan edit kontekstual. Kebijakan commit mengikuti [COMMIT-STRATEGY.md](COMMIT-STRATEGY.md) §5–7.

Skor 29/40 bersifat sementara: sumber berubah selama inspeksi. Baseline lama 26/40 tidak boleh dipakai untuk mengklaim peningkatan terverifikasi. Referensi kode awal rencana adalah HEAD `b474966`; periksa ulang HEAD dan working tree sebelum implementasi karena pekerjaan lain dapat berlangsung.

Pertahankan charcoal, biru baja/amber, pixel, quiet glass, Bahasa Indonesia, serta pemberitahuan demo. Jangan menambah backend, penyimpanan browser permanen, autentikasi, integrasi, atau dependensi UI tanpa kebutuhan yang terbukti. Draft sesi dan penjagaan perubahan kategori yang sudah tersedia harus tetap bekerja.

## Urutan pekerjaan dan atomic commits

### 0. Pastikan baseline stabil

- Periksa diff, HEAD, proses dan port aplikasi; jangan menganggap localhost:3000 adalah Folio. Jangan menghentikan server milik pekerjaan lain.
- Pastikan sumber tidak berubah selama capture. Bila berubah, ulangi baseline pada revisi stabil sebelum menyimpulkan hasil.
- Jalankan lint, typecheck, unit test dan build. Jalankan suite E2E saat ini; catat kegagalan lama terpisah dari regresi.
- Capture dashboard/grid/list/tambah/edit pada desktop 1440 dan ponsel 360/390. Tambahkan smoke tablet/landscape dan zoom 200% pada alur yang diubah.
- Pemeriksaan baseline saja tidak memerlukan commit. Commit hanya bila menghasilkan artefak keputusan atau perubahan nyata yang perlu disimpan.

### 1. Pisahkan Undo dari visibilitas notifikasi

Pesan commit: `fix(progress): retain undo independently of feedback visibility`

Tujuan: menyembunyikan feedback tidak menghapus kesempatan mengurungkan progres terakhir.

- Pisahkan state perubahan terakhir dari state pesan terlihat; penutupan karena tombol atau overlap fokus hanya menyembunyikan pesan.
- Berikan akses Undo terakhir yang tetap dapat ditemukan, termasuk setelah navigasi client-side atau pesan ditutup. Hindari timer yang menghilangkan akses recovery.
- Gunakan feedback ringkas dekat item atau area khusus yang tidak menutupi kartu aktif. Pastikan detail dan item di luar daftar tetap memiliki jalur recovery.
- Undo tetap hanya membalik progres terakhir dan aktivitas terkait, tidak membatalkan favorit/rating/jurnal. Perubahan baru mengganti target Undo; edit progres/total/satuan yang tidak kompatibel dan reset menginvalidasi target lama.
- Uji rapid updates, hide lalu Undo, navigasi lalu Undo, edit bersamaan, reset, keyboard/fokus, pengumuman status dan viewport kecil. Pertahankan coverage lama; jangan menghapus assertion hanya untuk meluluskan perilaku baru.

Commit mencakup provider, permukaan feedback/Undo, styling terkait dan test regresi. Commit harus berguna tanpa fitur langkah 2.

### 2. Tambahkan pencatatan progres langsung

Pesan commit: `feat(progress): record an exact position from item cards`

Tujuan: halaman 75 menjadi 100 dapat dicatat tanpa 25 klik atau form edit lengkap.

- Pertahankan +1 dan label satuan sebagai jalur utama. Tambahkan aksi sekunder “Catat progres…” pada komponen aksi bersama, tersedia dari dashboard/library/favorit/detail.
- Versi awal memakai **posisi terbaru** sebagai satu input angka, bukan dua mode posisi/kenaikan sekaligus. Tampilkan nilai saat ini, satuan dan total; penambahan mode kenaikan bukan scope wajib.
- Pilih dialog/popover aksesibel sesuai pola proyek setelah memeriksa render. Label harus jelas, fokus awal tepat, Escape/Batal tidak menyimpan, fokus kembali ke pemicu setelah ditutup.
- Pakai satu jalur mutasi progres untuk +1 dan posisi langsung agar aktivitas, feedback dan Undo konsisten. Undo memulihkan angka sebelumnya termasuk pecahan.
- Validasi finite, nonnegatif, tidak melebihi total diketahui; total null tetap tak diketahui, nol tetap nol. No-op tidak membuat aktivitas/Undo baru. Koreksi turun diperbolehkan sebagai perubahan progres, bukan otomatis konsumsi baru atau completion.
- Status selesai tetap eksplisit. Simpan memvalidasi terhadap item terbaru, bukan snapshot lama saat editor dibuka; tangani item/reset yang berubah tanpa menimpa perubahan lain.
- Uji 75 ke100, pecahan kecil, koreksi turun, nol/null total, batas, input kosong/tidak sah, no-op, batal/Escape, fokus, Undo, rapid updates dan state yang berubah selama editor terbuka.

Commit mencakup UI, mutasi/validasi bersama dan test terkait. Bergantung pada langkah 1; jangan memisah helper yang wajib dari pemakainya menjadi commit aplikasi rusak.

### 3. Ringkas toolbar ponsel dan jelaskan urutan

Pesan commit: `feat(library): clarify sorting and compact mobile view controls`

Tujuan: pencarian memperoleh ruang yang memadai dan urutan aktif dapat dikenali.

- Kelompokkan sort/view dalam satu kontrol ringkas di ponsel, tanpa menghapus grid/list atau mempersempit pencarian lebih jauh.
- Tampilkan “Urutan: bawaan” atau “Judul A–Z”, dengan nama dan selected/pressed state yang sesuai. Gunakan semantik kontrol standar; jangan menambah role menu bila keyboard menu lengkap tidak diimplementasikan.
- Pertahankan kontrak query `q`, `type`, `status`, `sort`, `view`, browser back/forward, favorit, serta pencarian dashboard ke seluruh library.
- Uji keyboard buka/tutup, fokus, label urutan, selected state, query URL, reset, grid/list dan kombinasi filter. Verifikasi hit area minimal 44px dan tidak clipping pada360/390 maupun landscape.

Commit mencakup tracker, CSS dan test toolbar. Tidak bergantung secara fungsional pada langkah2; jangan mencampurkan refactor kartu yang tak terkait.

### 4. Buat edit mengikuti tujuan pengguna

Pesan commit: `feat(items): open contextual edit sections without losing drafts`

Tujuan: edit progres atau kesan tidak memaksa pengguna melewati semua detail.

- Edit umum membuka field inti dengan detail opsional tertutup; “Edit kesan” membuka dan memfokuskan kesan. Jalur edit lengkap tetap dapat diakses.
- Gunakan intent query yang tervalidasi, misalnya `section=note`; nilai tidak dikenal kembali ke edit umum. Jangan mengubah identitas item atau menghilangkan parameter yang relevan saat navigasi.
- Letakkan Simpan/Batal agar mudah dijangkau. Uji solusi dalam render; jangan langsung menambah sticky footer yang menutupi field/nav atau bersaing dengan Undo.
- Jika error berada di disclosure tertutup, buka bagian dan fokuskan field terkait. Draft sesi, status rating null/nol, konfirmasi perubahan kategori/satuan, pembatalan dan Undo saat form terbuka harus tetap benar.
- Uji intent dari detail, edit umum, query tidak dikenal, error dalam detail tertutup, simpan tanpa perubahan, batal, draft lintas navigasi dan hubungan Undo dengan input progres.

Commit mencakup item-page, route/helper bila perlu, styling dan test terkait. Tetap berguna tanpa perubahan toolbar.

### 5. Validasi terpadu dan dokumentasi hasil

Pesan commit: `docs(ui): record verified recording and recovery workflows`

- Ulangi lint, typecheck, seluruh unit/E2E, production build dan diff check pada sumber final stabil.
- Jalankan axe pada permukaan yang berubah, termasuk editor progres dan keadaan feedback. Ukur containment/hit area, overflow, teks panjang, keyboard/fokus, reduced motion dan zoom. Catat batas screen reader/perangkat fisik bila belum diuji.
- Bandingkan capture desktop/mobile dengan identitas visual yang disepakati. Jangan mengklaim tidak ada masalah hanya karena detector/axe bersih.
- Perbarui `docs/DESIGN.md`, `docs/ROUTES.md`, `docs/UI-VALIDATION.md` dan panduan test sesuai hasil nyata. Test regresi utama masuk bersama fitur masing-masing, bukan ditunda ke commit dokumentasi.
- Tutup hanya snapshot kritik yang benar-benar ditangani setelah keempat prioritas lulus verifikasi. Skor baru hanya diberikan melalui kritik ulang independen pada build stabil.
- Jika validasi menemukan bug, perbaiki dan uji bersama dalam commit tujuan spesifik; jangan menyembunyikan perubahan kode dalam commit docs.

## Aturan eksekusi Git

1. Gunakan branch singkat `feat/recording-ux-refinement` untuk implementasi, setelah memastikan nama belum digunakan. Jangan mengubah identitas Git atau setting repository.
2. Satu commit = satu tujuan lengkap, termasuk test yang diperlukan. Jumlah commit mengikuti kebutuhan, bukan kuota.
3. Stage path/hunk secara selektif. Jangan sertakan `next-env.d.ts`, folder skill/agent/hook yang tidak terkait, credential, data pribadi atau capture generated.
4. Setiap commit fitur harus lolos lint/typecheck dan test terkait; jalankan build agar commit yang dipertahankan tetap layak. Suite penuh menjadi gate integrasi akhir.
5. Periksa staged diff sebelum commit. Hindari empty commit, whitespace-only, WIP sengaja gagal, backdating, atau edit/revert buatan.
6. Push unit yang selesai melalui kredensial yang sudah tersedia; jangan force-push atau menulis ulang history yang sudah dibagikan. Ikuti metode PR/merge repository tanpa mengubah kebijakannya sepihak.
7. Laporkan hash, tujuan, hasil test dan sisa batas demo. Jangan menyatakan plan selesai berarti fitur selesai.

## Hasil implementasi

- `610310a` — feedback dalam alur dokumen dan Undo tidak hilang saat pesan ditutup.
- `d7c3fd6` — posisi progres langsung, validasi snapshot, koreksi turun, pecahan dan Undo bersama.
- `bb1a9ff` — label urutan dan disclosure toolbar ponsel dengan kontrak URL tetap.
- `8560108` — edit kontekstual, validasi disclosure, serta sinkronisasi Undo dengan draf lintas navigasi.
- `7ed0ebc` — kontras breadcrumb di atas panel saat scroll dan test terpadu aksesibilitas/reflow; bug nyata dari gate validasi, bukan commit dokumentasi terselubung.
- Hasil gate terpadu, capture dan batas audit dicatat di [UI-VALIDATION.md](UI-VALIDATION.md). Skor kritik lama tidak diperbarui oleh implementasi.

## Selesai bila

- Pencatatan posisi langsung dapat dilakukan dari kartu, memakai model angka yang benar dan dapat diurungkan.
- Menutup feedback tidak menghilangkan recovery; feedback tidak menutupi konteks/fokus utama.
- Pencarian ponsel dan status urutan jelas tanpa kehilangan navigasi/filter berbasis URL.
- Edit kecil lebih ringkas, edit kesan membuka bagian yang tepat, dan draft serta validasi tetap aman dalam batas sesi demo.
- Semua pemeriksaan relevan lulus dan hasilnya dicatat jujur. Backend/persistensi tetap di luar scope.
