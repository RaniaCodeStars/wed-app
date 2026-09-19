// lib/types.ts
// Miroir exact des schémas Pydantic du backend (backend/app/schemas/schemas.py)

export interface Category {
  id: number;
  name: string;
  slug?: string | null;
  is_active: boolean;
}

export interface ProductStatistic {
  id: number;
  product_id: number;
  views_count: number;
  sales_count: number;
  total_revenue: number;
  conversion_rate: number;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  stock: number;
  image_principale?: string | null;
  images?: string[] | null;
  sizes?: string | null; // "S,M,L,XL"
  colors?: string | null; // "Noir,Rouge,Beige"
  badge?: string | null;
  is_active: boolean;
  is_available: boolean;
  created_at: string;
  category?: Category | null;
  statistics?: ProductStatistic | null;
}

export interface Wilaya {
  code: string;
  name_fr: string;
  name_ar: string;
}

export interface SizeGroup {
  id: number;
  name: string;
  sizes_list: string;
}

export type DeliveryType = "domicile" | "bureau";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "returned" | "cancelled";

export interface OrderItemInput {
  product_id: number;
  quantity: number;
  selected_size?: string | null;
  selected_color?: string | null;
}

export interface OrderCreatePayload {
  customer_name: string;
  phone: string;
  wilaya: string;
  commune: string;
  delivery_type: DeliveryType;
  address?: string | null;
  office_name?: string | null;
  items: OrderItemInput[];
}

export interface OrderItemResponse {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  selected_size?: string | null;
  selected_color?: string | null;
  product?: Product | null;
}

export interface Order {
  id: number;
  user_id?: number | null;
  status: OrderStatus;
  total_price: number;
  created_at: string;
  customer_name: string;
  phone: string;
  wilaya: string;
  commune: string;
  delivery_type: DeliveryType;
  address?: string | null;
  office_name?: string | null;
  payment_method: string;
  items: OrderItemResponse[];
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  role?: string | null;
  phone?: string | null;
  wilaya?: string | null;
  address?: string | null;
  badge?: string | null;
  internal_notes?: string | null;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  customer_name: string;
  rating: number;
  text: string;
  status: "pending" | "approved";
  created_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  orders_today: number;
  pending_orders: number;
  total_orders: number;
  top_products: { product_id: number; title: string; sales_count: number; total_revenue: number }[];
}

export interface ApiError {
  detail: string | { msg: string; loc: string[] }[];
}

export interface LandingContent {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  announcement_bar: string;
}

export interface DeliveryPrice {
  id: number;
  wilaya: string;
  home_price: number;
  office_price: number;
}