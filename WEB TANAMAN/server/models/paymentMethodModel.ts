import fs from 'fs';
import path from 'path';

export interface PaymentMethodRecord {
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

const PAYMENT_METHODS_FILE = path.join(process.cwd(), 'payment_methods_database.json');

const DEFAULT_PAYMENT_METHODS: PaymentMethodRecord[] = [
  // Bank Transfer
  { id: 1, name: 'Bank BCA', type: 'bank', code: 'BCA', account_number: '8830-129-888', account_name: 'Siti Nurbayanti', instructions: 'Transfer ke rekening BCA dan upload bukti transfer.', is_active: true },
  { id: 2, name: 'Bank Mandiri', type: 'bank', code: 'MANDIRI', account_number: '137-00-1928-333', account_name: 'Siti Nurbayanti', instructions: 'Transfer via Livin Mandiri atau ATM Mandiri.', is_active: true },
  { id: 3, name: 'Bank BRI', type: 'bank', code: 'BRI', account_number: '0192-01-002938-50-1', account_name: 'Siti Nurbayanti', instructions: 'Transfer via BRImo atau ATM BRI.', is_active: true },
  { id: 4, name: 'Bank BNI', type: 'bank', code: 'BNI', account_number: '0832-192-334', account_name: 'Siti Nurbayanti', instructions: 'Transfer via BNI Mobile Banking.', is_active: true },
  { id: 5, name: 'Bank BTN', type: 'bank', code: 'BTN', account_number: '0019-01-50-001928-1', account_name: 'Siti Nurbayanti', instructions: 'Transfer via BTN Mobile Banking.', is_active: true },
  { id: 6, name: 'Bank BSI (Syariah)', type: 'bank', code: 'BSI', account_number: '719-2003-881', account_name: 'Siti Nurbayanti', instructions: 'Transfer via BSI Mobile.', is_active: true },
  { id: 7, name: 'Bank CIMB Niaga', type: 'bank', code: 'CIMB', account_number: '8600-1928-3900', account_name: 'Siti Nurbayanti', instructions: 'Transfer via OCTO Mobile CIMB.', is_active: true },
  { id: 8, name: 'Bank Permata', type: 'bank', code: 'PERMATA', account_number: '4109-281-992', account_name: 'Siti Nurbayanti', instructions: 'Transfer via PermataMobile X.', is_active: true },
  { id: 9, name: 'Bank Danamon', type: 'bank', code: 'DANAMON', account_number: '0036-1928-4410', account_name: 'Siti Nurbayanti', instructions: 'Transfer via D-Bank PRO.', is_active: true },
  
  // E-Wallet
  { id: 10, name: 'DANA', type: 'ewallet', code: 'DANA', account_number: '0812-9876-5432', account_name: 'Siti Nurbayanti', instructions: 'Kirim saldo DANA ke nomor terdaftar.', is_active: true },
  { id: 11, name: 'OVO', type: 'ewallet', code: 'OVO', account_number: '0812-9876-5432', account_name: 'Siti Nurbayanti', instructions: 'Transfer OVO Cash ke nomor HP terdaftar.', is_active: true },
  { id: 12, name: 'GoPay', type: 'ewallet', code: 'GOPAY', account_number: '0812-9876-5432', account_name: 'Siti Nurbayanti', instructions: 'Transfer saldo GoPay ke nomor terdaftar.', is_active: true },
  { id: 13, name: 'ShopeePay', type: 'ewallet', code: 'SHOPEEPAY', account_number: '0812-9876-5432', account_name: 'Siti Nurbayanti', instructions: 'Transfer ShopeePay ke nomor HP terdaftar.', is_active: true },
  { id: 14, name: 'LinkAja', type: 'ewallet', code: 'LINKAJA', account_number: '0812-9876-5432', account_name: 'Siti Nurbayanti', instructions: 'Transfer saldo LinkAja ke nomor terdaftar.', is_active: true },
  { id: 15, name: 'QRIS (All Payment)', type: 'qris', code: 'QRIS', account_number: 'ID1029384756102', account_name: 'FLORA PREMIUM RETAIL', instructions: 'Scan Kode QRIS menggunakan aplikasi Bank / E-Wallet pilihan Anda.', is_active: true }
];

export class PaymentMethodModel {
  private static init(): void {
    if (!fs.existsSync(PAYMENT_METHODS_FILE)) {
      fs.writeFileSync(PAYMENT_METHODS_FILE, JSON.stringify(DEFAULT_PAYMENT_METHODS, null, 2), 'utf-8');
    }
  }

  public static getAll(): PaymentMethodRecord[] {
    PaymentMethodModel.init();
    try {
      const data = fs.readFileSync(PAYMENT_METHODS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_PAYMENT_METHODS;
    }
  }

  public static saveAll(methods: PaymentMethodRecord[]): void {
    fs.writeFileSync(PAYMENT_METHODS_FILE, JSON.stringify(methods, null, 2), 'utf-8');
  }

  public static create(item: Omit<PaymentMethodRecord, 'id'>): PaymentMethodRecord {
    const list = PaymentMethodModel.getAll();
    const newId = list.length > 0 ? Math.max(...list.map(m => m.id)) + 1 : 1;
    const newRecord: PaymentMethodRecord = {
      ...item,
      id: newId,
      created_at: new Date().toISOString()
    };
    list.push(newRecord);
    PaymentMethodModel.saveAll(list);
    return newRecord;
  }

  public static update(id: number, data: Partial<PaymentMethodRecord>): PaymentMethodRecord | null {
    const list = PaymentMethodModel.getAll();
    const idx = list.findIndex(m => m.id === id);
    if (idx === -1) return null;

    list[idx] = { ...list[idx], ...data };
    PaymentMethodModel.saveAll(list);
    return list[idx];
  }

  public static delete(id: number): boolean {
    const list = PaymentMethodModel.getAll();
    const idx = list.findIndex(m => m.id === id);
    if (idx === -1) return false;

    list.splice(idx, 1);
    PaymentMethodModel.saveAll(list);
    return true;
  }
}
