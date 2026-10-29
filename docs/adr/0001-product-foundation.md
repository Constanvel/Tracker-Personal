# ADR-0001 — Fondasi Produk dan Arsitektur Awal

- **Status:** Diterima untuk keputusan yang disetujui di bawah; pilihan vendor dan pustaka autentikasi masih terbuka.
- **Tanggal:** 29 Oktober 2026.
- **Dasar:** jawaban langsung pemilik produk pada langkah penetapan fondasi.
- **Cakupan:** keputusan produk dan teknis awal, bukan implementasi, provisioning, atau deployment.

## 1. Konteks

Personal Tracker menyimpan berbagai media dan hobi, progres, rating, kesan, serta jurnal privat. Aplikasi harus dapat diakses dari ponsel dan komputer, dimulai dengan biaya layanan gratis, dan tidak bergantung pada integrasi platform lain agar dapat dipakai.

Keputusan ini mengonfirmasi bagian fondasi pada [rencana implementasi](../IMPLEMENTATION-PLAN.md) dan memperjelas asumsi [PRD](../PRD.md). Bila rekomendasi lama berbeda, keputusan yang diterima dalam ADR ini menjadi acuan. Kebutuhan produk lain tetap mengikuti PRD.

## 2. Keputusan yang diterima

| Area | Keputusan |
|---|---|
| Produk | Web responsif, satu pemilik, akses dari beberapa perangkat |
| Hosting | Cloud privat: aplikasi dapat diakses melalui internet, tetapi data dan operasi personal wajib dilindungi login serta otorisasi |
| Autentikasi | Login GitHub melalui OAuth resmi dan pustaka autentikasi terawat |
| Pendaftaran | Tidak ada registrasi publik; hanya akun GitHub pemilik yang diizinkan |
| Koneksi | Online dahulu; belum ada pencatatan offline atau sinkronisasi antrean perangkat |
| Anggaran | Gratis dahulu; tidak mengaktifkan layanan berbayar/overage tanpa persetujuan pemilik |
| Framework | Next.js dengan App Router |
| Bahasa | TypeScript |
| Database | PostgreSQL |
| Akses database | Prisma |
| Rating | Integer kanonis 0–100; tampilan default 0–10; null berarti belum dinilai |
| Integrasi pertama | Ekspor file Letterboxd dengan validasi dan preview |
| Integrasi berikutnya | Sinkronisasi satu arah ke MAL melalui API resmi, setelah fondasi stabil |
| IMDb | Verifikasi kemampuan/format dahulu; belum ada janji kompatibilitas atau sinkronisasi |
| Sumber kebenaran | Database Personal Tracker; ekspor tidak mengubah data asli |

“Cloud privat” di dokumen ini berarti **arsip privat pada hosting cloud**, bukan komitmen membeli dedicated server, private network, atau paket enterprise.

## 3. Batas autentikasi dan privasi

1. Identifikasi pemilik menggunakan ID akun GitHub yang stabil dari provider, bukan hanya username yang dapat berubah.
2. Simpan allowlist pemilik sebagai konfigurasi server. Jangan menjadikan akun pertama yang login otomatis sebagai pemilik.
3. Jika konfigurasi pemilik atau autentikasi tidak lengkap, tolak akses personal secara default.
4. Gunakan pustaka terawat untuk sesi, OAuth state, callback, dan perlindungan terkait; jangan membangun protokol OAuth sendiri.
5. Login hanya memerlukan identitas minimum. Jangan meminta akses repository, workflow, organisasi, atau izin menulis GitHub untuk kebutuhan autentikasi.
6. Jangan meminta email privat jika identitas akun saja cukup. Pilihan scope final harus diperiksa pada implementasi pustaka/provider.
7. Login GitHub tidak memberikan izin membuat commit, push, issue, atau perubahan pengaturan repository.
8. Login aplikasi GitHub juga tidak otomatis menghubungkan akun MAL atau platform lain. Koneksi integrasi mempunyai alur dan izin terpisah.
9. Terapkan otorisasi pada server untuk setiap query/mutasi, unduhan backup, dan attachment privat. Menyembunyikan tombol bukan kontrol akses.
10. Secret OAuth, session secret, token integrasi, serta data personal tidak masuk repository atau bundle browser.
11. Landing page/login boleh publik; isi perpustakaan, jurnal, API personal, dan file tidak boleh terekspos lewat cache publik atau URL tanpa pemeriksaan izin.
12. Gunakan HTTPS pada deployment dan callback URL yang spesifik. Konfigurasi development dan production dipisahkan.

Pemilihan pustaka autentikasi, model sesi, dan detail konfigurasi dilakukan setelah pemeriksaan kompatibilitas versi Next.js/runtime. Belum ada OAuth App yang dibuat dan belum ada akses akun yang diberikan.

## 4. Makna online dahulu

- Simpan perubahan melalui server dan tampilkan keberhasilan hanya setelah konfirmasi server.
- Saat koneksi gagal, tampilkan belum tersimpan/gagal dan sediakan retry yang tidak menduplikasi perubahan.
- Pertahankan isian selama sesi halaman aktif sebisa mungkin. Belum ada jaminan isian bertahan setelah tab ditutup, browser reload, atau perangkat mati.
- Jangan meng-cache jurnal atau backup ke service worker tanpa keputusan privasi tersendiri.
- Kegagalan API metadata/provider berbeda dari kegagalan server aplikasi: input manual tetap dapat berjalan selama server aplikasi dapat diakses.
- Offline penuh memerlukan ADR baru tentang penyimpanan perangkat, keamanan, antrean, dan konflik; bukan tambahan kecil yang tersirat dalam web responsif.

## 5. Kebijakan anggaran dan pemilihan vendor

### 5.1 Batas biaya

Target awal adalah Rp0 untuk layanan aplikasi, database, dan storage sejauh paket gratis benar-benar mendukung kebutuhan. Ini **bukan jaminan operasional gratis selamanya**.

- Gunakan subdomain penyedia terlebih dahulu; custom domain tidak wajib.
- Jangan berlangganan, memasukkan pembayaran, mengaktifkan overage, atau membuat resource berbayar tanpa persetujuan.
- Jika paket gratis tidak memenuhi privasi, storage persisten, backup, atau kuota, kurangi scope yang aman atau minta keputusan biaya. Jangan menghilangkan autentikasi maupun backup demi tetap gratis.
- Peringatan kuota dan prosedur ekspor diperlukan. Bila batas tercapai, tampilkan keterbatasan dengan jelas; jangan diam-diam kehilangan data.
- Paket gratis dapat mempunyai cold start, sleep, batas ukuran, masa retensi, pembatasan worker, dan tanpa SLA. Periksa ketentuan aktual sebelum memilih.

### 5.2 Vendor belum dipilih

Persetujuan “cloud privat” belum menentukan penyedia hosting, PostgreSQL, atau storage. Pilihan itu sengaja belum ditetapkan sebelum memeriksa dokumentasi dan harga saat implementasi.

Evaluasi vendor dengan checklist berikut:

| Komponen | Syarat evaluasi |
|---|---|
| Hosting aplikasi | Mendukung runtime Next.js terpilih, HTTPS, secret server, batas request/job yang diketahui, dan paket gratis yang cocok untuk penggunaan pribadi |
| PostgreSQL | Kompatibel dengan Prisma, koneksi aman/pooling yang sesuai, migrasi, persistensi, ekspor/pemulihan, dan kuota yang jelas |
| File storage | Akses privat atau unduhan berotorisasi, persistensi setelah deploy ulang, batas ukuran/egress, dan jalan keluar data |
| Job P1 | Mendukung worker/scheduler atau mekanisme job yang diizinkan; tidak mengasumsikan proses background bertahan setelah request serverless berakhir |
| Operasional | Status layanan, ketentuan penggunaan, penanganan kuota, prosedur pemulihan, dan tanpa biaya otomatis yang belum disetujui |

Database dan attachment tidak boleh disimpan pada filesystem sementara hosting. Backup native tetap wajib meskipun provider menawarkan backup internal.

Lokasi region database/storage, retensi, dan strategi attachment final masih perlu dipilih. Jika belum ada storage privat yang layak, jangan merilis upload privat atau mengklaim backup attachment sudah lengkap.

## 6. Rating dan integrasi

### Rating

- Simpan nilai integer 0–100 atau null.
- Tampilan default adalah 0–10; misalnya 87 ditampilkan 8.7/10.
- Nilai nol adalah rating sah, bukan penanda belum dinilai.
- Konversi ke skala provider dilakukan hanya pada payload ekspor dan terlihat dalam preview.
- Rentang yang tidak dapat direpresentasikan tidak dipetakan diam-diam.

### Urutan integrasi

1. Bangun pencatatan manual universal dan backup/restore.
2. Implementasikan ekspor Letterboxd, bukan janji sinkronisasi API langsung.
3. Verifikasi file dan perilaku importer sebelum label kompatibel.
4. Implementasikan MAL OAuth dan antrean setelah model data, privasi, serta pemulihan stabil.
5. Investigasi IMDb secara terpisah; jangan menganggap CSV generik pasti diterima.
6. Tambahkan konektor lain hanya setelah ada kebutuhan nyata dan izin platform yang sesuai.

Jurnal privat selalu dikecualikan dari ekspor platform. Penyertaan review membutuhkan pilihan eksplisit; backup native dapat mencakup jurnal dengan peringatan bahwa arsip berisi data sensitif.

## 7. Konsekuensi

### Keuntungan

- Satu aplikasi dapat dipakai dari ponsel dan desktop tanpa dua codebase.
- GitHub login menghindari pengelolaan password aplikasi sendiri.
- Online dahulu mengurangi kompleksitas konflik dan penyimpanan lokal.
- PostgreSQL dan Prisma mendukung model relasional serta migrasi berversi.
- Urutan integrasi memberi manfaat sebelum seluruh platform didukung.

### Trade-off

- Tidak dapat mencatat secara andal ketika server atau koneksi tidak tersedia.
- Login bergantung pada akses akun GitHub dan ketersediaan provider.
- Hosting cloud tetap memerlukan konfigurasi keamanan, backup, dan pemantauan kuota.
- Paket gratis dapat membatasi ukuran perpustakaan, lampiran, dan pekerjaan background.
- Pilihan vendor dapat memerlukan penyesuaian implementasi, tetapi tidak boleh mengubah semantik data personal.

## 8. Keputusan yang masih terbuka

- Vendor dan region hosting, PostgreSQL, serta storage.
- Pustaka autentikasi, model sesi, dan paket versi final.
- ID akun pemilik serta pendaftaran OAuth App di browser.
- Batas file dan strategi cover/lampiran sesuai kuota storage.
- Mekanisme worker persisten untuk sinkronisasi MAL P1.
- Contoh data lama untuk menguji migrasi; ketiadaan file lama tidak menghalangi input manual.

Zod, Vitest, Playwright, dan modular monolith tetap rekomendasi pelaksanaan dari rencana, bukan pilihan yang secara terpisah telah dikonfirmasi pemilik dalam jawaban fondasi.

## 9. Kriteria penerapan ADR

Keputusan ini dianggap diterapkan pada aplikasi jika:

- [ ] Deployment cloud dengan HTTPS dapat diakses dari ponsel dan desktop.
- [ ] Hanya ID akun pemilik yang diizinkan, termasuk untuk API dan file.
- [ ] GitHub OAuth tidak meminta akses repository yang tidak diperlukan.
- [ ] Salah konfigurasi autentikasi tidak membuka data.
- [ ] Data bertahan melewati restart/deploy ulang.
- [ ] Koneksi gagal tidak ditampilkan sebagai penyimpanan sukses.
- [ ] Rating null, nol, dan nilai 87 tetap berbeda setelah penyimpanan serta backup/restore.
- [ ] Harga/ketentuan vendor telah diperiksa dan tidak ada biaya otomatis tanpa persetujuan.
- [ ] Backup/restore teruji sebelum aplikasi menjadi satu-satunya arsip.
- [ ] Ekspor file dibedakan dari sinkronisasi akun di antarmuka dan dokumentasi.

Checklist ini belum selesai: ADR mencatat keputusan, tidak membuktikan implementasinya.

## 10. Tindak lanjut

Langkah berikutnya adalah **menurunkan PRD menjadi backlog Alpha**: pekerjaan dengan ID kebutuhan, acceptance criteria, dependensi, dan cara uji. Setelah itu pilih vendor melalui pemeriksaan paket aktual, lalu siapkan scaffold proyek.

Tidak ada resource cloud, akun eksternal, credential, commit, atau push yang dibuat oleh penetapan ADR ini.
