# Pengujian

- `npm test`: 18 unit test di `unit/` — pencarian/favorit, rating null/nol, validasi kategori dan angka, presisi progres, total tak diketahui, status selesai eksplisit, route, encoding ID, dan koleksi.
- `npm run test:e2e`: sepuluh skenario Playwright pada production build — 32 URL langsung dan tautan internal, tambah/edit/detail/favorit/back/refresh, jurnal/koleksi/pengaturan/filter URL, axe dan overflow responsif, download/inspeksi JSON, navigasi ponsel/keyboard/reduced motion, rapid increment/undo, batas pecahan, validasi/rating, serta ukuran dan containment kontrol list.
- `fixtures/`: spesifikasi kebutuhan produk lanjutan, bukan seed atau format backup.
- [Checklist UI dan hasil aktual](../docs/UI-VALIDATION.md).

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
