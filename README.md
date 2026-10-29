# Tracker-Personal

Tracker personal lintas media dan hobi: progres, kesan, rating, jurnal privat, koleksi, serta ekspor atau sinkronisasi sesuai kemampuan platform tujuan.

## Prototipe antarmuka

**Folio** memakai tema hitam arang/abu-abu dengan aksen komplementer biru baja dan amber, dark glass pada navigasi, serta ilustrasi pixel orisinal. Responsif untuk desktop/ponsel.

```powershell
npm ci
npm run dev
```

Buka http://localhost:3000. Gunakan Node.js 24 atau lebih baru sesuai `package.json`; CI memakai Node.js 24.

Fitur demo: halaman dashboard, library grid/daftar, pencarian/filter berbasis URL, favorit, tambah/edit/detail item, rating/progres/kesan, aktivitas, jurnal, koleksi lintas media, statistik, pusat data, pengaturan, bantuan, dan navigasi ponsel. Semua navigasi memakai URL nyata; state tetap ada saat berpindah melalui Link, tetapi **hilang saat refresh**. Lihat [peta route dan kontrak tombol](docs/ROUTES.md).

Pusat data menyediakan download snapshot JSON demo dan inspeksi file lokal hanya baca, **bukan backup/restore native**. Fitur integrasi yang belum tersedia diberi alasan, bukan aksi sukses palsu.

**Belum ada login, database, penyimpanan privat, backup/restore native, ekspor platform, atau sinkronisasi.** Jangan masukkan data sensitif. Prototipe tidak menyelesaikan gate Alpha dan belum dideploy ke Vercel. Tidak ada resource cloud/billing dibuat.

Pemeriksaan lokal:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Desain dan sumber: [Keputusan desain](docs/DESIGN.md) · [Figma — Pixel & Glass](https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG) · [Hasil validasi UI](docs/UI-VALIDATION.md).

Validasi lokal: lint, typecheck, **9 unit test**, production build, dan **6 skenario E2E** lulus. Pengujian mencakup 32 URL langsung, tautan internal, aksi lintas halaman, dan unduh/inspeksi JSON. Audit axe pada 19 halaman representatif di desktop/ponsel menghasilkan **0 violations**; tidak ada overflow dokumen di 1440/390/360 px. Ini bukan audit aksesibilitas manual lengkap atau bukti keamanan backend.

## Dokumentasi

- [PRD lengkap](docs/PRD.md) — kebutuhan produk, scope, model data, integrasi, dan kriteria penerimaan.
- [Langkah implementasi](docs/IMPLEMENTATION-PLAN.md) — urutan pengerjaan, hasil tiap tahap, pengujian, dan gate rilis.
- [Backlog implementasi](docs/BACKLOG.md) — milestone, epic, task Alpha, acceptance criteria, dependensi, dan pemetaan kebutuhan PRD.
- [Fixture sintetis](tests/fixtures/README.md) — skenario data uji; bukan backup atau data pribadi.
- [ADR-0001: Fondasi produk](docs/adr/0001-product-foundation.md) — keputusan cloud privat, login GitHub, anggaran gratis, stack, dan urutan integrasi.
- [Riset referensi](docs/REFERENCES.md) — aplikasi pembanding, pola interaksi, fitur, sumber, dan rekomendasi prioritas.
- [Strategi commit](docs/COMMIT-STRATEGY.md) — atomic commits, aturan kontribusi GitHub, dan dekomposisi pekerjaan nyata.

Ekspor file tidak sama dengan sinkronisasi akun. Dukungan IMDb, Letterboxd, MAL, dan layanan lain harus mengikuti format, izin, serta kemampuan yang sudah diverifikasi.
