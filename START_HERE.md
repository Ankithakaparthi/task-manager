# 🎯 START HERE - Team Task Manager Setup Guide

Welcome! This guide will help you get started with the Team Task Manager application.

## ⚡ 5-Minute Quick Start

### Step 1: Prerequisites Check
```bash
# Verify Node.js is installed
node --version
npm --version

# You should see version numbers (e.g., v18.0.0)
```

### Step 2: Setup Backend
```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected: localhost:27017
```

### Step 3: Setup Frontend (New Terminal)
```bash
cd frontend
npm install
npm start
```

The browser will automatically open to `http://localhost:3000`

### Step 4: Login
Use these credentials:
- **Email:** admin@example.com
- **Password:** password

**Done!** 🎉 You're now running Team Task Manager locally!

---

## 📋 What Each Folder Contains

### 📂 Backend (`/backend`)
- **Express.js API server** running on port 5000
- **MongoDB integration** for data storage
- **Authentication & Authorization** logic
- **Project & Task management** APIs

### 📂 Frontend (`/frontend`)
- **React.js** user interface
- **Tailwind CSS** styling (modern design)
- **Responsive layout** (works on mobile/tablet/desktop)
- **Authentication screens** (login/register)

---

## 🎮 Using the Application

### As an Admin:
1. ✅ Create new projects
2. ✅ Add team members to projects
3. ✅ Create and assign tasks
4. ✅ Delete projects and tasks
5. ✅ View dashboard with all stats

### As a Member:
1. 👤 View assigned projects
2. 📋 View assigned tasks
3. ✏️ Update task status (To Do → In Progress → Completed)
4. 📊 View personal dashboard

---

## 🚨 Common Issues & Fixes

### ❌ MongoDB Connection Error
**Error:** `Connection to MongoDB failed`

**Fix:**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB:
   - **Windows:** `mongod` in Command Prompt
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongodb`

### ❌ Port 5000 Already in Use
**Error:** `listen EADDRINUSE: address already in use :::5000`

**Fix:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### ❌ Port 3000 Already in Use
**Error:** `Something is already running on port 3000`

**Fix:** Same as above, but for port 3000

### ❌ Module Not Found Error
**Error:** `Cannot find module 'react'`

**Fix:**
```bash
# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

### ❌ Cannot Login
**Error:** `Invalid credentials`

**Fix:**
1. Make sure MongoDB is running
2. Check that backend is running (`npm run dev`)
3. Try demo credentials:
   - Admin: `admin@example.com` / `password`
   - Member: `member@example.com` / `password`

---

## 📁 Project Structure Simplified

```
team-management/
├── backend/                    # API Server
│   ├── controllers/            # Business logic
│   ├── models/                 # Database schemas
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Auth & validation
│   ├── server.js               # Start here
│   ├── package.json            # Dependencies
│   └── .env                    # Configuration
│
├── frontend/                   # React App
│   ├── src/
│   │   ├── pages/              # Login, Dashboard, Projects, Tasks
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # API calls
│   │   ├── context/            # State management
│   │   └── App.js              # Main app
│   ├── package.json            # Dependencies
│   └── tailwind.config.js      # Styling
│
└── Documentation/              # Guides & Help
    ├── README.md               # Full overview
    ├── QUICK_START.md          # Setup guide
    ├── DEPLOYMENT.md           # Production deployment
    └── ARCHITECTURE.md         # Technical details
```

---

## 🔐 Understanding Authentication

1. **User Logs In**
   - Enters email and password
   - Backend verifies with MongoDB

2. **Receives JWT Token**
   - Backend generates secure token
   - Frontend stores in localStorage

3. **Token Sent with Every Request**
   - Browser automatically adds token to requests
   - Backend verifies token before responding

4. **Logout Clears Token**
   - Token removed from localStorage
   - User redirected to login page

---

## 🎨 Customization Ideas

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#YOUR_COLOR', // Change here
  }
}
```

### Change Application Name
1. Backend: Update in `frontend/src/components/Sidebar.js`
2. Frontend: Edit title in `frontend/public/index.html`

### Add New Features
1. Create backend API endpoint
2. Create frontend component
3. Connect with API service

---

## 📊 Demo Data

### Pre-created Users
```
Admin:
Email: admin@example.com
Password: password

Member:
Email: member@example.com
Password: password
```

### What You Can Do
- Login as admin and create projects
- Add member to projects
- Assign tasks to members
- Login as member and update tasks
- See stats on dashboard

---

## 🚀 Next Steps

### After Getting Started:

1. **Explore the Code**
   - Read comments in `backend/server.js`
   - Check `frontend/src/App.js`

2. **Create Demo Data**
   - Create a project
   - Add tasks
   - Try different actions

3. **Read Full Documentation**
   - `README.md` - Complete overview
   - `ARCHITECTURE.md` - How it works
   - `DEPLOYMENT.md` - Deploy to production

4. **Customize**
   - Change colors/styling
   - Add new fields
   - Extend functionality

---

## 📞 Help & Support

### Resources
- **GitHub Issues:** Report bugs
- **Documentation:** Check `/docs` folder
- **Stack Overflow:** Search your question
- **Google:** Your best friend 😊

### Documentation Files
- `README.md` - Complete guide
- `QUICK_START.md` - Fast setup
- `PROJECT_INDEX.md` - File directory
- `ARCHITECTURE.md` - Technical details
- `DEPLOYMENT.md` - Production guide
- `DELIVERABLES.md` - Features list

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB installed or account created
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login with demo credentials
- [ ] Can see dashboard
- [ ] Can create projects (as admin)
- [ ] Can view tasks (as member)

**All checked? You're ready to go!** 🚀

---

## 💡 Tips & Tricks

### Development Tips
- Use Chrome DevTools (F12) to debug
- Check Network tab for API calls
- Use React DevTools extension

### Common Tasks
- **Create Project:** Admin → Projects → New Project
- **Assign Task:** Admin → Tasks → New Task → Select Project & User
- **Update Task:** Member → My Tasks → Edit → Change Status

### Performance
- The app is optimized for modern browsers
- Works on mobile, tablet, and desktop
- Supports up to 100+ tasks per project

---

## 🎓 Learning Path

1. **Beginner:** Just explore and use the app
2. **Intermediate:** Read the code and documentation
3. **Advanced:** Make modifications and deploy
4. **Expert:** Build on top of it with new features

---

## 📧 Environment Variables

The backend uses a `.env` file for configuration:

```env
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**Change these values in production!**

---

## 🔄 Workflow

### User Story 1: Admin Creates Project
1. Login as admin
2. Go to "Projects"
3. Click "New Project"
4. Fill in title and description
5. Click "Create Project"
6. See project in list

### User Story 2: Admin Assigns Task
1. Go to "Tasks"
2. Click "New Task"
3. Select project
4. Select team member
5. Set priority and due date
6. Click "Create Task"

### User Story 3: Member Updates Task
1. Login as member
2. Go to "My Tasks"
3. Click "Edit" on a task
4. Change status to "In Progress"
5. Save changes
6. See status updated

---

## 🌟 Features at a Glance

✅ User Registration & Login  
✅ Role-Based Access Control  
✅ Project Management  
✅ Task Management  
✅ Dashboard with Statistics  
✅ Responsive Mobile Design  
✅ Professional UI  
✅ Secure Authentication  

---

## 🎉 You're All Set!

Welcome to Team Task Manager! Start exploring and creating awesome projects with your team.

**Happy coding!** 🚀

---

**Questions?** Check the documentation files or review the code comments.

**Next:** Open [README.md](./README.md) for the complete overview.
