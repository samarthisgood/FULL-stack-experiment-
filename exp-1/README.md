# Draft Keeper

Build a complete React.js application for the experiment **"Draft Management System"**.

Objective:

Implement a frontend-only draft management system that allows users to create, save, view, edit, and delete post drafts without a backend.

Requirements:

- Use React.js with functional components.

- Use useState and useEffect for state management.

- Create a form with the following fields:

  - Title

  - Content/Description

  - Category

- Validate that Title and Description are required.

- Add a "Save Draft" button.

- Display all saved drafts below the form.

- Each draft should display:

  - Title

  - Description

  - Category

  - Date Created

- Each draft must have:

  - Edit button

  - Delete button

- Editing should populate the form and update the existing draft.

- Deleting should remove the draft immediately.

- Store drafts in localStorage so they remain after refreshing the page.

- Use useEffect to load drafts from localStorage on startup.

- Show a message "No Drafts Available" when there are no drafts.

- Show loading feedback (Saving..., Updating..., Deleting...) by simulating asynchronous operations using async/await and setTimeout.

- Organize the project into reusable React components.

Suggested Components:

- DraftForm.jsx

- DraftList.jsx

- DraftCard.jsx

- Loader.jsx

- App.jsx

Project Structure:

src/

 ├── components/

 │    ├── DraftForm.jsx

 │    ├── DraftList.jsx

 │    ├── DraftCard.jsx

 │    └── Loader.jsx

 ├── App.jsx

 ├── App.css

 └── main.jsx

UI Requirements:

- Modern responsive interface.

- Clean card layout.

- Simple navbar with title "Draft Management System".

- Attractive buttons with hover effects.

- Mobile-friendly layout.

Implementation Requirements:

- React Hooks

- ES6 JavaScript

- CRUD Operations

- localStorage

- Async/Await

- Conditional Rendering

- List Rendering using map()

Expected Outcome:

- User can create drafts.

- User can edit drafts.

- User can delete drafts.

- Drafts persist after page refresh using localStorage.

- Loading indicators simulate backend API behavior.

- Code should be clean, modular, well-commented, and ready to run using npm install and npm start.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e1e07b95-9873-440c-b0f8-655b10c14ed6).

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
