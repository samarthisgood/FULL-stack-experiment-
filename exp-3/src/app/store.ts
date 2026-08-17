import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import draftReducer from "@/features/drafts/draftSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drafts: draftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
