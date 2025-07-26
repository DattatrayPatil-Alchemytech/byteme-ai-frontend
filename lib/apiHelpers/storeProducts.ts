import { apiGet, apiPost, apiPut } from "./apiMiddleware";

// Types for API responses
export type ProductCategory = 'electronics' | 'clothing' | 'home' | 'sports' | 'books' | 'other';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'electronics',
  'clothing',
  'home',
  'sports',
  'books',
  'other',
];

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  originalPrice: string | null;
  stockQuantity: number;
  status: 'active' | 'inactive';
  imageUrl: string | null;
  images: string[] | null;
  specifications: Record<string, string | number | boolean> | null;
  tags: string[] | null;
  soldCount: number;
  viewCount: number;
  rating: string;
  reviewCount: number;
  discountInfo: Record<string, string | number | boolean> | null;
  isEcoFriendly: boolean;
  ecoDescription: string | null;
  shippingInfo: Record<string, string | number | boolean> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductResponse {
  product: Product;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderRequest {
  productId: string;
  quantity: number;
  shippingAddress?: ShippingAddress;
  customerNotes?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: ShippingAddress;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderResponse {
  order: Order;
}

export interface CancelOrderResponse {
  message: string;
  orderId: string;
  status: string;
}

// Get all products
export const getProducts = async (
  page: number = 1,
  limit: number = 20,
  category?: ProductCategory,
  search?: string,
  minPrice?: number,
  maxPrice?: number,
  ecoFriendly?: boolean
): Promise<ProductsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (category) {
    params.append('category', category);
  }
  
  if (search) {
    params.append('search', search);
  }
  
  if (minPrice !== undefined) {
    params.append('minPrice', minPrice.toString());
  }
  
  if (maxPrice !== undefined) {
    params.append('maxPrice', maxPrice.toString());
  }
  
  if (ecoFriendly !== undefined) {
    params.append('ecoFriendly', ecoFriendly.toString());
  }

  return apiGet<ProductsResponse>(`/store/products?${params.toString()}`, {
    requireAuth: false,
    showToast: false,
  });
};

// Get product by ID
export const getProductById = async (
  productId: string
): Promise<ProductResponse> => {
  return apiGet<ProductResponse>(`/store/products/${productId}`, {
    requireAuth: false,
    showToast: false,
  });
};

// Create new order
export const createOrder = async (
  orderData: CreateOrderRequest
): Promise<OrderResponse> => {
  return apiPost<OrderResponse>('/store/orders', orderData, {
    requireAuth: true,
    showToast: false,
  });
};

// Get all orders (for authenticated user)
export const getOrders = async (
  page: number = 1,
  limit: number = 10
): Promise<OrdersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiGet<OrdersResponse>(`/store/orders?${params.toString()}`, {
    requireAuth: true,
    showToast: false,
  });
};

// Get order by ID
export const getOrderById = async (
  orderId: string
): Promise<OrderResponse> => {
  return apiGet<OrderResponse>(`/store/orders/${orderId}`, {
    requireAuth: true,
    showToast: false,
  });
};

// Cancel order
export const cancelOrder = async (
  orderId: string
): Promise<CancelOrderResponse> => {
  return apiPut<CancelOrderResponse>(`/store/orders/${orderId}/cancel`, {}, {
    requireAuth: true,
    showToast: true,
  });
};

 