const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Member') {
      query = { assignedTo: req.user.id };
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

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
exports.getTasksByProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const isProjectMember = project.members.some(
      (memberId) => memberId.toString() === req.user.id
    );

    if (
      req.user.role !== 'Admin' &&
      project.admin.toString() !== req.user.id &&
      !isProjectMember
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access tasks for this project',
      });
    }

    const query = { project: req.params.projectId };
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

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project assignedTo createdBy');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate, priority } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const isAssigneeProjectMember = projectExists.members.some(
      (memberId) => memberId.toString() === assignedTo
    );

    if (!isAssigneeProjectMember) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must be a member of the project',
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      priority,
      createdBy: req.user.id,
    });

    await task.populate('project assignedTo createdBy');

    // Add task to project
    projectExists.tasks.push(task._id);
    await projectExists.save();

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task
// @route   PATCH /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Allow task update if user is Admin or the task assignee
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    // Members can only update status
    if (req.user.role === 'Member') {
      const { status } = req.body;
      task.status = status;
    } else {
      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await task.save();
    await task.populate('project assignedTo createdBy');

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (req.user.role !== 'Admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    // Remove task from project
    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: task._id },
    });

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' ? {} : { assignedTo: req.user.id };

    const allTasks = await Task.find(query).sort({ createdAt: -1 });
    const completedTasks = await Task.find({
      ...query,
      status: 'Completed',
    });
    const inProgressTasks = await Task.find({
      ...query,
      status: 'In Progress',
    });
    const todoTasks = await Task.find({
      ...query,
      status: 'To Do',
    });

    const now = new Date();
    const overdueTasks = await Task.find({
      ...query,
      dueDate: { $lt: now },
      status: { $ne: 'Completed' },
    });

    res.status(200).json({
      success: true,
      data: {
        totalTasks: allTasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        todoTasks: todoTasks.length,
        overdueTasks: overdueTasks.length,
        recentTasks: allTasks.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
