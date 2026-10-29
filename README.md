# Tracker-Personal

Tracker personal lintas media dan hobi: progres, kesan, rating, jurnal privat, koleksi, serta ekspor atau sinkronisasi sesuai kemampuan platform tujuan.

## Prototipe antarmuka

**Folio** memakai tema hitam arang/abu-abu dengan aksen komplementer biru baja dan amber, dark glass pada navigasi, serta ilustrasi pixel orisinal. Responsif untuk desktop/ponsel.

```powershell
npm ci
npm run dev
```

Buka http://localhost:3000. Gunakan Node.js 24 atau lebih baru sesuai `package.json`; CI memakai Node.js 24.

Fitur demo: dashboard, library grid/daftar, pencarian, filter kategori, favorit, tambah item, detail, rating, progres, kesan, aktivitas sesi, dan opsi kurangi transparansi. Semua perubahan hanya di memori tab dan **hilang saat refresh**.

**Belum ada login, database, penyimpanan privat, backup, ekspor, atau sinkronisasi.** Jangan masukkan data sensitif. Prototipe tidak menyelesaikan gate Alpha dan belum dideploy ke Vercel. Tidak ada resource cloud/billing dibuat.

Pemeriksaan lokal:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

Desain dan sumber: [Keputusan desain](docs/DESIGN.md) · [Figma — Pixel & Glass](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG) · [Hasil validasi UI](docs/UI-VALIDATION.md).

Validasi lokal: lint, typecheck, 6 unit test, dan production build lulus. Smoke desktop/mobile serta audit axe pada beranda dan dialog menghasilkan 0 violations setelah perbaikan kontras. Ini bukan audit aksesibilitas manual lengkap atau bukti keamanan backend.

## Dokumentasi

- [PRD lengkap](docs/PRD.md) — kebutuhan produk, scope, model data, integrasi, dan kriteria penerimaan.
- [Langkah implementasi](docs/IMPLEMENTATION-PLAN.md) — urutan pengerjaan, hasil tiap tahap, pengujian, dan gate rilis.
- [Backlog implementasi](docs/BACKLOG.md) — milestone, epic, task Alpha, acceptance criteria, dependensi, dan pemetaan kebutuhan PRD.
- [Fixture sintetis](tests/fixtures/README.md) — skenario data uji; bukan backup atau data pribadi.
- [ADR-0001: Fondasi produk](docs/adr/0001-product-foundation.md) — keputusan cloud privat, login GitHub, anggaran gratis, stack, dan urutan integrasi.
- [Riset referensi](docs/REFERENCES.md) — aplikasi pembanding, pola interaksi, fitur, sumber, dan rekomendasi prioritas.
- [Strategi commit](docs/COMMIT-STRATEGY.md) — atomic commits, aturan kontribusi GitHub, dan dekomposisi pekerjaan nyata.

Ekspor file tidak sama dengan sinkronisasi akun. Dukungan IMDb, Letterboxd, MAL, dan layanan lain harus mengikuti format, izin, serta kemampuan yang sudah diverifikasi.
