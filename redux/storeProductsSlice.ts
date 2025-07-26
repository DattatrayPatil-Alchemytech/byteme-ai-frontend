import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsResponse } from '@/lib/apiHelpers/storeProducts';

export interface StoreProductsState {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  // Modal state
  showProductModal: boolean;
  selectedProductId: string | null;
}

const initialState: StoreProductsState = {
  products: [],
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  error: null,
  showProductModal: false,
  selectedProductId: null,
};

const storeProductsSlice = createSlice({
  name: 'storeProducts',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductsResponse>) => {
      state.products = action.payload.products;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // Modal actions
    openProductModal: (state, action: PayloadAction<string>) => {
      state.showProductModal = true;
      state.selectedProductId = action.payload;
    },
    closeProductModal: (state) => {
      state.showProductModal = false;
      state.selectedProductId = null;
    },
  },
});

export const {
  setProducts,
  setLoading,
  setError,
  openProductModal,
  closeProductModal,
} = storeProductsSlice.actions;

export default storeProductsSlice.reducer; 