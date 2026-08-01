import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { CatalogController } from '../controllers/catalogController.js';

const router = Router();

// Ensure uploads/products directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'products');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueName = `product-${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`;
    cb(null, uniqueName);
  }
});

// Multer file filter (JPG, JPEG, PNG, WEBP only)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedTypes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format foto tidak didukung. Format yang diperbolehkan hanya JPG, JPEG, PNG, dan WEBP.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  }
});

// Wrapper middleware to catch Multer errors (e.g. file size exceeded)
const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  const singleUpload = upload.single('photo');
  singleUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'Ukuran foto melebihi batas maksimal 5 MB. Silakan pilih file yang lebih kecil.'
        });
      }
      return res.status(400).json({
        success: false,
        error: `Error upload foto: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'Terjadi kesalahan saat mengupload file.'
      });
    }
    next();
  });
};

/**
 * ============================================================================
 * CATALOG REST API ROUTES (Kategori, Produk, & Foto Upload)
 * ============================================================================
 */

// --- KATEGORI ---
// 1. GET /api/categories -> Public / Admin: Lihat daftar semua kategori + jumlah produk
router.get('/categories', CatalogController.getAllCategories);

// 2. POST /api/categories -> Admin Only: Tambah kategori baru
router.post('/categories', requireAdmin, CatalogController.createCategory);

// 3. PUT /api/categories/:id -> Admin Only: Edit kategori
router.put('/categories/:id', requireAdmin, CatalogController.updateCategory);

// 4. DELETE /api/categories/:id -> Admin Only: Hapus kategori
router.delete('/categories/:id', requireAdmin, CatalogController.deleteCategory);


// --- PRODUK ---
// 5. GET /api/products -> Public / Admin: Lihat daftar produk dinamis dari database
router.get('/products', CatalogController.getAllProducts);

// 6. GET /api/products/:id -> Public / Admin: Lihat detail produk
router.get('/products/:id', CatalogController.getProductById);

// 7. POST /api/products -> Admin Only: Tambah produk baru
router.post('/products', requireAdmin, CatalogController.createProduct);

// 8. PUT /api/products/:id -> Admin Only: Edit produk
router.put('/products/:id', requireAdmin, CatalogController.updateProduct);

// 9. DELETE /api/products/:id -> Admin Only: Hapus produk
router.delete('/products/:id', requireAdmin, CatalogController.deleteProduct);


// --- UPLOAD FOTO PRODUK / ARTIKEL / BUKTI (LOCAL FILE TO SERVER) ---
// 10. POST /api/upload-photo -> Upload foto dari komputer ke server (folder uploads/products)
router.post('/upload-photo', handleUpload, CatalogController.uploadPhoto);

// --- PENGATURAN TOKO & FLASH SALE ---
// 11. GET /api/settings -> Public: Dapatkan pengaturan toko dan Flash Sale
router.get('/settings', CatalogController.getSettings);

// 12. PUT /api/settings -> Admin Only: Update pengaturan toko dan Flash Sale
router.put('/settings', requireAdmin, CatalogController.updateSettings);

export default router;
