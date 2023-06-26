import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './baseQuery';
import { endPasswordReset, login, logout, startPasswordReset } from "../auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
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
      transformErrorResponse: (response) => {
        return `Ошибка: ${response.data.message}`;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const loginData = await queryFulfilled;
          dispatch(login(loginData.data));
        } catch {}
      },
    }),
    logout: builder.mutation({
      queryFn: async (_arg, api, extraOptions, fetchWithBQ) => {
        const { auth: { refreshToken } } = api.getState();
        if (!refreshToken) {
          return { data: null };
        }
        return await fetchWithBQ({
          url: "auth/logout",
          method: "POST",
          body: { token: refreshToken },
        });
      },
      transformErrorResponse: (response) => {
        return `Ошибка: ${response.data.message}`;
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
      transformErrorResponse: (response) => {
        return `Ошибка: ${response.data.message}`;
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
      transformErrorResponse: (response) => {
        return `Ошибка: ${response.data.message}`;
      },
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
      transformErrorResponse: (response) => {
        return `Ошибка: ${response.data.message}`;
      },
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
