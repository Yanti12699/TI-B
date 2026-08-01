import axios from 'axios';
import { Category, Product, Settings } from '../types/store';

// Set header interceptor for session
axios.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('flora_session_id');
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }
  return config;
});

/**
 * ============================================================================
 * CATALOG API SERVICE (MySQL Integrated backend via Express REST API)
 * Handles Categories, Products, and Local File Photo Uploads
 * ============================================================================
 */

// 1. Fetch all categories dynamically from database
export async function fetchCategoriesApi(): Promise<Category[]> {
  try {
    const res = await axios.get('/api/categories');
    return res.data.categories || [];
  } catch (error) {
    console.error('Error fetching categories from database:', error);
    return [];
  }
}

// 2. Create new category (Admin only)
export async function createCategoryApi(name: string, description?: string): Promise<{
  success: boolean;
  category?: Category;
  categories: Category[];
}> {
  const res = await axios.post('/api/categories', { name, description });
  return res.data;
}

// 10. Fetch store settings and Flash Sale configuration
export async function fetchSettingsApi(): Promise<Settings | null> {
  try {
    const res = await axios.get('/api/settings');
    return res.data.settings || null;
  } catch (error) {
    console.error('Error fetching settings from database:', error);
    return null;
  }
}

// 11. Update store settings and Flash Sale configuration (Admin only)
export async function updateSettingsApi(data: Partial<Settings>): Promise<{
  success: boolean;
  settings: Settings;
}> {
  const res = await axios.put('/api/settings', data);
  return res.data;
}

// 3. Update category (Admin only)
export async function updateCategoryApi(
  id: number,
  name: string,
  description?: string
): Promise<{
  success: boolean;
  category?: Category;
  categories: Category[];
}> {
  const res = await axios.put(`/api/categories/${id}`, { name, description });
  return res.data;
}

// 4. Delete category (Admin only)
export async function deleteCategoryApi(id: number): Promise<{
  success: boolean;
  categories: Category[];
}> {
  const res = await axios.delete(`/api/categories/${id}`);
  return res.data;
}

// 5. Fetch all products dynamically from database
export async function fetchProductsApi(onlyActive?: boolean): Promise<Product[]> {
  try {
    const url = onlyActive ? '/api/products?status=aktif' : '/api/products';
    const res = await axios.get(url);
    return res.data.products || [];
  } catch (error) {
    console.error('Error fetching products from database:', error);
    return [];
  }
}

// 6. Create new product (Admin only)
export async function createProductApi(data: Partial<Product>): Promise<{
  success: boolean;
  product?: Product;
  products: Product[];
}> {
  const res = await axios.post('/api/products', data);
  return res.data;
}

// 7. Update existing product (Admin only)
export async function updateProductApi(id: number, data: Partial<Product>): Promise<{
  success: boolean;
  product?: Product;
  products: Product[];
}> {
  const res = await axios.put(`/api/products/${id}`, data);
  return res.data;
}

// 8. Delete product (Admin only)
export async function deleteProductApi(id: number): Promise<{
  success: boolean;
  products: Product[];
}> {
  const res = await axios.delete(`/api/products/${id}`);
  return res.data;
}

// 9. Upload Product Photo from local file (Admin only)
export async function uploadProductPhotoApi(file: File): Promise<{
  success: boolean;
  url: string;
  filename: string;
  path: string;
}> {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await axios.post('/api/upload-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return res.data;
}
