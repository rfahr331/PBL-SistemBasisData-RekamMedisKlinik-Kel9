/**
 * Types representing the ERD schema of Sistem Rekam Medis Klinik Anaverse
 */

export interface Pasien {
  No_RM: string; // Primary Key
  Nama_Pasien: string;
  Tgl_Lahir: string; // DATE (YYYY-MM-DD)
  JK: 'L' | 'P'; // ENUM (Laki-laki / Perempuan)
  Alamat: string; // TEXT
  No_Telp: string;
}

export interface Dokter {
  Kode_Dokter: string; // Primary Key
  Nama_Dokter: string;
  Spesialis: string;
}

export interface Kunjungan {
  No_Kunjungan: string; // Primary Key
  Tgl_Kunjungan: string; // DATETIME
  Keluhan: string; // TEXT
  Tensi: string; // Blood Pressure (e.g. "120/80")
  Suhu: number; // DECIMAL
  BB: number; // DECIMAL (Weight in Kg)
  No_RM: string; // Foreign Key to Pasien
  Kode_Dokter: string; // Foreign Key to Dokter
}

export interface Diagnosa {
  Kode_Diagnosa: string; // Primary Key
  Nama_Diagnosa: string;
}

export interface DetailDiagnosa {
  No_Kunjungan: string; // Composite Primary Key & Foreign Key
  Kode_Diagnosa: string; // Composite Primary Key & Foreign Key
}

export interface Obat {
  Kode_Obat: string; // Primary Key
  Nama_Obat: string;
  Satuan: string; // ENUM / String (Tablet, Botol, Kapsul, dll)
  Harga: number; // DECIMAL
}

export interface DetailResep {
  No_Kunjungan: string; // Composite Primary Key & Foreign Key
  Kode_Obat: string; // Composite Primary Key & Foreign Key
  Dosis: string;
  Jumlah: number;
}

// Aggregated UI types for easy display
export interface KunjunganLengkap extends Kunjungan {
  pasien?: Pasien;
  dokter?: Dokter;
  diagnosaList: Diagnosa[];
  resepList: {
    obat: Obat;
    Dosis: string;
    Jumlah: number;
  }[];
}
