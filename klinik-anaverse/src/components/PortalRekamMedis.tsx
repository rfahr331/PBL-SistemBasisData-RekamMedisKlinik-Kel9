import React, { useState, useEffect } from 'react';
import { 
  KlinikDB 
} from '../dbSeed';
import { 
  Pasien, Dokter, Diagnosa, DetailDiagnosa, Obat, DetailResep, Kunjungan, KunjunganLengkap 
} from '../types';
import { 
  Activity, Users, User, UserPlus, Heart, Stethoscope, Search, Plus, Edit2, Trash2, 
  X, Check, Calendar, FileText, Pill, ChevronRight, BarChart3, TrendingUp, Info, RotateCcw, ArrowLeft, ClipboardList, DollarSign, Database
} from 'lucide-react';

import { User as FirebaseUser } from '../lib/firebase';
import { 
  supabase, 
  checkSupabaseConnection, 
  getPasiens, 
  getDokters, 
  getDiagnosas, 
  getObats, 
  getKunjungans, 
  getDetailDiagnosas, 
  getDetailReseps, 
  deletePasien,
  deleteDokter,
  deleteDiagnosa,
  deleteObat,
  deleteKunjungan,
  deleteDetailDiagnosasForVisit,
  deleteDetailResepsForVisit,
  seedSupabaseData,
  SUPABASE_SQL_SETUP_SCRIPT,
  SupabaseStatus
} from '../lib/supabase';

interface PortalRekamMedisProps {
  onBackToLanding: () => void;
  user: FirebaseUser | null;
  onLogout: () => void;
}

export default function PortalRekamMedis({ onBackToLanding, user, onLogout }: PortalRekamMedisProps) {
  // DB States
  const [pasiens, setPasiens] = useState<Pasien[]>([]);
  const [dokters, setDokters] = useState<Dokter[]>([]);
  const [diagnosas, setDiagnosas] = useState<Diagnosa[]>([]);
  const [obats, setObats] = useState<Obat[]>([]);
  const [kunjungans, setKunjungans] = useState<Kunjungan[]>([]);
  const [detailDiags, setDetailDiags] = useState<DetailDiagnosa[]>([]);
  const [detailReseps, setDetailReseps] = useState<DetailResep[]>([]);

  // Supabase states
  const [dbMode, setDbMode] = useState<'supabase' | 'local'>('local');
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSqlSetupModal, setShowSqlSetupModal] = useState(false);

  // UI Active State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pasien' | 'dokter' | 'kunjungan' | 'diagnosa' | 'obat'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Detail Medical Record Modal for Pasien
  const [selectedPasienNoRM, setSelectedPasienNoRM] = useState<string | null>(null);
  
  // CRUD Form Modals
  const [showPasienModal, setShowPasienModal] = useState(false);
  const [editingPasien, setEditingPasien] = useState<Pasien | null>(null);
  const [pasienForm, setPasienForm] = useState<Omit<Pasien, 'No_RM'>>({
    Nama_Pasien: '',
    Tgl_Lahir: '',
    JK: 'L',
    Alamat: '',
    No_Telp: ''
  });

  const [showDokterModal, setShowDokterModal] = useState(false);
  const [editingDokter, setEditingDokter] = useState<Dokter | null>(null);
  const [dokterForm, setDokterForm] = useState<Omit<Dokter, 'Kode_Dokter'>>({
    Nama_Dokter: '',
    Spesialis: ''
  });

  const [showDiagnosaModal, setShowDiagnosaModal] = useState(false);
  const [editingDiagnosa, setEditingDiagnosa] = useState<Diagnosa | null>(null);
  const [diagnosaForm, setDiagnosaForm] = useState<Diagnosa>({
    Kode_Diagnosa: '',
    Nama_Diagnosa: ''
  });

  const [showObatModal, setShowObatModal] = useState(false);
  const [editingObat, setEditingObat] = useState<Obat | null>(null);
  const [obatForm, setObatForm] = useState<Omit<Obat, 'Kode_Obat'>>({
    Nama_Obat: '',
    Satuan: 'Tablet',
    Harga: 0
  });

  // Comprehensive Visit Creator Form
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedPasienRM, setSelectedPasienRM] = useState('');
  const [selectedDokterKode, setSelectedDokterKode] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitKeluhan, setVisitKeluhan] = useState('');
  const [visitTensi, setVisitTensi] = useState('');
  const [visitSuhu, setVisitSuhu] = useState(36.5);
  const [visitBB, setVisitBB] = useState(60);
  
  // Selected Diagnoses in Visit Creator
  const [visitDiagnoses, setVisitDiagnoses] = useState<string[]>([]);
  
  // Selected Medicines in Visit Creator
  const [visitMedicines, setVisitMedicines] = useState<{
    Kode_Obat: string;
    Dosis: string;
    Jumlah: number;
  }[]>([]);

  // Load database
  const loadDatabase = async () => {
    setIsSyncing(true);
    try {
      const conn = await checkSupabaseConnection();
      setSupabaseStatus(conn);
      if (conn.connected && conn.tablesExist) {
        setDbMode('supabase');
        // Fetch from Supabase
        const [pList, dList, diagList, oList, kList, detDiagList, detResepList] = await Promise.all([
          getPasiens(),
          getDokters(),
          getDiagnosas(),
          getObats(),
          getKunjungans(),
          getDetailDiagnosas(),
          getDetailReseps()
        ]);

        setPasiens(pList);
        setDokters(dList);
        setDiagnosas(diagList);
        setObats(oList);
        setKunjungans(kList);
        setDetailDiags(detDiagList);
        setDetailReseps(detResepList);
      } else {
        setDbMode('local');
        // Fallback to local storage
        setPasiens(KlinikDB.getPasien());
        setDokters(KlinikDB.getDokter());
        setDiagnosas(KlinikDB.getDiagnosa());
        setObats(KlinikDB.getObat());
        setKunjungans(KlinikDB.getKunjungan());
        setDetailDiags(KlinikDB.getDetailDiagnosa());
        setDetailReseps(KlinikDB.getDetailResep());
      }
    } catch (err) {
      console.error('Failed to load database from Supabase, falling back to LocalStorage:', err);
      setDbMode('local');
      setPasiens(KlinikDB.getPasien());
      setDokters(KlinikDB.getDokter());
      setDiagnosas(KlinikDB.getDiagnosa());
      setObats(KlinikDB.getObat());
      setKunjungans(KlinikDB.getKunjungan());
      setDetailDiags(KlinikDB.getDetailDiagnosa());
      setDetailReseps(KlinikDB.getDetailResep());
    } finally {
      setIsSyncing(false);
    }
  };

  // Load database on mount
  useEffect(() => {
    loadDatabase();
  }, []);

  const checkAdminPermission = (): boolean => {
    if (user?.email?.toLowerCase() === 'admin@anaverse.com') {
      return true;
    }
    alert('Akses Ditolak: Hanya pengguna Administrator (admin@anaverse.com) yang diizinkan untuk menghapus data. Akun Anda saat ini bertindak sebagai Pengunjung.');
    return false;
  };

  // Reset database back to default seed
  const handleResetData = async () => {
    if (!checkAdminPermission()) return;
    if (confirm('Apakah Anda yakin ingin menyetel ulang semua data rekam medis ke kondisi awal (default seed)? Semua data kustom Anda akan terhapus.')) {
      if (dbMode === 'supabase') {
        try {
          setIsSyncing(true);
          const { SEED_PASIEN: seedP, SEED_DOKTER: seedD, SEED_DIAGNOSA: seedDiag, SEED_OBAT: seedO, SEED_KUNJUNGAN: seedK, SEED_DETAIL_DIAGNOSA: seedDD, SEED_DETAIL_RESEP: seedDR } = await import('../dbSeed');
          await seedSupabaseData(
            seedP,
            seedD,
            seedDiag,
            seedO,
            seedK,
            seedDD,
            seedDR
          );
          alert('Database Supabase berhasil disetel ulang ke kondisi awal.');
        } catch (err: any) {
          alert('Gagal menyetel ulang database Supabase. Pastikan Anda telah membuat semua tabel dan mengaktifkan kebijakan akses di dashboard Supabase.\n\nError: ' + err.message);
        } finally {
          setIsSyncing(false);
          loadDatabase();
        }
      } else {
        KlinikDB.resetToSeed();
        loadDatabase();
        setSelectedPasienNoRM(null);
        alert('Database Lokal berhasil disetel ulang ke kondisi awal.');
      }
    }
  };

  // Migrate local storage to Supabase
  const handleMigrateToSupabase = async () => {
    if (!supabaseStatus?.tablesExist) {
      alert('Tabel Supabase belum terdeteksi. Silakan jalankan SQL Script penyiapan terlebih dahulu.');
      return;
    }
    if (confirm('Apakah Anda yakin ingin mengunggah semua data dari Local Storage saat ini ke database Supabase? Tindakan ini akan menimpa data yang ada di Supabase.')) {
      try {
        setIsSyncing(true);
        await seedSupabaseData(
          pasiens,
          dokters,
          diagnosas,
          obats,
          kunjungans,
          detailDiags,
          detailReseps
        );
        alert('Selesai! Seluruh data lokal Anda berhasil diunggah dan disinkronkan ke Supabase.');
        loadDatabase();
      } catch (err: any) {
        alert('Gagal mengunggah data: ' + err.message);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Save specific datasets
  const updatePasiensInDB = async (data: Pasien[], deletedNoRM?: string) => {
    setPasiens(data);
    KlinikDB.savePasien(data);
    if (dbMode === 'supabase') {
      try {
        setIsSyncing(true);
        if (deletedNoRM) {
          await deletePasien(deletedNoRM);
        } else {
          await supabase.from('pasien').upsert(data);
        }
      } catch (err: any) {
        alert('Gagal menyimpan ke Supabase: ' + err.message);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const updateDoktersInDB = async (data: Dokter[], deletedKode?: string) => {
    setDokters(data);
    KlinikDB.saveDokter(data);
    if (dbMode === 'supabase') {
      try {
        setIsSyncing(true);
        if (deletedKode) {
          await deleteDokter(deletedKode);
        } else {
          await supabase.from('dokter').upsert(data);
        }
      } catch (err: any) {
        alert('Gagal menyimpan ke Supabase: ' + err.message);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const updateDiagnosasInDB = async (data: Diagnosa[], deletedKode?: string) => {
    setDiagnosas(data);
    KlinikDB.saveDiagnosa(data);
    if (dbMode === 'supabase') {
      try {
        setIsSyncing(true);
        if (deletedKode) {
          await deleteDiagnosa(deletedKode);
        } else {
          await supabase.from('diagnosa').upsert(data);
        }
      } catch (err: any) {
        alert('Gagal menyimpan ke Supabase: ' + err.message);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const updateObatsInDB = async (data: Obat[], deletedKode?: string) => {
    setObats(data);
    KlinikDB.saveObat(data);
    if (dbMode === 'supabase') {
      try {
        setIsSyncing(true);
        if (deletedKode) {
          await deleteObat(deletedKode);
        } else {
          await supabase.from('obat').upsert(data);
        }
      } catch (err: any) {
        alert('Gagal menyimpan ke Supabase: ' + err.message);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Complete aggregate array representing fully joined relationships (KunjunganLengkap)
  const getKunjunganLengkapList = (): KunjunganLengkap[] => {
    // We sort visits newest first
    const sorted = [...kunjungans].sort(
      (a, b) => new Date(b.Tgl_Kunjungan).getTime() - new Date(a.Tgl_Kunjungan).getTime()
    );

    return sorted.map((visit) => {
      const pasien = pasiens.find((p) => p.No_RM === visit.No_RM);
      const dokter = dokters.find((d) => d.Kode_Dokter === visit.Kode_Dokter);

      // Diagnoses
      const linkedDiagCodes = detailDiags
        .filter((d) => d.No_Kunjungan === visit.No_Kunjungan)
        .map((d) => d.Kode_Diagnosa);
      const diagnosaList = diagnosas.filter((d) => linkedDiagCodes.includes(d.Kode_Diagnosa));

      // Medicines
      const resepList = detailReseps
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
  };

  const kunjunganLengkapList = getKunjunganLengkapList();

  // Helper to format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  // Helper to calculate patient age
  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return '-';
    const birth = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} Tahun`;
  };

  // ================= PASIEN ACTIONS =================
  const openPasienAddModal = () => {
    setEditingPasien(null);
    setPasienForm({
      Nama_Pasien: '',
      Tgl_Lahir: '',
      JK: 'L',
      Alamat: '',
      No_Telp: ''
    });
    setShowPasienModal(true);
  };

  const openPasienEditModal = (p: Pasien, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPasien(p);
    setPasienForm({
      Nama_Pasien: p.Nama_Pasien,
      Tgl_Lahir: p.Tgl_Lahir,
      JK: p.JK,
      Alamat: p.Alamat,
      No_Telp: p.No_Telp
    });
    setShowPasienModal(true);
  };

  const handleSavePasien = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasienForm.Nama_Pasien || !pasienForm.Tgl_Lahir || !pasienForm.No_Telp) {
      alert('Mohon lengkapi semua field wajib.');
      return;
    }

    if (editingPasien) {
      // Edit mode
      const updated = pasiens.map((p) => 
        p.No_RM === editingPasien.No_RM ? { ...p, ...pasienForm } : p
      );
      updatePasiensInDB(updated);
    } else {
      // Add mode - generate new No_RM like RM-006
      const lastNum = pasiens.reduce((max, p) => {
        const num = parseInt(p.No_RM.replace('RM-', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);
      const nextNoRM = `RM-${String(lastNum + 1).padStart(3, '0')}`;
      
      const newPasien: Pasien = {
        No_RM: nextNoRM,
        ...pasienForm
      };
      updatePasiensInDB([...pasiens, newPasien]);
    }

    setShowPasienModal(false);
  };

  const handleDeletePasien = (noRM: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!checkAdminPermission()) return;
    if (confirm(`Apakah Anda yakin ingin menghapus pasien dengan No. RM ${noRM}? Semua riwayat kunjungannya juga akan kehilangan data pasien ini.`)) {
      const filtered = pasiens.filter((p) => p.No_RM !== noRM);
      updatePasiensInDB(filtered, noRM);
    }
  };


  // ================= DOKTER ACTIONS =================
  const openDokterAddModal = () => {
    setEditingDokter(null);
    setDokterForm({
      Nama_Dokter: '',
      Spesialis: 'Dokter Umum'
    });
    setShowDokterModal(true);
  };

  const openDokterEditModal = (d: Dokter) => {
    setEditingDokter(d);
    setDokterForm({
      Nama_Dokter: d.Nama_Dokter,
      Spesialis: d.Spesialis
    });
    setShowDokterModal(true);
  };

  const handleSaveDokter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dokterForm.Nama_Dokter || !dokterForm.Spesialis) {
      alert('Mohon lengkapi semua field wajib.');
      return;
    }

    if (editingDokter) {
      const updated = dokters.map((d) => 
        d.Kode_Dokter === editingDokter.Kode_Dokter ? { ...d, ...dokterForm } : d
      );
      updateDoktersInDB(updated);
    } else {
      const lastNum = dokters.reduce((max, d) => {
        const num = parseInt(d.Kode_Dokter.replace('DKR-', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);
      const nextKode = `DKR-${String(lastNum + 1).padStart(3, '0')}`;
      const newDokter: Dokter = {
        Kode_Dokter: nextKode,
        ...dokterForm
      };
      updateDoktersInDB([...dokters, newDokter]);
    }
    setShowDokterModal(false);
  };

  const handleDeleteDokter = (kode: string) => {
    if (!checkAdminPermission()) return;
    if (confirm(`Apakah Anda yakin ingin menghapus Dokter ${kode}?`)) {
      const filtered = dokters.filter((d) => d.Kode_Dokter !== kode);
      updateDoktersInDB(filtered, kode);
    }
  };


  // ================= DIAGNOSA ACTIONS =================
  const openDiagnosaAddModal = () => {
    setEditingDiagnosa(null);
    setDiagnosaForm({
      Kode_Diagnosa: '',
      Nama_Diagnosa: ''
    });
    setShowDiagnosaModal(true);
  };

  const openDiagnosaEditModal = (diag: Diagnosa) => {
    setEditingDiagnosa(diag);
    setDiagnosaForm(diag);
    setShowDiagnosaModal(true);
  };

  const handleSaveDiagnosa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosaForm.Kode_Diagnosa || !diagnosaForm.Nama_Diagnosa) {
      alert('Mohon lengkapi semua field wajib.');
      return;
    }

    if (editingDiagnosa) {
      const updated = diagnosas.map((d) => 
        d.Kode_Diagnosa === editingDiagnosa.Kode_Diagnosa ? diagnosaForm : d
      );
      updateDiagnosasInDB(updated);
    } else {
      // Check if code duplicate
      if (diagnosas.some((d) => d.Kode_Diagnosa.toLowerCase() === diagnosaForm.Kode_Diagnosa.toLowerCase())) {
        alert('Kode Diagnosa sudah terdaftar di sistem.');
        return;
      }
      updateDiagnosasInDB([...diagnosas, diagnosaForm]);
    }
    setShowDiagnosaModal(false);
  };

  const handleDeleteDiagnosa = (kode: string) => {
    if (!checkAdminPermission()) return;
    if (confirm(`Apakah Anda yakin ingin menghapus Diagnosa ${kode}?`)) {
      const filtered = diagnosas.filter((d) => d.Kode_Diagnosa !== kode);
      updateDiagnosasInDB(filtered, kode);
    }
  };


  // ================= OBAT ACTIONS =================
  const openObatAddModal = () => {
    setEditingObat(null);
    setObatForm({
      Nama_Obat: '',
      Satuan: 'Tablet',
      Harga: 0
    });
    setShowObatModal(true);
  };

  const openObatEditModal = (o: Obat) => {
    setEditingObat(o);
    setObatForm({
      Nama_Obat: o.Nama_Obat,
      Satuan: o.Satuan,
      Harga: o.Harga
    });
    setShowObatModal(true);
  };

  const handleSaveObat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obatForm.Nama_Obat || !obatForm.Satuan || obatForm.Harga <= 0) {
      alert('Mohon lengkapi semua field wajib dan isi harga yang valid.');
      return;
    }

    if (editingObat) {
      const updated = obats.map((o) => 
        o.Kode_Obat === editingObat.Kode_Obat ? { ...o, ...obatForm } : o
      );
      updateObatsInDB(updated);
    } else {
      const lastNum = obats.reduce((max, o) => {
        const num = parseInt(o.Kode_Obat.replace('OBT-', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);
      const nextKode = `OBT-${String(lastNum + 1).padStart(3, '0')}`;
      const newObat: Obat = {
        Kode_Obat: nextKode,
        ...obatForm
      };
      updateObatsInDB([...obats, newObat]);
    }
    setShowObatModal(false);
  };

  const handleDeleteObat = (kode: string) => {
    if (!checkAdminPermission()) return;
    if (confirm(`Apakah Anda yakin ingin menghapus Obat ${kode}?`)) {
      const filtered = obats.filter((o) => o.Kode_Obat !== kode);
      updateObatsInDB(filtered, kode);
    }
  };


  // ================= KUNJUNGAN (COMPREHENSIVE VISIT LOG) ACTIONS =================
  const openVisitAddModal = () => {
    if (pasiens.length === 0) {
      alert('Belum ada pasien terdaftar. Silakan tambahkan pasien terlebih dahulu.');
      return;
    }
    if (dokters.length === 0) {
      alert('Belum ada dokter terdaftar. Silakan tambahkan dokter terlebih dahulu.');
      return;
    }

    // Set defaults
    setSelectedPasienRM(pasiens[0].No_RM);
    setSelectedDokterKode(dokters[0].Kode_Dokter);
    
    // Default to current date/time in local format YYYY-MM-DDTHH:MM
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    setVisitDate(formattedDate);
    
    setVisitKeluhan('');
    setVisitTensi('120/80');
    setVisitSuhu(36.5);
    setVisitBB(65);
    setVisitDiagnoses([]);
    setVisitMedicines([]);
    
    setShowVisitModal(true);
  };

  // Add a diagnosis to the visit form list
  const toggleVisitDiagnosis = (kode: string) => {
    if (visitDiagnoses.includes(kode)) {
      setVisitDiagnoses(visitDiagnoses.filter((c) => c !== kode));
    } else {
      setVisitDiagnoses([...visitDiagnoses, kode]);
    }
  };

  // Add prescription line item
  const addPrescriptionItem = () => {
    if (obats.length === 0) {
      alert('Tidak ada obat dalam database.');
      return;
    }
    setVisitMedicines([
      ...visitMedicines,
      { Kode_Obat: obats[0].Kode_Obat, Dosis: '3 x sehari 1 tablet setelah makan', Jumlah: 10 }
    ]);
  };

  // Update prescription line item
  const updatePrescriptionItem = (index: number, key: 'Kode_Obat' | 'Dosis' | 'Jumlah', val: any) => {
    const updated = [...visitMedicines];
    updated[index] = {
      ...updated[index],
      [key]: val
    };
    setVisitMedicines(updated);
  };

  // Remove prescription line item
  const removePrescriptionItem = (index: number) => {
    setVisitMedicines(visitMedicines.filter((_, idx) => idx !== index));
  };

  // Create complete visit & linkages
  const handleCreateKunjunganLengkap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitKeluhan.trim() || !visitTensi.trim()) {
      alert('Mohon isi keluhan dan tensi darah.');
      return;
    }

    // Generate next visit number KJN-005
    const lastNum = kunjungans.reduce((max, k) => {
      const num = parseInt(k.No_Kunjungan.replace('KJN-', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextNoKunjungan = `KJN-${String(lastNum + 1).padStart(3, '0')}`;

    // 1. Create main Kunjungan record
    const newKunjungan: Kunjungan = {
      No_Kunjungan: nextNoKunjungan,
      Tgl_Kunjungan: visitDate,
      Keluhan: visitKeluhan,
      Tensi: visitTensi,
      Suhu: Number(visitSuhu),
      BB: Number(visitBB),
      No_RM: selectedPasienRM,
      Kode_Dokter: selectedDokterKode
    };

    // 2. Create DetailDiagnosa linkages
    const newDetailDiags: DetailDiagnosa[] = visitDiagnoses.map((diagCode) => ({
      No_Kunjungan: nextNoKunjungan,
      Kode_Diagnosa: diagCode
    }));

    // 3. Create DetailResep linkages
    const newDetailReseps: DetailResep[] = visitMedicines.map((med) => ({
      No_Kunjungan: nextNoKunjungan,
      Kode_Obat: med.Kode_Obat,
      Dosis: med.Dosis,
      Jumlah: Number(med.Jumlah)
    }));

    // Save all to local states & localStorage
    const updatedKunjungans = [...kunjungans, newKunjungan];
    setKunjungans(updatedKunjungans);
    KlinikDB.saveKunjungan(updatedKunjungans);

    const updatedDetailDiags = [...detailDiags, ...newDetailDiags];
    setDetailDiags(updatedDetailDiags);
    KlinikDB.saveDetailDiagnosa(updatedDetailDiags);

    const updatedDetailReseps = [...detailReseps, ...newDetailReseps];
    setDetailReseps(updatedDetailReseps);
    KlinikDB.saveDetailResep(updatedDetailReseps);

    if (dbMode === 'supabase') {
      try {
        setIsSyncing(true);
        // Save to Supabase
        await supabase.from('kunjungan').insert(newKunjungan);
        if (newDetailDiags.length > 0) {
          await supabase.from('detail_diagnosa').insert(newDetailDiags);
        }
        if (newDetailReseps.length > 0) {
          await supabase.from('detail_resep').insert(newDetailReseps);
        }
      } catch (err: any) {
        alert('Gagal menyimpan rekam medis ke Supabase: ' + err.message);
      } finally {
        setIsSyncing(false);
      }
    }

    setShowVisitModal(false);
    alert(`Rekam Kunjungan ${nextNoKunjungan} sukses disimpan bersama diagnosa dan resep!`);
  };

  // Delete Kunjungan & clean associated relationships
  const handleDeleteKunjungan = async (noKunjungan: string) => {
    if (!checkAdminPermission()) return;
    if (confirm(`Apakah Anda yakin ingin menghapus rekam kunjungan ${noKunjungan}? Seluruh detail diagnosa dan resep yang tertaut juga akan dihapus secara permanen.`)) {
      // Filter Kunjungan
      const filteredK = kunjungans.filter((k) => k.No_Kunjungan !== noKunjungan);
      setKunjungans(filteredK);
      KlinikDB.saveKunjungan(filteredK);

      // Filter linkages
      const filteredDiag = detailDiags.filter((d) => d.No_Kunjungan !== noKunjungan);
      setDetailDiags(filteredDiag);
      KlinikDB.saveDetailDiagnosa(filteredDiag);

      const filteredResep = detailReseps.filter((r) => r.No_Kunjungan !== noKunjungan);
      setDetailReseps(filteredResep);
      KlinikDB.saveDetailResep(filteredResep);

      if (dbMode === 'supabase') {
        try {
          setIsSyncing(true);
          // Delete associations first due to foreign key constraints
          await deleteDetailDiagnosasForVisit(noKunjungan);
          await deleteDetailResepsForVisit(noKunjungan);
          await deleteKunjungan(noKunjungan);
        } catch (err: any) {
          alert('Gagal menghapus rekam medis dari Supabase: ' + err.message);
        } finally {
          setIsSyncing(false);
        }
      }
    }
  };


  // ================= STATISTICS & CHART CALCULATIONS =================
  // 1. Most frequent diagnoses (ICD-10)
  const getTopDiagnoses = () => {
    const counts: { [key: string]: { name: string; count: number } } = {};
    
    // Seed initial structure to ensure we count
    detailDiags.forEach((link) => {
      const diagObj = diagnosas.find((d) => d.Kode_Diagnosa === link.Kode_Diagnosa);
      const name = diagObj ? diagObj.Nama_Diagnosa : link.Kode_Diagnosa;
      
      if (!counts[link.Kode_Diagnosa]) {
        counts[link.Kode_Diagnosa] = { name, count: 0 };
      }
      counts[link.Kode_Diagnosa].count++;
    });

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5
  };

  const topDiagnoses = getTopDiagnoses();

  // 2. Gender distribution
  const maleCount = pasiens.filter((p) => p.JK === 'L').length;
  const femaleCount = pasiens.filter((p) => p.JK === 'P').length;

  // 3. Drug prescription analytics
  const totalPrescriptionValue = () => {
    return detailReseps.reduce((sum, res) => {
      const targetObat = obats.find((o) => o.Kode_Obat === res.Kode_Obat);
      const price = targetObat ? targetObat.Harga : 0;
      return sum + (price * res.Jumlah);
    }, 0);
  };

  // Filter lists based on Search Terms
  const filteredPasiensList = pasiens.filter((p) => 
    p.Nama_Pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.No_RM.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.No_Telp.includes(searchTerm) ||
    p.Alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDoktersList = dokters.filter((d) => 
    d.Nama_Dokter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.Spesialis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.Kode_Dokter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDiagnosasList = diagnosas.filter((d) => 
    d.Nama_Diagnosa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.Kode_Diagnosa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredObatsList = obats.filter((o) => 
    o.Nama_Obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.Kode_Obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.Satuan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKunjungansList = kunjunganLengkapList.filter((k) => 
    k.No_Kunjungan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.pasien?.Nama_Pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.dokter?.Nama_Dokter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.Keluhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.diagnosaList.some((d) => d.Nama_Diagnosa.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* SIDEBAR AND WORKSPACE PORTAL CONTAINER */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Portal Left Sidebar */}
        <aside className="w-full lg:w-72 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between shrink-0">
          <div>
            {/* Sidebar Branding Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  <Activity size={20} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-500 block">SIMRS PORTAL</span>
                  <span className="font-extrabold text-base tracking-tight text-white">REKAM MEDIS</span>
                </div>
              </div>
              <button 
                onClick={onBackToLanding}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                title="Keluar ke Website Utama"
              >
                <ArrowLeft size={16} />
              </button>
            </div>

            {/* Sidebar Navigation Options */}
            <nav className="p-4 space-y-1.5">
              <button
                onClick={() => { setActiveTab('dashboard'); setSearchTerm(''); }}
                className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <BarChart3 size={18} />
                <span>Dashboard & Statistik</span>
              </button>

              <button
                onClick={() => { setActiveTab('pasien'); setSearchTerm(''); }}
                className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                  activeTab === 'pasien' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Users size={18} />
                <span>Data Pasien (RM)</span>
              </button>

              <button
                onClick={() => { setActiveTab('dokter'); setSearchTerm(''); }}
                className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                  activeTab === 'dokter' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Stethoscope size={18} />
                <span>Data Dokter</span>
              </button>

              <button
                onClick={() => { setActiveTab('kunjungan'); setSearchTerm(''); }}
                className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                  activeTab === 'kunjungan' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <ClipboardList size={18} />
                <span>Riwayat Kunjungan</span>
              </button>

              <button
                onClick={() => { setActiveTab('diagnosa'); setSearchTerm(''); }}
                className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                  activeTab === 'diagnosa' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <FileText size={18} />
                <span>Katalog Diagnosa</span>
              </button>

              <button
                onClick={() => { setActiveTab('obat'); setSearchTerm(''); }}
                className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                  activeTab === 'obat' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Pill size={18} />
                <span>Katalog Obat / Farmasi</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Foot Utilities */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            {/* Database Engine Status */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block leading-none mb-2">Database Backend</span>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${dbMode === 'supabase' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-xs font-bold text-slate-200">
                    {dbMode === 'supabase' ? 'Supabase Cloud' : 'Lokal (LocalStorage)'}
                  </span>
                </div>
                {isSyncing && (
                  <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              
              {dbMode === 'local' ? (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {supabaseStatus?.connected ? 'Tabel belum ada di Supabase.' : 'Belum terhubung ke Supabase.'}
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setShowSqlSetupModal(true)}
                      className="flex-1 py-1 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer"
                    >
                      Siapkan SQL
                    </button>
                    <button
                      onClick={loadDatabase}
                      className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer"
                      title="Segarkan Koneksi"
                    >
                      Cek
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-emerald-400 font-medium leading-none mb-1">Terhubung ke Cloud!</p>
                  <button
                    onClick={handleMigrateToSupabase}
                    className="w-full py-1 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer"
                  >
                    Unggah Data Lokal
                  </button>
                </div>
              )}
            </div>

            {user && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt={user.displayName || 'Staf Medis'}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow-inner"
                />
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-400 block leading-none">Petugas Medis</span>
                  <span className="text-xs font-bold text-white block truncate leading-tight mt-0.5">{user.displayName || 'Nama Pengguna'}</span>
                  <span className="text-[10px] text-slate-500 block truncate leading-none mt-0.5">{user.email || 'staf@anaverse.com'}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Keluar dari Sistem"
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  <ArrowLeft size={16} className="rotate-180" />
                </button>
              </div>
            )}

            <button
              onClick={handleResetData}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Database</span>
            </button>

            <button
              onClick={onBackToLanding}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-800 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Kembali Ke Web Utama</span>
            </button>
          </div>
        </aside>

        {/* Portal Main Workspace Content */}
        <main className="flex-1 bg-slate-900 p-4 sm:p-8 overflow-y-auto">
          
          {/* Top Info Bar */}
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">SIMRS Klinik Anaverse</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white capitalize">{activeTab} Manager</h1>
            </div>
            
            {/* Quick search input */}
            {activeTab !== 'dashboard' && (
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder={`Cari ${activeTab === 'pasien' ? 'Nama / No RM...' : 'data...'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            )}
          </header>


          {/* 1. VIEW TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Metric Card Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-500 group-hover:scale-110 transition-transform">
                    <Users size={80} />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users size={22} /></span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Total Pasien</span>
                  </div>
                  <div className="text-3xl font-black text-white">{pasiens.length}</div>
                  <div className="text-xs text-slate-400 mt-2">Nomor Rekam Medis terdaftar</div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform">
                    <ClipboardList size={80} />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><ClipboardList size={22} /></span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Total Kunjungan</span>
                  </div>
                  <div className="text-3xl font-black text-white">{kunjungans.length}</div>
                  <div className="text-xs text-slate-400 mt-2">Log pemeriksaan selesai</div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-purple-500 group-hover:scale-110 transition-transform">
                    <Stethoscope size={80} />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Stethoscope size={22} /></span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Aktif Dokter</span>
                  </div>
                  <div className="text-3xl font-black text-white">{dokters.length}</div>
                  <div className="text-xs text-slate-400 mt-2">Ahli spesialis & umum</div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-500 group-hover:scale-110 transition-transform">
                    <Pill size={80} />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><Pill size={22} /></span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Nilai Resep</span>
                  </div>
                  <div className="text-xl font-bold text-white leading-8">{formatRupiah(totalPrescriptionValue())}</div>
                  <div className="text-xs text-slate-400 mt-1">Akumulasi transaksi farmasi</div>
                </div>

              </div>

              {/* Grid 2: Charts & Quick Actions & Recents */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left block: Disease Analytics (ICD-10) and Demographic stats */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Diagnosis prevalence visual */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="text-blue-500" size={18} />
                        <h3 className="font-bold text-white text-base">Distribusi Diagnosa Terbanyak (Prevalensi Penyakit)</h3>
                      </div>
                      <span className="text-xs text-slate-500">Grafik Berdasarkan Kunjungan</span>
                    </div>

                    <div className="space-y-4">
                      {topDiagnoses.length === 0 ? (
                        <p className="text-slate-500 text-xs text-center py-6">Belum ada data diagnosa tercatat dari riwayat kunjungan.</p>
                      ) : (
                        topDiagnoses.map((diag, i) => {
                          // Find percentage relative to total linkages
                          const percent = Math.round((diag.count / detailDiags.length) * 100);
                          return (
                            <div key={i} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-300 truncate max-w-md">{diag.name}</span>
                                <span className="text-blue-400 shrink-0">{diag.count} Kasus ({percent}%)</span>
                              </div>
                              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" 
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Demographics widget and statistics alerts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        <span>Demografi Pasien (Gender)</span>
                      </h4>
                      <div className="flex items-center justify-around py-4">
                        <div className="text-center">
                          <div className="text-2xl font-black text-blue-400">{maleCount}</div>
                          <div className="text-xs text-slate-500 font-semibold">Laki-laki</div>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-800" />
                        <div className="text-center">
                          <div className="text-2xl font-black text-rose-400">{femaleCount}</div>
                          <div className="text-xs text-slate-500 font-semibold">Perempuan</div>
                        </div>
                      </div>
                      <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${pasiens.length ? (maleCount/pasiens.length)*100 : 50}%` }}
                        />
                        <div 
                          className="h-full bg-rose-500" 
                          style={{ width: `${pasiens.length ? (femaleCount/pasiens.length)*100 : 50}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <TrendingUp size={16} className="text-emerald-500" />
                          <span>Status SIMRS Integrasi</span>
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Sistem Rekam Medis Klinik Anaverse telah memenuhi standar standarisasi kode ICD-10 untuk diagnosa penyakit dan keselarasan database farmasi.
                        </p>
                      </div>
                      <div className="pt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                        <Check size={14} />
                        <span>Database Sinkron (Lokal Terenkripsi)</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Right block: Quick Actions and Recent Visits */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Quick Action Buttons */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-slate-950 p-6 rounded-2xl border border-blue-800/20 space-y-4">
                    <h3 className="font-bold text-white text-sm">Aksi Cepat Rekam Medis</h3>
                    <div className="space-y-2.5">
                      <button 
                        onClick={openVisitAddModal}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                      >
                        <Plus size={16} />
                        <span>Catat Kunjungan & Resep</span>
                      </button>
                      <button 
                        onClick={openPasienAddModal}
                        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-800"
                      >
                        <UserPlus size={16} className="text-blue-500" />
                        <span>Daftarkan Pasien Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Visits (joined representation) */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">Kunjungan Terbaru</h3>
                      <button 
                        onClick={() => setActiveTab('kunjungan')}
                        className="text-xs text-blue-500 hover:underline font-bold"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {kunjunganLengkapList.slice(0, 3).map((item, i) => (
                        <div 
                          key={i} 
                          className="p-3 bg-slate-900/50 hover:bg-slate-900 rounded-xl border border-slate-800/80 transition-colors flex items-start gap-3 cursor-pointer"
                          onClick={() => {
                            if (item.No_RM) {
                              setSelectedPasienNoRM(item.No_RM);
                            }
                          }}
                        >
                          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0 mt-0.5">
                            <User size={16} />
                          </div>
                          <div className="space-y-1 overflow-hidden">
                            <div className="flex justify-between items-center gap-2">
                              <h4 className="font-bold text-white text-xs truncate">{item.pasien?.Nama_Pasien || 'Pasien Terhapus'}</h4>
                              <span className="text-[10px] font-mono text-slate-500 shrink-0">{item.No_Kunjungan}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate leading-snug">Keluhan: {item.Keluhan}</p>
                            <div className="flex gap-2 text-[10px] text-slate-500">
                              <span>Tensi: {item.Tensi}</span>
                              <span>•</span>
                              <span>Suhu: {item.Suhu}°C</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {kunjunganLengkapList.length === 0 && (
                        <p className="text-slate-500 text-xs text-center py-4">Belum ada riwayat kunjungan tercatat.</p>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}


          {/* 2. VIEW TAB: PASIEN */}
          {activeTab === 'pasien' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 font-semibold">Menampilkan {filteredPasiensList.length} dari {pasiens.length} pasien terdaftar.</p>
                <button
                  onClick={openPasienAddModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <UserPlus size={16} />
                  <span>Tambah Pasien Baru</span>
                </button>
              </div>

              {/* Patients Grid Table */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">No. RM</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Nama Lengkap</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Lahir / Umur</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Gender</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">No. Telepon</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Alamat Lengkap</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Aksi Rekam Medis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {filteredPasiensList.map((p) => (
                        <tr 
                          key={p.No_RM} 
                          className="hover:bg-slate-900/50 transition-colors cursor-pointer group"
                          onClick={() => setSelectedPasienNoRM(p.No_RM)}
                        >
                          <td className="p-4 font-mono font-bold text-blue-400">{p.No_RM}</td>
                          <td className="p-4 font-bold text-white group-hover:text-blue-400 transition-colors">{p.Nama_Pasien}</td>
                          <td className="p-4">
                            <div className="text-slate-200">{p.Tgl_Lahir}</div>
                            <div className="text-xs text-slate-500">{calculateAge(p.Tgl_Lahir)}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                              p.JK === 'L' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {p.JK === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-300">{p.No_Telp}</td>
                          <td className="p-4 text-xs text-slate-400 max-w-xs truncate">{p.Alamat}</td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedPasienNoRM(p.No_RM)}
                                title="Buka Rekam Medis Lengkap"
                                className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                              >
                                <ClipboardList size={14} />
                              </button>
                              <button
                                onClick={(e) => openPasienEditModal(p, e)}
                                title="Edit Biodata Pasien"
                                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition-all border border-slate-850"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={(e) => handleDeletePasien(p.No_RM, e)}
                                title="Hapus Pasien"
                                className="p-2 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded-lg transition-all border border-slate-850 hover:border-red-900"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredPasiensList.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">Pasien tidak ditemukan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* 3. VIEW TAB: DOKTER */}
          {activeTab === 'dokter' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 font-semibold">Menampilkan {filteredDoktersList.length} dari {dokters.length} dokter terdaftar.</p>
                <button
                  onClick={openDokterAddModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Plus size={16} />
                  <span>Tambah Dokter Baru</span>
                </button>
              </div>

              {/* Doctors Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoktersList.map((d) => (
                  <div key={d.Kode_Dokter} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors relative group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">{d.Kode_Dokter}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openDokterEditModal(d)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteDokter(d.Kode_Dokter)}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-950/40 rounded-lg transition-all border border-slate-800 hover:border-red-950"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-extrabold text-white text-base group-hover:text-blue-400 transition-colors">{d.Nama_Dokter}</h4>
                        <p className="text-slate-400 text-xs flex items-center gap-1.5">
                          <Stethoscope size={14} className="text-blue-500" />
                          <span>{d.Spesialis}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900 text-[10px] text-slate-500">
                      Terhubung pada database SIMRS Anaverse
                    </div>
                  </div>
                ))}

                {filteredDoktersList.length === 0 && (
                  <p className="text-slate-500 text-xs text-center col-span-3 py-8">Dokter tidak ditemukan.</p>
                )}
              </div>

            </div>
          )}


          {/* 4. VIEW TAB: KUNJUNGAN (MEDICAL VISIT LOGS) */}
          {activeTab === 'kunjungan' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 font-semibold">Menampilkan {filteredKunjungansList.length} riwayat kunjungan medis.</p>
                <button
                  onClick={openVisitAddModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Plus size={16} />
                  <span>Catat Kunjungan Baru</span>
                </button>
              </div>

              {/* Complete Joined Visit Log Card Stream */}
              <div className="space-y-6">
                {filteredKunjungansList.map((item) => (
                  <div key={item.No_Kunjungan} className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6 hover:border-slate-700 transition-colors">
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-600/10 text-blue-400 font-mono font-black text-xs rounded-lg border border-blue-500/20">
                          {item.No_Kunjungan}
                        </span>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{new Date(item.Tgl_Kunjungan).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteKunjungan(item.No_Kunjungan)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                          <span>Hapus Log</span>
                        </button>
                      </div>
                    </div>

                    {/* Patients & Doctors Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Pasien Terperiksa</span>
                        {item.pasien ? (
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-white text-sm hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setSelectedPasienNoRM(item.pasien!.No_RM)}>
                              {item.pasien.Nama_Pasien}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">No. RM: {item.pasien.No_RM} ({calculateAge(item.pasien.Tgl_Lahir)})</p>
                          </div>
                        ) : (
                          <span className="text-xs text-red-400 font-bold block">Biodata Pasien Terhapus</span>
                        )}
                      </div>

                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Dokter Pemeriksa</span>
                        {item.dokter ? (
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-white text-sm">{item.dokter.Nama_Dokter}</h4>
                            <p className="text-xs text-blue-400">{item.dokter.Spesialis}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-red-400 font-bold block">Dokter Terhapus</span>
                        )}
                      </div>

                    </div>

                    {/* Vitals, Complaints, and Diagnoses */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Vitals */}
                      <div className="md:col-span-3 space-y-4">
                        <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Tanda Vital (Vitals)</span>
                        <div className="space-y-2.5 text-xs font-semibold">
                          <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                            <span className="text-slate-500">Tekanan Darah:</span>
                            <span className="text-white">{item.Tensi} mmHg</span>
                          </div>
                          <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                            <span className="text-slate-500">Suhu Badan:</span>
                            <span className={`text-white ${item.Suhu > 37.5 ? 'text-rose-400 font-bold' : ''}`}>{item.Suhu} °C</span>
                          </div>
                          <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
                            <span className="text-slate-500">Berat Badan:</span>
                            <span className="text-white">{item.BB} Kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Complaint and Diagnoses mapped */}
                      <div className="md:col-span-9 space-y-4">
                        
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Anamnesis / Keluhan Pasien</span>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-850">{item.Keluhan}</p>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Diagnosa Klinis (ICD-10)</span>
                          <div className="flex flex-wrap gap-2">
                            {item.diagnosaList.map((d) => (
                              <span key={d.Kode_Diagnosa} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold">
                                {d.Kode_Diagnosa} - {d.Nama_Diagnosa}
                              </span>
                            ))}
                            {item.diagnosaList.length === 0 && (
                              <span className="text-xs text-slate-500 italic">Tidak ada kode diagnosa terpetakan.</span>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Prescription medicines */}
                    <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-850/60 space-y-3">
                      <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                        <Pill size={14} className="text-amber-500" />
                        <span>Rincian Resep Dokter (Prescription)</span>
                      </span>
                      
                      <div className="space-y-2.5">
                        {item.resepList.map((res, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs p-2 bg-slate-900/60 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{res.obat.Nama_Obat}</span>
                              <span className="text-slate-500 text-[11px]">({res.obat.Satuan})</span>
                              <span className="text-slate-500 font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                Dosis: {res.Dosis}
                              </span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-6 text-[11px]">
                              <span className="text-slate-400">Qty: {res.Jumlah}</span>
                              <span className="text-slate-300 font-bold font-mono">
                                Total: {formatRupiah(res.obat.Harga * res.Jumlah)}
                              </span>
                            </div>
                          </div>
                        ))}

                        {item.resepList.length === 0 && (
                          <p className="text-slate-500 text-xs italic">Tanpa pemberian resep obat pada kunjungan ini.</p>
                        )}
                      </div>
                    </div>

                  </div>
                ))}

                {filteredKunjungansList.length === 0 && (
                  <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center">
                    <p className="text-slate-500 text-xs">Riwayat kunjungan medis tidak ditemukan.</p>
                  </div>
                )}
              </div>

            </div>
          )}


          {/* 5. VIEW TAB: DIAGNOSA CATALOG */}
          {activeTab === 'diagnosa' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 font-semibold">Menampilkan {filteredDiagnosasList.length} dari {diagnosas.length} kode diagnosa standar ICD-10.</p>
                <button
                  onClick={openDiagnosaAddModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Plus size={16} />
                  <span>Tambah Kode Diagnosa</span>
                </button>
              </div>

              {/* Diagnosa list table */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider w-40">Kode Diagnosa (ICD-10)</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Deskripsi Penyakit / Diagnosa</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {filteredDiagnosasList.map((d) => (
                        <tr key={d.Kode_Diagnosa} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-4 font-mono font-bold text-indigo-400">{d.Kode_Diagnosa}</td>
                          <td className="p-4 font-bold text-white">{d.Nama_Diagnosa}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openDiagnosaEditModal(d)}
                                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition-all"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteDiagnosa(d.Kode_Diagnosa)}
                                className="p-2 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredDiagnosasList.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-slate-500 text-xs">Diagnosa penyakit tidak ditemukan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


          {/* 6. VIEW TAB: OBAT / FARMASI */}
          {activeTab === 'obat' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 font-semibold">Menampilkan {filteredObatsList.length} dari {obats.length} ketersediaan obat farmasi.</p>
                <button
                  onClick={openObatAddModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                  <Plus size={16} />
                  <span>Tambah Obat Baru</span>
                </button>
              </div>

              {/* Obat list table */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider w-40">Kode Obat</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Nama Sediaan Obat</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Satuan</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Harga per Satuan</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {filteredObatsList.map((o) => (
                        <tr key={o.Kode_Obat} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-4 font-mono font-bold text-amber-500">{o.Kode_Obat}</td>
                          <td className="p-4 font-bold text-white">{o.Nama_Obat}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-md text-xs font-medium">
                              {o.Satuan}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-200">{formatRupiah(o.Harga)}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openObatEditModal(o)}
                                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition-all"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteObat(o.Kode_Obat)}
                                className="p-2 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredObatsList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-500 text-xs">Sediaan obat tidak ditemukan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>


      {/* ================= MODAL: PATIENT MEDICAL RECORD HISTORICAL TIMELINE ================= */}
      {selectedPasienNoRM && (() => {
        const patient = pasiens.find((p) => p.No_RM === selectedPasienNoRM);
        const history = kunjunganLengkapList.filter((k) => k.No_RM === selectedPasienNoRM);
        
        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-500 block">DOKUMEN INTEGRASI</span>
                    <h3 className="font-extrabold text-lg text-white">REKAM MEDIS PASIEN</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPasienNoRM(null)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Core Contents */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1">
                
                {/* Patient Information Demographics Card */}
                {patient ? (
                  <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Nama Pasien</span>
                      <h4 className="font-extrabold text-white text-base">{patient.Nama_Pasien}</h4>
                      <span className="inline-block px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-xs font-bold">
                        RM No: {patient.No_RM}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">Tanggal Lahir:</span>
                        <span className="text-slate-200 font-bold">{patient.Tgl_Lahir} ({calculateAge(patient.Tgl_Lahir)})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-500">Jenis Kelamin:</span>
                        <span className="text-slate-200 font-bold">{patient.JK === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Telepon:</span>
                        <span className="text-slate-200 font-mono">{patient.No_Telp}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Alamat Rumah</span>
                      <p className="text-xs text-slate-400 leading-relaxed">{patient.Alamat}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-red-950/20 border border-red-900/30 text-center rounded-2xl">
                    <p className="text-red-400 text-xs font-bold">Data biodata utama pasien ini telah dihapus. Silakan lakukan pencatatan ulang.</p>
                  </div>
                )}

                {/* Timeline Visits Log Block */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    <span>Linimasa Kunjungan & Tindakan ({history.length} Pemeriksaan)</span>
                  </h4>

                  <div className="relative border-l-2 border-slate-800 ml-3.5 pl-6 space-y-8 py-2">
                    {history.map((visit, idx) => (
                      <div key={visit.No_Kunjungan} className="relative group">
                        
                        {/* Bullet pointer */}
                        <div className="absolute -left-[31px] top-1.5 p-1 bg-slate-900 rounded-full border-2 border-blue-500 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Check size={10} />
                        </div>

                        {/* Visit Box */}
                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                          
                          {/* Visit ID & Date */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-mono font-bold text-blue-400">{visit.No_Kunjungan}</span>
                            <span className="text-slate-500 font-semibold">
                              {new Date(visit.Tgl_Kunjungan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>

                          {/* Doctor */}
                          <div className="text-xs">
                            <span className="text-slate-500">Diperiksa oleh: </span>
                            <span className="text-slate-200 font-bold">{visit.dokter?.Nama_Dokter || 'Dokter Umum'} </span>
                            <span className="text-blue-400">({visit.dokter?.Spesialis || 'Klinik'})</span>
                          </div>

                          {/* Symptoms */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Keluhan / Anamnesis</span>
                            <p className="text-xs text-slate-300 leading-relaxed">{visit.Keluhan}</p>
                          </div>

                          {/* Vitals & Diagnoses Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
                            
                            {/* Vitals */}
                            <div className="sm:col-span-4 bg-slate-900/50 p-3 rounded-xl border border-slate-900 text-[11px] space-y-1.5">
                              <span className="font-bold text-slate-400 block mb-1">Vitals:</span>
                              <div className="flex justify-between"><span className="text-slate-500">Tensi:</span> <span className="text-slate-200">{visit.Tensi}</span></div>
                              <div className="flex justify-between"><span className="text-slate-500">Suhu:</span> <span className="text-slate-200">{visit.Suhu} °C</span></div>
                              <div className="flex justify-between"><span className="text-slate-500">BB:</span> <span className="text-slate-200">{visit.BB} Kg</span></div>
                            </div>

                            {/* Diagnoses mapped */}
                            <div className="sm:col-span-8 space-y-2">
                              <span className="font-bold text-[10px] uppercase text-slate-500 block">Diagnosa ICD-10 Mapped</span>
                              <div className="flex flex-wrap gap-1.5">
                                {visit.diagnosaList.map((d) => (
                                  <span key={d.Kode_Diagnosa} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[11px] font-semibold">
                                    {d.Kode_Diagnosa} - {d.Nama_Diagnosa}
                                  </span>
                                ))}
                                {visit.diagnosaList.length === 0 && (
                                  <span className="text-[11px] text-slate-500 italic">Tanpa diagnosis tervalidasi.</span>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* Prescribed Drugs details */}
                          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-900 text-xs space-y-2">
                            <span className="font-bold text-slate-400 flex items-center gap-1.5">
                              <Pill size={12} className="text-amber-500" />
                              <span>Resep Obat & Aturan Pakai:</span>
                            </span>
                            <div className="space-y-1.5">
                              {visit.resepList.map((res, i) => (
                                <div key={i} className="flex justify-between text-[11px] bg-slate-950 p-2 rounded border border-slate-900">
                                  <div className="space-x-1">
                                    <span className="text-slate-200 font-bold">{res.obat.Nama_Obat}</span>
                                    <span className="text-slate-500">({res.obat.Satuan})</span>
                                    <span className="text-amber-400">[{res.Dosis}]</span>
                                  </div>
                                  <span className="text-slate-400">Jumlah: {res.Jumlah}</span>
                                </div>
                              ))}
                              {visit.resepList.length === 0 && (
                                <p className="text-slate-500 italic text-[11px]">Tanpa pemberian resep obat.</p>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}

                    {history.length === 0 && (
                      <div className="text-center py-8 bg-slate-950 rounded-2xl border border-slate-800">
                        <p className="text-slate-500 text-xs leading-relaxed">
                          Belum ada riwayat kunjungan dokter yang tercatat untuk pasien ini.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-bold">KLINIK ANAVERSE INTEGRASI SIM-KLINIK</span>
                <button
                  onClick={() => setSelectedPasienNoRM(null)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Tutup Rekam Medis
                </button>
              </div>

            </div>
          </div>
        );
      })()}


      {/* ================= MODAL: PASIEN CREATE / EDIT FORM ================= */}
      {showPasienModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">
                {editingPasien ? `Edit Data Pasien ${editingPasien.No_RM}` : 'Daftarkan Pasien Baru (RM)'}
              </h3>
              <button onClick={() => setShowPasienModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSavePasien} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold block">Nama Lengkap Pasien <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={pasienForm.Nama_Pasien}
                  onChange={(e) => setPasienForm({ ...pasienForm, Nama_Pasien: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold block">Tanggal Lahir <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    required
                    value={pasienForm.Tgl_Lahir}
                    onChange={(e) => setPasienForm({ ...pasienForm, Tgl_Lahir: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold block">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <select
                    value={pasienForm.JK}
                    onChange={(e) => setPasienForm({ ...pasienForm, JK: e.target.value as 'L' | 'P' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold block">No. Telepon / HP <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  required
                  placeholder="Contoh: 08123456789"
                  value={pasienForm.No_Telp}
                  onChange={(e) => setPasienForm({ ...pasienForm, No_Telp: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold block">Alamat Rumah Lengkap</label>
                <textarea 
                  rows={3}
                  placeholder="Tulis alamat tempat tinggal saat ini..."
                  value={pasienForm.Alamat}
                  onChange={(e) => setPasienForm({ ...pasienForm, Alamat: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-850">
                <button 
                  type="button" 
                  onClick={() => setShowPasienModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Simpan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================= MODAL: DOKTER CREATE / EDIT FORM ================= */}
      {showDokterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">
                {editingDokter ? `Edit Data Dokter ${editingDokter.Kode_Dokter}` : 'Tambah Dokter Ahli Baru'}
              </h3>
              <button onClick={() => setShowDokterModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveDokter} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold block">Nama Lengkap Dokter <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: dr. Andika Pratama, Sp.JP"
                  value={dokterForm.Nama_Dokter}
                  onChange={(e) => setDokterForm({ ...dokterForm, Nama_Dokter: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold block">Bidang Spesialisasi <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Spesialis Jantung / Anak / Bedah"
                  value={dokterForm.Spesialis}
                  onChange={(e) => setDokterForm({ ...dokterForm, Spesialis: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-850">
                <button 
                  type="button" 
                  onClick={() => setShowDokterModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Simpan Dokter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================= MODAL: DIAGNOSA CREATE / EDIT FORM ================= */}
      {showDiagnosaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">
                {editingDiagnosa ? `Edit Diagnosa ${editingDiagnosa.Kode_Diagnosa}` : 'Tambah Katalog Diagnosa Baru (ICD-10)'}
              </h3>
              <button onClick={() => setShowDiagnosaModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveDiagnosa} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold block">Kode Diagnosa (ICD-10) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  disabled={editingDiagnosa !== null}
                  placeholder="Contoh: I10, E11, J00"
                  value={diagnosaForm.Kode_Diagnosa}
                  onChange={(e) => setDiagnosaForm({ ...diagnosaForm, Kode_Diagnosa: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white disabled:opacity-50 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold block">Deskripsi Diagnosa Penyakit <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Essential (primary) hypertension"
                  value={diagnosaForm.Nama_Diagnosa}
                  onChange={(e) => setDiagnosaForm({ ...diagnosaForm, Nama_Diagnosa: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-850">
                <button 
                  type="button" 
                  onClick={() => setShowDiagnosaModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Simpan Diagnosa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================= MODAL: OBAT CREATE / EDIT FORM ================= */}
      {showObatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-white text-base">
                {editingObat ? `Edit Sediaan Obat ${editingObat.Kode_Obat}` : 'Tambah Sediaan Obat Farmasi Baru'}
              </h3>
              <button onClick={() => setShowObatModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveObat} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold block">Nama Sediaan Obat <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Paracetamol 500mg, Sanmol Sirup"
                  value={obatForm.Nama_Obat}
                  onChange={(e) => setObatForm({ ...obatForm, Nama_Obat: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold block">Satuan Sediaan <span className="text-red-500">*</span></label>
                  <select
                    value={obatForm.Satuan}
                    onChange={(e) => setObatForm({ ...obatForm, Satuan: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Kapsul">Kapsul</option>
                    <option value="Botol">Botol</option>
                    <option value="Puyer">Puyer</option>
                    <option value="Tube">Tube</option>
                    <option value="Saset">Saset</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold block">Harga per Satuan (IDR) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    placeholder="Contoh: 1500"
                    value={obatForm.Harga || ''}
                    onChange={(e) => setObatForm({ ...obatForm, Harga: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-850">
                <button 
                  type="button" 
                  onClick={() => setShowObatModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Simpan Obat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================= MODAL: MULTI-RELATIONAL VISIT LOGGER & PRESCRIPTION BUILDER ================= */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ClipboardList className="text-blue-500 animate-pulse" size={20} />
                <h3 className="font-extrabold text-white text-base">Catat Kunjungan Baru & Resep Obat (SIMRS)</h3>
              </div>
              <button onClick={() => setShowVisitModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Scrollable Core Form */}
            <form onSubmit={handleCreateKunjunganLengkap} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Section 1: Pasien, Dokter, and Date */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Langkah 1: Identitas & Waktu Pemeriksaan</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold block">Pilih Pasien Terdaftar <span className="text-red-500">*</span></label>
                    <select
                      value={selectedPasienRM}
                      onChange={(e) => setSelectedPasienRM(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-600"
                    >
                      {pasiens.map((p) => (
                        <option key={p.No_RM} value={p.No_RM}>
                          {p.Nama_Pasien} ({p.No_RM})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold block">Dokter Pemeriksa <span className="text-red-500">*</span></label>
                    <select
                      value={selectedDokterKode}
                      onChange={(e) => setSelectedDokterKode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-600"
                    >
                      {dokters.map((d) => (
                        <option key={d.Kode_Dokter} value={d.Kode_Dokter}>
                          {d.Nama_Dokter} ({d.Spesialis})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold block">Tanggal & Jam Kunjungan <span className="text-red-500">*</span></label>
                    <input 
                      type="datetime-local" 
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Vitals & Symptoms */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Langkah 2: Tanda Vital & Keluhan Pasien</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold block">Tensi Darah (mmHg) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: 120/80"
                      value={visitTensi}
                      onChange={(e) => setVisitTensi(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold block">Suhu Badan (°C)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      required
                      value={visitSuhu}
                      onChange={(e) => setVisitSuhu(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold block">Berat Badan (Kg)</label>
                    <input 
                      type="number" 
                      required
                      value={visitBB}
                      onChange={(e) => setVisitBB(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold block">Status Gizi (BB/Suhu)</label>
                    <div className="bg-slate-900 text-slate-400 border border-slate-800 rounded-xl px-3 py-2 text-xs text-center font-bold">
                      {visitBB > 0 ? `${Math.round(visitBB)} Kg (Vitals Aktif)` : '-'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold block">Keluhan Utama / Hasil Anamnesis <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Tulis keluhan subyektif pasien, gejala klinis, dan riwayat singkat..."
                    value={visitKeluhan}
                    onChange={(e) => setVisitKeluhan(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              {/* Section 3: Diagnoses (Detail_Diagnosa) Mapping */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Langkah 3: Kode Diagnosa Penyakit (ICD-10 Mapped)</h4>
                <p className="text-[11px] text-slate-500">Pilih satu atau beberapa diagnosis penyakit yang cocok berdasarkan keluhan pasien:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-900 rounded-xl border border-slate-800">
                  {diagnosas.map((d) => {
                    const isChecked = visitDiagnoses.includes(d.Kode_Diagnosa);
                    return (
                      <div 
                        key={d.Kode_Diagnosa}
                        onClick={() => toggleVisitDiagnosis(d.Kode_Diagnosa)}
                        className={`p-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all flex items-center gap-2.5 ${
                          isChecked 
                            ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {isChecked && <Check size={12} />}
                        </div>
                        <span className="font-mono text-blue-400 shrink-0">{d.Kode_Diagnosa}</span>
                        <span className="truncate">{d.Nama_Diagnosa}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Prescriptions (Detail_Resep) Mapping */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Langkah 4: Pemberian Resep Dokter (Detail Resep)</h4>
                  <button 
                    type="button" 
                    onClick={addPrescriptionItem}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-md transition-all"
                  >
                    <Plus size={14} />
                    <span>Tambah Obat</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {visitMedicines.map((item, idx) => {
                    const currentObat = obats.find((o) => o.Kode_Obat === item.Kode_Obat);
                    const cost = currentObat ? currentObat.Harga * item.Jumlah : 0;

                    return (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 items-end">
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">Pilih Sediaan Obat</label>
                          <select
                            value={item.Kode_Obat}
                            onChange={(e) => updatePrescriptionItem(idx, 'Kode_Obat', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                          >
                            {obats.map((o) => (
                              <option key={o.Kode_Obat} value={o.Kode_Obat}>
                                {o.Nama_Obat} ({formatRupiah(o.Harga)} / {o.Satuan})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">Aturan Pakai / Dosis</label>
                          <input 
                            type="text"
                            required
                            value={item.Dosis}
                            onChange={(e) => updatePrescriptionItem(idx, 'Dosis', e.target.value)}
                            placeholder="Contoh: 3 x sehari 1 tablet sesudah makan"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">Jumlah (Qty)</label>
                          <input 
                            type="number"
                            required
                            min={1}
                            value={item.Jumlah}
                            onChange={(e) => updatePrescriptionItem(idx, 'Jumlah', Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between gap-2">
                          <div className="text-[11px] font-mono text-slate-400 leading-3">
                            <span>Subtotal:</span> <br />
                            <span className="font-bold text-white">{formatRupiah(cost)}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removePrescriptionItem(idx)}
                            className="p-1.5 bg-slate-950 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-950 rounded-lg shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {visitMedicines.length === 0 && (
                    <p className="text-slate-500 text-xs italic text-center py-2 bg-slate-900 rounded-xl border border-slate-800/60">
                      Belum ada obat yang ditambahkan. Kunjungan akan disimpan tanpa resep.
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 flex justify-between items-center border-t border-slate-800">
                <div className="text-xs">
                  <span className="text-slate-500">Estimasi Total Farmasi:</span> <br />
                  <span className="text-sm font-bold text-amber-500 font-mono">
                    {formatRupiah(visitMedicines.reduce((sum, item) => {
                      const o = obats.find((ob) => ob.Kode_Obat === item.Kode_Obat);
                      return sum + (o ? o.Harga * item.Jumlah : 0);
                    }, 0))}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowVisitModal(false)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/30 transition-all"
                  >
                    Simpan Riwayat Kunjungan
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Supabase SQL Setup Modal */}
      {showSqlSetupModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setShowSqlSetupModal(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />

            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Database size={20} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black text-white leading-tight">Panduan Penyiapan Database Supabase</h3>
                  <p className="text-xs text-slate-400">Jalankan SQL Script di bawah untuk membuat tabel-tabel ERD Klinik Anda</p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlSetupModal(false)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-300 text-xs leading-relaxed text-left">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                <p className="font-bold mb-1">Langkah Mudah:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Buka halaman SQL Editor di Dasbor Supabase Anda.</li>
                  <li>Salin seluruh skrip di bawah ini.</li>
                  <li>Tempel ke dalam Editor Baru dan klik tombol <span className="font-bold underline">Run</span> di pojok kanan bawah.</li>
                </ol>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SQL Schema Script</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
                      alert('Script SQL berhasil disalin ke clipboard Anda!');
                    }}
                    className="py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Salin Script
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto text-[10px] text-slate-300 font-mono max-h-[300px] select-all leading-relaxed whitespace-pre">
                  {SUPABASE_SQL_SETUP_SCRIPT}
                </pre>
              </div>

              <div className="text-[10px] text-slate-500 italic">
                *Skrip di atas otomatis menyiapkan tabel Pasien, Dokter, Diagnosa, Obat, Kunjungan, serta composite junction table beserta RLS Bypass & publikasi Realtime.
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-3">
              <button
                onClick={() => setShowSqlSetupModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
