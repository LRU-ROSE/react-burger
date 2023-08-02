import {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/dist/query";
import { Mutex } from "async-mutex";
import { logout, updateToken } from "../auth";
import {
  createUserRequiredError,
} from "../../helpers/UserRequiredError";

import { RootState } from "..";
import {
  BaseQueryFn,
  QueryReturnValue,
} from "@reduxjs/toolkit/dist/query/baseQueryTypes";

const baseUrl = "https://norma.nomoreparties.space/api/";

export const baseQuery: BaseQueryFn<string | FetchArgs, any, FetchBaseQueryError> =
  fetchBaseQuery({ baseUrl });

const authorizedBaseQuery: BaseQueryFn<string | FetchArgs, any, FetchBaseQueryError> =
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, api) => {
      const { auth } = api.getState() as RootState;
      headers.append("Authorization", `Bearer ${auth.accessToken}`);
    },
  });

const updateMutex = new Mutex();

type TokenRv = {
  accessToken: string;
};

const loadToken = async (
  refreshToken: string,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const release = await updateMutex.acquire();
  try {
    const refreshResult: QueryReturnValue<TokenRv> = await baseQuery(
      {
        url: "auth/token",
        method: "POST",
        body: { token: refreshToken },
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      api.dispatch(
        updateToken({ accessToken: refreshResult.data.accessToken })
      );
    } else {
      api.dispatch(logout());
      throw createUserRequiredError();
    }
  } finally {
    release();
  }
};

type CloseFun = (code?: number) => void;

const webSocketWithReauthHelper = async <T>(
  getUrl: (acessToken: string) => string,
  api: BaseQueryApi,
  onmessage: (msg: T) => void,
  onerror: (e: any) => void,
  onclose: (e: CloseEvent) => void,
  updateToken = false
): Promise<CloseFun> => {
  let closeFunc: CloseFun;
  let ignoreNextError = false;
  let ws: WebSocket;
  try {
    await updateMutex.waitForUnlock();
    let {
      auth: { refreshToken, accessToken },
    } = api.getState() as RootState;
    if (!refreshToken) {
      throw createUserRequiredError();
    }
    if (!accessToken || updateToken) {
      await loadToken(refreshToken, api, {});
      accessToken = (api.getState() as RootState).auth.accessToken;
      if (!accessToken) {
        onerror("Cannot load accessToken");
        return () => undefined;
      }
    }
    ws = new WebSocket(getUrl(accessToken));
  } catch (error) {
    console.log("ERROR", error);
    onerror(error);
    return () => undefined;
  }
  closeFunc = (num = 1000) => ws.close(num);
  ws.onmessage = async (e) => {
    const data = JSON.parse(e.data);
    if (!data.success && data.message === "Invalid or missing token") {
      ws.onmessage = ws.onerror = ws.onclose = null;
      closeFunc(1000);
      closeFunc = await webSocketWithReauthHelper(
        getUrl,
        api,
        onmessage,
        onerror,
        onclose,
        true
      );
    } else {
      onmessage(data);
    }
  };
  ws.onerror = (e) => {
    console.log("ERROR", e);
    if (ignoreNextError) {
      return;
    }
    onerror(e);
  };
  ws.onclose = async (e) => {
    console.log("CLOSE", e);
    if (e.code === 1006 && !updateToken) {
      ws.onmessage = ws.onerror = ws.onclose = null;
      closeFunc();
      closeFunc = await webSocketWithReauthHelper(
        getUrl,
        api,
        onmessage,
        onerror,
        onclose,
        true
      );
    } else {
      onclose(e);
    }
  };
  return () => closeFunc();
};

export const webSocketWithReauth = <T>(
  getUrl: (acessToken: string) => string,
  api: BaseQueryApi,
  onmessage: (msg: T) => void,
  onerror: (e: any) => void,
  onclose: (e: CloseEvent) => void
): Promise<CloseFun> => {
  return webSocketWithReauthHelper(
    getUrl,
    api,
    onmessage,
    onerror,
    onclose,
    false
  );
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  any,
  FetchBaseQueryError
> = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  try {
    await updateMutex.waitForUnlock();
    const {
      auth: { refreshToken, accessToken },
    } = api.getState() as RootState;
    if (!refreshToken) {
      throw createUserRequiredError();
    }
    if (!accessToken) {
      await loadToken(refreshToken, api, extraOptions);
    }
    let result = await authorizedBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 403) {
      await loadToken(refreshToken, api, extraOptions);
      result = await authorizedBaseQuery(args, api, extraOptions);
      if (result.error && result.error.status === 403) {
        api.dispatch(logout());
        throw createUserRequiredError();
      }
    }
    return result;
  } catch (error) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        error,
      } as FetchBaseQueryError,
    };
  }
};
