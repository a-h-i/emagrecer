import { configureStore } from '@reduxjs/toolkit';
import planReducer from './plan/plan-slice';
import { apiSlice } from '@/lib/redux/api/api-slice';
import { setupListeners } from '@reduxjs/toolkit/query';

export function makeStore() {
  const store = configureStore({
    reducer: {
      plan: planReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (gDM) => {
      return gDM({ serializableCheck: false }).concat(apiSlice.middleware);
    },
  });
  setupListeners(store.dispatch);
  return store;
}
