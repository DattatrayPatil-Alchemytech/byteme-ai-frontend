import { apiGet, apiPost, apiPut, apiDelete } from "./apiMiddleware";

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
  price: number;
  originalPrice: number | null;
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

export interface CreateProductRequest {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  imageUrl?: string;
  images?: string[];
  specifications?: Record<string, string | number | boolean>;
  tags?: string[];
  discountInfo?: Record<string, string | number | boolean>;
  isEcoFriendly?: boolean;
  ecoDescription?: string;
  shippingInfo?: Record<string, string | number | boolean>;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
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

export interface CreateProductResponse {
  message: string;
  product: Product;
}

export interface UpdateProductResponse {
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  message: string;
  productId: string;
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
  user: {
    id: string;
    username: string;
    email: string;
    walletAddress: string | null;
    walletType: string | null;
    nonce: string | null;
    emailOtp: string | null;
    lastLogin: string | null;
    isActive: boolean;
    isVerified: boolean;
    profileImageUrl: string | null;
    totalMileage: string;
    totalCarbonSaved: string;
    totalPoints: number;
    currentTier: string;
    b3trBalance: string;
    createdAt: string;
    updatedAt: string;
  };
  userId: string;
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: string;
    originalPrice: string | null;
    stockQuantity: number;
    status: string;
    imageUrl: string | null;
    images: string[] | null;
    specifications: Record<string, unknown> | null;
    tags: string[] | null;
    soldCount: number;
    viewCount: number;
    rating: string;
    reviewCount: number;
    discountInfo: Record<string, unknown> | null;
    isEcoFriendly: boolean;
    ecoDescription: string | null;
    shippingInfo: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
  };
  productId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  discountAmount: number | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress | null;
  trackingNumber?: string | null;
  trackingInfo?: Record<string, unknown> | null;
  notes?: string | null;
  customerNotes?: string | null;
  metadata?: Record<string, unknown> | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  cancellationReason?: string | null;
  refundedAt?: string | null;
  refundAmount?: number | null;
  refundReason?: string | null;
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

// Create new product (Admin)
export const createProduct = async (
  productData: CreateProductRequest
): Promise<CreateProductResponse> => {
  return apiPost<CreateProductResponse>('/admin/store/products', productData, {
    requireAuth: true,
    showToast: true,
    isAdmin: true,
  });
};

// Update product (Admin)
export const updateProduct = async (
  productId: string,
  productData: Partial<CreateProductRequest>
): Promise<UpdateProductResponse> => {
  return apiPut<UpdateProductResponse>(`/admin/store/products/${productId}`, productData, {
    requireAuth: true,
    showToast: true,
    isAdmin: true,
  });
};

// Delete product (Admin)
export const deleteProduct = async (
  productId: string
): Promise<DeleteProductResponse> => {
  return apiDelete<DeleteProductResponse>(`/admin/store/products/${productId}`, {
    requireAuth: true,
    showToast: true,
    isAdmin: true,
  });
};

// Get all products (Admin)
export const getAllProducts = async (
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
    isAdmin: true,
  });
};

// Get all orders
export const getAllOrders = async (
  page: number = 1,
  limit: number = 20,
  status?: Order['status']
): Promise<OrdersResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append('status', status);
  }

  return apiGet<OrdersResponse>(`/admin/store/orders?${params.toString()}`, {
    requireAuth: true,
    showToast: false,
    isAdmin: true,
  });
};

// Get order by ID
export const getOrderById = async (
  orderId: string
): Promise<OrderResponse> => {
  return apiGet<OrderResponse>(`admin/store/orders/${orderId}`, {
    requireAuth: true,
    showToast: false,
    isAdmin: true,
  });
};

// Update order status (Admin)
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<{ message: string; order: Order }> => {
  return apiPut<{ message: string; order: Order }>(`/admin/store/orders/${orderId}/status`, { status }, {
    requireAuth: true,
    showToast: false,
    isAdmin: true,
  });
};

 