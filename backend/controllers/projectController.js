const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

const getDocumentId = (documentOrId) => {
  return (documentOrId?._id || documentOrId).toString();
};

const canAccessProject = (project, user) => {
  return (
    user.role === 'Admin' ||
    getDocumentId(project.admin) === user.id ||
    project.members.some((memberId) => getDocumentId(memberId) === user.id)
  );
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('admin members tasks');
    } else {
      projects = await Project.find({
        $or: [
          { admin: req.user.id },
          { members: req.user.id },
        ],
      }).populate('admin members tasks');
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin members tasks');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!canAccessProject(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get project members
// @route   GET /api/projects/:id/members
// @access  Private
exports.getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin members', 'name email role avatar isActive');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!canAccessProject(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    res.status(200).json({
      success: true,
      count: project.members.length,
      admin: project.admin,
      data: project.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get project tasks
// @route   GET /api/projects/:id/tasks
// @access  Private
exports.getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!canAccessProject(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    const query = { project: project._id };
    if (req.user.role === 'Member') {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate('project assignedTo createdBy')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/:id/stats
// @access  Private
exports.getProjectStats = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (!canAccessProject(project, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    const tasks = await Task.find({ project: project._id });
    const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
    const now = new Date();

    res.status(200).json({
      success: true,
      data: {
        totalMembers: project.members.length,
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks: tasks.filter((task) => task.status === 'In Progress').length,
        todoTasks: tasks.filter((task) => task.status === 'To Do').length,
        overdueTasks: tasks.filter(
          (task) => task.dueDate && task.dueDate < now && task.status !== 'Completed'
        ).length,
        completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const project = await Project.create({
      title,
      description,
      dueDate,
      admin: req.user.id,
      members: [req.user.id],
    });

    await project.populate('admin members');

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project
// @route   PATCH /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('admin members tasks');

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private/Admin
exports.addMember = async (req, res) => {
  try {
    const { memberId, email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members to this project',
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

    if (project.members.some((memberId) => memberId.toString() === user._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project',
      });
    }

    project.members.push(user._id);
    await project.save();
    await project.populate('admin members');

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:memberId
// @access  Private/Admin
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members from this project',
      });
    }

    if (req.params.memberId === project.admin.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project admin from the project',
      });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== req.params.memberId
    );

    await project.save();
    await project.populate('admin members');

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
