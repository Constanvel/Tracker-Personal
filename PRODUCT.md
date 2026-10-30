# Product — Personal Tracker / Folio

<!-- impeccable:product-schema 1 -->

Konteks dikonfirmasi pemilik melalui `/impeccable init`, 30 Oktober 2026. Dokumen ini mencatat kebenaran produk, bukan spesifikasi visual atau klaim seluruh fitur selesai. Detail kebutuhan berada di [PRD](docs/PRD.md); keputusan fondasi yang diterima berada di [ADR-0001](docs/adr/0001-product-foundation.md).

## Platform

web

## Users

Satu pemilik arsip pribadi yang menikmati berbagai media dan hobi. Mengakses aplikasi dari ponsel dan desktop, membutuhkan pencatatan cepat serta ruang refleksi. Tidak ada registrasi publik, kolaborasi, atau audiens jejaring sosial pada lingkup awal.

## Product Purpose

Menyatukan progres, rating, kesan, jurnal, dan koleksi lintas media/hobi dalam satu arsip yang dapat dimiliki dan dipindahkan pengguna. Keberhasilan berarti mudah melanjutkan aktivitas, menemukan kembali catatan, dan memulihkan data tanpa kehilangan versi aslinya; bukan mengejar produktivitas atau memaksa semua kegiatan selesai.

## Positioning

Catat sekali, miliki datanya, kirim ke platform yang sesuai tanpa mengubah arsip asli. Model inti lintas kategori mempertahankan kebutuhan spesifik tiap media: chapter pecahan tidak disamakan dengan sesi musik atau hobi. Ini arah produk, bukan klaim keunikan pasar atau kompatibilitas universal yang sudah terbukti.

## Operating Context

- Web responsif, online dahulu; dukungan offline penuh belum termasuk keputusan produk.
- Bahasa antarmuka utama Indonesia; judul asli dan Unicode harus tetap didukung.
- Alur inti: temukan/tambah item manual, perbarui progres, beri rating/kesan, tulis jurnal, kelompokkan koleksi, dan temukan kembali melalui pencarian serta filter.
- Input manual tidak bergantung pada katalog atau konektor eksternal.
- Pencadangan dan pemulihan yang teruji mendahului integrasi platform. Arsip aplikasi menjadi sumber kebenaran; layanan eksternal bukan sumber wajib.

## Capabilities and Constraints

### Implementasi saat ini

- Next.js App Router, React, dan TypeScript; `npm run dev` membuka aplikasi lokal di `http://localhost:3000`.
- Halaman nyata mencakup dashboard, library, tambah/edit/detail item, favorit, aktivitas, jurnal, koleksi, statistik, pusat data, pengaturan, bantuan, dan menu ponsel. Inventaris: [docs/ROUTES.md](docs/ROUTES.md).
- Data sintetis dibagi dalam memori tab saat navigasi client-side. Refresh/full navigation mereset perubahan. Tidak ada penyimpanan permanen atau jaminan privasi server.
- Pusat data hanya menyediakan download snapshot JSON demo dan inspeksi file lokal hanya baca; bukan backup/restore native atau ekspor platform.
- Belum ada autentikasi, database, koneksi akun platform, pekerjaan sinkronisasi, atau deployment produksi. Jangan masukkan data sensitif.

### Target dan keputusan yang diterima

- Privat secara default, dengan GitHub OAuth resmi untuk ID akun pemilik yang stabil; tanpa izin repository untuk login. Otorisasi wajib pada server, bukan sekadar menyembunyikan tombol.
- Target stack persisten: PostgreSQL dan Prisma. Vercel Hobby dipilih sebagai hosting awal untuk penggunaan pribadi nonkomersial; belum berarti resource telah dibuat.
- Gratis dahulu. Tidak membuat layanan berbayar atau mengaktifkan overage tanpa persetujuan. Keamanan dan backup tidak boleh dikorbankan demi biaya nol.
- Rating kanonis integer 0–100; tampilan default 0–10. Nilai null berbeda dari nol. Progres dapat pecahan; total belum diketahui berbeda dari nol. Status selesai dipilih eksplisit.
- Jurnal privat terpisah dari review yang boleh dibagikan, dan tidak ikut ekspor platform. Penyertaan review memerlukan pilihan eksplisit.
- Urutan: pencatatan manual dan backup/restore native, ekspor Letterboxd terverifikasi, kemudian sinkronisasi satu arah MAL melalui API resmi. Dukungan IMDb harus diteliti sebelum dijanjikan.
- Tidak ada format/API tunggal untuk semua kategori. Preview harus menjelaskan pemetaan lossy, batas, item dilewati, dan kemampuan konektor sebenarnya.
- Bukan pemutar media, pembaca komik, penyimpan salinan karya, jejaring sosial, atau sistem pemantauan perangkat.

### Keputusan terbuka

Provider PostgreSQL, storage privat, region/retensi, pustaka autentikasi/model sesi, konfigurasi OAuth pemilik, batas attachment, dan mekanisme job persisten belum ditetapkan. Nama final dan kompatibilitas IMDb juga belum diputuskan. Jangan mengisi keputusan ini dengan asumsi atau menganggap target PRD sudah tersedia.

## Brand Commitments

Folio adalah nama kerja UI; repository tetap `Tracker-Personal`. Gunakan Bahasa Indonesia yang jelas dan tidak menghakimi. Jangan menggambarkan hari tanpa aktivitas sebagai kegagalan. Identitas visual yang sudah dipilih pemilik tercatat terpisah di [docs/DESIGN.md](docs/DESIGN.md); init tidak menggantinya.

## Evidence on Hand

- [docs/PRD.md](docs/PRD.md): kebutuhan, model, batas integrasi, dan acceptance criteria; bukan daftar fitur yang seluruhnya sudah terimplementasi.
- [docs/adr/0001-product-foundation.md](docs/adr/0001-product-foundation.md): keputusan fondasi yang diterima dan bagian yang masih terbuka.
- `src/`, `public/covers/`: prototipe runnable dan ilustrasi SVG orisinal. Data contoh bukan arsip pengguna.
- `tests/fixtures/`: skenario sintetis spesifikasi lanjutan, bukan seed produksi atau format backup yang telah didukung.
- [docs/UI-VALIDATION.md](docs/UI-VALIDATION.md): hasil dan keterbatasan bukti pengujian lokal. Bukan sertifikasi aksesibilitas atau keamanan.
- Tautan Figma di `docs/DESIGN.md`: referensi editable, bukan bukti backend selesai.
- Tidak ada testimonial, bukti pelanggan, metrik penggunaan produksi, benchmark skala produksi, atau hasil sinkronisasi nyata yang boleh direkayasa.

## Product Principles

1. Catat lintas kategori tanpa menghapus perbedaan media; input manual tetap tersedia.
2. Kepemilikan dan pemulihan data mendahului integrasi; ekspor tidak mengubah arsip asli.
3. Privat secara default; pisahkan jurnal dari konten yang dipilih untuk dibagikan.
4. Nyatakan kemampuan dan kegagalan dengan jujur; jangan tampilkan penyimpanan atau sinkronisasi sukses tanpa bukti.
5. Utamakan pencatatan dan refleksi yang ringan, bukan tekanan menyelesaikan atau mengejar angka.

## Accessibility & Inclusion

Target web mengikuti WCAG 2.1 AA pada kebutuhan yang relevan: navigasi keyboard, nama kontrol yang jelas, fokus terlihat, kontras, responsivitas, dan preferensi reduced motion. Pertahankan opsi kurangi transparansi. Unicode, rating nol, progres pecahan, dan kegiatan tanpa total/akhir harus terwakili dengan benar. Audit otomatis yang sudah ada tidak menggantikan pengujian screen reader, keyboard lengkap, atau perangkat fisik.
