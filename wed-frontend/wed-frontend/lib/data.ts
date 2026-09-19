// lib/data.ts
// Fonctions de lecture "server-only", utilisées par les Server Components (SEO + ISR).

import { serverFetch } from "./server-api";
import type {
  Product,
  Category,
  Wilaya,
  Order,
  DashboardStats,
  Review,
  User,
  DeliveryPrice,
} from "./types";

// --- Public (revalidation 60s : catalogue) ---

export function getProducts(params: { category_id?: number } = {}) {
  const qs = params.category_id ? `?category_id=${params.category_id}` : "";
  return serverFetch<Product[]>(`/products${qs}`, { revalidate: 60 });
}

export function getProductById(id: number | string) {
  return serverFetch<Product>(`/products/${id}`, { revalidate: 60 });
}

export function getCategories() {
  return serverFetch<Category[]>(`/products/categories`, { revalidate: 300 });
}

export function getWilayas() {
  return serverFetch<Wilaya[]>(`/wilayas`, { revalidate: 3600 });
}

export function getProductReviews(productId: number | string) {
  return serverFetch<Review[]>(`/reviews/product/${productId}`, { revalidate: 60 });
}

// --- Admin (aucun cache : données sensibles / changeantes) ---

export function getAdminProducts() {
  return serverFetch<Product[]>(`/admin/products?include_inactive=true`, { withAuth: true, revalidate: false });
}

export function getAdminProduct(id: number | string) {
  return serverFetch<Product>(`/admin/products/${id}`, { withAuth: true, revalidate: false });
}

export function getAdminOrders() {
  return serverFetch<Order[]>(`/admin/orders`, { withAuth: true, revalidate: false });
}

export function getAdminOrder(id: number | string) {
  return serverFetch<Order>(`/admin/orders/${id}`, { withAuth: true, revalidate: false });
}

export function getDashboardStats() {
  return serverFetch<DashboardStats>(`/admin/dashboard/stats`, { withAuth: true, revalidate: false });
}

export function getAdminUsers() {
  return serverFetch<User[]>(`/admin/users`, { withAuth: true, revalidate: false });
}

export function getAdminUser(id: number | string) {
  return serverFetch<User>(`/admin/users/${id}`, { withAuth: true, revalidate: false });
}

export function getAdminCategories() {
  return serverFetch<Category[]>(`/admin/products/categories`, { withAuth: true, revalidate: false });
}

export async function getAdminArchivedCategories() {
  const categories = await serverFetch<Category[]>(
    `/admin/products/categories?include_inactive=true`,
    {
      withAuth: true,
      revalidate: false,
    }
  );

  return categories.filter((category) => !category.is_active);
}
export function getAdminReviews() {
  return serverFetch<Review[]>(`/reviews/admin/all`, { withAuth: true, revalidate: false });
}
export function getAdminDeliveryPrices() {
  return serverFetch<DeliveryPrice[]>(
    `/admin/delivery-prices/`,
    {
      withAuth: true,
      revalidate: false,
    }
  );
}
export function getDeliveryPrice(wilaya: string) {
  return serverFetch<DeliveryPrice>(
    `/delivery-prices/${encodeURIComponent(wilaya)}`,
    {
      revalidate: false,
    }
  );
}