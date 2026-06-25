-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 25 Jun 2026 pada 12.01
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rekam_medis_klinik`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_diagnosa`
--

CREATE TABLE `detail_diagnosa` (
  `No_Kunjungan` varchar(15) NOT NULL,
  `Kode_Diagnosa` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_diagnosa`
--

INSERT INTO `detail_diagnosa` (`No_Kunjungan`, `Kode_Diagnosa`) VALUES
('K20260601', 'F01'),
('K20260602', 'G01'),
('K20260603', 'D01'),
('K20260604', 'B01');

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_resep`
--

CREATE TABLE `detail_resep` (
  `No_Kunjungan` varchar(15) NOT NULL,
  `Kode_Obat` varchar(10) NOT NULL,
  `Dosis` varchar(50) DEFAULT NULL,
  `Jumlah` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `detail_resep`
--

INSERT INTO `detail_resep` (`No_Kunjungan`, `Kode_Obat`, `Dosis`, `Jumlah`) VALUES
('K20260602', 'OB002', '3x1 sebelum makan', 10),
('K20260603', 'OB003', '2x1 tiap mencret', 5),
('K20260604', 'OB004', '3x1 sendok teh', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `diagnosa`
--

CREATE TABLE `diagnosa` (
  `Kode_Diagnosa` varchar(10) NOT NULL,
  `Nama_Diagnosa` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `diagnosa`
--

INSERT INTO `diagnosa` (`Kode_Diagnosa`, `Nama_Diagnosa`) VALUES
('B01', 'Batuk dan ISPA'),
('D01', 'Diare Akut'),
('F01', 'Febris (Demam)'),
('G01', 'Gastritis (Maag)');

-- --------------------------------------------------------

--
-- Struktur dari tabel `dokter`
--

CREATE TABLE `dokter` (
  `Kode_Dokter` varchar(10) NOT NULL,
  `Nama_Dokter` varchar(100) NOT NULL,
  `Spesialis` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `dokter`
--

INSERT INTO `dokter` (`Kode_Dokter`, `Nama_Dokter`, `Spesialis`) VALUES
('DR001', 'dr. Andi Pratama', 'Umum'),
('DR002', 'dr. Heru Kusuma', 'Spesialis Penyakit Dalam'),
('DR003', 'dr. Sari Wijaya', 'Spesialis Anak'),
('DR004', 'dr. Budi Santoso', 'Spesialis Penyakit Dalam');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kunjungan`
--

CREATE TABLE `kunjungan` (
  `No_Kunjungan` varchar(15) NOT NULL,
  `Tgl_Kunjungan` date NOT NULL,
  `Keluhan` text DEFAULT NULL,
  `Tensi` varchar(10) DEFAULT NULL,
  `Suhu` decimal(4,2) DEFAULT NULL,
  `BB` decimal(5,2) DEFAULT NULL,
  `No_RM` varchar(10) DEFAULT NULL,
  `Kode_Dokter` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kunjungan`
--

INSERT INTO `kunjungan` (`No_Kunjungan`, `Tgl_Kunjungan`, `Keluhan`, `Tensi`, `Suhu`, `BB`, `No_RM`, `Kode_Dokter`) VALUES
('K20260601', '2026-06-25', 'Demam dan sakit kepala', '120/80', 38.50, 60.00, 'RM001', 'DR001'),
('K20260602', '2026-06-25', 'Nyeri lambung dan mual', '110/70', 36.50, 65.00, 'RM002', 'DR001'),
('K20260603', '2026-06-25', 'Buang air besar cair', '115/80', 37.00, 58.00, 'RM003', 'DR001'),
('K20260604', '2026-06-25', 'Batuk berdahak', '120/80', 36.80, 62.00, 'RM004', 'DR001');

-- --------------------------------------------------------

--
-- Struktur dari tabel `obat`
--

CREATE TABLE `obat` (
  `Kode_Obat` varchar(10) NOT NULL,
  `Nama_Obat` varchar(100) NOT NULL,
  `Satuan` varchar(20) DEFAULT NULL,
  `Harga` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `obat`
--

INSERT INTO `obat` (`Kode_Obat`, `Nama_Obat`, `Satuan`, `Harga`) VALUES
('OB001', 'Paracetamol', 'Tablet', 5500.00),
('OB002', 'Promag', 'Tablet', 8000.00),
('OB003', 'Diapet', 'Kapsul', 6000.00),
('OB004', 'Woods Batuk', 'Botol', 25000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pasien`
--

CREATE TABLE `pasien` (
  `No_RM` varchar(10) NOT NULL,
  `Nama_Pasien` varchar(100) NOT NULL,
  `Tgl_Lahir` date DEFAULT NULL,
  `JK` char(1) DEFAULT NULL,
  `Alamat` text DEFAULT NULL,
  `No_Telp` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pasien`
--

INSERT INTO `pasien` (`No_RM`, `Nama_Pasien`, `Tgl_Lahir`, `JK`, `Alamat`, `No_Telp`) VALUES
('RM001', 'Lukman Hakim', '2005-12-04', 'L', 'Jl. Sutami, Tanjung Pinang', '0811001'),
('RM002', 'Rezza Firnando', '2005-04-02', 'L', 'Jl. Engku Putri, Tanjung Pinang', '0811002'),
('RM003', 'Muhammad Fachry Reza', '2005-04-08', 'L', 'Jl. Pramuka, Tanjung Pinang', '0811003'),
('RM004', 'Maisa Bimo Ayu', '2006-04-07', 'L', 'Jl. Wiratno, Tanjung Pinang', '0811004');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `detail_diagnosa`
--
ALTER TABLE `detail_diagnosa`
  ADD PRIMARY KEY (`No_Kunjungan`,`Kode_Diagnosa`),
  ADD KEY `Kode_Diagnosa` (`Kode_Diagnosa`);

--
-- Indeks untuk tabel `detail_resep`
--
ALTER TABLE `detail_resep`
  ADD PRIMARY KEY (`No_Kunjungan`,`Kode_Obat`),
  ADD KEY `Kode_Obat` (`Kode_Obat`);

--
-- Indeks untuk tabel `diagnosa`
--
ALTER TABLE `diagnosa`
  ADD PRIMARY KEY (`Kode_Diagnosa`);

--
-- Indeks untuk tabel `dokter`
--
ALTER TABLE `dokter`
  ADD PRIMARY KEY (`Kode_Dokter`);

--
-- Indeks untuk tabel `kunjungan`
--
ALTER TABLE `kunjungan`
  ADD PRIMARY KEY (`No_Kunjungan`),
  ADD KEY `No_RM` (`No_RM`),
  ADD KEY `Kode_Dokter` (`Kode_Dokter`);

--
-- Indeks untuk tabel `obat`
--
ALTER TABLE `obat`
  ADD PRIMARY KEY (`Kode_Obat`);

--
-- Indeks untuk tabel `pasien`
--
ALTER TABLE `pasien`
  ADD PRIMARY KEY (`No_RM`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `detail_diagnosa`
--
ALTER TABLE `detail_diagnosa`
  ADD CONSTRAINT `detail_diagnosa_ibfk_1` FOREIGN KEY (`No_Kunjungan`) REFERENCES `kunjungan` (`No_Kunjungan`) ON DELETE CASCADE,
  ADD CONSTRAINT `detail_diagnosa_ibfk_2` FOREIGN KEY (`Kode_Diagnosa`) REFERENCES `diagnosa` (`Kode_Diagnosa`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `detail_resep`
--
ALTER TABLE `detail_resep`
  ADD CONSTRAINT `detail_resep_ibfk_1` FOREIGN KEY (`No_Kunjungan`) REFERENCES `kunjungan` (`No_Kunjungan`) ON DELETE CASCADE,
  ADD CONSTRAINT `detail_resep_ibfk_2` FOREIGN KEY (`Kode_Obat`) REFERENCES `obat` (`Kode_Obat`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kunjungan`
--
ALTER TABLE `kunjungan`
  ADD CONSTRAINT `kunjungan_ibfk_1` FOREIGN KEY (`No_RM`) REFERENCES `pasien` (`No_RM`) ON DELETE CASCADE,
  ADD CONSTRAINT `kunjungan_ibfk_2` FOREIGN KEY (`Kode_Dokter`) REFERENCES `dokter` (`Kode_Dokter`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
