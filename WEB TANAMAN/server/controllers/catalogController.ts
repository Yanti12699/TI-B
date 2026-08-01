import { Request, Response } from 'express';
import { CatalogModel } from '../models/catalogModel.js';

/**
 * ============================================================================
 * CATALOG CONTROLLER
 * Handles Categories, Products, and Photo Upload for E-Commerce
 * ============================================================================
 */

export class CatalogController {
  // ==========================================
  // CATEGORIES
  // ==========================================

  public static async getAllCategories(req: Request, res: Response) {
    try {
      const categories = CatalogModel.getAllCategories();
      return res.json({
        success: true,
        categories
      });
    } catch (error) {
      console.error('[CatalogController] Error fetching categories:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal mengambil data kategori dari database.'
      });
    }
  }

  public static async createCategory(req: Request, res: Response) {
    try {
      const { name, nama_kategori, description, deskripsi } = req.body;
      const catName = (nama_kategori || name || '').trim();
      const catDesc = (deskripsi || description || '').trim();

      if (!catName) {
        return res.status(400).json({
          success: false,
          error: 'Nama kategori wajib diisi.'
        });
      }

      const newCat = CatalogModel.createCategory(catName, catDesc);
      const allCategories = CatalogModel.getAllCategories();

      return res.status(201).json({
        success: true,
        message: 'Kategori berhasil ditambahkan ke database.',
        category: newCat,
        categories: allCategories
      });
    } catch (error) {
      console.error('[CatalogController] Error creating category:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal menyimpan kategori baru.'
      });
    }
  }

  public static async updateCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name, nama_kategori, description, deskripsi } = req.body;
      const catName = (nama_kategori || name || '').trim();
      const catDesc = (deskripsi || description || '').trim();

      if (!catName) {
        return res.status(400).json({
          success: false,
          error: 'Nama kategori wajib diisi.'
        });
      }

      const updated = CatalogModel.updateCategory(id, catName, catDesc);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Kategori tidak ditemukan.'
        });
      }

      const allCategories = CatalogModel.getAllCategories();
      return res.json({
        success: true,
        message: 'Kategori berhasil diperbarui di database.',
        category: updated,
        categories: allCategories
      });
    } catch (error) {
      console.error('[CatalogController] Error updating category:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal memperbarui kategori.'
      });
    }
  }

  public static async deleteCategory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = CatalogModel.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Kategori tidak ditemukan atau gagal dihapus.'
        });
      }

      const allCategories = CatalogModel.getAllCategories();
      return res.json({
        success: true,
        message: 'Kategori berhasil dihapus permanen.',
        categories: allCategories
      });
    } catch (error) {
      console.error('[CatalogController] Error deleting category:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal menghapus kategori.'
      });
    }
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  public static async getAllProducts(req: Request, res: Response) {
    try {
      const onlyActive = req.query.status === 'aktif';
      const products = CatalogModel.getAllProducts({ onlyActive });
      return res.json({
        success: true,
        products
      });
    } catch (error) {
      console.error('[CatalogController] Error fetching products:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal mengambil data produk dari database.'
      });
    }
  }

  public static async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const products = CatalogModel.getAllProducts();
      const product = products.find(p => p.id === id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produk tidak ditemukan.'
        });
      }
      return res.json({
        success: true,
        product
      });
    } catch (error) {
      console.error('[CatalogController] Error fetching product detail:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal mengambil detail produk.'
      });
    }
  }

  public static async createProduct(req: Request, res: Response) {
    try {
      const data = req.body;
      const nameVal = (data.nama_produk || data.name || '').trim();
      const priceVal = Number(data.harga ?? data.price ?? 0);

      if (!nameVal || priceVal < 0) {
        return res.status(400).json({
          success: false,
          error: 'Nama produk dan harga wajib diisi dengan valid.'
        });
      }

      const newProduct = CatalogModel.createProduct(data);
      const allProducts = CatalogModel.getAllProducts();

      return res.status(201).json({
        success: true,
        message: 'Produk berhasil ditambahkan dan tersimpan ke database.',
        product: newProduct,
        products: allProducts
      });
    } catch (error) {
      console.error('[CatalogController] Error creating product:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal menyimpan produk baru ke database.'
      });
    }
  }

  public static async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      const updated = CatalogModel.updateProduct(id, data);
      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Produk tidak ditemukan.'
        });
      }

      const allProducts = CatalogModel.getAllProducts();
      return res.json({
        success: true,
        message: 'Data produk berhasil diperbarui di database.',
        product: updated,
        products: allProducts
      });
    } catch (error) {
      console.error('[CatalogController] Error updating product:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal memperbarui data produk.'
      });
    }
  }

  public static async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = CatalogModel.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Produk tidak ditemukan atau gagal dihapus.'
        });
      }

      const allProducts = CatalogModel.getAllProducts();
      return res.json({
        success: true,
        message: 'Produk beserta fotonya berhasil dihapus dari sistem.',
        products: allProducts
      });
    } catch (error) {
      console.error('[CatalogController] Error deleting product:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal menghapus produk.'
      });
    }
  }

  // ==========================================
  // PHOTO UPLOAD
  // ==========================================

  public static async uploadPhoto(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'File gambar tidak ditemukan atau format gambar tidak didukung.'
        });
      }

      const filename = req.file.filename;
      const urlPath = `/uploads/products/${filename}`;

      console.log(`[Upload Service] Product photo saved: ${urlPath}`);

      return res.status(201).json({
        success: true,
        message: 'Foto produk berhasil diupload ke server lokal.',
        filename: filename,
        url: urlPath,
        path: urlPath
      });
    } catch (error) {
      console.error('[CatalogController] Error uploading photo:', error);
      return res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan saat mengupload foto ke server.'
      });
    }
  }

  // ==========================================
  // SETTINGS
  // ==========================================

  public static async getSettings(req: Request, res: Response) {
    try {
      const settings = CatalogModel.getSettings();
      return res.json({
        success: true,
        settings
      });
    } catch (error) {
      console.error('[CatalogController] Error fetching settings:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal mengambil data pengaturan toko.'
      });
    }
  }

  public static async updateSettings(req: Request, res: Response) {
    try {
      const data = req.body;
      const updated = CatalogModel.updateSettings(data);
      return res.json({
        success: true,
        message: 'Pengaturan toko berhasil diperbarui di database.',
        settings: updated
      });
    } catch (error) {
      console.error('[CatalogController] Error updating settings:', error);
      return res.status(500).json({
        success: false,
        error: 'Gagal memperbarui pengaturan toko.'
      });
    }
  }
}
