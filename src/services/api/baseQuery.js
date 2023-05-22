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
    headers.append("Authorization", auth.accessToken);
  },
});

const updateMutex = new Mutex();

const loadToken = async (refreshToken, api, extraOptions) => {
  const release = await updateMutex.acquire();
  try {
    const refreshResult = await baseQuery({
      url: "auth/token",
      method: "POST",
      body: { token: refreshToken },
    }, api, extraOptions);
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

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  try {
    await updateMutex.waitForUnlock();
    const { auth: { refreshToken, accessToken } } = api.getState();
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
