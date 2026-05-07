const express = require('express');
const {
  getTasks,
  getTasksByProject,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats/dashboard', getDashboardStats);
router.get('/', getTasks);
router.get('/project/:projectId', getTasksByProject);
router.get('/:id', getTask);

router.post('/', authorize('Admin'), createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
