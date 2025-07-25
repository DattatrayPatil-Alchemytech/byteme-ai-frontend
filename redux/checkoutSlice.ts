import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  ecoImpact: string;
  features: string[];
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  specialInstructions: string;
}

interface Order {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

interface CheckoutState {
  cart: CartItem[];
  shippingInfo: ShippingInfo;
  currentOrder: Order | null;
  isProcessing: boolean;
  error: string | null;
}

const initialState: CheckoutState = {
  cart: [],
  shippingInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    specialInstructions: '',
  },
  currentOrder: null,
  isProcessing: false,
  error: null,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // Cart actions
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.product.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter(item => item.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    
    clearCart: (state) => {
      state.cart = [];
    },
    
    // Shipping info actions
    updateShippingInfo: (state, action: PayloadAction<Partial<ShippingInfo>>) => {
      state.shippingInfo = { ...state.shippingInfo, ...action.payload };
    },
    
    // Order processing actions
    startOrderProcessing: (state) => {
      state.isProcessing = true;
      state.error = null;
    },
    
    orderProcessingSuccess: (state, action: PayloadAction<Order>) => {
      state.isProcessing = false;
      state.currentOrder = action.payload;
      state.cart = []; // Clear cart after successful order
      state.error = null;
    },
    
    orderProcessingFailure: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.error = action.payload;
    },
    
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  updateShippingInfo,
  startOrderProcessing,
  orderProcessingSuccess,
  orderProcessingFailure,
  clearCurrentOrder,
  clearError,
} = checkoutSlice.actions;

// Selectors
export const selectCart = (state: { checkout: CheckoutState }) => state.checkout.cart;
export const selectCartTotal = (state: { checkout: CheckoutState }) => 
  state.checkout.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
export const selectCartItemCount = (state: { checkout: CheckoutState }) => 
  state.checkout.cart.reduce((count, item) => count + item.quantity, 0);
export const selectShippingInfo = (state: { checkout: CheckoutState }) => state.checkout.shippingInfo;
export const selectCurrentOrder = (state: { checkout: CheckoutState }) => state.checkout.currentOrder;
export const selectIsProcessing = (state: { checkout: CheckoutState }) => state.checkout.isProcessing;
export const selectError = (state: { checkout: CheckoutState }) => state.checkout.error;

export default checkoutSlice.reducer; 