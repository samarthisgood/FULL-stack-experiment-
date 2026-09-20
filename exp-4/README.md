# Post Planner Pro

Implement the requested application now; use internal planning and do not present another implementation plan for user approval.

### Project Request
Build "PostFlow – Social Media Content Scheduler", a fully functional, professional, responsive interactive calendar post scheduler web application.

### Key Requirements & Specifications
1. **Tech Stack & Architecture:**
   - React.js with TypeScript and Tailwind CSS
   - Modern, reliable interactive calendar library (e.g. FullCalendar React `@fullcalendar/react` with `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`, `@fullcalendar/list`, or equivalent highly capable interactive calendar supporting drag-and-drop & event resize)
   - Date handling with date-fns or Day.js
   - Global state management using Redux Toolkit (`@reduxjs/toolkit` and `react-redux`) with a dedicated `postSlice` managing posts, filters, search, and calendar views
   - LocalStorage persistence: hydrate state from LocalStorage on mount; initialize with 10–15 realistic sample posts (centered around September 2026, e.g. Sept 19–30, 2026) across Instagram, Facebook, LinkedIn, X, and YouTube if LocalStorage is empty. Sync updates, creates, deletes, and reschedules back to LocalStorage immediately.
   - Lucide React icons
   - Clean, SaaS-grade UI with Toast notifications (Sonner or custom toasts)

2. **Main Layout & Navigation:**
   - Professional sidebar + header shell:
     - Sidebar links: Dashboard, Calendar, Posts, Analytics, Settings
     - Mobile responsive drawer/hamburger navigation
     - Header with global search, notifications indicator, profile pill, and a prominent "+ Create Post" action button

3. **Core Pages & Features:**
   - **Dashboard:**
     - Metric cards: Total Posts, Scheduled, Published, Drafts, Posts This Week, Posts This Month
     - Mini activity / upcoming posts preview
     - Quick shortcut to create post
   - **Interactive Calendar:**
     - Views: Month, Week, Day, and List/Agenda
     - Drag-and-drop rescheduling: dragging an event to a new date/time updates the post's temporal start/end timestamps, updates Redux & LocalStorage, and fires a toast ("Post rescheduled successfully.")
     - Event resizing for adjusting duration/time slot
     - Visual indicators and color badges by platform (Instagram, Facebook, LinkedIn, X, YouTube) and status (Draft, Scheduled, Published, Failed)
     - Current date ("Today") highlighting and clear month/year navigation controls (`< Today >`)
     - Filter toolbar: filter by Platform, Status, Category (Marketing, Education, Announcement, Promotion, Personal)
     - Search filter updating events dynamically
   - **Post Management (CRUD):**
     - **Create Post Modal / Drawer:** Form fields for Title, Content, Platform, Category, Status, Date, Time, Time Zone, optional image/thumbnail URL or upload simulation, Hashtags, and Notes. Validation for required fields. "Save Draft" and "Schedule Post" actions.
     - **View Details Modal:** Clicking an event shows title, platform badge, status, formatted date & time, category, content preview, hashtags, with Edit, Delete, and Close buttons.
     - **Edit Post Modal:** Modify any post field, reflecting immediately in Redux, LocalStorage, and Calendar.
     - **Delete Post Confirmation Dialog:** "Delete this scheduled post? This action cannot be undone." with Cancel/Delete actions.
   - **Posts Table Page:**
     - Tabular view with columns: Title, Platform, Date, Time, Status, Category, Actions (View, Edit, Delete)
     - Search, filter, sorting, and pagination or smooth list scrolling
   - **Analytics Page:**
     - Breakdown cards and charts (using Recharts or Lucide/Tailwind bar charts) for posts by platform, posts by status, and posting volume over time
   - **Settings Page:**
     - Default calendar view selector, timezone preference, week start day (Sunday/Monday), notification toggle, and reset sample data option
   - **Empty States & Accessibility:**
     - Meaningful empty states when lists/calendars have no matches ("No scheduled posts found") with a "+ Create Post" trigger.
     - Accessible form inputs, visible focus rings, ARIA dialog roles, and responsive layouts for mobile and desktop.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a5eb0d21-0f65-48b5-9e93-118fa2478b11).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
