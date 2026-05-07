const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
exports.getTeams = async (req, res) => {
  try {
    let teams;

    if (req.user.role === 'Admin') {
      teams = await Project.find().populate('admin members tasks');
    } else {
      // Get teams where user is admin or member
      teams = await Project.find({
        $or: [
          { admin: req.user.id },
          { members: req.user.id },
        ],
      }).populate('admin members tasks');
    }

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
exports.getTeam = async (req, res) => {
  try {
    const team = await Project.findById(req.params.id)
      .populate('admin members tasks');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create team
// @route   POST /api/teams
// @access  Private/Admin
exports.createTeam = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Team title is required',
      });
    }

    const team = await Project.create({
      title,
      description,
      dueDate,
      admin: req.user.id,
      members: [req.user.id],
    });

    await team.populate('admin members');

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update team
// @route   PATCH /api/teams/:id
// @access  Private/Admin
exports.updateTeam = async (req, res) => {
  try {
    let team = await Project.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this team',
      });
    }

    team = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('admin members tasks');

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private/Admin
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Project.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this team',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get team members
// @route   GET /api/teams/:id/members
// @access  Private
exports.getTeamMembers = async (req, res) => {
  try {
    const team = await Project.findById(req.params.id)
      .populate('admin members', 'name email role');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      count: team.members.length,
      admin: team.admin,
      data: team.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private/Admin
exports.addTeamMember = async (req, res) => {
  try {
    const { memberId, email } = req.body;
    const team = await Project.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members to this team',
      });
    }

    // Find user by memberId or email
    let user;
    if (memberId) {
      user = await User.findById(memberId);
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either memberId or email',
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (team.members.some((memberId) => memberId.toString() === user._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this team',
      });
    }

    team.members.push(user._id);
    await team.save();
    await team.populate('admin members');

    res.status(200).json({
      success: true,
      message: 'Member added to team successfully',
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:memberId
// @access  Private/Admin
exports.removeTeamMember = async (req, res) => {
  try {
    const team = await Project.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members from this team',
      });
    }

    // Don't remove the admin
    if (req.params.memberId === team.admin.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove team admin from the team',
      });
    }

    team.members = team.members.filter(
      (memberId) => memberId.toString() !== req.params.memberId
    );
    await team.save();
    await team.populate('admin members');

    res.status(200).json({
      success: true,
      message: 'Member removed from team successfully',
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get team statistics
// @route   GET /api/teams/:id/stats
// @access  Private
exports.getTeamStats = async (req, res) => {
  try {
    const team = await Project.findById(req.params.id).populate('tasks');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    const tasks = team.tasks || [];
    const stats = {
      totalMembers: team.members.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'Completed').length,
      inProgressTasks: tasks.filter((t) => t.status === 'In Progress').length,
      toDoTasks: tasks.filter((t) => t.status === 'To Do').length,
      highPriorityTasks: tasks.filter((t) => t.priority === 'High').length,
      completionRate: tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.status === 'Completed').length / tasks.length) * 100
          )
        : 0,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
