import React, { useState, useEffect } from 'react';
import { X, Mail, AlertCircle } from 'lucide-react';
import { projectService, authService } from '../services/api';
import { Alert } from './common';

const AddMemberModal = ({ team, onClose, onMemberAdded }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Fetch available users
  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await authService.getAllUsers();

      if (res?.data?.data) {
        // Filter out users already in the team
        const teamMemberIds = team.members.map((m) => m._id);
        const filtered = res.data.data.filter(
          (user) => !teamMemberIds.includes(user._id) && user._id !== team.admin._id
        );
        setAvailableUsers(filtered);
      }
    } catch (err) {
      setError('Failed to load available users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the add member API
      await projectService.addMember(team._id, { memberId: selectedUserId });

      setSuccess(true);
      setSelectedUserId('');

      // Notify parent component and close after a short delay
      setTimeout(() => {
        onMemberAdded();
      }, 1000);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to add member to team'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Add Member to Team</h2>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {/* Team Info */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-600 uppercase">
              Adding to Team
            </p>
            <p className="text-sm font-semibold text-gray-900">{team.title}</p>
          </div>

          {/* Current Members Count */}
          <div className="text-sm text-gray-600">
            <p>
              Current members:{' '}
              <span className="font-semibold text-gray-900">
                {team.members.length}
              </span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Messages */}
            {error && <Alert type="error" message={error} />}
            {success && (
              <Alert
                type="success"
                message="Member added successfully! Closing..."
              />
            )}

            {/* User Selection */}
            {loadingUsers ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Loading available users...</p>
              </div>
            ) : availableUsers.length === 0 ? (
              <Alert
                type="info"
                message="No available users to add. All users are already members of this team."
              />
            ) : (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select User *
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setError(null);
                  }}
                  required
                  disabled={loading || success}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 px-4 text-gray-900 transition-colors focus:border-primary-500 focus:outline-none disabled:bg-gray-100"
                >
                  <option value="">-- Select a user --</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email}) - {user.role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Info Box */}
            <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <p className="text-sm text-blue-800">
                Select a user from the list to add them to this team. Only users with accounts in the system are available.
              </p>
            </div>

            {/* Buttons */}
            {availableUsers.length > 0 && (
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex-1 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700 disabled:bg-primary-400"
                >
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
