import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import Swal from 'sweetalert2';
import { 
  TrendingUp, BarChart2, Folder, Leaf, ClipboardList, Settings, Database, 
  Plus, Edit, Trash2, Check, CheckCircle2, Truck, RefreshCw, Save, Eye, FileText, Image, Upload, XCircle, CreditCard, ChevronDown, BookOpen, Sliders, Search, Sparkles
} from 'lucide-react';
import { Product, Category, Order, Settings as StoreSettings, PaymentMethod, Article } from '../types/store';
import { 
  verifyPaymentApi, updateShippingApi, deleteOrderApi, updateOrderProofApi,
  getPaymentMethodsApi, createPaymentMethodApi, updatePaymentMethodApi, deletePaymentMethodApi
} from '../services/orderApi';
import { 
  createCategoryApi, 
  updateCategoryApi, 
  deleteCategoryApi, 
  createProductApi, 
  updateProductApi, 
  deleteProductApi, 
  uploadProductPhotoApi,
  updateSettingsApi
} from '../services/catalogApi';

interface AdminPanelProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  settings: StoreSettings;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  articles?: Article[];
  setArticles?: React.Dispatch<React.SetStateAction<Article[]>>;
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

export default function AdminPanel({
  categories,
  setCategories,
  products,
  setProducts,
  orders,
  setOrders,
  settings,
  setSettings,
  articles,
  setArticles,
  refreshOrders,
  refreshCatalog
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'payment_methods' | 'settings' | 'flashsale' | 'articles'>('dashboard');

  // Edukasi Perawatan (Articles) state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('Tim Botanis Flora');
  const [articleContent, setArticleContent] = useState('');
  const [articleImageUrl, setArticleImageUrl] = useState('');
  const [articleCaption, setArticleCaption] = useState('');
  const [articleIsPublished, setArticleIsPublished] = useState(true);
  const [selectedArticleFile, setSelectedArticleFile] = useState<File | null>(null);
  const [articlePhotoPreviewUrl, setArticlePhotoPreviewUrl] = useState<string>('');

  const handleArticleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Ukuran Foto Terlalu Besar',
        text: 'Ukuran foto melebihi batas maksimal 5 MB. Silakan pilih file yang lebih kecil.'
      });
      return;
    }

    setSelectedArticleFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setArticlePhotoPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveArticle = async () => {
    if (!articleTitle.trim() || !articleContent.trim()) {
      Swal.fire('Peringatan', 'Judul dan Isi Edukasi Perawatan wajib diisi!', 'warning');
      return;
    }

    let finalImageUrl = articleImageUrl.trim() || 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=800';

    if (articlePhotoPreviewUrl) {
      finalImageUrl = articlePhotoPreviewUrl;
    } else if (selectedArticleFile) {
      try {
        const uploadRes = await uploadProductPhotoApi(selectedArticleFile);
        if (uploadRes.success && (uploadRes.url || uploadRes.path)) {
          finalImageUrl = uploadRes.url || uploadRes.path;
        }
      } catch (e) {
        console.warn('Could not upload file to server, using local preview Data URL', e);
      }
    }

    const currentArticles = articles || [];
    const newArticleItem: Article = {
      id: editingArticle ? editingArticle.id : (currentArticles.length > 0 ? Math.max(...currentArticles.map(a => a.id)) + 1 : 1),
      title: articleTitle.trim(),
      slug: articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      author: articleAuthor.trim() || 'Tim Botanis Flora',
      content: articleContent.trim(),
      image_url: finalImageUrl,
      caption: articleCaption.trim(),
      is_published: articleIsPublished,
      created_at: editingArticle ? editingArticle.created_at : new Date().toISOString()
    };

    if (setArticles) {
      if (editingArticle) {
        setArticles(prev => prev.map(a => a.id === editingArticle.id ? newArticleItem : a));
        Swal.fire({ icon: 'success', title: 'Edukasi Perawatan Diperbarui', timer: 1800, showConfirmButton: false });
      } else {
        setArticles(prev => [newArticleItem, ...prev]);
        Swal.fire({ icon: 'success', title: 'Edukasi Perawatan Ditambahkan', timer: 1800, showConfirmButton: false });
      }
    }

    // Reset Form
    setEditingArticle(null);
    setArticleTitle('');
    setArticleAuthor('Tim Botanis Flora');
    setArticleContent('');
    setArticleImageUrl('');
    setArticleCaption('');
    setArticleIsPublished(true);
    setSelectedArticleFile(null);
    setArticlePhotoPreviewUrl('');
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArticleTitle(art.title);
    setArticleAuthor(art.author || 'Tim Botanis Flora');
    setArticleContent(art.content);
    setArticleImageUrl(art.image_url || '');
    setArticleCaption(art.caption || '');
    setArticleIsPublished(art.is_published ?? true);
    setSelectedArticleFile(null);
    setArticlePhotoPreviewUrl(art.image_url || '');
  };

  const handleDeleteArticle = (id: number) => {
    Swal.fire({
      title: 'Hapus Edukasi Perawatan?',
      text: 'Artikel panduan ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((res) => {
      if (res.isConfirmed && setArticles) {
        setArticles(prev => prev.filter(a => a.id !== id));
        Swal.fire({ icon: 'success', title: 'Terhapus!', timer: 1500, showConfirmButton: false });
      }
    });
  };

  // Order status filter tab
  const [orderFilterStatus, setOrderFilterStatus] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Payment Methods CRUD states
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [editingPm, setEditingPm] = useState<PaymentMethod | null>(null);
  const [pmName, setPmName] = useState('');
  const [pmType, setPmType] = useState<'bank' | 'ewallet' | 'qris' | 'cod'>('bank');
  const [pmCode, setPmCode] = useState('');
  const [pmAccNo, setPmAccNo] = useState('');
  const [pmAccName, setPmAccName] = useState('Siti Nurbayanti');
  const [pmInstructions, setPmInstructions] = useState('');
  const [pmIsActive, setPmIsActive] = useState(true);

  // Load Payment Methods from API
  const loadPaymentMethods = async () => {
    try {
      const res = await getPaymentMethodsApi();
      if (res.success && Array.isArray(res.data)) {
        setPaymentMethods(res.data);
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
    }
  };

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'payment_methods') {
      loadPaymentMethods();
    }
  }, [activeSubTab]);

  const handleSavePaymentMethod = async () => {
    if (!pmName.trim() || !pmCode.trim()) {
      Swal.fire('Peringatan', 'Nama dan Kode Metode Pembayaran wajib diisi!', 'warning');
      return;
    }

    try {
      const payload: Partial<PaymentMethod> = {
        name: pmName.trim(),
        type: pmType,
        code: pmCode.trim().toUpperCase(),
        account_number: pmAccNo.trim(),
        account_name: pmAccName.trim(),
        instructions: pmInstructions.trim(),
        is_active: pmIsActive
      };

      if (editingPm) {
        const res = await updatePaymentMethodApi(editingPm.id, payload);
        if (res.success) {
          loadPaymentMethods();
          Swal.fire({ icon: 'success', title: 'Metode Pembayaran Diperbarui', timer: 1500, showConfirmButton: false });
        }
      } else {
        const res = await createPaymentMethodApi(payload);
        if (res.success) {
          loadPaymentMethods();
          Swal.fire({ icon: 'success', title: 'Metode Pembayaran Ditambahkan', timer: 1500, showConfirmButton: false });
        }
      }

      // Reset form
      setEditingPm(null);
      setPmName('');
      setPmType('bank');
      setPmCode('');
      setPmAccNo('');
      setPmAccName('Siti Nurbayanti');
      setPmInstructions('');
      setPmIsActive(true);
    } catch (err: any) {
      Swal.fire('Gagal', err.response?.data?.error || 'Gagal menyimpan metode pembayaran.', 'error');
    }
  };

  const handleTogglePmActive = async (pm: PaymentMethod) => {
    try {
      const res = await updatePaymentMethodApi(pm.id, { is_active: !pm.is_active });
      if (res.success) {
        loadPaymentMethods();
      }
    } catch (err) {
      console.error('Error toggling payment method active:', err);
    }
  };

  const handleDeletePm = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Hapus Metode Pembayaran?',
      text: 'Metode pembayaran ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya, Hapus'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await deletePaymentMethodApi(id);
        if (res.success) {
          loadPaymentMethods();
          Swal.fire({ icon: 'success', title: 'Dihapus!', timer: 1500, showConfirmButton: false });
        }
      } catch (err: any) {
        Swal.fire('Gagal', err.response?.data?.error || 'Gagal menghapus metode pembayaran.', 'error');
      }
    }
  };

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(1);
  const [newProdPrice, setNewProdPrice] = useState(250000);
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCare, setNewProdCare] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBest, setNewProdBest] = useState(false);
  const [newProdPrem, setNewProdPrem] = useState(false);
  const [newProdFlash, setNewProdFlash] = useState(false);
  const [newProdFlashPrice, setNewProdFlashPrice] = useState(150000);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
  const [newProdStatus, setNewProdStatus] = useState<'aktif' | 'nonaktif'>('aktif');
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);

  // Admin Product Search & Customizable Filter states
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminFilterCategory, setAdminFilterCategory] = useState<number | 'all'>('all');
  const [adminFilterStock, setAdminFilterStock] = useState<'all' | 'available' | 'low' | 'empty'>('all');
  const [adminFilterStatus, setAdminFilterStatus] = useState<'all' | 'aktif' | 'nonaktif' | 'bestseller' | 'premium' | 'flashsale'>('all');
  const [adminMinPrice, setAdminMinPrice] = useState<string>('');
  const [adminMaxPrice, setAdminMaxPrice] = useState<string>('');
  const [adminSortBy, setAdminSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc' | 'name_asc'>('newest');

  // Admin editable custom search tag presets synced with Database (Settings)
  const [customSearchTags, setCustomSearchTags] = useState<string[]>(() => {
    return settings?.search_tags || ['Monstera', 'Variegata', 'Bonsai', 'Indoor', 'Kritis Stok', 'Flash Sale', 'Premium'];
  });
  const [newCustomTagInput, setNewCustomTagInput] = useState('');
  const [isSavingSearchTags, setIsSavingSearchTags] = useState(false);

  useEffect(() => {
    if (settings?.search_tags && settings.search_tags.length > 0) {
      setCustomSearchTags(settings.search_tags);
    }
  }, [settings?.search_tags]);

  const saveSearchTagsToDb = async (updatedTags: string[]) => {
    setIsSavingSearchTags(true);
    try {
      await updateSettingsApi({ search_tags: updatedTags });
      setSettings(prev => ({ ...prev, search_tags: updatedTags }));
      if (refreshCatalog) refreshCatalog();
      Swal.fire({
        title: 'Pilihan Pencarian Web Disimpan! 🌿',
        text: 'Daftar pilihan/preset pencarian produk web berhasil diperbarui di database. Pengunjung & user toko sekarang dapat memilih kata kunci ini secara langsung!',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000
      });
    } catch (err: any) {
      console.error('Error saving search tags:', err);
      Swal.fire({
        title: 'Gagal Menyimpan',
        text: 'Gagal menyimpan pilihan pencarian ke database.',
        icon: 'error'
      });
    } finally {
      setIsSavingSearchTags(false);
    }
  };

  const handleAddCustomTag = async () => {
    const trimmed = newCustomTagInput.trim();
    if (trimmed && !customSearchTags.includes(trimmed)) {
      const updated = [...customSearchTags, trimmed];
      setCustomSearchTags(updated);
      setNewCustomTagInput('');
      await saveSearchTagsToDb(updated);
    }
  };

  const handleDeleteCustomTag = async (tagToDelete: string) => {
    const updated = customSearchTags.filter(t => t !== tagToDelete);
    setCustomSearchTags(updated);
    await saveSearchTagsToDb(updated);
  };

  const adminFilteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Keyword search
      if (adminProductSearch.trim()) {
        const q = adminProductSearch.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q) || (p.nama_produk && p.nama_produk.toLowerCase().includes(q));
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCare = (p.care_instructions || '').toLowerCase().includes(q);
        const catObj = categories.find(c => c.id === p.category_id);
        const matchCat = catObj ? catObj.name.toLowerCase().includes(q) : false;
        if (!matchName && !matchDesc && !matchCare && !matchCat) return false;
      }

      // 2. Category Filter
      if (adminFilterCategory !== 'all' && p.category_id !== adminFilterCategory) {
        return false;
      }

      // 3. Stock Level Filter
      if (adminFilterStock === 'available' && p.stock <= 0) return false;
      if (adminFilterStock === 'low' && (p.stock <= 0 || p.stock > 5)) return false;
      if (adminFilterStock === 'empty' && p.stock > 0) return false;

      // 4. Status & Feature Flag Filter
      if (adminFilterStatus === 'aktif' && p.status === 'nonaktif') return false;
      if (adminFilterStatus === 'nonaktif' && p.status !== 'nonaktif') return false;
      if (adminFilterStatus === 'bestseller' && !p.is_best_seller) return false;
      if (adminFilterStatus === 'premium' && !p.is_premium) return false;
      if (adminFilterStatus === 'flashsale' && !p.is_flash_sale) return false;

      // 5. Min Price Filter
      if (adminMinPrice !== '' && !isNaN(Number(adminMinPrice))) {
        if (p.price < Number(adminMinPrice)) return false;
      }

      // 6. Max Price Filter
      if (adminMaxPrice !== '' && !isNaN(Number(adminMaxPrice))) {
        if (p.price > Number(adminMaxPrice)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (adminSortBy === 'newest') return b.id - a.id;
      if (adminSortBy === 'oldest') return a.id - b.id;
      if (adminSortBy === 'price_asc') return a.price - b.price;
      if (adminSortBy === 'price_desc') return b.price - a.price;
      if (adminSortBy === 'stock_asc') return a.stock - b.stock;
      if (adminSortBy === 'stock_desc') return b.stock - a.stock;
      if (adminSortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, categories, adminProductSearch, adminFilterCategory, adminFilterStock, adminFilterStatus, adminMinPrice, adminMaxPrice, adminSortBy]);

  // Category CRUD states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Settings form states
  const [setAppName, setSetAppName] = useState(settings.app_name);
  const [setRecipient, setSetRecipient] = useState(settings.bank_recipient);
  const [setBca, setSetBca] = useState(settings.bank_account_no);
  const [setFlatFee, setSetFlatFee] = useState(settings.shipping_cost_flat);
  const [setQris, setSetQris] = useState(settings.qris_url);

  // Flash sale settings local states
  const [flashSaleActive, setFlashSaleActive] = useState(settings.flash_sale_active ?? true);
  const [flashSaleEndTime, setFlashSaleEndTime] = useState(() => {
    if (settings.flash_sale_end_time) {
      return settings.flash_sale_end_time.substring(0, 16);
    }
    return '2026-07-13T10:00';
  });

  // Order update tracking states
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState<Order | null>(null);
  const [tempResi, setTempResi] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState<Order | null>(null);

  // Financial statistics
  const totalRevenue = useMemo(() => {
    return orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total_payment, 0);
  }, [orders]);

  const stats = useMemo(() => {
    return {
      revenue: totalRevenue,
      totalOrders: orders.length,
      lowStock: products.filter(p => p.stock <= 3).length,
      categoriesCount: categories.length
    };
  }, [totalRevenue, orders, products, categories]);

  // Calculate dynamic monthly performance (Revenue & Profit in IDR)
  const monthlyData = useMemo(() => {
    // We have all 12 months: Jan to Des
    // Start with 0 base value so that the chart strictly displays actual sold items/pemasukan
    const baseData = [
      { month: 'Jan', revenue: 0, profit: 0 },
      { month: 'Feb', revenue: 0, profit: 0 },
      { month: 'Mar', revenue: 0, profit: 0 },
      { month: 'Apr', revenue: 0, profit: 0 },
      { month: 'Mei', revenue: 0, profit: 0 },
      { month: 'Jun', revenue: 0, profit: 0 },
      { month: 'Jul', revenue: 0, profit: 0 },
      { month: 'Agu', revenue: 0, profit: 0 },
      { month: 'Sep', revenue: 0, profit: 0 },
      { month: 'Okt', revenue: 0, profit: 0 },
      { month: 'Nov', revenue: 0, profit: 0 },
      { month: 'Des', revenue: 0, profit: 0 },
    ];

    // Let's add actual user orders dynamically to the corresponding month
    orders.forEach(order => {
      if (order.payment_status === 'paid') {
        const date = new Date(order.created_at);
        const monthIndex = date.getMonth(); // 0 = Jan, 1 = Feb, 2 = Mar, 3 = Apr, etc.
        
        if (monthIndex >= 0 && monthIndex <= 11) {
          baseData[monthIndex].revenue += order.total_payment;
          // Simulated 45% net profit margin from actual sales
          baseData[monthIndex].profit += Math.round(order.total_payment * 0.45);
        }
      }
    });

    return baseData;
  }, [orders]);

  const maxVal = useMemo(() => {
    const highest = Math.max(...monthlyData.map(d => d.revenue), 5000000);
    // Round to nearest 1,000,000 above the highest
    return Math.ceil(highest / 1000000) * 1000000;
  }, [monthlyData]);

  const chartPoints = useMemo(() => {
    const revenuePoints = monthlyData.map((d, idx) => {
      const x = 60 + idx * 80;
      const y = 170 - (d.revenue / maxVal) * 150;
      return { x, y, value: d.revenue };
    });

    const profitPoints = monthlyData.map((d, idx) => {
      const x = 60 + idx * 80;
      const y = 170 - (d.profit / maxVal) * 150;
      return { x, y, value: d.profit };
    });

    const createPath = (points: { x: number; y: number }[]) => {
      return points.reduce((acc, p, idx) => {
        return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
      }, '');
    };

    const createAreaPath = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';
      const start = points[0];
      const end = points[points.length - 1];
      const linePath = createPath(points);
      return `${linePath} L ${end.x} 170 L ${start.x} 170 Z`;
    };

    return {
      revenueLine: createPath(revenuePoints),
      revenueArea: createAreaPath(revenuePoints),
      revenuePoints,
      profitLine: createPath(profitPoints),
      profitArea: createAreaPath(profitPoints),
      profitPoints,
    };
  }, [monthlyData, maxVal]);

  // Photo File Change Handler (Validasi format JPG/PNG/WEBP & maksimal 5 MB)
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      Swal.fire({
        icon: 'error',
        title: 'Format Tidak Didukung',
        text: 'Format foto yang diperbolehkan hanya JPG, JPEG, PNG, dan WEBP.'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Ukuran Foto Terlalu Besar',
        text: 'Ukuran foto melebihi batas maksimal 5 MB. Silakan pilih file yang lebih kecil.'
      });
      return;
    }

    setSelectedPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl(previewUrl);
  };

  // Product Save/Update with Local Photo Upload & MySQL Integrated Backend
  const handleSaveProduct = async () => {
    if (!newProdName.trim() || Number(newProdPrice) < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Tidak Lengkap',
        text: 'Nama produk dan harga wajib diisi dengan benar.'
      });
      return;
    }

    try {
      setUploadingPhoto(true);
      let finalImageUrl = newProdImage || 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600';

      // Jika admin memilih file foto dari komputer, upload ke folder uploads/products
      if (selectedPhotoFile) {
        try {
          const uploadRes = await uploadProductPhotoApi(selectedPhotoFile);
          if (uploadRes.success && (uploadRes.url || uploadRes.path)) {
            finalImageUrl = uploadRes.url || uploadRes.path;
          }
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Upload Foto',
            text: uploadError.response?.data?.error || 'Terjadi kesalahan saat mengupload foto produk.'
          });
          setUploadingPhoto(false);
          return;
        }
      }

      const payload: Partial<Product> = {
        name: newProdName.trim(),
        nama_produk: newProdName.trim(),
        category_id: Number(newProdCategory),
        kategori_id: Number(newProdCategory),
        price: Number(newProdPrice),
        harga: Number(newProdPrice),
        stock: Number(newProdStock),
        stok: Number(newProdStock),
        description: newProdDesc.trim(),
        deskripsi: newProdDesc.trim(),
        care_instructions: newProdCare.trim(),
        keunggulan: newProdCare.trim(),
        image_url: finalImageUrl,
        foto: finalImageUrl,
        status: newProdStatus,
        is_best_seller: newProdBest,
        is_premium: newProdPrem,
        is_flash_sale: newProdFlash,
        flash_sale_price: newProdFlash ? Number(newProdFlashPrice) : null
      };

      if (editingProduct) {
        const res = await updateProductApi(editingProduct.id, payload);
        if (res.success) {
          if (res.products) setProducts(res.products);
          refreshCatalog?.();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Diperbarui!',
            text: 'Data produk berhasil diperbarui di database.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } else {
        const res = await createProductApi(payload);
        if (res.success) {
          if (res.products) setProducts(res.products);
          refreshCatalog?.();
          Swal.fire({
            icon: 'success',
            title: 'Produk Berhasil Ditambahkan!',
            text: 'Produk baru telah tersimpan di database dan langsung tersedia untuk pelanggan.',
            timer: 2500,
            showConfirmButton: false
          });
        }
      }

      // Reset Form
      setEditingProduct(null);
      setNewProdName('');
      setNewProdDesc('');
      setNewProdCare('');
      setNewProdImage('');
      setNewProdStock(10);
      setNewProdPrice(250000);
      setNewProdBest(false);
      setNewProdPrem(false);
      setNewProdFlash(false);
      setSelectedPhotoFile(null);
      setPhotoPreviewUrl('');
      setNewProdStatus('aktif');
    } catch (error: any) {
      console.error('Error saving product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan Produk',
        text: error.response?.data?.error || 'Terjadi kesalahan pada sistem database.'
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setNewProdName(p.name);
    setNewProdCategory(p.category_id);
    setNewProdPrice(p.price);
    setNewProdStock(p.stock);
    setNewProdDesc(p.description);
    setNewProdCare(p.care_instructions);
    setNewProdImage(p.image_url);
    setNewProdBest(p.is_best_seller);
    setNewProdPrem(p.is_premium);
    setNewProdFlash(p.is_flash_sale);
    setNewProdFlashPrice(p.flash_sale_price || 150000);
    setNewProdStatus(p.status || 'aktif');
    setSelectedPhotoFile(null);
    setPhotoPreviewUrl(p.image_url || '');
  };

  const handleDeleteProduct = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Hapus Produk?',
      text: 'Produk beserta foto akan dihapus permanen dari sistem.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus Permanen',
      cancelButtonText: 'Batal'
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteProductApi(id);
      if (res.success) {
        if (res.products) setProducts(res.products);
        refreshCatalog?.();
        Swal.fire({
          icon: 'success',
          title: 'Dihapus',
          text: 'Produk berhasil dihapus dari database.',
          timer: 1800,
          showConfirmButton: false
        });
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: error.response?.data?.error || 'Gagal menghapus produk.'
      });
    }
  };

  // Category Save/Update with MySQL Integrated Backend
  const handleSaveCategory = async () => {
    if (!newCatName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Nama Kategori Kosong',
        text: 'Silakan isi nama kategori terlebih dahulu.'
      });
      return;
    }

    try {
      if (editingCategory) {
        const res = await updateCategoryApi(editingCategory.id, newCatName.trim(), newCatDesc.trim());
        if (res.success) {
          if (res.categories) setCategories(res.categories);
          refreshCatalog?.();
          setEditingCategory(null);
          setNewCatName('');
          setNewCatDesc('');
          Swal.fire({
            icon: 'success',
            title: 'Kategori Diperbarui!',
            text: 'Kategori berhasil diperbarui di database.',
            timer: 1800,
            showConfirmButton: false
          });
        }
      } else {
        const res = await createCategoryApi(newCatName.trim(), newCatDesc.trim());
        if (res.success) {
          if (res.categories) setCategories(res.categories);
          refreshCatalog?.();
          setNewCatName('');
          setNewCatDesc('');
          Swal.fire({
            icon: 'success',
            title: 'Kategori Ditambahkan!',
            text: 'Kategori baru berhasil ditambahkan dan langsung tersedia pada form produk.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan Kategori',
        text: error.response?.data?.error || 'Gagal menyimpan kategori ke database.'
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Hapus Kategori?',
      text: 'Kategori akan dihapus permanen dari database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteCategoryApi(id);
      if (res.success) {
        if (res.categories) setCategories(res.categories);
        refreshCatalog?.();
        Swal.fire({
          icon: 'success',
          title: 'Dihapus',
          text: 'Kategori berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: error.response?.data?.error || 'Gagal menghapus kategori dari database.'
      });
    }
  };

  // Settings Save
  const handleSaveSettings = async () => {
    const newSettings: StoreSettings = {
      app_name: setAppName,
      app_description: settings.app_description,
      bank_name: settings.bank_name,
      bank_recipient: setRecipient,
      bank_account_no: setBca,
      qris_url: setQris,
      ewallet_no: settings.ewallet_no,
      shipping_cost_flat: Number(setFlatFee),
      whatsapp_no: settings.whatsapp_no,
      address: settings.address,
      flash_sale_active: settings.flash_sale_active,
      flash_sale_end_time: settings.flash_sale_end_time
    };
    setSettings(newSettings);
    try {
      await updateSettingsApi(newSettings);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pengaturan toko berhasil diperbarui di database.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (e) {
      console.error('Error saving settings to DB:', e);
    }
  };

  const handleSaveFlashSaleSettings = async () => {
    const updatedEndTime = new Date(flashSaleEndTime).toISOString();
    setSettings(prev => ({
      ...prev,
      flash_sale_active: flashSaleActive,
      flash_sale_end_time: updatedEndTime
    }));
    try {
      await updateSettingsApi({
        flash_sale_active: flashSaleActive,
        flash_sale_end_time: updatedEndTime
      });
      Swal.fire({
        icon: 'success',
        title: 'Flash Sale Diperbarui',
        text: 'Pengaturan Flash Sale berhasil disimpan ke database!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (e) {
      console.error('Error saving flash sale settings:', e);
    }
  };

  const handleToggleProductFlashSale = async (productId: number) => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;
    const nextActive = !targetProduct.is_flash_sale;
    const nextPrice = nextActive ? (targetProduct.flash_sale_price || Math.round(targetProduct.price * 0.8)) : null;

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          is_flash_sale: nextActive,
          flash_sale_price: nextPrice
        };
      }
      return p;
    }));

    try {
      await updateProductApi(productId, {
        is_flash_sale: nextActive,
        flash_sale_price: nextPrice
      });
    } catch (e) {
      console.error('Error updating flash sale for product:', e);
    }
  };

  const handleUpdateProductFlashPrice = async (productId: number, price: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, flash_sale_price: price } : p));
    try {
      await updateProductApi(productId, {
        flash_sale_price: price
      });
    } catch (e) {
      console.error('Error updating flash price for product:', e);
    }
  };

  const applyQuickDiscount = (productId: number, originalPrice: number, percent: number) => {
    const discounted = Math.round(originalPrice * (1 - percent / 100));
    handleUpdateProductFlashPrice(productId, discounted);
  };

  // Update order status workflow (MySQL Integrated)
  const handleUpdateOrderStatus = async (
    orderId: number, 
    nextStatus: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled', 
    resiNum?: string
  ) => {
    try {
      await updateShippingApi(orderId, nextStatus, resiNum);
      if (refreshOrders) refreshOrders();
      else {
        setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            return {
              ...o,
              order_status: nextStatus,
              tracking_number: resiNum || o.tracking_number,
              payment_status: (nextStatus === 'completed' || nextStatus === 'shipped') ? 'paid' : (nextStatus === 'cancelled' ? 'failed' : o.payment_status)
            };
          }
          return o;
        }));
      }
      setSelectedOrderToEdit(null);

      const statusLabels: Record<string, string> = {
        pending: 'Pesanan Diterima (Menunggu Pembayaran)',
        processing: 'Sedang Diproses',
        shipped: 'Barang Sudah Diantarkan (Dikirim)',
        completed: 'Selesai',
        cancelled: 'Dibatalkan'
      };

      Swal.fire({
        title: 'Status Diperbarui!',
        text: `Status pesanan #${orderId} telah disimpan di database sebagai "${statusLabels[nextStatus] || nextStatus}".`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire('Gagal!', error.response?.data?.error || 'Gagal memperbarui status pengiriman di database.', 'error');
    }
  };

  // Verify payment as paid (MySQL Integrated + SweetAlert2)
  const handleVerifyPayment = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    const result = await Swal.fire({
      title: 'Verifikasi Lunas?',
      text: `Apakah Anda yakin ingin memverifikasi pembayaran faktur ${order?.order_code || '#' + orderId} sebagai LUNAS?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Verifikasi Lunas',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await verifyPaymentApi(orderId);
        if (refreshOrders) refreshOrders();
        else {
          setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
              return { ...o, payment_status: 'paid', order_status: 'processing' };
            }
            return o;
          }));
        }
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pembayaran telah diverifikasi LUNAS.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } catch (error: any) {
        Swal.fire('Gagal!', error.response?.data?.error || 'Gagal memverifikasi pembayaran dari server.', 'error');
      }
    }
  };

  // Delete Order (Admin Only + SweetAlert2)
  const handleDeleteOrder = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    const result = await Swal.fire({
      title: 'Hapus Pesanan Permanen?',
      text: `Apakah Anda yakin ingin menghapus faktur ${order?.order_code || '#' + orderId} dari database MySQL? Data tidak dapat dikembalikan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus Permanen',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await deleteOrderApi(orderId);
        if (refreshOrders) refreshOrders();
        else {
          setOrders(prev => prev.filter(o => o.id !== orderId));
        }
        Swal.fire({
          title: 'Terhapus!',
          text: 'Pesanan telah dihapus permanen dari database.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } catch (error: any) {
        Swal.fire('Gagal!', error.response?.data?.error || 'Gagal menghapus pesanan.', 'error');
      }
    }
  };


  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden min-h-[550px] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
      
      {/* Left Sidebar Menu */}
      <aside className="w-full md:w-64 bg-slate-50/50 p-6 flex flex-col gap-1.5 shrink-0">
        <div className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mb-4 px-2">KENDALI ADMINISTRATOR</div>
        
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'dashboard' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Ikhtisar Penjualan
        </button>

        <button
          onClick={() => setActiveSubTab('products')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'products' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Leaf className="w-4 h-4" /> Kelola Produk
        </button>

        <button
          onClick={() => setActiveSubTab('flashsale')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'flashsale' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Kelola Flash Sale
          {products.filter(p => p.is_flash_sale).length > 0 && (
            <span className="ml-auto bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] font-black">
              {products.filter(p => p.is_flash_sale).length} promo
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'categories' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Folder className="w-4 h-4" /> Kelola Kategori
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'orders' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Kelola Pesanan
          {orders.filter(o => o.payment_status === 'pending').length > 0 && (
            <span className="ml-auto bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-black">
              {orders.filter(o => o.payment_status === 'pending').length} baru
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('payment_methods')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'payment_methods' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Kelola Metode Bayar
        </button>

        <button
          onClick={() => setActiveSubTab('articles')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'articles' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Kelola Edukasi Perawatan
          {articles && articles.length > 0 && (
            <span className="ml-auto bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[9px] font-black">
              {articles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'settings' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" /> Pengaturan Website
        </button>
      </aside>

      {/* Right Content Area */}
      <div className="flex-1 p-6 sm:p-8 overflow-x-hidden">

        {/* SUBTAB: DASHBOARD OVERVIEW */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Dashboard Utama Siti Nurbayanti</h2>
                <p className="text-xs text-slate-500 mt-0.5">Analisis omset transaksi & kontrol stok pergudangan botanical.</p>
              </div>
              <div className="text-xs text-slate-400 font-medium font-mono">Real-time PHP API Simulation</div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Omset Penjualan</span>
                <span className="block text-xl font-black text-slate-900 font-mono">Rp{stats.revenue.toLocaleString('id-ID')}</span>
                <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +14.2% Bulan ini</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pesanan Masuk</span>
                <span className="block text-xl font-black text-slate-900 font-mono">{stats.totalOrders} Transaksi</span>
                <span className="text-[9px] font-bold text-slate-400">Terbuka 24 Jam</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stok Hampir Habis</span>
                <span className={`block text-xl font-black font-mono ${stats.lowStock > 0 ? 'text-red-500' : 'text-slate-950'}`}>{stats.lowStock} Varietas</span>
                <span className="text-[9px] font-bold text-slate-400">Batas stok kritis &lt; 3</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori Aktif</span>
                <span className="block text-xl font-black text-slate-900 font-mono">{stats.categoriesCount} Spesies</span>
                <span className="text-[9px] font-bold text-slate-400">Kelompok taksonomi</span>
              </div>
            </div>

            {/* Custom High-Fidelity SVG Sales & Profit Chart */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Grafik Kinerja Bulanan (Nusantara Flora)</span>
                  <p className="text-[10px] text-slate-400">Tren omset penjualan dan keuntungan bersih (rupiah) terhitung secara dinamis.</p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-slate-600">Total Omset</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                    <span className="text-slate-600">Keuntungan Bersih (45%)</span>
                  </div>
                </div>
              </div>
              
              {/* SVG drawing */}
              <div className="relative h-64 w-full overflow-x-auto no-scrollbar">
                <svg className="h-full min-w-[1000px] w-full" viewBox="0 0 1000 220">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="60" y1="20" x2="940" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="60" y1="70" x2="940" y2="70" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="60" y1="120" x2="940" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="60" y1="170" x2="940" y2="170" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Filled Area Charts */}
                  <path d={chartPoints.revenueArea} fill="url(#revenueGrad)" />
                  <path d={chartPoints.profitArea} fill="url(#profitGrad)" />

                  {/* Smooth Line Curves */}
                  <path
                    d={chartPoints.revenueLine}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d={chartPoints.profitLine}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Revenue Point markers & Value labels */}
                  {chartPoints.revenuePoints.map((pt, idx) => (
                    <g key={`rev-${idx}`}>
                      <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                      <text
                        x={pt.x}
                        y={pt.y - 8}
                        fill="#059669"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        Rp{(pt.value / 1000000).toFixed(1)}Jt
                      </text>
                    </g>
                  ))}

                  {/* Profit Point markers & Value labels */}
                  {chartPoints.profitPoints.map((pt, idx) => (
                    <g key={`prof-${idx}`}>
                      <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                      <text
                        x={pt.x}
                        y={pt.y + 12}
                        fill="#2563eb"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        Rp{(pt.value / 1000000).toFixed(1)}Jt
                      </text>
                    </g>
                  ))}

                  {/* X Axis Labels */}
                  {monthlyData.map((d, idx) => {
                    const currentMonthIdx = new Date().getMonth(); // 6 = July
                    const isCurrentMonth = idx === currentMonthIdx;
                    return (
                      <text
                        key={`month-${idx}`}
                        x={60 + idx * 80}
                        y="195"
                        fill={isCurrentMonth ? "#10b981" : "#94a3b8"}
                        fontSize="9"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {isCurrentMonth ? `${d.month} (Aktif)` : d.month}
                      </text>
                    );
                  })}

                  {/* Y Axis Labels */}
                  <text x="50" y="24" fill="#94a3b8" fontSize="9" textAnchor="end" fontWeight="bold">
                    Rp{(maxVal / 1000000).toFixed(1)} Jt
                  </text>
                  <text x="50" y="74" fill="#94a3b8" fontSize="9" textAnchor="end" fontWeight="bold">
                    Rp{((maxVal * 2 / 3) / 1000000).toFixed(1)} Jt
                  </text>
                  <text x="50" y="124" fill="#94a3b8" fontSize="9" textAnchor="end" fontWeight="bold">
                    Rp{((maxVal / 3) / 1000000).toFixed(1)} Jt
                  </text>
                  <text x="50" y="174" fill="#94a3b8" fontSize="9" textAnchor="end" fontWeight="bold">
                    Rp0
                  </text>
                </svg>
              </div>
            </div>

            {/* Nusantara Flora Low Stock & Income Review Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box 1: Low Stock Review */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                      Tinjauan Stok Hampir Habis
                    </h3>
                    <p className="text-[10px] text-slate-400">Tinjau & tambah kuantitas tanaman yang kritis secara langsung.</p>
                  </div>
                  <span className="bg-red-50 text-red-600 font-bold font-mono text-[10px] px-2 py-0.5 rounded-full">
                    {products.filter(p => p.stock <= 5).length} Kritis
                  </span>
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {products.filter(p => p.stock <= 5).length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-600">Semua Stok Aman!</p>
                      <p className="text-[10px] text-slate-400">Seluruh persediaan flora tercukupi (&gt; 5 pcs).</p>
                    </div>
                  ) : (
                    products.filter(p => p.stock <= 5).map(prod => {
                      const cat = categories.find(c => c.id === prod.category_id);
                      return (
                        <div key={prod.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                          <div className="flex items-center gap-3">
                            <img src={prod.image_url} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-100 shrink-0" />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                              <p className="text-[9px] text-slate-400">{cat?.name || 'Spesies'}</p>
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                                  prod.stock === 0 
                                    ? 'bg-red-100 text-red-700' 
                                    : prod.stock <= 3 
                                    ? 'bg-red-50 text-red-600' 
                                    : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {prod.stock === 0 ? 'Habis' : `Sisa ${prod.stock} Pcs`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Restock Controller */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (prod.stock > 0) {
                                  setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: p.stock - 1 } : p));
                                }
                              }}
                              disabled={prod.stock === 0}
                              className="w-6 h-6 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-xs"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={prod.stock}
                              onChange={(e) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: val } : p));
                              }}
                              className="w-10 text-center font-bold text-xs bg-white border border-slate-200 rounded py-0.5 focus:outline-emerald-500 font-mono text-slate-900"
                            />
                            <button
                              onClick={() => {
                                setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: p.stock + 1 } : p));
                              }}
                              className="w-6 h-6 rounded bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Box 2: Paid Sales Log / Pemasukan Nusantara Flora */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Rincian Pemasukan Terkini
                    </h3>
                    <p className="text-[10px] text-slate-400">Pembayaran terverifikasi yang menyusun kurva kinerja Nusantara Flora.</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 font-bold font-mono text-[10px] px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.payment_status === 'paid').length} Lunas
                  </span>
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {orders.filter(o => o.payment_status === 'paid').length === 0 ? (
                    <div className="text-center py-12 space-y-1 text-slate-400">
                      <ClipboardList className="w-10 h-10 mx-auto text-slate-200" />
                      <p className="text-xs font-bold">Belum Ada Pemasukan Lunas</p>
                      <p className="text-[9px]">Transaksi berstatus LUNAS akan tampil di sini.</p>
                    </div>
                  ) : (
                    orders
                      .filter(o => o.payment_status === 'paid')
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map(o => (
                        <div key={o.id} className="flex items-center justify-between p-3 bg-emerald-50/20 border border-emerald-500/10 rounded-xl hover:bg-emerald-50/30 transition-all">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 font-mono">{o.order_code}</span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded uppercase">
                                Lunas
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-700 mt-1">{o.recipient_name} • <span className="font-medium text-slate-400 font-mono text-[9px]">{o.created_at.substring(0, 10)}</span></p>
                            <p className="text-[9px] text-slate-400">{o.shipping_city} via {o.courier}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className="block text-xs font-black text-emerald-600 font-mono">
                              +Rp{o.total_payment.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                              {o.payment_method}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: PRODUCT CRUD */}
        {activeSubTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Kelola Produk & Foto Flora</h2>
                <p className="text-xs text-slate-500">Tambah, edit, hapus, dan upload foto tanaman secara langsung ke server.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setNewProdName('');
                  setNewProdDesc('');
                  setNewProdCare('');
                  setNewProdImage('');
                  setNewProdStock(10);
                  setNewProdPrice(250000);
                  setNewProdBest(false);
                  setNewProdPrem(false);
                  setNewProdFlash(false);
                  setSelectedPhotoFile(null);
                  setPhotoPreviewUrl('');
                  setNewProdStatus('aktif');
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Tambah Produk Baru
              </button>
            </div>

            {/* Interactive Add/Edit Form */}
            <div className="bg-slate-50 border border-slate-100/80 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Folder className="w-4 h-4 text-emerald-600" />
                  {editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Form Tambah Produk Baru'}
                </h3>
                {editingProduct && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Mode Edit #ID {editingProduct.id}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Tanaman *</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Monstera Deliciosa Premium" 
                    value={newProdName} 
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white font-bold text-slate-700"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Produk</label>
                  <select
                    value={newProdStatus}
                    onChange={(e) => setNewProdStatus(e.target.value as 'aktif' | 'nonaktif')}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white font-bold text-slate-700"
                  >
                    <option value="aktif">Aktif (Tampil di Katalog)</option>
                    <option value="nonaktif">Nonaktif (Disembunyikan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Harga Normal (Rp) *</label>
                  <input 
                    type="number" 
                    placeholder="250000" 
                    value={newProdPrice} 
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stok Tersedia *</label>
                  <input 
                    type="number" 
                    placeholder="10" 
                    value={newProdStock} 
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Atau URL Gambar Opsional</label>
                  <input 
                    type="text" 
                    placeholder="URL gambar opsional (Jika tidak pilih foto)" 
                    value={newProdImage} 
                    onChange={(e) => {
                      setNewProdImage(e.target.value);
                      if (!selectedPhotoFile && e.target.value) {
                        setPhotoPreviewUrl(e.target.value);
                      }
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                  />
                </div>

                {/* Upload Foto Produk dari Komputer */}
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Pilih / Upload Foto Produk dari Komputer (JPG, JPEG, PNG, WEBP — Maks. 5 MB)
                  </label>
                  <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer bg-white flex flex-col items-center justify-center gap-1.5 transition-all group">
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" 
                      onChange={handlePhotoFileChange} 
                      className="hidden" 
                    />
                    <div className="w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-all">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600">
                      {selectedPhotoFile ? `File Dipilih: ${selectedPhotoFile.name}` : 'Klik untuk memilih foto produk dari komputer Anda'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Format didukung: JPG, JPEG, PNG, WEBP (Maksimal ukuran 5 MB)
                    </span>
                  </label>
                </div>

                {/* Live Photo Preview */}
                {photoPreviewUrl && (
                  <div className="sm:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={photoPreviewUrl} 
                          alt="Preview Foto Produk" 
                          className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600';
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Preview Foto Produk</span>
                        <span className="text-[10px] text-slate-500 block">
                          {selectedPhotoFile ? `File Lokal: ${selectedPhotoFile.name} (${(selectedPhotoFile.size / 1024).toFixed(1)} KB)` : 'Gambar saat ini yang tersimpan di server'}
                        </span>
                        <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Siap disimpan ke database
                        </span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedPhotoFile(null);
                        setPhotoPreviewUrl('');
                        setNewProdImage('');
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Hapus Foto
                    </button>
                  </div>
                )}

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat Tanaman *</label>
                  <textarea 
                    placeholder="Contoh: Tanaman hias premium dengan daun eksotis untuk mempercantik ruangan indoor." 
                    value={newProdDesc} 
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keunggulan, Spesifikasi & Instruksi Perawatan *</label>
                  <textarea 
                    placeholder="Contoh: Perawatan mudah, cocok untuk indoor, siram 2-3 kali seminggu, letakkan di dekat jendela dengan sinar matahari teduh." 
                    value={newProdCare} 
                    onChange={(e) => setNewProdCare(e.target.value)}
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                  />
                </div>
              </div>

              {/* Badges / special selectors */}
              <div className="flex flex-wrap gap-4 items-center pt-2 text-xs font-bold text-slate-600 border-t border-slate-200/60">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={newProdBest} onChange={(e) => setNewProdBest(e.target.checked)} className="rounded text-emerald-500" />
                  Terlaris (Best Seller)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={newProdPrem} onChange={(e) => setNewProdPrem(e.target.checked)} className="rounded text-emerald-500" />
                  Tanaman Premium (Amber Badge)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={newProdFlash} onChange={(e) => setNewProdFlash(e.target.checked)} className="rounded text-emerald-500" />
                  Sesi Flash Sale
                </label>
                {newProdFlash && (
                  <input 
                    type="number" 
                    placeholder="Harga Flash Sale" 
                    value={newProdFlashPrice} 
                    onChange={(e) => setNewProdFlashPrice(Number(e.target.value))}
                    className="border border-slate-200 rounded-xl px-2.5 py-1 text-xs focus:outline-emerald-500 bg-white max-w-[120px]"
                  />
                )}
              </div>

              <div className="flex gap-2 justify-end pt-3">
                {editingProduct && (
                  <button 
                    onClick={() => {
                      setEditingProduct(null);
                      setSelectedPhotoFile(null);
                      setPhotoPreviewUrl('');
                      setNewProdName('');
                      setNewProdDesc('');
                      setNewProdCare('');
                      setNewProdImage('');
                    }} 
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold text-slate-700"
                  >
                    Batal
                  </button>
                )}
                <button 
                  onClick={handleSaveProduct} 
                  disabled={!newProdName || uploadingPhoto}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  {uploadingPhoto ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Mengupload & Menyimpan...
                    </>
                  ) : editingProduct ? (
                    <>
                      <Save className="w-4 h-4" /> Simpan Perubahan Produk
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Terbitkan Tanaman ke Toko
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product Table List */}
            <div className="overflow-x-auto bg-white border border-slate-100 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100">
                    <th className="p-4">Tanaman</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Harga Normal</th>
                    <th className="p-4">Stok</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {products.map(p => {
                    const catName = categories.find(c => c.id === p.category_id)?.name || 'Kategori';
                    const isNonAktif = p.status === 'nonaktif';
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img 
                            src={p.image_url} 
                            alt={p.name} 
                            className="w-12 h-12 object-cover rounded-xl border border-slate-100 shadow-sm" 
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600';
                            }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{p.name}</span>
                            <div className="flex gap-1 items-center mt-0.5">
                              {p.is_premium && <span className="inline-block bg-amber-50 text-amber-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide">PREMIUM</span>}
                              {p.is_best_seller && <span className="inline-block bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide">BEST SELLER</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-semibold">{catName}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isNonAktif ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {isNonAktif ? 'NONAKTIF' : 'AKTIF'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-900 font-bold font-mono">Rp{p.price.toLocaleString('id-ID')}</td>
                        <td className={`p-4 font-bold font-mono ${p.stock <= 3 ? 'text-red-500' : 'text-slate-700'}`}>{p.stock} pcs</td>
                        <td className="p-4 text-center space-x-1.5">
                          <button 
                            onClick={() => startEditProduct(p)} 
                            title="Edit Produk & Foto"
                            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all inline-flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)} 
                            title="Hapus Produk"
                            className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-all inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB: CATEGORY CRUD */}
        {activeSubTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">Kelola Kategori Spesies Flora</h2>
              <p className="text-xs text-slate-500">Tambah, ubah, atau hapus kategori tanaman yang akan tampil di katalog pengujung.</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-100/80 p-5 rounded-2xl space-y-3 max-w-2xl">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {editingCategory ? `Edit Kategori: ${editingCategory.name}` : 'Tambah Kategori Baru'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Nama Kategori (Contoh: Tanaman Langka)" 
                  value={newCatName} 
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                />
                <input 
                  type="text" 
                  placeholder="Deskripsi Singkat Kategori (Opsional)" 
                  value={newCatDesc} 
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                {editingCategory && (
                  <button 
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCatName('');
                      setNewCatDesc('');
                    }} 
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Batal
                  </button>
                )}
                <button 
                  onClick={handleSaveCategory}
                  disabled={!newCatName}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  {editingCategory ? 'Simpan Perubahan Kategori' : '+ Tambah Kategori'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(c => {
                const count = products.filter(p => p.category_id === c.id).length;
                return (
                  <div key={c.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {count} Produk
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {c.description || 'Kategori spesialis flora premium untuk koleksi pilihan toko.'}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end border-t border-slate-100 pt-3">
                      <button 
                        onClick={() => { 
                          setEditingCategory(c); 
                          setNewCatName(c.name);
                          setNewCatDesc(c.description || '');
                        }} 
                        className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(c.id)} 
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB: ORDER REVIEW & WORKFLOWS */}
        {activeSubTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Kelola Pesanan & Verifikasi Pembayaran</h2>
                <p className="text-xs text-slate-500 mt-0.5">Verifikasi bukti transfer, ubah status pesanan, dan input nomor resi kurir.</p>
              </div>
              <button
                onClick={() => {
                  if (refreshOrders) refreshOrders();
                  Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Data pesanan diperbarui', showConfirmButton: false, timer: 1500 });
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
              </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'Semua', count: orders.length },
                { id: 'pending', label: 'Menunggu Pembayaran', count: orders.filter(o => o.order_status === 'pending').length },
                { id: 'processing', label: 'Sedang Diproses', count: orders.filter(o => o.order_status === 'processing').length },
                { id: 'shipped', label: 'Barang Dikirim', count: orders.filter(o => o.order_status === 'shipped').length },
                { id: 'completed', label: 'Selesai', count: orders.filter(o => o.order_status === 'completed').length },
                { id: 'cancelled', label: 'Dibatalkan', count: orders.filter(o => o.order_status === 'cancelled').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setOrderFilterStatus(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    orderFilterStatus === tab.id
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    orderFilterStatus === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="overflow-x-auto bg-white border border-slate-100 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100">
                    <th className="p-4">Faktur & Tanggal</th>
                    <th className="p-4">Penerima & Alamat</th>
                    <th className="p-4">Metode Bayar</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status Pembayaran</th>
                    <th className="p-4">Status Pesanan</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders
                    .filter(o => orderFilterStatus === 'all' || o.order_status === orderFilterStatus)
                    .map(o => (
                    <React.Fragment key={o.id}>
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-4 space-y-1">
                          <span className="font-bold text-slate-900 font-mono block">{o.order_code}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {new Date(o.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <button
                            type="button"
                            onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}
                            className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-0.5 mt-1"
                          >
                            {expandedOrderId === o.id ? 'Sembunyikan Products' : `Lihat Item (${o.items?.length || 0})`}
                          </button>
                        </td>
                        <td className="p-4">
                          <span className="block font-bold text-slate-900">{o.recipient_name}</span>
                          <span className="block text-[10px] text-slate-500 font-mono">{o.recipient_phone}</span>
                          <span className="block text-[10px] text-slate-400">{o.shipping_city} • {o.courier}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-800 block">{o.payment_method}</span>
                          <span className="text-[10px] text-slate-400 block">{o.courier}</span>
                        </td>
                        <td className="p-4 font-black text-slate-950 font-mono">Rp{o.total_payment.toLocaleString('id-ID')}</td>
                        <td className="p-4 space-y-1.5">
                          <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase block w-fit ${
                            o.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}>
                            {o.payment_status === 'paid' ? 'LUNAS' : 'PENDING'}
                          </span>
                          
                          {o.payment_method !== 'COD' && (
                            o.payment_proof ? (
                              <button
                                onClick={() => setViewingReceipt(o)}
                                className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded transition-all w-fit"
                              >
                                <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                              </button>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded block w-fit">
                                Belum Bukti
                              </span>
                            )
                          )}
                        </td>
                        <td className="p-4 space-y-1">
                          {/* Quick Change Dropdown for 5 Statuses */}
                          <select
                            value={o.order_status}
                            onChange={(e) => {
                              const newSt = e.target.value as any;
                              if (newSt === 'shipped') {
                                setSelectedOrderToEdit(o);
                                setTempResi(o.tracking_number || '');
                              } else if (newSt === 'processing' && o.payment_status === 'pending') {
                                handleVerifyPayment(o.id);
                              } else {
                                handleUpdateOrderStatus(o.id, newSt);
                              }
                            }}
                            className={`border rounded-lg px-2 py-1 text-xs font-bold font-mono focus:outline-emerald-500 cursor-pointer ${
                              o.order_status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                              o.order_status === 'shipped' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                              o.order_status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              o.order_status === 'cancelled' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                              'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            <option value="pending">Menunggu Pembayaran</option>
                            <option value="processing">Pembayaran Diterima / Diproses</option>
                            <option value="shipped">Barang Dikirim</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                          </select>

                          {o.tracking_number && (
                            <div className="text-[10px] text-slate-500 font-medium pt-0.5">
                              Resi: <span className="font-mono font-bold text-slate-800">{o.tracking_number}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center space-x-1 space-y-1">
                          {/* Verifikasi Pembayaran / Konfirmasi Lunas button */}
                          {o.payment_status === 'pending' && (
                            <button 
                              onClick={() => handleVerifyPayment(o.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-xs transition-all"
                              title="Verifikasi Pembayaran Diterima"
                            >
                              Verifikasi Lunas
                            </button>
                          )}

                          {/* Input / Edit Resi button */}
                          {o.order_status === 'processing' && (
                            <button 
                              onClick={() => { setSelectedOrderToEdit(o); setTempResi(o.tracking_number || ''); }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold shadow-xs transition-all"
                            >
                              Input Resi & Kirim
                            </button>
                          )}

                          {/* Tombol Hapus */}
                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 rounded text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Hapus pesanan"
                          >
                            <Trash2 className="w-3 h-3 inline" /> Hapus
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Order Items Row */}
                      {expandedOrderId === o.id && (
                        <tr className="bg-slate-50/90 border-b border-slate-100">
                          <td colSpan={7} className="p-4">
                            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                                Detail Produk Dipesan #{o.order_code}
                              </span>
                              {o.items && o.items.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                  {o.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 gap-3">
                                      <div className="flex items-center gap-2.5">
                                        <img 
                                          src={item.image_url} 
                                          alt={item.name} 
                                          className="w-8 h-8 object-cover rounded border border-slate-200 shrink-0 bg-slate-50"
                                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600'; }}
                                        />
                                        <div>
                                          <span className="font-bold text-slate-900 block">{item.name}</span>
                                          <span className="text-[10px] text-slate-500 font-mono">{item.quantity} pcs x Rp{item.price.toLocaleString('id-ID')}</span>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-slate-900">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic">Informasi item lengkap tersimpan dalam detail total faktur Rp{o.total_payment.toLocaleString('id-ID')}.</p>
                              )}
                              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-semibold text-slate-600">
                                <span>Alamat Pengiriman Lengkap:</span>
                                <span className="font-normal text-slate-700 max-w-md text-right">{o.shipping_address}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Assign Resi */}
            {selectedOrderToEdit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                  <h3 className="font-serif font-bold text-slate-900 text-base">Serahkan Paket {selectedOrderToEdit.order_code} Ke Kurir</h3>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Masukkan Nomor Resi Kurir ({selectedOrderToEdit.courier})</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: JNE012984128" 
                      value={tempResi} 
                      onChange={(e) => setTempResi(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 font-mono font-bold"
                    />
                  </div>
                  <div className="flex gap-2 justify-end text-xs">
                    <button onClick={() => setSelectedOrderToEdit(null)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600">Batal</button>
                    <button 
                      onClick={() => handleUpdateOrderStatus(selectedOrderToEdit.id, 'shipped', tempResi || 'RESI' + Math.floor(Math.random() * 100000))} 
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold"
                    >
                      Kirim Sekarang
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal View Bukti Pembayaran */}
            {viewingReceipt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative border border-slate-100">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-lg">Bukti Pembayaran</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Order Code: {viewingReceipt.order_code}</p>
                    </div>
                    <button 
                      onClick={() => setViewingReceipt(null)}
                      className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Penerima</span>
                        <span className="font-bold text-slate-800">{viewingReceipt.recipient_name}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pembayaran</span>
                        <span className="font-bold text-emerald-600 font-mono">Rp{viewingReceipt.total_payment.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Metode Bayar</span>
                        <span className="font-bold text-slate-800">{viewingReceipt.payment_method}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Pembayaran</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          viewingReceipt.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>{viewingReceipt.payment_status === 'paid' ? 'LUNAS' : 'PENDING'}</span>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-3xl p-4 bg-slate-50 flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Dokumen / Slip Transaksi</span>
                      {viewingReceipt.payment_proof ? (
                        <img 
                          src={viewingReceipt.payment_proof} 
                          alt="Bukti Transfer" 
                          className="max-h-80 object-contain rounded-2xl border border-slate-200 shadow-md bg-white"
                        />
                      ) : (
                        <div className="py-8 text-center text-slate-400 space-y-3 w-full">
                          <Database className="w-8 h-8 mx-auto stroke-slate-300" />
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-500">Pelanggan belum mengunggah bukti pembayaran</p>
                            <p className="text-[10px] text-slate-400">Gunakan tombol di bawah ini untuk membuat bukti transfer demo secara instan.</p>
                          </div>
                          <div className="pt-2 max-w-xs mx-auto">
                            <button
                              onClick={() => {
                                const type = viewingReceipt.payment_method || 'BCA';
                                const proof = generateDemoReceipt(viewingReceipt, type);
                                updateOrderProofApi(viewingReceipt.id, proof).catch(err => console.error(err));
                                setOrders(prev => prev.map(o => o.id === viewingReceipt.id ? { ...o, payment_proof: proof } : o));
                                setViewingReceipt(prev => prev ? { ...prev, payment_proof: proof } : null);
                              }}
                              className="w-full px-4 py-2.5 bg-[#5a5a40] hover:bg-[#434331] text-white rounded-xl font-bold text-xs transition-all shadow-sm"
                            >
                              Buat Bukti Transfer Demo ({viewingReceipt.payment_method || 'BCA'})
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs justify-end">
                    <button 
                      onClick={() => setViewingReceipt(null)} 
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition-all"
                    >
                      Tutup
                    </button>
                    {viewingReceipt.payment_status === 'pending' && viewingReceipt.payment_proof && (
                      <button 
                        onClick={() => {
                          handleVerifyPayment(viewingReceipt.id);
                          setViewingReceipt(null);
                        }} 
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all"
                      >
                        <Check className="w-4 h-4" /> Setujui & Konfirmasi Lunas
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: KELOLA METODE PEMBAYARAN */}
        {activeSubTab === 'payment_methods' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Kelola Metode Pembayaran</h2>
                <p className="text-xs text-slate-500 mt-0.5">Tambah, edit, atau aktifkan rekening bank & e-wallet untuk pembayaran transaksi pelanggan.</p>
              </div>
              <button
                onClick={loadPaymentMethods}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Tambah / Edit Metode Pembayaran */}
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4 h-fit">
                <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                  {editingPm ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran Baru'}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 uppercase text-[10px]">Nama Layanan / Bank <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Contoh: Bank Central Asia (BCA)"
                      value={pmName}
                      onChange={(e) => setPmName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 uppercase text-[10px]">Tipe Pembayaran</label>
                      <select
                        value={pmType}
                        onChange={(e) => setPmType(e.target.value as any)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-emerald-500 font-semibold bg-white"
                      >
                        <option value="bank">Transfer Bank</option>
                        <option value="ewallet">E-Wallet</option>
                        <option value="qris">QRIS</option>
                        <option value="cod">COD (Bayar di Tempat)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 uppercase text-[10px]">Kode Singkat <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="Contoh: BCA / DANA"
                        value={pmCode}
                        onChange={(e) => setPmCode(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-emerald-500 font-mono font-bold uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 uppercase text-[10px]">Nomor Rekening / Nomor HP</label>
                    <input
                      type="text"
                      placeholder="Contoh: 8610928231"
                      value={pmAccNo}
                      onChange={(e) => setPmAccNo(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-emerald-500 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 uppercase text-[10px]">Atas Nama Rekening</label>
                    <input
                      type="text"
                      placeholder="Contoh: Siti Nurbayanti"
                      value={pmAccName}
                      onChange={(e) => setPmAccName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 uppercase text-[10px]">Instruksi Singkat</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Silakan transfer sesuai nominal total pembayaran faktur."
                      value={pmInstructions}
                      onChange={(e) => setPmInstructions(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="pmIsActiveToggle"
                      checked={pmIsActive}
                      onChange={(e) => setPmIsActive(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <label htmlFor="pmIsActiveToggle" className="font-bold text-slate-700 cursor-pointer">
                      Status Aktif (Tampilkan di Checkout)
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {editingPm && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPm(null);
                          setPmName('');
                          setPmType('bank');
                          setPmCode('');
                          setPmAccNo('');
                          setPmAccName('Siti Nurbayanti');
                          setPmInstructions('');
                          setPmIsActive(true);
                        }}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSavePaymentMethod}
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> {editingPm ? 'Simpan Perubahan' : 'Tambah Metode'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabel Daftar Metode Pembayaran */}
              <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Daftar Metode Pembayaran ({paymentMethods.length})
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {paymentMethods.filter(p => p.is_active).length} Aktif
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100">
                        <th className="p-3">Tipe</th>
                        <th className="p-3">Metode & Rekening</th>
                        <th className="p-3">Atas Nama</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentMethods.map(pm => (
                        <tr key={pm.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                              pm.type === 'bank' ? 'bg-blue-50 text-blue-600' :
                              pm.type === 'ewallet' ? 'bg-indigo-50 text-indigo-600' :
                              pm.type === 'qris' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {pm.type}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{pm.name}</span>
                            {pm.account_number && (
                              <span className="text-[11px] font-mono text-slate-600 block">{pm.account_number}</span>
                            )}
                          </td>
                          <td className="p-3 font-medium text-slate-700">{pm.account_name || '—'}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleTogglePmActive(pm)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                                pm.is_active 
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                                  : 'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}
                            >
                              {pm.is_active ? '● Aktif' : '○ Nonaktif'}
                            </button>
                          </td>
                          <td className="p-3 text-center space-x-1">
                            <button
                              onClick={() => {
                                setEditingPm(pm);
                                setPmName(pm.name);
                                setPmType(pm.type);
                                setPmCode(pm.code);
                                setPmAccNo(pm.account_number || '');
                                setPmAccName(pm.account_name || 'Siti Nurbayanti');
                                setPmInstructions(pm.instructions || '');
                                setPmIsActive(pm.is_active);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePm(pm.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 rounded-lg transition-all"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: FLASHSALE FORM & PRODUCTS */}
        {activeSubTab === 'flashsale' && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-xl font-bold font-serif text-slate-900">Manajemen Sesi Flash Sale (Promo Kilat)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Atur status aktif, batas waktu mundur (countdown timer), dan pilih produk yang mendapatkan promo khusus.</p>
            </div>

            {/* Config Card */}
            <div className="max-w-xl bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Konfigurasi Waktu & Status Sesi</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Active Toggle */}
                <div className="space-y-2">
                  <span className="block font-bold uppercase text-slate-400 tracking-wider">Status Flash Sale</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={flashSaleActive}
                      onChange={(e) => setFlashSaleActive(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    <span className="ml-3 font-semibold text-slate-700">{flashSaleActive ? 'Sesi Aktif' : 'Sesi Dinonaktifkan'}</span>
                  </label>
                </div>

                {/* DateTime Input */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase text-slate-400 tracking-wider">Waktu Selesai Flash Sale</label>
                  <input 
                    type="datetime-local" 
                    value={flashSaleEndTime}
                    onChange={(e) => setFlashSaleEndTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500 bg-slate-50 font-mono font-bold" 
                  />
                </div>
              </div>

              <button
                onClick={handleSaveFlashSaleSettings}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Terapkan & Simpan Sesi
              </button>
            </div>

            {/* Products Selection Card */}
            <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Partisipasi & Harga Produk Promo</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Toggle partisipasi produk dan sesuaikan harga khusus flash sale secara instan.</p>
                </div>
                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  {products.filter(p => p.is_flash_sale).length} Produk Aktif
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                      <th className="p-4 w-12 text-left">Gambar</th>
                      <th className="p-4 text-left">Nama Produk</th>
                      <th className="p-4 text-left">Harga Normal</th>
                      <th className="p-4 text-left">Ikut Flash Sale</th>
                      <th className="p-4 text-left">Harga Promo</th>
                      <th className="p-4 text-center">Diskon Instan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-4">
                          <img src={prod.image_url} alt={prod.name} className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{prod.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{categories.find(c => c.id === prod.category_id)?.name}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-600">
                          Rp{prod.price.toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleProductFlashSale(prod.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all ${
                              prod.is_flash_sale 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {prod.is_flash_sale ? '✓ Ikut Promo' : '✖ Lewati'}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="relative w-36">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                            <input 
                              type="number" 
                              value={prod.flash_sale_price || ''} 
                              placeholder="Belum diset"
                              onChange={(e) => handleUpdateProductFlashPrice(prod.id, Number(e.target.value))}
                              disabled={!prod.is_flash_sale}
                              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl focus:outline-emerald-500 font-mono font-bold text-slate-900 bg-slate-50/50 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                          </div>
                        </td>
                        <td className="p-4 text-center space-x-1">
                          <button
                            onClick={() => applyQuickDiscount(prod.id, prod.price, 10)}
                            disabled={!prod.is_flash_sale}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-red-50 text-red-600 rounded text-[9px] font-black"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => applyQuickDiscount(prod.id, prod.price, 20)}
                            disabled={!prod.is_flash_sale}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-red-50 text-red-600 rounded text-[9px] font-black"
                          >
                            -20%
                          </button>
                          <button
                            onClick={() => applyQuickDiscount(prod.id, prod.price, 30)}
                            disabled={!prod.is_flash_sale}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-red-50 text-red-600 rounded text-[9px] font-black"
                          >
                            -30%
                          </button>
                          <button
                            onClick={() => applyQuickDiscount(prod.id, prod.price, 50)}
                            disabled={!prod.is_flash_sale}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-red-50 text-red-600 rounded text-[9px] font-black"
                          >
                            -50%
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: SETTINGS FORM */}
        {activeSubTab === 'settings' && (
          <div className="space-y-6 max-w-xl bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold font-serif text-slate-900 border-b border-slate-100 pb-4">Pengaturan Toko & Atas Nama Siti</h2>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-400 tracking-wider">Nama Website E-Commerce</label>
                <input type="text" value={setAppName} onChange={(e) => setSetAppName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500 bg-slate-50 font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-400 tracking-wider">Nama Pemilik / Atas Nama Rekening</label>
                <input type="text" value={setRecipient} onChange={(e) => setSetRecipient(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500 bg-slate-50 font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-400 tracking-wider">No Rekening BCA Toko</label>
                <input type="text" value={setBca} onChange={(e) => setSetBca(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500 bg-slate-50 font-mono font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-400 tracking-wider">Tarif Ongkos Kirim Flat (Rp)</label>
                <input type="number" value={setFlatFee} onChange={(e) => setSetFlatFee(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500 bg-slate-50 font-mono font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-400 tracking-wider">URL Gambar Barcode QRIS</label>
                <input type="text" value={setQris} onChange={(e) => setSetQris(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500 bg-slate-50" />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan
            </button>
          </div>
        )}

        {/* SUBTAB: KELOLA EDUKASI PERAWATAN (ARTIKEL & PANDUAN) */}
        {activeSubTab === 'articles' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900">Kelola Edukasi Perawatan Botanikal</h2>
                <p className="text-xs text-slate-500 mt-0.5">Tambah, ubah, atau hapus panduan tips perawatan tanaman & upload foto file lokal beserta keterangannya.</p>
              </div>
              {editingArticle && (
                <button
                  onClick={() => {
                    setEditingArticle(null);
                    setArticleTitle('');
                    setArticleAuthor('Tim Botanis Flora');
                    setArticleContent('');
                    setArticleImageUrl('');
                    setArticleCaption('');
                    setArticleIsPublished(true);
                    setSelectedArticleFile(null);
                    setArticlePhotoPreviewUrl('');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Baru (Batal Edit)
                </button>
              )}
            </div>

            {/* Form Tambah / Edit Edukasi Perawatan */}
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                {editingArticle ? <Edit className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4 text-emerald-600" />}
                {editingArticle ? `Edit Edukasi: "${editingArticle.title}"` : 'Form Tambah Artikel Edukasi Perawatan Baru'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Left side inputs */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Judul Panduan / Artikel <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Contoh: Cara Merawat Monstera Variegata Agar Daun Tetap Segar"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-emerald-500 bg-slate-50 text-slate-900 font-semibold text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Penulis / Author</label>
                    <input
                      type="text"
                      placeholder="Penulis (Default: Tim Botanis Flora)"
                      value={articleAuthor}
                      onChange={(e) => setArticleAuthor(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-emerald-500 bg-slate-50 text-slate-900 text-xs font-medium"
                    />
                  </div>

                  {/* Foto Upload from Local File */}
                  <div className="space-y-2 bg-slate-50/70 border border-slate-200 p-4 rounded-2xl">
                    <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                      <Upload className="w-4 h-4 text-emerald-600" /> Upload Foto dari File Lokal Komputer
                    </label>
                    <p className="text-[11px] text-slate-500">Pilih berkas gambar (.png, .jpg, .webp) dari galeri lokal Anda.</p>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArticleFileChange}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 cursor-pointer"
                    />

                    <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 block">Atau URL Foto Eksternal:</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={articleImageUrl}
                        onChange={(e) => {
                          setArticleImageUrl(e.target.value);
                          if (!selectedArticleFile) setArticlePhotoPreviewUrl(e.target.value);
                        }}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Keterangan Foto / Caption */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                      <Image className="w-4 h-4 text-emerald-600" /> Keterangan Foto (Caption)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Ilustrasi penyiraman berkala dan pencahayaan tidak langsung"
                      value={articleCaption}
                      onChange={(e) => setArticleCaption(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-emerald-500 bg-slate-50 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                {/* Right side inputs & Photo preview */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Isi Edukasi Perawatan / Panduan <span className="text-red-500">*</span></label>
                    <textarea
                      rows={6}
                      placeholder="Tuliskan panduan perawatan langkah demi langkah, tips media tanam, pemupukan, dsb..."
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      className="w-full flex-1 border border-slate-200 rounded-xl p-3.5 focus:outline-emerald-500 bg-slate-50 text-slate-900 text-xs leading-relaxed"
                    />
                  </div>

                  {/* Preview Box */}
                  {(articlePhotoPreviewUrl || articleImageUrl) && (
                    <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Pratinjau Foto & Keterangan:</span>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                        <img
                          src={articlePhotoPreviewUrl || articleImageUrl}
                          alt="Pratinjau Foto"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=800'; }}
                        />
                      </div>
                      {articleCaption && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100 italic">
                          📷 <strong>Ket:</strong> {articleCaption}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={articleIsPublished}
                        onChange={(e) => setArticleIsPublished(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                      Publikasikan Langsung ke Pelanggan
                    </label>

                    <button
                      onClick={handleSaveArticle}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {editingArticle ? 'Simpan Perubahan' : 'Tambah Edukasi Baru'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* List Table Edukasi Perawatan */}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm space-y-4 p-6">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="font-serif font-bold text-base text-slate-900">Daftar Panduan Edukasi Perawatan ({articles?.length || 0})</h3>
                <span className="text-xs text-slate-400 font-medium">Tersimpan di Penyimpanan Website</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-4">Foto & Ket.</th>
                      <th className="py-3 px-4">Judul & Penulis</th>
                      <th className="py-3 px-4">Ringkasan Panduan</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {articles && articles.length > 0 ? (
                      articles.map(art => (
                        <tr key={art.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-start gap-3">
                              <img
                                src={art.image_url}
                                alt={art.title}
                                className="w-14 h-12 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=800'; }}
                              />
                              <div className="max-w-[140px]">
                                {art.caption ? (
                                  <span className="text-[10px] text-emerald-800 font-medium block italic line-clamp-2">
                                    📷 {art.caption}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic block">Tanpa ket.</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 max-w-[200px]">
                            <span className="block line-clamp-2">{art.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">Oleh: {art.author || 'Tim Botanis'}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-[280px]">
                            <p className="line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: art.content }} />
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              art.is_published !== false ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {art.is_published !== false ? 'Diterbitkan' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditArticle(art)}
                              className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                              title="Edit Artikel"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                              title="Hapus Artikel"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                          Belum ada artikel edukasi perawatan. Silakan tambahkan panduan baru menggunakan form di atas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
