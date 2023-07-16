import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { BaseQueryApi, createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, webSocketWithReauth } from "./baseQuery";
import useLatest from "../../helpers/useLatest";
import { OrderType } from "../../types/order";

export const ordersApi = createApi({
  baseQuery,
  reducerPath: "ordersApi",
  endpoints: (builder) => ({
    getOrders: builder.query({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(_args, api) {
        const { cacheDataLoaded, cacheEntryRemoved, updateCachedData } = api;
        await cacheDataLoaded;
        const close = await webSocketWithReauth(
          (accessToken) =>
            `wss://norma.nomoreparties.space/orders?token=${accessToken}`,
          api as any as BaseQueryApi,
          (data: { orders: OrderType[] }) => {
            console.log(data);
            updateCachedData((draft: OrderType[]) => {
              draft.length = 0;
              draft.push(...data.orders);
            });
          },
          () => {
            api.dispatch(ordersApi.util.resetApiState());
          },
          () => {
            api.dispatch(ordersApi.util.resetApiState());
          }
        );
        await cacheEntryRemoved;
        close(1000);
      },
    }),
    getAllOrders: builder.query({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(args, api) {
        const { cacheDataLoaded, cacheEntryRemoved, updateCachedData } = api;
        await cacheDataLoaded;
        const ws = new WebSocket("wss://norma.nomoreparties.space/orders/all");
        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          updateCachedData((draft: OrderType[]) => {
            draft.length = 0;
            draft.push(...data.orders);
          });
        };
        ws.onerror = (e) => {
          console.log("ERROR", e);
          api.dispatch(ordersApi.util.resetApiState());
        };
        ws.onclose = (e) => {
          console.log("CLOSE", e);
          api.dispatch(ordersApi.util.resetApiState());
        };
        await cacheEntryRemoved;
        ws.close(1000);
      },
    }),
  }),
});

export const useCloseOrdersQuery = () => {
  const dispatch = useLatest(useDispatch());
  return useCallback(() => {
    dispatch.current(ordersApi.util.resetApiState());
  }, [dispatch]);
};

export const { useGetAllOrdersQuery, useGetOrdersQuery } = ordersApi;
