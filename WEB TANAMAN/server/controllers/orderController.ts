import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { OrderModel } from '../models/orderModel.js';

export class OrderController {
  /**
   * POST /api/orders
   * Checkout - Create a new order in MySQL database
   */
  public static async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, error: 'User belum terautentikasi.' });
      }

      const {
        order_code,
        recipient_name,
        recipient_phone,
        shipping_address,
        shipping_city,
        courier,
        shipping_cost,
        discount_amount,
        subtotal,
        total_payment,
        payment_method,
        payment_proof,
        items
      } = req.body;

      if (!recipient_name || !recipient_phone || !shipping_address || total_payment === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: 'Data pengiriman tidak lengkap. Mohon periksa kembali formulir Anda.' 
        });
      }

      const createdOrder = OrderModel.createOrder({
        order_code: order_code || 'INV' + Date.now(),
        user_id: user.id,
        recipient_name,
        recipient_phone,
        shipping_address,
        shipping_city: shipping_city || '-',
        courier: courier || '-',
        shipping_cost: Number(shipping_cost) || 0,
        discount_amount: Number(discount_amount) || 0,
        subtotal: Number(subtotal) || 0,
        total_payment: Number(total_payment),
        payment_method: payment_method || 'Transfer Bank',
        payment_status: 'pending',
        payment_proof: payment_proof || null,
        order_status: 'pending',
        tracking_number: null,
        items: items || []
      });

      return res.status(201).json({
        success: true,
        message: 'Pesanan berhasil disimpulkan dan disimpan permanen di database MySQL.',
        order: createdOrder
      });
    } catch (error: any) {
      console.error('[OrderController] Error createOrder:', error);
      return res.status(500).json({ success: false, error: 'Terjadi kesalahan saat menyimpan pesanan ke database.' });
    }
  }

  /**
   * GET /api/orders
   * Admin: Get all orders
   */
  public static async getAllOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = OrderModel.getAllOrders();
      return res.json({
        success: true,
        data: orders
      });
    } catch (error: any) {
      console.error('[OrderController] Error getAllOrders:', error);
      return res.status(500).json({ success: false, error: 'Gagal mengambil daftar pesanan dari database MySQL.' });
    }
  }

  /**
   * GET /api/orders/user/:id
   * User: Get orders for specific user (User only can view their own orders)
   */
  public static async getUserOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const targetUserId = Number(req.params.id);
      const currentUser = req.user;

      if (!currentUser) {
        return res.status(401).json({ success: false, error: 'Sesi tidak valid.' });
      }

      // Authorize: Admin can view any, user can only view their own id
      if (currentUser.role !== 'admin' && currentUser.id !== targetUserId) {
        return res.status(403).json({
          success: false,
          error: 'Akses ditolak! Anda hanya dapat melihat riwayat pesanan akun Anda sendiri.'
        });
      }

      const orders = OrderModel.getUserOrders(targetUserId);
      return res.json({
        success: true,
        data: orders
      });
    } catch (error: any) {
      console.error('[OrderController] Error getUserOrders:', error);
      return res.status(500).json({ success: false, error: 'Gagal mengambil riwayat pesanan dari database.' });
    }
  }

  /**
   * PUT /api/orders/:id/verify-payment
   * Admin: Verify payment as paid
   */
  public static async verifyPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const updated = OrderModel.verifyPayment(orderId);

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan di database.' });
      }

      return res.json({
        success: true,
        message: `Pembayaran untuk pesanan #${updated.order_code} berhasil diverifikasi LUNAS.`,
        order: updated
      });
    } catch (error: any) {
      console.error('[OrderController] Error verifyPayment:', error);
      return res.status(500).json({ success: false, error: 'Gagal memverifikasi pembayaran pesanan.' });
    }
  }

  /**
   * PUT /api/orders/:id/shipping
   * Admin: Update shipping status and tracking number
   */
  public static async updateShipping(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const { order_status, tracking_number } = req.body;

      if (!order_status) {
        return res.status(400).json({ success: false, error: 'Status pengiriman (order_status) wajib diisi.' });
      }

      const updated = OrderModel.updateShipping(orderId, order_status, tracking_number);

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan di database.' });
      }

      return res.json({
        success: true,
        message: `Status pengiriman untuk pesanan #${updated.order_code} berhasil diperbarui menjadi ${order_status}.`,
        order: updated
      });
    } catch (error: any) {
      console.error('[OrderController] Error updateShipping:', error);
      return res.status(500).json({ success: false, error: 'Gagal memperbarui status pengiriman.' });
    }
  }

  /**
   * PUT /api/orders/:id/proof
   * User/Admin: Upload or update payment proof
   */
  public static async updateProof(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const { payment_proof } = req.body;

      const updated = OrderModel.updateProof(orderId, payment_proof || null);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan di database.' });
      }

      return res.json({
        success: true,
        message: 'Bukti transfer berhasil diperbarui di database.',
        order: updated
      });
    } catch (error: any) {
      console.error('[OrderController] Error updateProof:', error);
      return res.status(500).json({ success: false, error: 'Gagal memperbarui bukti transfer.' });
    }
  }

  /**
   * DELETE /api/orders/:id
   * Admin only: Permanently delete an order from MySQL database
   */
  public static async deleteOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const deleted = OrderModel.deleteOrder(orderId);

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan di database.' });
      }

      return res.json({
        success: true,
        message: 'Pesanan telah berhasil dihapus permanen dari database MySQL.'
      });
    } catch (error: any) {
      console.error('[OrderController] Error deleteOrder:', error);
      return res.status(500).json({ success: false, error: 'Gagal menghapus pesanan dari database.' });
    }
  }
}
