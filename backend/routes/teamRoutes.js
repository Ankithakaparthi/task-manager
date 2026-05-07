const express = require('express');
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  getTeamStats,
} = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Teams CRUD
router.get('/', getTeams);
router.post('/', authorize('Admin'), createTeam);
router.get('/:id', getTeam);
router.patch('/:id', authorize('Admin'), updateTeam);
router.delete('/:id', authorize('Admin'), deleteTeam);

// Team Members
router.get('/:id/members', getTeamMembers);
router.post('/:id/members', authorize('Admin'), addTeamMember);
router.delete('/:id/members/:memberId', authorize('Admin'), removeTeamMember);

// Team Statistics
router.get('/:id/stats', getTeamStats);

module.exports = router;
