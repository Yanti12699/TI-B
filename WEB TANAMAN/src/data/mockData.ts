import { Category, Product, Voucher, Order, Article, FAQ, Testimonial, Settings } from '../types/store';

export const initialCategories: Category[] = [
  {
    id: 1,
    name: 'Monstera',
    slug: 'monstera',
    description: 'Tanaman hias berdaun indah dan ikonik dengan lubang estetis alami.',
  },
  {
    id: 2,
    name: 'Bonsai',
    slug: 'bonsai',
    description: 'Seni mengerdilkan pohon hias premium dengan struktur s-shape bernilai seni tinggi.',
  },
  {
    id: 3,
    name: 'Calathea',
    slug: 'calathea',
    description: 'Tanaman doa dengan motif daun yang eksotis dan bergerak mengikuti sinar matahari.',
  },
  {
    id: 4,
    name: 'Succulent',
    slug: 'succulent',
    description: 'Tanaman hias berukuran mini yang mudah dirawat dan menyimpan air di daunnya.',
  },
  {
    id: 5,
    name: 'Aglonema',
    slug: 'aglonema',
    description: 'Tanaman pembawa hoki dengan warna daun yang cerah kemerahan.',
  }
];

export const initialProducts: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: 'Monstera Variegata Albo',
    slug: 'monstera-variegata-albo',
    price: 1500000,
    description: 'Monstera Variegata Albo Premium dengan mutasi warna putih yang stabil dan sehat. Memiliki 4-5 daun aktif berukuran sedang, akar sehat mandiri, siap dipajang di sudut ruang tamu premium Anda.',
    care_instructions: 'Penyiraman: 1-2 kali seminggu | Sinar matahari: Terang tidak langsung (Bright indirect light) | Kelembaban: Tinggi (>60%) | Pot: Keramik dengan drainase baik.',
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
    stock: 5,
    is_flash_sale: false,
    flash_sale_price: null,
    is_best_seller: true,
    is_premium: true,
  },
  {
    id: 2,
    category_id: 2,
    name: 'Bonsai Beringin Kimeng S-Shape',
    slug: 'bonsai-beringin-kimeng-s-shape',
    price: 3500000,
    description: 'Bonsai Beringin Kimeng dengan batang kokoh meliuk artistik (S-Shape) yang diproses selama bertahun-tahun oleh ahli bonsai. Dilengkapi pot keramik eksklusif bermotif oriental klasik.',
    care_instructions: 'Penyiraman: Setiap hari (pagi & sore) | Sinar matahari: Paparan langsung (Full sun) | Pemangkasan: Berkala setiap 3 minggu untuk menjaga kerimbunan daun.',
    image_url: 'https://images.unsplash.com/photo-1512428813824-f713c2411abb?w=600&auto=format&fit=crop&q=80',
    stock: 2,
    is_flash_sale: false,
    flash_sale_price: null,
    is_best_seller: true,
    is_premium: true,
  },
  {
    id: 3,
    category_id: 3,
    name: 'Calathea Crimson Premium',
    slug: 'calathea-crimson-premium',
    price: 450000,
    description: 'Calathea Crimson dengan daun berwarna ungu gelap menyala dipadu pinggiran hitam pekat. Tanaman rimbun dengan 6-8 helai daun segar tanpa cacat, membawa aura mistis nan megah ke meja Anda.',
    care_instructions: 'Penyiraman: 2 hari sekali | Sinar matahari: Tempat teduh / dalam ruangan (Partial shade) | Media tanam: Humus lembab dicampur sekam bakar.',
    image_url: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600&auto=format&fit=crop&q=80',
    stock: 12,
    is_flash_sale: true,
    flash_sale_price: 380000,
    is_best_seller: true,
    is_premium: false,
  },
  {
    id: 4,
    category_id: 5,
    name: 'Aglonema Khanza Exotic',
    slug: 'aglonema-khanza-exotic',
    price: 1200000,
    description: 'Aglonema Khanza merupakan jenis aglonema kolektor langka dengan tulang daun berwarna pink menyala dipadu warna hijau kekuningan yang sangat anggun dan eksotis.',
    care_instructions: 'Penyiraman: 3 hari sekali | Sinar matahari: Teduh beratap (Filtered sun) | Pupuk: Dekastar slow-release 6 bulan sekali.',
    image_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80',
    stock: 4,
    is_flash_sale: false,
    flash_sale_price: null,
    is_best_seller: false,
    is_premium: true,
  },
  {
    id: 5,
    category_id: 4,
    name: 'Haworthia Cooperi Variegata',
    slug: 'haworthia-cooperi-variegata',
    price: 250000,
    description: 'Sukulen Haworthia Cooperi dengan daun transparan menyerupai kristal air (windows) dan memiliki guratan mutasi putih (variegata). Ukuran kompak sangat cocok untuk hiasan meja kerja.',
    care_instructions: 'Penyiraman: 1 kali seminggu / ketika media kering total | Sinar matahari: Teras beratap cerah | Media tanam: Pasir malang porous dicampur pumice.',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    stock: 20,
    is_flash_sale: true,
    flash_sale_price: 195000,
    is_best_seller: false,
    is_premium: false,
  },
  {
    id: 6,
    category_id: 1,
    name: 'Monstera Thai Constellation',
    slug: 'monstera-thai-constellation',
    price: 2800000,
    description: 'Monstera Thai Constellation dengan corak percikan krem (creamy) bagaikan rasi bintang di angkasa malam. Akar melimpah, daun kokoh tebal, siap dikirim dengan packing kayu super aman.',
    care_instructions: 'Penyiraman: Seminggu sekali | Sinar matahari: Terang tidak langsung | Media tanam: Campuran sphagnum moss dan perlite.',
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
    stock: 3,
    is_flash_sale: false,
    flash_sale_price: null,
    is_best_seller: true,
    is_premium: true,
  }
];

export const initialVouchers: Voucher[] = [
  {
    id: 1,
    code: 'PLANTLOVER',
    discount_percent: 20,
    max_discount: 100000,
    min_purchase: 150000,
    expires_at: '2026-12-31',
    is_active: true,
  },
  {
    id: 2,
    code: 'FLORAPREMIUM',
    discount_percent: 10,
    max_discount: 500000,
    min_purchase: 1000000,
    expires_at: '2026-12-31',
    is_active: true,
  },
  {
    id: 3,
    code: 'NEWUSER',
    discount_percent: 15,
    max_discount: 30000,
    min_purchase: 50000,
    expires_at: '2026-12-31',
    is_active: true,
  }
];

export const initialOrders: Order[] = [
  {
    id: 1,
    order_code: 'INV202607010001',
    user_id: 2,
    recipient_name: 'Budi Santoso',
    recipient_phone: '085712345678',
    shipping_address: 'Jl. Pajajaran No. 45, Baranangsiang, Kota Bogor',
    shipping_city: 'Bogor',
    courier: 'JNE YES',
    shipping_cost: 25000,
    discount_amount: 100000,
    subtotal: 1500000,
    total_payment: 1425000,
    payment_method: 'Transfer Bank (BCA)',
    payment_status: 'paid',
    order_status: 'completed',
    tracking_number: 'REG-892019481',
    created_at: '2026-07-01T10:30:00Z',
  },
  {
    id: 2,
    order_code: 'INV202607130002',
    user_id: 2,
    recipient_name: 'Budi Santoso',
    recipient_phone: '085712345678',
    shipping_address: 'Jl. Pajajaran No. 45, Baranangsiang, Kota Bogor',
    shipping_city: 'Bogor',
    courier: 'JNE REG',
    shipping_cost: 25000,
    discount_amount: 0,
    subtotal: 450000,
    total_payment: 475000,
    payment_method: 'DANA',
    payment_status: 'paid',
    order_status: 'processing',
    tracking_number: null,
    created_at: '2026-07-13T05:15:00Z',
  }
];

export const initialArticles: Article[] = [
  {
    id: 1,
    title: '5 Cara Merawat Monstera Variegata Agar Mutasi Putih Tetap Stabil',
    slug: 'cara-merawat-monstera-variegata',
    content: `<p>Monstera variegata merupakan salah satu tanaman hias premium paling populer di kalangan kolektor tanaman hias. Corak putihnya yang eksotis membuat harga tanaman ini melonjak tinggi. Namun, jika tidak dirawat dengan benar, mutasi putihnya bisa memudar atau bahkan mengalami pembusukan (gosong) karena kurangnya klorofil.</p>
    <h5 class="font-semibold text-emerald-800 mt-4 mb-2">1. Sinar Matahari yang Cukup dan Terang</h5>
    <p>Tempatkan Monstera Variegata Anda di area yang menerima cahaya terang tetapi tidak langsung terpapar sinar matahari terik (Bright Indirect Light). Sinar matahari langsung akan membakar daun putih, sedangkan tempat yang terlalu gelap akan memicu daun baru tumbuh dominan hijau.</p>
    <h5 class="font-semibold text-emerald-800 mt-4 mb-2">2. Media Tanam Super Porous</h5>
    <p>Gunakan campuran media tanam yang sangat porous. Anda bisa memadukan sekam bakar, perlite, cocopeat, andam, dan sedikit pupuk kandang. Media yang padat akan menahan air terlalu lama, berisiko menyebabkan busuk akar.</p>
    <h5 class="font-semibold text-emerald-800 mt-4 mb-2">3. Penyiraman Hanya Saat Kering</h5>
    <p>Siram tanaman hanya ketika 2-3 cm lapisan atas media tanam sudah kering. Anda bisa menggunakan jari atau tusuk sate kayu untuk memastikannya. Air yang berlebihan adalah musuh utama tanaman ini.</p>`,
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
    caption: 'Foto Monstera Variegata Albo sehat dengan mutasi warna putih menawan.',
    author: 'Siti Nurbayanti',
    is_published: true,
    created_at: '2026-07-10T08:00:00Z',
  },
  {
    id: 2,
    title: 'Panduan Memilih Media Tanam Terbaik Untuk Bonsai Beringin Kimeng',
    slug: 'media-tanam-bonsai-kimeng',
    content: `<p>Memiliki Bonsai Beringin Kimeng dengan bentuk artistik memerlukan perawatan rutin, salah satunya adalah pemilihan media tanam. Bonsai tumbuh dalam pot yang sangat terbatas, sehingga media tanam yang dipilih harus mampu mensuplai nutrisi sekaligus menjaga kelembapan tanpa memicu genangan air.</p>
    <h5 class="font-semibold text-emerald-800 mt-4 mb-2">Karakteristik Media Tanam Bonsai</h5>
    <p>Bonsai membutuhkan media yang memiliki aerasi yang baik dan retensi air yang cukup. Bahan yang sering direkomendasikan adalah Pasir Malang, Tanah Humus, dan Kompos dengan perbandingan 2:1:1. Pasir malang diletakkan paling bawah pot untuk menjamin kelancaran air keluar.</p>`,
    image_url: 'https://images.unsplash.com/photo-1512428813824-f713c2411abb?w=600&auto=format&fit=crop&q=80',
    caption: 'Foto media tanam pasir malang dan struktur akar bonsai Beringin Kimeng.',
    author: 'Siti Nurbayanti',
    is_published: true,
    created_at: '2026-07-12T09:15:00Z',
  }
];

export const initialFAQs: FAQ[] = [
  {
    id: 1,
    question: 'Bagaimana proses pengiriman tanaman agar tetap aman sampai tujuan?',
    answer: 'Setiap tanaman dibungkus dengan media tanam yang lembab (moss/cocopeat) dibalut plastik, daun dilindungi dengan kertas tebal, dan dikemas menggunakan box kardus tebal berserat ganda yang kokoh (double-wall box) atau kayu (opsional untuk tanaman besar). Kami menjamin kesegaran tanaman selama masa pengiriman maksimal 4 hari.',
  },
  {
    id: 2,
    question: 'Apakah ada garansi jika tanaman mati atau rusak saat diterima?',
    answer: 'Ya, kami memberikan Garansi 100% Ganti Baru jika tanaman diterima dalam keadaan mati, busuk total, atau patah batang utama. Syarat klaim wajib menyertakan video unboxing utuh tanpa edit/jeda maksimal 24 jam sejak paket dinyatakan diterima oleh kurir.',
  },
  {
    id: 3,
    question: 'Bagaimana metode pembayaran yang didukung?',
    answer: 'Kami mendukung pembayaran melalui Transfer Bank Otomatis (BCA), QRIS untuk semua e-wallet (DANA, OVO, GoPay, ShopeePay, LinkAja), dan Bayar di Tempat (COD) untuk wilayah Jabodetabek.',
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    rating: 5,
    comment: 'Sangat puas belanja di FloraPremium! Monstera Variegata Albo sampai dalam keadaan sangat segar, packingnya juara rapi banget dibungkus kayu tebal. Seller juga ramah memberi panduan perawatan via WA. Recommended seller!',
  },
  {
    id: 2,
    name: 'Santi Wijaya',
    rating: 5,
    comment: 'Bonsai Kimeng batangnya meliuk indah sekali persis di foto produk. Sudah dapet pot keramik tebal yang cantik. Sangat berkelas dipajang di ruang tamu rumah kami.',
  }
];

export const initialSettings: Settings = {
  app_name: 'FloraPremium',
  app_description: 'E-commerce penyedia tanaman hias premium terkurasi dan berkualitas tinggi untuk hunian mewah Anda.',
  bank_name: 'Bank Central Asia (BCA)',
  bank_account_no: '8920194812',
  bank_recipient: 'Siti Nurbayanti',
  qris_url: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&auto=format&fit=crop&q=80', // Beautiful mock QR code representation
  ewallet_no: '081298765432',
  whatsapp_no: '6281298765432',
  address: 'Jl. Tajur Indah No. 12, Kel. Tajur, Kec. Bogor Timur, Kota Bogor, Jawa Barat 16141',
  shipping_cost_flat: 25000,
  flash_sale_active: true,
  flash_sale_end_time: '2026-07-13T10:00:00-07:00',
  search_tags: ['Monstera', 'Variegata', 'Bonsai', 'Indoor', 'Kritis Stok', 'Flash Sale', 'Premium', 'Tanaman Hias']
};
