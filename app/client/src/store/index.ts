import { configureStore } from '@reduxjs/toolkit';
import apiService from './services';
const store = configureStore({
  reducer: {
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});
export default store;