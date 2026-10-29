# Fixture Kebutuhan Produk

[`personal-library.v1.json`](personal-library.v1.json) adalah dataset **sintetis** untuk merencanakan dan menguji perilaku pada [backlog](../../docs/BACKLOG.md). Nama karya/aktivitas dibuat untuk pengujian; tidak berisi akun, token, ID provider nyata, atau jurnal pengguna.

## Batas kontrak

- `fixtureVersion` adalah versi fixture, bukan versi backup atau skema database.
- Nama tipe/status/field di sini adalah notasi skenario. Pemetaan ke model aplikasi dibuat dan diuji saat implementasi; jangan menganggap file dapat langsung diimpor ke aplikasi.
- Dataset ini tidak menentukan pilihan ORM, penyimpanan tanggal, atau satuan internal durasi.
- Tidak ada timestamp/tanggal buatan untuk data yang memang tidak diketahui.
- Domain `example.com` adalah tautan contoh, bukan sumber metadata yang perlu diambil.
- Jangan seed file ini otomatis ke database production.

## Skenario dan hasil yang diharapkan

| Item/skenario | Hasil |
|---|---|
| `manhwa-ongoing` | Chapter 42.5 tetap desimal, total null tetap tidak diketahui, volume terpisah, rating 87 ditampilkan 8.7/10 |
| `manga-correction` | Nilai akhir 19; hanya satu event konsumsi; koreksi tidak menambah konsumsi |
| `film-repeat` | Dua pengalaman pada tanggal sama tetap berbeda secara lokal; batas importer tujuan tidak mengubah histori asli |
| `novel-partial-date` | Tahun 2024 tidak berubah menjadi 1 Januari; rating null bukan nol |
| `song-zero-rating` | Rating nol sah, favorit independen, tidak perlu chapter atau tanggal selesai |
| `hobby-guitar` | Sesi 25 menit dan kesan tersimpan; jurnal privat ikut backup native tetapi tidak ikut payload platform |
| `miniature-custom` | Pilihan field bertipe dan judul Unicode tidak hilang |
| Dua item `Langit Kedua` | Judul sama tidak menyebabkan auto-merge |
| `mixed-favorites` | Satu koleksi boleh berisi tipe berbeda |

## Cara memakai setelah test runner tersedia

1. Baca JSON dan validasi struktur fixture.
2. Buat adapter eksplisit dari notasi fixture ke model domain aplikasi.
3. Jalankan unit test rating/progres, integration test transaksi/ownership, dan round-trip backup.
4. Untuk test provider, pisahkan review yang diizinkan dari jurnal; periksa sentinel `SYNTHETIC_PRIVATE_SENTINEL` tidak muncul dalam payload/file/log provider.
5. Gunakan fixture invalid tambahan untuk negatif, tipe salah, ZIP/XML/CSV berbahaya, dan konflik. Fixture positif ini belum menggantikan pengujian keamanan.

## Status validasi

Pada tahap perencanaan, pemeriksaan hanya memastikan JSON dapat diparse dan konsistensi dasar (ID, referensi koleksi, rentang rating, hasil skenario). Belum ada aplikasi atau test runner yang membuktikan perilaku domain. Implementasi task terkait wajib menambahkan test otomatis sebenarnya.
