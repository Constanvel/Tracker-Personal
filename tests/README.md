# Pengujian

- `npm test`: 20 unit test di `unit/` — pencarian/favorit, rating null/nol, validasi kategori dan angka, presisi progres dan posisi tepat, total tak diketahui, status selesai eksplisit, route, encoding ID, dan koleksi.
- `npm run test:e2e`: suite Playwright pada production build — route langsung dan tautan internal, aksi lintas halaman, sesi/draf, aksesibilitas dan layout responsif, serta empat refinement interaksi. Run CI 31 Oktober 2026 meluluskan 42/42 skenario; hasil dan batas bukti dicatat di `docs/UI-VALIDATION.md`.
- `fixtures/`: spesifikasi kebutuhan produk lanjutan, bukan seed atau format backup.
- [Checklist UI dan hasil aktual](../docs/UI-VALIDATION.md).

## Cakupan suite E2E

- `navigation.spec.ts`: direct load dan tautan internal, tambah/edit/detail/favorit, back/refresh serta state lintas halaman, jurnal/koleksi/pengaturan/filter URL, axe/overflow, download/inspeksi JSON, navigasi ponsel dan keyboard.
- `refinement.spec.ts`: kenaikan cepat berulang, undo hanya perubahan terakhir tanpa membatalkan favorit, batas pecahan, invalidasi undo lama, validasi/rating, serta ukuran dan containment kontrol.
- Suite sesi yang sudah ada: `draft-ux.spec.ts` memeriksa draf jurnal/koleksi, reset dan ketiadaan browser storage; `item-ux.spec.ts` memeriksa pilihan eksplisit perubahan satuan, draf item/Batal dan ringkasan error; `organize-ux.spec.ts` memeriksa validasi jurnal/koleksi dan pemulihan pencarian kosong; `dashboard-settings-ux.spec.ts` memeriksa layout lanjut desktop, grid/list, pencarian ponsel dan fokus konfirmasi reset.
- `exact-progress.spec.ts` (baru): lompatan posisi tepat, koreksi menurun dan pecahan, undo yang tetap tersedia setelah pesan ditutup, penolakan snapshot kedaluwarsa, validasi, Batal/Escape, pengembalian fokus, no-op tanpa aktivitas/undo baru, serta axe dialog ponsel. Status selesai tetap eksplisit dalam aturan unit dan suite refinement.
- `library-toolbar.spec.ts` (baru): label urutan aktif, status tekan grid/daftar, disclosure native ponsel dengan Enter/Space/Escape dan fokus, target 44 px/layout sempit, pelestarian query saat sort/view/reset, back/forward, scope favorit dan pencarian seluruh library pada dashboard.
- `contextual-edit.spec.ts` (baru): edit umum dengan detail opsional tertutup dan satu aksi simpan dalam alur; `?section=note` membuka/fokus kesan, intent tidak sah kembali ke edit umum; navigasi intent mempertahankan input/query; validasi membuka field tersembunyi; Undo menyinkronkan progres dan draf tanpa membuang kesan, termasuk setelah meninggalkan editor; containment ponsel.
- `recording-accessibility.spec.ts`: pemeriksaan terpadu dialog/feedback/edit pada 1440/390/360/740 px, urutan fokus keyboard, axe, target tombol, overflow, reduced motion dan viewport 720×500 untuk simulasi reflow 200% dari 1440×1000. Simulasi bukan pengganti zoom browser atau perangkat fisik.

Daftar ini menjelaskan kontrak yang diuji, bukan klaim semua skenario sudah lulus. Hasil run akhir dicatat pada [UI-VALIDATION.md](../docs/UI-VALIDATION.md).

## Menjalankan E2E

```powershell
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright menjalankan server produksi pada `http://127.0.0.1:3100`. CI memasang Chromium beserta dependensinya. Windows dapat memakai Chrome terpasang:

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:e2e
```

Screenshot viewport 1440/390/360 dan trace kegagalan berada di `test-results/` (diabaikan Git). Audit axe mencakup 19 halaman representatif pada 1440 dan 390 px; overflow diperiksa pada ketiga lebar. Audit otomatis bukan pengganti pengujian screen reader, keyboard lengkap, atau perangkat fisik.

Test demo tidak menggantikan integration test database, autentikasi, ownership, backup/restore, atau contract test provider. Komponen tersebut belum diimplementasikan.
