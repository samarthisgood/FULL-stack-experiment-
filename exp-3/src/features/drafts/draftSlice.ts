import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Draft, PublishedPost, ScheduledPost } from "@/types/draft";
import { STORAGE_KEYS, saveToStorage } from "@/utils/storage";

export interface DraftState {
  drafts: Draft[];
  publishedPosts: PublishedPost[];
  scheduledPosts: ScheduledPost[];
  loading: boolean;
  loadingMessage: string;
  error: string | null;
}

const initialState: DraftState = {
  drafts: [],
  publishedPosts: [],
  scheduledPosts: [],
  loading: false,
  loadingMessage: "",
  error: null,
};

const draftSlice = createSlice({
  name: "drafts",
  initialState,
  reducers: {
    loadDrafts: (
      state,
      action: PayloadAction<{
        drafts: Draft[];
        publishedPosts: PublishedPost[];
        scheduledPosts: ScheduledPost[];
      }>,
    ) => {
      state.drafts = action.payload.drafts;
      state.publishedPosts = action.payload.publishedPosts;
      state.scheduledPosts = action.payload.scheduledPosts;
    },
    addDraft: (state, action: PayloadAction<Draft>) => {
      state.drafts.unshift(action.payload);
      saveToStorage(STORAGE_KEYS.drafts, state.drafts);
    },
    updateDraft: (state, action: PayloadAction<Draft>) => {
      const index = state.drafts.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) state.drafts[index] = action.payload;
      saveToStorage(STORAGE_KEYS.drafts, state.drafts);
    },
    deleteDraft: (state, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter((d) => d.id !== action.payload);
      saveToStorage(STORAGE_KEYS.drafts, state.drafts);
    },
    publishDraft: (state, action: PayloadAction<{ draftId: string; posts: PublishedPost[] }>) => {
      state.publishedPosts.unshift(...action.payload.posts);
      const draft = state.drafts.find((d) => d.id === action.payload.draftId);
      if (draft) {
        draft.status = "published";
        draft.updatedAt = new Date().toISOString();
      }
      saveToStorage(STORAGE_KEYS.publishedPosts, state.publishedPosts);
      saveToStorage(STORAGE_KEYS.drafts, state.drafts);
    },
    schedulePost: (state, action: PayloadAction<{ draftId: string; posts: ScheduledPost[] }>) => {
      state.scheduledPosts.unshift(...action.payload.posts);
      const draft = state.drafts.find((d) => d.id === action.payload.draftId);
      if (draft) {
        draft.status = "scheduled";
        draft.updatedAt = new Date().toISOString();
      }
      saveToStorage(STORAGE_KEYS.scheduledPosts, state.scheduledPosts);
      saveToStorage(STORAGE_KEYS.drafts, state.drafts);
    },
    setLoading: (state, action: PayloadAction<{ loading: boolean; message?: string }>) => {
      state.loading = action.payload.loading;
      state.loadingMessage = action.payload.loading ? (action.payload.message ?? "Loading...") : "";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.loadingMessage = "";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loadDrafts,
  addDraft,
  updateDraft,
  deleteDraft,
  publishDraft,
  schedulePost,
  setLoading,
  setError,
  clearError,
} = draftSlice.actions;

export default draftSlice.reducer;
