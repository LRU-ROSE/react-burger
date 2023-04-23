import { configureStore } from '@reduxjs/toolkit';
import burgetSlice from './burger';
import { spaceBurgerApi } from './api';

export const store = configureStore({
  reducer: {
    burger: burgetSlice,
    [spaceBurgerApi.reducerPath]: spaceBurgerApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spaceBurgerApi.middleware),
});
