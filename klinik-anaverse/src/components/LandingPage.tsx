import { Activity, ShieldCheck, Heart, User, Calendar, Award, Phone, Clock, ArrowRight, Star, Plus, Eye, Stethoscope, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { User as FirebaseUser } from '../lib/firebase';

interface LandingPageProps {
  onEnterPortal: () => void;
  user: FirebaseUser | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export default function LandingPage({ onEnterPortal, user, onLogout, onLoginClick }: LandingPageProps) {
  const stats = [
    { value: '15+', label: 'Dokter Spesialis', desc: 'Sertifikasi nasional & internasional' },
    { value: '25.000+', label: 'Pasien Terlayani', desc: 'Kepercayaan keluarga Indonesia' },
    { value: '120+', label: 'Kamar Perawatan', desc: 'Standar kenyamanan hotel berbintang' },
    { value: '98%', label: 'Kepuasan Pasien', desc: 'Berdasarkan survei internal berkala' },
  ];

  const services = [
    { title: 'Poli Spesialis', desc: 'Pelayanan prima oleh dokter spesialis berpengalaman.', icon: Stethoscope },
    { title: 'Rawat Inap', desc: 'Fasilitas kamar yang nyaman dengan penjagaan medis 24 jam.', icon: ShieldCheck },
    { title: 'IGD 24 Jam', desc: 'Penanganan gawat darurat cepat, sigap, dan responsif.', icon: Activity },
    { title: 'Radiologi', desc: 'Teknologi pemindaian canggih dengan akurasi diagnosis tinggi.', icon: Eye },
    { title: 'Laboratorium', desc: 'Hasil pengujian lab yang akurat dan bersertifikasi mutu.', icon: Award },
    { title: 'Farmasi', desc: 'Ketersediaan obat lengkap, higienis, dan terpercaya.', icon: Heart },
  ];

  const doctors = [
    { name: 'dr. Andika Pratama, Sp.JP', role: 'Spesialis Jantung', rating: 4.9, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400' },
    { name: 'dr. Salsabila Putri, Sp.A', role: 'Spesialis Anak', rating: 4.9, img: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400' },
    { name: 'dr. Budi Santoso, Sp.B', role: 'Spesialis Bedah', rating: 4.8, img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400' },
    { name: 'dr. Meilani Putri, Sp.PD', role: 'Spesialis Penyakit Dalam', rating: 4.9, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400' },
  ];

  const facilities = [
    { title: 'Ruang ICU', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400' },
    { title: 'Kamar VIP', img: 'https://images.unsplash.com/photo-1584515901407-c824ccd61c55?auto=format&fit=crop&q=80&w=400' },
    { title: 'Ruang Operasi', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400' },
    { title: 'Laboratorium', img: 'https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&q=80&w=400' },
    { title: 'Ambulans 24 Jam', img: 'https://images.unsplash.com/photo-1587749989845-4a500b1353c5?auto=format&fit=crop&q=80&w=400' },
  ];

  const articles = [
    { title: 'Tips Menjaga Kesehatan Jantung Setiap Hari', category: 'Kesehatan Jantung', date: '20 Mei 2026', img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400' },
    { title: 'Pentingnya Imunisasi untuk Anak Sejak Dini', category: 'Anak', date: '18 Mei 2026', img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400' },
    { title: 'Makanan Sehat untuk Gaya Hidup Seimbang', category: 'Gaya Hidup', date: '16 Mei 2026', img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=400' },
    { title: 'Perawatan Terbaik untuk Orang Tersayang', category: 'Lansia', date: '14 Mei 2026', img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen selection:bg-blue-500 selection:text-white">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200">
              <Activity size={24} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-blue-600 block">KLINIK</span>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">ANAVERSE</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#beranda" className="text-blue-600 border-b-2 border-blue-600 pb-1">Beranda</a>
            <a href="#tentang-kami" className="hover:text-blue-600 transition-colors">Tentang Kami</a>
            <a href="#layanan" className="hover:text-blue-600 transition-colors">Layanan</a>
            <a href="#dokter" className="hover:text-blue-600 transition-colors">Dokter</a>
            <a href="#fasilitas" className="hover:text-blue-600 transition-colors">Fasilitas</a>
            <a href="#berita" className="hover:text-blue-600 transition-colors">Berita</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-1.5 pr-4 rounded-xl">
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                  alt={user.displayName || 'User'} 
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-sm"
                />
                <div className="hidden sm:block text-left">
                  <span className="text-[10px] text-slate-400 block font-medium leading-none">Masuk Sebagai</span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[120px] leading-tight">{user.displayName || 'Staf Medis'}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Keluar"
                  className="ml-1 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="hidden sm:flex px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all items-center gap-2"
              >
                <span>Masuk</span>
              </button>
            )}

            <button 
              onClick={onEnterPortal}
              id="btn-portal-navbar"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-150 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck size={18} />
              <span>Portal Rekam Medis</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="beranda" className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-radial-gradient from-blue-100/40 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold">
              <Heart size={14} className="fill-blue-500 stroke-blue-700" />
              <span>Kesehatan Anda, Prioritas Kami</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
              Pelayanan Terbaik untuk <span className="text-blue-600">Kesehatan Anda</span> dan Keluarga
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Kami hadir dengan layanan medis berkualitas tinggi, dokter spesialis berpengalaman, dan fasilitas modern berteknologi tinggi untuk memberikan perawatan terbaik dan pemulihan optimal bagi Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onEnterPortal}
                id="btn-hero-portal"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Lihat Layanan & Portal</span>
                <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={onEnterPortal}
                id="btn-hero-janji"
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-sm"
              >
                <Calendar size={18} className="text-blue-600" />
                <span>Buat Janji Temu</span>
              </button>
            </div>

            <div className="pt-2 flex items-center gap-6">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="patient avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="patient avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="patient avatar" />
              </div>
              <div className="text-xs text-slate-500">
                <div className="flex items-center gap-1 text-slate-900 font-bold">
                  <Star className="text-amber-400 fill-amber-400" size={14} />
                  <span>4.9 / 5.0</span>
                </div>
                <span>Direkomendasikan oleh ribuan pasien</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl blur-lg opacity-20 animate-pulse" />
            <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200" 
                alt="Klinik Care Center" 
                className="w-full h-[350px] lg:h-[450px] object-cover rounded-2xl"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500 rounded-xl text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Akreditasi Paripurna KARS</h4>
                    <p className="text-slate-500 text-xs">Standar Pelayanan Mutu Tertinggi</p>
                  </div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2 p-4 rounded-2xl hover:bg-slate-50/50 transition-colors">
                <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">{stat.value}</div>
                <div className="font-bold text-slate-800 text-sm">{stat.label}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About Section */}
      <section id="tentang-kami" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 order-last lg:order-first">
            <img 
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800" 
              alt="Klinik Building" 
              className="rounded-3xl shadow-xl border border-slate-200 object-cover h-[400px] w-full"
            />
          </div>
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Tentang Kami</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Klinik Anaverse Untuk Hidup yang Lebih Sehat
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Klinik Anaverse berkomitmen penuh untuk memberikan pelayanan kesehatan berkualitas prima, didukung oleh teknologi medis modern, kebersihan lingkungan yang terjaga, serta kenyamanan luar biasa bagi setiap pasien dan keluarganya.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl mt-1">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pelayanan 24 Jam</h4>
                  <p className="text-slate-500 text-xs">Akses darurat & ambulans non-stop.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl mt-1">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Medis Profesional</h4>
                  <p className="text-slate-500 text-xs">Dokter ahli bersertifikat resmi.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl mt-1">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Fasilitas Modern</h4>
                  <p className="text-slate-500 text-xs">Peralatan diagnostik terkini.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl mt-1">
                  <Heart size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pelayanan Peduli</h4>
                  <p className="text-slate-500 text-xs">Perawatan tulus sehangat keluarga.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services Section */}
      <section id="layanan" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Layanan Kami</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kategori Layanan Unggulan</h2>
            <p className="text-slate-500 text-sm">Kami menyediakan berbagai layanan medis terpadu untuk memastikan kenyamanan dan pemulihan kesehatan Anda.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, i) => {
              const IconComp = svc.icon;
              return (
                <div 
                  key={i} 
                  className="bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all space-y-4 group"
                >
                  <div className="p-3 bg-white group-hover:bg-blue-600 rounded-xl text-blue-600 group-hover:text-white shadow-sm inline-block transition-all">
                    <IconComp size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{svc.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Doctors Section */}
      <section id="dokter" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Dokter Kami</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Temui Dokter Spesialis Berpengalaman</h2>
              <p className="text-slate-500 text-sm max-w-xl">Tim dokter kami yang andal siap mendampingi Anda mencapai kesehatan terbaik dengan ilmu medis modern.</p>
            </div>
            <button 
              onClick={onEnterPortal}
              id="btn-lihat-semua-dokter"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 self-start md:self-auto shadow-md"
            >
              <span>Lihat Semua Dokter</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doc, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm group hover:shadow-xl transition-all">
                <div className="relative overflow-hidden h-64 bg-slate-100">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>
                <div className="p-5 text-center space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{doc.name}</h4>
                  <p className="text-slate-500 text-xs">{doc.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Facilities Section */}
      <section id="fasilitas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Fasilitas</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fasilitas Medis Modern Terlengkap</h2>
            <p className="text-slate-500 text-sm">Guna mendukung ketepatan rekam medis dan kecepatan penanganan pasien, kami menyediakan fasilitas modern.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {facilities.map((fac, i) => (
              <div key={i} className="space-y-3">
                <div className="relative overflow-hidden rounded-2xl h-44 bg-slate-100 border border-slate-100 shadow-sm">
                  <img src={fac.img} alt={fac.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm text-center">{fac.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Articles Section */}
      <section id="berita" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Berita & Tips</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Artikel Edukasi Kesehatan</h2>
            <p className="text-slate-500 text-sm">Dapatkan artikel terpercaya seputar kesehatan dan gaya hidup sehat dari tim dokter spesialis kami.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {articles.map((art, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="h-44 overflow-hidden bg-slate-100">
                    <img src={art.img} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{art.category}</span>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug hover:text-blue-600 transition-colors cursor-pointer">{art.title}</h4>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 border-t border-slate-50 text-[11px] text-slate-400">
                  {art.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA Help Section */}
      <section className="py-12 bg-white px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left max-w-md">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Butuh Bantuan Medis?</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Kami siap melayani Anda 24 jam sehari, 7 hari seminggu. Hubungi pusat pelayanan informasi darurat kami.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">IGD 24 Jam</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">Tenaga Medis Profesional</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">Fasilitas Lengkap</span>
              </div>
            </div>

            <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-4 text-center">
              <div className="flex items-center gap-4 justify-center">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <Phone size={24} className="animate-bounce" />
                </div>
                <div className="text-left">
                  <p className="text-slate-400 text-xs uppercase font-semibold">Hubungi Kami</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">(021) 1234 5678</p>
                </div>
              </div>
              <button 
                onClick={onEnterPortal}
                id="btn-cta-buat-janji"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Portal Sekarang</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Activity size={20} />
              </div>
              <span className="font-extrabold text-lg tracking-tight">ANAVERSE</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sistem Informasi Manajemen Klinik & Rekam Medis Digital Terpadu Klinik Anaverse. Membantu akurasi pengobatan pasien secara efisien.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Layanan Klinik</h4>
            <ul className="space-y-2 text-xs">
              <li>Poli Penyakit Dalam</li>
              <li>Poli Spesialis Jantung</li>
              <li>Poli Spesialis Anak</li>
              <li>Bedah Minor & Mayor</li>
              <li>Farmasi Digital</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Akses SIMRS</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={onEnterPortal} className="hover:text-blue-400">Pendaftaran Pasien Baru</button></li>
              <li><button onClick={onEnterPortal} className="hover:text-blue-400">Input Kunjungan Dokter</button></li>
              <li><button onClick={onEnterPortal} className="hover:text-blue-400">Database Obat & Resep</button></li>
              <li><button onClick={onEnterPortal} className="hover:text-blue-400">Dashboard Statistik Medis</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Kontak</h4>
            <p className="text-xs leading-relaxed text-slate-500">
              Kawasan Medis Terpadu Anaverse Blok C4, Jakarta Barat. <br />
              Email: info@anaverse-clinic.com <br />
              Telp: (021) 1234 5678
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 Klinik Anaverse. Hak Cipta Dilindungi.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Kebijakan Privasi</a>
            <a href="#" className="hover:underline">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
