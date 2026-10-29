# Riset Referensi — Personal Tracker Universal

Tanggal: 29 Oktober 2026. Pendamping: [PRD](PRD.md) dan [Strategi Commit](COMMIT-STRATEGY.md).

## 1. Ringkasan rekomendasi

Jadikan **Sofa dan Sequel** referensi pengalaman lintas media, **Yamtrack dan Ryot** referensi perilaku tracker serta portabilitas, **Letterboxd** referensi diary/rating, dan produk khusus buku, musik, game, serta hobi sebagai referensi kedalaman per kategori.

Pembeda produk ini bukan jumlah kategori saja: **arsip privat lintas minat, kesan yang terpisah dari jurnal pribadi, pengalaman ulang, serta ekspor dengan pemetaan transparan**.

Riset ini tidak otomatis mengubah scope PRD. Rekomendasi harus dinilai terhadap kebutuhan pribadi dan biaya pemeliharaan sebelum masuk backlog.

### Status bukti

- **A — Sumber primer dibaca:** halaman resmi, dokumentasi, listing pengembang, atau README proyek dapat dibaca.
- **B — Terindeks:** judul/cuplikannya ditemukan, tetapi detail penuh belum diverifikasi.
- **C — Usulan:** sintesis untuk proyek ini; bukan fitur yang diklaim ada di produk referensi.

Halaman marketing membuktikan bahwa pengembang mendeskripsikan suatu fitur, bukan membuktikan kualitas, kecepatan, keamanan implementasi, atau ketersediaannya di semua paket. Tidak ada akun uji yang digunakan. Browser interaktif tidak terhubung pada sesi ini; riset memakai halaman web, dokumentasi, dan katalog screenshot yang dapat diakses. Ini bukan audit visual pixel-perfect atau pengujian usability langsung.

## 2. Produk lintas media dan open-source

### R01 — Sofa

**Sumber A:** https://www.sofahq.com/

Halaman resmi memisahkan pengalaman menjadi Organize, Track, Play, Plan, dan Remember. Menyebut lists/groups, smart filters, flexible layouts, mode tracking, journaling, logbook, statistik, dan “Ingredients” untuk kustomisasi seperti rating dan tag. Situs menampilkan materi screenshot produk.

**Pelajaran untuk proyek:**

- Pengelompokan lintas media berdasarkan kebutuhan pengguna, bukan selalu dipisah menjadi aplikasi film/buku/musik.
- Koleksi personal dan logbook sama pentingnya dengan katalog judul.
- Penambahan kategori tidak boleh membuat semua field tampil bersamaan.
- Identitas yang hangat dan personal lebih cocok untuk hobi daripada dashboard operasional yang penuh angka.

**Prioritas:** koleksi, log aktivitas, rating, dan field custom dasar P0; smart lists P1.

**Jangan disalin ke scope awal:** player podcast, itinerary, peta, cuaca, puluhan tema, dan ikon alternatif. Fitur itu nyata pada referensi tetapi tidak diperlukan untuk mencapai tujuan tracker.

### R02 — Sequel

**Sumber A:** https://apps.apple.com/us/app/sequel-media-tracker/id1630746993

Listing pengembang menyebut wishlist lintas TV/film/buku/game, status Playing/Reading, checklist episode, Watch Next, koleksi, rating, catatan Markdown, release reminders, dan integrasi Trakt. Sebagian fitur bergantung paket berbayar. Listing juga menyatakan dukungan fitur aksesibilitas tertentu; itu deklarasi pengembang, bukan hasil audit riset ini.

**Pelajaran untuk proyek:**

- Beranda harus membantu “lanjutkan yang sedang dinikmati”, bukan hanya menampilkan semua data.
- Status memakai bahasa kategori: dibaca, ditonton, dimainkan.
- Detail item dapat membuka sumber eksternal tanpa menjadikannya sumber kebenaran arsip.

**Prioritas:** antrean lanjutkan, update progres, koleksi P0; pengingat rilis P2.

**Batas:** pengalaman Apple native tidak boleh diterjemahkan mentah-mentah menjadi web responsif. Listing tidak membuktikan dukungan ekspor universal yang diinginkan proyek ini.

### R03 — Yamtrack

**Sumber A:** https://github.com/FuzzyGrim/Yamtrack

README mencantumkan film, TV, anime, manga, game, buku, komik, board game; score/status/progress/repeats/tanggal/note; tracking history; custom media entries; personal lists; calendar; import beberapa layanan; serta ekspor CSV dan impor kembali. README menyediakan screenshot homepage, grid/table, detail, tracking, kalender, statistik, dan impor. Deployment Docker, SQLite/PostgreSQL, serta integrasi server media juga dijelaskan.

**Pelajaran untuk proyek:**

- Referensi terdekat untuk banyak perilaku tracker inti.
- Grid dan tabel melayani tugas berbeda; keduanya masuk akal untuk koleksi besar.
- Input manual penting untuk karya niche yang tidak ada di API.
- Impor/ekspor perlu menjadi fitur produk utama, bukan alat internal pengembang.

**Prioritas:** input manual, repeat, histori, daftar/grid, CSV P0; kalender dan integrasi server media P2.

**Batas:** custom media entry tidak otomatis berarti dukungan tipe custom dan field schema seluas PRD. Impor data dari layanan juga tidak sama dengan sinkronisasi dua arah.

**Lisensi:** repository menyatakan AGPL-3.0. Inspirasi perilaku tidak sama dengan menyalin kode. Periksa kewajiban lisensi sebelum memakai kode atau melakukan fork; jangan menganggap semua materi screenshot/aset bebas digunakan ulang.

### R04 — Ryot

**Sumber A:** https://docs.ryot.io/concepts/collections

Dokumentasi menjelaskan koleksi bawaan Watchlist, In Progress, Completed, Monitoring, Owned, Reminders, dan Custom. Koleksi dapat memengaruhi dashboard, notifikasi, serta transisi otomatis. Dokumentasi bahkan menjelaskan efek pengulangan episode dan total tidak diketahui terhadap completion.

**Pelajaran untuk proyek:**

- “Sedang dijalani” berguna sebagai dasar dashboard.
- Monitoring rilis sebaiknya terpisah dari selesai/tidak selesai.
- Otomasi status harus terdokumentasi dan dapat dipahami pengguna.

**Keputusan berbeda yang direkomendasikan:** jangan meniru semua aturan otomatis. Pada produk ini, status konsumsi, status publikasi, dan keanggotaan koleksi tetap terpisah. Total tidak diketahui tidak berarti tamat; rewatch satu episode tidak perlu otomatis membuka ulang keseluruhan serial.

**Prioritas:** pemisahan status/koleksi P0; monitoring P2.

## 3. Rating, diary, dan portabilitas

### R05 — Letterboxd

**Sumber A:** https://letterboxd.com/about/importing-data/

Dokumentasi menjelaskan CSV untuk watched films/diary, list, dan watchlist; field ID, rating, tanggal, rewatch, tag, serta review. Menyebut batas file 1 MB, preview import, dan penggabungan film yang sama pada tanggal sama.

**Pelajaran:** diary adalah pengalaman bertanggal, bukan hanya status item. Pisahkan rating utama dan pengalaman ulang; jangan menjanjikan dua sesi dalam hari yang sama pasti bertahan pada tujuan.

**Prioritas:** rating, pengalaman, tanggal kalender, preview ekspor P0.

**Batas:** bukan format backup universal. Review yang dikirim ke tujuan dapat memiliki konsekuensi publikasi.

### R06 — MyAnimeList API

**Sumber A:** https://myanimelist.net/apiconfig/references/api/v2

Endpoint resmi anime/manga list mendukung status, score, progres episode/chapter/volume, repeats, tags, dan comments. Score dan beberapa unit progres mempunyai batas tipe yang berbeda dari data personal.

**Pelajaran:** identitas karya dan pemetaan field harus mendahului koneksi akun. Comments list tidak identik dengan review publik. Chapter pecahan dan rating lebih presisi perlu preview konversi.

**Prioritas:** ID eksternal dan model progres P0; konektor OAuth P1.

## 4. Referensi hobi dan konsistensi

### R07 — Loop Habit Tracker

**Sumber A:** https://loophabits.org/

Situs resmi menyebut daily reminders, charts, statistics, serta proyek gratis/open-source GPLv3. Ada screenshot, tautan source code, dan privacy policy.

**Pelajaran:** sesi dan frekuensi lebih cocok untuk hobi berkelanjutan daripada status “tamat”. Statistik membantu refleksi, bukan sekadar memberi tekanan mempertahankan streak.

**Prioritas:** tanggal sesi, durasi, dan catatan hobi P0; tren frekuensi P1; reminder P2.

**Batas:** habit tracking tidak sama dengan media tracking. Jangan menyalin seluruh mekanisme kebiasaan ke lagu/film. Klaim privasi dari model penyimpanan satu perangkat tidak otomatis berlaku untuk aplikasi web/server.

## 5. Sumber pola interaksi dan referensi visual

### R08 — Mobbin: aplikasi nyata, bukan konsep semata

**Sumber A:** https://mobbin.com/explore/screens/0c7c1e72-7e31-49f8-88b7-48f3079962cc

Halaman berjudul “Letterboxd iOS Reviews & Ratings Screen”, menampilkan referensi screenshot dan kategori chip/text field/rating control. Berguna sebagai titik pemeriksaan alur rating dan pencatatan. Akses/save/full flow dapat memerlukan akun atau paket.

Sumber tambahan **B**:

- Detail film: https://mobbin.com/explore/screens/74b41ed1-1e47-4cdc-83da-3dea3e56b7b6
- Rekap tahunan: https://mobbin.com/explore/flows/b548392f-baef-4382-acf3-3f9deb8d6cc3

**Cara memakai:** bandingkan hierarki dan urutan tugas; jangan menyalin screenshot, logo, atau aset berhak cipta menjadi UI final.

### R09 — Dribbble dan Behance: eksplorasi gaya

**Sumber B:**

- https://dribbble.com/search/progress-tracker-ui
- https://www.behance.net/search/projects/Progress%20tracker%20ui%20design

Gunakan untuk variasi komposisi, tipografi, warna, dan kartu. Jangan menganggap konsep pada portofolio sudah teruji, aksesibel, atau mempunyai backend yang bekerja. Rujukan ini lebih lemah untuk memutuskan alur dibanding aplikasi nyata dan pedoman usability.

Tidak ada desain tertentu dari katalog tersebut yang telah diaudit pada riset ini. Pilih kandidat dahulu sebelum menjadikannya acuan formal.

### R10 — Nielsen Norman Group: progressive disclosure

**Sumber A:** https://www.nngroup.com/articles/progressive-disclosure/

Artikel menjelaskan pemisahan opsi inti dan opsi lanjutan. Fitur yang sering dipakai tetap terlihat; opsi jarang dipakai ditempatkan pada lapisan sekunder yang mudah ditemukan.

**Penerapan C:** form tambah awal cukup judul + tipe. Progres/rating/kesan dapat diisi cepat, sementara metadata lanjutan, ID provider, relasi, dan field langka dapat dibuka sesuai kebutuhan. Jangan menyembunyikan tombol update chapter yang digunakan setiap hari.

### R11 — Material Design 3

**Sumber B:**

- Lists: https://m3.material.io/components/lists/guidelines
- Progress indicators: https://m3.material.io/components/progress-indicators/guidelines

Hasil pencarian mengidentifikasi pedoman lists dan indikator proses; isi penuh halaman tidak terbaca lewat fetch pada sesi ini. Jadikan rujukan sekunder untuk pemeriksaan implementasi, bukan bukti audit komponen.

**Pembedaan C:** progres konsumsi seperti “12 dari 24 episode” bukan indikator loading. Loading menjelaskan pekerjaan sistem; progres konsumsi menjelaskan riwayat pengguna. Jangan menggabungkan keduanya dalam satu status yang ambigu.

### R12 — WCAG 2.2 / W3C

**Sumber A:** https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

SC 2.5.8 level AA menetapkan target pointer minimal 24×24 CSS px atau memenuhi pengecualian seperti spacing; bukan aturan tanpa pengecualian untuk semua tautan.

Sumber standar:

- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html

**Penerapan C:** target internal kontrol utama mobile sekitar 44×44 CSS px untuk kenyamanan; ini keputusan produk yang melampaui minimum AA tertentu, bukan klaim seluruh WCAG mewajibkan 44 px. Tombol tambah progres, rating, menu, dan checkbox harus nyaman disentuh; fokus keyboard tidak tertutup sticky header/footer. Status tidak boleh hanya dibedakan dengan warna.

## 6. Metadata dan lisensi

### R13 — TMDB

**Sumber B:** https://developer.themoviedb.org/docs/faq

Cuplikan resmi menyebut penggunaan API nonkomersial dengan atribusi data/gambar; syarat lengkap harus diperiksa sebelum implementasi dan jika model bisnis berubah.

**Penerapan C:** katalog film/TV dapat memakai provider metadata, tetapi ID, provenance, cache policy, atribusi, dan kegagalan provider harus ditangani. API metadata bukan otomatis API untuk menulis rating ke IMDb/Letterboxd.

## 6A. Pendalaman kategori, jurnal, dan kepemilikan data

### R14 — The StoryGraph

**Sumber B untuk beranda:** https://thestorygraph.com

**Sumber A untuk status ekspor:** https://roadmap.thestorygraph.com/requests-ideas/posts/export-csv

Beranda resmi terindeks menyebut Reading Journal dengan catatan privat pada pembaruan progres, custom tags/lists, DNF, owned, serta grafik membaca. Fetch beranda ditolak 403; detail fitur tersebut belum diuji langsung. Roadmap ekspor dapat dibaca dan berstatus Shipped, dengan petunjuk ke halaman User Export.

**Pelajaran:** kesan dapat melekat pada progres, bukan hanya akhir karya. DNF/dihentikan bukan penghapusan. Kepemilikan buku tidak sama dengan status selesai.

**Prioritas:** jurnal privat dan status dihentikan P0; grafik membaca dan antrean pendek P1. Jangan mewajibkan pertanyaan mood/pacing pada setiap update.

**Batas:** tersedianya ekspor tidak membuktikan seluruh jurnal dan metadata ikut diekspor.

### R15 — Trakt

**Sumber A:** https://roadmap.trakt.tv/changelog

Changelog 2026 menjelaskan histori/progres, pembedaan Up to date dan Ended, personal lists dan Smart Lists, serta kandidat pencocokan pada importer. Terdapat penawaran ekspor sebelum tindakan pembersihan data. Changelog juga mencatat Automatic Backups dihentikan pada Maret 2026; jangan mengasumsikan fitur lama tetap aktif.

**Pelajaran:** “sudah mengikuti episode terbaru” berbeda dari “serial tamat”. Importer perlu menangani ID hilang dan perbedaan pembagian season anime.

**Prioritas:** histori dan pemisahan status P0; impor dengan preview P1; sync Trakt P2.

### R16 — Backloggd

**Sumber A:** https://backloggd.com/about

**Sumber A:** https://backloggd.com/roadmap

Penjelasan resmi membedakan game dengan log/playthrough; game dapat mempunyai beberapa log dengan rating, review, platform, dan jurnal. Ownership memakai Library Entries. Pada roadmap yang diperiksa, CSV export masih menjadi permintaan, bukan fitur yang sudah dikirim.

**Pelajaran:** pisahkan karya dan pengalaman menikmati karya. Pola playthrough dapat diterapkan sebagai reread, rewatch, atau replay tanpa menimpa histori lama.

**Prioritas:** pengalaman berulang dasar P0 sesuai PRD; model edisi/platform yang mendalam P2.

**Batas:** jangan memasarkan ekspor Backloggd sebagai fitur terverifikasi. Kompleksitas edisi/remaster tidak perlu diterapkan ke semua tipe sejak awal.

### R17 — ListenBrainz

**Sumber A:**

- https://listenbrainz.readthedocs.io/en/latest/users/api/export.html
- https://listenbrainz.readthedocs.io/en/latest/users/api/statistics.html

Dokumentasi menjelaskan ekspor histori penuh/rentang waktu ke ZIP dengan JSONL, timestamp, metadata track, serta feedback bila ada. Statistik mencakup artis, rilis, rekaman, dan aktivitas. Ekspor bukan snapshot atomik; pembaruan inkremental membutuhkan deduplikasi/rekonsiliasi.

**Pelajaran:** histori mentah harus dapat diekspor; statistik merupakan turunan yang bisa dihitung ulang. Sesi dengar dan rating adalah dua jenis data berbeda.

**Prioritas:** lagu/album dan sesi manual P0; agregasi P1; scrobbling otomatis P2.

**Batas:** event musik dapat tumbuh jauh lebih cepat daripada buku/film. Jangan memakai asumsi skala MVP untuk scrobbling tanpa benchmark baru.

### R18 — AniList

**Sumber A:** https://docs.anilist.co/reference/object/medialist

**Sumber A:** https://anilist.gitbook.io/anilist-apiv2-docs/docs/guide/terms-of-use

Schema MediaList mendukung status, score, progres, volume, repeat, notes, custom lists, privasi, serta tanggal FuzzyDate. Ketentuan API membatasi penggunaan sebagai backup/storage, pengumpulan massal, dan layanan kompetitor nonkomplementer tanpa otorisasi yang sesuai.

**Pelajaran:** tanggal parsial adalah data sah; jangan mengarang hari/bulan. Status, progres, dan catatan pribadi dipisahkan dari metadata karya.

**Prioritas:** tanggal parsial dan progres berunit P0; konektor tetap P2 dan **bergantung kelayakan ketentuan/otorisasi**, bukan hanya kemampuan teknis API.

**Batas:** nonkomersial tidak otomatis berarti seluruh penggunaan diperbolehkan. Jika izin proyek tidak sesuai, jangan implementasikan konektor.

### R19 — Obsidian Bases

**Sumber A:** https://obsidian.md/help/bases

Dokumentasi resmi menjelaskan view database-like untuk mengedit, sort, dan filter catatan/properties; data tetap di Markdown lokal dan definisi view dipisahkan dalam `.base` atau blok kode.

**Pelajaran:** data tetap berguna di luar UI aplikasi. View/filter bukan data karya itu sendiri.

**Prioritas:** format backup terbuka P0; ekspor jurnal Markdown P1/P2 sesuai kebutuhan; integrasi vault P2.

**Batas:** tidak perlu memakai Markdown sebagai database internal atau membangun bahasa query/plugin untuk memperoleh manfaat portabilitas.

### R20 — Notion

**Sumber A:** https://www.notion.com/help/export-your-content

Dokumentasi mendukung HTML dan Markdown/CSV, tetapi menyatakan workspace tidak dapat langsung direkonstruksi hanya dengan mengunggah ulang hasil ekspor. Ekspor seluruh view database sekaligus juga tidak didukung.

**Pelajaran:** **ekspor yang dapat dibaca berbeda dari backup yang dapat dipulihkan**. CSV bukan representasi lengkap relasi, histori, dan lampiran.

**Prioritas:** backup native dan pengujian restore tetap P0. Jangan menunda kemampuan pulih demi memperbanyak format ekspor.

## 7. Sintesis kebutuhan per area

| Area produk | Referensi utama | Rekomendasi untuk proyek | Prioritas |
|---|---|---|---|
| Koleksi lintas media | Sofa, Sequel | Koleksi campuran, tipe sebagai filter bukan pemisah absolut | P0 |
| Lanjutkan aktivitas | Sequel, Ryot | Tampilkan item aktif dan aksi progres cepat | P0 |
| Grid/tabel | Yamtrack | Grid untuk pengenalan cover; tabel/list untuk perubahan dan data padat | P0 |
| Kesan dan diary | Letterboxd, Sofa | Pengalaman bertanggal, review terpisah dari jurnal privat | P0 |
| Item niche/custom | Yamtrack, Sofa | Input manual selalu tersedia; field custom bertipe | P0 |
| Hobi | Loop | Sesi, durasi, refleksi tanpa kewajiban tamat | P0 |
| Ekspor | Letterboxd, MAL | Preview mapping dan batas field; file berbeda dari API sync | P0/P1 |
| Smart collection | Sofa | Filter tersimpan setelah model query stabil | P1 |
| Statistik | Sofa, Loop | Pisahkan jumlah judul, pengalaman, sesi, dan waktu | P0/P1 |
| Monitoring rilis | Sequel, Ryot | Opt-in; pisahkan dari status selesai | P2 |
| Player dan sosial | Sofa dan platform khusus | Tidak diambil untuk scope awal | Di luar P0 |

## 8. Arah desain yang direkomendasikan — belum menjadi desain final

**Konsep C: perpustakaan pribadi yang hangat, dengan alat pencatatan yang ringkas.**

- Cover membantu mengenali karya; judul dan identitas tipe tetap terbaca tanpa gambar.
- Kepadatan dapat berubah antara grid dan daftar; jangan memaksa kartu besar untuk 10.000 item.
- Fokus beranda pada aktivitas yang sedang dijalani dan kesan terakhir, bukan leaderboard atau feed sosial.
- Tampilkan progres beserta unitnya, misalnya chapter 42.5 atau 25 menit; total tidak diketahui tidak menampilkan persentase palsu.
- Gunakan label privasi yang eksplisit pada jurnal dan review; status publikasi tidak disamarkan sebagai ikon dekoratif.
- Jaga aksi utama konsisten, tetapi label dan field mengikuti tipe konten.
- Empty/error/loading/offline/partial sync harus dirancang sebagai bagian alur utama.
- Pilih palet dan typography setelah kebutuhan kepadatan, cover, dan aksesibilitas diuji. Belum ada token warna atau komponen final dalam dokumen ini.

### Skenario evaluasi sebelum memilih desain

1. Tambah manhwa yang tidak ada di katalog.
2. Perbarui chapter pecahan dari ponsel tanpa membuka formulir panjang.
3. Simpan lagu favorit tanpa field episode atau tanggal selesai.
4. Catat sesi hobi 25 menit dan kesan singkat.
5. Catat menonton ulang film tanpa menimpa rating lama.
6. Bedakan review yang boleh dikirim dan jurnal privat.
7. Ekspor beberapa film, periksa konversi rating dan item tidak terpetakan.
8. Temukan karya memakai judul alternatif.
9. Pulihkan backup ke instalasi kosong.
10. Hadapi provider mati tanpa kehilangan pencatatan.

Desain dinilai dari keberhasilan dan waktu tugas tersebut, bukan hanya kemiripannya dengan aplikasi referensi.

## 9. Validasi yang masih diperlukan

- Uji interaktif produk referensi pada desktop/mobile bila akses tersedia.
- Periksa paket berbayar dan batas platform sebelum mengasumsikan semua fitur tersedia.
- Kumpulkan screenshot referensi yang boleh dipakai secara internal; catat tanggal dan sumber.
- Uji importer Letterboxd dan endpoint MAL dengan akun uji berizin.
- Verifikasi IMDb Labs importer secara langsung sebelum mengiklankan kompatibilitas.
- Periksa lisensi metadata, cover, kode, font, dan ikon sebelum reuse.
- Tentukan apakah fitur buku/game/musik yang lebih khusus benar-benar diperlukan pada penggunaan pribadi.

## 10. Hubungan dengan strategi commit

Riset sebaiknya menghasilkan keputusan dan perubahan nyata: aturan status, domain progres, fixture ekspor, aksesibilitas, pemetaan rating, dan backup. Masing-masing dapat menjadi atomic commit jika lengkap serta berbeda tujuan.

Jangan menyalin setiap fitur referensi atau membuat satu dokumen per URL hanya untuk memperbesar jumlah commit. Lebih baik satu keputusan yang jelas dan test yang membuktikannya daripada puluhan perubahan kosmetik.
