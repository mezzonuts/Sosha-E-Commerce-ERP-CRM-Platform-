export interface Product {
  id: number;
  sku: string;
  name: string;
  category_id: number | null;
  price: number;
  stock: number;
  weight: number;
  image: string | null;
  status: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  user_id: number;
  name: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  qty: number;
  price: number;
  product?: Product;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
