import { createClient } from '@supabase/supabase-js';
import { Pasien, Dokter, Diagnosa, DetailDiagnosa, Obat, DetailResep, Kunjungan } from '../types';

// Read values from environment variables or use the provided default credentials
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://dlvzdajbwanhnbpjidvi.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsdnpkYWpid2FuaG5icGppZHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODAzNTUsImV4cCI6MjA5ODE1NjM1NX0.twIPitXVSPQ1S3lUm3JAYxwXsNYRkD1fsix6QFs0-FY';

// Ensure the project URL is clean without trailing slash or path suffix
const cleanUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').trim();

export const supabase = createClient(cleanUrl, SUPABASE_ANON_KEY);

// Helper to determine if we are connected to Supabase and if tables exist
export interface SupabaseStatus {
  connected: boolean;
  tablesExist: boolean;
  error?: string;
  missingTables?: string[];
}

export const checkSupabaseConnection = async (): Promise<SupabaseStatus> => {
  const status: SupabaseStatus = {
    connected: false,
    tablesExist: false,
    missingTables: []
  };

  try {
    // Attempt a basic test query on one table to check connectivity
    const { error } = await supabase.from('pasien').select('No_RM').limit(1);
    
    status.connected = true;

    if (error) {
      if (error.code === 'PGRST116' || error.code === 'PGRST111' || error.message?.includes('does not exist') || error.code === '42P01') {
        status.tablesExist = false;
        status.missingTables = ['pasien'];
        status.error = 'Tabel database belum dibuat di dashboard Supabase Anda.';
      } else {
        status.error = error.message;
      }
    } else {
      status.tablesExist = true;
    }
  } catch (err: any) {
    status.connected = false;
    status.error = err.message || 'Koneksi gagal';
  }

  return status;
};

// --- CRUD Helpers for Pasien ---
export const getPasiens = async (): Promise<Pasien[]> => {
  const { data, error } = await supabase.from('pasien').select('*');
  if (error) throw error;
  return data || [];
};

export const upsertPasien = async (pasien: Pasien) => {
  const { data, error } = await supabase.from('pasien').upsert(pasien).select();
  if (error) throw error;
  return data;
};

export const deletePasien = async (noRM: string) => {
  const { error } = await supabase.from('pasien').delete().eq('No_RM', noRM);
  if (error) throw error;
};

// --- CRUD Helpers for Dokter ---
export const getDokters = async (): Promise<Dokter[]> => {
  const { data, error } = await supabase.from('dokter').select('*');
  if (error) throw error;
  return data || [];
};

export const upsertDokter = async (dokter: Dokter) => {
  const { data, error } = await supabase.from('dokter').upsert(dokter).select();
  if (error) throw error;
  return data;
};

export const deleteDokter = async (kodeDokter: string) => {
  const { error } = await supabase.from('dokter').delete().eq('Kode_Dokter', kodeDokter);
  if (error) throw error;
};

// --- CRUD Helpers for Diagnosa ---
export const getDiagnosas = async (): Promise<Diagnosa[]> => {
  const { data, error } = await supabase.from('diagnosa').select('*');
  if (error) throw error;
  return data || [];
};

export const upsertDiagnosa = async (diagnosa: Diagnosa) => {
  const { data, error } = await supabase.from('diagnosa').upsert(diagnosa).select();
  if (error) throw error;
  return data;
};

export const deleteDiagnosa = async (kodeDiagnosa: string) => {
  const { error } = await supabase.from('diagnosa').delete().eq('Kode_Diagnosa', kodeDiagnosa);
  if (error) throw error;
};

// --- CRUD Helpers for Obat ---
export const getObats = async (): Promise<Obat[]> => {
  const { data, error } = await supabase.from('obat').select('*');
  if (error) throw error;
  return data || [];
};

export const upsertObat = async (obat: Obat) => {
  const { data, error } = await supabase.from('obat').upsert(obat).select();
  if (error) throw error;
  return data;
};

export const deleteObat = async (kodeObat: string) => {
  const { error } = await supabase.from('obat').delete().eq('Kode_Obat', kodeObat);
  if (error) throw error;
};

// --- CRUD Helpers for Kunjungan ---
export const getKunjungans = async (): Promise<Kunjungan[]> => {
  const { data, error } = await supabase.from('kunjungan').select('*');
  if (error) throw error;
  return data || [];
};

export const upsertKunjungan = async (kunjungan: Kunjungan) => {
  const { data, error } = await supabase.from('kunjungan').upsert(kunjungan).select();
  if (error) throw error;
  return data;
};

export const deleteKunjungan = async (noKunjungan: string) => {
  const { error } = await supabase.from('kunjungan').delete().eq('No_Kunjungan', noKunjungan);
  if (error) throw error;
};

// --- CRUD Helpers for Detail Diagnosa ---
export const getDetailDiagnosas = async (): Promise<DetailDiagnosa[]> => {
  const { data, error } = await supabase.from('detail_diagnosa').select('*');
  if (error) throw error;
  return data || [];
};

export const upsertDetailDiagnosa = async (detail: DetailDiagnosa) => {
  const { data, error } = await supabase.from('detail_diagnosa').upsert(detail).select();
  if (error) throw error;
  return data;
};

export const deleteDetailDiagnosa = async (noKunjungan: string, kodeDiagnosa: string) => {
  const { error } = await supabase.from('detail_diagnosa')
    .delete()
    .eq('No_Kunjungan', noKunjungan)
    .eq('Kode_Diagnosa', kodeDiagnosa);
  if (error) throw error;
};

export const deleteDetailDiagnosasForVisit = async (noKunjungan: string) => {
  const { error } = await supabase.from('detail_diagnosa').delete().eq('No_Kunjungan', noKunjungan);
  if (error) throw error;
};

// --- CRUD Helpers for Detail Resep ---
export const getDetailReseps = async (): Promise<DetailResep[]> => {
  const { data, error } = await supabase.from('detail_resep').select('*');
  if (error) throw error;
  return data || [];
};

export const upsertDetailResep = async (resep: DetailResep) => {
  const { data, error } = await supabase.from('detail_resep').upsert(resep).select();
  if (error) throw error;
  return data;
};

export const deleteDetailResep = async (noKunjungan: string, kodeObat: string) => {
  const { error } = await supabase.from('detail_resep')
    .delete()
    .eq('No_Kunjungan', noKunjungan)
    .eq('Kode_Obat', kodeObat);
  if (error) throw error;
};

export const deleteDetailResepsForVisit = async (noKunjungan: string) => {
  const { error } = await supabase.from('detail_resep').delete().eq('No_Kunjungan', noKunjungan);
  if (error) throw error;
};

// --- Batch Seeding and Sync Utilities ---
export const seedSupabaseData = async (
  pasiens: Pasien[],
  dokters: Dokter[],
  diagnosas: Diagnosa[],
  obats: Obat[],
  kunjungans: Kunjungan[],
  detailDiags: DetailDiagnosa[],
  detailReseps: DetailResep[]
): Promise<void> => {
  // Clear any existing values to avoid key collisions on seed
  // The tables must exist on Supabase
  try {
    // Delete in reverse dependency order
    await supabase.from('detail_resep').delete().neq('No_Kunjungan', '');
    await supabase.from('detail_diagnosa').delete().neq('No_Kunjungan', '');
    await supabase.from('kunjungan').delete().neq('No_Kunjungan', '');
    await supabase.from('pasien').delete().neq('No_RM', '');
    await supabase.from('dokter').delete().neq('Kode_Dokter', '');
    await supabase.from('diagnosa').delete().neq('Kode_Diagnosa', '');
    await supabase.from('obat').delete().neq('Kode_Obat', '');

    // Insert new data
    if (pasiens.length > 0) await supabase.from('pasien').insert(pasiens);
    if (dokters.length > 0) await supabase.from('dokter').insert(dokters);
    if (diagnosas.length > 0) await supabase.from('diagnosa').insert(diagnosas);
    if (obats.length > 0) await supabase.from('obat').insert(obats);
    if (kunjungans.length > 0) await supabase.from('kunjungan').insert(kunjungans);
    if (detailDiags.length > 0) await supabase.from('detail_diagnosa').insert(detailDiags);
    if (detailReseps.length > 0) await supabase.from('detail_resep').insert(detailReseps);
  } catch (error) {
    console.error('Error during batch seed operation:', error);
    throw error;
  }
};

// SQL setup script text that we can display in the UI for copy-paste
export const SUPABASE_SQL_SETUP_SCRIPT = `-- SQL Schema for Sistem Rekam Medis Klinik Anaverse
-- Silakan salin dan jalankan script ini di SQL Editor Supabase Anda:
-- https://supabase.com/dashboard/project/dlvzdajbwanhnbpjidvi/sql/new

-- 1. Tabel Pasien
CREATE TABLE IF NOT EXISTS pasien (
    "No_RM" VARCHAR(50) PRIMARY KEY,
    "Nama_Pasien" VARCHAR(100) NOT NULL,
    "Tgl_Lahir" DATE NOT NULL,
    "JK" VARCHAR(2) NOT NULL,
    "Alamat" TEXT,
    "No_Telp" VARCHAR(20)
);

-- 2. Tabel Dokter
CREATE TABLE IF NOT EXISTS dokter (
    "Kode_Dokter" VARCHAR(50) PRIMARY KEY,
    "Nama_Dokter" VARCHAR(100) NOT NULL,
    "Spesialis" VARCHAR(100) NOT NULL
);

-- 3. Tabel Diagnosa (ICD-10)
CREATE TABLE IF NOT EXISTS diagnosa (
    "Kode_Diagnosa" VARCHAR(50) PRIMARY KEY,
    "Nama_Diagnosa" VARCHAR(255) NOT NULL
);

-- 4. Tabel Obat
CREATE TABLE IF NOT EXISTS obat (
    "Kode_Obat" VARCHAR(50) PRIMARY KEY,
    "Nama_Obat" VARCHAR(100) NOT NULL,
    "Satuan" VARCHAR(50) NOT NULL,
    "Harga" DECIMAL(12, 2) NOT NULL
);

-- 5. Tabel Kunjungan
CREATE TABLE IF NOT EXISTS kunjungan (
    "No_Kunjungan" VARCHAR(50) PRIMARY KEY,
    "Tgl_Kunjungan" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Keluhan" TEXT,
    "Tensi" VARCHAR(20),
    "Suhu" NUMERIC(4, 1),
    "BB" NUMERIC(5, 1),
    "No_RM" VARCHAR(50) REFERENCES pasien("No_RM") ON DELETE CASCADE,
    "Kode_Dokter" VARCHAR(50) REFERENCES dokter("Kode_Dokter") ON DELETE SET NULL
);

-- 6. Tabel Detail Diagnosa (Composite Key / Junction Table)
CREATE TABLE IF NOT EXISTS detail_diagnosa (
    "No_Kunjungan" VARCHAR(50) REFERENCES kunjungan("No_Kunjungan") ON DELETE CASCADE,
    "Kode_Diagnosa" VARCHAR(50) REFERENCES diagnosa("Kode_Diagnosa") ON DELETE CASCADE,
    PRIMARY KEY ("No_Kunjungan", "Kode_Diagnosa")
);

-- 7. Tabel Detail Resep (Composite Key / Junction Table)
CREATE TABLE IF NOT EXISTS detail_resep (
    "No_Kunjungan" VARCHAR(50) REFERENCES kunjungan("No_Kunjungan") ON DELETE CASCADE,
    "Kode_Obat" VARCHAR(50) REFERENCES obat("Kode_Obat") ON DELETE CASCADE,
    "Dosis" VARCHAR(255) NOT NULL,
    "Jumlah" INT NOT NULL,
    PRIMARY KEY ("No_Kunjungan", "Kode_Obat")
);

-- Menyalakan akses publik bypass RLS agar client dapat mengelola data secara dinamis
ALTER TABLE pasien ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokter ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosa ENABLE ROW LEVEL SECURITY;
ALTER TABLE obat ENABLE ROW LEVEL SECURITY;
ALTER TABLE kunjungan ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_diagnosa ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_resep ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS (Row Level Security) untuk akses penuh publik (Anon)
CREATE POLICY "Allow public select" ON pasien FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON pasien FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON pasien FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON pasien FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON dokter FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON dokter FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON dokter FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON dokter FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON diagnosa FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON diagnosa FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON diagnosa FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON diagnosa FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON obat FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON obat FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON obat FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON obat FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON kunjungan FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON kunjungan FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON kunjungan FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON kunjungan FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON detail_diagnosa FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON detail_diagnosa FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON detail_diagnosa FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON detail_diagnosa FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON detail_resep FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON detail_resep FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON detail_resep FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON detail_resep FOR DELETE USING (true);

-- Tambahkan publikasi Realtime untuk sinkronisasi instan
ALTER PUBLICATION supabase_realtime ADD TABLE pasien;
ALTER PUBLICATION supabase_realtime ADD TABLE dokter;
ALTER PUBLICATION supabase_realtime ADD TABLE diagnosa;
ALTER PUBLICATION supabase_realtime ADD TABLE obat;
ALTER PUBLICATION supabase_realtime ADD TABLE kunjungan;
ALTER PUBLICATION supabase_realtime ADD TABLE detail_diagnosa;
ALTER PUBLICATION supabase_realtime ADD TABLE detail_resep;
`;
