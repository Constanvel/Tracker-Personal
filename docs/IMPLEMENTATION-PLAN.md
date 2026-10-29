# Langkah Pembuatan Aplikasi Personal Tracker

Status: rencana implementasi; belum ada implementasi aplikasi atau perubahan konfigurasi GitHub.

Dokumen acuan:

- [PRD](PRD.md): kebutuhan dan kriteria penerimaan.
- [Referensi](REFERENCES.md): dasar pemilihan pola fitur dan interaksi.
- [Strategi commit](COMMIT-STRATEGY.md): perubahan kecil, lengkap, dan dapat diuji.

## 1. Hasil akhir dan urutan rilis

Bangun aplikasi yang berguna tanpa integrasi eksternal terlebih dahulu. Setelah pencatatan dan backup stabil, tambahkan ekspor Letterboxd, lalu sinkronisasi MAL.

| Rilis | Hasil yang dapat digunakan |
|---|---|
| Alpha internal | Login, tambah item manual, daftar/detail, progres, rating, kesan, dan backup dasar |
| Beta pribadi | Semua template, tipe custom, histori/pengalaman ulang, jurnal privat, pencarian, koleksi, dan restore teruji |
| MVP/P0 | Seluruh kebutuhan P0 PRD, ekspor Letterboxd terverifikasi, keamanan, aksesibilitas, dokumentasi, dan deployment |
| Integrasi/P1 | MAL OAuth, antrean persisten, first-sync preview, retry, konflik, dan impor prioritas |

Alpha dan beta bukan klaim seluruh P0 selesai. Jangan memakai data penting sebagai satu-satunya salinan sebelum backup/restore teruji.

## 2. Keputusan awal dan stack kerja

Fondasi produk telah dikonfirmasi pemilik dan dicatat pada [ADR-0001](adr/0001-product-foundation.md): cloud privat, login GitHub khusus pemilik, online dahulu, gratis dahulu, Next.js + TypeScript + PostgreSQL + Prisma, rating 0–100 dengan tampilan 0–10, Letterboxd dahulu lalu MAL. Vendor dan beberapa pustaka masih perlu dipilih sebelum implementasi; tabel berikut memuat baseline beserta rekomendasi pelaksanaannya.

| Area | Baseline yang direkomendasikan |
|---|---|
| Bentuk produk | Aplikasi web responsif, satu pemilik, beberapa perangkat |
| Bahasa | TypeScript |
| Framework | Next.js dengan App Router |
| Database | PostgreSQL |
| Akses database | Prisma |
| Validasi | Zod di batas input, dengan validasi server sebagai otoritas |
| Pengujian | Vitest untuk unit/integration dan Playwright untuk end-to-end |
| Komponen antarmuka | Komponen aksesibel yang terawat; tentukan pustaka saat kebutuhan interaksi diperiksa |
| Autentikasi | GitHub OAuth melalui pustaka terawat; allowlist ID akun pemilik; tidak ada registrasi publik |
| Penyimpanan file | Storage privat yang persisten, bukan folder sementara deployment |
| Arsitektur | Modular monolith; satu aplikasi, database, storage, dan worker saat diperlukan |
| Bahasa antarmuka | Indonesia |
| Offline | Belum mendukung penyimpanan offline penuh |

### Checklist keputusan

- [x] Pilih model hosting: cloud privat; vendor belum dipilih.
- [x] Setujui GitHub OAuth dengan allowlist ID akun pemilik.
- [x] Tentukan anggaran: gratis dahulu, tanpa aktivasi biaya otomatis tanpa persetujuan.
- [x] Setujui Next.js + TypeScript + PostgreSQL + Prisma.
- [x] Setujui rating kanonis integer 0–100 dengan tampilan default 0–10.
- [x] Setujui Letterboxd sebagai ekspor pertama dan MAL sebagai sinkronisasi pertama; IMDb menunggu verifikasi.
- [x] Konfirmasikan koneksi: online dahulu, offline penuh bukan kebutuhan awal.
- [x] Catat keputusan pada [ADR-0001](adr/0001-product-foundation.md).
- [ ] Pilih vendor dan region aplikasi, database, serta storage setelah memeriksa paket aktual.
- [ ] Pilih pustaka autentikasi dan model sesi yang kompatibel.
- [ ] Siapkan contoh data lama bila ada.

**Selesai jika:** keputusan dicatat sebagai Architecture Decision Record (ADR), bukan hanya disepakati di percakapan.

## 3. Struktur proyek yang dituju

Struktur konseptual; sesuaikan dengan framework tanpa membuat folder kosong sebagai pekerjaan tersendiri.

```text
src/
  app/                       # Routing, halaman, dan batas HTTP
  modules/
    library/                 # Item, identitas, dan relasi
    tracking/                # Status, progres, pengalaman, aktivitas
    reviews/                 # Rating, kesan, review, jurnal
    organization/            # Tag, koleksi, pencarian
    taxonomy/                # Tipe item dan field custom
    portability/             # Backup, restore, impor, ekspor
    integrations/            # Kontrak adapter dan provider
  components/                # Komponen antarmuka bersama
  lib/                       # Database, autentikasi, konfigurasi, storage
prisma/                      # Skema, migrasi, seed sintetis
public/                      # Aset publik aplikasi; bukan backup atau jurnal
tests/                       # Lokasi aktual mengikuti konfigurasi runner
  fixtures/                  # Data sintetis dan contoh format eksternal
  e2e/
docs/
```

Kode domain tidak bergantung pada halaman atau satu provider. Validasi rating/progres dan kebijakan privasi harus dapat diuji tanpa menjalankan browser.

## 4. Tahap 1 — Ubah PRD menjadi backlog implementasi

### Pekerjaan

1. Buat milestone Alpha, Beta, P0, dan P1.
2. Kelompokkan kebutuhan menjadi epic: fondasi, library, tracking, review, organisasi, portabilitas, dan integrasi.
3. Turunkan pekerjaan dari ID kebutuhan PRD, misalnya `LIB-02`, `PRO-06`, dan `REV-03`.
4. Untuk setiap pekerjaan, tulis tujuan, acceptance criteria, dependensi, cara uji, dan hal yang tidak dikerjakan.
5. Tandai prioritas dan risiko. Kerjakan risiko kehilangan data/privasi sebelum statistik atau dekorasi.
6. Buat dataset sintetis: manhwa ongoing, film, novel, lagu, hobi, tipe custom, judul Unicode, serta rating null dan nol.

### Hasil

Backlog yang dapat dieksekusi tanpa menebak scope. Issue/board GitHub dapat dibuat setelah ada izin; dokumen rencana tidak otomatis membuat issue remote.

**Selesai jika:** setiap pekerjaan awal memiliki hasil yang dapat diuji dan tidak hanya bernama “buat backend” atau “buat frontend”.

**Contoh commit:** `docs(plan): define alpha scope and acceptance criteria`.

## 5. Tahap 2 — Siapkan proyek dan pemeriksaan otomatis

### Pekerjaan

1. Periksa README, file pengguna, dan working tree sebelum menjalankan generator.
2. Gunakan versi runtime/framework stabil yang didukung saat implementasi; kunci versi dependency dan commit lockfile.
3. Siapkan Next.js dan TypeScript tanpa menimpa dokumentasi yang ada.
4. Konfigurasikan formatting, lint, type check, unit test, dan build.
5. Buat `.env.example` dengan nama konfigurasi dan nilai contoh non-rahasia.
6. Abaikan `.env`, database lokal, backup, ekspor pengguna, attachment privat, coverage, dan hasil build lewat `.gitignore`.
7. Sediakan PostgreSQL development dan test yang terpisah.
8. Buat CI untuk pemeriksaan PR/default branch; jangan membuat workflow commit kosong harian.
9. Dokumentasikan setup Windows, perintah development, serta variabel lingkungan.

### Hasil

Aplikasi kerangka dapat berjalan lokal dan pemeriksaan otomatis dapat dijalankan ulang.

**Selesai jika:** instalasi dari clone bersih dapat menjalankan test dan build dengan petunjuk README; tidak ada credential di repository.

**Contoh commit:** `build: initialize typed web application`, `ci: validate pull requests`.

## 6. Tahap 3 — Bangun autentikasi dan batas data privat

### Pekerjaan

1. Integrasikan autentikasi terawat sesuai ADR deployment.
2. Batasi akses pada akun pemilik; nonaktifkan registrasi publik.
3. Lindungi halaman, endpoint, unduhan, dan storage privat pada server.
4. Tambahkan pemeriksaan owner pada setiap query/mutasi personal.
5. Tetapkan pengaturan zona waktu dan skala tampilan rating.
6. Buat pengujian sesi tidak sah, akun bukan pemilik, dan akses langsung melalui ID/URL.
7. Terapkan HTTPS dan pengaturan cookie aman pada deployment.

### Hasil

Fondasi privat yang tidak hanya menyembunyikan tombol di antarmuka.

**Selesai jika:** akses tanpa sesi atau tanpa izin ditolak, termasuk saat URL API/file dibuka langsung.

**Contoh commit:** `feat(auth): restrict private tracker to owner account`.

## 7. Tahap 4 — Implementasikan model data inti

### Pekerjaan

1. Buat skema awal untuk Owner, ItemType, Item, ExternalIdentity, LibraryEntry, Experience, ProgressState, Activity, RatingRevision, dan Review.
2. Tambahkan Tag, Collection, serta relasi item saat fitur terkait mulai diimplementasikan.
3. Gunakan ID internal stabil, foreign key, unique constraint, dan pemeriksaan rentang nilai.
4. Pisahkan status publikasi karya dan status konsumsi pengguna.
5. Simpan rating 0–100; null berbeda dari nol.
6. Simpan unit/ketelitian progres secara eksplisit dan total sebagai nilai opsional.
7. Bedakan tanggal kalender, waktu UTC, dan tanggal parsial.
8. Tambahkan owner, revision/version, timestamps, serta soft delete yang relevan.
9. Buat migrasi berversi dan seed sintetis untuk development/test.
10. Siapkan mekanisme transaksi dan validasi concurrency sebelum endpoint progres dipakai dari beberapa perangkat.

### Hasil

Skema yang dapat menampung berbagai kategori tanpa satu tabel besar berisi field wajib yang tidak relevan.

**Selesai jika:** migrasi berhasil pada database kosong; constraint dan relasi diuji; seed tidak mengandung data pribadi.

**Contoh commit:** `feat(domain): model library entries and external identities`.

## 8. Tahap 5 — Buat vertical slice pertama

Vertical slice berarti satu alur lengkap dari antarmuka hingga database, bukan menyelesaikan seluruh backend dahulu.

### Alur pertama

1. Login.
2. Tambah manhwa manual dengan judul dan tipe.
3. Lihat item di perpustakaan.
4. Buka detail dan ubah judul/status.
5. Masukkan chapter terakhir.
6. Beri rating dan kesan singkat.
7. Muat ulang halaman dan pastikan seluruh nilai tetap tersimpan.

### Kebutuhan interaksi

- Form tambah hanya mewajibkan judul dan tipe.
- Loading, gagal, dan tersimpan terlihat jelas.
- Input gagal tetap dapat dicoba ulang tanpa duplikasi.
- Tampilan dapat digunakan di ponsel dan keyboard.
- Metadata eksternal belum diperlukan.

### Hasil

Aplikasi sudah mempunyai satu kegunaan nyata dan seluruh lapisan teknis telah terhubung.

**Selesai jika:** alur di atas lulus end-to-end dan tidak bergantung pada provider eksternal.

**Contoh commit:** `feat(library): create manual items with validation`, `feat(tracking): persist chapter updates with activity history`.

## 9. Tahap 6 — Sediakan backup awal sebelum pemakaian serius

### Pekerjaan

1. Buat format native JSON berversi untuk entitas yang sudah tersedia.
2. Tetapkan kontrak manifest, ID stabil, referensi relasi, dan versi skema.
3. Sediakan restore ke database uji kosong.
4. Bandingkan nilai, ID, dan relasi setelah round-trip.
5. Pastikan credential, token, dan session tidak masuk backup.
6. Peringatkan bahwa backup berisi catatan privat.
7. Perbarui format, serializer, dan test backup dalam perubahan yang sama setiap kali entitas personal baru diperkenalkan.

### Hasil

Data awal mempunyai jalan keluar yang teruji. Format ZIP, attachment, dry-run, dan rollback lengkap diselesaikan pada Tahap 11.

**Selesai jika:** data vertical slice dapat dipulihkan ke database kosong tanpa kehilangan nilai; backup yang belum mencakup fitur berikutnya tidak dipasarkan sebagai backup lengkap.

**Contoh commit:** `feat(backup): round-trip versioned native library data`.

## 10. Tahap 7 — Lengkapi kategori, progres, dan pengalaman

### Pekerjaan

1. Tambahkan template manga/manhwa/manhua/komik, anime/serial, film, novel/buku, lagu/album, game, podcast, dan hobi.
2. Tentukan konfigurasi field/unit per tipe; jangan membuat implementasi tracker terpisah untuk setiap kategori.
3. Dukung chapter pecahan, volume, episode, halaman, durasi, persentase, dan tanpa progres.
4. Tambahkan validasi total tidak diketahui, progres negatif, dan progres melampaui total.
5. Tambahkan koreksi/undo yang tidak dihitung sebagai konsumsi baru.
6. Buat Experience untuk reread/rewatch/replay dan pertahankan siklus sebelumnya.
7. Buat sesi hobi dengan tanggal, durasi opsional, serta kesan.
8. Implementasikan konflik perubahan antarperangkat melalui version check.
9. Tambahkan relasi adaptasi/sekuel/bagian-dari tanpa menyatukan progres.
10. Tambahkan tipe custom dan field dasar bertipe: teks, angka, tanggal, boolean, pilihan tunggal, URL.
11. Pertahankan nilai field lama ketika definisinya diarsipkan; jangan menghapus data melalui perubahan schema UI.

### Hasil

Produk benar-benar universal, bukan tracker manhwa dengan label kategori tambahan.

**Selesai jika:** film, lagu, hobi, dan tipe custom dapat dipakai tanpa mengisi chapter; koreksi dan pengalaman ulang menjaga histori; backup mencakup entitas baru.

**Contoh commit:** `feat(tracking): record repeat experiences`, `feat(taxonomy): validate typed custom fields`.

## 11. Tahap 8 — Lengkapi rating, review, dan jurnal privat

### Pekerjaan

1. Implementasikan rating utama beserta revisinya.
2. Dukung tampilan 0–10/0–5 tanpa mengubah nilai kanonis.
3. Pisahkan kesan singkat, review yang dapat dipilih untuk ekspor, dan jurnal privat.
4. Hubungkan tulisan dengan item, pengalaman, atau sesi yang relevan.
5. Tambahkan spoiler, Unicode, paragraf, dan tautan dengan rendering aman.
6. Buat kebijakan allowlist field ekspor; jangan menyebarkan object database mentah menjadi payload provider.
7. Uji bahwa jurnal tidak masuk ekspor platform, log, atau respons yang tidak berhak.
8. Pertahankan rating dan tulisan lama ketika pengguna membuat pengalaman ulang.

### Hasil

Arsip personal tetap kaya tanpa berisiko membagikan seluruh catatan secara tidak sengaja.

**Selesai jika:** null dan nol berbeda; revisi bertahan; pilihan review tidak pernah otomatis menyertakan jurnal; test sanitasi dan privasi lulus.

**Contoh commit:** `feat(reviews): separate exportable reviews from private journals`.

## 12. Tahap 9 — Lengkapi organisasi dan dashboard

### Pekerjaan

1. Tambahkan pencarian judul utama/alternatif, kreator, dan catatan pemilik.
2. Tambahkan filter tipe, status, tag, koleksi, favorit, rating, dan tanggal.
3. Tambahkan sorting judul, rating, tanggal ditambah, aktivitas terakhir, dan selesai.
4. Buat tampilan grid serta daftar/tabel yang sesuai mobile.
5. Tambahkan koleksi campuran dan tag manual.
6. Tambahkan bulk edit dengan preview jumlah item dan konfirmasi.
7. Buat dashboard “sedang dijalani”, aktivitas terakhir, favorit, dan jumlah per tipe/status.
8. Pisahkan jumlah judul unik, pengalaman ulang, dan sesi.
9. Pertahankan konteks filter ketika pengguna kembali dari detail item.
10. Uji keyboard, fokus, empty state, judul panjang, cover gagal, dan layar kecil.

### Hasil

Perpustakaan tetap mudah digunakan saat bertambah, bukan hanya pada beberapa data demo.

**Selesai jika:** pengguna dapat menemukan karya melalui judul alternatif, memperbarui progres dengan cepat, dan mengelola koleksi campuran tanpa kehilangan konteks.

**Contoh commit:** `feat(search): include alternative titles`, `feat(collections): organize mixed media collections`.

## 13. Tahap 10 — Selesaikan lifecycle item

### Pekerjaan

1. Lengkapi edit, arsip, soft delete, restore, dan hard delete dengan konsekuensi yang jelas.
2. Peringatkan duplikat berdasarkan identitas eksternal; kemiripan judul hanya saran.
3. Simpan URL/ID eksternal secara manual tanpa mewajibkan pencarian katalog.
4. Atur lampiran/cover yang diunggah: batas MIME/ukuran, owner, checksum, dan storage privat yang tepat.
5. Jika mengambil URL cover, cegah SSRF, redirect berbahaya, dan unduhan berlebih. Tunda fitur URL fetch jika belum aman.
6. Tentukan apa yang dipulihkan saat soft delete dan bagaimana attachment dibersihkan saat hard delete.
7. Tambahkan pengaturan pemilik dan alur penghapusan seluruh arsip dengan konfirmasi serta penjelasan retensi backup.

### Hasil

Data dapat dirawat dan dibersihkan tanpa orphan file atau penghapusan tidak sengaja.

**Selesai jika:** arsip/restore menjaga relasi, akses attachment terlindungi, serta tidak ada penghapusan remote otomatis.

**Contoh commit:** `feat(library): restore archived entries with relations`, `fix(storage): reject unsafe attachment uploads`.

## 14. Tahap 11 — Lengkapi portabilitas dan pemulihan

### Pekerjaan

1. Finalisasi ZIP native: manifest, JSON berversi, attachment yang disimpan aplikasi, dan checksum.
2. Cakup seluruh kategori/field custom, relasi, aktivitas, pengalaman, rating/revisi, review/jurnal, tag, koleksi, serta pengaturan non-rahasia.
3. Tambahkan validasi restore, dry-run, laporan, dan mode kosong/merge berdasarkan ID native.
4. Validasi arsip sebelum commit data. Stage file terlebih dahulu, gunakan transaksi untuk data, dan cleanup/rollback agar database serta storage tidak tertinggal setengah pulih.
5. Ambil snapshot sebelum restore berisiko dan minta konfirmasi untuk deployment berisi data.
6. Tambahkan ekspor CSV generik dengan mitigasi formula injection dan penjelasan batasnya.
7. Uji ZIP traversal, ZIP bomb, file rusak, versi tidak didukung, relasi hilang, serta attachment tidak cocok checksum.
8. Uji restore ke instalasi baru, bukan hanya mengimpor kembali ke database sumber.
9. Buat panduan backup manual dan pemulihan.

### Hasil

Pemilik dapat meninggalkan aplikasi atau memulihkan instalasi tanpa kehilangan arsip inti.

**Selesai jika:** seluruh entitas, ID, relasi, dan checksum cocok pada round-trip; kegagalan restore tidak meninggalkan keadaan setengah jadi; token tetap tidak disertakan.

**Contoh commit:** `feat(backup): validate complete archives before restore`, `test(backup): verify full restore and failure cleanup`.

## 15. Tahap 12 — Tambahkan ekspor Letterboxd

### Pekerjaan

1. Baca ulang dokumentasi format tujuan dan siapkan fixture sintetis.
2. Implementasikan kontrak adapter: capability, tipe didukung, pemetaan, validasi, preview, serializer, dan laporan.
3. Pilih film relevan; jangan mengekspor lagu/hobi sebagai film.
4. Validasi ID tujuan; minta konfirmasi jika hanya tersedia kandidat judul ambigu.
5. Konversikan rating tanpa mengubah nilai asli; tampilkan pembulatan dan nilai yang tidak dapat diwakili.
6. Pisahkan alur watched/diary, list, dan watchlist. Rencana tidak boleh otomatis ditandai watched.
7. Review default tidak disertakan; pengguna harus memilihnya. Jurnal selalu dikecualikan dari ekspor platform.
8. Tangani Unicode, kutip, koma, newline, tanggal kalender, dan rewatch sesuai parser tujuan.
9. Bagi file sesuai batas ukuran yang berlaku dan jelaskan kemungkinan penggabungan dua tontonan film pada tanggal sama.
10. Tampilkan unduhan, instruksi impor, item terlewati, dan field yang hilang.
11. Dengan izin pengguna, uji pada akun tujuan dan periksa hasilnya. Beri peringatan karena impor tujuan dapat sulit dibatalkan.

### Hasil

Ekspor pertama yang kompatibilitasnya dibuktikan, bukan sekadar file bernama `letterboxd.csv`.

**Selesai jika:** fixture dan impor nyata terverifikasi; file siap tidak dilabeli “akun tersinkron”; batas provider didokumentasikan. Tanpa uji tujuan, fitur tetap eksperimental sesuai gate PRD.

**Contoh commit:** `feat(letterboxd): preview rating conversion and skipped fields`, `test(letterboxd): verify importer compatibility`.

## 16. Tahap 13 — Hardening dan rilis P0

### Pekerjaan

1. Audit seluruh kebutuhan P0 PRD dan acceptance criteria; tutup kekurangan yang belum tercakup daftar tahap ini.
2. Jalankan unit, integration, end-to-end, dan pengujian keamanan.
3. Benchmark 10.000 item dan 100.000 aktivitas pada deployment referensi yang didokumentasikan.
4. Tambahkan pagination, indeks, dan job background bila hasil benchmark membutuhkannya.
5. Uji keyboard, pembaca layar untuk alur utama, fokus tidak tertutup, kontras, serta target sentuh.
6. Pastikan provider gagal tidak memblokir input manual, pencarian lokal, atau backup.
7. Siapkan logging aman, health check, backup sebelum migrasi, dan petunjuk rollback.
8. Pastikan database serta file persisten melewati restart/deploy ulang.
9. Siapkan staging terpisah. Jangan memakai backup pribadi sebagai fixture publik.
10. Gunakan aplikasi untuk data nyata bertahap sambil menyimpan salinan sumber.
11. Rilis P0 setelah gate PRD terpenuhi dan dokumentasikan batas dukungannya.

### Hasil

Aplikasi layak menjadi arsip utama, bukan hanya demo yang berhasil di komputer pengembang.

**Selesai jika:** tidak ada bug kritis kehilangan data/kebocoran, pemulihan teruji, target utama terpenuhi, dan pemilik dapat mengikuti runbook tanpa menebak.

**Contoh commit:** `perf(library): paginate large collections`, `docs(operations): document deployment and recovery`.

## 17. Tahap 14 — Sinkronisasi MAL dan impor P1

Mulai setelah P0 stabil. Jangan menambah konektor lain untuk menutupi masalah data inti.

### MAL dan antrean

1. Daftarkan aplikasi sesuai aturan provider dan verifikasi flow OAuth resmi yang berlaku.
2. Simpan token terenkripsi di server; implementasikan refresh, disconnect, dan pencabutan bila didukung.
3. Tambahkan TransferJob, hasil per item, snapshot terakhir, dan transactional outbox.
4. Terapkan worker dengan lease/recovery setelah restart dan retry terbatas.
5. Implementasikan pencocokan ID serta field anime/manga yang benar-benar didukung.
6. Buat first-sync preview; jangan menimpa remote pada koneksi pertama.
7. Buat konversi rating/status/progres serta peringatan chapter pecahan.
8. Comments MAL tidak dilabeli sebagai review publik; jurnal tidak dikirim.
9. Tangani 429, timeout, 5xx, token kedaluwarsa, konflik, dan keberhasilan sebagian.
10. Periksa remote sebelum retry ambigu bila request mungkin sudah berhasil.
11. Jangan mengirim penghapusan remote otomatis dari penghapusan lokal.
12. Uji dengan akun berizin sebelum mengaktifkan auto-sync opt-in.

### Impor dan backup terjadwal

1. Pilih satu format impor berdasarkan data lama yang benar-benar dimiliki pengguna.
2. Tambahkan preview mapping, deduplikasi, kebijakan konflik, dan laporan hasil.
3. Pastikan impor ulang file sama tidak menambah event/item duplikat.
4. Tambahkan format lain bertahap: CSV generik, IMDb CSV pengguna, Letterboxd CSV, dan MAL XML setelah formatnya diuji.
5. Aktifkan backup server terjadwal, retensi, enkripsi, dan restore drill sesuai hosting.
6. Spike IMDb Labs secara terpisah. Jangan memberi label kompatibel sebelum skema dan hasilnya terverifikasi.
7. Evaluasi metadata provider, smart collections, dan statistik lanjutan hanya jika alur harian sudah terbukti berguna.

**Selesai jika:** pengguna dapat mengirim pembaruan MAL secara terkendali, melihat hasil per item, dan tetap mencatat ketika provider gagal.

## 18. Pola kerja per task dan commit

1. Pilih satu kebutuhan atau bug nyata.
2. Tulis hasil yang harus terlihat dan cara mengujinya.
3. Kerjakan perubahan lengkap lintas file/lapisan bila diperlukan.
4. Jalankan test dan check relevan.
5. Periksa diff serta rahasia/data privat.
6. Buat atomic commit jika pembuatan commit sudah diizinkan.
7. Self-review melalui PR dan merge setelah pemeriksaan lulus.
8. Perbarui checklist dan dokumentasi hanya jika ada informasi baru.

Pertahankan commit individual yang rapi melalui rebase/merge sesuai kebijakan repository. Jangan membuat commit per file secara paksa, menyimpan test gagal di default branch, atau membuat perubahan buatan untuk mengejar angka.

## 19. Titik pemeriksaan kemajuan

| Gate | Bukti minimum |
|---|---|
| G1 — Fondasi | Clone bersih, setup terdokumentasi, CI lulus, akses tidak sah ditolak |
| G2 — Alpha | Satu alur pencatatan lengkap dan backup/restore awal lulus |
| G3 — Beta | Seluruh tipe, pengalaman, jurnal, custom fields, pencarian, koleksi, lifecycle berfungsi |
| G4 — Portabilitas | Backup lengkap, restore instalasi kosong, CSV aman, hasil konsisten |
| G5 — P0 | Letterboxd teruji, audit semua P0, keamanan/performa/aksesibilitas dan operasi lulus |
| G6 — P1 | MAL sinkron satu arah aman, job tahan restart, konflik/retry/hasil parsial teruji |

## 20. Estimasi dan langkah pertama

Gunakan estimasi PRD **9–14 minggu kerja fokus untuk P0, ditambah buffer risiko 20–30%**, sebagai baseline, bukan janji. Tahap-tahap dokumen ini memperinci pekerjaan yang sama; jangan menjumlahkan estimasi PRD dan rencana ini sebagai dua proyek terpisah. P1 diperkirakan tambahan 3–5 minggu untuk cakupan yang dipilih, bergantung izin API dan data migrasi.

### Urutan pertama yang dikerjakan

- [x] Konfirmasikan model hosting, autentikasi, offline, anggaran, dan stack baseline.
- [x] Catat ADR pertama.
- [ ] Susun backlog Alpha.
- [ ] Pilih vendor cloud, database, storage, dan pustaka autentikasi.
- [ ] Siapkan scaffold, PostgreSQL development/test, dan CI.
- [ ] Implementasikan autentikasi serta ownership.
- [ ] Buat model awal dan vertical slice manhwa.
- [ ] Buktikan backup/restore awal.

**Jangan mulai dari integrasi semua platform, statistik mewah, atau pembuatan ratusan commit. Mulai dari satu alur pribadi yang benar, aman, dan dapat dipulihkan.**
