import { configureStore } from '@reduxjs/toolkit';
import planReducer from './plan/plan-slice';

export function makeStore() {
  return configureStore({
    reducer: { plan: planReducer },
    middleware: (gDM) => gDM({ serializableCheck: false }),
  });
}
