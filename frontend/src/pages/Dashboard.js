import React, { useState, useEffect } from 'react';
import { projectService, taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  ClipboardList,
} from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await taskService.getDashboardStats();
        const projectsRes = await projectService.getAll();

        setStats(statsRes?.data?.data || {});

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
      icon: ClipboardList,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      title: 'To Do',
      value: stats.todoTasks || 0,
      icon: Clock,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks || 0,
      icon: Zap,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Completed',
      value: stats.completedTasks || 0,
      icon: CheckCircle,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks || 0,
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
            icon={card.icon}
            color={card.color}
            iconColor={card.iconColor}
          />
        ))}
      </div>

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
  icon: Icon,
  color,
  iconColor,
}) => {
  return (
    <div className={`rounded-lg border-2 p-4 ${color}`}>
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
    </div>
  );
};

export default Dashboard;