import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, ShoppingCart, Heart, User, Shield, BookOpen, HelpCircle, Code, LogOut } from 'lucide-react';
import { User as UserType } from '../types/store';

interface NavbarProps {
  currentRole: 'user' | 'admin';
  currentTab: string;
  setTab: (tab: string) => void;
  onLogout: () => void;
  cartCount: number;
  wishlistCount: number;
  appName: string;
  isLoggedIn?: boolean;
  currentUser?: UserType | null;
  onOpenAuthModal?: (mode: 'login' | 'register', msg?: string) => void;
}

export default function Navbar({
  currentRole,
  currentTab,
  setTab,
  onLogout,
  cartCount,
  wishlistCount,
  appName,
  isLoggedIn = false,
  currentUser,
  onOpenAuthModal
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get active user details from localStorage dynamically as fallback
  const activeUser = React.useMemo(() => {
    try {
      const stored = localStorage.getItem('flora_active_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }, [currentRole, currentUser]);

  const displayName = currentUser?.name || activeUser?.name || (currentRole === 'admin' ? 'Siti Nurbayanti' : 'Pelanggan');
  
  // Get initials for profile placeholder
  const initials = React.useMemo(() => {
    if (!displayName) return 'US';
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  }, [displayName]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-lg shadow-slate-200/25' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => { setTab('home'); }}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 fill-white/10" />
            </div>
            <div>
              <span className="block font-serif text-xl font-bold text-slate-900 leading-none tracking-tight">
                {appName}<span className="text-emerald-500 font-sans">.</span>
              </span>
              <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5 font-sans">
                Premium Store
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {currentRole === 'user' ? (
              <>
                <button
                  onClick={() => setTab('home')}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                    currentTab === 'home' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  Beranda
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-500 rounded-full transition-transform duration-300 origin-left ${
                    currentTab === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
                <button
                  onClick={() => setTab('shop')}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                    currentTab === 'shop' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  Katalog Tanaman
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-500 rounded-full transition-transform duration-300 origin-left ${
                    currentTab === 'shop' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
                <button
                  onClick={() => setTab('articles')}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                    currentTab === 'articles' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  Edukasi Perawat
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-500 rounded-full transition-transform duration-300 origin-left ${
                    currentTab === 'articles' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
                <button
                  onClick={() => setTab('faq')}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                    currentTab === 'faq' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  FAQ
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-500 rounded-full transition-transform duration-300 origin-left ${
                    currentTab === 'faq' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      onOpenAuthModal?.('login', 'Silakan masuk ke akun Anda untuk melihat riwayat pesanan.');
                    } else {
                      setTab('orders');
                    }
                  }}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group cursor-pointer ${
                    currentTab === 'orders' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  Pesanan Saya
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-500 rounded-full transition-transform duration-300 origin-left ${
                    currentTab === 'orders' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setTab('dashboard')}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group flex items-center gap-1.5 ${
                    currentTab === 'dashboard' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                  title="Dashboard Admin"
                >
                  <Shield className="w-4 h-4" /> Dashboard Admin
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-500 rounded-full transition-transform duration-300 origin-left ${
                    currentTab === 'dashboard' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              </>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {currentRole === 'user' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (!isLoggedIn) {
                      onOpenAuthModal?.('login', 'Silakan masuk ke akun Anda untuk membuka daftar tanaman favorit (Wishlist).');
                    } else {
                      setTab('wishlist');
                    }
                  }}
                  className="relative p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-600 hover:text-rose-500 cursor-pointer"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.25, 1] }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (!isLoggedIn) {
                      onOpenAuthModal?.('login', 'Silakan masuk ke akun Anda untuk membuka keranjang belanja dan melakukan proses checkout.');
                    } else {
                      setTab('cart');
                    }
                  }}
                  className="relative p-2.5 rounded-xl border border-slate-100 bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors text-emerald-600 cursor-pointer"
                  title="Keranjang Belanja"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.25, 1] }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-slate-100 bg-slate-50/50 text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#5a5a40] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {initials}
                  </div>
                  <div className="hidden sm:block">
                    <span className="block text-xs font-bold text-slate-800 leading-tight">
                      {displayName}
                    </span>
                    <span className="block text-[9px] font-semibold text-slate-500 leading-none mt-0.5">
                      {currentRole === 'admin' ? 'Administrator' : 'Kolektor Member'}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  title="Keluar / Logout"
                  className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenAuthModal?.('login', 'Silakan masuk ke akun FloraPremium Anda.')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                >
                  Masuk
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenAuthModal?.('register', 'Daftar sekarang untuk memesan dan mendapatkan promo member eksklusif.')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Daftar
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
