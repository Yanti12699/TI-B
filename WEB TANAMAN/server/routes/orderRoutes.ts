import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { OrderController } from '../controllers/orderController.js';
import { PaymentMethodController } from '../controllers/paymentMethodController.js';

const router = Router();

/**
 * ============================================================================
 * ORDERS REST API ROUTES (MySQL integrated)
 * ============================================================================
 */

// 1. POST /api/orders -> User Checkout (create order)
router.post('/orders', requireAuth, OrderController.createOrder);

// 2. GET /api/orders -> Admin: Lihat semua pesanan
router.get('/orders', requireAdmin, OrderController.getAllOrders);

// 3. GET /api/orders/user/:id -> User: Lihat pesanan miliknya sendiri
router.get('/orders/user/:id', requireAuth, OrderController.getUserOrders);

// 4. PUT /api/orders/:id/verify-payment -> Admin: Verifikasi lunas
router.put('/orders/:id/verify-payment', requireAdmin, OrderController.verifyPayment);

// 5. PUT /api/orders/:id/shipping -> User/Admin: Update status pengiriman & resi (User konfirmasi terima barang)
router.put('/orders/:id/shipping', requireAuth, OrderController.updateShipping);

// 6. PUT /api/orders/:id/proof -> User/Admin: Update bukti pembayaran
router.put('/orders/:id/proof', requireAuth, OrderController.updateProof);

// 7. DELETE /api/orders/:id -> Admin Only: Hapus pesanan permanen
router.delete('/orders/:id', requireAdmin, OrderController.deleteOrder);

/**
 * ============================================================================
 * PAYMENT METHODS ROUTES (Kelola Metode Pembayaran Bank & E-Wallet)
 * ============================================================================
 */
router.get('/payment-methods', PaymentMethodController.getAll);
router.post('/payment-methods', requireAdmin, PaymentMethodController.create);
router.put('/payment-methods/:id', requireAdmin, PaymentMethodController.update);
router.delete('/payment-methods/:id', requireAdmin, PaymentMethodController.delete);

export default router;
