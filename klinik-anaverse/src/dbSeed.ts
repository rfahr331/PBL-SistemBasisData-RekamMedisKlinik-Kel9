import { Pasien, Dokter, Diagnosa, DetailDiagnosa, Obat, DetailResep, Kunjungan, KunjunganLengkap } from './types';

// Seed Pasien
export const SEED_PASIEN: Pasien[] = [
  {
    No_RM: 'RM-001',
    Nama_Pasien: 'Budi Santoso',
    Tgl_Lahir: '1985-04-12',
    JK: 'L',
    Alamat: 'Jl. Merdeka No. 10, Gambir, Jakarta Pusat',
    No_Telp: '081234567890'
  },
  {
    No_RM: 'RM-002',
    Nama_Pasien: 'Siti Aminah',
    Tgl_Lahir: '1992-08-23',
    JK: 'P',
    Alamat: 'Jl. Sudirman No. 45, Coblong, Bandung',
    No_Telp: '082198765432'
  },
  {
    No_RM: 'RM-003',
    Nama_Pasien: 'Melani Saputri',
    Tgl_Lahir: '2001-11-05',
    JK: 'P',
    Alamat: 'Jl. Gatot Subroto No. 12, Wonokromo, Surabaya',
    No_Telp: '083145678901'
  },
  {
    No_RM: 'RM-004',
    Nama_Pasien: 'Ahmad Hidayat',
    Tgl_Lahir: '1978-01-30',
    JK: 'L',
    Alamat: 'Jl. Pemuda No. 8, Umbulharjo, Yogyakarta',
    No_Telp: '085234567890'
  },
  {
    No_RM: 'RM-005',
    Nama_Pasien: 'Rini Wulandari',
    Tgl_Lahir: '2015-06-15',
    JK: 'P',
    Alamat: 'Jl. Melati Raya No. 3, Tembalang, Semarang',
    No_Telp: '087756789012'
  }
];

// Seed Dokter
export const SEED_DOKTER: Dokter[] = [
  {
    Kode_Dokter: 'DKR-001',
    Nama_Dokter: 'dr. Andika Pratama, Sp.JP',
    Spesialis: 'Spesialis Jantung'
  },
  {
    Kode_Dokter: 'DKR-002',
    Nama_Dokter: 'dr. Salsabila Putri, Sp.A',
    Spesialis: 'Spesialis Anak'
  },
  {
    Kode_Dokter: 'DKR-003',
    Nama_Dokter: 'dr. Budi Santoso, Sp.B',
    Spesialis: 'Spesialis Bedah'
  },
  {
    Kode_Dokter: 'DKR-004',
    Nama_Dokter: 'dr. Meilani Putri, Sp.PD',
    Spesialis: 'Spesialis Penyakit Dalam'
  },
  {
    Kode_Dokter: 'DKR-005',
    Nama_Dokter: 'dr. Farhan Alatas',
    Spesialis: 'Dokter Umum'
  }
];

// Seed Diagnosa (ICD-10 Code & Name)
export const SEED_DIAGNOSA: Diagnosa[] = [
  {
    Kode_Diagnosa: 'I10',
    Nama_Diagnosa: 'Essential (primary) hypertension (Hipertensi Esensial)'
  },
  {
    Kode_Diagnosa: 'E11',
    Nama_Diagnosa: 'Type 2 diabetes mellitus (Diabetes Melitus Tipe 2)'
  },
  {
    Kode_Diagnosa: 'J00',
    Nama_Diagnosa: 'Acute nasopharyngitis [common cold] (Nasofaringitis Akut)'
  },
  {
    Kode_Diagnosa: 'K35',
    Nama_Diagnosa: 'Acute appendicitis (Apendisitis Akut / Usus Buntu)'
  },
  {
    Kode_Diagnosa: 'H10',
    Nama_Diagnosa: 'Conjunctivitis (Konjungtivitis / Radang Mata)'
  },
  {
    Kode_Diagnosa: 'J45',
    Nama_Diagnosa: 'Asthma (Asma Bronkial)'
  },
  {
    Kode_Diagnosa: 'K21',
    Nama_Diagnosa: 'Gastro-esophageal reflux disease (GERD / Asam Lambung)'
  }
];

// Seed Obat
export const SEED_OBAT: Obat[] = [
  {
    Kode_Obat: 'OBT-001',
    Nama_Obat: 'Amlodipine 5mg',
    Satuan: 'Tablet',
    Harga: 1500
  },
  {
    Kode_Obat: 'OBT-002',
    Nama_Obat: 'Metformin 500mg',
    Satuan: 'Tablet',
    Harga: 2000
  },
  {
    Kode_Obat: 'OBT-003',
    Nama_Obat: 'Paracetamol 500mg',
    Satuan: 'Tablet',
    Harga: 1000
  },
  {
    Kode_Obat: 'OBT-004',
    Nama_Obat: 'Amoxicillin 500mg',
    Satuan: 'Tablet',
    Harga: 2500
  },
  {
    Kode_Obat: 'OBT-005',
    Nama_Obat: 'Sanmol Sirup 60ml',
    Satuan: 'Botol',
    Harga: 18500
  },
  {
    Kode_Obat: 'OBT-006',
    Nama_Obat: 'Atorvastatin 20mg',
    Satuan: 'Tablet',
    Harga: 4500
  },
  {
    Kode_Obat: 'OBT-007',
    Nama_Obat: 'Antasida Doen',
    Satuan: 'Tablet',
    Harga: 800
  }
];

// Seed Kunjungan
export const SEED_KUNJUNGAN: Kunjungan[] = [
  {
    No_Kunjungan: 'KJN-001',
    Tgl_Kunjungan: '2026-06-10T10:30',
    Keluhan: 'Nyeri dada sebelah kiri yang menjalar ke punggung dan sesak napas jika lelah.',
    Tensi: '145/95',
    Suhu: 36.6,
    BB: 78,
    No_RM: 'RM-001',
    Kode_Dokter: 'DKR-001'
  },
  {
    No_Kunjungan: 'KJN-002',
    Tgl_Kunjungan: '2026-06-15T14:15',
    Keluhan: 'Badan terasa cepat lelah, sering merasa haus berlebih, dan sering buang air kecil pada malam hari.',
    Tensi: '120/80',
    Suhu: 36.8,
    BB: 62,
    No_RM: 'RM-002',
    Kode_Dokter: 'DKR-004'
  },
  {
    No_Kunjungan: 'KJN-003',
    Tgl_Kunjungan: '2026-06-25T09:00',
    Keluhan: 'Anak demam naik turun sejak 3 hari yang lalu disertai batuk pilek dan berkurangnya nafsu makan.',
    Tensi: '100/70',
    Suhu: 38.9,
    BB: 22,
    No_RM: 'RM-005',
    Kode_Dokter: 'DKR-002'
  },
  {
    No_Kunjungan: 'KJN-004',
    Tgl_Kunjungan: '2026-06-26T16:00',
    Keluhan: 'Tenggorokan gatal dan batuk berdahak disertai sakit kepala ringan.',
    Tensi: '130/85',
    Suhu: 37.4,
    BB: 70,
    No_RM: 'RM-004',
    Kode_Dokter: 'DKR-005'
  }
];

// Seed Detail Diagnosa (Linking Kunjungan & Diagnosa)
export const SEED_DETAIL_DIAGNOSA: DetailDiagnosa[] = [
  { No_Kunjungan: 'KJN-001', Kode_Diagnosa: 'I10' },
  { No_Kunjungan: 'KJN-002', Kode_Diagnosa: 'E11' },
  { No_Kunjungan: 'KJN-003', Kode_Diagnosa: 'J00' },
  { No_Kunjungan: 'KJN-004', Kode_Diagnosa: 'J00' }
];

// Seed Detail Resep (Linking Kunjungan & Obat)
export const SEED_DETAIL_RESEP: DetailResep[] = [
  { No_Kunjungan: 'KJN-001', Kode_Obat: 'OBT-001', Dosis: '1 x sehari 1 tablet setelah makan pagi', Jumlah: 30 },
  { No_Kunjungan: 'KJN-001', Kode_Obat: 'OBT-006', Dosis: '1 x sehari 1 tablet malam hari', Jumlah: 10 },
  { No_Kunjungan: 'KJN-002', Kode_Obat: 'OBT-002', Dosis: '2 x sehari 1 tablet setelah makan', Jumlah: 60 },
  { No_Kunjungan: 'KJN-003', Kode_Obat: 'OBT-005', Dosis: '3 x sehari 1 sendok takar (5ml) jika demam', Jumlah: 1 },
  { No_Kunjungan: 'KJN-003', Kode_Obat: 'OBT-003', Dosis: '3 x sehari 1/2 tablet jika demam tinggi', Jumlah: 10 },
  { No_Kunjungan: 'KJN-004', Kode_Obat: 'OBT-003', Dosis: '3 x sehari 1 tablet jika batuk/pusing', Jumlah: 10 },
  { No_Kunjungan: 'KJN-004', Kode_Obat: 'OBT-004', Dosis: '3 x sehari 1 tablet sesudah makan (HABISKAN)', Jumlah: 15 }
];

// Local Storage Helper keys
const STORAGE_KEYS = {
  PASIEN: 'anaverse_klinik_pasien',
  DOKTER: 'anaverse_klinik_dokter',
  DIAGNOSA: 'anaverse_klinik_diagnosa',
  OBAT: 'anaverse_klinik_obat',
  KUNJUNGAN: 'anaverse_klinik_kunjungan',
  DETAIL_DIAGNOSA: 'anaverse_klinik_detail_diagnosa',
  DETAIL_RESEP: 'anaverse_klinik_detail_resep'
};

// Getter & Setter functions
export function getSavedData<T>(key: string, defaultData: T[]): T[] {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing storage for', key, e);
    return defaultData;
  }
}

export function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Global active store interface
export class KlinikDB {
  static getPasien(): Pasien[] {
    return getSavedData(STORAGE_KEYS.PASIEN, SEED_PASIEN);
  }
  static savePasien(data: Pasien[]) {
    saveToStorage(STORAGE_KEYS.PASIEN, data);
  }

  static getDokter(): Dokter[] {
    return getSavedData(STORAGE_KEYS.DOKTER, SEED_DOKTER);
  }
  static saveDokter(data: Dokter[]) {
    saveToStorage(STORAGE_KEYS.DOKTER, data);
  }

  static getDiagnosa(): Diagnosa[] {
    return getSavedData(STORAGE_KEYS.DIAGNOSA, SEED_DIAGNOSA);
  }
  static saveDiagnosa(data: Diagnosa[]) {
    saveToStorage(STORAGE_KEYS.DIAGNOSA, data);
  }

  static getObat(): Obat[] {
    return getSavedData(STORAGE_KEYS.OBAT, SEED_OBAT);
  }
  static saveObat(data: Obat[]) {
    saveToStorage(STORAGE_KEYS.OBAT, data);
  }

  static getKunjungan(): Kunjungan[] {
    return getSavedData(STORAGE_KEYS.KUNJUNGAN, SEED_KUNJUNGAN);
  }
  static saveKunjungan(data: Kunjungan[]) {
    saveToStorage(STORAGE_KEYS.KUNJUNGAN, data);
  }

  static getDetailDiagnosa(): DetailDiagnosa[] {
    return getSavedData(STORAGE_KEYS.DETAIL_DIAGNOSA, SEED_DETAIL_DIAGNOSA);
  }
  static saveDetailDiagnosa(data: DetailDiagnosa[]) {
    saveToStorage(STORAGE_KEYS.DETAIL_DIAGNOSA, data);
  }

  static getDetailResep(): DetailResep[] {
    return getSavedData(STORAGE_KEYS.DETAIL_RESEP, SEED_DETAIL_RESEP);
  }
  static saveDetailResep(data: DetailResep[]) {
    saveToStorage(STORAGE_KEYS.DETAIL_RESEP, data);
  }

  // Get complete aggregate visits
  static getKunjunganLengkap(): KunjunganLengkap[] {
    const pasiens = this.getPasien();
    const dokters = this.getDokter();
    const diagnosas = this.getDiagnosa();
    const obats = this.getObat();
    const kunjungans = this.getKunjungan();
    const detailsDiag = this.getDetailDiagnosa();
    const detailsResep = this.getDetailResep();

    // Sort kunjungan newest first
    const sortedKunjungans = [...kunjungans].sort(
      (a, b) => new Date(b.Tgl_Kunjungan).getTime() - new Date(a.Tgl_Kunjungan).getTime()
    );

    return sortedKunjungans.map((visit) => {
      const pasien = pasiens.find((p) => p.No_RM === visit.No_RM);
      const dokter = dokters.find((d) => d.Kode_Dokter === visit.Kode_Dokter);

      // Find diagnosas
      const linkedDiagCodes = detailsDiag
        .filter((d) => d.No_Kunjungan === visit.No_Kunjungan)
        .map((d) => d.Kode_Diagnosa);
      const diagnosaList = diagnosas.filter((d) => linkedDiagCodes.includes(d.Kode_Diagnosa));

      // Find prescriptions
      const resepList = detailsResep
        .filter((r) => r.No_Kunjungan === visit.No_Kunjungan)
        .map((r) => {
          const obat = obats.find((o) => o.Kode_Obat === r.Kode_Obat) || {
            Kode_Obat: r.Kode_Obat,
            Nama_Obat: 'Obat Tidak Ditemukan',
            Satuan: 'Unit',
            Harga: 0
          };
          return {
            obat,
            Dosis: r.Dosis,
            Jumlah: r.Jumlah
          };
        });

      return {
        ...visit,
        pasien,
        dokter,
        diagnosaList,
        resepList
      };
    });
  }

  // Reset database back to default seed data
  static resetToSeed() {
    localStorage.removeItem(STORAGE_KEYS.PASIEN);
    localStorage.removeItem(STORAGE_KEYS.DOKTER);
    localStorage.removeItem(STORAGE_KEYS.DIAGNOSA);
    localStorage.removeItem(STORAGE_KEYS.OBAT);
    localStorage.removeItem(STORAGE_KEYS.KUNJUNGAN);
    localStorage.removeItem(STORAGE_KEYS.DETAIL_DIAGNOSA);
    localStorage.removeItem(STORAGE_KEYS.DETAIL_RESEP);
  }
}
