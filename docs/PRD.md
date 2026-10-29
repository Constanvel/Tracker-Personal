# PRD — Personal Tracker Universal

> Nama kerja: **Personal Tracker**. Nama final belum ditentukan.
>
> Versi: 1.0 · Tanggal: 29 Oktober 2026 · Status: Draf untuk persetujuan pemilik produk.
>
> Dokumen ini menetapkan kebutuhan produk, batas integrasi, kriteria penerimaan, dan rencana implementasi. Pilihan teknologi dan estimasi masih berupa rekomendasi, bukan keputusan yang sudah disetujui.

## 1. Ringkasan produk

Personal Tracker adalah aplikasi pribadi untuk mencatat semua karya, hiburan, minat, dan aktivitas yang disukai pengguna dalam satu tempat: manhwa, manga, manhua, komik, anime, film, serial, novel, lagu, album, game, podcast, serta hobi dan kategori buatan sendiri.

Pengguna dapat menyimpan progres, kesan, rating, catatan, tanggal pengalaman, dan koleksi. Data menjadi arsip pribadi yang bisa dicari, dianalisis, dicadangkan, serta diekspor atau disinkronkan ke layanan eksternal yang mendukungnya.

**Janji utama: catat sekali, miliki datanya, kirim ke platform yang sesuai tanpa kehilangan versi aslinya.**

**Batas penting:** tidak ada satu format atau API yang dapat mengirim semua jenis data ke semua platform. Lagu tidak dapat dipaksakan masuk ke MAL; hobi tidak otomatis mempunyai tujuan ekspor. Kemampuan setiap konektor harus dinyatakan secara jujur.

## 2. Masalah yang diselesaikan

1. Riwayat konsumsi tersebar di MAL, IMDb, Letterboxd, aplikasi musik, spreadsheet, dan catatan pribadi.
2. Platform khusus tidak dapat menampung seluruh minat pengguna.
3. Kesan pribadi sering hilang karena hanya mencatat rating akhir.
4. Progres dan riwayat membaca/menonton ulang sulit dirangkum.
5. Pengguna harus mengisi data yang sama berulang kali di beberapa platform.
6. Format rating, status, judul, dan identitas karya berbeda antarlayanan.
7. Arsip pribadi bergantung pada umur layanan, akses akun, dan kebijakan platform.

## 3. Visi, tujuan, dan non-tujuan

### 3.1 Visi

Menjadi arsip pribadi jangka panjang untuk segala hal yang dinikmati dan ditekuni pengguna, bukan sekadar daftar judul yang sudah selesai.

### 3.2 Tujuan

- Menyatukan seluruh kategori dalam satu perpustakaan tanpa menghilangkan atribut khusus masing-masing.
- Mempercepat pencatatan progres dan kesan sehari-hari.
- Menyediakan riwayat pengalaman berulang dan perubahan penilaian.
- Menjamin kepemilikan data melalui ekspor lengkap dan pemulihan yang teruji.
- Mengurangi input ulang melalui konektor resmi dan file impor yang kompatibel.
- Menjaga catatan pribadi tetap privat kecuali pengguna memilih membagikannya.

### 3.3 Non-tujuan untuk rilis awal

- Jejaring sosial, komentar publik, pengikut, atau marketplace.
- Pemutar musik/video, pembaca komik penuh, atau distribusi konten berhak cipta.
- Menyimpan salinan film, lagu, manga, atau buku secara otomatis.
- Rekomendasi berbasis AI, scraping besar-besaran, atau pemantauan aktivitas perangkat.
- Sinkronisasi dua arah ke semua platform sejak hari pertama.
- Menjamin semua metadata dunia tersedia atau semua karya ada di katalog tujuan.
- Pelacakan kesehatan, keuangan, dan produktivitas umum di luar konteks minat/hobi.

## 4. Pengguna dan asumsi awal

### 4.1 Pengguna utama

**Pemilik arsip pribadi:** menikmati berbagai media dan hobi, membutuhkan pencatatan cepat, refleksi personal, serta kemampuan memindahkan data ke platform lain.

Penggunaan awal adalah satu pengguna. Model data tetap memberi batas kepemilikan agar penambahan akun kelak tidak memerlukan perubahan fundamental.

### 4.2 Asumsi perencanaan

| Aspek | Asumsi awal |
|---|---|
| Perangkat | Ponsel dan desktop melalui web responsif |
| Bahasa antarmuka | Bahasa Indonesia; judul asli dan Unicode tetap didukung |
| Privasi | Semua data privat secara default |
| Pola penggunaan | Satu pemilik, beberapa perangkat, tidak ada kolaborasi |
| Hosting | Satu deployment privat; dapat dikelola sendiri atau memakai hosting terkelola |
| Koneksi | Rilis awal memerlukan koneksi ke server aplikasi; API metadata boleh gagal tanpa memblokir input manual |
| Skala awal | 10.000 item, 100.000 catatan aktivitas; benchmark harus memakai ukuran catatan realistis |
| Anggaran | Meminimalkan biaya berulang dan jumlah layanan yang harus dirawat |
| Sumber data utama | Database Personal Tracker, bukan salinan dari platform eksternal |

Asumsi ini harus dikonfirmasi sebelum implementasi. Web responsif bukan berarti dukungan offline penuh.

## 5. Prinsip produk

1. **Universal pada model inti, spesifik pada atribut.** Semua item mempunyai identitas bersama, tetapi progres membaca tidak dipaksakan pada lagu atau hobi.
2. **Manual selalu tersedia.** Penambahan item tidak bergantung pada katalog eksternal.
3. **Data asli tidak diubah demi ekspor.** Pembulatan, pemotongan, atau pemetaan hanya berlaku pada payload tujuan.
4. **Privat dahulu.** Review yang boleh diekspor dipisahkan dari jurnal privat.
5. **Tidak ada kehilangan data diam-diam.** Semua batas pemetaan harus terlihat sebelum pengiriman.
6. **Integrasi dapat gagal secara terpisah.** Gangguan platform lain tidak menghentikan pencatatan lokal di server aplikasi.
7. **Jangan memaksa penyelesaian.** Hobi berkelanjutan dan lagu favorit tidak wajib mempunyai status tamat.
8. **Sederhana sebelum kompleks.** Mulai dari ekspor file yang dapat diuji; tambah sinkronisasi setelah fondasinya stabil.

## 6. Cakupan konten dan struktur kategori

### 6.1 Template bawaan

| Kategori | Contoh atribut | Progres yang relevan |
|---|---|---|
| Manga/manhwa/manhua/komik | Penulis, ilustrator, bahasa, penerbit | Chapter, volume |
| Anime/serial | Studio, kreator, tahun | Episode, season |
| Film | Sutradara, tahun, durasi | Status tonton; posisi menit opsional |
| Novel/buku/web novel | Penulis, edisi, ISBN, bahasa | Halaman, chapter, volume |
| Lagu | Artis, versi rekaman, album, durasi | Sesi dengar opsional; tidak perlu progres selesai |
| Album | Artis, tahun, daftar lagu opsional | Track yang didengar, sesi dengar |
| Game | Pengembang, platform, edisi | Jam bermain, persentase, milestone |
| Podcast | Kreator, seri, episode | Episode dan posisi menit |
| Hobi/aktivitas | Jenis kegiatan, perlengkapan opsional | Durasi sesi, frekuensi, target opsional |
| Custom | Field buatan pengguna | Angka, durasi, milestone, atau tanpa progres |

### 6.2 Aturan pemodelan

- Satu item mempunyai satu tipe utama dan banyak tag. Genre bukan tipe item.
- Tipe custom minimal mendukung field teks, angka, tanggal, boolean, pilihan tunggal, dan URL.
- Perubahan definisi field tidak boleh menghapus nilai lama tanpa konfirmasi dan migrasi.
- Relasi antaritem mempunyai jenis: bagian-dari, adaptasi-dari, sekuel, prekuel, versi, atau terkait.
- Novel dan adaptasi manhwa-nya adalah item berbeda, dengan progres serta rating terpisah.
- Edisi buku, versi lagu, dan season serial dapat dipisah bila mempunyai identitas atau pengalaman yang berbeda.
- Detail episode/chapter tidak wajib dibuat sebagai ribuan item. Progres numerik harus cukup untuk penggunaan umum.
- Item tanpa ID eksternal tetap merupakan item yang sah.
- Dukungan kategori universal tidak berarti setiap kategori memiliki konektor ekspor khusus pada rilis awal.

## 7. Skenario penggunaan utama

### US-01 — Menyimpan karya yang baru ditemukan

Sebagai pengguna, saya ingin menambah manhwa dari judul atau URL agar tidak lupa membacanya nanti.

**Hasil:** item masuk ke perpustakaan dengan status Rencana, metadata opsional, serta sumber tautan.

### US-02 — Memperbarui progres cepat

Sebagai pembaca, saya ingin menaikkan chapter atau episode dari daftar tanpa membuka formulir panjang.

**Hasil:** progres dan aktivitas tersimpan satu kali, dengan waktu perubahan dan opsi membatalkan aksi terakhir.

### US-03 — Mencatat kesan, bukan hanya angka

Sebagai pengguna, saya ingin menulis kesan singkat, review panjang, dan jurnal privat yang terpisah.

**Hasil:** saya dapat mengekspor review yang dipilih tanpa membocorkan jurnal pribadi.

### US-04 — Melacak pengalaman berulang

Sebagai penonton, saya ingin mencatat menonton ulang film dengan tanggal dan penilaian berbeda.

**Hasil:** riwayat lama tetap ada; penilaian terbaru dapat ditetapkan sebagai rating utama.

### US-05 — Mencatat lagu dan hobi

Sebagai pengguna, saya ingin menyimpan lagu favorit dan sesi bermain gitar tanpa dipaksa mengisi chapter atau status tamat.

**Hasil:** lagu mempunyai rating/kesan; hobi mempunyai sesi, durasi, dan refleksi.

### US-06 — Mengirim data ke platform khusus

Sebagai pengguna, saya ingin memilih Letterboxd atau MAL dan melihat data mana yang dapat dipindahkan.

**Hasil:** tersedia preview, kecocokan ID, konversi rating, peringatan kehilangan field, dan hasil per item.

### US-07 — Memindahkan seluruh arsip

Sebagai pemilik data, saya ingin mengunduh backup lengkap dan memulihkannya pada instalasi baru.

**Hasil:** item, relasi, aktivitas, rating, review, kategori custom, dan lampiran dapat dipulihkan tanpa ketergantungan pada layanan metadata.

## 8. Prioritas dan definisi rilis

- **P0:** wajib agar rilis inti layak dipakai.
- **P1:** pengembangan berikutnya setelah rilis inti stabil.
- **P2:** peningkatan opsional, bergantung kebutuhan nyata.

| Area | P0 — Rilis inti | P1 — Integrasi lanjutan | P2 — Pengayaan |
|---|---|---|---|
| Koleksi | Semua template, input manual, field custom dasar | Penggabungan duplikat terpandu | Template komunitas |
| Progres | Unit dasar, status, histori, sesi hobi | Milestone dan log nonlinier terperinci | Timer dan otomasi tambahan |
| Penilaian | Rating utama, kesan, review, jurnal privat | Dimensi rating per kategori | Preset penilaian lanjutan |
| Organisasi | Cari, filter, sort, tag, koleksi | Filter tersimpan, smart collection | Tampilan eksplorasi lanjutan |
| Metadata | Manual, ID/URL eksternal | Pencarian dari provider prioritas | Provider tambahan |
| Portabilitas | Backup/restore native, CSV generik, ekspor Letterboxd | MAL XML tervalidasi, impor platform | Format tambahan |
| Sinkronisasi | Belum ada sinkronisasi otomatis | MAL satu arah dengan OAuth | AniList/Trakt dan dua arah selektif |
| IMDb | Tautan, ID, ekspor arsip generik ber-ID | Adapter impor jika alur tujuan lulus verifikasi | Sinkronisasi jika akses resmi tersedia |
| Musik | Pencatatan lagu/album manual | Metadata musik | Scrobbling atau konektor musik |
| Analitik | Ringkasan sederhana | Tren, target, kalender | Rekap tahunan yang dapat dibagikan |
| Platform | Web responsif, single-owner | PWA, backup terjadwal | Offline penuh atau aplikasi native |

**MVP pada dokumen ini berarti P0.** MVP belum memenuhi visi sinkronisasi semua platform. P1 diprioritaskan untuk membuktikan alur “catat sekali, kirim ke platform lain” melalui MAL.

## 9. Kebutuhan fungsional

### 9.1 Akses dan pengaturan

| ID | Prioritas | Kebutuhan |
|---|---|---|
| ACC-01 | P0 | Deployment yang dapat diakses melalui jaringan harus mempunyai autentikasi dan menolak akses data tanpa sesi sah. |
| ACC-02 | P0 | Pengguna dapat mengatur bahasa, zona waktu, skala tampilan rating, dan tampilan default. |
| ACC-03 | P0 | Tidak ada registrasi publik pada deployment single-owner. |
| ACC-04 | P1 | Pengguna dapat menghubungkan/memutus akun eksternal serta melihat izin dan status koneksinya. |
| ACC-05 | P0 | Pengguna dapat mengekspor semua data dan menghapus arsipnya melalui konfirmasi yang jelas. |

### 9.2 Perpustakaan universal

| ID | Prioritas | Kebutuhan |
|---|---|---|
| LIB-01 | P0 | Tambah, lihat, ubah, arsipkan, pulihkan, dan hapus item. |
| LIB-02 | P0 | Penambahan manual hanya mewajibkan judul dan tipe. |
| LIB-03 | P0 | Simpan judul asli, alternatif, kreator, deskripsi, tahun, bahasa, cover opsional, tag, dan tautan sumber. |
| LIB-04 | P0 | Pengguna dapat membuat tipe custom dengan field bertipe dan konfigurasi unit progres. |
| LIB-05 | P0 | Simpan beberapa identitas eksternal yang dibedakan berdasarkan provider dan jenis entitas. |
| LIB-06 | P0 | Peringatkan duplikat berdasarkan ID eksternal sama; kemiripan judul hanya saran, bukan bukti. |
| LIB-07 | P0 | Hubungkan adaptasi, bagian, sekuel, dan versi tanpa menyatukan progresnya. |
| LIB-08 | P0 | Bedakan status rilis karya dengan status konsumsi pengguna. |
| LIB-09 | P1 | Cari metadata melalui provider; tampilkan sumber dan izinkan koreksi manual. |
| LIB-10 | P1 | Refresh metadata tidak menimpa field yang dikunci pengguna atau catatan personal. |
| LIB-11 | P1 | Gabungkan duplikat dengan preview konflik, pemindahan relasi, dan audit hasil. |

### 9.3 Status, progres, dan pengalaman berulang

Status konsumsi inti: **Rencana, Sedang dijalani, Ditunda, Selesai, Dihentikan, Tidak berlaku**. Label menyesuaikan tipe: sedang dibaca, ditonton, didengar, dimainkan, atau ditekuni.

Status publikasi karya seperti ongoing/completed/hiatus disimpan terpisah. Menyelesaikan chapter yang tersedia tidak otomatis berarti seluruh karya sudah tamat.

| ID | Prioritas | Kebutuhan |
|---|---|---|
| PRO-01 | P0 | Mendukung progres chapter, volume, episode, halaman, menit/jam, persentase, dan unit custom. |
| PRO-02 | P0 | Total boleh tidak diketahui. Nilai tidak diketahui harus berbeda dari nol. |
| PRO-03 | P0 | Mendukung beberapa dimensi pada item yang sama, misalnya chapter dan volume; keduanya tidak dianggap setara otomatis. |
| PRO-04 | P0 | Tombol tambah progres dan input langsung tersedia; angka tidak boleh negatif. |
| PRO-05 | P0 | Progres dapat dikoreksi turun dengan histori; koreksi tidak dihitung sebagai konsumsi baru. |
| PRO-06 | P0 | Chapter pecahan seperti 12.5 diterima untuk unit yang mendukung desimal. |
| PRO-07 | P0 | Bila progres melampaui total yang diketahui, minta keputusan: koreksi total, simpan dengan peringatan, atau batal. |
| PRO-08 | P0 | Pengguna mengonfirmasi status Selesai; perubahan progres tidak diam-diam mengakhiri hobi atau serial ongoing. |
| PRO-09 | P0 | Catat tanggal mulai/selesai bila diketahui; pengguna tidak dipaksa mengarang tanggal. |
| PRO-10 | P0 | Pengalaman ulang membuat siklus baru dan mempertahankan histori siklus sebelumnya. |
| PRO-11 | P0 | Sesi hobi mempunyai tanggal, durasi opsional, hasil/kesan, dan relasi ke item hobi. |
| PRO-12 | P1 | Mendukung milestone atau unit nonlinier, misalnya chapter yang dibaca melompat. |

### 9.4 Rating, kesan, dan jurnal

| ID | Prioritas | Kebutuhan |
|---|---|---|
| REV-01 | P0 | Rating opsional, disimpan sebagai integer 0–100; belum dinilai disimpan sebagai null, bukan nol. |
| REV-02 | P0 | Tampilan dapat berupa 0–10 atau 0–5 tanpa mengubah nilai kanonis. |
| REV-03 | P0 | Pisahkan kesan singkat, review yang dapat dipilih untuk ekspor, dan jurnal privat. |
| REV-04 | P0 | Simpan riwayat revisi rating dan review. Rating utama dipilih eksplisit; nilai histori tidak hilang. |
| REV-05 | P0 | Review dapat terkait item secara keseluruhan atau pengalaman/sesi tertentu. |
| REV-06 | P0 | Dukung penanda spoiler. Bila tujuan tidak dapat menjaga penanda tersebut, beri peringatan sebelum ekspor. |
| REV-07 | P0 | Teks mendukung Unicode, paragraf, dan tautan; rendering wajib disanitasi. |
| REV-08 | P0 | Favorit terpisah dari rating dan status selesai. |
| REV-09 | P1 | Dimensi penilaian per tipe, misalnya cerita, visual, karakter, musik, dan replay value. |

Rating multidimensi tidak otomatis mengganti rating utama. Bila kelak tersedia agregasi, bobot dan rumusnya harus terlihat dan dapat dinonaktifkan.

### 9.5 Organisasi dan pencarian

| ID | Prioritas | Kebutuhan |
|---|---|---|
| ORG-01 | P0 | Tampilan daftar dan grid; filter berdasarkan tipe, status, tag, koleksi, favorit, rating, dan tanggal. |
| ORG-02 | P0 | Pencarian judul utama/alternatif, kreator, dan catatan milik pengguna. |
| ORG-03 | P0 | Sorting judul, rating, tanggal ditambah, aktivitas terakhir, dan tanggal selesai. |
| ORG-04 | P0 | Koleksi manual dapat berisi campuran tipe, misalnya “Favorit 2026” atau “Sedang ingin dicoba”. |
| ORG-05 | P0 | Edit massal tag, koleksi, dan status dengan preview jumlah item serta konfirmasi. |
| ORG-06 | P1 | Filter tersimpan dan smart collection berbasis aturan. |

### 9.6 Dashboard dan statistik

P0 menampilkan item yang sedang dijalani, aktivitas terakhir, jumlah item per tipe/status, dan daftar favorit. P1 menambahkan kalender aktivitas, target opsional, distribusi rating, serta tren bulanan/tahunan.

Aturan perhitungan:

- Jumlah judul unik dipisahkan dari jumlah pengalaman ulang dan jumlah sesi.
- Jam aktual dicatat pengguna; estimasi dari durasi metadata harus dilabeli sebagai estimasi.
- Halaman, chapter, episode, dan jam tidak dijumlahkan sebagai satu angka “progres total”.
- Rata-rata lintas tipe harus diberi konteks dan dapat difilter per tipe.
- Tanggal aktivitas memakai zona waktu pengguna. Item tanpa tanggal tidak diberi tanggal palsu.
- Hapus/koreksi aktivitas memperbarui agregasi; statistik tidak boleh menghitung event koreksi sebagai konsumsi tambahan.

## 10. Strategi integrasi dan ekspor

### 10.1 Tingkatan kemampuan

| Tingkat | Arti yang boleh ditampilkan produk |
|---|---|
| Arsip | File dapat diunduh dan dipakai di luar aplikasi; belum tentu diterima platform tertentu. |
| Ekspor kompatibel | File mengikuti format tujuan yang telah diuji; pengguna masih mengimpor di situs tujuan. |
| Impor terbantu | Aplikasi menyiapkan file dan petunjuk, lalu membuka halaman impor; konfirmasi tetap di platform tujuan. |
| Sinkronisasi langsung | API resmi mengirim perubahan setelah akun dihubungkan dan izin diberikan. |
| Sinkronisasi dua arah | Membaca dan menulis perubahan di kedua sisi dengan resolusi konflik. |

Label “berhasil diekspor” berarti file berhasil dibuat. Label itu **tidak boleh** menyatakan data sudah masuk ke akun tujuan. Tanpa API/konfirmasi eksternal, status penerimaan tujuan harus “belum diverifikasi”.

### 10.2 Matriks konektor

| Tujuan | Jenis yang relevan | Strategi | Status perencanaan/batas |
|---|---|---|---|
| Native JSON/ZIP | Semua | Backup dan restore dengan schema version | P0; format utama tanpa kehilangan semantik |
| CSV generik | Semua | Ekspor tabular dan kolom custom | P0; bukan pengganti backup penuh |
| Letterboxd | Film yang tersedia pada katalog tujuan | CSV resmi + impor terbantu | P0; bukan sinkronisasi langsung |
| MyAnimeList | Anime; manga/manhwa/manhua/novel yang ada di katalog MAL | XML setelah uji format; API resmi untuk list status | P1; perlu MAL ID, OAuth untuk API, dan validasi cakupan field |
| IMDb | Film, serial, episode yang tersedia | ID/tautan dan arsip; adapter importer bila terbukti kompatibel | P1 discovery; tidak menjanjikan write API umum |
| AniList | Anime dan manga yang ada di katalog tujuan | API resmi setelah proof of concept | P2; bukan komitmen rilis awal |
| Trakt | Film dan serial | API resmi setelah verifikasi akses dan izin | P2 |
| Layanan buku | Buku/novel yang didukung masing-masing layanan | File atau API hanya jika tersedia dan diizinkan | P2; dievaluasi per layanan |
| Spotify/Last.fm/layanan musik | Track, album, atau aktivitas dengar sesuai layanan | Metadata, favorit, playlist, atau scrobble sesuai API | P2; jangan menyamakan scrobble dengan rating/review |
| Kategori custom/hobi | Sesuai definisi pengguna | Native, CSV, Markdown opsional | Tidak diasumsikan mempunyai platform tujuan |

### 10.3 Catatan verifikasi platform

**Letterboxd:** dokumentasi resmi mendukung CSV dengan identitas film, rating, tanggal tonton, review, tag, dan rewatch. Dokumentasi juga menyebut batas file 1 MB dan penggabungan entri film yang sama pada tanggal tonton yang sama. Adapter wajib mempunyai contract test terhadap format dan perilaku ini. Akses API langsung tidak diasumsikan tersedia.

**MAL:** API v2 resmi menyediakan update anime/manga list status, skor, progres, tag, dan comments. Comments tidak boleh dipasarkan sebagai review publik MAL. Kemampuan mengirim tanggal, review publik, atau field tambahan harus diverifikasi per endpoint/format; field yang tidak didukung tidak dikirim. XML harus diuji terhadap importer yang sebenarnya sebelum diberi label kompatibel.

**IMDb:** pencarian menemukan halaman resmi Labs “Import Your Watch History” yang menyebut JSON/CSV/ZIP, tetapi isi/alur login dan skema tidak berhasil diverifikasi penuh dalam penyusunan PRD. Karena itu, jangan menyatakan IMDb pasti tidak memiliki importer, dan jangan menjanjikan bahwa CSV generik pasti diterima. Lakukan spike untuk memverifikasi ketersediaan akun, format, field, dan hasil impor sebelum menetapkan dukungan.

### 10.4 Identitas dan pencocokan

Urutan pencocokan:

1. ID tujuan yang sudah tersimpan dan sesuai jenis entitas.
2. Cross-reference resmi yang dapat diverifikasi.
3. Kandidat berdasarkan judul alternatif, tahun, kreator, format, dan durasi.
4. Konfirmasi pengguna untuk hasil ambigu.

Aturan wajib:

- Jangan auto-match hanya karena judul sama.
- Tampilkan thumbnail, tahun, tipe, kreator, dan URL kandidat.
- Pisahkan ID film, serial, season, dan episode walau berasal dari provider yang sama.
- Bedakan track asli, live, cover, dan remaster untuk konektor musik kelak.
- Match yang belum terkonfirmasi tidak boleh digunakan untuk pengiriman otomatis.
- Item yang tidak ditemukan tetap berada di arsip dan muncul sebagai “tidak terpetakan”.

### 10.5 Pemetaan rating

Nilai kanonis: `rating_100`, integer 0–100; `null` berarti belum dinilai.

| Tujuan | Pemetaan awal | Konsekuensi |
|---|---|---|
| Letterboxd | Rating valid 0.5–5, kelipatan 0.5; ekuivalen integer 1–10 | Presisi dapat berkurang |
| MAL | Skor valid pengguna 1–10; 0 dipakai sebagai belum dinilai | Rating kanonis 0 tidak boleh dianggap sama dengan belum dinilai |
| IMDb | Siapkan pemetaan 1–10 hanya bila alur tujuan terverifikasi | Belum mengasumsikan field dapat dikirim |
| Native | Simpan nilai persis, termasuk null dan 0 | Tidak ada pembulatan |

Kebijakan default untuk nilai yang dapat direpresentasikan: pembulatan terdekat, tie ke atas. Contoh 87 menjadi 9/10 atau 4.5/5. Preview harus menampilkan 8.7/10 asli dan nilai tujuan.

Nilai yang berada di luar rentang tujuan, termasuk 0 yang merupakan rating sah lokal, tidak boleh diam-diam diubah menjadi kosong atau nilai minimum. Pengguna memilih: lewati field rating, gunakan minimum secara eksplisit, atau batal. Nilai asli tidak berubah.

### 10.6 Pemetaan status dan progres

- Rencana menjadi `plan_to_watch`/`plan_to_read` pada MAL sesuai tipe.
- Sedang dijalani menjadi `watching`/`reading`.
- Ditunda menjadi `on_hold`; Selesai menjadi `completed`; Dihentikan menjadi `dropped`.
- Tidak berlaku tidak dikirim ke field status tujuan yang tidak mempunyai padanan.
- Chapter pecahan tidak boleh dikirim ke field integer tanpa konfirmasi pembulatan atau penghilangan field.
- Posisi menit film tidak dianggap sebagai episode; jam bermain tidak dianggap sebagai persentase.
- Jumlah total/progres mengikuti cakupan entitas tujuan, bukan otomatis seluruh franchise.
- Ekspor ke profil watched Letterboxd hanya mencakup item yang benar-benar dipilih sebagai sudah ditonton. Item Rencana diarahkan ke alur watchlist terpisah; jangan menandainya watched.

### 10.7 Alur ekspor file

1. Pilih tujuan, koleksi/filter, dan cakupan pengalaman.
2. Sistem menyaring tipe yang relevan dan menjelaskan item yang tidak didukung.
3. Validasi ID, status, rating, tanggal, serta review yang diizinkan.
4. Tampilkan preview per item, ringkasan konversi, dan field yang akan hilang.
5. Pengguna memperbaiki match dan memilih field yang ingin dikirim.
6. Tampilkan konfirmasi khusus bila review atau teks berpotensi publik akan disertakan.
7. Buat file dan laporan hasil, termasuk item terlewati beserta alasannya.
8. Tampilkan instruksi impor dan tautan tujuan bila tersedia.

Jurnal privat selalu dikecualikan dari ekspor platform. Review juga default tidak disertakan sampai pengguna mengaktifkannya. Backup native secara eksplisit mencakup data privat dan harus diberi peringatan bahwa file berisi seluruh arsip.

### 10.8 Sinkronisasi API — P1

- Default satu arah: Personal Tracker ke tujuan, setelah persetujuan per konektor dan jenis field.
- First sync menampilkan perbandingan nilai lokal dan remote; jangan langsung menimpa data remote.
- Setelah opt-in, perubahan terpilih masuk antrean di background; progres lokal sudah tersimpan sebelum pengiriman.
- Payload hanya mengirim field yang disetujui. Field kosong lokal tidak otomatis menghapus nilai remote.
- Setiap operasi mempunyai ID dan jejak versi sumber; konektor mengutamakan update idempoten, bukan penambahan duplikat.
- Simpan snapshot terakhir yang berhasil dan remote version bila tersedia. Perubahan remote sejak snapshot memicu konflik, bukan overwrite buta.
- Bila tujuan tidak menyediakan versi/ETag, lakukan read-before-write; jelaskan bahwa jaminan bebas race tidak penuh. Jangan memasarkan sinkronisasi sebagai atomik lintas platform.
- Pilihan konflik: gunakan lokal, gunakan remote sebagai pembaruan lokal yang dikonfirmasi, atau lewati. Dua arah otomatis ditunda ke P2.
- Menghapus item lokal tidak otomatis menghapus item remote. Penghapusan remote membutuhkan alur terpisah dan konfirmasi khusus.
- Respons 429 mengikuti `Retry-After` bila tersedia; timeout/5xx memakai exponential backoff dengan jitter dan batas percobaan.
- Token kedaluwarsa memicu refresh yang aman atau permintaan login ulang; 400/403 tidak diulang tanpa koreksi.
- Status pekerjaan: queued, running, succeeded, failed, needs_action, cancelled; hasil disimpan per item.
- Batalkan pekerjaan menghentikan operasi yang belum dikirim. Operasi remote yang sudah selesai mungkin tidak dapat dibatalkan.
- Kegagalan sebagian tidak mengulang item sukses secara membabi buta. Pengguna dapat mencoba ulang item gagal.

### 10.9 Kontrak minimum adapter

Setiap adapter mendeklarasikan:

- Jenis entitas dan operasi yang didukung.
- Field yang dapat dibaca/ditulis dan risiko publikasinya.
- Rentang rating, status, progres, tanggal, dan batas ukuran.
- Kebutuhan autentikasi, izin, atribusi, dan rate limit yang diketahui.
- Fungsi validasi, preview, serialisasi, eksekusi bila ada, dan interpretasi hasil.
- Versi skema, tanggal pengujian terakhir, fixture, dan fallback ketika capability berubah.

Tidak ada integrasi yang mengandalkan penyimpanan password platform, cookie sesi hasil salinan, bypass CAPTCHA, atau otomasi browser yang melanggar ketentuan layanan.

## 11. Impor, backup, dan pemulihan

### 11.1 Backup native — P0

Paket ZIP berisi manifest, data JSON berversi, dan lampiran yang memang disimpan aplikasi. Manifest mencatat versi skema, waktu ekspor, jumlah entitas, serta checksum. Cover dari URL eksternal hanya dapat dipulihkan tanpa internet jika salinannya disertakan secara sah; batas ini harus terlihat.

Backup mencakup kategori, field custom, item, identitas, relasi, progres, pengalaman, aktivitas, rating/revisi, review, jurnal, tag, koleksi, dan pengaturan non-rahasia. Token OAuth, password hash, session cookie, serta rahasia server **tidak** disertakan. Akun eksternal harus dihubungkan ulang setelah restore.

Restore wajib menyediakan validasi, dry-run, ringkasan, dan mode jelas: instalasi kosong atau merge berdasarkan ID native. Snapshot database sebelum restore harus tersedia. Jika restore gagal, tidak boleh meninggalkan database setengah terisi. Jangan menimpa deployment berisi data tanpa konfirmasi.

### 11.2 Impor eksternal — P1

- Prioritas awal: CSV generik dengan pemetaan kolom, IMDb CSV yang benar-benar diekspor pengguna, Letterboxd CSV, dan MAL XML.
- Deteksi format tidak menggantikan validasi. Pengguna melihat preview sebelum commit.
- Sediakan mapping tipe, tanggal, skala rating, status, dan field custom.
- Simpan asal file/batch, bukan rahasia atau isi file penuh di log aplikasi.
- Duplikat berdasarkan ID native/ID eksternal dan fingerprint event yang relevan; judul bukan kunci unik.
- Impor ulang fixture yang sama tidak menghasilkan duplikasi item atau aktivitas.
- Nilai konflik tidak ditimpa tanpa kebijakan yang dipilih pengguna.
- Tanggal tidak diketahui tetap kosong; tanggal parsial tidak dipaksa menjadi 1 Januari.
- Hasil akhir menjelaskan jumlah sukses, gagal, duplikat, dan field yang tidak bisa dimasukkan.

### 11.3 Keamanan format

- Parse XML tanpa external entity; batasi ukuran, jumlah record, dan kedalaman.
- Tolak ZIP path traversal, zip bomb, lampiran berbahaya, dan MIME yang tidak diizinkan.
- CSV generik untuk spreadsheet menggunakan mitigasi formula injection untuk sel berbahaya.
- Adapter CSV platform harus diuji agar mitigasi tidak merusak ID atau isi field. Bila keamanan dan kompatibilitas tidak dapat dipenuhi bersamaan, tolak field berisiko dengan penjelasan, bukan ubah diam-diam.
- Serialisasi newline, koma, kutip, emoji, Unicode, dan HTML diuji berdasarkan parser tujuan. Jangan berasumsi semua importer mengikuti dialek CSV yang sama.

## 12. Arsitektur informasi dan perilaku antarmuka

Bagian ini adalah spesifikasi kebutuhan, bukan rancangan visual final.

| Halaman | Tujuan dan informasi utama |
|---|---|
| Dashboard | Lanjutkan aktivitas, ringkasan, item terakhir, status pekerjaan |
| Perpustakaan | Daftar/grid, pencarian, filter, sort, aksi massal |
| Detail item | Identitas, progres, rating, kesan, review, jurnal, pengalaman, relasi, tautan |
| Tambah/edit item | Input cepat dahulu; atribut lanjutan dapat dibuka bila diperlukan |
| Aktivitas/jurnal | Riwayat kronologis dan koreksi aktivitas |
| Koleksi | Pengelompokan lintas kategori |
| Statistik | Ringkasan dan filter periode/tipe |
| Pusat data & integrasi | Impor, ekspor, backup, koneksi akun, pekerjaan, konflik |
| Pengaturan | Kategori, field custom, zona waktu, privasi, akun, tampilan |

Persyaratan interaksi:

- Setelah item ditemukan, penambahan sederhana memerlukan judul, tipe, lalu simpan; atribut lain opsional.
- Update progres dari daftar maksimal dua aksi untuk skenario umum.
- Kesan cepat tidak membutuhkan penyelesaian review panjang.
- Status menyimpan, tersimpan, dan gagal tersimpan harus dapat dibedakan. Jangan menampilkan sukses sebelum server mengonfirmasi.
- Form yang gagal dikirim mempertahankan isian di sesi aktif dan menyediakan retry tanpa duplikasi.
- Sediakan keadaan kosong, loading, tidak ada hasil, offline/server tidak terjangkau, serta provider tidak tersedia.
- Tema terang/gelap dapat disediakan, tetapi tidak mengalahkan aksesibilitas.
- Ekspor tidak menyamarkan tombol “unduh file” sebagai “sinkronkan akun”.

## 13. Model data konseptual

| Entitas | Atribut/relasi utama |
|---|---|
| Owner/User | ID, identitas login, pengaturan, zona waktu |
| ItemType | Nama, template field, unit progres, versi skema |
| CustomFieldDefinition | Tipe nilai, opsi, validasi, status arsip |
| Item | Owner, tipe, judul/alias, metadata, status rilis, timestamps, deleted_at |
| ExternalIdentity | Item, provider, entity_type, external_id, URL, provenance, konfirmasi match |
| ItemRelation | Item asal/tujuan, jenis relasi |
| LibraryEntry | Owner, item, status konsumsi, favorit, rating utama, tanggal ditambah |
| Experience | Siklus membaca/menonton/bermain ulang, tanggal mulai/selesai, status |
| ProgressState | Entry/experience, unit, nilai kini, total opsional, versi |
| Activity | Pengalaman atau hobi, tanggal/waktu, durasi, perubahan progres, jenis event |
| RatingRevision | Entry/experience, nilai 0–100 atau null, waktu, alasan opsional |
| Review | Entry/experience/activity, jenis kesan/review/jurnal, teks, spoiler, revisi |
| Tag/Collection | Owner, nama, anggota; tipe berbeda agar semantiknya jelas |
| Attachment | Owner, storage key, MIME, ukuran, checksum, asal |
| ExternalAccount | Provider, owner, referensi token terenkripsi, izin, status |
| TransferJob/TransferItem | Arah, provider, snapshot, mapping, status, hasil/error per item |
| SyncCheckpoint | Entry, provider, versi lokal, snapshot remote, waktu sukses terakhir |
| ImportBatch | Asal, fingerprint, opsi mapping, laporan hasil |
| AuditEvent | Aktor, jenis perubahan, objek, waktu; tanpa token atau teks privat berlebihan |

### 13.1 Aturan integritas

- Semua data personal terikat owner; otorisasi dilakukan pada server untuk setiap akses.
- Identitas eksternal unik dalam cakupan owner + provider + entity_type + external_id.
- ID internal stabil dan tidak memakai judul sebagai primary key.
- Nilai rating dibatasi 0–100 atau null; histori tidak diganti saat ekspor.
- Unit progres, nilai desimal, dan ketelitian disimpan secara eksplisit; persentase dibatasi 0–100.
- Event aktivitas membedakan konsumsi, koreksi, impor, dan undo.
- Perubahan progres, aktivitas, dan outbox sinkronisasi terkait disimpan dalam transaksi yang sama.
- Concurrent edit memakai version check; perubahan perangkat lain tidak tertimpa diam-diam.
- Instan waktu disimpan sebagai UTC. Tanggal kalender disimpan sebagai date, bukan timestamp palsu.
- Tanggal parsial mempunyai precision terpisah: tahun, bulan, atau tanggal lengkap.
- Hapus lunak selama 30 hari merupakan usulan default; hard delete dan retensi backup harus dijelaskan kepada pengguna.

## 14. Rekomendasi arsitektur teknis

### 14.1 Bentuk sistem

**Modular monolith** untuk mengurangi biaya operasional dan kompleksitas proyek pribadi.

- Aplikasi web responsif dengan modul library, tracking, journaling, taxonomy, portability, dan integrations.
- Database relasional untuk transaksi, relasi, dan pencarian awal.
- JSON/JSONB terbatas untuk metadata serta field custom; status, identitas, rating, dan ownership tetap terstruktur.
- Penyimpanan file lokal terkelola atau object storage untuk lampiran.
- Job persisten di database untuk pekerjaan panjang. P0 dapat memakai worker sederhana; P1 wajib mempunyai pemulihan antrean setelah restart.
- Lapisan adapter memisahkan kemampuan provider dari model inti.
- Database tetap menjadi sumber kebenaran meskipun pencarian atau agregat kelak memakai indeks tambahan.

### 14.2 Pilihan stack yang direkomendasikan

| Komponen | Rekomendasi awal | Alternatif/kapan dipilih |
|---|---|---|
| Bahasa | TypeScript | Sesuaikan kemampuan pemilik proyek |
| Web | Next.js atau framework full-stack setara | React + backend terpisah bila dibutuhkan |
| Database | PostgreSQL | SQLite untuk satu deployment kecil, setelah batas concurrency/backup diterima |
| Akses database | Prisma atau Drizzle | Pilih satu; jangan menambah keduanya |
| Validasi | Skema bersama client/server | Validasi server tetap otoritatif |
| Pencarian | Database full-text + pencarian alias | Mesin pencarian khusus hanya setelah benchmark membuktikan kebutuhan |
| Pengujian | Unit, integration, end-to-end | Framework mengikuti stack final |
| Deployment | Satu layanan aplikasi + database + storage | Container opsional, bukan kebutuhan produk |

Tidak perlu microservices, vector database, Redis, atau layanan AI untuk memenuhi P0. Pemilihan hosting, pustaka autentikasi, dan penyimpanan rahasia dilakukan setelah model deployment disepakati.

### 14.3 Operasional

- Migrasi database berversi, dengan backup sebelum perubahan berisiko.
- Konfigurasi rahasia di secret store/environment server, bukan repository atau bundle browser.
- Health check aplikasi, database, storage, dan worker.
- Log terstruktur dengan correlation ID; metrik durasi job dan kegagalan provider.
- Provider dapat dinonaktifkan melalui feature flag tanpa mematikan aplikasi inti.
- Deploy ulang/restart tidak boleh kehilangan job yang sudah diterima server.

## 15. Kebutuhan nonfungsional

Target berikut harus diuji pada lingkungan referensi yang didokumentasikan, dengan 10.000 item dan 100.000 aktivitas. Durasi provider eksternal diukur terpisah, bukan disembunyikan dalam metrik aplikasi.

| Area | Kriteria penerimaan |
|---|---|
| Respons pencatatan | P95 update progres dan simpan kesan ≤500 ms di server; acknowledgment pengguna ≤1 detik pada jaringan referensi yang ditetapkan |
| Pencarian | P95 pencarian/filter ≤1 detik pada dataset referensi |
| Halaman | Konten utama perpustakaan muncul ≤2,5 detik pada profil perangkat/jaringan yang dicatat dalam laporan uji |
| Transfer besar | Ekspor 10.000 item diproses sebagai job bila melampaui batas request; target selesai ≤60 detik pada lingkungan referensi |
| Ketahanan | Request ulang atau retry job tidak menghasilkan duplikasi pada fixture yang sama |
| Integritas | Tidak ada data inti hilang dalam uji backup/restore; jumlah, ID, relasi, dan checksum attachment cocok |
| Aksesibilitas | Target WCAG 2.2 AA untuk alur utama; navigasi keyboard, label, fokus, dan kontras diuji |
| Responsif | Alur tambah, progres, review, dan ekspor dapat dipakai dari viewport 360 px hingga desktop |
| Isolasi kegagalan | Provider mati tidak memblokir CRUD, pencarian lokal, atau backup native |
| Pemeliharaan | Setiap adapter memiliki fixture, contract test, dan dokumentasi capability |
| Keamanan | Tidak ada temuan kritis/tinggi terbuka pada autentikasi, otorisasi, unggahan, dan ekspor sebelum rilis |

Tidak menjanjikan SLA 24/7 untuk proyek pribadi. P1 menargetkan backup harian dengan RPO maksimal 24 jam dan runbook pemulihan dengan target RTO 4 jam, bergantung hosting yang dipilih. Rilis P0 membutuhkan backup manual yang sudah diuji dan pengingat backup yang terlihat.

## 16. Privasi dan keamanan

- Semua perpustakaan, kesan, dan aktivitas privat secara default. Fitur publik tidak termasuk P0.
- Komunikasi jaringan memakai HTTPS; cookie sesi memakai Secure, HttpOnly, dan kebijakan SameSite yang sesuai.
- Autentikasi memakai mekanisme/pustaka yang terawat; jangan membangun kriptografi sendiri.
- Token provider disimpan terenkripsi di server; key terpisah dari database. Rotasi dan pencabutan token didukung.
- OAuth memakai flow resmi provider dan PKCE bila diwajibkan/didukung; periksa state dan redirect URI.
- Sanitasi Markdown/HTML; cegah XSS, CSRF, SQL injection, dan akses lintas owner.
- Fetch cover/metadata dari URL harus mencegah SSRF, akses jaringan internal, redirect berbahaya, serta ukuran unduhan berlebih.
- Unggahan dibatasi ukuran dan MIME, diperiksa isinya, dan tidak dieksekusi sebagai kode.
- Log tidak menyimpan token, password, isi jurnal, atau file backup penuh.
- Backup mengandung data sensitif. Backup server harus terenkripsi saat disimpan; unduhan manual diberi peringatan jika tidak dienkripsi oleh aplikasi.
- Memutus koneksi mencabut token bila provider mendukung, menghapus token lokal, dan membatalkan job yang belum dijalankan.
- Hapus permanen menjelaskan dampak pada database aktif, lampiran, remote, dan backup. Backup lama tidak diklaim langsung bersih; usulan retensi maksimal 30 hari setelah penerapan backup terjadwal.
- Metadata dan cover mengikuti lisensi, atribusi, cache policy, dan ketentuan layanan masing-masing provider.
- Penyimpanan cover bukan izin mendistribusikan media penuh.

## 17. Edge case wajib

| Kasus | Perilaku yang diharapkan |
|---|---|
| Judul sama, karya berbeda | Tampilkan kandidat; minta konfirmasi |
| Judul Unicode/alias lintas bahasa | Simpan persis; pencarian mencakup alias |
| Item tidak ada di provider | Tetap dapat digunakan; ekspor tujuan ditandai tidak terpetakan |
| Total chapter tidak diketahui | Progres tetap sah; jangan menampilkan persentase palsu |
| Chapter pecahan ke MAL | Peringatan kehilangan presisi; keputusan pengguna |
| Rating 0 atau belum dinilai | Dibedakan; nilai 0 tidak dikirim sebagai “unrated” diam-diam |
| Film ditonton dua kali sehari | Dua pengalaman lokal tetap ada; peringatan bahwa importer Letterboxd dapat menggabungkannya |
| Review panjang/HTML tidak didukung | Preview transformasi; jangan memotong tanpa persetujuan |
| Spoiler tidak terlindungi di tujuan | Peringatan dan opsi tidak menyertakan review |
| Lagu live dan studio | Item/identitas berbeda bila pengguna menghendaki |
| Hobi tanpa tanggal selesai | Tetap aktif atau Tidak berlaku; tidak dipaksa tamat |
| Dua perangkat mengedit bersamaan | Deteksi versi dan tampilkan konflik |
| Timeout setelah remote sebenarnya berhasil | Periksa keadaan remote sebelum retry yang dapat menggandakan data |
| API mengubah format/izin | Adapter dinonaktifkan atau needs_action; data inti tidak terpengaruh |
| File rusak atau impor berulang | Validasi gagal tanpa partial commit; impor ulang tidak menduplikasi data |
| Item dihapus ketika job antre | Job memeriksa versi/keberadaan dan melewati item yang tidak lagi layak dikirim |
| Tanggal hanya tahun | Tetap parsial; jangan membuat diary date palsu |
| Pengguna offline | Tampilkan belum tersimpan; pertahankan isian aktif, jangan mengklaim offline sync |

## 18. Kriteria penerimaan lintas fitur

### AC-01 — Semua kategori dapat dicatat

**Given** pengguna tidak menghubungkan provider mana pun, **when** menambah manhwa, film, lagu, hobi, dan tipe custom, **then** setiap item dapat disimpan, ditemukan, diberi kesan/rating, serta dimasukkan ke koleksi tanpa field yang tidak relevan menjadi wajib.

### AC-02 — Progres dan koreksi dapat dipercaya

**Given** chapter terakhir 20, **when** pengguna menambah ke 21 lalu mengoreksi ke 19, **then** nilai kini 19, histori perubahan terlihat, dan statistik tidak menghitung koreksi sebagai chapter tambahan.

### AC-03 — Pengalaman ulang tidak merusak histori

**Given** sebuah film pernah ditonton dan diberi rating, **when** pengguna membuat pengalaman ulang, **then** tanggal/rating lama tetap tersedia dan perubahan rating utama membutuhkan tindakan yang jelas.

### AC-04 — Ekspor Letterboxd kompatibel

**Given** item film dengan ID valid, tanggal, dan rating, **when** file diekspor, **then** fixture dapat diparse serta diuji melalui importer tujuan, nilai rating sesuai preview, dan review privat tidak muncul. File dibagi menjadi bagian yang memenuhi batas ukuran tujuan.

### AC-05 — Rencana tidak berubah menjadi watched

**Given** film berstatus Rencana, **when** pengguna mengekspor ke Letterboxd, **then** film tidak masuk alur watched tanpa persetujuan; produk menawarkan alur watchlist yang sesuai.

### AC-06 — Hasil transfer jujur

**Given** hanya file berhasil dibuat, **then** aplikasi menyatakan file siap diunduh dan tidak mengklaim akun tujuan sudah diperbarui.

### AC-07 — Backup benar-benar dapat dipulihkan

**Given** dataset referensi berisi tipe custom, relasi, tanggal parsial, jurnal, revisi, dan attachment, **when** backup di-restore ke instalasi kosong, **then** perbandingan ID, nilai, relasi, dan checksum tidak menunjukkan kehilangan data inti.

### AC-08 — Impor ulang aman

**Given** file yang sama sudah pernah diimpor, **when** diimpor ulang dengan opsi sama, **then** tidak ada item atau event duplikat dan laporan menjelaskan record yang dilewati.

### AC-09 — Gagal API tidak menggagalkan pencatatan

**Given** provider mengembalikan 429 atau 5xx, **when** pengguna mengubah progres, **then** perubahan lokal tetap tersimpan, job menunjukkan status yang benar, dan retry tidak menggandakan operasi.

### AC-10 — Tidak ada kebocoran jurnal

**Given** item mempunyai review dan jurnal privat, **when** pengguna mengekspor ke provider, **then** jurnal tidak disertakan dalam file, request, atau log; penyertaan review memerlukan pilihan eksplisit.

### AC-11 — Konflik tidak menimpa diam-diam

**Given** perubahan dari perangkat lain atau remote terdeteksi, **when** operasi berikutnya dijalankan, **then** pengguna menerima konflik/needs_action dan dapat memilih resolusi tanpa kehilangan snapshot sebelumnya.

## 19. Strategi pengujian dan definisi selesai

### 19.1 Jenis pengujian

- **Unit:** konversi rating, status, progres, tanggal parsial, deduplikasi, dan kebijakan field privat.
- **Integration:** transaksi database, ownership, restore rollback, job lease/retry, serta storage attachment.
- **Contract:** serializer/parser tiap adapter, fixture resmi, dan perubahan capability provider.
- **End-to-end:** tambah item, update progres, kesan, koleksi, ekspor, backup, restore, dan konflik.
- **Keamanan:** unggahan, formula injection, XXE, ZIP traversal, SSRF, XSS, CSRF, dan akses tanpa izin.
- **Performa:** benchmark dataset referensi beserta profil deployment/jaringan.
- **Manual terarah:** perangkat seluler, akses keyboard, metadata ambigu, dan importer tujuan sebenarnya.

### 19.2 Definition of Done

Sebuah fitur selesai jika acceptance criteria lulus, test relevan tersedia, migrasi terdokumentasi, tidak ada kebocoran data privat, keadaan gagal/empty/loading tertangani, serta dokumentasi penggunaan diperbarui.

Sebuah konektor selesai jika proof of concept berhasil pada akun uji yang diizinkan, pemetaan serta field yang tidak didukung terdokumentasi, contract test lulus, dan hasil remote/file diverifikasi. Adanya kode serializer saja belum cukup.

## 20. Metrik keberhasilan

Metrik dihitung dari event lokal atau telemetry opt-in; jurnal dan isi review tidak dikirim sebagai analitik.

| Metrik | Target awal |
|---|---|
| Time to first entry | Median ≤2 menit sejak pengguna masuk pertama kali |
| Update progres | Median ≤10 detik dari membuka daftar yang relevan sampai tersimpan |
| Keberhasilan pencatatan | ≥99% request valid pada lingkungan operasi, di luar pembatalan pengguna |
| Integritas backup | 100% entitas inti dan attachment milik aplikasi cocok pada pengujian round-trip |
| Kualitas ekspor | 100% record yang dikirim lolos validator adapter; kecocokan metadata ambigu dikonfirmasi pengguna |
| Visibilitas kehilangan field | 100% transformasi lossy dan field yang tidak didukung ditampilkan dalam preview/laporan |
| Kebocoran data privat | Nol jurnal privat pada ekspor platform dan log |
| Nilai penggunaan | Pemilik memakai produk untuk pencatatan nyata selama minimal 4 minggu dan memilihnya sebagai arsip utama |

Untuk satu pengguna, keberhasilan lebih bermakna diukur melalui kecepatan, keandalan, dan pemakaian rutin daripada metrik pertumbuhan pengguna.

## 21. Roadmap dan dependensi

Estimasi berikut adalah rentang kerja untuk satu pengembang full-stack berpengalaman, bekerja fokus. Bukan komitmen tanggal. Persetujuan API, biaya, bug importer, dan perubahan kebutuhan dapat menambah waktu.

| Tahap | Hasil | Dependensi | Estimasi |
|---|---|---|---|
| 0. Validasi | Konfirmasi scope, deployment, skema, fixture, dan spike Letterboxd/MAL/IMDb | Akses akun uji dan dokumentasi | 1–2 minggu |
| 1. Fondasi | Autentikasi, database, ownership, migrasi, storage, CI/test dasar | Keputusan stack | 1–2 minggu |
| 2. Tracker inti | Template, custom type, CRUD, progres, pengalaman, rating, jurnal | Fondasi | 3–4 minggu |
| 3. Organisasi & portabilitas | Cari/filter, koleksi, dashboard, native backup/restore, CSV | Model inti stabil | 2–3 minggu |
| 4. Ekspor & hardening | Letterboxd teruji, preview, laporan, keamanan, aksesibilitas, benchmark | Fixture dan akun uji | 2–3 minggu |
| 5. Integrasi P1 | MAL OAuth, antrean, snapshot, konflik, impor prioritas, backup terjadwal | P0 stabil dan akses API | 3–5 minggu |

Perkiraan P0: **9–14 minggu kerja fokus**, sebelum buffer. Tambahkan buffer risiko 20–30% untuk perencanaan. P1 dipilih berdasarkan kebutuhan, bukan otomatis menambah semua fitur sekaligus.

Urutan dependensi penting: model data dan privasi lebih dahulu; backup sebelum bulk import; validasi identitas sebelum sinkronisasi; antrean dan idempotensi sebelum auto-sync.

## 22. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Cakupan “semua” menjadi terlalu besar | Produk tidak selesai | Universal pada model inti, adapter dan fitur khusus bertahap |
| API tidak tersedia/ditolak | Sinkronisasi tertunda | Ekspor file, manual fallback, capability flag |
| Match karya salah | Rating/progres masuk ke karya lain | ID terverifikasi, kandidat jelas, konfirmasi ambiguitas |
| Format tujuan kehilangan detail | Arsip terdistorsi | Nilai asli dipertahankan, preview lossy, backup native |
| Jurnal terkirim ke publik | Kebocoran privasi | Jenis teks terpisah, allowlist payload, test otomatis |
| Konflik atau retry menggandakan data | Histori tidak dapat dipercaya | Version check, snapshot, idempotensi, read-before-retry |
| Schema custom terlalu fleksibel | Query dan migrasi rumit | Batasi jenis field awal; inti tetap relasional |
| Integrasi memakan waktu pemeliharaan | Proyek pribadi terbengkalai | Sedikit konektor prioritas, kontrak adapter, feature flag |
| Data hilang saat deploy/migrasi | Kehilangan arsip | Backup, restore drill, migrasi terversi |
| Biaya provider/storage | Biaya berulang meningkat | Input manual, batas cache/lampiran, budget alert bila tersedia |
| Ketergantungan lisensi metadata | Pembatasan distribusi | Catat sumber, atribusi, verifikasi lisensi sebelum rilis |

## 23. Gate rilis

### P0 boleh dirilis jika

- Seluruh kebutuhan P0 dan AC yang relevan lulus.
- Film, komik, lagu, hobi, dan custom type berhasil dipakai tanpa provider.
- Backup/restore sudah diuji pada instalasi kosong dan kondisi gagal.
- Ekspor Letterboxd telah diuji end-to-end; bila akses pengujian belum tersedia, fitur tetap berlabel eksperimental dan rilis tidak diklaim memenuhi dukungan Letterboxd penuh.
- Tidak ada bug kritis kehilangan data atau kebocoran privasi.
- Autentikasi, keamanan file, aksesibilitas alur utama, dan benchmark diselesaikan.
- Panduan instalasi, backup, restore, dan batas dukungan tersedia.

### P1 sinkronisasi boleh diaktifkan jika

- Koneksi resmi provider dan izin yang diperlukan berfungsi.
- First-sync preview, snapshot, konflik, rate limit, retry, dan disconnect telah diuji.
- Review/comment publik dan privat dibedakan berdasarkan perilaku nyata provider.
- Penghapusan remote tidak terjadi otomatis.
- Ada cara menghentikan antrean serta memeriksa hasil per item.

## 24. Keputusan yang perlu dikonfirmasi

Draf ini tetap dapat dipakai sebagai dasar pengembangan, tetapi keputusan berikut harus disepakati sebelum implementasi:

1. **Deployment:** lokal satu perangkat, server pribadi, atau cloud privat? Ini menentukan autentikasi, backup, dan akses antarperangkat.
2. **Kategori awal:** apakah template di dokumen sudah cukup, atau ada kategori wajib lain seperti fanfiction, board game, konser, tempat, atau pengalaman perjalanan?
3. **Prioritas tujuan:** rekomendasi awal Letterboxd untuk ekspor file dan MAL untuk sinkronisasi langsung; apakah urutan ini sesuai?
4. **Skala rating:** apakah penyimpanan presisi 0–100 dengan tampilan default 0–10 sesuai kebiasaan pengguna?
5. **Model kesan:** apakah cukup kesan/review/jurnal, atau diperlukan penilaian per chapter/episode sejak awal?
6. **Offline:** apakah internet/server selalu tersedia? Offline penuh memerlukan scope penyimpanan lokal dan conflict resolution tambahan.
7. **Data lama:** apakah sudah ada spreadsheet atau ekspor platform? File contoh diperlukan untuk memvalidasi importer.
8. **Privasi:** apakah semuanya privat, atau kelak perlu halaman publik/tautan berbagi?
9. **Akses API:** apakah pengguna bersedia mendaftarkan aplikasi provider dan menghubungkan akun melalui OAuth resmi?
10. **Anggaran dan stack:** batas biaya bulanan, preferensi teknologi, serta kapasitas pemeliharaan pemilik proyek.

## 25. Rujukan dan status bukti

Dokumentasi diperiksa pada 29 Oktober 2026. Ketersediaan layanan, batas file, dan izin API dapat berubah; adapter harus diverifikasi ulang saat implementasi.

1. Letterboxd — Importing your data: https://letterboxd.com/about/importing-data/
   - Dasar format CSV, identitas, rating, review, tanggal, rewatch, batas ukuran, dan perilaku duplikat diary.
2. Letterboxd — Migrating from IMDb: https://letterboxd.com/about/migrating-from-imdb/
   - Rujukan alur migrasi berbasis file IMDb; bukan bukti adanya sinkronisasi langsung.
3. MyAnimeList API v2: https://myanimelist.net/apiconfig/references/api/v2
   - Dasar endpoint anime/manga list status, skor, progres, tag, dan comments.
4. MyAnimeList importer: https://myanimelist.net/import.php
   - Halaman tujuan memerlukan login; kompatibilitas XML wajib dibuktikan dengan fixture dan akun uji.
5. IMDb Labs — Import Your Watch History: https://www.imdb.com/labs/import-watch-history/
   - Kandidat alur impor berdasarkan hasil pencarian halaman resmi. Isi/skema dan keberhasilan impor belum terverifikasi penuh; bukan dasar menjanjikan kompatibilitas.
6. Letterboxd API: https://letterboxd.com/api-beta/
   - Akses halaman tidak berhasil diverifikasi dalam penyusunan dokumen. Ketersediaan API bagi proyek ini tidak diasumsikan.

## 26. Ringkasan keputusan produk

**Bangun arsip universal terlebih dahulu, bukan kumpulan integrasi yang rapuh.**

Rilis awal harus sudah berguna untuk seluruh minat pengguna, dengan pencatatan manual yang cepat, progres sesuai tipe, kesan/rating yang terjaga, organisasi, serta backup lengkap. Ekspor Letterboxd menjadi jalur pertama yang dapat dibuktikan. MAL menjadi prioritas sinkronisasi resmi berikutnya. IMDb dan layanan lain hanya diberi label dukungan sesuai kemampuan yang benar-benar telah diverifikasi.
