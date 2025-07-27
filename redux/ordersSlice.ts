import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrdersResponse } from '@/lib/apiHelpers/storeProducts';

export interface OrdersState {
  // Orders state
  orders: Order[];
  ordersTotal: number;
  ordersPage: number;
  ordersLimit: number;
  ordersLoading: boolean;
  ordersError: string | null;
}

const initialState: OrdersState = {
  // Orders initial state
  orders: [],
  ordersTotal: 0,
  ordersPage: 1,
  ordersLimit: 10,
  ordersLoading: false,
  ordersError: null,
};

const ordersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Orders actions
    setOrders: (state, action: PayloadAction<OrdersResponse>) => {
      state.orders = action.payload.orders;
      state.ordersTotal = action.payload.total;
      state.ordersPage = action.payload.page;
      state.ordersLimit = action.payload.limit;
      state.ordersError = null;
    },
    setOrdersLoading: (state, action: PayloadAction<boolean>) => {
      state.ordersLoading = action.payload;
    },
    setOrdersError: (state, action: PayloadAction<string | null>) => {
      state.ordersError = action.payload;
      state.ordersLoading = false;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.ordersTotal = 0;
      state.ordersPage = 1;
      state.ordersLimit = 10;
      state.ordersError = null;
    },
  },
});

export const {
  setOrders,
  setOrdersLoading,
  setOrdersError,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
