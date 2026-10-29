# Backlog Implementasi — Personal Tracker

Status: pekerjaan aplikasi belum dimulai. Backlog ini menyelesaikan langkah 2: menurunkan PRD menjadi pekerjaan yang dapat dieksekusi. Tidak ada issue, milestone, atau Project remote GitHub yang dibuat.

Acuan: [PRD](PRD.md), [ADR-0001](adr/0001-product-foundation.md), [rencana implementasi](IMPLEMENTATION-PLAN.md), dan [strategi commit](COMMIT-STRATEGY.md).

## 1. Aturan penggunaan

- ID backlog adalah referensi pekerjaan, bukan nomor issue GitHub.
- Semua task berstatus **Todo**. `Ready` berarti acceptance criteria, dependensi, dan fixture jelas; `In progress` berarti sedang dikerjakan; `Done` memerlukan bukti uji.
- Satu task boleh menghasilkan beberapa atomic commits, tetapi implementasi dan test yang saling membutuhkan tetap bersama.
- Task tidak selesai hanya karena antarmuka terlihat. Validasi server, ownership, keadaan gagal, dan backup harus ikut diperiksa sesuai scope.
- Dataset uji memakai data sintetis, bukan jurnal atau ekspor pribadi.
- Jangan mengaktifkan billing, provisioning, atau integrasi akun berizin luas hanya untuk menutup task.
- Commit dan push perubahan proyek telah diizinkan pemilik. Gunakan identitas Git dan autentikasi yang tersedia, bukan mengubah author, memalsukan tanggal, atau force-push. Jangan ikut men-stage perubahan lain tanpa pemeriksaan.

## 2. Milestone dan gate

| Milestone | Lingkup | Gate selesai |
|---|---|---|
| M1 — Alpha internal | ALPHA-01 sampai ALPHA-13 | Login pemilik, satu vertical slice manhwa, beberapa tipe manual dasar, progres, rating/kesan, dan backup awal dapat dipakai serta diuji |
| M2 — Beta pribadi | BETA-01 sampai BETA-07 | Semua kategori/template, custom type, pengalaman ulang, jurnal, relasi, organisasi, dan lifecycle tersedia; backup berkembang mengikuti data |
| M3 — MVP/P0 | P0-01 sampai P0-06 | Backup lengkap, Letterboxd terverifikasi, seluruh P0 PRD lulus, operasi/keamanan/performa/aksesibilitas siap |
| M4 — Integrasi/P1 | P1-01 sampai P1-06 | Cakupan integrasi yang dipilih teruji; bukan janji semua P1 selesai sekaligus |

Alpha dan Beta adalah tahapan internal, bukan perubahan prioritas PRD. Kebutuhan P0 yang baru selesai di Beta tetap wajib sebelum rilis P0.

## 3. Epic

| Epic | Tujuan | Backlog |
|---|---|---|
| Foundation | Hosting, toolchain, autentikasi, database, CI | ALPHA-01–04 |
| Library | Item manual, identitas, detail, relasi, lifecycle | ALPHA-06–07, BETA-04, BETA-06 |
| Tracking | Progres, status, histori, pengalaman, hobi | ALPHA-05, ALPHA-08, BETA-01–02 |
| Reviews | Rating, kesan, review, jurnal, revisi | ALPHA-09, BETA-03 |
| Taxonomy | Template dan field custom | BETA-01 |
| Organization | Pencarian, koleksi, daftar/grid, dashboard | ALPHA-10, BETA-05, BETA-07 |
| Portability | Backup, restore, ekspor, impor | ALPHA-11, P0-01–02, P1-03 |
| Integrations | Adapter Letterboxd/MAL dan provider tambahan | P0-03, P1-01–02, P1-04–05 |
| Quality & Operations | Test, keamanan, aksesibilitas, deploy, recovery | ALPHA-12–13, P0-04–06, P1-06 |

## 4. Alpha — pekerjaan siap diperinci menjadi implementasi

### ALPHA-01 — Pilih PostgreSQL dan batas deployment Vercel

- **Prioritas/risiko:** P0, tinggi; persistensi dan biaya.
- **Acuan:** ADR-0001 §5; PRD §14–16.
- **Dependensi:** tidak ada; dapat dimulai sekarang.
- **Tujuan:** pilih provider PostgreSQL yang kompatibel dengan Prisma dan paket gratis untuk aplikasi di Vercel.
- **Acceptance criteria:**
  - Dokumentasikan paket aktual, batas storage/compute/koneksi, sleep, region, backup, serta ekspor data dengan URL sumber dan tanggal pemeriksaan.
  - Tentukan runtime function/connection pooling dan jalur migration yang sesuai; jangan menaruh SQLite/database persisten pada filesystem function.
  - Pisahkan database development/test/production dan tetapkan bahwa preview tidak mengakses data production secara default.
  - Nyatakan status storage lampiran. Upload tetap dinonaktifkan sampai ada storage privat yang layak.
  - Tidak ada layanan berbayar atau overage diaktifkan tanpa persetujuan.
- **Cara uji/bukti:** ADR provider, checklist kompatibilitas, dan smoke test koneksi setelah resource disetujui/disediakan. Pilihan vendor dapat selesai sebelum provisioning; jangan mengklaim koneksi sudah teruji jika belum.
- **Di luar scope:** pembuatan resource berbayar, MAL worker, upload lampiran.

### ALPHA-02 — Scaffold, konfigurasi, dan pemeriksaan otomatis

- **Prioritas/risiko:** P0, sedang.
- **Acuan:** PRD §14, §19; rencana Tahap 2.
- **Dependensi:** ADR-0001; penyiapan scaffold dapat paralel dengan ALPHA-01.
- **Acceptance criteria:**
  - Next.js App Router + TypeScript berjalan, dengan versi runtime/dependency dikunci.
  - Perintah lint, type check, unit test, dan build terdokumentasi serta berhasil pada clone bersih.
  - CI menjalankan pemeriksaan yang sama untuk PR dan default branch.
  - `.env.example` hanya berisi nama/value contoh non-rahasia; `.gitignore` melindungi `.env`, database, ekspor, backup, attachment privat, dan build output.
  - Konfigurasi server gagal dengan error jelas tanpa mencetak secret; pemeriksaan build tidak memerlukan akses jurnal/database production.
  - Dokumentasi setup Windows tersedia.
- **Cara uji:** instalasi ulang dari lockfile, test konfigurasi invalid, lint/type check/test/build di CI.
- **Di luar scope:** desain final, CRUD, deployment production.

### ALPHA-03 — Migrasi dan ownership model awal

- **Prioritas/risiko:** P0, tinggi; integritas data.
- **Acuan:** LIB-08, REV-01; PRD §13.
- **Dependensi:** ALPHA-01–02.
- **Acceptance criteria:**
  - Model Owner, ItemType, Item, LibraryEntry, Experience, ProgressState, Activity, RatingRevision, dan Review mempunyai ID stabil dan relasi yang tervalidasi.
  - Data personal mempunyai owner; status rilis terpisah dari status konsumsi.
  - Rating null, 0, dan 87 dapat disimpan sebagai nilai berbeda. Progres desimal dan total null tidak berubah menjadi integer/0.
  - Date-only, timestamp UTC, dan tanggal parsial mempunyai representasi yang jelas.
  - Migration berjalan pada database kosong; seed development/test hanya sintetis, tidak otomatis dijalankan di production.
- **Cara uji:** integration test constraint/relasi, migration database kosong, round-trip rating/progres/tanggal.
- **Di luar scope:** seluruh field custom, import format eksternal, koneksi MAL.

### ALPHA-04 — GitHub OAuth hanya untuk pemilik

- **Prioritas/risiko:** P0, tinggi; akses privat.
- **Acuan:** ACC-01, ACC-03; ADR-0001 §3.
- **Dependensi:** ALPHA-02–03; konfigurasi OAuth memerlukan akun pemilik.
- **Acceptance criteria:**
  - Pilih pustaka autentikasi terawat dan dokumentasikan konfigurasi callback development/production.
  - Allowlist menggunakan ID GitHub stabil dari konfigurasi server; akun pertama yang login tidak otomatis menjadi pemilik.
  - Owner yang belum dikonfigurasi menyebabkan akses ditolak, bukan akses terbuka.
  - API, halaman personal, unduhan, dan query/mutasi memeriksa sesi serta ownership pada server.
  - Tidak meminta izin repository untuk login; secret/token tidak ada di client bundle/log.
  - Tidak ada registrasi publik. Akun selain owner ditolak tanpa mengungkap data.
- **Cara uji:** sesi kosong/kedaluwarsa, ID salah, konfigurasi hilang, request langsung ke endpoint; smoke test OAuth nyata setelah konfigurasi pengguna.
- **Di luar scope:** membuat OAuth App tanpa konfigurasi pengguna, login Google/password, akses repository melalui aplikasi.

### ALPHA-05 — Aturan domain status, progres, dan rating

- **Prioritas/risiko:** P0, tinggi; semantik arsip.
- **Acuan:** PRO-01–09, REV-01–02, LIB-08.
- **Dependensi:** ADR-0001; unit test domain dapat dibuat paralel dengan ALPHA-03–04.
- **Acceptance criteria:**
  - Status konsumsi dan rilis berbeda; menaikkan progres tidak otomatis menamatkan karya ongoing/hobi.
  - Chapter 12.5 diterima; negatif ditolak; total null berbeda dari 0.
  - Progres melebihi total menghasilkan keputusan eksplisit, bukan clamp diam-diam.
  - Rating 87 ditampilkan 8.7/10; null tidak ditampilkan sebagai 0.
  - Perubahan progres membedakan konsumsi, koreksi, dan undo.
- **Cara uji:** tabel unit test boundary, zero/null, unknown total, fractional chapter, ongoing, dan tanggal tidak diketahui; gunakan spesifikasi fixture di `tests/fixtures/README.md`.
- **Di luar scope:** mapping provider, milestone nonlinier, statistik lanjutan.

### ALPHA-06 — Tambah item manual melalui server

- **Prioritas/risiko:** P0, sedang.
- **Acuan:** LIB-01–03, LIB-08; AC-01 sebagian.
- **Dependensi:** ALPHA-03–05.
- **Acceptance criteria:**
  - Judul dan tipe saja cukup untuk membuat item; judul kosong/whitespace ditolak.
  - Judul Unicode/alternatif, kreator, tahun, bahasa, dan tautan sumber dapat disimpan opsional.
  - Pembuatan item, entry personal, dan state awal terkait dilakukan secara transaksional.
  - Retry request yang sama tidak membuat duplikat; judul sama tetap boleh untuk karya berbeda.
  - Owner diambil dari sesi, bukan dipercaya dari input client.
- **Cara uji:** integration test payload valid/invalid, Unicode, request ulang, dan owner palsu.
- **Di luar scope:** pencarian metadata, mengambil cover dari URL, deduplikasi berdasarkan kemiripan judul.

### ALPHA-07 — Form tambah, daftar dasar, detail, dan edit

- **Prioritas/risiko:** P0, sedang.
- **Acuan:** LIB-01–03; PRD §12.
- **Dependensi:** ALPHA-06.
- **Acceptance criteria:**
  - Pengguna dapat menambah item, melihat daftar/detail, dan mengubah judul/status dengan validasi server.
  - Field lanjutan tidak wajib pada alur tambah cepat.
  - Loading, kosong, tidak ditemukan, error, dan tersimpan dapat dibedakan.
  - Form gagal mempertahankan input pada sesi halaman aktif; tidak mengklaim dukungan offline permanen.
  - Perubahan versi lama tidak menimpa perubahan perangkat lain diam-diam.
  - Alur dapat dijalankan pada viewport 360 px dan dengan keyboard.
- **Cara uji:** end-to-end tambah/edit/reload, simulasi error server, conflict version, serta navigasi keyboard.
- **Di luar scope:** mockup final seluruh halaman, grid/filter lengkap, bulk edit.

### ALPHA-08 — Update chapter dengan histori dan koreksi

- **Prioritas/risiko:** P0, tinggi.
- **Acuan:** PRO-02–09; AC-02.
- **Dependensi:** ALPHA-05–07.
- **Acceptance criteria:**
  - Input langsung dan aksi tambah chapter menyimpan ProgressState dan Activity dalam satu transaksi.
  - Chapter pecahan tetap persis; total boleh tidak diketahui.
  - Koreksi 21 ke 19 terlihat sebagai koreksi, bukan konsumsi tambahan.
  - Retry tidak menggandakan aktivitas; stale version memberi konflik yang dapat dipahami.
  - Status Selesai membutuhkan pilihan eksplisit; tanggal tidak diketahui tetap kosong.
- **Cara uji:** integration transaksi/rollback/idempotensi, concurrent edit, end-to-end update dan reload; skenario 20 → 21 → koreksi 19.
- **Di luar scope:** statistik chapter nonlinier, tracking semua episode individual, sinkronisasi MAL.

### ALPHA-09 — Rating dan kesan awal

- **Prioritas/risiko:** P0, tinggi untuk privasi tulisan.
- **Acuan:** REV-01–04, REV-07–08.
- **Dependensi:** ALPHA-05–07.
- **Acceptance criteria:**
  - Pengguna dapat menyimpan/mengosongkan rating, menulis kesan, serta menandai favorit secara independen dari selesai/rating.
  - Rating 0 dan null tetap berbeda di database, antarmuka, serta revisi.
  - Perubahan rating dan kesan tidak menghapus histori revisi.
  - Teks Unicode, paragraf, dan tautan dirender aman; script/HTML berbahaya tidak dieksekusi.
  - Tidak ada tulisan dikirim ke platform lain pada Alpha.
- **Cara uji:** unit/integration boundary dan revisi, end-to-end edit/reload, payload XSS sintetis.
- **Di luar scope:** dimensi rating, review publik, jurnal per sesi lengkap (BETA-03).

### ALPHA-10 — Daftar aktif dan aktivitas terakhir

- **Prioritas/risiko:** P0, rendah.
- **Acuan:** ORG-03; PRD §9.6 sebagian.
- **Dependensi:** ALPHA-07–09.
- **Acceptance criteria:**
  - Dashboard menampilkan item Sedang dijalani dan aktivitas terakhir milik owner.
  - Default sort dan pagination/cursor jelas; daftar tidak memuat semua aktivitas tanpa batas.
  - Tanggal mengikuti zona waktu pengguna; tanggal kosong tidak dibuat menjadi hari ini.
  - Koreksi diberi label berbeda dari aktivitas konsumsi.
- **Cara uji:** fixture bercampur status/tanggal, query ownership, empty state, end-to-end pindah ke detail.
- **Di luar scope:** grafik, target harian, smart collection.

### ALPHA-11 — Backup native awal dan restore terisolasi

- **Prioritas/risiko:** P0, sangat tinggi; penghalang sebelum data penting dipakai.
- **Acuan:** ACC-05 sebagian; PRD §11; AC-07 versi Alpha.
- **Dependensi:** ALPHA-03–09.
- **Acceptance criteria:**
  - Ekspor JSON native berversi mencakup seluruh entitas personal yang tersedia pada Alpha dan relasinya.
  - Token, session, password/secret tidak ikut; file diberi peringatan mengandung data privat.
  - Restore ke database uji kosong menghasilkan ID, nilai, dan relasi sama.
  - File invalid/versi tidak didukung ditolak tanpa partial commit.
  - Endpoint ekspor hanya untuk owner; restore Alpha tidak ditawarkan sebagai overwrite production yang belum aman.
  - Fitur data baru wajib memperbarui kontrak backup/test pada perubahan yang sama.
- **Cara uji:** round-trip fixture, file rusak, relasi putus, ownership, serta pemeriksaan tidak adanya secret.
- **Di luar scope:** ZIP lampiran, merge restore, jadwal backup server; diselesaikan P0/P1.

### ALPHA-12 — End-to-end dan gate Alpha

- **Prioritas/risiko:** P0, tinggi.
- **Acuan:** AC-01 sebagian, AC-02, AC-07 versi Alpha; PRD §19.
- **Dependensi:** ALPHA-01–11.
- **Acceptance criteria:**
  - Skenario login → tambah manhwa → update chapter → rating/kesan → reload → backup → restore lulus.
  - Akses tanpa sesi, akun lain, invalid input, retry, dan stale version diuji.
  - Film/lagu/hobi dapat ditambah sebagai item dasar tanpa wajib chapter; kedalaman template/sesi tetap Beta.
  - Belum ada jurnal/credential/data production di fixture, log, dan repository.
  - Semua pemeriksaan CI lulus; daftar keterbatasan Alpha tersedia.
- **Cara uji:** suite end-to-end, review hasil integration/unit, dan walkthrough manual mobile/keyboard.
- **Di luar scope:** klaim semua P0 selesai atau Letterboxd sudah kompatibel.

### ALPHA-13 — Deployment Alpha privat ke Vercel

- **Prioritas/risiko:** P0, tinggi; paparan internet.
- **Acuan:** ACC-01, ACC-03; ADR-0001; PRD §14–16.
- **Dependensi:** ALPHA-01–04, ALPHA-11–12; resource dan konfigurasi provider harus tersedia.
- **Acceptance criteria:**
  - Deployment memakai Vercel Hobby dan resource yang disetujui tanpa aktivasi biaya tersembunyi.
  - Production/preview/development terpisah; preview tidak otomatis menjalankan migration/seed terhadap production.
  - Migration production merupakan langkah terkontrol, bukan efek samping setiap preview build.
  - OAuth callback, HTTPS, akses owner, cache privat, dan akses API langsung diverifikasi.
  - Data bertahan melewati restart/deploy ulang; backup dapat diunduh dan dipulihkan pada lingkungan terisolasi.
  - Ada petunjuk rollback, konfigurasi environment non-rahasia, serta penanganan batas paket gratis.
- **Cara uji:** smoke test deployment, login akun yang benar/salah, redeploy persistence, restore drill, dan review environment scope.
- **Di luar scope:** custom domain berbayar, deployment seluruh branch tanpa batas, SLA, sinkronisasi MAL.

## 5. Beta — lengkapi universal tracker

Pekerjaan Beta perlu dipecah lagi jika terlalu besar sebelum diambil. Seluruhnya tetap prioritas P0 PRD.

| ID | Tujuan dan acuan | Dependensi | Acceptance criteria dan cara uji | Di luar scope |
|---|---|---|---|---|
| BETA-01 | Template semua kategori dan field custom; LIB-04, PRO-01–03/06 | ALPHA-03/05/11 | Semua template PRD tersedia; field bertipe tervalidasi; chapter/volume tidak dikonversi otomatis; lagu/hobi tidak wajib tamat; arsip definisi mempertahankan nilai. Uji matriks kategori dan backup round-trip. | Formula, template komunitas, editor database generik |
| BETA-02 | Pengalaman ulang dan sesi hobi; PRO-10–11, AC-03 | BETA-01, ALPHA-08/11 | Siklus baru tidak menimpa histori; sesi menyimpan tanggal/durasi/kesan; rating utama dipilih eksplisit; dua tontonan sehari tetap dua pengalaman lokal. Uji repeat dan durasi. | Timer otomatis, scrobbling |
| BETA-03 | Review/jurnal/revisi/spoiler; REV-03–07, AC-10 | ALPHA-09/11, BETA-02 | Kesan, review, jurnal mempunyai jenis berbeda; tulisan terkait item/pengalaman/sesi; kebijakan allowlist melarang jurnal pada payload platform; revisi dan sanitasi teruji. | Review publik/sosial |
| BETA-04 | Identitas eksternal, duplikat, relasi; LIB-05–07 | ALPHA-06/11 | ID unik pada owner/provider/entity_type; judul sama bukan auto-merge; adaptasi berbeda progres; peringatan ID ganda. Uji constraint dan relasi dalam restore. | Pencarian katalog dan merge duplikat otomatis |
| BETA-05 | Cari/filter/sort/grid/koleksi/bulk; ORG-01–05 | BETA-01/04, ALPHA-10/11 | Cari alias/kreator/catatan; seluruh filter/sort P0 tersedia; koleksi campuran; bulk preview dan konfirmasi. Uji kepemilikan, filter gabungan, mobile, keyboard. | Smart collection |
| BETA-06 | Lifecycle, attachment, hapus arsip; LIB-01/03, ACC-05 | ALPHA-11, BETA-01–04; storage privat harus dipilih untuk attachment | Arsip/restore menjaga relasi; hard delete menjelaskan akibat lokal/backup/remote; MIME/ukuran/checksum tervalidasi; SSRF dicegah atau URL fetch dinonaktifkan. Uji akses file, cleanup, dan kegagalan. | Distribusi media penuh, delete remote otomatis |
| BETA-07 | Pengaturan dan ringkasan; ACC-02, REV-08; PRD §9.6 | BETA-02/05, ALPHA-09/10 | Bahasa Indonesia, zona waktu, skala rating dan tampilan default dapat diatur; ringkasan tipe/status/favorit benar; judul, pengalaman, sesi, koreksi dihitung terpisah. Uji tanggal lintas zona dan null. | Grafik kompleks dan gamifikasi |

## 6. P0 — portabilitas, integrasi pertama, dan kelayakan rilis

| ID | Tujuan dan acuan | Dependensi | Acceptance criteria dan cara uji | Di luar scope |
|---|---|---|---|---|
| P0-01 | Backup ZIP lengkap; PRD §11, AC-07 | Seluruh Beta, ALPHA-11 | Manifest/schema version/checksum/attachment lengkap; dry-run, restore kosong/merge native jelas; snapshot sebelum restore berisiko; DB/storage tidak setengah pulih. Uji round-trip, ZIP bomb/traversal, versi invalid dan failure cleanup. | Token OAuth di backup |
| P0-02 | CSV generik aman; PRD §10–11 | BETA-01/03/05, P0-01 | Unicode, kutip/newline, kolom custom dan formula injection ditangani; batas CSV vs native dijelaskan; jurnal hanya dalam ekspor arsip yang dipilih eksplisit, bukan payload platform. Uji parser dan data berbahaya sintetis. | Jaminan CSV diterima semua platform |
| P0-03 | Letterboxd tervalidasi; PRD §10, AC-04–06/10 | BETA-02–05, P0-01 | Capability/validator/preview; match ambigu dikonfirmasi; rating lossy terlihat; watched vs watchlist terpisah; review opt-in; jurnal tidak ikut; batas file/duplikat tanggal ditangani. Contract test dan impor akun berizin. Tanpa uji tujuan tetap eksperimental. | Sinkronisasi langsung Letterboxd |
| P0-04 | Audit keamanan dan privasi; PRD §16/19 | Seluruh alur P0 | Auth/ownership/cache, XSS/CSRF, file/SSRF, XML bila ada, ZIP, CSV, secret/log diperiksa; nol temuan kritis/tinggi terbuka. Bukti hasil uji dan perbaikan tersedia. | Klaim sertifikasi audit eksternal |
| P0-05 | Performa dan aksesibilitas; PRD §15 | Beta dan P0-01–03 | Benchmark 10.000 item/100.000 aktivitas dengan profil terdokumentasi; target PRD diuji; keyboard/fokus/kontras/target sentuh diperiksa; tidak hanya skor otomatis. | Mengganti unit konsumsi menjadi satu angka total |
| P0-06 | Operasi dan gate rilis; PRD §19/23 | P0-01–05 | Runbook deploy/migration/rollback/backup/restore/kuota tersedia; checklist seluruh P0 ditelusuri; provider gagal tidak menghentikan manual CRUD; restart tidak menghilangkan pekerjaan yang diterima. Rilis hanya setelah gate lulus. | Menjanjikan SLA 24/7 gratis |

## 7. P1 — diprioritaskan setelah pemakaian nyata

| ID | Tujuan dan acuan | Dependensi | Acceptance criteria dan cara uji | Di luar scope |
|---|---|---|---|---|
| P1-01 | Kontrak job, outbox, dan koneksi MAL; ACC-04, PRD §10.8–9 | P0 stabil, kelayakan worker/provider diverifikasi | OAuth resmi, token terenkripsi, disconnect, job persisten dengan hasil per item, lease/recovery dan outbox transaksional; uji restart, token invalid dan akses. | Meminta password/cookie MAL |
| P1-02 | Sinkronisasi MAL satu arah; AC-09/11 | P1-01, BETA-04 | First-sync preview, ID valid, allowlist field, snapshot/konflik, retry terbatas, 429/5xx/timeout ambigu/partial success diuji; tidak ada delete remote otomatis. | Dua arah otomatis, comments dianggap review publik |
| P1-03 | Impor data lama terpilih; PRD §11, AC-08 | P0-01, contoh data pengguna atau fixture format sah | Satu format dahulu, preview mapping/deduplikasi/konflik/laporan; impor ulang tidak menambah item/event; parsial tanggal tetap parsial. Test XML aman untuk format XML. | Semua format sekaligus |
| P1-04 | Metadata manual-assisted; LIB-09–11 | BETA-04, izin provider | Sumber terlihat, input manual tetap ada; refresh tidak menimpa field dikunci/tulisan; merge duplikat dengan preview dan audit. | Bulk scraping |
| P1-05 | Smart collection, milestone, dimensi rating, analitik; ORG-06, PRO-12, REV-09 | Beta stabil, kebutuhan pribadi terbukti | Pilih fitur berdasarkan pemakaian, definisikan rumus/unit, buat acceptance criteria per fitur sebelum implementasi. | Mengambil seluruh fitur referensi tanpa evaluasi |
| P1-06 | Backup terjadwal dan discovery IMDb; PRD §10/14/15 | P0, provider/scheduler layak | Pecah menjadi dua task saat dikerjakan: backup terjadwal+retensi/enkripsi/restore drill; spike IMDb dengan bukti format/hasil. Tidak ada klaim kompatibel sebelum terbukti. | Menganggap cron Hobby cocok untuk semua job |

## 8. Traceability kebutuhan P0 ber-ID

Task yang tercantum harus menyelesaikan seluruh perilaku kebutuhan, bukan hanya sebagian implementasi Alpha.

| Kebutuhan PRD | Pemilik pekerjaan |
|---|---|
| ACC-01, ACC-03 | ALPHA-04/13, P0-04 |
| ACC-02 | BETA-07 |
| ACC-05 | ALPHA-11, BETA-06, P0-01/02/06 |
| LIB-01 | ALPHA-06/07, BETA-06 |
| LIB-02 | ALPHA-06/07 |
| LIB-03 | ALPHA-06/07, BETA-04/05/06 |
| LIB-04 | BETA-01 |
| LIB-05, LIB-06, LIB-07 | BETA-04 |
| LIB-08 | ALPHA-03/05/08 |
| PRO-01, PRO-02, PRO-03 | ALPHA-05/08, BETA-01 |
| PRO-04, PRO-05, PRO-06, PRO-07, PRO-08, PRO-09 | ALPHA-05/08, BETA-01 |
| PRO-10, PRO-11 | BETA-02 |
| REV-01, REV-02 | ALPHA-05/09, BETA-07 |
| REV-03, REV-04 | ALPHA-09, BETA-03 |
| REV-05, REV-06, REV-07 | BETA-03, P0-03/04 |
| REV-08 | ALPHA-09, BETA-07 |
| ORG-01, ORG-02, ORG-03, ORG-04, ORG-05 | ALPHA-10, BETA-05 |

Kebutuhan tanpa ID tabel—dashboard, backup, job, privasi, NFR, operasional—ditelusuri melalui bagian PRD pada masing-masing task. Gate P0-06 tetap memerlukan audit keseluruhan PRD.

## 9. Data uji dan skenario wajib

Dataset spesifikasi berada di [`tests/fixtures/personal-library.v1.json`](../tests/fixtures/personal-library.v1.json), dengan penjelasan di [`tests/fixtures/README.md`](../tests/fixtures/README.md). Ini **bukan** format backup aplikasi dan belum menjadi kontrak model database. Fixture berfungsi sebagai oracle kebutuhan; adapter test akan dibuat saat implementasi.

Skenario yang harus dipertahankan:

- Manhwa ongoing dengan chapter 42.5 dan total tidak diketahui.
- Koreksi progres 20 → 21 → 19, bukan tambahan konsumsi.
- Film ditonton ulang dua kali pada tanggal sama; pengalaman lokal tidak digabung.
- Novel dengan tanggal hanya tahun dan rating belum dinilai.
- Lagu dengan rating nol tanpa kewajiban progres atau tamat.
- Hobi dengan durasi sesi dan jurnal yang tidak boleh diekspor ke platform.
- Tipe custom dengan field pilihan/URL dan Unicode.
- Judul sama untuk dua karya berbeda; tidak auto-merge.
- Rating 87 menjadi 8.7/10 lokal; konversi provider tidak mengubah 87.

## 10. Urutan eksekusi berikutnya

1. Mulai **ALPHA-01**: verifikasi dan pilih PostgreSQL untuk Vercel. Provisioning/credential terpisah dari keputusan vendor.
2. Kerjakan **ALPHA-02**: scaffold dan CI tanpa menimpa dokumentasi.
3. Implementasikan **ALPHA-03** serta aturan domain **ALPHA-05**.
4. Tambahkan **ALPHA-04**, lalu vertical slice **ALPHA-06–09**.
5. Buktikan **ALPHA-11** sebelum menjadikan aplikasi tempat data penting.
6. Lengkapi dashboard, gate Alpha, dan deploy privat setelah konfigurasi tersedia.

**Selesai untuk langkah perencanaan ini:** milestone dan epic lokal tersedia, task Alpha memiliki acceptance criteria/dependensi/cara uji/batas scope, data sintetis tersedia, dan pemetaan P0 tercatat. Tidak ada fitur aplikasi yang dianggap selesai hanya karena backlog ini dibuat.
