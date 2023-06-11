import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { Mutex } from "async-mutex";
import { logout, updateToken } from "../auth";
import { createUserRequiredError } from "../../helpers/UserRequiredError";

const baseUrl = "https://norma.nomoreparties.space/api/";

export const baseQuery = fetchBaseQuery({ baseUrl });

const authorizedBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, api) => {
    const { auth } = api.getState();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);
  },
});

const updateMutex = new Mutex();

const loadToken = async (refreshToken, api, extraOptions) => {
  const release = await updateMutex.acquire();
  try {
    const refreshResult = await baseQuery(
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

export const webSocketWithReauthHelper = async (
  getUrl,
  api,
  onmessage,
  onerror,
  onclose,
  updateToken = false
) => {
  let closeFunc;
  let ignoreNextError = false;
  let ws;
  try {
    await updateMutex.waitForUnlock();
    let {
      auth: { refreshToken, accessToken },
    } = api.getState();
    if (!refreshToken) {
      throw createUserRequiredError();
    }
    if (!accessToken || updateToken) {
      await loadToken(refreshToken, api, null);
      accessToken = api.getState().auth.accessToken;
    }
    ws = new WebSocket(getUrl(accessToken));
  } catch (error) {
    console.log('ERROR', error);
    onerror?.(error);
    return;
  }
  closeFunc = () => ws.close(1000);
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (!data.success && data.message === "Invalid or missing token") {
      ws.onmessage = ws.onerror = ws.onclose = null;
      closeFunc();
      closeFunc = webSocketWithReauthHelper(getUrl, api, onmessage, onerror, onclose, true);
    } else {
      onmessage(data);
    }
  };
  ws.onerror = (e) => {
    console.log('ERROR', e);
    if (ignoreNextError) {
      return;
    }
    onerror?.(e);
  };
  ws.onclose = (e) => {
    console.log('CLOSE', e);
    if (e.code === 1006 && !updateToken) {
      ws.onmessage = ws.onerror = ws.onclose = null;
      closeFunc();
      closeFunc = webSocketWithReauthHelper(getUrl, api, onmessage, onerror, onclose, true);
    } else {
      onclose?.(e);
    }
  };
  return () => closeFunc();
};

export const webSocketWithReauth = async (
  getUrl,
  api,
  onmessage,
  onerror,
  onclose
) => {
  return webSocketWithReauthHelper(getUrl, api, onmessage, onerror, onclose, false);
};

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  try {
    await updateMutex.waitForUnlock();
    const {
      auth: { refreshToken, accessToken },
    } = api.getState();
    if (!refreshToken) {
      throw createUserRequiredError();
    }
    if (!accessToken) {
      await loadToken(refreshToken, api, extraOptions);
    }
    let result = await authorizedBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 403) {
      await loadToken(refreshToken, api, extraOptions);
      result = authorizedBaseQuery(args, api, extraOptions);
      if (result.error && result.error.status === 403) {
        api.dispatch(logout());
        throw createUserRequiredError();
      }
    }
    return result;
  } catch (error) {
    return { error };
  }
};
