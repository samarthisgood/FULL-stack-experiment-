# Experiment: Draft Management System with Social Media Publishing

## Objective

Build a frontend application that demonstrates:

- Managing draft data with frontend state (React state + Redux Toolkit)
- Complete CRUD operations (create, read, update, delete)
- Asynchronous UI workflows using Promises, `async/await` and `setTimeout`
- Persisting data with `localStorage`
- Simulating backend communication with mock API functions
- Loading and feedback (toast) states
- Preparing and publishing drafts for different social media platforms

## Technologies Used

React 19, JavaScript/TypeScript ES6+, React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`),
Redux Toolkit, React-Redux, TanStack Router (routing), HTML5, Tailwind CSS v4,
`localStorage`, `async/await`, Promises, mock API functions, Sonner toasts.

No real backend. No real Instagram / Facebook / X / LinkedIn APIs — all publishing is simulated.

## Features Implemented

- **Dashboard** — total drafts, published posts, scheduled posts, recently updated, recent drafts, recently published, quick actions.
- **Create Draft** — title, content, category, tags, author, image upload, created date, Save Draft / Clear Form, validation for title, content, category.
- **Drafts page** — every draft with title, content preview, category, tags, author, created date, updated date and status, plus View / Edit / Delete / Publish. Shows "No Drafts Available" when empty.
- **Edit Draft** — loads the draft into the form, updates `updatedAt`, shows "Draft updated successfully!".
- **Delete Draft** — confirmation dialog ("Are you sure you want to delete this draft?") with Cancel / Delete.
- **Search** — by title, content, category, author and tags, updating live.
- **Filter** — by category (All, Technology, Education, Sports, Entertainment, Personal, Other).
- **Sort** — Newest First, Oldest First, Title A-Z, Title Z-A.
- **Publish modal** — choose one or many platforms (Instagram, Facebook, X, LinkedIn), edit content, manage hashtags, live previews per platform (Instagram caption + hashtags, Facebook engagement bar, X character counter limited to 280, LinkedIn engagement bar), image preview.
- **Publish Now** — loading → mock API → success → post moves into Published Posts and the draft is marked `published`.
- **Schedule Post** — date + time, confirmation "Scheduled for DD/MM/YYYY at HH:MM", stored in localStorage.
- **Published Posts page** — title, content, platform, image, published date, status, with platform filters.
- **Scheduled Posts page** — title, content, platform, scheduled date and time, status.
- **Loading states** — "Loading drafts...", "Saving draft...", "Updating draft...", "Deleting draft...", "Publishing post...", "Scheduling post...", with spinners and disabled buttons.
- **Error handling** — mock API errors stop the loading state, show an error message, keep existing data safe and allow retry.
- **Responsive SaaS UI** — collapsible sidebar, top navbar, dashboard cards, modals, toasts, hover effects, transitions, empty states.

## Redux Toolkit Concepts Used

- `configureStore()` in `src/app/store.ts`
- `createSlice()` in `src/features/drafts/draftSlice.ts` with Immer-based mutations
- Actions/reducers: `addDraft`, `updateDraft`, `deleteDraft`, `loadDrafts`, `publishDraft`, `schedulePost`, `setLoading`, `setError`, `clearError`
- `useSelector` / `useDispatch` (typed as `useAppSelector` / `useAppDispatch`)
- Global state shape: `{ drafts, publishedPosts, scheduledPosts, loading, loadingMessage, error }`

## CRUD Operations

| Operation | Where              | Flow                                                              |
| --------- | ------------------ | ----------------------------------------------------------------- |
| Create    | `/create`          | validate → `createDraft()` mock API → `addDraft` → localStorage   |
| Read      | `/drafts`, `/`     | `getDrafts()` on app start → `loadDrafts`                         |
| Update    | `/drafts/:id/edit` | `updateDraft()` mock API → `updateDraft` action → new `updatedAt` |
| Delete    | draft card         | confirm dialog → `deleteDraft()` mock API → `deleteDraft` action  |

## localStorage Usage

Keys: `drafts`, `publishedPosts`, `scheduledPosts`.
Helpers in `src/utils/storage.ts` use `localStorage.setItem`, `localStorage.getItem`,
`JSON.stringify` and `JSON.parse`. Every reducer that mutates data writes back to storage,
so all data survives a browser refresh.

## Mock API / Async Workflow

`src/services/mockApi.ts` exports `getDrafts`, `getPublishedPosts`, `getScheduledPosts`,
`createDraft`, `updateDraft`, `deleteDraft`, `publishPost` and `schedulePost`.
Each returns a Promise and simulates network latency:

```js
await new Promise((resolve) => setTimeout(resolve, 1500));
```

## Project Structure

```
src/
├── app/            store.ts, hooks.ts
├── components/     Navbar, Sidebar, AppLayout, DraftForm, DraftCard, DraftList,
│                   PublishModal, SocialPreview, Loader, Toast
├── features/drafts/draftSlice.ts
├── pages/          Dashboard, PublishedPosts, ScheduledPosts
├── routes/         / , /create, /drafts, /drafts/$draftId/edit, /published, /scheduled
├── services/       mockApi.ts
├── types/          draft.ts
└── utils/          storage.ts
```

## How to Run

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Expected Outcome

A working single-page SaaS-style application where drafts can be created, listed, searched,
filtered, sorted, edited and deleted with simulated backend delays and toast feedback, and
where each draft can be previewed and published or scheduled for Instagram, Facebook, X and
LinkedIn — with all data persisted in the browser's localStorage.
