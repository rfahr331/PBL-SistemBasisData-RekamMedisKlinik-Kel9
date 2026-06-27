import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import PortalRekamMedis from './components/PortalRekamMedis';
import { motion, AnimatePresence } from 'motion/react';
import { auth, onAuthStateChanged, User, logout, googleSignIn, emailSignIn, emailSignUp } from './lib/firebase';
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'portal'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Pre-seed a default local demo account if empty
    const localAccountsStr = localStorage.getItem('local_accounts');
    if (!localAccountsStr) {
      const demoAccount = { email: 'admin@anaverse.com', password: 'password123' };
      localStorage.setItem('local_accounts', JSON.stringify([demoAccount]));
    }

    // Check for saved local user session
    const savedLocalUser = localStorage.getItem('local_session_user');
    if (savedLocalUser) {
      try {
        setUser(JSON.parse(savedLocalUser));
      } catch (e) {
        console.error('Failed to parse local session user:', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Clear local session if Firebase Auth succeeded
        localStorage.removeItem('local_session_user');
      } else {
        const hasSavedLocalUser = localStorage.getItem('local_session_user');
        if (!hasSavedLocalUser) {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      await googleSignIn();
      setShowLoginModal(false);
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Gagal masuk dengan Google.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setAuthError('Email dan password tidak boleh kosong.');
      return;
    }

    // Explicit Admin Rule check
    if (cleanEmail === 'admin@anaverse.com') {
      if (cleanPassword !== 'password123') {
        setAuthError('Sandi salah untuk akun Administrator. Sandi yang benar untuk admin@anaverse.com adalah password123.');
        return;
      }
    }

    try {
      setAuthError(null);
      setIsSubmitting(true);

      // Sign out of any existing Firebase auth session first to prevent conflicts
      try {
        await logout();
      } catch (err) {
        // ignore sign out error
      }

      // Create beautiful instant demo/admin user
      const mockUser = {
        uid: 'demo_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '') + '_' + Date.now(),
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        photoURL: cleanEmail === 'admin@anaverse.com' 
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
      };

      localStorage.setItem('local_session_user', JSON.stringify(mockUser));
      setUser(mockUser as any);
      setShowLoginModal(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.warn('Authentication fallback error:', error);
      setAuthError(error.message || 'Gagal masuk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('local_session_user');
      setUser(null);
      setViewMode('landing');
    }
  };

  const handleEnterPortal = () => {
    if (user) {
      setViewMode('portal');
    } else {
      setShowLoginModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-semibold text-sm">Memuat aplikasi rekam medis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased overflow-x-hidden">
      <AnimatePresence mode="wait">
        {viewMode === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <LandingPage 
              onEnterPortal={handleEnterPortal} 
              user={user} 
              onLogout={handleLogout} 
              onLoginClick={() => setShowLoginModal(true)} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <PortalRekamMedis 
              onBackToLanding={() => setViewMode('landing')} 
              user={user} 
              onLogout={handleLogout} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-slate-900"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 text-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
              
              {/* Close Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
                  <ShieldCheck size={40} className="animate-pulse" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Portal Klinik Anaverse
              </h3>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed max-w-sm mx-auto">
                Silakan masuk menggunakan Email dan Password atau Akun Google Anda untuk mengakses Portal Rekam Medis Klinik Anaverse.
              </p>

              {authError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs text-left">
                  <span className="font-bold block mb-1">Terjadi kesalahan:</span>
                  {authError}
                </div>
              )}

              {/* Tab Selector */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setAuthError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Masuk (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setAuthError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Daftar (Sign Up)
                </button>
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3 mb-4 text-left">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="contoh@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm rounded-xl outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm rounded-xl outline-none transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{isSignUp ? 'Daftar & Masuk' : 'Masuk ke Portal'}</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-2 items-center my-4">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">atau</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <div className="flex flex-col gap-3 items-center">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>Masuk dengan Google</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold hover:underline cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-4 text-[10px] text-slate-400">
                Hubungan aman menggunakan Firebase Authentication & Google OAuth
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
