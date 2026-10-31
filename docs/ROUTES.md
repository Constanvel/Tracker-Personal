# Halaman dan kontrak navigasi

Semua keluarga halaman PRD §12 mempunyai route Next.js. State demo dibagi oleh `DemoProvider` pada root layout; berpindah melalui Link tidak mereset state. Refresh/full navigation mereset data. Ini belum implementasi backend seluruh PRD.

| URL                    | Halaman / aksi tersedia                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `/`                    | Dashboard; ringkasan, item aktif, link lanjut                     |
| `/library`             | Library, query `q`, `type`, `status=active`, `sort`, `view`; favorit/progres cepat |
| `/library/new`         | Form tambah dengan validasi                                       |
| `/library/[id]`        | Detail, rating, progres, favorit, kesan, jurnal terkait           |
| `/library/[id]/edit`   | Edit umum dengan detail opsional tertutup; `?section=note` membuka dan memfokuskan kesan; simpan kembali ke detail |
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

## Kontrak query library dan edit

- Library, favorit, dan pencarian dashboard memakai `q` untuk judul/kreator/catatan, `type` untuk kategori, `status=active` untuk “Sedang dijalani”, `sort=title` untuk Judul A–Z, serta `view=list` untuk daftar. Tanpa `sort=title` urutan bawaan dipakai; tanpa `view=list` tampil grid. Scope favorit tetap berlaku; pencarian dashboard mencakup seluruh library, bukan hanya item lanjut.
- Perubahan kontrol memakai `router.replace` tanpa scroll dan hanya mengubah parameter terkait; parameter lain tetap utuh. “Reset filter” menghapus `q`, `type`, `status`, tetapi mempertahankan urutan, tampilan, dan parameter lain. Hapus pencarian hanya menghapus `q` dan memfokuskan input. URL dapat dibuka langsung; kembali/maju dari detail memulihkan pilihan library dari query, bukan membuat entri riwayat baru untuk setiap klik filter.
- Desktop menampilkan tombol berlabel urutan aktif dan grid/daftar dengan `aria-pressed`. Ponsel menaruh kontrol yang sama di disclosure native “Tampilan & urutan”; Enter/Space membuka, Escape menutup dan memfokuskan ringkasan. Ini bukan menu dengan semantik `menu`/`menuitem`.
- “Edit item” menuju `/library/[id]/edit`; detail opsional tertutup. “Edit kesan” menuju `/library/[id]/edit?section=note`. Intent hanya sah bila `section` muncul tepat sekali dan bernilai persis `note`; nilai tidak dikenal, beda kapital, dan parameter ganda tetap pada edit umum tanpa memfokuskan kesan. Parameter lain tidak dibersihkan. Pergantian intent/back tidak mengganti identitas item atau mereset input draf. Submit seluruh form kembali ke `/library/[id]?saved=1` dengan konfirmasi batas sesi demo.
- Draf item, jurnal, dan koleksi bertahan saat navigasi client-side, tanpa browser storage. Batal membuang draf item; submit berhasil membersihkan draf terkait, reset/refresh menghapus draf sesi. Undo progres saat editor item terbuka memperbarui field progres sekaligus salinan draf, tanpa menghapus kesan yang belum disimpan.

## Kontrak pencatatan progres

- Kenaikan cepat mengikuti satuan kategori dan sisa pecahan menuju batas. “Catat progres…” membuka dialog native untuk posisi tepat, termasuk lompatan, pecahan, dan koreksi menurun. Validasi menolak angka kosong/tidak sah, negatif, atau melewati total diketahui; total tak diketahui tetap berbeda dari nol.
- Dialog mengambil snapshot progres, total, satuan, dan versi sesi. Simpan ditolak bila snapshot berubah; pengguna diminta menutup lalu membuka editor dengan data terbaru. Nilai tidak berubah tidak membuat aktivitas atau undo baru. Batal/Escape tidak menyimpan; fokus kembali ke tombol pemicu. Mencapai total tidak mengubah status selesai secara otomatis.
- Konfirmasi progres berada dalam alur halaman dengan `role="status"`. Menutup pesannya tidak menghapus **Urungkan**. Undo perubahan terakhir memulihkan progres dan menghapus aktivitas terkait saja; edit progres/total/satuan item terkait dan reset membatalkan undo lama.

## Pengujian

`npm run build` kemudian `npm run test:e2e` (Chromium: `npx playwright install chromium`). Windows dapat memakai browser terpasang dengan `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

Suite `tests/e2e/navigation.spec.ts` memeriksa direct load seluruh route, seluruh link internal yang ditemukan, add/edit/detail, state lintas halaman, back/refresh, jurnal/koleksi/pengaturan, URL filter, responsive overflow 1440/390/360, dan axe pada keluarga halaman utama. Suite sesi yang sudah ada mencakup refinement progres, draf, validasi item, jurnal/koleksi, dashboard, dan pengaturan. Suite baru `exact-progress.spec.ts`, `library-toolbar.spec.ts`, dan `contextual-edit.spec.ts` menguji dialog posisi tepat/snapshot/undo, disclosure serta kontrak query library, dan intent kesan/fokus/draf termasuk sinkronisasi Undo. Cakupan bukan klaim kelulusan; hasil aktual dicatat di `UI-VALIDATION.md` setelah eksekusi.

Figma: [overview keluarga halaman](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG/Folio?node-id=17-368). Desain editable pendamping, bukan bukti backend selesai.
