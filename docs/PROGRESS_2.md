# PROGRES 2: PERANCANGAN BASIS DATA

**Mata Kuliah:** Sistem Basis Data  
**Studi Kasus:** Sistem Rekam Medis Klinik  
**Kelompok:** 9  


---

## 1. REVISI ANALISIS KEBUTUHAN

Berdasarkan proses normalisasi yang dilakukan pada tahap perancangan, ditemukan adanya **revisi logika bisnis** dari analisis kebutuhan pada Progres 1:

### 1.1 Temuan Revisi
Pada Progres 1, relasi antara **KUNJUNGAN** dan **DIAGNOSA** diasumsikan sebagai *One-to-Many* (1:N). Namun, setelah dilakukan analisis lebih mendalam terhadap proses bisnis klinik, ditemukan bahwa:

> **Satu kali kunjungan pasien dapat memiliki LEBIH DARI SATU diagnosa.**

**Contoh Kasus:** Seorang pasien datang dengan keluhan demam dan lemas. Setelah dilakukan pemeriksaan laboratorium, dokter mendiagnosa pasien tersebut terkena **Tifus** dan **Anemia** secara bersamaan.

### 1.2 Solusi Perancangan
Relasi antara `KUNJUNGAN` dan `DIAGNOSA` diubah menjadi **Many-to-Many (M:N)**, dengan menambahkan entitas perantara (associative entity) bernama **`DETAIL_DIAGNOSA`** yang menampung `No_Kunjungan` dan `Kode_Diagnosa`.

### 1.3 Dampak pada Entitas
Jumlah entitas bertambah dari 6 (Progres 1) menjadi **7 entitas** pada desain final:
1. `PASIEN`
2. `DOKTER`
3. `KUNJUNGAN`
4. `DIAGNOSA` *(master data)*
5. `OBAT`
6. `DETAIL_DIAGNOSA` *(entitas baru - perantara M:N)*
7. `DETAIL_RESEP`

---

## 2. NORMALISASI DATA

Proses normalisasi diawali dengan asumsi sebuah dokumen fisik bernama **"Formulir Rekam Medis & Resep Klinik"** yang diisi secara manual oleh perawat dan dokter saat pasien berkunjung.

### 2.1 UNF (Unnormalized Form)
Berisi seluruh atribut yang dicatat dalam formulir, termasuk *repeating group* untuk Diagnosa dan Obat.

**Atribut UNF:**
`No_Kunjungan`, `Tgl_Kunjungan`, `Keluhan`, `Tensi`, `Suhu`, `BB`, `No_RM`, `Nama_Pasien`, `Tgl_Lahir`, `JK`, `Alamat`, `No_Telp`, `Kode_Dokter`, `Nama_Dokter`, `Spesialis`, `{Kode_Diagnosa, Nama_Diagnosa}`, `{Kode_Obat, Nama_Obat, Satuan, Harga, Dosis, Jumlah}`

### 2.2 1NF (First Normal Form)
**Syarat:** Semua atribut harus atomik, tidak ada *repeating group*.

Karena terdapat dua *repeating group* yang independen (Diagnosa dan Resep), maka dilakukan pemecahan menjadi **dua relasi 1NF** untuk menghindari *Cartesian product*:

#### Tabel 1NF_Diagnosa
- **Primary Key:** (`No_Kunjungan`, `Kode_Diagnosa`)
- **Atribut:** `No_Kunjungan`, `Tgl_Kunjungan`, `Keluhan`, `Tensi`, `Suhu`, `BB`, `No_RM`, `Nama_Pasien`, `Tgl_Lahir`, `JK`, `Alamat`, `No_Telp`, `Kode_Dokter`, `Nama_Dokter`, `Spesialis`, `Kode_Diagnosa`, `Nama_Diagnosa`

#### Tabel 1NF_Resep
- **Primary Key:** (`No_Kunjungan`, `Kode_Obat`)
- **Atribut:** `No_Kunjungan`, `Tgl_Kunjungan`, `No_RM`, `Nama_Pasien`, `Kode_Obat`, `Nama_Obat`, `Satuan`, `Harga`, `Dosis`, `Jumlah`

### 2.3 2NF (Second Normal Form)
**Syarat:** 1NF + tidak ada *Partial Dependency* (atribut non-PK bergantung pada sebagian PK).

#### Dari 1NF_Diagnosa (PK: No_Kunjungan, Kode_Diagnosa):
| Ketergantungan | Atribut yang Bergantung | Tabel Hasil |
|---|---|---|
| Bergantung pada `No_Kunjungan` | Tgl_Kunjungan, Keluhan, Tensi, Suhu, BB, No_RM, Kode_Dokter | **KUNJUNGAN** |
| Bergantung pada `No_RM` | Nama_Pasien, Tgl_Lahir, JK, Alamat, No_Telp | **PASIEN** |
| Bergantung pada `Kode_Dokter` | Nama_Dokter, Spesialis | **DOKTER** |
| Bergantung pada `Kode_Diagnosa` | Nama_Diagnosa | **DIAGNOSA** |
| Bergantung penuh pada PK | - | **DETAIL_DIAGNOSA** (`No_Kunjungan`, `Kode_Diagnosa`) |

#### Dari 1NF_Resep (PK: No_Kunjungan, Kode_Obat):
| Ketergantungan | Atribut yang Bergantung | Tabel Hasil |
|---|---|---|
| Bergantung pada `No_Kunjungan` | Tgl_Kunjungan, No_RM | *(sudah ada di KUNJUNGAN)* |
| Bergantung pada `Kode_Obat` | Nama_Obat, Satuan, Harga | **OBAT** |
| Bergantung penuh pada PK | Dosis, Jumlah | **DETAIL_RESEP** |

### 2.4 3NF (Third Normal Form)
**Syarat:** 2NF + tidak ada *Transitive Dependency* (atribut non-PK bergantung pada atribut non-PK lainnya).

Dilakukan pengecekan pada seluruh tabel hasil 2NF:
- **PASIEN:** Semua atribut bergantung penuh pada `No_RM`.
- **DOKTER:** Semua atribut bergantung penuh pada `Kode_Dokter`.
- **KUNJUNGAN:** Semua atribut bergantung penuh pada `No_Kunjungan`.
- **DIAGNOSA:** Semua atribut bergantung penuh pada `Kode_Diagnosa`.
- **OBAT:** Semua atribut bergantung penuh pada `Kode_Obat`.
- **DETAIL_DIAGNOSA:** Hanya berisi FK, tidak ada atribut non-key.
- **DETAIL_RESEP:** `Dosis` dan `Jumlah` bergantung penuh pada kombinasi PK.

**Kesimpulan:** Tidak ditemukan *Transitive Dependency*. Skema 2NF sudah memenuhi syarat 3NF. **(2NF = 3NF)**

### 2.5 Skema Final (3NF)
Berikut adalah 7 tabel final hasil normalisasi:

1. **PASIEN** (`No_RM`, Nama_Pasien, Tgl_Lahir, JK, Alamat, No_Telp)
2. **DOKTER** (`Kode_Dokter`, Nama_Dokter, Spesialis)
3. **KUNJUNGAN** (`No_Kunjungan`, Tgl_Kunjungan, Keluhan, Tensi, Suhu, BB, *No_RM*, *Kode_Dokter*)
4. **DIAGNOSA** (`Kode_Diagnosa`, Nama_Diagnosa)
5. **OBAT** (`Kode_Obat`, Nama_Obat, Satuan, Harga)
6. **DETAIL_DIAGNOSA** (*No_Kunjungan*, *Kode_Diagnosa*)
7. **DETAIL_RESEP** (*No_Kunjungan*, *Kode_Obat*, Dosis, Jumlah)

> *Keterangan: Atribut dengan awalan `*` adalah Foreign Key (FK)*

---

## 3. ENTITY RELATIONSHIP DIAGRAM (ERD)

### 3.1 Gambar ERD

```mermaid
erDiagram
    PASIEN ||--o{ KUNJUNGAN : "melakukan"
    DOKTER ||--o{ KUNJUNGAN : "menangani"
    KUNJUNGAN ||--|{ DETAIL_DIAGNOSA : "memiliki"
    DIAGNOSA ||--o{ DETAIL_DIAGNOSA : "tercatat pada"
    KUNJUNGAN ||--|{ DETAIL_RESEP : "memiliki"
    OBAT ||--o{ DETAIL_RESEP : "terkandung dalam"

    PASIEN {
        VARCHAR No_RM PK
        VARCHAR Nama_Pasien
        DATE Tgl_Lahir
        ENUM JK
        TEXT Alamat
        VARCHAR No_Telp
    }

    DOKTER {
        VARCHAR Kode_Dokter PK
        VARCHAR Nama_Dokter
        VARCHAR Spesialis
    }

    KUNJUNGAN {
        VARCHAR No_Kunjungan PK
        DATETIME Tgl_Kunjungan
        TEXT Keluhan
        VARCHAR Tensi
        DECIMAL Suhu
        DECIMAL BB
        VARCHAR No_RM FK
        VARCHAR Kode_Dokter FK
    }

    DIAGNOSA {
        VARCHAR Kode_Diagnosa PK
        VARCHAR Nama_Diagnosa
    }

    OBAT {
        VARCHAR Kode_Obat PK
        VARCHAR Nama_Obat
        ENUM Satuan
        DECIMAL Harga
    }

    DETAIL_DIAGNOSA {
        VARCHAR No_Kunjungan PK,FK
        VARCHAR Kode_Diagnosa PK,FK
    }

    DETAIL_RESEP {
        VARCHAR No_Kunjungan PK,FK
        VARCHAR Kode_Obat PK,FK
        VARCHAR Dosis
        INT Jumlah
    }
