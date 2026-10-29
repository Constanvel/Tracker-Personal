# Halaman dan kontrak navigasi

Semua keluarga halaman PRD §12 mempunyai route Next.js. State demo dibagi oleh `DemoProvider` pada root layout; berpindah melalui Link tidak mereset state. Refresh/full navigation mereset data. Ini belum implementasi backend seluruh PRD.

| URL                    | Halaman / aksi tersedia                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `/`                    | Dashboard; ringkasan, item aktif, link lanjut                     |
| `/library`             | Library, query `q`, `type`, `sort`, `view`; favorit/progres cepat |
| `/library/new`         | Form tambah dengan validasi                                       |
| `/library/[id]`        | Detail, rating, progres, favorit, kesan, jurnal terkait           |
| `/library/[id]/edit`   | Form edit; simpan kembali ke detail                               |
| `/favorites`           | Library khusus favorit                                            |
| `/activity`            | Riwayat sesi; filter jenis, link item                             |
| `/journal`             | Tambah jurnal demo, kaitkan item, cari catatan                    |
| `/collections`         | Daftar dan form buat koleksi                                      |
| `/collections/[id]`    | Keanggotaan lintas media yang benar-benar dapat diubah            |
| `/statistics`          | Ringkasan status, kategori, rating, jurnal dan aktivitas          |
| `/data`                | Pusat data dan status kemampuan                                   |
| `/data/import`         | Inspeksi JSON demo lokal, batas 1 MiB; tidak restore              |
| `/data/export`         | Download snapshot JSON demo, bukan backup native                  |
| `/data/connections`    | Status koneksi yang belum tersedia; bukan OAuth palsu             |
| `/data/jobs`           | Empty state pekerjaan; tidak membuat job fiktif                   |
| `/settings`            | Transparansi/zona waktu sesi; reset dengan konfirmasi             |
| `/settings/categories` | Template kategori hanya baca                                      |
| `/settings/privacy`    | Penjelasan akun/privasi dan keterbatasan demo                     |
| `/help`                | Panduan dan peta halaman                                          |
| `/more`                | Navigasi lengkap untuk ponsel                                     |

Detail demo stabil: `rain`, `forest`, `orbit`, `city`, `music`, `guitar`. Koleksi demo: `slow-reading`, `weekend`. ID item/koleksi buatan sendiri hidup selama sesi; setelah refresh ada pesan pemulihan dengan link kembali, bukan layar kosong.

## Kontrak tombol

- Navigasi memakai `Link`, sehingga URL, open-in-new-tab, back/forward dan deep link bekerja.
- Aksi filter, simpan, favorit, progres, membership, jurnal, unduh dan inspeksi mengubah state/hasil nyata sesuai label.
- Fitur server belum tersedia diberi alasan dan status jelas, tidak mengaku berhasil atau mengarah ke route kosong.
- URL acak tetap memakai not-found yang membantu. Tidak ada universal redirect untuk menyembunyikan route belum diimplementasikan.

## Pengujian

`npm run build` kemudian `npm run test:e2e` (Chromium: `npx playwright install chromium`). Windows dapat memakai browser terpasang dengan `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

Suite `tests/e2e/navigation.spec.ts` memeriksa direct load seluruh route, seluruh link internal yang ditemukan, add/edit/detail, state lintas halaman, back/refresh, jurnal/koleksi/pengaturan, URL filter, responsive overflow 1440/390/360, dan axe pada keluarga halaman utama. Hasil aktual dicatat di `UI-VALIDATION.md` setelah eksekusi.

Figma: [overview keluarga halaman](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG/Folio?node-id=17-368). Desain editable pendamping, bukan bukti backend selesai.
