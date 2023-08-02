import { configureStore } from "@reduxjs/toolkit";
import burgerSlice from "./burger";
import { ingredientsApi } from "./api/ingredientsApi";
import {
  authReducer,
  getPreloadedAuthState,
} from "./auth";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { ordersApi } from "./api/orders";
import { authListenerMiddleware } from "./authListener";

export const store = configureStore({
  preloadedState: {
    auth: getPreloadedAuthState(),
  },
  reducer: {
    burger: burgerSlice,
    auth: authReducer,
    [ingredientsApi.reducerPath]: ingredientsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },

  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    ingredientsApi.middleware,
    authApi.middleware,
    userApi.middleware,
    authListenerMiddleware.middleware,
    ordersApi.middleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
