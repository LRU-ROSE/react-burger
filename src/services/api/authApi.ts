import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './baseQuery';
import { endPasswordReset, login, logout, startPasswordReset } from "../auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string, refreshToken: string }, { email: string, password: string}>({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { email, password },
      }),
      transformResponse: (response) => {
        return {
          accessToken: response.accessToken.split(' ')[1],
          refreshToken: response.refreshToken,
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const loginData = await queryFulfilled;
          dispatch(login(loginData.data));
        } catch {}
      },
    }),
    logout: builder.mutation<null, void>({
      queryFn: async (_arg, api, extraOptions, fetchWithBQ) => {
        // Используется `as any` потому что `as RootState` вызывает ошибку
        // `Type alias 'RootState' circularly references itself`
        const { auth: { refreshToken } } = api.getState() as any;
        if (!refreshToken) {
          return { data: null };
        }
        return await fetchWithBQ({
          url: "auth/logout",
          method: "POST",
          body: { token: refreshToken },
        });
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {}
      },
    }),
    register: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "auth/register",
        method: "POST",
        body: { name, email, password },
      }),
      transformResponse: (response) => {
        return {
          accessToken: response.accessToken.split(' ')[1],
          refreshToken: response.refreshToken,
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const loginData = await queryFulfilled;
          dispatch(login(loginData.data));
      } catch {}
      },
    }),
    startResetPassword: builder.mutation({
      query: ({ email }) => ({
        url: "password-reset",
        method: "POST",
        body: { email },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(startPasswordReset());
        } catch {}
      },
    }),
    endResetPassword: builder.mutation({
      query: ({ password, token }) => ({
        url: "password-reset/reset",
        method: "POST",
        body: { password, token },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(endPasswordReset());
        } catch {}
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useStartResetPasswordMutation,
  useEndResetPasswordMutation,
} = authApi;
