import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import modalReducer from "./modalSlice";
import checkoutReducer from "./checkoutSlice";
import odometerReducer from "./odometerSlice";
import storeProductsReducer from "./storeProductsSlice";
import adminStoreReducer from "./adminStoreSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "admin"], // Persist both user and admin slices
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  modal: modalReducer,
  checkout: checkoutReducer,
  odometer: odometerReducer,
  storeProducts: storeProductsReducer,
  adminStore: adminStoreReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
