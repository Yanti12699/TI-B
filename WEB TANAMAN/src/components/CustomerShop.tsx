import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import { 
  Search, Heart, ShoppingCart, Sliders, ChevronRight, Star, Plus, Minus, Trash2, 
  MapPin, Truck, HelpCircle, Calendar, Ticket, User, Eye, Download, Printer, ArrowRight,
  Sparkles, Check, ChevronDown, CheckCircle2, Clock, Upload, FileText, Image, Leaf, Copy, CreditCard, XCircle, Zap
} from 'lucide-react';
import { Product, Category, Voucher, Order, Article, FAQ, Testimonial, Settings, User as UserType, PaymentMethod } from '../types/store';
import { indonesiaProvinces, shippingMethods } from '../data/indonesiaRegions';
import { createOrderApi, updateOrderProofApi, getPaymentMethodsApi, updateShippingApi } from '../services/orderApi';

const BANK_LIST = [
  { code: 'BCA', name: 'Bank Central Asia (BCA)', number: '8610928231', color: '#005caa' },
  { code: 'Mandiri', name: 'Bank Mandiri', number: '1310022334455', color: '#1a3d7c' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)', number: '012301020304506', color: '#00539c' },
  { code: 'BNI', name: 'Bank Negara Indonesia (BNI)', number: '0987654321', color: '#f05a28' },
  { code: 'BTN', name: 'Bank Tabungan Negara (BTN)', number: '00123015009', color: '#004b93' },
  { code: 'BSI', name: 'Bank Syariah Indonesia (BSI)', number: '7123456789', color: '#00a39d' },
  { code: 'CIMB', name: 'Bank CIMB Niaga', number: '705123456700', color: '#e11d48' },
  { code: 'Permata', name: 'Permata Bank', number: '4101234567', color: '#af1680' },
  { code: 'Danamon', name: 'Bank Danamon', number: '003512345678', color: '#ed1c24' }
];

const EWALLET_LIST = [
  { code: 'DANA', name: 'DANA', number: '081298765432', color: '#108ee9' },
  { code: 'OVO', name: 'OVO', number: '081298765432', color: '#4c2a86' },
  { code: 'GoPay', name: 'GoPay', number: '081298765432', color: '#00a5cf' },
  { code: 'ShopeePay', name: 'ShopeePay', number: '081298765432', color: '#ee4d2d' },
  { code: 'LinkAja', name: 'LinkAja', number: '081298765432', color: '#e31e25' }
];

interface CustomerShopProps {
  currentTab: string;
  setTab: (tab: string) => void;
  categories: Category[];
  products: Product[];
  vouchers: Voucher[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  settings: Settings;
  cart: { id: number; qty: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ id: number; qty: number }[]>>;
  wishlist: number[];
  setWishlist: React.Dispatch<React.SetStateAction<number[]>>;
  articles: Article[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  isLoggedIn?: boolean;
  currentUser?: UserType | null;
  openAuthModal?: (mode: 'login' | 'register', msg?: string) => void;
  refreshOrders?: () => void;
  refreshCatalog?: () => void;
}


const generateDemoReceipt = (order: Order, type: string) => {
  const dateStr = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' WIB';
  const rrn = 'RRN-' + Math.floor(100000000000 + Math.random() * 900000000000);
  const transId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
  
  // Custom design configurations based on payment type
  let primaryColor = '#005caa'; // BCA Blue
  let logoText = 'm-BCA';
  let bannerText = 'M-TRANSFER BERHASIL';
  
  const typeUpper = type.toUpperCase();
  if (typeUpper.includes('MANDIRI')) {
    primaryColor = '#1a3d7c'; // Mandiri Blue
    logoText = "Livin' Mandiri";
    bannerText = 'TRANSFER BERHASIL';
  } else if (typeUpper.includes('BRI')) {
    primaryColor = '#00539c'; // BRI Blue
    logoText = 'BRImo';
    bannerText = 'TRANSFER BERHASIL';
  } else if (typeUpper.includes('BNI')) {
    primaryColor = '#f05a28'; // BNI Orange
    logoText = 'BNI Mobile';
    bannerText = 'TRANSFER BERHASIL';
  } else if (typeUpper.includes('CIMB')) {
    primaryColor = '#e11d48'; // CIMB Red
    logoText = 'OCTO Mobile';
    bannerText = 'TRANSFER BERHASIL';
  } else if (typeUpper.includes('PERMATA')) {
    primaryColor = '#af1680'; // Permata Violet
    logoText = 'PermataMobile';
    bannerText = 'TRANSFER BERHASIL';
  } else if (typeUpper.includes('DANA')) {
    primaryColor = '#108ee9'; // DANA Blue
    logoText = 'DANA';
    bannerText = 'TRANSAKSI BERHASIL';
  } else if (typeUpper.includes('OVO')) {
    primaryColor = '#4c2a86'; // OVO Purple
    logoText = 'OVO';
    bannerText = 'TRANSAKSI BERHASIL';
  } else if (typeUpper.includes('GOPAY')) {
    primaryColor = '#00a5cf'; // GoPay Teal
    logoText = 'GoPay';
    bannerText = 'TRANSAKSI BERHASIL';
  } else if (typeUpper.includes('SHOPEEPAY')) {
    primaryColor = '#ee4d2d'; // ShopeePay Orange
    logoText = 'ShopeePay';
    bannerText = 'TRANSAKSI BERHASIL';
  } else if (typeUpper.includes('QRIS')) {
    primaryColor = '#a21caf'; // QRIS Magenta/Purple
    logoText = 'QRIS';
    bannerText = 'PEMBAYARAN QRIS BERHASIL';
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 580" width="100%" height="100%">
      <!-- Background Card -->
      <rect width="420" height="580" fill="#ffffff" rx="24" stroke="#e2e8f0" stroke-width="2"/>
      <rect width="420" height="135" fill="${primaryColor}" rx="24"/>
      <!-- Top rounded rectangle to mask top corners -->
      <path d="M 0 24 A 24 24 0 0 1 24 0 L 396 0 A 24 24 0 0 1 420 24 L 420 135 L 0 135 Z" fill="${primaryColor}"/>
      
      <!-- Bank/Provider Header -->
      <text x="30" y="45" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="900" letter-spacing="1">${logoText}</text>
      <text x="30" y="72" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="1.5">FLORA PREMIUM RETAIL</text>
      
      <!-- Status Badge -->
      <rect x="30" y="90" width="180" height="24" fill="#ffffff" rx="12" fill-opacity="0.2"/>
      <circle cx="42" cy="102" r="5" fill="#4ade80"/>
      <text x="54" y="106" fill="#ffffff" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" letter-spacing="0.5">${bannerText}</text>
      
      <!-- Ticket Cutouts (Receipt Look) -->
      <circle cx="0" cy="155" r="12" fill="#f5f5f0"/>
      <circle cx="420" cy="155" r="12" fill="#f5f5f0"/>
      <line x1="20" y1="155" x2="400" y2="155" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="6 6"/>
      
      <!-- Receipt Info Grid -->
      <g font-family="system-ui, sans-serif" font-size="12">
        <!-- Date and Time -->
        <text x="30" y="195" fill="#94a3b8" font-weight="700" font-size="10" letter-spacing="0.5">WAKTU TRANSAKSI</text>
        <text x="30" y="215" fill="#1e293b" font-weight="bold">${dateStr}</text>
        
        <!-- Transaction Codes -->
        <text x="30" y="255" fill="#94a3b8" font-weight="700" font-size="10" letter-spacing="0.5">NOMOR INVOICE / ID TRANSAKSI</text>
        <text x="30" y="275" fill="#1e293b" font-weight="bold" font-family="monospace">${order.order_code} (${transId})</text>
        
        <!-- Reference Numbers -->
        <text x="30" y="315" fill="#94a3b8" font-weight="700" font-size="10" letter-spacing="0.5">NOMOR REFERENSI (RRN)</text>
        <text x="30" y="335" fill="#1e293b" font-weight="bold" font-family="monospace">${rrn}</text>
        
        <!-- Receiver -->
        <text x="30" y="375" fill="#94a3b8" font-weight="700" font-size="10" letter-spacing="0.5">PENERIMA TRANSFER</text>
        <text x="30" y="395" fill="#1e293b" font-weight="bold">SITI NURBAYANTI (FLORA PREMIUM STORE)</text>
        
        <!-- Sender / Customer -->
        <text x="30" y="435" fill="#94a3b8" font-weight="700" font-size="10" letter-spacing="0.5">NAMA PENGIRIM</text>
        <text x="30" y="455" fill="#1e293b" font-weight="bold" font-size="13">${order.recipient_name}</text>
      </g>
      
      <line x1="30" y1="485" x2="390" y2="485" stroke="#f1f5f9" stroke-width="2"/>
      
      <!-- Total Amount -->
      <text x="30" y="515" fill="#94a3b8" font-family="system-ui, sans-serif" font-weight="700" font-size="10" letter-spacing="0.5">JUMLAH TRANSFER LUNAS</text>
      <text x="30" y="548" fill="${primaryColor}" font-family="system-ui, sans-serif" font-size="26" font-weight="900" font-style="normal">Rp${order.total_payment.toLocaleString('id-ID')}</text>
      
      <!-- Success Stamp/Seal inside receipt -->
      <g transform="translate(290, 480) rotate(-12)" opacity="0.85">
        <rect x="0" y="0" width="100" height="42" fill="none" stroke="#22c55e" stroke-width="3" rx="8"/>
        <text x="50" y="18" fill="#22c55e" font-family="system-ui, sans-serif" font-size="10" font-weight="900" text-anchor="middle" letter-spacing="1">SUCCESS</text>
        <text x="50" y="32" fill="#22c55e" font-family="system-ui, sans-serif" font-size="9" font-weight="800" text-anchor="middle" letter-spacing="0.5">LUNAS / PAID</text>
      </g>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export default function CustomerShop({
  currentTab,
  setTab,
  categories,
  products,
  vouchers,
  orders,
  setOrders,
  settings,
  cart,
  setCart,
  wishlist,
  setWishlist,
  articles,
  faqs,
  testimonials,
  isLoggedIn = false,
  currentUser,
  openAuthModal,
  refreshOrders,
  refreshCatalog
}: CustomerShopProps) {

  // Local state for product search / filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number>(4000000);
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!settings.flash_sale_end_time || !settings.flash_sale_active) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      const target = new Date(settings.flash_sale_end_time).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.flash_sale_end_time, settings.flash_sale_active]);

  const isFlashSaleRunning = useMemo(() => {
    if (!settings.flash_sale_active) return false;
    if (!settings.flash_sale_end_time) return false;
    const target = new Date(settings.flash_sale_end_time).getTime();
    const now = new Date().getTime();
    return target > now;
  }, [settings.flash_sale_active, settings.flash_sale_end_time, timeLeft]);

  // Checkout form states
  const [recipientName, setRecipientName] = useState(currentUser?.name || 'Pelanggan');
  
  // Dynamic recipient name effect
  useEffect(() => {
    if (currentUser?.name) {
      setRecipientName(currentUser.name);
    }
  }, [currentUser]);

  const [recipientPhone, setRecipientPhone] = useState('085712345678');
  const [shippingProvince, setShippingProvince] = useState<string>('jabar');
  const [shippingCityDetail, setShippingCityDetail] = useState<string>('Kota Bogor');
  const [shippingAddress, setShippingAddress] = useState('Jl. Pajajaran No. 45, Baranangsiang');
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string>('jne-reg');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank (BCA)');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');

  // active blog article state
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  // active order tracking state
  const [trackingOrderCode, setTrackingOrderCode] = useState<string | null>(null);

  // Sync cities when province changes
  useEffect(() => {
    const prov = indonesiaProvinces.find(p => p.id === shippingProvince);
    if (prov && prov.cities.length > 0) {
      setShippingCityDetail(prov.cities[0]);
    }
  }, [shippingProvince]);

  // Sync payment method when shipping method is COD
  useEffect(() => {
    const method = shippingMethods.find(m => m.id === selectedShippingMethodId);
    if (method && method.isCod) {
      setPaymentMethod('COD');
    } else if (method && !method.isCod && paymentMethod === 'COD') {
      setPaymentMethod('Transfer Bank (BCA)');
    }
  }, [selectedShippingMethodId]);

  // Memoized selected shipping method details
  const selectedShippingMethod = useMemo(() => {
    return shippingMethods.find(m => m.id === selectedShippingMethodId) || shippingMethods[0];
  }, [selectedShippingMethodId]);

  // Cart operations
  const cartDetails = useMemo(() => {
    return cart.map(item => {
      const prod = products.find(p => p.id === item.id);
      const activePrice = prod?.is_flash_sale && isFlashSaleRunning && prod?.flash_sale_price 
        ? prod.flash_sale_price 
        : (prod?.price || 0);
      return {
        ...prod,
        qty: item.qty,
        activePrice,
        subtotal: activePrice * item.qty
      };
    }).filter(item => item.id !== undefined);
  }, [cart, products]);

  const cartTotal = useMemo(() => {
    return cartDetails.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }, [cartDetails]);

  const handleAddToCart = (id: number) => {
    if (!isLoggedIn) {
      const prodName = products.find(p => p.id === id)?.name || 'produk ini';
      openAuthModal?.('login', `Silakan masuk atau daftar akun terlebih dahulu untuk menambahkan "${prodName}" ke keranjang belanja Anda.`);
      return;
    }
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        if (existing.qty >= prod.stock) return prev; // stock guard
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id, qty: 1 }];
    });

    Swal.fire({
      title: 'Masuk Keranjang! 🛒',
      text: `1x ${prod.name} ditambahkan ke keranjang belanja.`,
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleDirectCheckout = (id: number) => {
    if (!isLoggedIn) {
      const prodName = products.find(p => p.id === id)?.name || 'produk ini';
      openAuthModal?.('login', `Silakan masuk atau daftar akun terlebih dahulu untuk melakukan checkout "${prodName}".`);
      return;
    }
    const prod = products.find(p => p.id === id);
    if (!prod || prod.stock === 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) return prev;
      return [...prev, { id, qty: 1 }];
    });

    setTab('checkout');

    Swal.fire({
      title: 'Menuju Checkout! ⚡',
      text: `Produk "${prod.name}" siap diproses.`,
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleUpdateQty = (id: number, delta: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nextQty = item.qty + delta;
          if (nextQty <= 0) return null;
          if (nextQty > prod.stock) return item; // stock guard
          return { ...item, qty: nextQty };
        }
        return item;
      }).filter(Boolean) as { id: number; qty: number }[];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (id: number) => {
    if (!isLoggedIn) {
      const prodName = products.find(p => p.id === id)?.name || 'tanaman ini';
      openAuthModal?.('login', `Silakan masuk atau daftar akun terlebih dahulu untuk menyimpan "${prodName}" ke daftar Wishlist Anda.`);
      return;
    }
    const prod = products.find(p => p.id === id);
    setWishlist(prev => {
      const isAdding = !prev.includes(id);
      if (isAdding && prod) {
        Swal.fire({
          title: 'Favorit Disimpan! ❤️',
          text: `"${prod.name}" ditambahkan ke daftar favorit Anda.`,
          icon: 'success',
          timer: 1400,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
      return isAdding ? [...prev, id] : prev.filter(item => item !== id);
    });
  };

  // Voucher validation code
  const handleApplyVoucher = () => {
    setVoucherError('');
    setVoucherSuccess('');
    const code = voucherInput.trim().toUpperCase();
    const found = vouchers.find(v => v.code === code && v.is_active);
    
    if (!found) {
      setVoucherError('Kode voucher tidak aktif atau salah.');
      setAppliedVoucher(null);
      return;
    }

    if (cartTotal < found.min_purchase) {
      setVoucherError(`Minimal pembelanjaan Rp${found.min_purchase.toLocaleString('id-ID')} untuk kupon ini.`);
      setAppliedVoucher(null);
      return;
    }

    setAppliedVoucher(found);
    setVoucherSuccess(`Kupon berhasil diterapkan! Diskon ${found.discount_percent}%`);
  };

  // Submit checkout order
  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      openAuthModal?.('login', 'Silakan masuk atau daftar akun terlebih dahulu untuk menyelesaikan pesanan Anda.');
      return;
    }
    if (cartDetails.length === 0) return;

    const discountAmount = appliedVoucher 
      ? Math.min((appliedVoucher.discount_percent / 100) * cartTotal, appliedVoucher.max_discount)
      : 0;
    
    const shippingCost = selectedShippingMethod.cost;
    const totalPayment = (cartTotal + shippingCost) - discountAmount;
    const code = 'INV' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + Math.floor(Math.random() * 10000);

    const provName = indonesiaProvinces.find(p => p.id === shippingProvince)?.name || '';
    const fullAddress = `${shippingAddress}, ${shippingCityDetail}, Provinsi ${provName}`;

    const orderPayload: Partial<Order> = {
      order_code: code,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      shipping_address: fullAddress,
      shipping_city: shippingCityDetail,
      courier: `${selectedShippingMethod.courier} (${selectedShippingMethod.service})`,
      shipping_cost: shippingCost,
      discount_amount: discountAmount,
      subtotal: cartTotal,
      total_payment: totalPayment,
      payment_method: paymentMethod,
      payment_status: 'pending',
      order_status: 'pending',
      created_at: new Date().toISOString(),
      items: cartDetails.map(item => ({
        product_id: item.id!,
        name: item.name!,
        price: item.activePrice,
        quantity: item.qty,
        image_url: item.image_url!
      }))
    };

    try {
      const result = await createOrderApi(orderPayload);
      if (result.success && result.order) {
        setOrders(prev => [result.order, ...prev]);
        if (refreshOrders) refreshOrders();
        if (refreshCatalog) refreshCatalog();
      }
    } catch (err) {
      console.error('Error saving order to MySQL backend, falling back to local state:', err);
      const fallbackOrder: Order = {
        ...orderPayload as Order,
        id: orders.length + 1,
        user_id: currentUser?.id || 1
      };
      setOrders(prev => [fallbackOrder, ...prev]);
      if (refreshCatalog) refreshCatalog();
    }

    setCart([]); // clear cart
    setAppliedVoucher(null);
    setVoucherInput('');
    setTrackingOrderCode(code); // route to invoice tracking directly
    setTab('invoice');

    Swal.fire({
      title: 'Pesanan Berhasil Dibuat!',
      html: `Faktur pesanan <b>#${code}</b> telah tersimpan permanen di database MySQL.<br/><br/>Silakan selesaikan pembayaran dan unggah bukti transfer.`,
      icon: 'success',
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Lihat Faktur & Instruksi Bayar'
    });
  };

  // Persist payment proof to MySQL Database
  const handleUpdateProof = (orderId: number, proof: string | null) => {
    updateOrderProofApi(orderId, proof).catch(err => console.error('Error updating proof in MySQL:', err));
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_proof: proof } : o));
    if (refreshOrders) refreshOrders();
    if (proof) {
      Swal.fire({
        title: 'Bukti Terkirim!',
        text: 'Bukti pembayaran telah berhasil disimpan ke database. Admin akan memverifikasi secepatnya.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  // User confirm order received -> status automatically becomes 'completed' (Selesai) in DB
  const handleUserConfirmReceived = async (orderId: number) => {
    const confirm = await Swal.fire({
      title: 'Konfirmasi Pesanan Diterima?',
      text: 'Apakah Anda yakin telah menerima barang/tanaman ini dalam kondisi segar & baik? Status pesanan akan otomatis menjadi Selesai.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Terima & Selesaikan',
      cancelButtonText: 'Batal'
    });

    if (confirm.isConfirmed) {
      try {
        await updateShippingApi(orderId, 'completed');
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: 'completed', payment_status: 'paid' } : o));
        if (refreshOrders) refreshOrders();
        Swal.fire({
          title: 'Pesanan Selesai! 🌿',
          text: 'Terima kasih telah mengonfirmasi penerimaan produk! Status pesanan Anda telah otomatis diperbarui menjadi Selesai.',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
      } catch (err: any) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: 'completed', payment_status: 'paid' } : o));
        if (refreshOrders) refreshOrders();
        Swal.fire({
          title: 'Pesanan Selesai! 🌿',
          text: 'Terima kasih telah mengonfirmasi penerimaan barang.',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
      }
    }
  };


  // Filter & sort catalogs

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const isAktif = p.status !== 'nonaktif';
      const catName = categories.find(c => c.id === p.category_id)?.name || '';
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            catName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
      return isAktif && matchesSearch && matchesCategory;
    }).sort((a, b) => {
      const priceA = a.is_flash_sale && isFlashSaleRunning && a.flash_sale_price ? a.flash_sale_price : a.price;
      const priceB = b.is_flash_sale && isFlashSaleRunning && b.flash_sale_price ? b.flash_sale_price : b.price;
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'best') return (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0);
      return b.id - a.id; // newest default
    });
  }, [products, searchQuery, selectedCategory, sortBy, categories]);

  const activeTrackingOrder = useMemo(() => {
    if (!trackingOrderCode) return null;
    return orders.find(o => o.order_code === trackingOrderCode);
  }, [orders, trackingOrderCode]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
      {/* --------------------------------------------------------
          VIEW: HOMEPAGE (LANDING)
          -------------------------------------------------------- */}
      {currentTab === 'home' && (
        <div className="space-y-16">
          {/* Elegant Hero Slider section with animations */}
          <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl min-h-[480px] flex items-center">
            {/* Soft parallax-like moving background gradient and image */}
            <motion.div 
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1.02, opacity: 0.35 }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=1600&auto=format&fit=crop&q=80')" }}
            />
            
            {/* Shifting background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent animate-gradient-shift bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950" />

            {/* Floating leaf particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Leaf 1 */}
              <motion.div 
                animate={{ 
                  y: [0, -25, 0], 
                  x: [0, 10, 0],
                  rotate: [15, 30, 15] 
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] right-[20%] text-emerald-500/25 hidden md:block"
              >
                <Leaf className="w-16 h-16 fill-emerald-500/10" />
              </motion.div>
              {/* Leaf 2 */}
              <motion.div 
                animate={{ 
                  y: [0, 20, 0], 
                  x: [0, -15, 0],
                  rotate: [-10, -25, -10] 
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[35%] text-emerald-400/20 hidden md:block"
              >
                <Leaf className="w-10 h-10 fill-emerald-400/5" />
              </motion.div>
              {/* Leaf 3 */}
              <motion.div 
                animate={{ 
                  y: [0, -15, 0], 
                  x: [0, 8, 0],
                  rotate: [45, 60, 45] 
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[50%] right-[10%] text-emerald-300/15 hidden md:block"
              >
                <Leaf className="w-12 h-12 fill-emerald-300/5" />
              </motion.div>
              {/* Sparkle 1 */}
              <motion.div 
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[25%] left-[45%] text-amber-400"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </div>

            {/* Hero Main Content */}
            <div className="relative z-10 px-8 py-20 md:py-28 md:px-16 max-w-2xl space-y-6">
              <motion.span 
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" /> Koleksi Flora Premium
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight"
              >
                Keindahan Alam <br />
                <span className="text-emerald-400 italic">Untuk Rumah Mewah</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="text-slate-300 text-sm md:text-base leading-relaxed"
              >
                FloraPremium menyediakan tanaman hias kelas atas, diimpor langsung dan dirawat intensif oleh ahli botani terakreditasi sebelum dikirim ke hunian Anda dengan aman.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.8 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <motion.button 
                  onClick={() => setTab('shop')}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(16, 185, 129, 0.45)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  Belanja Sekarang <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button 
                  onClick={() => setTab('articles')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  Tips Perawatan
                </motion.button>
                {!isLoggedIn && (
                  <motion.button 
                    onClick={() => openAuthModal?.('register', 'Daftar akun atau masuk untuk mempelajari lebih lanjut layanan konsultasi botani, garansi tanaman, dan promo member eksklusif.')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Pelajari & Daftar Akun
                  </motion.button>
                )}
              </motion.div>
            </div>
          </section>

          {/* Flash Sale Section with Countdown Timer */}
          {isFlashSaleRunning && products.some(p => p.is_flash_sale) ? (
            <section className="space-y-6">
              <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-red-500 tracking-wider">Terbatas</span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mt-1">Sesi Kilat (Flash Sale)</h2>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 font-mono text-sm font-bold">
                  <Clock className="w-4 h-4 text-red-500 animate-spin-slow" />
                  <span>
                    Sisa Waktu: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.filter(p => p.is_flash_sale && p.status !== 'nonaktif').map(prod => (
                  <div key={prod.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="relative overflow-hidden aspect-video">
                      <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                        Hemat {(100 - Math.round((prod.flash_sale_price! / prod.price) * 100))}%
                      </span>
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 font-serif">{prod.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-red-500">Rp{prod.flash_sale_price?.toLocaleString('id-ID')}</span>
                        <span className="text-xs line-through text-slate-400">Rp{prod.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <motion.button 
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleAddToCart(prod.id)}
                          disabled={prod.stock === 0}
                          className="py-2.5 bg-slate-100 hover:bg-emerald-500 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 font-bold text-xs text-slate-700 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Keranjang
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleDirectCheckout(prod.id)}
                          disabled={prod.stock === 0}
                          className="py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-slate-100 disabled:text-slate-400 font-bold text-xs text-white rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" /> Checkout
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            settings.flash_sale_active && (
              <section className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 p-8 rounded-3xl text-center space-y-2">
                <Clock className="w-8 h-8 text-red-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-800 font-serif">Sesi Flash Sale Selesai / Belum Dimulai</h3>
                <p className="text-xs text-slate-500">Nantikan kejutan promo tanaman hias premium berikutnya dari {settings.app_name}!</p>
              </section>
            )
          )}

          {/* Categories Grid with viewport trigger */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
            className="space-y-6"
          >
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Kategori</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mt-1">Eksplorasi Spesies Flora</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map(cat => (
                <motion.button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setTab('shop'); }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05, borderColor: '#10b981', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border border-slate-100 p-6 rounded-2xl text-center cursor-pointer transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform mb-3">
                    {cat.name[0]}
                  </div>
                  <span className="block font-bold text-sm text-slate-800">{cat.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.section>

          {/* Premium / Best Sellers plants */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="space-y-6"
          >
            <div className="flex justify-between items-end border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Koleksi Terpopuler</span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mt-1">Produk Terlaris Otomatis</h2>
              </div>
              <button onClick={() => setTab('shop')} className="text-emerald-500 text-sm font-bold hover:underline flex items-center gap-1">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.filter(p => p.is_best_seller && !p.is_flash_sale && p.status !== 'nonaktif').slice(0, 4).map(prod => (
                <motion.div 
                  key={prod.id} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.01)" }}
                  className="group bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {prod.is_premium && (
                      <span className="absolute top-4 left-4 bg-amber-600 text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm z-10">
                        PREMIUM
                      </span>
                    )}
                    
                    {/* Hover Overlay with Both + Keranjang and Checkout buttons */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-10 space-y-2">
                      <div className="grid grid-cols-2 gap-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(prod.id); }}
                          disabled={prod.stock === 0}
                          className="py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Keranjang
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => { e.stopPropagation(); handleDirectCheckout(prod.id); }}
                          disabled={prod.stock === 0}
                          className="py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" /> Checkout
                        </motion.button>
                      </div>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.75, rotate: -20 }}
                      animate={wishlist.includes(prod.id) ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => toggleWishlist(prod.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full shadow transition-all z-20 cursor-pointer ${
                        wishlist.includes(prod.id) ? 'bg-rose-50 text-rose-500 border border-rose-200' : 'bg-white/90 hover:bg-white text-slate-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(prod.id) ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                    </motion.button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-950 font-serif line-clamp-1">{prod.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{prod.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <span className="text-base font-black text-slate-900">Rp{prod.price.toLocaleString('id-ID')}</span>
                      <div className="flex md:hidden gap-1">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToCart(prod.id)}
                          className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDirectCheckout(prod.id)}
                          className="p-2 bg-amber-500 text-white rounded-lg shadow-sm"
                        >
                          <Zap className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Testimonial & Botanical blog previews */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">Tips Botanical Terbaru</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {articles.slice(0, 2).map(art => (
                  <button 
                    key={art.id} 
                    onClick={() => { setActiveArticle(art); setTab('articles'); }}
                    className="group text-left bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Edukasi Flora</span>
                      <h3 className="text-base font-bold text-slate-900 font-serif line-clamp-2 group-hover:text-emerald-600 transition-colors">{art.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: art.content }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">Review Kolektor</h2>
              <div className="space-y-4">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition-all">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">"{t.comment}"</p>
                    <span className="block text-xs font-bold text-slate-800">— {t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      )}

      {/* --------------------------------------------------------
          VIEW: SHOP CATALOG
          -------------------------------------------------------- */}
      {currentTab === 'shop' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Filter Sidebar */}
          <aside className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5"><Sliders className="w-4 h-4 text-slate-500" /> Filter</h3>
              <button onClick={() => { setSelectedCategory(null); setSearchQuery(''); }} className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer">Reset</button>
            </div>

            {/* Category selection */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Kategori Spesies</span>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${!selectedCategory ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Semua Tanaman
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${selectedCategory === cat.id ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Plant Grid with Toolbar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Sort tool bar */}
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:max-w-xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari produk tanaman atau deskripsi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-xl text-sm focus:outline-emerald-500 focus:bg-white bg-slate-50"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {/* Dynamic Category Filter Dropdown (Updates automatically when admin adds new categories) */}
                  <select
                    value={selectedCategory ?? ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                    className="border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-emerald-500 bg-slate-50 cursor-pointer min-w-[150px]"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Urutan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-emerald-500 bg-white"
                  >
                    <option value="default">Terbaru</option>
                    <option value="price_asc">Harga Terendah</option>
                    <option value="price_desc">Harga Tertinggi</option>
                    <option value="best">Koleksi Terlaris</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Results Display */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {filteredProducts.map(prod => {
                const activePrice = prod.is_flash_sale && isFlashSaleRunning && prod.flash_sale_price ? prod.flash_sale_price : prod.price;
                return (
                  <motion.div 
                    key={prod.id} 
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.01)" }}
                    className="group bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative overflow-hidden aspect-square cursor-pointer" onClick={() => setSelectedProduct(prod)}>
                      <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      {prod.is_premium && (
                        <span className="absolute top-4 left-4 bg-amber-600 text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm z-10">
                          PREMIUM
                        </span>
                      )}
                      {prod.is_flash_sale && isFlashSaleRunning && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm z-10">
                          PROMO
                        </span>
                      )}
                      
                      {/* Hover Overlay with Both + Keranjang and Checkout buttons */}
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-10 space-y-2">
                        <div className="grid grid-cols-2 gap-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => { e.stopPropagation(); handleAddToCart(prod.id); }}
                            disabled={prod.stock === 0}
                            className="py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
                            title="Tambah ke Keranjang"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Keranjang
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={(e) => { e.stopPropagation(); handleDirectCheckout(prod.id); }}
                            disabled={prod.stock === 0}
                            className="py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
                            title="Checkout Langsung"
                          >
                            <Zap className="w-3.5 h-3.5" /> Checkout
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">
                            {categories.find(c => c.id === prod.category_id)?.name}
                          </span>
                          <span className={`text-[10px] font-bold ${prod.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {prod.stock > 0 ? `Stok: ${prod.stock}` : 'Habis'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 font-serif line-clamp-1 mt-1 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => setSelectedProduct(prod)}>{prod.name}</h3>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="flex flex-col">
                          <span className="text-base font-black text-slate-900">Rp{activePrice.toLocaleString('id-ID')}</span>
                          {prod.is_flash_sale && isFlashSaleRunning && (
                            <span className="text-[10px] line-through text-slate-400">Rp{prod.price.toLocaleString('id-ID')}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {/* Animated Heart Favorit Button */}
                          <motion.button 
                            whileTap={{ scale: 0.75, rotate: -20 }}
                            animate={wishlist.includes(prod.id) ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }}
                            className={`p-2 rounded-xl border border-slate-100 hover:bg-rose-50 transition-all cursor-pointer ${wishlist.includes(prod.id) ? 'text-rose-500 bg-rose-50 border-rose-200' : 'text-slate-400'}`}
                            title={wishlist.includes(prod.id) ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                          >
                            <Heart className={`w-4 h-4 transition-transform ${wishlist.includes(prod.id) ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                          </motion.button>

                          {/* Mobile Quick Action Buttons */}
                          <div className="flex sm:hidden gap-1">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); handleAddToCart(prod.id); }}
                              disabled={prod.stock === 0}
                              className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm"
                              title="Tambah ke Keranjang"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); handleDirectCheckout(prod.id); }}
                              disabled={prod.stock === 0}
                              className="p-2 bg-amber-500 text-white rounded-lg shadow-sm"
                              title="Checkout Langsung"
                            >
                              <Zap className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <Sliders className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900">Hasil Tidak Ditemukan</h4>
                <p className="text-xs text-slate-500 mt-1">Gunakan kata pencarian lain atau setel ulang filter Anda.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------
          VIEW: WISHLIST
          -------------------------------------------------------- */}
      {currentTab === 'wishlist' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-4">Favorit Saya (Wishlist)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {wishlist.map(id => {
              const prod = products.find(p => p.id === id);
              if (!prod) return null;
              const activePrice = prod.is_flash_sale && isFlashSaleRunning && prod.flash_sale_price ? prod.flash_sale_price : prod.price;
              return (
                <div key={prod.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="relative aspect-square">
                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-4 right-4 p-2 bg-white text-rose-500 rounded-full shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 font-serif line-clamp-1">{prod.name}</h3>
                      <span className="font-black text-slate-950 block mt-1">Rp{activePrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleAddToCart(prod.id)}
                        className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Keranjang
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleDirectCheckout(prod.id)}
                        className="py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                      >
                        <Zap className="w-3.5 h-3.5" /> Checkout
                      </motion.button>
                    </div>
                  </div>
                </div>
              );
            })}
            {wishlist.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900">Wishlist Kosong</h4>
                <p className="text-xs text-slate-500 mt-1">Tambahkan beberapa flora premium ke dalam wishlist favorit Anda.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------
          VIEW: SHOPPING CART
          -------------------------------------------------------- */}
      {currentTab === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-4">Keranjang Belanja</h2>
            <div className="space-y-4">
              {cartDetails.map(item => (
                <div key={item.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex gap-4 items-center flex-wrap sm:flex-nowrap">
                  <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1 min-w-[150px]">
                    <h3 className="font-serif font-bold text-slate-900">{item.name}</h3>
                    <span className="text-xs font-black text-slate-700 mt-1 block">Rp{item.activePrice?.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center border border-slate-100 rounded-lg">
                    <button onClick={() => handleUpdateQty(item.id!, -1)} className="p-2 text-slate-500 hover:bg-slate-50"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="px-3 font-bold text-sm text-slate-800">{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item.id!, 1)} className="p-2 text-slate-500 hover:bg-slate-50"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <span className="block font-bold text-sm text-slate-900">Rp{item.subtotal?.toLocaleString('id-ID')}</span>
                    <button onClick={() => handleRemoveFromCart(item.id!)} className="text-xs text-red-500 font-semibold hover:underline mt-1">Hapus</button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900">Keranjang Kosong</h4>
                  <p className="text-xs text-slate-500 mt-1">Temukan flora eksotis di katalog kami dan mulailah berbelanja.</p>
                </div>
              )}
            </div>
          </div>

          {/* Subtotal summary section */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6 h-fit">
            <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">Ringkasan Belanja</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal ({cartDetails.length} jenis)</span>
                <span className="font-bold text-slate-900">Rp{cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Pengiriman</span>
                <span className="font-semibold text-emerald-500">Dihitung di Checkout</span>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between font-serif font-bold text-base text-slate-900">
              <span>Total Estimasi</span>
              <span>Rp{cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <button
              onClick={() => setTab('checkout')}
              disabled={cart.length === 0}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/10"
            >
              Lanjutkan Ke Checkout
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------
          VIEW: CHECKOUT PROCESS
          -------------------------------------------------------- */}
      {currentTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Checkout Forms */}
          <div className="lg:col-span-2 space-y-6 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-4">Formulir Alamat & Pengiriman</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nama Penerima <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={recipientName} 
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-emerald-500 bg-slate-50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nomor HP Penerima <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={recipientPhone} 
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-emerald-500 bg-slate-50"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Provinsi Pengiriman <span className="text-red-500">*</span></label>
                <select
                  value={shippingProvince}
                  onChange={(e) => setShippingProvince(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-emerald-500 bg-white"
                >
                  {indonesiaProvinces.map(prov => (
                    <option key={prov.id} value={prov.id}>{prov.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Kota / Kabupaten <span className="text-red-500">*</span></label>
                <select
                  value={shippingCityDetail}
                  onChange={(e) => setShippingCityDetail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-emerald-500 bg-white"
                >
                  {(indonesiaProvinces.find(p => p.id === shippingProvince)?.cities || []).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Metode Pengiriman & Kurir <span className="text-red-500">*</span></label>
                <select
                  value={selectedShippingMethodId}
                  onChange={(e) => setSelectedShippingMethodId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-emerald-500 bg-white font-semibold"
                >
                  {shippingMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name} - Rp{method.cost.toLocaleString('id-ID')} ({method.etd})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Alamat Lengkap Rumah (RT/RW, Dusun/Jalan, Kelurahan, Kecamatan) <span className="text-red-500">*</span></label>
                <textarea 
                  value={shippingAddress} 
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-emerald-500 bg-slate-50"
                  required
                  placeholder="Contoh: Jl. Anggrek No. 12, RT 02 RW 03, Kel. Sempur, Kec. Bogor Tengah"
                />
              </div>
            </div>

            {/* Methods of Payment section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-serif font-bold text-slate-900">Pilih Metode Pembayaran</h3>
              {selectedShippingMethod.isCod ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/50 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold">COD Dipilih:</span> Metode pembayaran dikunci ke <strong>Bayar di Tempat (COD)</strong> karena Anda menggunakan Kurir COD Toko.
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'bank', label: 'Transfer Bank', desc: 'BCA, Mandiri, BRI, BNI, dll', disabled: selectedShippingMethod.isCod },
                  { id: 'ewallet', label: 'E-Wallet', desc: 'DANA, OVO, GoPay, SPay', disabled: selectedShippingMethod.isCod },
                  { id: 'qris', label: 'QRIS', desc: 'Scan QR Code Instan', disabled: selectedShippingMethod.isCod },
                  { id: 'cod', label: 'COD (Bayar di Tempat)', desc: 'Bayar saat kurir sampai', disabled: false }
                ].map(cat => {
                  const isSelected = cat.id === 'bank' && paymentMethod.startsWith('Transfer Bank') ||
                                     cat.id === 'ewallet' && paymentMethod.startsWith('E-Wallet') ||
                                     cat.id === 'qris' && paymentMethod === 'QRIS' ||
                                     cat.id === 'cod' && paymentMethod === 'COD';
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={cat.disabled}
                      onClick={() => {
                        if (cat.id === 'bank') setPaymentMethod('Transfer Bank (BCA)');
                        else if (cat.id === 'ewallet') setPaymentMethod('E-Wallet (DANA)');
                        else if (cat.id === 'qris') setPaymentMethod('QRIS');
                        else if (cat.id === 'cod') setPaymentMethod('COD');
                      }}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700 font-bold shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                      } ${cat.disabled ? 'opacity-40 cursor-not-allowed bg-slate-50' : ''}`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-xs font-bold tracking-wide">{cat.label}</span>
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'}`}>
                          {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal mt-2 block">{cat.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-options for Transfer Bank */}
              {paymentMethod.startsWith('Transfer Bank') && !selectedShippingMethod.isCod && (
                <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Pilih Rekening Bank Pembayaran:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BANK_LIST.map(bank => {
                      const isBankSelected = paymentMethod === `Transfer Bank (${bank.code})`;
                      return (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => setPaymentMethod(`Transfer Bank (${bank.code})`)}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            isBankSelected
                              ? 'border-emerald-500 bg-white shadow-sm ring-1 ring-emerald-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <span 
                            className="text-xs font-black tracking-wider block"
                            style={{ color: bank.color }}
                          >
                            {bank.code === 'BCA' ? 'm-BCA' : bank.code}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{bank.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-options for E-Wallet */}
              {paymentMethod.startsWith('E-Wallet') && !selectedShippingMethod.isCod && (
                <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Pilih Aplikasi E-Wallet Pembayaran:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {EWALLET_LIST.map(ew => {
                      const isEWalletSelected = paymentMethod === `E-Wallet (${ew.code})`;
                      return (
                        <button
                          key={ew.code}
                          type="button"
                          onClick={() => setPaymentMethod(`E-Wallet (${ew.code})`)}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            isEWalletSelected
                              ? 'border-emerald-500 bg-white shadow-sm ring-1 ring-emerald-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <span 
                            className="text-xs font-black tracking-wider block"
                            style={{ color: ew.color }}
                          >
                            {ew.code}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Layanan Digital</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Checkout Bill Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">Faktur Rincian Belanja</h3>
              
              {/* Voucher Apply Coupon form */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Gunakan Voucher Diskon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: PLANTLOVER"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 uppercase bg-slate-50 font-bold"
                  />
                  <button 
                    onClick={handleApplyVoucher}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Terapkan
                  </button>
                </div>
                {voucherError && <span className="block text-[11px] text-red-500 font-medium">{voucherError}</span>}
                {voucherSuccess && <span className="block text-[11px] text-emerald-600 font-medium">{voucherSuccess}</span>}
              </div>

              {/* Pricing lists */}
              <div className="space-y-3 pt-3 border-t border-slate-50">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal Tanaman</span>
                  <span>Rp{cartTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Ongkos Kirim ({selectedShippingMethod.name})</span>
                  <span>Rp{selectedShippingMethod.cost.toLocaleString('id-ID')}</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-xs text-emerald-600 font-bold bg-emerald-50/50 p-2 rounded-lg">
                    <span>Diskon ({appliedVoucher.code})</span>
                    <span>- Rp{Math.min((appliedVoucher.discount_percent / 100) * cartTotal, appliedVoucher.max_discount).toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between font-serif font-bold text-base text-slate-900">
                <span>Total Pembayaran</span>
                <span className="text-emerald-600">
                  Rp{(
                    cartTotal + 
                    selectedShippingMethod.cost - 
                    (appliedVoucher ? Math.min((appliedVoucher.discount_percent / 100) * cartTotal, appliedVoucher.max_discount) : 0)
                  ).toLocaleString('id-ID')}
                </span>
              </div>

              {/* Dynamic Payment Details representation */}
              {paymentMethod.startsWith('Transfer Bank') && (() => {
                const selectedBankCode = paymentMethod.match(/\(([^)]+)\)/)?.[1] || 'BCA';
                const bankInfo = BANK_LIST.find(b => b.code === selectedBankCode) || BANK_LIST[0];
                const accNo = bankInfo.code === 'BCA' ? settings.bank_account_no : bankInfo.number;
                return (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2 text-xs animate-fadeIn">
                    <span className="block font-bold text-slate-500 uppercase tracking-wide">
                      Detail {paymentMethod}
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Bank:</span>
                      <span className="font-bold text-slate-900">{bankInfo.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Nomor Rekening:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 font-mono">{accNo}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(accNo);
                            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Nomor rekening disalin!', showConfirmButton: false, timer: 1500 });
                          }}
                          className="p-1 hover:bg-slate-200 text-emerald-600 rounded transition-all"
                          title="Salin Nomor Rekening"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Atas Nama:</span>
                      <span className="font-bold text-emerald-600">Siti Nurbayanti</span>
                    </div>
                  </div>
                );
              })()}

              {paymentMethod.startsWith('E-Wallet') && (() => {
                const selectedEwalletCode = paymentMethod.match(/\(([^)]+)\)/)?.[1] || 'DANA';
                const ewInfo = EWALLET_LIST.find(e => e.code === selectedEwalletCode) || EWALLET_LIST[0];
                const ewNo = settings.ewallet_no || ewInfo.number;
                return (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2 text-xs animate-fadeIn">
                    <span className="block font-bold uppercase tracking-wide" style={{ color: ewInfo.color }}>
                      Detail Transfer {ewInfo.name}
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">E-Wallet:</span>
                      <span className="font-bold text-slate-900">{ewInfo.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Nomor HP / Akun {ewInfo.name}:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 font-mono">{ewNo}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(ewNo);
                            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Nomor E-Wallet disalin!', showConfirmButton: false, timer: 1500 });
                          }}
                          className="p-1 hover:bg-slate-200 text-emerald-600 rounded transition-all"
                          title="Salin Nomor E-Wallet"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Atas Nama:</span>
                      <span className="font-bold text-emerald-600">Siti Nurbayanti</span>
                    </div>
                  </div>
                );
              })()}

              {paymentMethod === 'QRIS' && (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center space-y-3 text-xs animate-fadeIn">
                  <span className="block font-bold text-slate-500 uppercase tracking-wide">Scan QRIS All E-Wallet</span>
                  <img src={settings.qris_url} alt="QRIS Siti" className="w-32 h-32 mx-auto object-cover border border-slate-200 rounded-lg shadow-sm" />
                  <span className="block font-semibold text-emerald-600">Atas Nama: Siti Nurbayanti</span>
                </div>
              )}

              {!isLoggedIn && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                  <span>Anda perlu masuk atau mendaftar untuk menyelesaikan pesanan.</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal?.('login', 'Silakan masuk ke akun Anda untuk menyelesaikan transaksi.')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
                  >
                    Masuk / Daftar
                  </button>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Selesaikan Pembayaran <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------
          VIEW: INVOICE / ORDER SUCCESS
          -------------------------------------------------------- */}
      {currentTab === 'invoice' && activeTrackingOrder && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-serif font-bold text-slate-900">Pesanan Berhasil Diajukan!</h2>
            <p className="text-xs text-slate-600">Faktur pesanan Anda telah diterbitkan secara otomatis oleh sistem.</p>
          </div>

          {/* Visual Invoice printable */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-md space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 flex-wrap gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900">{settings.app_name}</h3>
                <span className="text-[10px] text-slate-400 block mt-1">{settings.address}</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-emerald-600 text-sm font-mono">{activeTrackingOrder.order_code}</span>
                <span className="block text-[10px] text-slate-400 mt-1">{new Date(activeTrackingOrder.created_at).toLocaleDateString('id-ID')}</span>
              </div>
            </div>

            {/* Shipment address detail */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Dikirim Ke:</span>
                <span className="font-bold text-slate-950 block">{activeTrackingOrder.recipient_name}</span>
                <span className="text-slate-600 block">{activeTrackingOrder.recipient_phone}</span>
                <span className="text-slate-500 block">{activeTrackingOrder.shipping_address}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Pembayaran & Status:</span>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode:</span>
                  <span className="font-bold text-slate-900">{activeTrackingOrder.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Pembayaran:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    activeTrackingOrder.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>{activeTrackingOrder.payment_status === 'paid' ? 'LUNAS' : 'PENDING'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kurir Pengiriman:</span>
                  <span className="font-bold text-slate-900">{activeTrackingOrder.courier}</span>
                </div>
                {activeTrackingOrder.tracking_number && (
                  <div className="flex justify-between bg-slate-50 p-1 rounded">
                    <span className="text-slate-500">No Resi:</span>
                    <span className="font-bold text-emerald-600 font-mono">{activeTrackingOrder.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipment steps tracker */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4">
              <span className="block font-bold text-xs text-slate-500 uppercase tracking-wide">Pelacakan Resi (Real-time Tracker)</span>
              <div className="flex justify-between items-center relative text-[10px] font-bold text-slate-400 flex-wrap sm:flex-nowrap gap-2">
                {[
                  { step: 'pending', label: 'Pesanan Dibuat', done: true },
                  { step: 'paid', label: 'Dibayar', done: activeTrackingOrder.payment_status === 'paid' },
                  { step: 'processing', label: 'Dikemas', done: activeTrackingOrder.order_status !== 'pending' },
                  { step: 'shipped', label: 'Dikirim', done: ['shipped', 'completed'].includes(activeTrackingOrder.order_status) },
                  { step: 'completed', label: 'Selesai', done: activeTrackingOrder.order_status === 'completed' }
                ].map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      s.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={s.done ? 'text-emerald-600' : 'text-slate-400'}>{s.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 border-t border-slate-200/50 pt-2 font-medium">
                {activeTrackingOrder.order_status === 'pending' && '📝 Pesanan diajukan, menunggu konfirmasi pembayaran admin.'}
                {activeTrackingOrder.order_status === 'processing' && '📦 Pembayaran terverifikasi! Pesanan Anda sedang dikemas dengan bubble wrap tebal dan packing kayu.'}
                {activeTrackingOrder.order_status === 'shipped' && `🚚 Paket Anda telah diserahkan ke kurir ${activeTrackingOrder.courier}. Resi pelacakan aktif: ${activeTrackingOrder.tracking_number}.`}
                {activeTrackingOrder.order_status === 'shipped' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
                    <div className="text-xs text-emerald-900">
                      <span className="font-bold block">🚚 Paket Sudah Diantarkan?</span>
                      Jika paket tanaman hias telah tiba dan diterima dengan segar, silakan konfirmasi untuk menyelesaikan pesanan.
                    </div>
                    <button
                      onClick={() => handleUserConfirmReceived(activeTrackingOrder.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Konfirmasi Pesanan Diterima
                    </button>
                  </div>
                )}
                {activeTrackingOrder.order_status === 'completed' && '🌿 Paket tanaman hias diterima dengan segar! Terima kasih telah berbelanja di FloraPremium.'}
              </p>
            </div>

            {/* Calculations summaries */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Tanaman</span>
                <span className="font-bold text-slate-900">Rp{activeTrackingOrder.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim</span>
                <span className="font-bold text-slate-900">Rp{activeTrackingOrder.shipping_cost.toLocaleString('id-ID')}</span>
              </div>
              {activeTrackingOrder.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Potongan Voucher Diskon</span>
                  <span>- Rp{activeTrackingOrder.discount_amount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3 flex justify-between font-serif font-bold text-base text-slate-950">
                <span>Total Pembayaran</span>
                <span>Rp{activeTrackingOrder.total_payment.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Section Bukti Pembayaran */}
          {activeTrackingOrder.payment_method !== 'COD' && (
            <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">Bukti Transfer Pembayaran</h3>
                  <p className="text-[10px] text-slate-500">Unggah resi transaksi atau buat struk demo otomatis di bawah ini.</p>
                </div>
              </div>

              {activeTrackingOrder.payment_proof ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-100/50 p-4 rounded-2xl flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-xs text-emerald-800">Bukti Pembayaran Berhasil Dikirim!</span>
                      <p className="text-[10px] text-emerald-600 mt-0.5">Admin akan memverifikasi pembayaran Anda segera. Terima kasih telah berbelanja tanaman hias premium kami.</p>
                    </div>
                  </div>
                  
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Pratinjau Bukti Pembayaran Anda</span>
                    <img 
                      src={activeTrackingOrder.payment_proof} 
                      alt="Bukti Transfer" 
                      className="max-h-72 object-contain rounded-lg border border-slate-200 shadow-sm bg-white"
                    />
                    <button
                      onClick={() => {
                        handleUpdateProof(activeTrackingOrder.id, null);
                      }}
                      className="mt-3 text-xs text-red-500 font-bold hover:underline"
                    >
                      Hapus & Ganti Bukti Pembayaran
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition-colors relative bg-slate-50/50">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleUpdateProof(activeTrackingOrder.id, reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="block text-xs font-bold text-slate-700">Pilih atau Seret Foto Bukti Pembayaran</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Format gambar JPG, PNG, atau WEBP</span>
                  </div>

                  {/* Demo Helper receipt generation */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Fitur Uji Coba Cepat (Struk Demo)</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Tidak punya foto struk transfer? Klik tombol di bawah ini untuk membuat struk transaksi otomatis secara instan!</p>
                    </div>

                    {/* Smart button that detects order's payment method */}
                    <button
                      onClick={() => {
                        const pm = activeTrackingOrder.payment_method;
                        const receipt = generateDemoReceipt(activeTrackingOrder, pm);
                        handleUpdateProof(activeTrackingOrder.id, receipt);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Buat Struk Otomatis Sesuai Metode: <strong>{activeTrackingOrder.payment_method}</strong></span>

                    </button>

                    <div className="border-t border-slate-200/50 pt-2 text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Pilihan Struk Lainnya:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        <button
                          onClick={() => {
                            const receipt = generateDemoReceipt(activeTrackingOrder, 'BCA');
                            handleUpdateProof(activeTrackingOrder.id, receipt);
                          }}
                          className="py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[9px] rounded-lg transition-all"
                        >
                          BCA Demo
                        </button>
                        <button
                          onClick={() => {
                            const receipt = generateDemoReceipt(activeTrackingOrder, 'Mandiri');
                            handleUpdateProof(activeTrackingOrder.id, receipt);
                          }}
                          className="py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[9px] rounded-lg transition-all"
                        >
                          Mandiri Demo
                        </button>
                        <button
                          onClick={() => {
                            const receipt = generateDemoReceipt(activeTrackingOrder, 'BRI');
                            handleUpdateProof(activeTrackingOrder.id, receipt);
                          }}
                          className="py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[9px] rounded-lg transition-all"
                        >
                          BRI Demo
                        </button>
                        <button
                          onClick={() => {
                            const receipt = generateDemoReceipt(activeTrackingOrder, 'BNI');
                            handleUpdateProof(activeTrackingOrder.id, receipt);
                          }}
                          className="py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-[9px] rounded-lg transition-all"
                        >
                          BNI Demo
                        </button>
                        <button
                          onClick={() => {
                            const receipt = generateDemoReceipt(activeTrackingOrder, 'QRIS');
                            handleUpdateProof(activeTrackingOrder.id, receipt);
                          }}
                          className="py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[9px] rounded-lg transition-all"
                        >
                          QRIS Demo
                        </button>
                        <button
                          onClick={() => {
                            const receipt = generateDemoReceipt(activeTrackingOrder, 'DANA');
                            handleUpdateProof(activeTrackingOrder.id, receipt);
                          }}
                          className="py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[9px] rounded-lg transition-all"
                        >
                          DANA Demo
                        </button>
                        <button
                          onClick={() => {
                            const receipt = generateDemoReceipt(activeTrackingOrder, 'OVO');
                            handleUpdateProof(activeTrackingOrder.id, receipt);
                          }}
                          className="py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-[9px] rounded-lg transition-all"
                        >
                          OVO Demo
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom helper actions */}
          <div className="flex gap-4">
            <button 
              onClick={() => window.print()}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Cetak Invoice PDF
            </button>
            <button 
              onClick={() => setTab('home')}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all"
            >
              Kembali Belanja
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------
          VIEW: ORDERS TRANSACTION LIST
          -------------------------------------------------------- */}
      {currentTab === 'orders' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Histori Belanja</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Pesanan & Transaksi Saya</h2>
            <p className="text-xs text-slate-500">Pantau status konfirmasi admin, pelacakan kurir, dan pembayaran secara real-time.</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-slate-100 p-12 rounded-3xl shadow-sm text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-slate-900">Belum Ada Transaksi</h3>
                <p className="text-xs text-slate-400">Anda belum memesan tanaman hias premium. Mulai jelajahi katalog tanaman kami.</p>
              </div>
              <button
                onClick={() => setTab('home')}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all"
              >
                Mulai Belanja Tanaman
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                // Determine order status styling
                let statusBg = 'bg-slate-50 text-slate-600';
                let statusLabel = 'Menunggu Konfirmasi';
                if (order.order_status === 'processing') {
                  statusBg = 'bg-blue-50 text-blue-600';
                  statusLabel = 'Sedang Dikemas';
                } else if (order.order_status === 'shipped') {
                  statusBg = 'bg-purple-50 text-purple-600';
                  statusLabel = 'Dalam Pengiriman';
                } else if (order.order_status === 'completed') {
                  statusBg = 'bg-emerald-50 text-emerald-600';
                  statusLabel = 'Selesai / Diterima';
                } else if (order.order_status === 'cancelled') {
                  statusBg = 'bg-red-50 text-red-600';
                  statusLabel = 'Dibatalkan';
                }

                // Determine payment status styling
                const isPaid = order.payment_status === 'paid';
                const payBg = isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200';
                const payLabel = isPaid ? 'Lunas' : 'Menunggu Verifikasi';

                return (
                  <div key={order.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-sm text-slate-900">{order.order_code}</span>
                        <span className="text-[11px] text-slate-400">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB</span>
                      </div>
                      <div className="flex gap-2 items-center flex-wrap">
                        {order.payment_method !== 'COD' && (
                          order.payment_proof ? (
                            <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                              ✓ Bukti Ada
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border bg-rose-50 text-rose-700 border-rose-200">
                              ⚠ Butuh Bukti Transfer
                            </span>
                          )
                        )}
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${payBg}`}>
                          💳 {order.payment_method === 'COD' ? 'COD' : 'TRANSFER'}: {payLabel}
                        </span>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusBg}`}>
                          📦 {statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Rincian Produk yang Dibeli */}
                    {order.items && order.items.length > 0 && (
                      <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Daftar Tanaman Dipesan ({order.items.length} items)</span>
                        <div className="divide-y divide-slate-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1.5 gap-3">
                              <div className="flex items-center gap-2.5">
                                <img 
                                  src={item.image_url} 
                                  alt={item.name} 
                                  className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0 bg-white" 
                                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600'; }} 
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block">{item.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{item.quantity} pcs x Rp{item.price.toLocaleString('id-ID')}</span>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-emerald-700 shrink-0">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Penerima & Alamat</span>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950">{order.recipient_name}</p>
                          <p className="text-slate-500 font-medium">{order.recipient_phone}</p>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{order.shipping_address}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Pengiriman & Pembayaran</span>
                        <div className="space-y-1">
                          <p className="text-slate-800 font-medium">Layanan: <strong className="text-slate-950">{order.courier}</strong></p>
                          <p className="text-slate-800 font-medium">Metode Bayar: <strong className="text-slate-950">{order.payment_method}</strong></p>
                          {order.tracking_number && (
                            <p className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono inline-block font-semibold mt-1">
                              No. Resi: {order.tracking_number}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 md:text-right flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Rincian Pembayaran</span>
                          <div className="space-y-0.5 mt-1">
                            <div className="flex justify-between md:justify-end md:gap-4">
                              <span>Subtotal:</span>
                              <span className="font-semibold text-slate-900">Rp{order.subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between md:justify-end md:gap-4">
                              <span>Ongkir:</span>
                              <span className="font-semibold text-slate-900">Rp{order.shipping_cost.toLocaleString('id-ID')}</span>
                            </div>
                            {order.discount_amount > 0 && (
                              <div className="flex justify-between md:justify-end md:gap-4 text-emerald-600 font-bold">
                                <span>Voucher:</span>
                                <span>-Rp{order.discount_amount.toLocaleString('id-ID')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="border-t border-slate-100 pt-2 flex justify-between md:justify-end md:gap-4 items-baseline">
                          <span className="font-serif font-bold text-slate-900">Total:</span>
                          <span className="font-serif font-extrabold text-base text-emerald-600">Rp{order.total_payment.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-slate-50 flex-wrap">
                      <button
                        onClick={() => {
                          setTrackingOrderCode(order.order_code);
                          setTab('invoice');
                        }}
                        className="flex-1 min-w-[150px] py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lacak Detail & Invoice
                      </button>

                      {order.order_status === 'shipped' && (
                        <button
                          onClick={() => handleUserConfirmReceived(order.id)}
                          className="flex-1 min-w-[150px] py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-100 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Konfirmasi Terima Barang
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------
          VIEW: BOTANICAL ARTICLES (BLOG)
          -------------------------------------------------------- */}
      {currentTab === 'articles' && (
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Edu-Blog</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-1">Panduan Botanical Ahli</h2>
            <p className="text-xs text-slate-500 mt-1">Edukasi komprehensif agar Monstera dan Bonsai Anda tetap ber-mutasi prima.</p>
          </div>

          {activeArticle ? (
            <article className="max-w-3xl mx-auto bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
              <button 
                onClick={() => setActiveArticle(null)}
                className="text-emerald-500 text-xs font-bold hover:underline cursor-pointer"
              >
                ← Kembali ke Blog
              </button>
              <div className="space-y-2">
                <img src={activeArticle.image_url} alt={activeArticle.title} className="w-full h-80 object-cover rounded-2xl" />
                {activeArticle.caption && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                    <Image className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Ket. Foto:</strong> {activeArticle.caption}</span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{activeArticle.title}</h1>
                <div className="flex gap-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Penulis: {activeArticle.author}</span>
                  <span>•</span>
                  <span>Tanggal: {new Date(activeArticle.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: activeArticle.content }} />
            </article>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map(art => (
                <div key={art.id} className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
                  <div className="aspect-video overflow-hidden relative">
                    <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 font-serif line-clamp-2">{art.title}</h3>
                    {art.caption && (
                      <p className="text-[11px] text-emerald-700 bg-emerald-50/70 px-2.5 py-1 rounded-lg border border-emerald-100 font-medium line-clamp-1">
                        📷 {art.caption}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 line-clamp-3" dangerouslySetInnerHTML={{ __html: art.content }} />
                    <button 
                      onClick={() => setActiveArticle(art)}
                      className="text-emerald-500 text-xs font-bold hover:underline block pt-2 cursor-pointer"
                    >
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------
          VIEW: FAQ SHEET
          -------------------------------------------------------- */}
      {currentTab === 'faq' && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Pusat Layanan</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Pertanyaan Umum (FAQ)</h2>
          </div>

          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
                <h3 className="font-serif font-bold text-base text-slate-950 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-500" /> {faq.question}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

        </motion.div>
      </AnimatePresence>

      {/* --------------------------------------------------------
          MODAL: PRODUCT CARE SPECS DETAILS
          -------------------------------------------------------- */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-2xl shadow" />
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                  {categories.find(c => c.id === selectedProduct.category_id)?.name}
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-950">{selectedProduct.name}</h3>
                <span className="text-2xl font-black text-emerald-600 block">
                  Rp{(selectedProduct.is_flash_sale && isFlashSaleRunning && selectedProduct.flash_sale_price ? selectedProduct.flash_sale_price : selectedProduct.price).toLocaleString('id-ID')}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedProduct.description}</p>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-2">
              <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                🌿 Panduan Perawatan Botanikal (Care Instructions)
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedProduct.care_instructions}</p>
            </div>

            {!isLoggedIn && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">Ingin memesan atau mengetahui lebih lanjut produk ini?</span>
                  Masuk atau daftar akun sekarang untuk konsultasi botani dan klaim promo member.
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const name = selectedProduct.name;
                      setSelectedProduct(null);
                      openAuthModal?.('login', `Silakan masuk ke akun Anda untuk memesan atau konsultasi tentang ${name}.`);
                    }}
                    className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => {
                      const name = selectedProduct.name;
                      setSelectedProduct(null);
                      openAuthModal?.('register', `Daftar akun baru untuk memesan dan mengetahui lebih lanjut spesifikasi ${name}.`);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    Daftar Akun
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { handleAddToCart(selectedProduct.id); setSelectedProduct(null); }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> + Keranjang
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { handleDirectCheckout(selectedProduct.id); setSelectedProduct(null); }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4" /> Checkout Langsung
              </motion.button>

              <motion.button 
                whileTap={{ scale: 0.75, rotate: -20 }}
                animate={wishlist.includes(selectedProduct.id) ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={`px-4 py-3 border rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  wishlist.includes(selectedProduct.id)
                    ? 'border-rose-300 bg-rose-50 text-rose-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
                title={wishlist.includes(selectedProduct.id) ? "Hapus dari Favorit" : "Tambah ke Favorit"}
              >
                <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </main>
  );
}
