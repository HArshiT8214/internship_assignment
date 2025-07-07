# Kanban Board Application

## Project Overview

This project is a full-stack Kanban Board application with real-time collaboration, user authentication, activity logging, and advanced task assignment features. It is split into a React frontend and a Node.js/Express backend, using MongoDB for data storage.

---

## Tech Stack

- **Frontend:** React, Vite, React Router, Socket.IO Client, CSS
- **Backend:** Node.js, Express, Socket.IO, Mongoose (MongoDB), JWT, bcrypt, dotenv, cors
- **Database:** MongoDB

---

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or cloud)

### 1. Clone the repository

```sh
git clone <repo-url>
cd internship_assignment
```

### 2. Backend Setup

```sh
cd backend
npm install
# Make sure MongoDB is running locally or update MONGO_URI in backend/server.js or .env
npm start
```

### 3. Frontend Setup

Open a new terminal:

```sh
cd frontend
npm install
npm run dev
```

- The frontend will be available at [http://localhost:5173](http://localhost:5173)
- The backend API runs at [http://localhost:5001](http://localhost:5001)

---

## Features List

- User registration and login (JWT-based)
- Kanban board with columns: Todo, In Progress, Done
- Add, update, delete, and drag-and-drop tasks
- Assign tasks to users manually or via Smart Assign
- Real-time updates across clients (Socket.IO)
- Activity log panel for task actions
- Conflict handling for concurrent task edits
- Task priority (Low, Medium, High)
- Responsive, modern UI

---

## Usage Guide

### Authentication

- Register a new account or login with existing credentials.
- Authenticated users can create, update, and delete tasks.

### Task Management

- Add tasks using the form at the top.
- Drag and drop tasks between columns.
- Click "Smart Assign" to automatically assign a task to the user with the fewest active (not Done) tasks.
- Edit or delete tasks as needed.

### Real-Time Collaboration

- All changes are broadcast to connected users instantly.
- The Activity Log panel shows recent actions.

### Conflict Handling

- If two users edit the same task simultaneously, a conflict modal appears.
- You can merge changes, overwrite, or cancel.

---

## Smart Assign Logic

When you click "Smart Assign" on a task:

1. The backend fetches all users.
2. It counts the number of active (not Done) tasks assigned to each user.
3. The user with the fewest active tasks is selected.
4. The task is assigned to that user, and the change is broadcast in real-time.

**Code Reference:**  
See `backend/controllers/taskController.js` → `exports.smartAssignTask`

---

## Conflict Handling Logic

- Each task has a `version` field.
- When updating a task, the frontend sends the current version.
- If the backend detects the version is outdated (another user updated the task), it returns a 409 Conflict with both the current and attempted versions.
- The frontend shows a modal to let the user merge, overwrite, or cancel.

**Code Reference:**  
See `backend/controllers/taskController.js` → `exports.updateTask`  
See `frontend/src/components/Kanban/ConflictModal.jsx`
