# Architecture & Development Guide

## 🏗️ Architecture Overview

### Frontend Architecture
```
┌─────────────────────────────────────┐
│      React Application              │
├─────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┐ │
│  │Dashboard │Projects  │ Tasks    │ │
│  └──────────┴──────────┴──────────┘ │
├─────────────────────────────────────┤
│  ┌──────────────────────────────┐   │
│  │    AuthContext (State)       │   │
│  └──────────────────────────────┘   │
├─────────────────────────────────────┤
│  ┌──────────────────────────────┐   │
│  │   API Service (Axios)        │   │
│  │   - authService              │   │
│  │   - projectService           │   │
│  │   - taskService              │   │
│  └──────────────────────────────┘   │
├─────────────────────────────────────┤
│  Backend API (http://localhost:5000)│
└─────────────────────────────────────┘
```

### Backend Architecture
```
┌──────────────────────────┐
│   Express Server         │
├──────────────────────────┤
│  Routes                  │
│  ├─ /api/auth            │
│  ├─ /api/projects        │
│  └─ /api/tasks           │
├──────────────────────────┤
│  Controllers             │
│  ├─ authController       │
│  ├─ projectController    │
│  └─ taskController       │
├──────────────────────────┤
│  Middleware              │
│  ├─ auth (JWT protect)   │
│  ├─ authorize (RBAC)     │
│  └─ validation           │
├──────────────────────────┤
│  Models (Mongoose)       │
│  ├─ User                 │
│  ├─ Project              │
│  └─ Task                 │
├──────────────────────────┤
│  MongoDB Database        │
└──────────────────────────┘
```

## 🔄 Data Flow

### Authentication Flow
```
User Input (Login)
    ↓
API Call (authService.login)
    ↓
Backend: POST /api/auth/login
    ↓
Controller: Hash verification with bcrypt
    ↓
Generate JWT Token
    ↓
Response: Token + User Data
    ↓
Store Token in localStorage
    ↓
Update AuthContext
    ↓
Redirect to Dashboard
```

### Task Update Flow
```
User Action (Update Task Status)
    ↓
TaskModal Component
    ↓
API Call (taskService.update)
    ↓
Axios adds JWT token from localStorage
    ↓
Backend: PATCH /api/tasks/:id
    ↓
Middleware: Verify JWT & Check Authorization
    ↓
Controller: Update task in MongoDB
    ↓
Return updated task
    ↓
Update UI
    ↓
Refresh task list
```

## 🔐 Authentication & Authorization

### JWT Implementation
```javascript
// Backend: Generate Token
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE }
);

// Frontend: Add to Request
config.headers.Authorization = `Bearer ${token}`;

// Backend: Verify Token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id);
```

### Role-Based Access Control (RBAC)
```javascript
// Middleware to check role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} not authorized`
      });
    }
    next();
  };
};

// Usage in routes
router.post('/projects', authorize('Admin'), createProject);
```

## 📋 API Response Format

All API responses follow a standard format:

### Success Response
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "Admin"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

### List Response
```json
{
  "success": true,
  "count": 5,
  "data": [
    { "id": "...", "title": "..." },
    { "id": "...", "title": "..." }
  ]
}
```

## 🧪 Testing Guide

### Manual Testing Scenarios

#### Test 1: User Registration
1. Go to `/register`
2. Fill in name, email, password
3. Click "Create Account"
4. Verify redirect to dashboard

#### Test 2: Admin Creates Project
1. Login as admin
2. Go to Projects
3. Click "New Project"
4. Fill details and submit
5. Verify project appears in list

#### Test 3: Admin Assigns Task
1. Go to Tasks → New Task
2. Fill task details
3. Assign to a member
4. Set priority and due date
5. Verify task created

#### Test 4: Member Updates Task Status
1. Login as member
2. Go to "My Tasks"
3. Click Edit on a task
4. Change status to "In Progress"
5. Verify status updates

#### Test 5: Overdue Task Alert
1. Create task with past due date
2. Task status not "Completed"
3. Verify red alert badge shows

## 🔧 Adding New Features

### Step-by-Step: Add a New Task Field

#### Backend (Add status history)

1. **Update Model** (`models/Task.js`):
```javascript
statusHistory: [{
  status: String,
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}]
```

2. **Update Controller** (`controllers/taskController.js`):
```javascript
exports.updateTask = async (req, res) => {
  // ... existing code ...
  
  task.statusHistory.push({
    status: req.body.status,
    changedBy: req.user.id
  });
  
  // ... rest of code ...
};
```

3. **Update Route** (no changes needed)

#### Frontend (Display history)

1. **Create Component** (`components/TaskHistory.js`):
```javascript
const TaskHistory = ({ task }) => {
  return (
    <div>
      {task.statusHistory?.map((entry) => (
        <div key={entry._id}>
          {entry.status} - {formatDate(entry.changedAt)}
        </div>
      ))}
    </div>
  );
};
```

2. **Import in Task View**:
```javascript
import TaskHistory from '../components/TaskHistory';
```

## 📦 Dependency Management

### Important Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.0 | UI Framework |
| react-router-dom | 6.16.0 | Routing |
| axios | 1.5.0 | HTTP Client |
| tailwindcss | 3.3.3 | CSS Framework |
| express | 4.18.2 | Backend Framework |
| mongoose | 7.5.0 | MongoDB ODM |
| jsonwebtoken | 9.0.2 | JWT Authentication |
| bcryptjs | 2.4.3 | Password Hashing |

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package@latest
```

## 🚀 Performance Optimization Tips

### Frontend
1. **Code Splitting**
```javascript
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

2. **Memoization**
```javascript
const TaskItem = React.memo(({ task }) => {
  return <div>{task.title}</div>;
});
```

### Backend
1. **Database Indexing**
```javascript
// Add to models
schema.index({ email: 1 }); // For User
schema.index({ project: 1 }); // For Tasks
```

2. **Query Optimization**
```javascript
// Use populate efficiently
Task.find().populate('project').populate('assignedTo');

// Add select to exclude unnecessary fields
User.find().select('name email role -password');
```

## 🐛 Debugging Tips

### Frontend Debugging
1. **React Developer Tools** - Chrome extension
2. **Redux DevTools** - For state management
3. **Network Tab** - Inspect API calls
4. **Console** - Check for errors
5. **Debugger statement**:
```javascript
debugger; // Stops execution in Chrome DevTools
```

### Backend Debugging
1. **Console.log** - Print values
2. **Postman** - Test API endpoints
3. **MongoDB Compass** - View database
4. **Error Stack Traces** - Check error logs
5. **Node debugger**:
```bash
node --inspect server.js
```

## 📝 Code Style Guide

### JavaScript/React
- Use ES6+ features (arrow functions, destructuring)
- Use meaningful variable names
- Add comments for complex logic
- Use semicolons
- 2-space indentation

### CSS/Tailwind
- Use Tailwind utility classes
- Avoid inline styles
- Use consistent spacing
- Follow mobile-first approach

### Git Commits
```
Format: type(scope): subject

Examples:
- feat(auth): add JWT authentication
- fix(tasks): resolve task update bug
- docs: update README
- refactor(api): simplify error handling
```

## 🔗 Related Resources

- [React Best Practices](https://react.dev/learn)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Design Patterns](https://www.mongodb.com/docs/manual/applications/data-models/)
- [JWT Security](https://tools.ietf.org/html/rfc8725)
- [REST API Best Practices](https://restfulapi.net/)

---

**Happy coding! 🚀**
