# Desain — Folio / Personal Tracker

Tanggal riset: 29 Oktober 2026. Scope: prototipe antarmuka responsif, bukan aplikasi privat siap produksi.

## Referensi yang dipilih sebelum implementasi

| Sumber primer                                                                                                                     | Yang diadaptasi                                                     | Batas                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials)                                  | Material membedakan kontrol dari konten; hierarki jelas             | Bukan menyalin tampilan iOS atau membuat semua kartu kaca                             |
| [Apple WWDC25 — Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)                                         | Kaca pada navigasi; hindari glass-on-glass; bagian Principles 10:31 | CSS blur bukan material native dengan refraksi dan kontras adaptif                    |
| [Nothing — Glyph Developer Kit](https://us.nothing.tech/pages/glyph-developer-kit)                                                | Ekspresi low-resolution, motif titik/pixel kecil                    | Tidak memakai font/logo/artwork Nothing; teks isi tetap normal                        |
| [GitHub — Contributions](https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile)                   | Sel kalender untuk pola aktivitas, legenda dan detail               | Tidak meniru palet hijau GitHub atau menganggap hari kosong sebagai kegagalan         |
| [Sofa 5](https://www.sofahq.com/5)                                                                                                | Progres dekat cover, melanjutkan item dengan cepat                  | Tidak menyalin layout, aset, planner, podcast atau fitur AI                           |
| [Sequel](https://www.getsequel.app)                                                                                               | Library lintas media, up next, metadata ringkas                     | Tidak menyalin layar atau menambah rekomendasi yang mengalahkan arsip pribadi         |
| [MDN — backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter)                    | Blur sebagai progressive enhancement                                | Fallback solid; tidak ada blur layar penuh/bertumpuk                                  |
| [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Kurangi gerakan sesuai preferensi OS                                | Preferensi motion berbeda dari transparansi; sediakan kontrol transparansi tersendiri |

## Keputusan visual

- Nama kerja **Folio**: ruang pribadi untuk cerita, bukan merek final yang mengubah nama repository.
- Revisi pemilik: **kehitaman dan abu-abu seperti ChatGPT**, bukan tema putih/sage.
- Dasar: kanvas `#212121`, sidebar `#181818`, kartu `#292929`, permukaan hover `#333333`, teks `#ECECEC`, muted `#ACACAC`.
- Revisi berikutnya dari pemilik: jangan terlalu bland; tambahkan warna komplementer. **Biru baja `#8CB4E8` + amber hangat `#E8B87C`** menjadi pasangan aksen di atas dasar arang. Biru untuk navigasi aktif, tombol utama, progres dan kalender; amber untuk favorit serta highlight pixel. Cover diberi warna redup, bukan grayscale penuh. Konten tetap solid dan kontras.
- Sidebar desktop 224 px; lebar konten fleksibel; nav mobile di bawah dengan safe-area.
- Tipografi sans sistem, heading rapat; monospace hanya label pendek dan angka. Tidak mengambil font dari layanan eksternal.
- Spacing 4/8/12/16/24/32; radius kartu 20–24 px; target tombol utama minimal 44 px.
- Navigasi kaca gelap: fill arang beropasitas tinggi, highlight tepi putih tipis, shadow lembut, blur 18 px. Sidebar/toolbar saja; tidak menumpuk kaca di atas kaca.
- Pixel: logo geometris orisinal, ilustrasi pemandangan lokal SVG, kalender aktivitas. Cover bukan poster berhak cipta dan tidak melakukan request gambar eksternal.
- Grafik demo berlabel sintetis; tidak menampilkan metrik palsu sebagai aktivitas pengguna.

## Revisi Dark Editorial Library — 30 Oktober 2026

Arah baru disetujui pemilik melalui permintaan remake. Kanvas arang `#1C1D1E`, sidebar `#151617`, permukaan `#242628`, teks hangat `#F1EEE7`, biru baja `#A6C3E2`, dan amber `#D8B785` menggantikan nilai awal di atas. Token berada di `src/styles/tokens.css`; lapisan editorial di `editorial.css` dan `editorial-organize.css`. Font tetap lokal: Georgia untuk judul editorial, system sans untuk kontrol dan isi antarmuka. Tidak ada request font eksternal.

- Beranda memakai baris lanjutan ringkas, ringkasan tanpa tile berat, dan ajakan jurnal. Aksi progres pertama tetap terlihat pada viewport awal desktop/ponsel yang diuji.
- Library/favorit memakai rak cover portrait dengan judul serif, kategori bergaris bawah, serta alternatif daftar yang tetap tersedia.
- Detail memakai komposisi sampul dan judul seperti jacket buku; progres dan aksi tetap langsung tersedia.
- Jurnal memisahkan area menulis dan membaca, dengan lebar teks terkontrol. Koleksi menampilkan mosaic cover dari anggota nyata, bukan data baru yang direkayasa.
- Navigasi tetap sedikit transparan; permukaan konten solid. Pilihan kurangi transparansi, reduced motion, forced colors, fokus, validasi, Undo, dan draf sesi dipertahankan.
- File Figma lama di bawah adalah referensi sebelum revisi ini; belum disinkronkan ke desain editorial.

## Layar dan interaksi

Dashboard desktop/mobile dan semua keluarga halaman PRD tersedia melalui [route nyata](ROUTES.md): library grid/list, tambah/edit/detail, favorit, aktivitas, jurnal, koleksi, statistik, pusat data, pengaturan, bantuan, dan menu ponsel. Pencarian/filter library disimpan pada query URL. Root provider membagi state saat navigasi client-side; refresh menghapus perubahan. Tidak memakai localStorage untuk tulisan privat.

Progres pecahan dan total tak diketahui tetap berbeda. Update progres tidak otomatis mengubah status menjadi selesai. Rating null berbeda dari nol. Form tambah/edit menyimpan saat submit; batal tidak menerapkan draft. Aksi favorit/progres dan membership langsung berlaku di memori sesi. Pusat data mengunduh JSON demo dan menginspeksi file lokal, bukan backup/restore native. Fitur backend yang belum tersedia menjelaskan batasnya.

## Refinement pencatatan — 30 Oktober 2026

- List responsif menyediakan ruang angka, favorit, dan tombol progres; dashboard ponsel memakai baris ringkas dengan cover kecil agar aksi lanjut muncul lebih awal.
- Tombol menyebut kenaikan dan satuan kategori, termasuk sisa pecahan menuju batas. Konfirmasi sesi menawarkan **Urungkan** untuk perubahan progres terakhir; hanya progres dan aktivitas terkait yang dipulihkan. Edit progres/total/satuan dan reset membatalkan undo lama.
- Ringkasan ponsel dipindah setelah konten; riwayat sesi mendahului kalender sintetis. Filter “Sedang dijalani” menuju library aktif.
- Judul kartu 15 px, metadata operasional 12–13 px, kontrol kartu/filter/view minimal 44 px. Identitas charcoal, biru/amber, pixel, dan peringatan demo tetap dipertahankan.
- Form awal berisi judul, kategori, status, progres. Detail opsional memakai disclosure; label/helper mengikuti kategori. Rating numerik `/10` menerima satu desimal, dengan checkbox “Belum dinilai”; nol tetap nilai sah. Validasi per field mengarahkan fokus ke kesalahan pertama. Konfirmasi simpan menyebut batas sesi demo.
- Figma ditinjau sebagai referensi; file Figma tidak diubah pada refinement ini. Skor kritik 26/40 adalah baseline sebelum perbaikan, bukan skor hasil baru.

## Figma

[Personal Tracker — Pixel & Glass](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG), Rainer Team. Frame [desktop 1440 px](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG/Folio?node-id=4-2) dan [mobile 390 px](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG/Folio?node-id=4-3) sudah dibuat dan diperiksa visual. Editable desktop/mobile composition; tombol menggunakan instance Simple Design System setelah discovery. Frame pendamping bersifat spesifikasi visual, bukan bukti semua fitur backend selesai. Penyesuaian responsif pada kode dapat mengubah layout tanpa mengubah arah visual.

[Overview keluarga halaman](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG/Folio?node-id=17-368) menambahkan sepuluh frame desktop editable: library, detail, edit, aktivitas, jurnal, koleksi, statistik, data, pengaturan, dan bantuan. Frame desktop/mobile asli tetap dipertahankan. Frame pendamping merangkum arah visual; tidak setiap subroute mempunyai frame tersendiri.

## Batas keamanan dan implementasi

Tidak ada autentikasi, database, Prisma migration, ekspor native, backup/restore, atau sinkronisasi platform pada prototipe ini. Jangan masukkan data sensitif atau menganggap URL Vercel privat. Jangan deploy arsip asli sebelum gate autentikasi/ownership dan backup Alpha selesai. Deployment tidak dibuat oleh perubahan ini.

## Pemeriksaan

Unit test aturan pencarian, progres, rating dan route; lint/typecheck/build. Suite Playwright memeriksa direct load, tautan internal, aksi lintas halaman, axe, overflow, reduced motion, solid fallback dan navigasi keyboard dasar. Hasil aktual dan batas audit tercatat di [UI-VALIDATION.md](UI-VALIDATION.md), bukan diasumsikan dari desain.
