import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery';
import { Ingredient, IngredientType } from '../../types/Ingredient';

type GetIngredientsRv = {
  byId: Record<string, Ingredient>;
  byType: Record<IngredientType, Ingredient[]>;
}

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery,
  endpoints: (builder) => ({
    getIngredients: builder.query<GetIngredientsRv, void>({
      query: () => 'ingredients',
      transformResponse: (response: { data: Ingredient[]}) => {
        const [byType, byId] = response.data.reduce(([byType, byId], obj) => {
          if (byType[obj.type]) {
            byType[obj.type].push(obj);
          } else {
            byType[obj.type] = [obj];
          }
          byId[obj._id] = obj;
          return [byType, byId];
        }, [{}, {}] as [Record<IngredientType, Ingredient[]>, Record<string, Ingredient>]);
        return { byType, byId };
      }
    })
  }),
})

export const { useGetIngredientsQuery } = ingredientsApi;
