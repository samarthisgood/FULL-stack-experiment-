import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import postsReducer, { type PostState } from "./postSlice";
import type { Post, Settings } from "@/lib/types";

export const STORAGE_KEY = "postflow.state.v1";

export const store = configureStore({
  reducer: { posts: postsReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const loadPersisted = (): { posts?: Post[]; settings?: Partial<Settings> } | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

export const persist = (state: PostState) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ posts: state.posts, settings: state.settings }),
    );
  } catch {
    /* storage unavailable */
  }
};
