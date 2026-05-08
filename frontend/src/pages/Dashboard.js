import React, { useState, useEffect } from 'react';
import { projectService, taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  ClipboardList,
  Calendar,
  User,
} from 'lucide-react';
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  isOverdue,
} from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskGroup, setSelectedTaskGroup] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await taskService.getDashboardStats();
        const projectsRes = await projectService.getAll();
        const tasksRes = await taskService.getAll();

        setStats(statsRes?.data?.data || {});
        setTasks(Array.isArray(tasksRes?.data?.data) ? tasksRes.data.data : []);

        if (Array.isArray(projectsRes?.data?.data)) {
          setProjects(projectsRes.data.data);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks || 0,
      group: 'all',
      icon: ClipboardList,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      title: 'To Do',
      value: stats.todoTasks || 0,
      group: 'todo',
      icon: Clock,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks || 0,
      group: 'inProgress',
      icon: Zap,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Completed',
      value: stats.completedTasks || 0,
      group: 'completed',
      icon: CheckCircle,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks || 0,
      group: 'overdue',
      icon: AlertCircle,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
    },
  ];

  const completionRate =
    stats.totalTasks > 0
      ? Math.round(
          (stats.completedTasks / stats.totalTasks) * 100
        )
      : 0;

  const taskGroups = {
    all: {
      title: 'All Tasks',
      emptyMessage: 'No tasks available yet.',
      tasks,
    },
    todo: {
      title: 'To Do Tasks',
      emptyMessage: 'No to do tasks right now.',
      tasks: tasks.filter((task) => task.status === 'To Do'),
    },
    inProgress: {
      title: 'In Progress Tasks',
      emptyMessage: 'No tasks are currently in progress.',
      tasks: tasks.filter((task) => task.status === 'In Progress'),
    },
    completed: {
      title: 'Completed Tasks',
      emptyMessage: 'No completed tasks yet.',
      tasks: tasks.filter((task) => task.status === 'Completed'),
    },
    overdue: {
      title: 'Overdue Tasks',
      emptyMessage: 'No overdue tasks. Nice work.',
      tasks: tasks.filter(
        (task) => isOverdue(task.dueDate) && task.status !== 'Completed'
      ),
    },
  };

  const activeTaskList = selectedTaskGroup
    ? taskGroups[selectedTaskGroup]
    : null;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>

        <p className="mt-2 text-gray-600">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            isActive={selectedTaskGroup === card.group}
            icon={card.icon}
            color={card.color}
            iconColor={card.iconColor}
            onClick={() => setSelectedTaskGroup(card.group)}
          />
        ))}
      </div>

      {/* Task Preview */}
      {activeTaskList && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeTaskList.title}
              </h2>

              <p className="text-sm text-gray-600">
                Showing tasks from the dashboard card you selected.
              </p>
            </div>

            <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              {activeTaskList.tasks.length} tasks
            </span>
          </div>

          {activeTaskList.tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
              {activeTaskList.emptyMessage}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {activeTaskList.tasks.map((task) => (
                <DashboardTaskItem key={task._id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Projects */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Your Projects
            </h2>

            {projects.length === 0 ? (
              <p className="text-gray-500">
                No projects yet. Create one to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project._id}
                    className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {project.description || 'No description'}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded bg-primary-50 px-2 py-1 text-xs font-medium text-primary-600">
                        {project.tasks?.length || 0} tasks
                      </span>

                      <span className="text-xs text-gray-500">
                        {project.members?.length || 1} members
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Quick Stats
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Completion Rate
              </span>

              <span className="text-2xl font-bold text-primary-600">
                {completionRate}%
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${completionRate}%`,
                }}
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">
                  {projects.length}
                </span>{' '}
                active projects
              </p>

              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">
                  {stats.overdueTasks || 0}
                </span>{' '}
                overdue tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  isActive,
  icon: Icon,
  color,
  iconColor,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${color} ${
        isActive ? 'ring-2 ring-primary-500 ring-offset-2' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex items-center justify-center">
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>
      </div>
    </button>
  );
};

const DashboardTaskItem = ({ task }) => {
  const projectTitle = task.project?.title || 'No project';
  const assigneeName = task.assignedTo?.name || 'Unassigned';
  const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';

  return (
    <div
      className={`rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md ${
        overdue ? 'border-red-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900">
            {task.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {task.description || 'No description'}
          </p>
        </div>

        <span
          className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority} Priority
        </span>

        {overdue && (
          <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            Overdue
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <ClipboardList className="h-4 w-4" />
          {projectTitle}
        </span>

        <span className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {assigneeName}
        </span>

        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
