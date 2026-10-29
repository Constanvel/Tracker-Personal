# Pengujian

- `npm test`: enam test aturan demo di `unit/demo-library.test.ts` — pencarian, filter favorit, rating null/nol, chapter pecahan, total tak diketahui, dan status selesai eksplisit.
- `fixtures/`: spesifikasi kebutuhan produk lanjutan, bukan seed atau format backup.
- [Checklist UI](../docs/UI-VALIDATION.md): reproduksi interaksi desktop/mobile, keyboard, preferensi aksesibilitas, dan batas audit.

Test demo tidak menggantikan integration test database, autentikasi, ownership, backup/restore, atau contract test provider. Komponen tersebut belum diimplementasikan.
