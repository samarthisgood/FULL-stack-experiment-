import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSamplePosts } from "@/lib/sample-posts";
import type { Category, Platform, Post, Settings, Status } from "@/lib/types";

export interface Filters {
  platforms: Platform[];
  statuses: Status[];
  categories: Category[];
  search: string;
}

export interface PostState {
  posts: Post[];
  filters: Filters;
  settings: Settings;
  calendarView: Settings["defaultView"];
  hydrated: boolean;
}

export const defaultSettings: Settings = {
  defaultView: "dayGridMonth",
  timezone: "UTC",
  weekStart: 1,
  notifications: true,
};

const emptyFilters: Filters = { platforms: [], statuses: [], categories: [], search: "" };

const initialState: PostState = {
  posts: [],
  filters: emptyFilters,
  settings: defaultSettings,
  calendarView: defaultSettings.defaultView,
  hydrated: false,
};

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    hydrate(
      state,
      action: PayloadAction<{ posts?: Post[]; settings?: Partial<Settings> } | undefined>,
    ) {
      state.posts = action.payload?.posts?.length ? action.payload.posts : createSamplePosts();
      state.settings = { ...defaultSettings, ...action.payload?.settings };
      state.calendarView = state.settings.defaultView;
      state.hydrated = true;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.push(action.payload);
    },
    updatePost(state, action: PayloadAction<Post>) {
      const i = state.posts.findIndex((p) => p.id === action.payload.id);
      if (i !== -1) state.posts[i] = action.payload;
    },
    deletePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
    reschedulePost(state, action: PayloadAction<{ id: string; start: string; end: string }>) {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (post) {
        post.start = action.payload.start;
        post.end = action.payload.end;
      }
    },
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    togglePlatformFilter(state, action: PayloadAction<Platform>) {
      state.filters.platforms = toggle(state.filters.platforms, action.payload);
    },
    toggleStatusFilter(state, action: PayloadAction<Status>) {
      state.filters.statuses = toggle(state.filters.statuses, action.payload);
    },
    toggleCategoryFilter(state, action: PayloadAction<Category>) {
      state.filters.categories = toggle(state.filters.categories, action.payload);
    },
    clearFilters(state) {
      state.filters = { ...emptyFilters };
    },
    setCalendarView(state, action: PayloadAction<Settings["defaultView"]>) {
      state.calendarView = action.payload;
    },
    updateSettings(state, action: PayloadAction<Partial<Settings>>) {
      state.settings = { ...state.settings, ...action.payload };
      if (action.payload.defaultView) state.calendarView = action.payload.defaultView;
    },
    resetSampleData(state) {
      state.posts = createSamplePosts();
      state.filters = { ...emptyFilters };
    },
  },
});

export const {
  hydrate,
  addPost,
  updatePost,
  deletePost,
  reschedulePost,
  setSearch,
  togglePlatformFilter,
  toggleStatusFilter,
  toggleCategoryFilter,
  clearFilters,
  setCalendarView,
  updateSettings,
  resetSampleData,
} = postSlice.actions;

export default postSlice.reducer;
