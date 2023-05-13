import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { clearComponents } from './burger';

// Define a service using a base URL and expected endpoints
export const spaceBurgerApi = createApi({
  reducerPath: 'spaceBurgerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://norma.nomoreparties.space/api/' }),
  endpoints: (builder) => ({
    getIngredientsByType: builder.query({
      query: () => 'ingredients',
      transformResponse: (response) => {
        return response.data.reduce((dataByType, obj) => {
          if (dataByType[obj.type]) {
            dataByType[obj.type].push(obj);
          } else {
            dataByType[obj.type] = [obj];
          }
          return dataByType;
        }, {});
      }
    }),
    sendOrder: builder.mutation({
      query: (ingredients) => ({
        url: 'orders',
        method: 'POST',
        body: {ingredients},
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        // Выполняется только если отправка произошла успешно и
        // промис queryFulfilled не выбросил ошибку
        dispatch(clearComponents());
      }
    })
  }),
})

export const { useGetIngredientsByTypeQuery, useSendOrderMutation } = spaceBurgerApi;
