import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerShop from './components/CustomerShop';
import AdminPanel from './components/AdminPanel';
import CodeExplorer from './components/CodeExplorer';
import LoginScreen from './components/LoginScreen';
import { getAllOrdersApi, getUserOrdersApi } from './services/orderApi';
import { fetchCategoriesApi, fetchProductsApi, fetchSettingsApi } from './services/catalogApi';

import {
  initialCategories,
  initialProducts,
  initialVouchers,
  initialOrders,
  initialArticles,
  initialFAQs,
  initialTestimonials,
  initialSettings
} from './data/mockData';

import { Category, Product, Voucher, Order, Article, FAQ, Testimonial, Settings, User } from './types/store';

export default function App() {
  // Authentication & Role setup
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<'user' | 'admin'>('user');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [loadingSession, setLoadingSession] = useState<boolean>(true);

  // Public Access Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalMessage, setAuthModalMessage] = useState<string>('');

  const openAuthModal = (mode: 'login' | 'register' = 'login', msg?: string) => {
    setAuthModalMode(mode);
    setAuthModalMessage(msg || '');
    setShowAuthModal(true);
  };

  // Central Database States
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [vouchers] = useState<Voucher[]>(initialVouchers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('flora_articles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored articles:', e);
    }
    return initialArticles;
  });

  useEffect(() => {
    try {
      localStorage.setItem('flora_articles', JSON.stringify(articles));
    } catch (e) {
      console.error('Error storing articles:', e);
    }
  }, [articles]);

  // Customer states (isolated per user_id)
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Transition States
  const [tabLoading, setTabLoading] = useState(false);

  // Tab change indicator
  useEffect(() => {
    setTabLoading(true);
    const timer = setTimeout(() => {
      setTabLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentTab]);

  // Load user specific cart & wishlist
  const loadUserCartAndWishlist = (userId: number) => {
    try {
      const savedCart = localStorage.getItem(`flora_cart_user_${userId}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
      const savedWishlist = localStorage.getItem(`flora_wishlist_user_${userId}`);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      } else {
        setWishlist([]);
      }
    } catch (e) {
      console.error('Error loading user cart/wishlist:', e);
      setCart([]);
      setWishlist([]);
    }
  };

  // Sync cart to localStorage for logged in user
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`flora_cart_user_${currentUser.id}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  // Sync wishlist to localStorage for logged in user
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`flora_wishlist_user_${currentUser.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  // Restore session on mount
  useEffect(() => {
    const sessionId = localStorage.getItem('flora_session_id');
    const storedUserStr = localStorage.getItem('flora_active_user');
    let storedUser: User | null = null;
    if (storedUserStr) {
      try {
        storedUser = JSON.parse(storedUserStr);
      } catch (e) {
        console.error('Error parsing stored active user:', e);
      }
    }

    fetch('/api/me', {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn && data.user) {
          if (data.sessionId) {
            localStorage.setItem('flora_session_id', data.sessionId);
          }
          localStorage.setItem('flora_active_user', JSON.stringify(data.user));
          setCurrentUser(data.user);
          setCurrentRole(data.user.role);
          setIsLoggedIn(true);
          loadUserCartAndWishlist(data.user.id);
          if (data.user.role === 'admin') {
            setCurrentTab('dashboard');
          }
        } else if (storedUser) {
          // Fallback to active user in localStorage if server session check returns empty
          setCurrentUser(storedUser);
          setCurrentRole(storedUser.role);
          setIsLoggedIn(true);
          loadUserCartAndWishlist(storedUser.id);
          if (storedUser.role === 'admin') {
            setCurrentTab('dashboard');
          }
        } else {
          localStorage.removeItem('flora_session_id');
          localStorage.removeItem('flora_active_user');
          setCurrentUser(null);
          setIsLoggedIn(false);
          setCart([]);
          setWishlist([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching session on mount:', err);
        if (storedUser) {
          setCurrentUser(storedUser);
          setCurrentRole(storedUser.role);
          setIsLoggedIn(true);
          loadUserCartAndWishlist(storedUser.id);
          if (storedUser.role === 'admin') {
            setCurrentTab('dashboard');
          }
        }
      })
      .finally(() => {
        setLoadingSession(false);
      });
  }, []);

  // Fetch orders from backend API based on active session user
  const refreshOrders = () => {
    if (!isLoggedIn) {
      setOrders([]);
      return;
    }
    if (currentRole === 'admin') {
      getAllOrdersApi()
        .then(res => {
          if (res && res.data) {
            setOrders(res.data);
          }
        })
        .catch(err => {
          console.warn('Could not fetch admin orders:', err?.response?.data?.error || err.message);
        });
    } else if (currentUser?.id) {
      getUserOrdersApi(currentUser.id)
        .then(res => {
          if (res && res.data) {
            setOrders(res.data);
          }
        })
        .catch(err => {
          console.warn('Could not fetch user orders:', err?.response?.data?.error || err.message);
        });
    } else {
      setOrders([]);
    }
  };

  const refreshCatalog = () => {
    fetchCategoriesApi().then(cats => {
      if (cats && cats.length > 0) setCategories(cats);
    }).catch(err => console.error('Error fetching categories:', err));

    fetchProductsApi().then(prods => {
      if (prods && prods.length > 0) setProducts(prods);
    }).catch(err => console.error('Error fetching products:', err));

    fetchSettingsApi().then(st => {
      if (st) setSettings(st);
    }).catch(err => console.error('Error fetching settings:', err));
  };

  useEffect(() => {
    refreshOrders();
    refreshCatalog();
  }, [isLoggedIn, currentRole, currentTab, currentUser]);

  // Handle successful login or auto-login after registration
  const handleLogin = (role: 'user' | 'admin', userObj?: User) => {
    if (userObj) {
      setCurrentUser(userObj);
      loadUserCartAndWishlist(userObj.id);
    } else {
      // Fallback check session
      const sessionId = localStorage.getItem('flora_session_id');
      fetch('/api/me', {
        headers: sessionId ? { 'x-session-id': sessionId } : {}
      })
        .then(res => res.json())
        .then(data => {
          if (data.loggedIn && data.user) {
            setCurrentUser(data.user);
            loadUserCartAndWishlist(data.user.id);
          }
        });
    }

    setCurrentRole(role);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    setCurrentTab(role === 'admin' ? 'dashboard' : 'home');
  };

  // Handle logout
  const handleLogout = () => {
    const sessionId = localStorage.getItem('flora_session_id');
    fetch('/api/logout', { 
      method: 'POST',
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    })
      .then(() => {
        localStorage.removeItem('flora_session_id');
        localStorage.removeItem('flora_active_user');
        setCurrentUser(null);
        setIsLoggedIn(false);
        setCart([]);
        setWishlist([]);
        setOrders([]);
        setCurrentTab('home');
        openAuthModal('login', 'Anda telah berhasil keluar. Silakan masuk kembali.');
      })
      .catch((err) => {
        console.error('Error logging out:', err);
        localStorage.removeItem('flora_session_id');
        localStorage.removeItem('flora_active_user');
        setCurrentUser(null);
        setIsLoggedIn(false);
        setCart([]);
        setWishlist([]);
        setOrders([]);
        setCurrentTab('home');
        openAuthModal('login', 'Anda telah berhasil keluar. Silakan masuk kembali.');
      });
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#5a5a40]/35 border-t-[#5a5a40] rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-[#5a5a40]">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-[#f5f5f0] flex flex-col justify-between relative overflow-x-hidden">
      {/* 🍀 Tab Change Progress Indicator */}
      {tabLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 z-50 animate-pulse origin-left transition-all duration-300" style={{ transformOrigin: 'left' }} />
      )}

      {/* Public Access Auth Modal */}
      {showAuthModal && (
        <LoginScreen
          onLogin={handleLogin}
          appName={settings.app_name}
          onClose={() => setShowAuthModal(false)}
          initialMode={authModalMode}
          authMessage={authModalMessage}
        />
      )}

      <div>
        {/* Navigation Bar */}
        <Navbar
          currentRole={currentRole}
          currentTab={currentTab}
          setTab={setCurrentTab}
          onLogout={handleLogout}
          cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
          wishlistCount={wishlist.length}
          appName={settings.app_name}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onOpenAuthModal={openAuthModal}
        />

        {/* Dynamic Views Router */}
        <div className="py-4">
          {currentTab === 'code' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <CodeExplorer />
            </div>
          ) : currentRole === 'admin' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminPanel
                categories={categories}
                setCategories={setCategories}
                products={products}
                setProducts={setProducts}
                orders={orders}
                setOrders={setOrders}
                settings={settings}
                setSettings={setSettings}
                articles={articles}
                setArticles={setArticles}
                refreshOrders={refreshOrders}
                refreshCatalog={refreshCatalog}
              />
            </div>
          ) : (
            <CustomerShop
              currentTab={currentTab}
              setTab={setCurrentTab}
              categories={categories}
              products={products}
              vouchers={vouchers}
              orders={orders}
              setOrders={setOrders}
              settings={settings}
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
              articles={articles}
              faqs={initialFAQs}
              testimonials={initialTestimonials}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              openAuthModal={openAuthModal}
              refreshOrders={refreshOrders}
              refreshCatalog={refreshCatalog}
            />
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 text-center space-y-2 mt-auto">
        <p>&copy; 2026 FloraPremium Store. Atas Nama Rekening Pembayaran: <strong>{settings.bank_recipient}</strong>.</p>
        <p className="text-[10px] text-slate-500 font-medium">FloraPremium Store — Pusat Pembelanjaan Tanaman Hias Eksotis & Premium Terpercaya Indonesia.</p>
      </footer>
    </div>
  );
}
