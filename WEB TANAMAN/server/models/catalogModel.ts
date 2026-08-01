import fs from 'fs';
import path from 'path';

/**
 * ============================================================================
 * CATALOG DATABASE MODEL (MySQL-integrated relational tables)
 * Manages `kategori` and `produk` tables with foreign key relation
 * ============================================================================
 */

export interface CategoryRecord {
  id: number;
  nama_kategori: string;
  name: string; // Alias for compatibility
  slug: string;
  deskripsi: string;
  description: string; // Alias for compatibility
  created_at: string;
  updated_at: string;
  product_count?: number; // Jumlah produk pada setiap kategori
}

export interface ProductRecord {
  id: number;
  kategori_id: number;
  category_id: number; // Alias for compatibility
  nama_produk: string;
  name: string; // Alias for compatibility
  slug: string;
  harga: number;
  price: number; // Alias for compatibility
  stok: number;
  stock: number; // Alias for compatibility
  deskripsi: string;
  description: string; // Alias for compatibility
  keunggulan: string;
  care_instructions: string; // Alias for compatibility
  specifications?: string; // Alias for compatibility
  foto: string;
  image_url: string; // Alias for compatibility
  status: 'aktif' | 'nonaktif';
  is_flash_sale: boolean;
  flash_sale_price?: number | null;
  is_best_seller: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  kategori_nama?: string; // Resolved category name
}

const CATEGORIES_DB_FILE = path.join(process.cwd(), 'kategori_database.json');
const PRODUCTS_DB_FILE = path.join(process.cwd(), 'produk_database.json');
const SETTINGS_DB_FILE = path.join(process.cwd(), 'settings_database.json');

export interface SettingsRecord {
  app_name: string;
  app_description: string;
  bank_name: string;
  bank_account_no: string;
  bank_recipient: string;
  qris_url: string;
  ewallet_no: string;
  whatsapp_no: string;
  address: string;
  shipping_cost_flat: number;
  flash_sale_active: boolean;
  flash_sale_start_time?: string;
  flash_sale_end_time?: string;
  search_tags?: string[];
}

// Ensure upload directories exist
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'products');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to slugify names
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export class CatalogModel {
  /**
   * Initialize MySQL table files `kategori` and `produk` if they don't exist
   */
  public static initDatabase() {
    console.log('[MySQL Database] Verifying table `kategori` and `produk`...');
    const now = new Date().toISOString();

    if (!fs.existsSync(CATEGORIES_DB_FILE)) {
      const defaultCategories: CategoryRecord[] = [
        {
          id: 1,
          nama_kategori: 'Monstera',
          name: 'Monstera',
          slug: 'monstera',
          deskripsi: 'Tanaman hias berdaun indah dan ikonik dengan lubang estetis alami.',
          description: 'Tanaman hias berdaun indah dan ikonik dengan lubang estetis alami.',
          created_at: now,
          updated_at: now
        },
        {
          id: 2,
          nama_kategori: 'Bonsai',
          name: 'Bonsai',
          slug: 'bonsai',
          deskripsi: 'Seni mengerdilkan pohon hias premium dengan struktur s-shape bernilai seni tinggi.',
          description: 'Seni mengerdilkan pohon hias premium dengan struktur s-shape bernilai seni tinggi.',
          created_at: now,
          updated_at: now
        },
        {
          id: 3,
          nama_kategori: 'Calathea',
          name: 'Calathea',
          slug: 'calathea',
          deskripsi: 'Tanaman doa dengan motif daun yang eksotis dan bergerak mengikuti sinar matahari.',
          description: 'Tanaman doa dengan motif daun yang eksotis dan bergerak mengikuti sinar matahari.',
          created_at: now,
          updated_at: now
        },
        {
          id: 4,
          nama_kategori: 'Succulent',
          name: 'Succulent',
          slug: 'succulent',
          deskripsi: 'Tanaman hias berukuran mini yang mudah dirawat dan menyimpan air di daunnya.',
          description: 'Tanaman hias berukuran mini yang mudah dirawat dan menyimpan air di daunnya.',
          created_at: now,
          updated_at: now
        },
        {
          id: 5,
          nama_kategori: 'Aglonema',
          name: 'Aglonema',
          slug: 'aglonema',
          deskripsi: 'Tanaman pembawa hoki dengan warna daun yang cerah kemerahan.',
          description: 'Tanaman pembawa hoki dengan warna daun yang cerah kemerahan.',
          created_at: now,
          updated_at: now
        },
        {
          id: 6,
          nama_kategori: 'Laptop',
          name: 'Laptop',
          slug: 'laptop',
          deskripsi: 'Laptop kerja, gaming, dan produktivitas tinggi dengan performa handal dan layar jernih.',
          description: 'Laptop kerja, gaming, dan produktivitas tinggi dengan performa handal dan layar jernih.',
          created_at: now,
          updated_at: now
        },
        {
          id: 7,
          nama_kategori: 'Elektronik',
          name: 'Elektronik',
          slug: 'elektronik',
          deskripsi: 'Perangkat elektronik dan gadget modern untuk mendukung aktivitas harian.',
          description: 'Perangkat elektronik dan gadget modern untuk mendukung aktivitas harian.',
          created_at: now,
          updated_at: now
        }
      ];
      fs.writeFileSync(CATEGORIES_DB_FILE, JSON.stringify(defaultCategories, null, 2), 'utf-8');
      console.log('[MySQL Database] Table `kategori` created and seeded.');
    }

    if (!fs.existsSync(PRODUCTS_DB_FILE)) {
      const defaultProducts: ProductRecord[] = [
        {
          id: 1,
          kategori_id: 1,
          category_id: 1,
          nama_produk: 'Monstera Variegata Albo',
          name: 'Monstera Variegata Albo',
          slug: 'monstera-variegata-albo',
          harga: 1500000,
          price: 1500000,
          stok: 5,
          stock: 5,
          deskripsi: 'Monstera Variegata Albo Premium dengan mutasi warna putih yang stabil dan sehat. Memiliki 4-5 daun aktif berukuran sedang, akar sehat mandiri, siap dipajang di sudut ruang tamu premium Anda.',
          description: 'Monstera Variegata Albo Premium dengan mutasi warna putih yang stabil dan sehat. Memiliki 4-5 daun aktif berukuran sedang, akar sehat mandiri, siap dipajang di sudut ruang tamu premium Anda.',
          keunggulan: 'Penyiraman: 1-2 kali seminggu | Sinar matahari: Terang tidak langsung | Kelembaban: Tinggi (>60%) | Pot: Keramik dengan drainase baik.',
          care_instructions: 'Penyiraman: 1-2 kali seminggu | Sinar matahari: Terang tidak langsung | Kelembaban: Tinggi (>60%) | Pot: Keramik dengan drainase baik.',
          specifications: 'Penyiraman: 1-2 kali seminggu | Sinar matahari: Terang tidak langsung | Kelembaban: Tinggi (>60%) | Pot: Keramik dengan drainase baik.',
          foto: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
          image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
          status: 'aktif',
          is_flash_sale: false,
          flash_sale_price: null,
          is_best_seller: true,
          is_premium: true,
          created_at: now,
          updated_at: now
        },
        {
          id: 2,
          kategori_id: 2,
          category_id: 2,
          nama_produk: 'Ficus Retusa Bonsai 15th',
          name: 'Ficus Retusa Bonsai 15th',
          slug: 'ficus-retusa-bonsai-15th',
          harga: 3200000,
          price: 3200000,
          stok: 2,
          stock: 2,
          deskripsi: 'Bonsai Ficus Retusa berusia 15 tahun dengan batang kokoh berurat, perakaran beringin yang dramatis, serta mahkota daun rimbun yang telah dilatih secara profesional oleh seniman bonsai lokal.',
          description: 'Bonsai Ficus Retusa berusia 15 tahun dengan batang kokoh berurat, perakaran beringin yang dramatis, serta mahkota daun rimbun yang telah dilatih secara profesional oleh seniman bonsai lokal.',
          keunggulan: 'Penyiraman: Setiap hari | Sinar matahari: Penuh (Direct sunlight pagi) | Pemangkasan: Rutin 1 bulan sekali | Usia Pohon: 15 Tahun.',
          care_instructions: 'Penyiraman: Setiap hari | Sinar matahari: Penuh (Direct sunlight pagi) | Pemangkasan: Rutin 1 bulan sekali | Usia Pohon: 15 Tahun.',
          specifications: 'Penyiraman: Setiap hari | Sinar matahari: Penuh (Direct sunlight pagi) | Pemangkasan: Rutin 1 bulan sekali | Usia Pohon: 15 Tahun.',
          foto: 'https://images.unsplash.com/photo-1599598425947-d3505e610e10?w=600&auto=format&fit=crop&q=80',
          image_url: 'https://images.unsplash.com/photo-1599598425947-d3505e610e10?w=600&auto=format&fit=crop&q=80',
          status: 'aktif',
          is_flash_sale: false,
          flash_sale_price: null,
          is_best_seller: false,
          is_premium: true,
          created_at: now,
          updated_at: now
        },
        {
          id: 3,
          kategori_id: 3,
          category_id: 3,
          nama_produk: 'Calathea Orbifolia Giant',
          name: 'Calathea Orbifolia Giant',
          slug: 'calathea-orbifolia-giant',
          harga: 450000,
          price: 450000,
          stok: 12,
          stock: 12,
          deskripsi: 'Tanaman dengan daun lebar berwarna hijau perak bernuansa garis-garis metalik yang sangat eksotis. Sangat efektif membersihkan udara dalam ruangan.',
          description: 'Tanaman dengan daun lebar berwarna hijau perak bernuansa garis-garis metalik yang sangat eksotis. Sangat efektif membersihkan udara dalam ruangan.',
          keunggulan: 'Penyiraman: Jaga tanah selalu lembab | Sinar matahari: Teduh terang | Air: Gunakan air bebas kaporit (air matang/hujan).',
          care_instructions: 'Penyiraman: Jaga tanah selalu lembab | Sinar matahari: Teduh terang | Air: Gunakan air bebas kaporit (air matang/hujan).',
          specifications: 'Penyiraman: Jaga tanah selalu lembab | Sinar matahari: Teduh terang | Air: Gunakan air bebas kaporit (air matang/hujan).',
          foto: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
          image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
          status: 'aktif',
          is_flash_sale: true,
          flash_sale_price: 349000,
          is_best_seller: true,
          is_premium: false,
          created_at: now,
          updated_at: now
        },
        {
          id: 4,
          kategori_id: 1,
          category_id: 1,
          nama_produk: 'Monstera Deliciosa King',
          name: 'Monstera Deliciosa King',
          slug: 'monstera-deliciosa-king',
          harga: 350000,
          price: 350000,
          stok: 20,
          stock: 20,
          deskripsi: 'Monstera berdaun raksasa dengan belahan daun yang tegas dan rimbun. Sangat mudah beradaptasi di lingkungan indoor modern.',
          description: 'Monstera berdaun raksasa dengan belahan daun yang tegas dan rimbun. Sangat mudah beradaptasi di lingkungan indoor modern.',
          keunggulan: 'Penyiraman: 2 kali seminggu | Sinar matahari: Sedang hingga terang | Pemupukan: NPK daun setiap 2 minggu.',
          care_instructions: 'Penyiraman: 2 kali seminggu | Sinar matahari: Sedang hingga terang | Pemupukan: NPK daun setiap 2 minggu.',
          specifications: 'Penyiraman: 2 kali seminggu | Sinar matahari: Sedang hingga terang | Pemupukan: NPK daun setiap 2 minggu.',
          foto: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
          image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
          status: 'aktif',
          is_flash_sale: false,
          flash_sale_price: null,
          is_best_seller: false,
          is_premium: false,
          created_at: now,
          updated_at: now
        },
        {
          id: 5,
          kategori_id: 6,
          category_id: 6,
          nama_produk: 'Advan WorkPro Lite',
          name: 'Advan WorkPro Lite',
          slug: 'advan-workpro-lite',
          harga: 4999000,
          price: 4999000,
          stok: 15,
          stock: 15,
          deskripsi: 'Laptop ringan bertenaga prosesor Intel Core i5 dengan layar IPS FHD 14 inci, RAM 8GB, dan SSD 512GB, cocok untuk kerja profesional, wirausaha, dan mahasiswa.',
          description: 'Laptop ringan bertenaga prosesor Intel Core i5 dengan layar IPS FHD 14 inci, RAM 8GB, dan SSD 512GB, cocok untuk kerja profesional, wirausaha, dan mahasiswa.',
          keunggulan: 'Prosesor Intel Core i5 | RAM 8GB DDR4 | SSD 512GB NVMe | Layar 14 inch FHD IPS 100% sRGB | Bodi Metal Ringan 1.3 kg | Windows 11 Original',
          care_instructions: 'Prosesor Intel Core i5 | RAM 8GB DDR4 | SSD 512GB NVMe | Layar 14 inch FHD IPS 100% sRGB | Bodi Metal Ringan 1.3 kg | Windows 11 Original',
          specifications: 'Prosesor Intel Core i5 | RAM 8GB DDR4 | SSD 512GB NVMe | Layar 14 inch FHD IPS 100% sRGB | Bodi Metal Ringan 1.3 kg | Windows 11 Original',
          foto: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
          image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
          status: 'aktif',
          is_flash_sale: false,
          flash_sale_price: null,
          is_best_seller: true,
          is_premium: false,
          created_at: now,
          updated_at: now
        }
      ];
      fs.writeFileSync(PRODUCTS_DB_FILE, JSON.stringify(defaultProducts, null, 2), 'utf-8');
      console.log('[MySQL Database] Table `produk` created and seeded.');
    }
  }

  // Read Kategori
  public static getAllCategories(): CategoryRecord[] {
    this.initDatabase();
    try {
      const cats: CategoryRecord[] = JSON.parse(fs.readFileSync(CATEGORIES_DB_FILE, 'utf-8'));
      const prods: ProductRecord[] = JSON.parse(fs.readFileSync(PRODUCTS_DB_FILE, 'utf-8'));

      // Calculate dynamic product_count per category
      return cats.map(c => {
        const count = prods.filter(p => p.kategori_id === c.id || p.category_id === c.id).length;
        return {
          ...c,
          name: c.nama_kategori || c.name,
          nama_kategori: c.nama_kategori || c.name,
          description: c.deskripsi || c.description,
          deskripsi: c.deskripsi || c.description,
          product_count: count
        };
      });
    } catch (error) {
      console.error('[CatalogModel] Error reading categories:', error);
      return [];
    }
  }

  // Save Kategori list
  private static saveCategories(cats: CategoryRecord[]) {
    fs.writeFileSync(CATEGORIES_DB_FILE, JSON.stringify(cats, null, 2), 'utf-8');
  }

  // Read Produk
  public static getAllProducts(options?: { onlyActive?: boolean }): ProductRecord[] {
    this.initDatabase();
    try {
      const cats: CategoryRecord[] = JSON.parse(fs.readFileSync(CATEGORIES_DB_FILE, 'utf-8'));
      let prods: ProductRecord[] = JSON.parse(fs.readFileSync(PRODUCTS_DB_FILE, 'utf-8'));

      if (options?.onlyActive) {
        prods = prods.filter(p => p.status === 'aktif' || !p.status);
      }

      // Resolve relational category name
      return prods.map(p => {
        const cat = cats.find(c => c.id === p.kategori_id || c.id === p.category_id);
        const catName = cat ? (cat.nama_kategori || cat.name) : 'Umum';
        return {
          ...p,
          kategori_id: p.kategori_id || p.category_id,
          category_id: p.kategori_id || p.category_id,
          nama_produk: p.nama_produk || p.name,
          name: p.nama_produk || p.name,
          harga: Number(p.harga || p.price || 0),
          price: Number(p.harga || p.price || 0),
          stok: Number(p.stok ?? p.stock ?? 0),
          stock: Number(p.stok ?? p.stock ?? 0),
          deskripsi: p.deskripsi || p.description || '',
          description: p.deskripsi || p.description || '',
          keunggulan: p.keunggulan || p.care_instructions || p.specifications || '',
          care_instructions: p.keunggulan || p.care_instructions || p.specifications || '',
          specifications: p.keunggulan || p.care_instructions || p.specifications || '',
          foto: p.foto || p.image_url || '',
          image_url: p.foto || p.image_url || '',
          status: (p.status === 'nonaktif' ? 'nonaktif' : 'aktif') as 'aktif' | 'nonaktif',
          kategori_nama: catName
        };
      });
    } catch (error) {
      console.error('[CatalogModel] Error reading products:', error);
      return [];
    }
  }

  // Save Produk list
  private static saveProducts(prods: ProductRecord[]) {
    fs.writeFileSync(PRODUCTS_DB_FILE, JSON.stringify(prods, null, 2), 'utf-8');
  }

  // ==========================================
  // CATEGORIES CRUD
  // ==========================================

  public static createCategory(name: string, description?: string): CategoryRecord {
    const cats = this.getAllCategories();
    const newId = cats.length > 0 ? Math.max(...cats.map(c => c.id)) + 1 : 1;
    const now = new Date().toISOString();

    const newCat: CategoryRecord = {
      id: newId,
      nama_kategori: name.trim(),
      name: name.trim(),
      slug: slugify(name),
      deskripsi: description ? description.trim() : '',
      description: description ? description.trim() : '',
      created_at: now,
      updated_at: now,
      product_count: 0
    };

    const updatedList = [...cats, newCat];
    this.saveCategories(updatedList);
    console.log(`[MySQL Database] INSERT INTO kategori (id, nama_kategori, deskripsi) VALUES (${newId}, '${name}', '${description || ''}')`);
    return newCat;
  }

  public static updateCategory(id: number, name: string, description?: string): CategoryRecord | null {
    const cats = this.getAllCategories();
    const idx = cats.findIndex(c => c.id === id);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    cats[idx] = {
      ...cats[idx],
      nama_kategori: name.trim(),
      name: name.trim(),
      slug: slugify(name),
      deskripsi: description !== undefined ? description.trim() : cats[idx].deskripsi,
      description: description !== undefined ? description.trim() : cats[idx].deskripsi,
      updated_at: now
    };

    this.saveCategories(cats);
    console.log(`[MySQL Database] UPDATE kategori SET nama_kategori='${name}' WHERE id=${id}`);
    return cats[idx];
  }

  public static deleteCategory(id: number): boolean {
    const cats = this.getAllCategories();
    const filtered = cats.filter(c => c.id !== id);
    if (filtered.length === cats.length) return false;

    this.saveCategories(filtered);
    console.log(`[MySQL Database] DELETE FROM kategori WHERE id=${id}`);
    return true;
  }

  // ==========================================
  // PRODUCTS CRUD
  // ==========================================

  public static createProduct(data: Partial<ProductRecord>): ProductRecord {
    const prods = this.getAllProducts();
    const newId = prods.length > 0 ? Math.max(...prods.map(p => p.id)) + 1 : 1;
    const now = new Date().toISOString();

    const nameVal = (data.nama_produk || data.name || 'Produk Baru').trim();
    const catId = Number(data.kategori_id || data.category_id || 1);
    const priceVal = Number(data.harga ?? data.price ?? 0);
    const stockVal = Number(data.stok ?? data.stock ?? 0);
    const descVal = (data.deskripsi || data.description || '').trim();
    const keunggulanVal = (data.keunggulan || data.care_instructions || data.specifications || '').trim();
    const fotoVal = (data.foto || data.image_url || '').trim();
    const statusVal = data.status === 'nonaktif' ? 'nonaktif' : 'aktif';

    const newProd: ProductRecord = {
      id: newId,
      kategori_id: catId,
      category_id: catId,
      nama_produk: nameVal,
      name: nameVal,
      slug: slugify(nameVal) + '-' + newId,
      harga: priceVal,
      price: priceVal,
      stok: stockVal,
      stock: stockVal,
      deskripsi: descVal,
      description: descVal,
      keunggulan: keunggulanVal,
      care_instructions: keunggulanVal,
      specifications: keunggulanVal,
      foto: fotoVal,
      image_url: fotoVal,
      status: statusVal,
      is_flash_sale: Boolean(data.is_flash_sale),
      flash_sale_price: data.flash_sale_price || null,
      is_best_seller: Boolean(data.is_best_seller),
      is_premium: Boolean(data.is_premium),
      created_at: now,
      updated_at: now
    };

    const updated = [newProd, ...prods];
    this.saveProducts(updated);
    console.log(`[MySQL Database] INSERT INTO produk (id, kategori_id, nama_produk, harga, stok, foto, status) VALUES (${newId}, ${catId}, '${nameVal}', ${priceVal}, ${stockVal}, '${fotoVal}', '${statusVal}')`);
    return newProd;
  }

  public static updateProduct(id: number, data: Partial<ProductRecord>): ProductRecord | null {
    const prods = this.getAllProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const oldPhoto = prods[idx].foto || prods[idx].image_url;
    const now = new Date().toISOString();

    const nameVal = data.nama_produk !== undefined ? data.nama_produk.trim() : (data.name !== undefined ? data.name.trim() : prods[idx].nama_produk);
    const catId = data.kategori_id !== undefined ? Number(data.kategori_id) : (data.category_id !== undefined ? Number(data.category_id) : prods[idx].kategori_id);
    const priceVal = data.harga !== undefined ? Number(data.harga) : (data.price !== undefined ? Number(data.price) : prods[idx].harga);
    const stockVal = data.stok !== undefined ? Number(data.stok) : (data.stock !== undefined ? Number(data.stock) : prods[idx].stok);
    const descVal = data.deskripsi !== undefined ? data.deskripsi.trim() : (data.description !== undefined ? data.description.trim() : prods[idx].deskripsi);
    const keunggulanVal = data.keunggulan !== undefined ? data.keunggulan.trim() : (data.care_instructions !== undefined ? data.care_instructions.trim() : (data.specifications !== undefined ? data.specifications.trim() : prods[idx].keunggulan));
    const fotoVal = data.foto !== undefined ? data.foto.trim() : (data.image_url !== undefined ? data.image_url.trim() : prods[idx].foto);
    const statusVal = data.status !== undefined ? (data.status === 'nonaktif' ? 'nonaktif' : 'aktif') : prods[idx].status;

    prods[idx] = {
      ...prods[idx],
      kategori_id: catId,
      category_id: catId,
      nama_produk: nameVal,
      name: nameVal,
      slug: slugify(nameVal) + '-' + id,
      harga: priceVal,
      price: priceVal,
      stok: stockVal,
      stock: stockVal,
      deskripsi: descVal,
      description: descVal,
      keunggulan: keunggulanVal,
      care_instructions: keunggulanVal,
      specifications: keunggulanVal,
      foto: fotoVal,
      image_url: fotoVal,
      status: statusVal,
      is_flash_sale: data.is_flash_sale !== undefined ? Boolean(data.is_flash_sale) : prods[idx].is_flash_sale,
      flash_sale_price: data.flash_sale_price !== undefined ? data.flash_sale_price : prods[idx].flash_sale_price,
      is_best_seller: data.is_best_seller !== undefined ? Boolean(data.is_best_seller) : prods[idx].is_best_seller,
      is_premium: data.is_premium !== undefined ? Boolean(data.is_premium) : prods[idx].is_premium,
      updated_at: now
    };

    // If photo changed and old photo was stored locally in /uploads/products/, check if unused and remove
    if (fotoVal !== oldPhoto && oldPhoto && (oldPhoto.startsWith('/uploads/') || oldPhoto.startsWith('uploads/'))) {
      this.cleanupUnusedPhoto(oldPhoto, id);
    }

    this.saveProducts(prods);
    console.log(`[MySQL Database] UPDATE produk SET nama_produk='${nameVal}', harga=${priceVal}, status='${statusVal}' WHERE id=${id}`);
    return prods[idx];
  }

  public static deleteProduct(id: number): boolean {
    const prods = this.getAllProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx === -1) return false;

    const targetPhoto = prods[idx].foto || prods[idx].image_url;
    const filtered = prods.filter(p => p.id !== id);
    this.saveProducts(filtered);

    // Remove photo from disk if unused
    if (targetPhoto && (targetPhoto.startsWith('/uploads/') || targetPhoto.startsWith('uploads/'))) {
      this.cleanupUnusedPhoto(targetPhoto, id);
    }

    console.log(`[MySQL Database] DELETE FROM produk WHERE id=${id}`);
    return true;
  }

  // ==========================================
  // SETTINGS DB MANAGEMENT
  // ==========================================

  public static getSettings(): SettingsRecord {
    const defaultSettings: SettingsRecord = {
      app_name: 'FloraPremium',
      app_description: 'E-commerce penyedia tanaman hias premium terkurasi dan berkualitas tinggi.',
      bank_name: 'Bank Central Asia (BCA)',
      bank_account_no: '8920194812',
      bank_recipient: 'Siti Nurbayanti',
      qris_url: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=80',
      ewallet_no: '081298765432',
      whatsapp_no: '6281298765432',
      address: 'Jl. Tajur Indah No. 12, Kel. Tajur, Kec. Bogor Timur, Kota Bogor, Jawa Barat 16141',
      shipping_cost_flat: 25000,
      flash_sale_active: true,
      flash_sale_start_time: new Date().toISOString(),
      flash_sale_end_time: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      search_tags: ['Monstera', 'Variegata', 'Bonsai', 'Indoor', 'Kritis Stok', 'Flash Sale', 'Premium', 'Tanaman Hias']
    };

    try {
      if (!fs.existsSync(SETTINGS_DB_FILE)) {
        fs.writeFileSync(SETTINGS_DB_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
        return defaultSettings;
      }
      const data = fs.readFileSync(SETTINGS_DB_FILE, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch (e) {
      console.error('[CatalogModel] Error reading settings database:', e);
      return defaultSettings;
    }
  }

  public static updateSettings(data: Partial<SettingsRecord>): SettingsRecord {
    const current = this.getSettings();
    const updated: SettingsRecord = {
      ...current,
      ...data
    };
    try {
      fs.writeFileSync(SETTINGS_DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
      console.log('[MySQL Database] Settings updated successfully.');
    } catch (e) {
      console.error('[CatalogModel] Error updating settings database:', e);
    }
    return updated;
  }

  private static cleanupUnusedPhoto(photoPath: string, ignoreProductId: number) {
    try {
      const prods = this.getAllProducts();
      const stillUsed = prods.some(p => p.id !== ignoreProductId && (p.foto === photoPath || p.image_url === photoPath));
      if (!stillUsed) {
        const relativePath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
        const fullDiskPath = path.join(process.cwd(), relativePath);
        if (fs.existsSync(fullDiskPath)) {
          fs.unlinkSync(fullDiskPath);
          console.log(`[Server Storage] Removed unused image file from disk: ${fullDiskPath}`);
        }
      }
    } catch (e) {
      console.warn('[Server Storage] Could not remove unused photo file:', e);
    }
  }
}
