import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ task, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const getId = (value) => value?._id || value?.id || value;
  const userId = getId(user)?.toString();
  const assignedUserId = task?.assignedTo?._id || task?.assignedTo?.id || task?.assignedTo;
  const isMember = user?.role === 'Member';
  const isOwnTask = task && assignedUserId?.toString() === userId;
  const canEditDetails = !isMember;
  const canEditStatus = !isMember || isOwnTask;

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    project: getId(task?.project) || '',
    assignedTo: getId(task?.assignedTo) || '',
    status: task?.status || 'To Do',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getAll();

        if (Array.isArray(res?.data?.data)) {
          setProjects(res.data.data);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  // Fetch team members when project is selected
  useEffect(() => {
    if (formData.project) {
      const selectedProject = projects.find((p) => p._id === formData.project);
      if (selectedProject && selectedProject.members) {
        setTeamMembers(selectedProject.members);
      } else {
        setTeamMembers([]);
      }
    } else {
      setTeamMembers([]);
    }
  }, [formData.project, projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isMember && !isOwnTask) {
      return;
    }

    const payload = isMember ? { status: formData.status } : formData;

    if (task?._id) {
      onSubmit(task._id, payload);
    } else {
      onSubmit(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Task Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              disabled={!canEditDetails}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={3}
              disabled={!canEditDetails}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Project *
            </label>

            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
              disabled={!canEditDetails}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary-500 focus:outline-none"
            >
              <option value="">Select a project</option>

              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Assign To *
            </label>

            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              disabled={!canEditDetails}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary-500 focus:outline-none"
            >
              <option value="">Select team member</option>

              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={!canEditDetails}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary-500 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!canEditStatus}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary-500 focus:outline-none"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={!canEditDetails}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canEditStatus}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
