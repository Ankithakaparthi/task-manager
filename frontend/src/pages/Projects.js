import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  ClipboardList,
} from 'lucide-react';
import ProjectModal from '../components/ProjectModal';

const Projects = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data) => {
    try {
      await projectService.create(data);

      setShowModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (id, data) => {
    try {
      await projectService.update(id, data);

      setEditingProject(null);
      setShowModal(false);

      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmDelete) return;

    try {
      await projectService.delete(id);

      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Projects
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your team projects
          </p>
        </div>

        {user?.role === 'Admin' && (
          <button
            onClick={() => {
              setEditingProject(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="h-5 w-5" />
            New Project
          </button>
        )}
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600">
            No projects yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              {/* Title */}
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                {project.title}
              </h2>

              {/* Description */}
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {project.description || 'No description'}
              </p>

              {/* Stats */}
              <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project.members?.length || 1} members
                </span>

                <span className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" />
                  {project.tasks?.length || 0} tasks
                </span>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    project.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status || 'Pending'}
                </span>
              </div>

              {/* Actions */}
              {user?.role === 'Admin' &&
                project?.admin?._id === user?.id && (
                  <div className="flex gap-2 border-t border-gray-200 pt-4">
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setShowModal(true);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary-200 px-3 py-2 text-primary-600 transition-colors hover:bg-primary-50"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteProject(project._id)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSubmit={
            editingProject
              ? handleUpdateProject
              : handleCreateProject
          }
        />
      )}
    </div>
  );
};

export default Projects;