const express = require('express');
const {
  getProjects,
  getProject,
  getProjectMembers,
  getProjectTasks,
  getProjectStats,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.get('/:id/members', getProjectMembers);
router.get('/:id/tasks', getProjectTasks);
router.get('/:id/stats', getProjectStats);
router.get('/:id', getProject);

router.post('/', authorize('Admin'), createProject);
router.patch('/:id', authorize('Admin'), updateProject);
router.delete('/:id', authorize('Admin'), deleteProject);

router.post('/:id/members', authorize('Admin'), addMember);
router.delete('/:id/members/:memberId', authorize('Admin'), removeMember);

module.exports = router;
