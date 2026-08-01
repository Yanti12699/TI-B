import React, { useState, useEffect } from 'react';
import { Leaf, Lock, User, Shield, AlertCircle, ArrowRight, CheckCircle2, Sparkles, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { User as UserType } from '../types/store';

interface LoginScreenProps {
  onLogin: (role: 'user' | 'admin', user?: UserType) => void;
  appName: string;
  onClose?: () => void;
  initialMode?: 'login' | 'register';
  authMessage?: string;
}

export default function LoginScreen({ onLogin, appName, onClose, initialMode = 'login', authMessage }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  
  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form states
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  
  // Status states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Terjadi kesalahan saat masuk.');
        }
        return data;
      })
      .then((data) => {
        setSuccess(data.message || `Login berhasil! Selamat datang, ${data.user?.name || ''}`);
        if (data.sessionId) {
          localStorage.setItem('flora_session_id', data.sessionId);
        }
        if (data.user) {
          localStorage.setItem('flora_active_user', JSON.stringify(data.user));
        }
        
        setTimeout(() => {
          onLogin(data.user.role, data.user);
          setLoading(false);
        }, 500);
      })
      .catch((err) => {
        setError(err.message || 'Username/Email atau password salah!');
        setLoading(false);
      });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setError('Semua kolom pendaftaran (Nama, Username, Email, Password) wajib diisi!');
      return;
    }

    if (regUsername.trim().length < 3) {
      setError('Username minimal harus 3 karakter!');
      return;
    }

    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setError('Format email tidak valid!');
      return;
    }

    if (regPassword.length < 5) {
      setError('Password minimal harus 5 karakter!');
      return;
    }

    if (regPassword !== regConfirm) {
      setError('Konfirmasi password tidak cocok!');
      return;
    }

    setLoading(true);

    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        confirm_password: regConfirm,
        full_name: regName.trim()
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Terjadi kesalahan saat pendaftaran.');
        }
        return data;
      })
      .then((data) => {
        setSuccess(data.message || 'Registrasi berhasil. Selamat datang!');
        if (data.user) {
          if (data.sessionId) {
            localStorage.setItem('flora_session_id', data.sessionId);
          }
          localStorage.setItem('flora_active_user', JSON.stringify(data.user));
          setTimeout(() => {
            onLogin(data.user.role, data.user);
            setLoading(false);
          }, 800);
        } else {
          // Fallback switch to login tab
          setUsername(regUsername.trim().toLowerCase());
          setPassword('');
          setTimeout(() => {
            setMode('login');
            setSuccess('');
            setLoading(false);
          }, 1200);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className={onClose ? "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans text-[#434331]" : "min-h-screen bg-[#f5f5f0] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-[#434331]"}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid md:grid-cols-12 min-h-[620px] border border-emerald-500/10"
      >
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-sm"
            title="Tutup jendela login"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Left Side: Editorial Banner */}
        <div className="md:col-span-5 bg-[#e8e8df] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative shapes with floating effect */}
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#d4d4c7]/40 pointer-events-none" 
          />
          <motion.div 
            animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-[#b5b5a2]/20 pointer-events-none" 
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Leaf className="w-5 h-5 fill-white/10" />
              </div>
              <span className="font-serif text-lg font-bold text-slate-800 tracking-wide">
                {appName}
              </span>
            </div>

            <span className="text-[11px] font-bold tracking-widest text-emerald-600 uppercase block mb-3">
              Premium Retail Experience
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-800 leading-tight font-bold mb-4">
              The Verdant<br />Collection.
            </h1>
            <p className="text-sm text-slate-600 max-w-[280px] leading-relaxed">
              Jelajahi koleksi tanaman hias premium, langka, dan eksotis terpercaya langsung dari budidaya terbaik kami.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-[#5a5a40]/10 mt-12 md:mt-0">
            <div className="text-[11px] text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-[10px]">Layanan Premium</p>
              <p className="mb-1">• Pengiriman Bergaransi Seluruh Indonesia</p>
              <p className="mb-1">• Konsultasi Perawatan Tanaman Gratis</p>
              <p>• Transaksi Aman via Gateway & COD Terenkripsi</p>
            </div>
          </div>
        </div>

        {/* Right Side: Elegant Dynamic Form */}
        <div className="md:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          
          {/* Form container with error shaking support */}
          <motion.div 
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full mx-auto"
          >
            
            {/* Form Title & Description */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-800 mb-2">
                {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
              </h2>
              <p className="text-sm text-slate-500">
                {mode === 'login' 
                  ? 'Silakan isi kredensial akun Anda untuk melanjutkan.' 
                  : 'Daftar sekarang untuk mulai mengoleksi tanaman hias premium.'}
              </p>
            </div>

            {/* Optional Auth Guidance Message */}
            {authMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
                <div>
                  <span className="font-bold">Info: </span> {authMessage}
                </div>
              </div>
            )}

            {/* Error Message Box */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-150 text-rose-800 text-xs flex items-start gap-2.5 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-bold">Gagal:</span> {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message Box */}
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-150 text-emerald-800 text-xs flex items-start gap-2.5 overflow-hidden"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <span className="font-bold">Berhasil:</span> {success}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGIN MODE */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Username or Email Input with Floating Label */}
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all peer"
                  />
                  <label 
                    htmlFor="username"
                    className="absolute text-[10px] font-bold text-slate-400 uppercase tracking-wider duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-emerald-600 cursor-text"
                  >
                    Username atau Email
                  </label>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                </div>

                {/* Password Input with Floating Label */}
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all peer"
                  />
                  <label 
                    htmlFor="password"
                    className="absolute text-[10px] font-bold text-slate-400 uppercase tracking-wider duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-emerald-600 cursor-text"
                  >
                    Password
                  </label>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -10px rgba(16,185,129,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Memproses...' : 'Masuk Sekarang'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>

                <div className="text-center pt-4">
                  <p className="text-xs text-slate-500">
                    Belum memiliki akun?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-emerald-600 font-bold hover:underline cursor-pointer"
                    >
                      Daftar Akun Baru
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Name Input with Floating Label */}
                <div className="relative">
                  <input
                    type="text"
                    id="regName"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all peer"
                  />
                  <label 
                    htmlFor="regName"
                    className="absolute text-[10px] font-bold text-slate-400 uppercase tracking-wider duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-emerald-600 cursor-text"
                  >
                    Nama Lengkap
                  </label>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                </div>

                {/* Username Input with Floating Label */}
                <div className="relative">
                  <input
                    type="text"
                    id="regUsername"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all peer"
                  />
                  <label 
                    htmlFor="regUsername"
                    className="absolute text-[10px] font-bold text-slate-400 uppercase tracking-wider duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-emerald-600 cursor-text"
                  >
                    Username Pilihan
                  </label>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                </div>

                {/* Email Input with Floating Label */}
                <div className="relative">
                  <input
                    type="email"
                    id="regEmail"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all peer"
                  />
                  <label 
                    htmlFor="regEmail"
                    className="absolute text-[10px] font-bold text-slate-400 uppercase tracking-wider duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-emerald-600 cursor-text"
                  >
                    Email Akun
                  </label>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                </div>

                {/* Password Input with Floating Label */}
                <div className="relative">
                  <input
                    type="password"
                    id="regPassword"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all peer"
                  />
                  <label 
                    htmlFor="regPassword"
                    className="absolute text-[10px] font-bold text-slate-400 uppercase tracking-wider duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-emerald-600 cursor-text"
                  >
                    Password
                  </label>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                </div>

                {/* Confirm Password Input with Floating Label */}
                <div className="relative">
                  <input
                    type="password"
                    id="regConfirm"
                    required
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-slate-50/50 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all peer"
                  />
                  <label 
                    htmlFor="regConfirm"
                    className="absolute text-[10px] font-bold text-slate-400 uppercase tracking-wider duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-emerald-600 cursor-text"
                  >
                    Konfirmasi Password
                  </label>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -10px rgba(16,185,129,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2 mt-6 cursor-pointer"
                >
                  Daftar Akun Sekarang
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <div className="text-center pt-4">
                  <p className="text-xs text-slate-500">
                    Sudah memiliki akun?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-emerald-600 font-bold hover:underline cursor-pointer"
                    >
                      Masuk ke Akun Anda
                    </button>
                  </p>
                </div>
              </form>
            )}

          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
