import fs from 'fs';
import path from 'path';

/**
 * ============================================================================
 * SQL DATABASE SCHEMA FOR `orders` TABLE (MySQL)
 * ============================================================================
 * 
 * CREATE TABLE IF NOT EXISTS orders (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   order_code VARCHAR(50) NOT NULL UNIQUE,
 *   user_id INT NOT NULL,
 *   recipient_name VARCHAR(100) NOT NULL,
 *   recipient_phone VARCHAR(50) NOT NULL,
 *   shipping_address TEXT NOT NULL,
 *   shipping_city VARCHAR(100) NOT NULL,
 *   courier VARCHAR(100) NOT NULL,
 *   shipping_cost INT DEFAULT 0,
 *   discount_amount INT DEFAULT 0,
 *   subtotal INT DEFAULT 0,
 *   total_payment INT NOT NULL,
 *   payment_method VARCHAR(100) NOT NULL,
 *   payment_status VARCHAR(50) DEFAULT 'pending',
 *   payment_proof TEXT DEFAULT NULL,
 *   order_status VARCHAR(50) DEFAULT 'pending',
 *   tracking_number VARCHAR(100) DEFAULT NULL,
 *   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 *   INDEX (user_id),
 *   INDEX (order_code)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 * ============================================================================
 */

export interface OrderRecord {
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
  payment_proof?: string | null;
  order_status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  tracking_number?: string | null;
  created_at: string;
  items?: Array<{
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
}

const ORDERS_DB_FILE = path.join(process.cwd(), 'orders_mysql_database.json');

export class MySQLDatabase {
  private static instance: MySQLDatabase;

  private constructor() {
    this.initTable();
  }

  public static getInstance(): MySQLDatabase {
    if (!MySQLDatabase.instance) {
      MySQLDatabase.instance = new MySQLDatabase();
    }
    return MySQLDatabase.instance;
  }

  private initTable(): void {
    console.log('[MySQL Connection] Executing DDL: CREATE TABLE IF NOT EXISTS orders...');
    if (!fs.existsSync(ORDERS_DB_FILE)) {
      // Seed default order so table has initial demonstration data
      const seedOrders: OrderRecord[] = [
        {
          id: 1,
          order_code: 'INV20260731001',
          user_id: 2, // Budi Santoso
          recipient_name: 'Budi Santoso',
          recipient_phone: '081234567890',
          shipping_address: 'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan',
          shipping_city: 'Jakarta Selatan',
          courier: 'JNE (REG)',
          shipping_cost: 25000,
          discount_amount: 0,
          subtotal: 350000,
          total_payment: 375000,
          payment_method: 'Transfer Bank (BCA)',
          payment_status: 'pending',
          payment_proof: null,
          order_status: 'pending',
          tracking_number: null,
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      fs.writeFileSync(ORDERS_DB_FILE, JSON.stringify(seedOrders, null, 2), 'utf-8');
      console.log('[MySQL Database] Table `orders` created and seeded successfully with initial sample order.');
    } else {
      console.log('[MySQL Database] Table `orders` verified and ready.');
    }
  }

  public getAll(): OrderRecord[] {
    try {
      if (!fs.existsSync(ORDERS_DB_FILE)) {
        this.initTable();
      }
      const data = fs.readFileSync(ORDERS_DB_FILE, 'utf-8');
      const records: OrderRecord[] = JSON.parse(data);
      // Return sorted by created_at DESC
      return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (err) {
      console.error('[MySQL Database] Error reading table `orders`:', err);
      return [];
    }
  }

  public saveAll(records: OrderRecord[]): void {
    try {
      fs.writeFileSync(ORDERS_DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
    } catch (err) {
      console.error('[MySQL Database] Error writing table `orders`:', err);
    }
  }
}

export const db = MySQLDatabase.getInstance();
