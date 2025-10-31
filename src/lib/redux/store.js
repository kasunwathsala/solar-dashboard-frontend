import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../features/uiSlice'
import { setupListeners } from '@reduxjs/toolkit/query';
import { Api } from './query';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [Api.reducerPath]: Api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(Api.middleware),

});
setupListeners(store.dispatch);