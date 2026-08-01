import { db, OrderRecord } from '../db/sqlDatabase.js';
import { CatalogModel } from './catalogModel.js';

export class OrderModel {
  /**
   * INSERT INTO orders ...
   */
  public static createOrder(data: Omit<OrderRecord, 'id' | 'created_at'>): OrderRecord {
    console.log(`[MySQL Database] Executing: INSERT INTO orders (order_code, user_id, recipient_name, total_payment, payment_status, order_status) VALUES ('${data.order_code}', ${data.user_id}, '${data.recipient_name}', ${data.total_payment}, '${data.payment_status}', '${data.order_status}')`);
    
    const orders = db.getAll();
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    
    const newOrder: OrderRecord = {
      ...data,
      id: newId,
      created_at: new Date().toISOString()
    };

    orders.push(newOrder);
    db.saveAll(orders);

    // Auto-reduce product stock in catalog database upon checkout
    if (data.items && data.items.length > 0) {
      data.items.forEach(item => {
        try {
          const products = CatalogModel.getAllProducts();
          const target = products.find(p => p.id === item.product_id);
          if (target) {
            const currentStock = target.stok ?? target.stock ?? 0;
            const newStock = Math.max(0, currentStock - item.quantity);
            CatalogModel.updateProduct(target.id, { stok: newStock, stock: newStock });
            console.log(`[MySQL Database] Stock auto-reduced for product #${target.id} (${target.name}) from ${currentStock} to ${newStock}`);
          }
        } catch (e) {
          console.error('[OrderModel] Failed to deduct stock for item:', item, e);
        }
      });
    }

    console.log(`[MySQL Database] 1 row inserted successfully into table \`orders\`. New Order ID: ${newId}`);
    return newOrder;
  }

  /**
   * SELECT * FROM orders ORDER BY created_at DESC
   */
  public static getAllOrders(): OrderRecord[] {
    console.log('[MySQL Database] Executing: SELECT * FROM orders ORDER BY created_at DESC');
    return db.getAll();
  }

  /**
   * SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
   */
  public static getUserOrders(userId: number): OrderRecord[] {
    console.log(`[MySQL Database] Executing: SELECT * FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC`);
    const orders = db.getAll();
    return orders.filter(o => o.user_id === userId);
  }

  /**
   * SELECT * FROM orders WHERE id = ?
   */
  public static getOrderById(orderId: number): OrderRecord | undefined {
    console.log(`[MySQL Database] Executing: SELECT * FROM orders WHERE id = ${orderId}`);
    const orders = db.getAll();
    return orders.find(o => o.id === orderId);
  }

  /**
   * UPDATE orders SET payment_status = 'paid', order_status = 'processing' WHERE id = ?
   */
  public static verifyPayment(orderId: number): OrderRecord | null {
    console.log(`[MySQL Database] Executing: UPDATE orders SET payment_status = 'paid', order_status = 'processing' WHERE id = ${orderId}`);
    const orders = db.getAll();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    orders[idx] = {
      ...orders[idx],
      payment_status: 'paid',
      order_status: orders[idx].order_status === 'pending' ? 'processing' : orders[idx].order_status
    };

    db.saveAll(orders);
    console.log(`[MySQL Database] Updated row in \`orders\` for ID=${orderId} to payment_status='paid' & order_status='${orders[idx].order_status}'.`);
    return orders[idx];
  }

  /**
   * UPDATE orders SET order_status = ?, tracking_number = ? WHERE id = ?
   */
  public static updateShipping(
    orderId: number,
    orderStatus: OrderRecord['order_status'],
    trackingNumber?: string | null
  ): OrderRecord | null {
    console.log(`[MySQL Database] Executing: UPDATE orders SET order_status = '${orderStatus}', tracking_number = '${trackingNumber || ''}' WHERE id = ${orderId}`);
    const orders = db.getAll();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const prevStatus = orders[idx].order_status;

    // Restore stock if status changes to cancelled
    if (orderStatus === 'cancelled' && prevStatus !== 'cancelled' && orders[idx].items) {
      orders[idx].items?.forEach(item => {
        try {
          const products = CatalogModel.getAllProducts();
          const target = products.find(p => p.id === item.product_id);
          if (target) {
            const currentStock = target.stok ?? target.stock ?? 0;
            const restoredStock = currentStock + item.quantity;
            CatalogModel.updateProduct(target.id, { stok: restoredStock, stock: restoredStock });
            console.log(`[MySQL Database] Stock restored for product #${target.id} (${target.name}) to ${restoredStock}`);
          }
        } catch (e) {
          console.error('[OrderModel] Failed to restore stock for item:', item, e);
        }
      });
    }

    orders[idx] = {
      ...orders[idx],
      order_status: orderStatus,
      payment_status: (orderStatus === 'completed' || orderStatus === 'shipped') ? 'paid' : (orderStatus === 'cancelled' ? 'failed' : orders[idx].payment_status),
      tracking_number: trackingNumber !== undefined ? trackingNumber : orders[idx].tracking_number
    };

    db.saveAll(orders);
    console.log(`[MySQL Database] Updated shipping info in \`orders\` for ID=${orderId}.`);
    return orders[idx];
  }

  /**
   * UPDATE orders SET payment_proof = ? WHERE id = ?
   */
  public static updateProof(orderId: number, proof: string | null): OrderRecord | null {
    console.log(`[MySQL Database] Executing: UPDATE orders SET payment_proof = '...' WHERE id = ${orderId}`);
    const orders = db.getAll();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    orders[idx] = {
      ...orders[idx],
      payment_proof: proof
    };

    db.saveAll(orders);
    console.log(`[MySQL Database] Updated payment_proof in \`orders\` for ID=${orderId}.`);
    return orders[idx];
  }

  /**
   * DELETE FROM orders WHERE id = ?
   */
  public static deleteOrder(orderId: number): boolean {
    console.log(`[MySQL Database] Executing: DELETE FROM orders WHERE id = ${orderId}`);
    const orders = db.getAll();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return false;

    orders.splice(idx, 1);
    db.saveAll(orders);
    console.log(`[MySQL Database] Deleted 1 row from \`orders\` where ID=${orderId}.`);
    return true;
  }
}
