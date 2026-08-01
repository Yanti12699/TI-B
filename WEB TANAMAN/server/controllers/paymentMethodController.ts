import { Request, Response } from 'express';
import { PaymentMethodModel } from '../models/paymentMethodModel.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class PaymentMethodController {
  public static getAll(req: Request, res: Response) {
    try {
      const methods = PaymentMethodModel.getAll();
      return res.json({ success: true, data: methods });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Gagal mengambil daftar metode pembayaran.' });
    }
  }

  public static create(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, type, code, account_number, account_name, instructions, is_active } = req.body;
      if (!name || !account_number) {
        return res.status(400).json({ success: false, error: 'Nama dan nomor akun/rekening wajib diisi.' });
      }

      const created = PaymentMethodModel.create({
        name,
        type: type || 'bank',
        code: code || name.toUpperCase().replace(/\s+/g, '_'),
        account_number,
        account_name: account_name || 'Flora Store',
        instructions: instructions || '',
        is_active: is_active !== undefined ? is_active : true
      });

      return res.status(201).json({ success: true, data: created, message: 'Metode pembayaran berhasil ditambahkan.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Gagal menambahkan metode pembayaran.' });
    }
  }

  public static update(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = PaymentMethodModel.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Metode pembayaran tidak ditemukan.' });
      }
      return res.json({ success: true, data: updated, message: 'Metode pembayaran berhasil diperbarui.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Gagal memperbarui metode pembayaran.' });
    }
  }

  public static delete(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = PaymentMethodModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Metode pembayaran tidak ditemukan.' });
      }
      return res.json({ success: true, message: 'Metode pembayaran berhasil dihapus.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: 'Gagal menghapus metode pembayaran.' });
    }
  }
}
