import { makeStore } from '@/lib/redux/store';

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
export type AppStore = ReturnType<typeof makeStore>;
