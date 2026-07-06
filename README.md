# Scalable Social Media Frontend 🚀

A production-ready, highly responsive React Single Page Application (SPA) designed to handle millions of interactions with zero lag. This repository contains the modern frontend infrastructure for a next-generation social media platform.

## 🎯 Project Overview & Objectives

The primary objective of this project is to deliver a premium, native-feeling social media experience on the web. It emphasizes **perceived performance**, **structural scalability**, and **buttery smooth interactions**.

### Key Features
- **Massive Scale Feed**: Seamlessly infinitely scrolling feed capable of rendering thousands of elements cleanly using cursor-based pagination.
- **Optimistic UI Data Mutations**: Zero-lag liking, commenting, and posting. Actions are registered instantly on the client while syncing with the backend silently.
- **Recursive Threading**: N-level deep nested commenting system using recursive React components.
- **ImgBB Image Upload**: Integrates with the ImgBB API to upload selected images from local storage and posts image URLs to the backend.
- **Wired Backend Integrations**: Complete support for likes toggling, comments creation, nested replies, and checking liked users lists.
- **Micro-Interactions**: Spring-based physics animations on buttons and UI components.
- **Fluid Responsiveness**: A specialized hook (`useDesignScale`) dynamically recalculates pixel-perfect element dimensions bridging the gap between standard mobile (393px) and widescreen desktop (1441px) breakpoints.

---

## 🛠 Tech Stack

- **[Vite](https://vitejs.dev/)**: Next Generation Frontend Tooling. Used for lighting-fast HMR (Hot Module Replacement) and optimized production building.
- **[React JS (v18)](https://react.dev/)**: Core component-based library (JavaScript, No TypeScript overhead for this iteration).
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI mapping and robust layout structuring.
- **[Framer Motion](https://www.framer.com/motion/)**: Industry-leading animation library powering the `AnimatePresence` height calculations, springy pops, and fade transitions.
- **[React Router DOM](https://reactrouter.com/)**: Handling client-side routing with nested routes and lazy loading.
- **Context API**: Native global state management handling JWT Tokens and User sessions securely.

---

## 🚀 Installation & Setup

Follow these steps to get the development environment running locally.

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd SocialMedia_Frontend
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed.
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory.
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_IMGBB_API_KEY=your_imgbb_api_key
    ```
    *(Note: The global `api.js` utility utilizes the base URL for backend requests, and `CreatePost` uses the ImgBB API key to upload photos)*

4. **Launch the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🏗 Production Architectural Explanations

To guarantee rendering efficiency on millions of entries and complex DOM structures, we utilize the following architectural patterns:

### 1. Route-Based Lazy Loading
The `App.jsx` entry point utilizes `React.lazy()` combined with `<Suspense>`.
When the application first loads, it *only* downloads the Javascript chunk required for the Login or Registration page. The massive chunk containing the `Feed`, `PostCard`, and `Framer Motion` libraries is deferred until the user successfully authenticates.

### 2. Cursor-Based Pagination
  We never load all feed posts at once. In `Feed.jsx`, we implement a native `IntersectionObserver` referencing a hidden anchor `div` at the bottom of the feed. Once the anchor crosses the viewport threshold, it triggers `fetchPosts()`, dynamically paginating the data via `/api/feed?limit=10&cursor=uuid` cursor parameters.

### 3. Optimistic UI Updates
  Waiting for a network request to resolve before updating a "Like" count results in a sluggish, 300ms delayed interaction. 
  Instead, our `PostCard.jsx` instantly increments the React state and updates the UI count. The like toggle `POST /api/likes/toggle` request happens in the background. If the request fails, the application catches the error and cleanly rolls back the local state to prevent data desynchronization.

### 4. Recursive Component Tree
  To handle deeply nested reply threads cleanly, `Comment.jsx` relies on a recursive pattern. If a comment object contains `replies`, the component maps over them and renders `<Comment />` inside itself. A local comment tree builder constructs the hierarchical structure from flat API responses. 

### 5. Comments Cursor-Based Pagination
  Top-level comments and replies for each post are fetched dynamically via `GET /api/posts/:postId/comments?limit=6&cursor=uuid` cursor-based pagination. The "View previous comments" button is rendered conditionally only when more comments exist (determined by `nextCursor`), optimizing loading performance on high-engagement posts. 

---

## 🎨 Responsive Interface Philosophy

Instead of relying purely on standard CSS media queries that snap awkwardly between breakpoints, this architecture utilizes a custom `useDesignScale` hook.

By mapping absolute Figma dimensions into the `d(pixels)` function, the layout dynamically recalculates exact sizing margins, paddings, and typography constraints on window resize. It guarantees that a card perfectly proportioned on a 1441px screen shrinks smoothly and proportionally down to a 768px tablet, where Tailwind's fluid CSS flex-containers seamlessly take over for the mobile stack.
