---
target: dashboard dan library Folio
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:D:\\ManhwaTracker\\Tracker-Personal\\src\\components\\tracker.tsx"
target_fingerprint: "sha256:3c747644314988d7518eeea319ae517d48abc8c4859f0a119a646b35363b89c8"
target_path: "D:\\ManhwaTracker\\Tracker-Personal\\src\\components\\tracker.tsx"
timestamp: 2026-10-30T10-48-00Z
slug: src-components-tracker-tsx
closed: true
---
Method: dual-agent (A: ses_e7399e7d4ffegXCLtqAZh9GPR2 · B: ses_e739a27b5ffeV7ZPpUZQwWfh4O)

# Kritik desain Folio

Target: dashboard/library di `src/components/tracker.tsx`, dengan navigasi dan tambah/edit sebagai konteks. Mode Operate. Tidak ada perubahan UI.

## Kesimpulan dan design specificity

Identitas Folio sudah kuat; interaksi pencatatannya belum sekuat tampilannya. Cover pixel orisinal, charcoal, aksen biru/amber, dan bahasa reflektif sesuai arsip pribadi. Pertahankan arah visual. Peluang terbesar adalah pencatatan progres ponsel yang cepat, jelas, dan mudah dikoreksi.

## Skor kesehatan desain

| Heuristik | Skor /4 | Temuan utama |
|---|---:|---|
| Status sistem | 3 | Demo jelas; perubahan progres minim konfirmasi kontekstual. |
| Kesesuaian dunia pengguna | 3 | Bahasa alami; form belum mengikuti satuan kategori. |
| Kendali dan kebebasan | 2 | Batal/reset ada; progres cepat tanpa undo langsung. |
| Konsistensi | 3 | Visual koheren; kontrol list ponsel terpotong. |
| Pencegahan kesalahan | 2 | Validasi tersedia; arti kenaikan kurang jelas. |
| Pengenalan bukan hafalan | 3 | Cover dan konteks kuat; satuan form perlu ditebak. |
| Efisiensi | 2 | Filter URL/aksi cepat membantu; koreksi melalui detail/edit. |
| Estetika dan minimalisme | 3 | Tenang; pengantar ponsel terlalu panjang. |
| Pemulihan kesalahan | 3 | Pesan jelas; error form belum dikaitkan ke field. |
| Bantuan | 2 | Panduan ada; petunjuk progres/rating kurang. |
| Total | 26/40 | Cukup; seluruh sepuluh heuristik berlaku. |

## Yang sudah bekerja

1. Identitas konsisten: biru navigasi/progres, amber favorit, glass tidak menumpuk.
2. Konteks dekat aksi: cover, judul, status, satuan, progres.
3. Batas demo jujur: tidak mengklaim privasi/persistensi/sinkronisasi atau aktivitas sintetis sebagai data nyata. Pertahankan peringatan.

## Prioritas

### 1. [P1] Kontrol progres terpotong di list ponsel

Capture 390 px menunjukkan tombol + sebagian terpotong di kanan; beberapa baris hanya memperlihatkan favorit. Footer tidak cukup untuk angka, dua tombol, padding/gap; overflow hidden menyembunyikan kelebihan. Gangguan pada jalur cepat. Pindahkan angka ke metadata dan reservasi ruang dua tombol, atau susun footer responsif. Uji 360/390 dan angka/judul panjang.

Lokasi: `src/app/globals.css:1564–1577`, `src/components/tracker.tsx:328–360`. Perintah: `/impeccable adapt`.

### 2. [P2] Increment tidak jelas dan tanpa undo langsung

Bare + menaikkan satu unit termasuk chapter pecahan/halaman/sesi, tetapi magnitudo tidak terlihat. Koreksi memerlukan detail/edit. Tampilkan +1 chapter sesuai unit, konfirmasi dengan Urungkan, atau inline set progress. Completion tetap eksplisit.

Lokasi: `src/components/tracker.tsx:338–359`, `src/components/demo-provider.tsx:88–100`, `src/lib/demo-library.ts:137–145`. Perintah: `/impeccable harden`.

### 3. [P2] Form kategori generik dan rating 102 pilihan

Label Progres/Total tidak mengungkap satuan. Dropdown rating mempunyai 102 pilihan. Pengguna menebak unit dan menelusuri daftar panjang. Label/helper mengikuti kategori; input rating /10 dengan step 0.1 dan Belum dinilai terpisah; nol tetap berbeda null.

Lokasi: `src/components/pages/item-page.tsx:144–215`. Perintah: `/impeccable clarify`.

### 4. [P2] Hierarki ponsel menunda melanjutkan aktivitas

390x844: kartu dashboard mulai sekitar y754, kontrol progres di bawah viewport; library kartu mulai sekitar y583. Pengantar, statistik, heading, tools/filter mendahului tugas utama. Padatkan pengantar/statistik ponsel dan heading berulang tanpa menghapus notice demo.

Lokasi: `src/components/tracker.tsx:115–298`. Perintah: `/impeccable distill`.

### 5. [P2] Kenyamanan baca dan sentuh kurang

Judul 12px, metadata 10–11px, beberapa kontrol 30–36px. Bukan klaim otomatis WCAG gagal. Besarkan teks operasional dan hit area menuju target proyek 44px; monospace kecil hanya untuk sekunder.

Lokasi: `src/app/globals.css:552–577,656–714,1458–1508`. Perintah: `/impeccable typeset`, lalu `/impeccable adapt`.

## Beban kognitif

4/8 pemeriksaan gagal menurut rubric: chunking, hierarki ponsel, minimal choices, progressive disclosure. Single focus, grouping, one decision at a time, working memory lulus dengan kualifikasi unit form. Delapan nav utama, tujuh kategori, enam kategori form dan 102 rating entries adalah decision points >4; jumlah saja bukan otomatis cacat. Kurangi keputusan serentak, bukan menyembunyikan fitur tanpa alasan.

## Perjalanan emosional

Masuk tenang/hangat, lalu momentum tertunda pada ponsel. Increment cepat berpotensi peak positif tetapi magnitudo/undo lemah. Kesan/jurnal mendukung refleksi; konfirmasi saved dan undo memperkuat closure. Notice demo tetap diperlukan.

## Persona red flags

- Alex: list menjanjikan efisiensi tetapi aksi terpotong; koreksi melalui detail/edit; tidak ada affordance bulk/shortcut terlihat. Tidak mengklaim keyboard gagal.
- Sam: skip link, nama kontrol, pressed states dan fokus tersedia; teks kecil/kontrol terpotong perlu pemeriksaan lanjutan. Screen reader/contrast/zoom belum terbukti gagal.
- Casey: bottom nav membantu; aksi utama terlalu jauh, target kecil dan form lengkap menambah usaha satu tangan. Refresh reset disengaja; bukan bukti tab switching menghapus state.

## Catatan kecil

Sedang dijalani summary menuju statistik bukan filtered library (`tracker.tsx:153–157`). Slogan Inggris kurang konsisten. Kalender sintetis jangan lebih menonjol dari histori nyata. Perbaiki kenyamanan sebelum mengganti font atau visual world.

## Detector dan batas bukti

Assessment B menjalankan `detect --json src/components`: [] (0 temuan, 0 rules/files, 0 false positives). CSS di luar direktori bukan scan runtime/kontras. Hasil bersih tidak membantah UX issues; detector tidak menangkap clipping, semantics dan hierarchy tersebut.

Native browser dua assessment gagal dengan browser.disconnected. A memeriksa goldens 1440/390 yang timestamp-nya postdate sumber, serta capture Playwright lokal current dashboard desktop/mobile, library list, add mobile/edit desktop. B tidak melakukan browser runtime atau custom fallback. Tidak ada overlay diinjeksi, console browser detector tidak tersedia. Tidak ada screen reader/physical/complete keyboard verification. Existing localhost:3000 server tidak dimulai/dihentikan. Tidak ada server khusus kritik yang ditinggalkan. Reset refresh/auth/persistence adalah release gaps diketahui, bukan regresi baru.

## Pertanyaan untuk tindak lanjut

Prioritas pertama: pencatatan ponsel, form tambah/edit, atau navigasi? Cakupan: tiga isu fungsional teratas atau semua lima? Tidak ada perbaikan diotorisasi oleh kritik saja.
