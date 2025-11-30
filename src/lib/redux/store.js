import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../features/uiSlice'
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './query';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),

});
setupListeners(store.dispatch);