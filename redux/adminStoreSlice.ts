import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsResponse } from '@/lib/apiHelpers/adminStore';

export interface AdminStoreState {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  showDeleteModal: boolean;
  selectedProductIdForDelete: string | null;
}

const initialState: AdminStoreState = {
  products: [],
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  error: null,
  showDeleteModal: false,
  selectedProductIdForDelete: null,
};

const adminStoreSlice = createSlice({
  name: 'adminStore',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductsResponse>) => {
      state.products = action.payload.products;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearProducts: (state) => {
      state.products = [];
      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.error = null;
    },
    // Delete Modal
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.showDeleteModal = true;
      state.selectedProductIdForDelete = action.payload;
    },
    closeDeleteModal: (state) => {
      state.showDeleteModal = false;
      state.selectedProductIdForDelete = null;
    },
  },
});

export const {
  setProducts,
  setLoading,
  setError,
  clearProducts,
  openDeleteModal,
  closeDeleteModal,
} = adminStoreSlice.actions;

export default adminStoreSlice.reducer; 