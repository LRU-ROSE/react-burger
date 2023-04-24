import { configureStore } from '@reduxjs/toolkit';
import burgetSlice from './burger';
import { spaceBurgerApi } from './api';

export const store = configureStore({
  reducer: {
    burger: burgetSlice,
    [spaceBurgerApi.reducerPath]: spaceBurgerApi.reducer,
  },

  devtools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spaceBurgerApi.middleware),
});
