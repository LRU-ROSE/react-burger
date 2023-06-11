import { createApi } from "@reduxjs/toolkit/query/react";
import { webSocketWithReauth } from "./baseQuery";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  endpoints: (builder) => ({
    getOrders: builder.query({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(args, api) {
        const { cacheDataLoaded, cacheEntryRemoved, updateCachedData } = api;
        await cacheDataLoaded;
        const close = webSocketWithReauth(
          (accessToken) =>
            `wss://norma.nomoreparties.space/orders?token=${accessToken}`,
          api,
          (data) => {
            updateCachedData((draft) => {
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
          updateCachedData((draft) => {
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

export const { useGetAllOrdersQuery, useGetOrdersQuery } = ordersApi;
