export interface Category {
  id: number;
  name: string;
  nama_kategori?: string;
  slug: string;
  description: string;
  deskripsi?: string;
  product_count?: number;
}

export interface Product {
  id: number;
  category_id: number;
  kategori_id?: number;
  name: string;
  nama_produk?: string;
  slug: string;
  price: number;
  harga?: number;
  description: string;
  deskripsi?: string;
  care_instructions: string;
  keunggulan?: string;
  specifications?: string;
  image_url: string;
  foto?: string;
  stock: number;
  stok?: number;
  status?: 'aktif' | 'nonaktif';
  kategori_nama?: string;
  is_flash_sale: boolean;
  flash_sale_price?: number | null;
  is_best_seller: boolean;
  is_premium: boolean;
}

export interface Voucher {
  id: number;
  code: string;
  discount_percent: number;
  max_discount: number;
  min_purchase: number;
  expires_at: string;
  is_active: boolean;
}

export interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: number;
  order_code: string;
  user_id: number;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_city: string;
  courier: string;
  shipping_cost: number;
  discount_amount: number;
  subtotal: number;
  total_payment: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  tracking_number?: string | null;
  payment_proof?: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: 'bank' | 'ewallet' | 'qris' | 'cod';
  code: string;
  account_number: string;
  account_name: string;
  instructions?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  caption?: string;
  author: string;
  is_published: boolean;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Settings {
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
  flash_sale_end_time?: string;
  flash_sale_active?: boolean;
  search_tags?: string[];
}
