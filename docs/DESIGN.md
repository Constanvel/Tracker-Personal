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

## Layar dan interaksi

Dashboard desktop/mobile, library grid/list, pencarian judul/kreator/catatan, filter kategori, favorit, dialog detail/rating/progres, tambah item manual, aktivitas sesi, serta pengaturan transparansi. Semua perubahan hanya di memori tab dan hilang saat refresh. Tidak memakai localStorage untuk tulisan privat.

Progres pecahan dan total tak diketahui tetap berbeda. Update progres tidak otomatis mengubah status menjadi selesai. Rating null berbeda dari nol. Form tambah menyimpan saat submit; batal/tutup membuang draft tambah. Detail mengubah state sesi secara langsung dan diberi penjelasan eksplisit di dialog.

## Figma

[Personal Tracker — Pixel & Glass](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG), Rainer Team. Frame [desktop 1440 px](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG/Folio?node-id=4-2) dan [mobile 390 px](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG/Folio?node-id=4-3) sudah dibuat dan diperiksa visual. Editable desktop/mobile composition; tombol menggunakan instance Simple Design System setelah discovery. Frame pendamping bersifat spesifikasi visual, bukan bukti semua fitur backend selesai. Penyesuaian responsif pada kode dapat mengubah layout tanpa mengubah arah visual.

## Batas keamanan dan implementasi

Tidak ada autentikasi, database, Prisma migration, ekspor native, backup/restore, atau sinkronisasi platform pada prototipe ini. Jangan masukkan data sensitif atau menganggap URL Vercel privat. Jangan deploy arsip asli sebelum gate autentikasi/ownership dan backup Alpha selesai. Deployment tidak dibuat oleh perubahan ini.

## Pemeriksaan

Unit test aturan pencarian, progres dan rating; lint/typecheck/build. Visual desktop/mobile, keyboard dialog, reduced motion, solid fallback dan empty state perlu diperiksa dengan bukti hasil aktual. Hasil tercatat di README setelah eksekusi, bukan diasumsikan dari desain.
