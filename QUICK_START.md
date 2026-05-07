# Quick Start Guide

## 🚀 One-Command Setup

### For Windows Users

**Option 1: Run PowerShell Setup Script**
```powershell
# Navigate to project directory
cd team-management

# Run setup script
.\setup.ps1
```

**Option 2: Manual Setup**
```bash
# Backend Setup
cd backend
npm install
npm run dev

# In a new terminal - Frontend Setup
cd frontend
npm install
npm start
```

### For macOS/Linux Users

```bash
# Navigate to project directory
cd team-management

# Backend Setup
cd backend
npm install
npm run dev

# In a new terminal - Frontend Setup
cd frontend
npm install
npm start
```

## ✅ Setup Checklist

- [ ] MongoDB is installed and running
- [ ] Backend dependencies installed (`npm install` in `/backend`)
- [ ] Backend `.env` file configured
- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend dependencies installed (`npm install` in `/frontend`)
- [ ] Frontend running on `http://localhost:3000`

## 🔗 Access the Application

1. **Open Browser:** `http://localhost:3000`
2. **Login with Demo Credentials:**
   - Admin: `admin@example.com` / `password`
   - Member: `member@example.com` / `password`

## 📝 First Time Setup

### 1. Database Setup

**Option A: Local MongoDB (Recommended for Development)**
```bash
# Windows - Download from https://www.mongodb.com/try/download/community
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `backend/.env`

### 2. Create Admin User (Optional)

The system comes with demo accounts, but you can create a new admin:

1. Register a new account at `http://localhost:3000/register`
2. Manually update the user role in MongoDB:
```javascript
db.users.updateOne(
  { email: 'your-email@example.com' },
  { $set: { role: 'Admin' } }
)
```

## 🎯 Testing the Application

### Create a Sample Project (Admin)
1. Login as admin
2. Go to Projects → New Project
3. Fill in project details
4. Add members to the project

### Create a Sample Task (Admin)
1. Go to Tasks → New Task
2. Select project
3. Assign to a member
4. Set priority and due date

### Update Task Status (Member)
1. Login as member
2. Go to My Tasks
3. Click Edit on a task
4. Change status to "In Progress" or "Completed"

## 📊 Dashboard Overview

The dashboard shows:
- Total tasks count
- Tasks by status (To Do, In Progress, Completed)
- Overdue tasks
- Completion percentage
- Recent projects
- Quick statistics

## ⚙️ Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### Frontend (.env - Optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🆘 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Try: `mongosh` or `mongo` in terminal to test connection

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: "CORS error"
**Solution:**
- Backend CORS is pre-configured
- Check if backend is running on port 5000

### Issue: "Module not found"
**Solution:**
- Delete `node_modules` folder
- Run `npm install` again

## 📱 Testing on Mobile

1. Find your computer's IP address:
   ```bash
   ipconfig (Windows)
   ifconfig (macOS/Linux)
   ```

2. Access on mobile browser:
   ```
   http://<your-ip>:3000
   ```

3. Make sure mobile and computer are on same WiFi network

## 🔐 Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Use strong passwords
- Enable MongoDB authentication in production

## 📚 Project Documentation

Full documentation available in [README.md](../README.md)

---

**Need help?** Check the main README.md for more detailed information!
