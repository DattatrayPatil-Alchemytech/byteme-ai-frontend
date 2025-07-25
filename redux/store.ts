import { configureStore } from "@reduxjs/toolkit";

// Dummy reducer as a placeholder
const dummyReducer = (state = {}, action: any) => state;

export const store = configureStore({
  reducer: {
    dummy: dummyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 