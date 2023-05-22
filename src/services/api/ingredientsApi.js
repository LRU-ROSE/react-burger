import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery';

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery,
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => 'ingredients',
      transformResponse: (response) => {
        const [byType, byId] = response.data.reduce(([byType, byId], obj) => {
          if (byType[obj.type]) {
            byType[obj.type].push(obj);
          } else {
            byType[obj.type] = [obj];
          }
          byId[obj._id] = obj;
          return [byType, byId];
        }, [{}, {}]);
        return { byType, byId };
      }
    })
  }),
})

export const { useGetIngredientsQuery } = ingredientsApi;
