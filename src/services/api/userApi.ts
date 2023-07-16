import { createApi } from "@reduxjs/toolkit/query/react";
import { clearComponents } from "../burger";
import { baseQueryWithReauth } from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    sendOrder: builder.mutation({
      query: (ingredients) => ({
        url: "orders",
        method: "POST",
        body: { ingredients },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(clearComponents());
        } catch {}
      },
    }),
    getUser: builder.query({
      query: () => "auth/user",
      transformResponse: (response: { user: { name?: string, email?: string }}) => {
        return response.user;
      },
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "auth/user",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: { user: updatedUser } } = await queryFulfilled;
          dispatch(
            userApi.util.updateQueryData('getUser', undefined, (draft) => {
              Object.assign(draft, updatedUser);
            })
          );
        } catch {}
      },
    }),
  }),
});

export const { useSendOrderMutation, useUpdateUserMutation, useGetUserQuery } = userApi;
