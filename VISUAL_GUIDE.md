# Team Task Manager - Visual Guide

## 🏢 Application Overview

```
┌─────────────────────────────────────────────────────────┐
│          Team Task Manager Application                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Frontend   │  HTTP   │   Backend    │             │
│  │   (React)    │◄───────►│  (Express)   │             │
│  │  Port 3000   │         │  Port 5000   │             │
│  └──────────────┘         └──────────────┘             │
│         ▲                         ▲                     │
│         │                         │                    │
│         │                         ▼                    │
│         │                   ┌──────────────┐           │
│         │                   │   MongoDB    │           │
│         │                   │  Database    │           │
│         │                   └──────────────┘           │
│         │                                              │
│         └──────────────────────────────────────────┐   │
│                  localStorage                      │   │
│            (JWT Token + User Data)                 │   │
│                                                     │   │
└─────────────────────────────────────────────────────┘
```

## 📱 User Interfaces

### 1. Authentication Pages
```
┌─────────────────────────────┐
│   Login                     │
│                             │
│   Email: [_____________]    │
│   Password: [________]      │
│                             │
│   [Sign In Button]          │
│                             │
│   Don't have account?       │
│   → Sign up                 │
└─────────────────────────────┘
```

### 2. Dashboard
```
┌──────────────────────────────────────────┐
│  Sidebar    │  Dashboard                 │
│  ──────     │  ──────────                │
│  Dashboard  │  Welcome back, Admin!      │
│  Projects   │                            │
│  My Tasks   │  ┌─────┬─────┬─────┬─────┐│
│  Users      │  │ 10  │  3  │  5  │  2  ││
│             │  │Tasks│Todo │Done │Over ││
│             │  └─────┴─────┴─────┴─────┘│
│             │                            │
│             │  Your Projects             │
│             │  ┌──────────────────────┐ │
│             │  │ Project 1 (5 tasks)  │ │
│             │  └──────────────────────┘ │
│             │  ┌──────────────────────┐ │
│             │  │ Project 2 (3 tasks)  │ │
│             │  └──────────────────────┘ │
└──────────────────────────────────────────┘
```

### 3. Projects Page
```
┌──────────────────────────────────────────┐
│  Projects              [+ New Project]   │
│                                          │
│  ┌──────────────┐ ┌──────────────┐      │
│  │ Project 1    │ │ Project 2    │      │
│  │              │ │              │      │
│  │ 5 tasks      │ │ 3 tasks      │      │
│  │ 2 members    │ │ 1 member     │      │
│  │              │ │              │      │
│  │ Active       │ │ Active       │      │
│  │[Edit][Delete]│ │[Edit][Delete]│      │
│  └──────────────┘ └──────────────┘      │
│                                          │
└──────────────────────────────────────────┘
```

### 4. Tasks Page
```
┌──────────────────────────────────────────┐
│  My Tasks    [All] [To Do] [Done] [+New] │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ ■ Task 1                         │   │
│  │   Description...                 │   │
│  │   2024-01-15 | High | In Progress│   │
│  │   [Edit] [Delete]                │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ ■ Task 2                         │   │
│  │   Description...                 │   │
│  │   2024-01-10 | Medium | ⚠ Overdue│   │
│  │   [Edit] [Delete]                │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

### Authentication Flow
```
User Input
    ↓
Validate Email & Password
    ↓
Send to Backend
    ↓
Hash Password & Compare
    ↓
Generate JWT Token
    ↓
Store Token in localStorage
    ↓
Navigate to Dashboard
```

### Create Task Flow
```
Admin Clicks "New Task"
    ↓
Modal Opens
    ↓
Fill: Title, Description, Project, Assignee, Priority, Due Date
    ↓
Submit Form
    ↓
Send POST /api/tasks
    ↓
Backend Creates Task in MongoDB
    ↓
Return Task Data
    ↓
Update UI & Show Confirmation
```

### Update Task Status (Member)
```
Member Clicks Task
    ↓
Edit Modal Opens (Status Only)
    ↓
Change Status: To Do → In Progress
    ↓
Submit
    ↓
Send PATCH /api/tasks/:id
    ↓
Backend Verifies Permission
    ↓
Update Task Status
    ↓
Return Updated Task
    ↓
Refresh Task List
```

## 🗄️ Database Schema

### User Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "Admin" | "Member",
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection
```
{
  _id: ObjectId,
  title: String,
  description: String,
  admin: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  tasks: [ObjectId] (ref: Task),
  status: "Active" | "Completed" | "Archived",
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```
{
  _id: ObjectId,
  title: String,
  description: String,
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  status: "To Do" | "In Progress" | "Completed",
  priority: "Low" | "Medium" | "High",
  dueDate: Date,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authorization Roles

### Admin Permissions
```
Projects:
  ✅ Create Projects
  ✅ Edit Projects
  ✅ Delete Projects
  ✅ Add Members
  ✅ Remove Members

Tasks:
  ✅ Create Tasks
  ✅ Edit Tasks
  ✅ Delete Tasks
  ✅ Assign Tasks
  ✅ Change Status

Dashboard:
  ✅ View All Stats
  ✅ All Users Tasks
```

### Member Permissions
```
Projects:
  ✅ View Assigned Projects
  ❌ Cannot Create/Edit/Delete

Tasks:
  ✅ View Assigned Tasks
  ✅ Change Own Task Status
  ❌ Cannot Create/Edit/Delete
  ❌ Cannot Assign Tasks

Dashboard:
  ✅ View Own Stats Only
  ✅ Own Tasks Only
```

## 📊 Component Hierarchy

```
App
├── Router
├── AuthProvider
│   └── Protected Routes
│       ├── Sidebar
│       ├── Dashboard
│       ├── Projects
│       │   ├── ProjectModal
│       │   └── ProjectCard[]
│       └── Tasks
│           ├── TaskModal
│           └── TaskCard[]
├── Login
└── Register
```

## 🎨 Color Scheme

```
Primary Colors:
  🔵 Primary Blue: #0ea5e9
  🔵 Dark Blue: #0369a1

Status Colors:
  🟢 Completed: Green (#22c55e)
  🔵 In Progress: Blue (#3b82f6)
  🟡 To Do: Yellow (#eab308)
  ⚫ Archived: Gray (#6b7280)

Priority Colors:
  🔴 High: Red (#ef4444)
  🟠 Medium: Orange (#f97316)
  🟢 Low: Green (#84cc16)

Alert Colors:
  🔴 Error: Red
  🟡 Warning: Yellow
  🔵 Info: Blue
  🟢 Success: Green
```

## 🔗 API Request/Response

### Login Request
```
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77...",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "Admin"
  }
}
```

### Create Task Request
```
POST /api/tasks
{
  "title": "Build API",
  "description": "Create REST API",
  "project": "507f1f77...",
  "assignedTo": "507f1f78...",
  "priority": "High",
  "dueDate": "2024-01-20"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "507f1f79...",
    "title": "Build API",
    ...
  }
}
```

## 📱 Mobile Responsive Breakpoints

```
Mobile (< 640px)
┌────────────────┐
│ ☰ |Dashboard   │  Mobile menu hamburger
├────────────────┤
│ Content        │  Full width content
│                │
└────────────────┘

Tablet (640px - 1024px)
┌──────────────────────┐
│ ☰ |  Dashboard       │
├──────────────────────┤
│ Content              │
│                      │
└──────────────────────┘

Desktop (> 1024px)
┌────────┬──────────────────────┐
│Sidebar │  Dashboard           │
│        │                      │
│        │  Content             │
│        │                      │
└────────┴──────────────────────┘
```

## ⚙️ Technology Stack

```
Frontend Layer:
┌──────────────────────┐
│  React 18.2.0        │
│  React Router 6.16.0 │
│  Tailwind CSS 3.3.3  │
│  Lucide Icons 0.26.3 │
│  Axios 1.5.0         │
└──────────────────────┘
         ▲
         │ HTTP/HTTPS
         ▼
Backend Layer:
┌──────────────────────┐
│  Express 4.18.2      │
│  Node.js             │
│  JWT 9.0.2           │
│  bcryptjs 2.4.3      │
└──────────────────────┘
         ▲
         │ Query/Update
         ▼
Database Layer:
┌──────────────────────┐
│  MongoDB 7.x         │
│  Mongoose 7.5.0      │
└──────────────────────┘
```

## 🚀 Deployment Architecture

```
Frontend (Vercel/Netlify)
  ↓
  API Request
  ↓
Backend (Heroku/Render)
  ↓
  Query
  ↓
MongoDB Atlas
  ↓
  Data Response
  ↓
Backend API Response
  ↓
Frontend Renders UI
```

---

This visual guide helps understand the complete system architecture!
