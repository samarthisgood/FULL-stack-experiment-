import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getStoredSession, saveSession } from "@/lib/auth-session";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

function getInitialState(): AuthState {
  const user = typeof window === "undefined" ? null : getStoredSession();
  return {
    user,
    isAuthenticated: !!user,
    loading: false,
    error: null,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      saveSession(action.payload);
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      saveSession(null);
    },
    hydrateAuth(state) {
      const user = getStoredSession();
      state.user = user;
      state.isAuthenticated = !!user;
    },
  },
});

export const { setAuthLoading, setAuthError, loginSuccess, logout, hydrateAuth } =
  authSlice.actions;

export default authSlice.reducer;
