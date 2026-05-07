# Team Task Manager

A modern, full-stack team task management application built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Role-based access control (Admin & Member)
- Protected routes on both frontend and backend

### Admin Features
- Create and manage projects
- Add/remove team members
- Create and assign tasks to users
- Full task management (edit, delete, update status)
- User and project management

### Member Features
- View assigned projects and tasks
- Update task status
- View dashboard with personal task statistics

### Dashboard
- Total tasks overview
- Task statistics (To Do, In Progress, Completed)
- Overdue task alerts
- Quick stats and completion rate
- Recent projects view

### Project Management
- Create, update, and delete projects
- Add team members to projects
- View project details and tasks
- Track project progress

### Task Management
- Create tasks within projects
- Set task priority (Low, Medium, High)
- Set due dates and track deadlines
- Update task status
- Overdue task notifications
- Task filtering and sorting

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📁 Project Structure

```
team-management/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.js
    │   │   ├── Sidebar.js
    │   │   ├── ProjectModal.js
    │   │   └── TaskModal.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Projects.js
    │   │   └── Tasks.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   ├── index.css
    │   └── utils/
    │
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file with the following:
   ```
   MONGODB_URI=mongodb://localhost:27017/team-task-manager
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   brew services start mongodb-community
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will open at `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `GET /api/projects` - Get all projects (Protected)
- `GET /api/projects/:id` - Get single project (Protected)
- `POST /api/projects` - Create project (Protected/Admin)
- `PATCH /api/projects/:id` - Update project (Protected/Admin)
- `DELETE /api/projects/:id` - Delete project (Protected/Admin)
- `POST /api/projects/:id/members` - Add member (Protected/Admin)
- `DELETE /api/projects/:id/members/:memberId` - Remove member (Protected/Admin)

### Tasks
- `GET /api/tasks` - Get all tasks (Protected)
- `GET /api/tasks/project/:projectId` - Get project tasks (Protected)
- `GET /api/tasks/:id` - Get single task (Protected)
- `POST /api/tasks` - Create task (Protected/Admin)
- `PATCH /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)
- `GET /api/tasks/stats/dashboard` - Get dashboard stats (Protected)

## 🔐 Default Demo Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** password

### Member Account
- **Email:** member@example.com
- **Password:** password

> **Note:** These are for development only. Change credentials in production.

## 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Sidebar Navigation** - Easy access to all sections
- **Dark-aware Colors** - Professional color scheme with primary blue theme
- **Smooth Animations** - Transitions and hover effects
- **Modal Dialogs** - Clean create/edit interfaces
- **Status Indicators** - Visual task status badges
- **Priority Levels** - Color-coded task priorities
- **Overdue Alerts** - Visual indicators for overdue tasks
- **Loading States** - Spinner animations during data fetching

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- Protected API endpoints
- Input validation with express-validator
- CORS enabled for secure cross-origin requests

## 📊 Database Models

### User Schema
- id, name, email, password (hashed), role, avatar, isActive
- Timestamps (createdAt, updatedAt)

### Project Schema
- id, title, description, admin, members[], tasks[], status, dueDate
- Timestamps

### Task Schema
- id, title, description, project, assignedTo, status, priority, dueDate, createdBy
- Timestamps

## 🚀 Deployment

### Backend (Heroku/Render)
1. Add production environment variables
2. Deploy repository
3. Set up MongoDB Atlas connection

### Frontend (Vercel/Netlify)
1. Set `REACT_APP_API_URL` to production API
2. Deploy repository
3. Configure API proxy

## 📦 Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database name

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Errors
- Ensure backend CORS is properly configured
- Check API URL in frontend

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For issues, suggestions, or contributions, please open an issue or submit a pull request.

---

**Built with ❤️ for efficient team task management**
