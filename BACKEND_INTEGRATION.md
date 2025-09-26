# Habico Backend Integration Guide (v2)

## 1. Overview

Welcome, backend developer! This document outlines the necessary steps to transition Habico from its current state as a **client-side-only prototype** to a secure, scalable, and production-ready web application.

The current frontend is fully functional but relies exclusively on the browser's `localStorage` for all data persistence. This is **insecure and not suitable for production**. Your primary role is to build a backend that will become the single source of truth for all user data, authentication, and business logic, including the enforcement of our new Freemium subscription model.

### Key Responsibilities of the Backend
1.  **Authentication:** Securely manage user registration ("Sign Up") and login ("Sign In"), with future support for OAuth (Google/Apple).
2.  **Database:** Persist all user and habit data.
3.  **Authorization & Feature Gating:** Protect "Pro" features and enforce usage limits (e.g., chat messages) for the "Free" plan.
4.  **API Endpoints:** Provide the necessary endpoints for the frontend to create, read, update, and delete data.
5.  **Secure API Key Management:** Act as a proxy for all calls to the Gemini API, keeping the API key safe on the server.

---

## 2. From `localStorage` to a Server-Authoritative Model

### Current State (Insecure)
-   **User Data:** A `user` object (containing name, email, and `plan`) is stored in `localStorage`. This is trivially easy for any user to edit to gain "Pro" features for free.
-   **Habit Data:** All habit progress, activity logs, streaks, etc., are stored in `localStorage`.
-   **Authentication:** There is no real authentication. The app trusts whatever user object it finds.

### Target State (Secure)
-   The frontend should store **only** an opaque, secure session token (e.g., a JWT) after a successful login.
-   All user and habit data **must** be fetched from your backend API after authentication.
-   The user's subscription plan (`plan`) **must** be determined by a value in the database (e.g., linked to a Stripe subscription status) and verified by the server on every protected API call. The frontend cannot be trusted with this information.

---

## 3. Recommended Implementation: Supabase

While you can build the backend with any stack (e.g., Node.js/Express), we strongly recommend using **Supabase**. It provides a secure, scalable, and production-ready backend-as-a-service that dramatically simplifies development by providing:
-   **Managed Postgres Database:** A robust and trusted SQL database.
-   **Built-in Authentication:** Handles sign-ups, logins, and OAuth providers (Google, Apple) securely out of the box.
-   **Row Level Security (RLS):** A powerful mechanism to ensure users can only access their own data.
-   **Auto-Generated APIs:** Instantly creates RESTful APIs for your database tables.
-   **Edge Functions:** Serverless functions perfect for custom logic like proxying Gemini API calls and calculating streaks.

This guide will specify the required API endpoints. Using Supabase, many of these can be implemented via its auto-generated API and protected with RLS, while more complex logic will live in Edge Functions.

---

## 4. Data Models

These are the required data schemas for your database.

### `User` Model
```json
{
  "_id": " uuid ",
  "name": "Jane Doe",
  "email": "user@example.com",
  "passwordHash": "...",
  "plan": "free", // ENUM: 'free', 'monthly', 'lifetime'
  "stripeCustomerId": "cus_...", // Optional: For integrating payments
  "chatCount": {
      "daily": 1,
      "monthly": 15,
      "lastChatDate": "2024-07-28" // YYYY-MM-DD
  },
  "createdAt": "ISODate('...')"
}
```
**Note on `chatCount`:** This is critical for enforcing Freemium limits. It must be updated on the server with every user chat message.

### `HabitData` Model
```json
{
  "_id": " uuid ",
  "userId": " uuid ", // Foreign key to User
  "day": 10,
  "streak": 5,
  "bestStreak": 15,
  "rockCleanliness": 20, // 0-90
  "lastUpdate": "ISODate('...')",
  "habitType": "Social Media",
  "urgeTiming": "Evening",
  "activityLog": [
    {
      "timestamp": "ISODate('...')",
      "action": "resist"
    },
    {
      "timestamp": "ISODate('...')",
      "action": "give_in",
      "emotion": "Bored",
      "trigger": "Watching TV"
    }
  ],
  "chatHistory": [
      { "role": "user", "text": "...", "timestamp": "..." },
      { "role": "model", "text": "...", "timestamp": "..." }
  ]
}
```

---

## 5. API Endpoint Specification

### Authentication

**`POST /auth/register`**
-   **Description:** Creates a new user account. Must hash the password securely (e.g., using bcrypt).
-   **Request Body:** ` { "email": "user@example.com", "password": "securepassword123", "name": "Jane Doe" } `
-   **Success Response (201):** ` { "token": "your_jwt_token", "user": { ... } } `

**`POST /auth/login`**
-   **Description:** Logs in an existing user, comparing the provided password against the stored hash.
-   **Request Body:** ` { "email": "user@example.com", "password": "securepassword123" } `
-   **Success Response (200):** ` { "token": "your_jwt_token", "user": { ... } } `

**Note on OAuth (Google/Apple):** These providers will be handled via a separate flow, typically managed by the Supabase client library on the frontend and validated by the backend.

### Data Fetching

**`GET /data/initial`**
-   **Description:** Fetches the authenticated user's profile and all their habit data. This is the main data-loading endpoint for the app.
-   **Headers:** `Authorization: Bearer your_jwt_token`
-   **Success Response (200):** ` { "user": { ... }, "habitData": { ... } } `

### Habit Actions
*All these endpoints require an `Authorization` header and must perform all business logic on the server.*

**`POST /habit/resist`**
-   **Description:** Logs a "resist" action. The server must calculate the new streak, day, cleanliness, etc., and return the updated state.
-   **Success Response (200):** `{ "habitData": { ...updated_habit_data } }`

**`POST /habit/givein`**
-   **Description:** Logs a "give in" action. The server resets the streak and updates state accordingly.
-   **Request Body:** ` { "emotion": "Stressed", "trigger": "Scrolling on my phone", "timestamp": 1678886400000 } `
-   **Success Response (200):** `{ "habitData": { ...updated_habit_data } }`

### Settings

**`PATCH /user/settings`**
-   **Description:** Updates user settings or personalization data.
-   **Request Body:** ` { "name": "New Name", "habitType": "Junk Food", "urgeTiming": "Evening" } `
-   **Success Response (200):** `{ "user": { ...updated_user_data } }`

**`POST /user/reset`**
-   **Description:** Resets a user's habit progress but does **not** delete their account.
-   **Success Response (200):** `{ "habitData": { ...reset_habit_data } }`

**`DELETE /user/account`**
-   **Description:** Permanently deletes a user's account and all associated data.
-   **Success Response (204):** No content.

### Gemini API Proxy (Security Critical)

The `API_KEY` must never be exposed. The backend **must** act as a secure proxy.

**`POST /ai/chat`**
-   **Description:** The main endpoint for the AI chat feature.
-   **Logic:**
    1.  Authenticate user via JWT.
    2.  Check the user's `plan`. If `free`, check their `chatCount`.
    3.  If daily (>=3) or monthly (>=30) limit is reached, respond with **`429 Too Many Requests`**.
    4.  If authorized, fetch the user's `habitData` to construct the full `systemInstruction` for the AI.
    5.  Proxy the user's message and chat history to the Gemini API using the server-side API key.
    6.  **Increment the user's `chatCount`** in the database.
    7.  Stream the response from Gemini back to the client.
-   **Request Body:** `{ "history": [ ...chat_messages ] }`

**`POST /ai/insight` (Pro Feature)**
-   **Description:** Generates an actionable insight.
-   **Logic:** Authenticate user, check if `plan` is `'monthly'` or `'lifetime'`, then proxy to Gemini. If `free`, respond with **`403 Forbidden`**.

---

## 6. Frontend Collaboration

Once these endpoints are ready, the frontend will be updated. Key areas of change will be:
-   Replacing all `localStorage` calls in `useAuth.ts` and `useHabitData.ts` with API calls (`fetch` or the Supabase client).
-   Implementing the full login/registration flow.
-   Storing the JWT securely and sending it in the `Authorization` header.
-   Updating all Gemini service calls to point to our new backend proxy endpoints.

Thank you for your work on this critical part of the application!
