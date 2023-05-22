import {
  createSlice,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const initialState = {
  accessToken: null,
  refreshToken: null,
  passwordReset: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.passwordReset = false;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.passwordReset = false;
    },
    updateToken: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      state.passwordReset = false;
    },
    startPasswordReset: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.passwordReset = true;
    },
    endPasswordReset: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.passwordReset = false;
    },
  },
});

export const authReducer = authSlice.reducer;

export const {
  login,
  logout,
  updateToken,
  startPasswordReset,
  endPasswordReset,
} = authSlice.actions;

const accessTokenSelector = createSelector(
  (state) => state.auth.accessToken,
  (token) => token
);

export const useAccessToken = () => {
  return useSelector(accessTokenSelector);
};

const refreshTokenSelector = createSelector(
  (state) => state.auth.refreshToken,
  (token) => token
);

export const useRefreshToken = () => {
  return useSelector(refreshTokenSelector);
};

const hasUserSelector = createSelector(
  (state) => state.auth.refreshToken,
  (token) => !!token
);

export const useHasUser = () => {
  return useSelector(hasUserSelector);
};

const passwordResettingSelector = createSelector(
  (state) => state.auth.passwordReset,
  (token) => token
);

export const useResettingPassword = () => {
  return useSelector(passwordResettingSelector);
};

export const authListenerMiddleware = createListenerMiddleware();
authListenerMiddleware.startListening({
  matcher: isAnyOf(login, logout, updateToken, startPasswordReset, endPasswordReset),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState().auth;
    localStorage.setItem(
      "authData",
      JSON.stringify({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        passwordReset: state.passwordReset,
      })
    );
  },
});

export const getPreloadedAuthState = () => {
  let authData = null;
  try {
    const data = localStorage.getItem("authData");
    authData = data ? JSON.parse(data) : null;
  } catch {}
  return {
    accessToken: authData?.accessToken ?? null,
    refreshToken: authData?.refreshToken ?? null,
    passwordReset: authData?.passwordReset ?? false,
  };
};
