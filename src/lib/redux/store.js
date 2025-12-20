import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../features/uiSlice'
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './query';
import { anomalyApi } from '../api/anomaly.api';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
    [anomalyApi.reducerPath]: anomalyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(anomalyApi.middleware),

});
setupListeners(store.dispatch);