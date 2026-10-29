# Strategi Commit — Banyak, Bermakna, dan Terhitung di GitHub

Tanggal riset: 29 Oktober 2026. Status: rekomendasi, belum mengubah konfigurasi Git/GitHub atau membuat commit.

## 1. Rekomendasi utama

Gunakan **pengembangan bertahap dengan atomic commits**, bukan generator aktivitas palsu. Pecah pekerjaan menjadi perubahan kecil yang lengkap, dapat dijelaskan, diuji, dan di-revert. Simpan commit individual yang memang berkualitas ketika masuk default branch.

Ini cara yang sesuai untuk memperoleh banyak commit sambil menghasilkan aplikasi yang berguna. Tidak ada angka maksimum yang bermakna: tanpa batas kualitas, jumlah commit dapat diperbesar tanpa batas tetapi nilai proyek tidak bertambah.

Jangan gunakan commit kosong terjadwal, perubahan tanggal palsu, toggle whitespace, edit/revert berulang tanpa alasan, atau pemecahan satu perubahan menjadi ratusan potongan yang tidak mandiri. Praktik itu mengotori history dan tidak membuktikan kemajuan.

## 2. Bedakan metriknya

| Metrik | Yang dihitung | Dampak workflow |
|---|---|---|
| Commit di repository | Objek commit dalam cakupan history tertentu | Dipengaruhi branch dan metode merge |
| Kontribusi profil | Aktivitas yang memenuhi aturan GitHub; bukan commit saja | Issue, PR, review, dan aktivitas lain juga dapat dihitung |
| Hari aktif | Tanggal berbeda dengan kontribusi yang dihitung | Banyak commit pada satu tanggal tetap satu hari aktif |
| Streak | Rangkaian hari aktif menurut alat yang dipakai | Kartu streak pihak ketiga punya aturan sendiri |

GitHub menghapus tampilan code streak bawaan pada 2016. Kartu streak yang umum di README berasal dari alat pihak ketiga. Banyak commit tidak otomatis berarti banyak hari aktif atau streak panjang.

## 3. Syarat commit agar dikaitkan dengan profil

Menurut GitHub Docs, commit harus:

1. Memakai email author yang terhubung dengan akun GitHub, termasuk alamat noreply milik akun yang benar.
2. Berada dalam repository mandiri, bukan hanya di fork.
3. Berada pada default branch, atau `gh-pages` untuk repository dengan project site.
4. Memenuhi hubungan akun dengan repository yang dijelaskan GitHub, misalnya sebagai collaborator. Untuk repository pribadi milik sendiri, kepemilikan dan atribusi email tetap harus benar.

Catatan:

- Commit lokal harus dipush ke GitHub. Commit feature branch umumnya belum dihitung sebagai commit contribution sampai masuk branch yang memenuhi syarat.
- Nama branch `main` saja tidak cukup bila bukan default branch yang sebenarnya.
- Kontribusi private dapat ditampilkan sebagai jumlah anonim lewat Profile → Contribution settings → Private contributions. Detail repository tidak otomatis menjadi publik.
- Pembaruan graph bisa memerlukan hingga 24 jam.
- Tanggal commit di profil mengikuti author date; push atau merge hari ini tidak otomatis memindahkan semua commit ke hari ini.
- Jangan mengubah tanggal untuk mengisi hari kosong.
- Angka profil tidak selalu identik dengan `git log`, terutama setelah penulisan ulang history; GitHub mendokumentasikan kemungkinan stale count.

## 4. Metode merge yang sesuai

| Metode | History base branch | Kesesuaian |
|---|---|---|
| Rebase and merge | Setiap commit dipertahankan sebagai perubahan individual, dengan SHA baru | Pilihan awal jika semua commit sudah rapi dan mandiri |
| Create a merge commit | Commit individual tetap ada, ditambah merge commit | Cocok jika konteks branch/PR perlu terlihat; jangan membuat branch hanya untuk menambah merge commit |
| Squash and merge | Banyak commit PR menjadi satu commit pada base branch | Tepat untuk PR berisi banyak fixup/WIP; tidak mempertahankan jumlah commit individual |
| Direct commit ke default branch | Setiap commit tersimpan langsung | Sederhana untuk pekerjaan dokumentasi kecil; lebih berisiko untuk kode tanpa pemeriksaan |

**Rekomendasi:** feature branch singkat, commit lengkap, self-review lewat PR, pemeriksaan lulus, lalu rebase and merge bila aturan repository mendukung. Gunakan merge commit jika perlu mempertahankan struktur branch. Tetap gunakan squash jika history PR terlalu berisik; kualitas lebih penting daripada menyimpan fixup.

Jangan menjanjikan rumus seperti “10 commit + 1 PR = tepat 11 kontribusi”. Atribusi, metode merge, tanggal, dan aturan GitHub memengaruhi angka akhir.

## 5. Aturan atomic commit

Satu commit = satu tujuan logis yang lengkap. Bukan satu file, satu fungsi, atau satu baris.

Checklist:

- Dapat dijelaskan dengan satu kalimat spesifik.
- Hanya mencakup perubahan yang terkait tujuan tersebut.
- Implementasi dan test yang diperlukan disertakan bersama agar commit lengkap.
- Build/check relevan lulus untuk commit yang dipertahankan di default branch.
- Tidak membawa credential, data personal, cover berlisensi tanpa izin, atau hasil ekspor pengguna.
- Dapat di-revert tanpa merusak fitur lain yang tidak terkait.
- Tidak menduplikasi artefak generated dan source hanya untuk menaikkan hitungan.

TDD boleh dilakukan lokal dengan langkah red/green/refactor. Untuk history utama yang stabil, jangan sengaja menyimpan commit test gagal hanya untuk menambah angka. Gabungkan red+green bila keduanya satu perubahan utuh. Test baru dapat menjadi commit terpisah jika menguji perilaku yang sudah ada dan tetap lulus.

## 6. Conventional Commits

Format pesan:

```text
<type>(<scope>): <perubahan spesifik>
```

Contoh:

```text
feat(library): add manual media creation with validation
feat(progress): record chapter updates and activity history
fix(progress): preserve fractional chapter values
feat(reviews): separate private journal from exportable review
test(export): cover Unicode and multiline Letterboxd fixtures
fix(export): exclude private journals from provider payloads
refactor(sync): isolate retry policy from provider adapter
perf(search): index alternative titles
ci: run unit and integration checks on pull requests
docs(backup): document restore verification
```

`feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `ci`, `build`, dan `chore` membantu pembacaan history. Prefix bukan faktor yang menentukan kontribusi GitHub. Jangan memberi label `feat` pada perubahan kosmetik agar terlihat lebih besar.

## 7. Workflow per perubahan

1. Pilih satu kebutuhan PRD atau bug nyata. Tulis hasil yang ingin dicapai dan cara memverifikasinya.
2. Buat branch singkat, misalnya `feat/chapter-progress`.
3. Kerjakan satu perubahan logis, beserta test yang diperlukan.
4. Periksa diff. Gunakan staging selektif bila working tree berisi beberapa tujuan.
5. Jalankan check relevan dan buat commit dengan pesan spesifik.
6. Lanjutkan ke perubahan mandiri berikutnya pada branch yang sama bila masih satu PR.
7. Push dan buka PR setelah unit pekerjaan siap. Cantumkan kebutuhan PRD, cara uji, serta risiko.
8. Self-review; perbaiki masalah yang benar-benar ditemukan.
9. Merge ke default branch setelah pemeriksaan lulus. Pertahankan commit individual hanya jika semuanya layak.
10. Catat hasil penggunaan nyata. Bug dan kekurangan berikutnya menjadi pekerjaan baru, bukan perubahan buatan.

Tidak perlu membuat satu issue atau PR per commit. Satu PR dapat berisi beberapa commit yang koheren. Jangan membuka issue/PR kosong atau review palsu untuk menambah kontribusi.

## 8. Contoh dekomposisi fitur

### Contoh: ekspor Letterboxd

Perubahan berikut dapat menjadi commit terpisah **jika masing-masing lengkap, dapat diuji, dan tidak sekadar placeholder**:

1. `docs(export): document supported Letterboxd fields and limits`
2. `feat(export): add rating conversion with boundary tests`
3. `feat(export): validate film identities and unsupported item types`
4. `feat(export): serialize compatible CSV with fixture tests`
5. `feat(export): split output within provider size limits`
6. `feat(export): report lossy conversions and skipped fields`
7. `feat(export): add preview and explicit review consent`
8. `feat(export): provide download and import instructions`
9. `test(export): add verified importer round-trip fixtures`
10. `docs(export): record compatibility verification and limitations`

Angka 10 bukan kuota. Bila dua langkah tidak bisa berdiri sendiri, gabungkan. Bila pengujian menemukan bug berbeda, perbaikannya dapat menjadi commit nyata tambahan.

### Contoh: progres chapter

- Aturan domain progres desimal dengan test.
- Penyimpanan progres dan aktivitas secara transaksional beserta migration/test.
- Endpoint update dengan validasi dan ownership check.
- Interaksi update cepat beserta keadaan loading/gagal dan test.
- Undo/koreksi beserta test agar statistik tidak menghitung koreksi sebagai konsumsi.
- Optimistic concurrency untuk perubahan antarperangkat.

Jangan memisahkan satu migration menjadi commit berbeda dari kode yang wajib membutuhkannya apabila menghasilkan keadaan aplikasi yang rusak.

## 9. Peluang commit nyata berdasarkan PRD

Berikut estimasi **unit perubahan logis**, bukan target wajib dan bukan jaminan jumlah contribution graph. Rentang tinggi hanya masuk akal bila kompleksitas serta bukti pengujiannya benar-benar ada.

| Area | Contoh unit mandiri | Estimasi unit |
|---|---|---:|
| Riset dan keputusan | Matriks referensi, aturan rating, ADR deployment/data | 6–12 |
| Fondasi proyek | Scaffold, validasi konfigurasi, lint, test, CI, auth | 10–18 |
| Model data dan integritas | Skema inti, tipe custom, identitas, relasi, version check | 12–22 |
| Perpustakaan | Create/edit/archive/restore, daftar, detail, duplikat | 14–24 |
| Progres dan pengalaman | Unit berbeda, koreksi, histori, repeat, sesi hobi | 14–26 |
| Rating dan tulisan | Null vs nol, revisi, spoiler, jurnal, izin ekspor | 10–18 |
| Organisasi | Pencarian alias, filter, sort, tag, koleksi, bulk edit | 10–20 |
| Portabilitas | Manifest, checksum, backup, restore validation/rollback | 12–22 |
| Letterboxd | Validasi, pemetaan, serializer, preview, batas file | 10–18 |
| Keamanan dan aksesibilitas | Upload, SSRF, sanitasi, keyboard, fokus, target sentuh | 12–22 |
| Performa dan operasi | Benchmark, indeks, observabilitas, deployment/runbook | 8–16 |
| MAL dan antrean P1 | OAuth, snapshot, retries, konflik, hasil per item | 18–32 |
| **Potensi total P0 + sebagian P1** | **Jika seluruh perubahan memang diperlukan** | **136–250** |

Hitungan ini mencakup pekerjaan kualitas, bukan hanya penambahan fitur. Beberapa unit akan digabung; sebagian akan berkembang setelah uji nyata. Tidak ada alasan membuat pekerjaan tambahan jika produk sudah benar.

## 10. Ritme yang meningkatkan konsistensi

- Pilih sesi kerja dengan hasil konkret: satu bug, satu alur, satu pengujian regresi, atau satu keputusan yang terdokumentasi.
- Lakukan commit ketika perubahan selesai, bukan menunggu satu minggu lalu membuat satu commit besar.
- Jadwalkan self-review dan merge secara rutin agar pekerjaan tidak tertahan di branch lama.
- Kerjakan dokumentasi, aksesibilitas, pengujian, dan backup sebagai bagian produk, bukan filler ketika mengejar graph.
- Jika satu hari tidak menghasilkan perubahan yang layak, jangan membuat commit buatan. Satu sesi riset atau debugging tetap bernilai meskipun belum ada commit.
- Jangan memakai kuota harian yang mendorong pemecahan tidak wajar. Contoh perhitungan “4 commit × 60 hari = 240” hanya aritmetika, bukan rencana kualitas.

## 11. Automasi yang membantu, bukan memalsukan

Direkomendasikan:

- Formatter, lint, type check, dan test sebelum merge.
- GitHub Actions menjalankan pemeriksaan dan laporan, bukan membuat commit aktivitas harian.
- Template issue/PR agar scope dan bukti uji jelas.
- Secret scanning dan dependency updates yang benar-benar dibutuhkan.
- Changelog/release yang dibuat saat ada rilis, bukan jadwal kosong.

Tidak direkomendasikan:

- Bot yang mengubah tanggal di README setiap hari.
- Scheduled empty commit atau script backdating.
- Commit data pemakaian tracker ke repository kode demi graph.
- Menggunakan akun bot/identitas orang lain dan mengklaim kontribusinya sebagai kerja pribadi.
- Mematikan CI atau mengurangi test untuk mempercepat jumlah commit.

Dependency bot mempunyai atribusi sendiri. Jangan mengasumsikan commit bot akan dihitung sebagai commit pribadi.

## 12. Checklist konfigurasi sebelum mulai

Belum dijalankan atau diubah oleh dokumen ini:

- [ ] Periksa default branch GitHub yang sebenarnya.
- [ ] Periksa email author Git lokal dan keterkaitannya ke akun GitHub.
- [ ] Gunakan email noreply yang benar bila ingin menjaga privasi.
- [ ] Periksa apakah repository mandiri atau fork.
- [ ] Tentukan merge policy dan proteksi/check default branch.
- [ ] Aktifkan tampilan private contributions jika diperlukan.
- [ ] Pastikan database, `.env`, token, backup, dan jurnal tidak masuk Git.
- [ ] Sepakati atomic commits sebagai kebijakan, bukan commit otomatis tanpa izin.

Untuk pekerjaan agen berikutnya: minta instruksi eksplisit untuk commit/push, tentukan apakah per unit perubahan atau setelah review. Riset ini tidak memberi izin untuk mengubah identitas Git, melakukan rebase/force-push, atau mengubah setting repository.

## 13. Sumber

Sumber primer:

1. GitHub — Profile contributions reference: https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference
2. GitHub — Troubleshooting missing contributions: https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/troubleshooting-missing-contributions
3. GitHub — Private contribution visibility: https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements
4. GitHub — Pull request merges: https://docs.github.com/en/pull-requests/reference/pull-request-merges
5. GitHub — GitHub Flow: https://docs.github.com/en/get-started/using-github/github-flow
6. Pro Git — Commit guidelines: https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#_commit_guidelines
7. Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0/
8. GitHub Blog — Penghapusan code streaks, historis: https://github.blog/news-insights/product-news/more-contributions-on-your-profile/

Sumber pihak ketiga untuk definisi alat streak, bukan aturan platform GitHub:

9. GitHub Readme Streak Stats: https://github.com/DenverCoder1/github-readme-streak-stats#ℹ️-how-these-stats-are-calculated

Aturan kontribusi, metode merge, dan email berasal dari dokumentasi resmi. Estimasi unit pekerjaan, pola pengembangan, dan prioritas adalah rekomendasi untuk proyek ini, bukan janji GitHub.
