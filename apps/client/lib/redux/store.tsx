import { configureStore } from '@reduxjs/toolkit';
import { RootState } from '@reduxjs/toolkit/query';
import planReducer from './plan//plan-slice';

export function makeStore() {
  return configureStore({
    reducer: { plan: planReducer },
    middleware: (gDM) => gDM({ serializableCheck: false })
  });
}