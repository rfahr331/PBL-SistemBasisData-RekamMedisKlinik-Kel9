# PROGRES 3: IMPLEMENTASI DAN PENGUJIAN BASIS DATA

*Mata Kuliah:* Sistem Basis Data  
*Studi Kasus:* Sistem Rekam Medis Klinik  
*Kelompok:* 9  

---
# PROGRES 3: IMPLEMENTASI DAN PENGUJIAN BASIS DATA

**Mata Kuliah:** Sistem Basis Data  
**Studi Kasus:** Sistem Rekam Medis Klinik  
**Kelompok:** 9  

---

## 1. STRUKTUR SCRIPT SQL DDL DAN CONSTRAINT
Implementasi basis data dilakukan pada MySQL (XAMPP/MariaDB) menggunakan engine `InnoDB` untuk memastikan penegakan aturan integritas referensial (*Foreign Key Constraints*). Berkas basis data utama disimpan dengan nama `rekam_medis_klinik.sql`.

### 1.1 Tabel Master (Dimensi)
* **`pasien`**: Menyimpan data rekam medis pasien dengan *Primary Key* `No_RM`.
* **`dokter`**: Menyimpan identitas dokter pelaksana dengan *Primary Key* `Kode_Dokter`.
* **`diagnosa`**: Tabel master klasifikasi penyakit dengan *Primary Key* `Kode_Diagnosa`.
* **`obat`**: Menyimpan persediaan farmasi klinik dengan *Primary Key* `Kode_Obat`.

### 1.2 Tabel Transaksi & Perantara
* **`kunjungan`**: Header transaksi pelayanan pasien yang menghubungkan entitas `pasien` dan `dokter`.
* **`detail_diagnosa`**: Entitas asosiatif penanganan relasi *Many-to-Many* antara `kunjungan` dan `diagnosa`.
* **`detail_resep`**: Entitas asosiatif penanganan resep obat pasien per kunjungan (*Many-to-Many* antara `kunjungan` dan `obat`).

### 1.3 Penegakan Aturan Constraint
Aturan integritas data dikonfigurasi secara ketat pada skema relasi sebagai berikut:
```sql
ALTER TABLE `detail_diagnosa`
  ADD CONSTRAINT `detail_diagnosa_ibfk_1` FOREIGN KEY (`No_Kunjungan`) REFERENCES `kunjungan` (`No_Kunjungan`) ON DELETE CASCADE,
  ADD CONSTRAINT `detail_diagnosa_ibfk_2` FOREIGN KEY (`Kode_Diagnosa`) REFERENCES `diagnosa` (`Kode_Diagnosa`) ON DELETE CASCADE;

ALTER TABLE `detail_resep`
  ADD CONSTRAINT `detail_resep_ibfk_1` FOREIGN KEY (`No_Kunjungan`) REFERENCES `kunjungan` (`No_Kunjungan`) ON DELETE CASCADE,
  ADD CONSTRAINT `detail_resep_ibfk_2` FOREIGN KEY (`Kode_Obat`) REFERENCES `obat` (`Kode_Obat`) ON DELETE CASCADE;

ALTER TABLE `kunjungan`
  ADD CONSTRAINT `kunjungan_ibfk_1` FOREIGN KEY (`No_RM`) REFERENCES `pasien` (`No_RM`) ON DELETE CASCADE,
  ADD CONSTRAINT `kunjungan_ibfk_2` FOREIGN KEY (`Kode_Dokter`) REFERENCES `dokter` (`Kode_Dokter`) ON DELETE SET NULL;
  ---
  
2. DATA UJI (DUMPING DATA)
Basis data telah diisi dengan data sampel riasi operasional klinik per tanggal 25 Juni 2026 untuk keperluan verifikasi query:

- Pasien Terdaftar: 4 Pasien (RM001 s.d RM004) bertempat tinggal di Kota Tanjung Pinang.
- Tenaga Medis: 4 Dokter terdaftar dengan spesialisasi Umum dan Penyakit Dalam.
- Master Penyakit: 4 Kode diagnosa representatif (Febris, Gastritis, Diare Akut, ISPA).
- Master Obat: 4 Jenis item farmasi lengkap dengan harga satuan per item.

---

**3. IMPLEMENTASI 10 QUERY SQL EKSEKUSI**
Berikut adalah 10 rancangan query fungsional untuk kebutuhan analisis data operasional dan manajerial klinik:

Q1: Menampilkan Riwayat Medis Pasien Beserta Dokter yang Menangani
Menampilkan riwayat kunjungan pasien lengkap dengan nama dokter dan keluhannya.

SELECT k.No_Kunjungan, p.Nama_Pasien, k.Tgl_Kunjungan, k.Keluhan, d.Nama_Dokter 
FROM kunjungan k
JOIN pasien p ON k.No_RM = p.No_RM
JOIN dokter d ON k.Kode_Dokter = d.Kode_Dokter;

Q2: Statistik Jenis Penyakit Terbanyak (Kebutuhan Fungsional 10)
Menghitung frekuensi kemunculan diagnosa penyakit untuk mendeteksi tren wabah.

SELECT dg.Kode_Diagnosa, dg.Nama_Diagnosa, COUNT(dd.No_Kunjungan) AS Jumlah_Kasus
FROM diagnosa dg
LEFT JOIN detail_diagnosa dd ON dg.Kode_Diagnosa = dd.Kode_Diagnosa
GROUP BY dg.Kode_Diagnosa, dg.Nama_Diagnosa
ORDER BY Jumlah_Kasus DESC;

Q3: Laporan Obat Paling Sering Diresepkan (Kebutuhan Fungsional 11)
Mengetahui volume pemakaian obat untuk efisiensi manajemen stok gudang farmasi.

SELECT o.Kode_Obat, o.Nama_Obat, SUM(dr.Jumlah) AS Total_Keluaran, o.Satuan
FROM obat o
JOIN detail_resep dr ON o.Kode_Obat = dr.Kode_Obat
GROUP BY o.Kode_Obat, o.Nama_Obat, o.Satuan
ORDER BY Total_Keluaran DESC;

Q4: Rincian Tagihan Obat per Kunjungan Pasien
Menampilkan biaya yang harus dibayar pasien di kasir/apotek untuk penebusan obat.

SELECT dr.No_Kunjungan, p.Nama_Pasien, o.Nama_Obat, dr.Jumlah, (o.Harga * dr.Jumlah) AS Subtotal_Harga
FROM detail_resep dr
JOIN kunjungan k ON dr.No_Kunjungan = k.No_Kunjungan
JOIN pasien p ON k.No_RM = p.No_RM
JOIN obat o ON dr.Kode_Obat = o.Kode_Obat;

Q5: Rekap Pendapatan Klinik Berdasarkan Transaksi Resep Obat
Menghitung akumulasi nominal perolehan kas klinik dari sektor farmasi.

SELECT dr.No_Kunjungan, SUM(o.Harga * dr.Jumlah) AS Total_Pendapatan_Resep
FROM detail_resep dr
JOIN obat o ON dr.Kode_Obat = o.Kode_Obat
GROUP BY dr.No_Kunjungan;

Q6: Menampilkan Pasien yang Berumur di Atas 20 Tahun
Menganalisis segmentasi usia pasien dewasa menggunakan fungsi penanggalan.

SELECT No_RM, Nama_Pasien, Tgl_Lahir, (YEAR(CURDATE()) - YEAR(Tgl_Lahir)) AS Usia
FROM pasien
WHERE (YEAR(CURDATE()) - YEAR(Tgl_Lahir)) > 20;

Q7: Menampilkan Jumlah Kunjungan Pasien per Dokter
Mengukur beban kerja atau tingkat produktivitas pemeriksaan masing-masing dokter.

SELECT d.Kode_Dokter, d.Nama_Dokter, COUNT(k.No_Kunjungan) AS Total_Pasien_Ditangani
FROM dokter d
LEFT JOIN kunjungan k ON d.Kode_Dokter = k.Kode_Dokter
GROUP BY d.Kode_Dokter, d.Nama_Dokter;

Q8: Menampilkan Daftar Pasien yang Mengalami Gejala Demam (Febris)
Mencari data pasien secara spesifik berdasarkan parameter kata kunci keluhan.

SELECT k.No_Kunjungan, p.Nama_Pasien, k.Keluhan, k.Suhu
FROM kunjungan k
JOIN pasien p ON k.No_RM = p.No_RM
WHERE k.Keluhan LIKE '%Demam%';

Q9: Analisis Karakteristik Pasien Berdasarkan Jenis Kelamin
Melihat persebaran demografi gender pasien yang berkunjung ke klinik.

SELECT JK AS Jenis_Kelamin, COUNT(*) AS Total_Pasien
FROM pasien
GROUP BY JK;

Q10: Menampilkan Data Kunjungan yang Memiliki Nilai Suhu Di Atas Normal (>37.5°C)
Skrining klinis mendeteksi pasien suspect infeksi akut/hipertermia.

SELECT No_Kunjungan, No_RM, Keluhan, Suhu 
FROM kunjungan 
WHERE Suhu > 37.50;

---

 **4. SKENARIO PENGUJIAN SISTEM (TESTING MATRIX)**

| No | Komponen Uji | Tindakan / Input Simulasi | Reaksi Sistem Ekspektasi | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | Primary Key Constraint | Menginput data pasien baru dengan No_RM yang sudah ada (RM001). | Ditolak oleh MySQL (Error: Duplicate Entry). | Sukses |
| 2 | Foreign Key Restrict / Cascade | Menghapus record pada tabel kunjungan dengan No_Kunjungan = K20260602. | Data relasi pada tabel detail_resep & detail_diagnosa ikut terhapus secara otomatis (Cascade). | Sukses |
| 3 | Nullability Constraint | Memasukkan data diagnosa baru dengan mengosongkan field Nama_Diagnosa. | Sistem menolak proses insert (Error: Column cannot be null). | Sukses |
| 4 | Set Null Constraint | Menghapus data master dokter dengan Kode_Dokter = DR001. | Field Kode_Dokter pada data kunjungan berubah menjadi NULL tanpa menghapus riwayat pasien. | Sukses |
