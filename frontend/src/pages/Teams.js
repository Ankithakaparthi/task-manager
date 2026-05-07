import React, { useState, useEffect } from 'react';
import { Plus, Users, Mail, Shield } from 'lucide-react';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loading, EmptyState, Alert, Button, Badge } from '../components/common';
import AddMemberModal from '../components/AddMemberModal';

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch teams (projects)
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getAll();

      if (res?.data?.data) {
        // Filter teams where user is admin or member
        const userTeams = res.data.data.filter((team) => {
          const isAdmin = team.admin._id === user._id;
          const isMember = team.members.some((member) => member._id === user._id);
          return isAdmin || isMember;
        });
        setTeams(userTeams);
      } else {
        setTeams([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemberClick = (team) => {
    setSelectedTeam(team);
    setShowAddMemberModal(true);
  };

  const handleMemberAdded = () => {
    setShowAddMemberModal(false);
    setSelectedTeam(null);
    setSuccessMessage('Member added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    fetchTeams(); // Refresh teams list
  };

  const isTeamAdmin = (team) => {
    return team.admin._id === user._id;
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="mt-2 text-gray-600">
            Manage and view all teams you are part of
          </p>
        </div>

        {/* Messages */}
        {error && <Alert type="error" message={error} />}
        {successMessage && <Alert type="success" message={successMessage} />}

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <EmptyState
            title="No Teams Yet"
            message="You are not part of any teams yet. Contact your administrator to be added to a team."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team._id}
                className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Team Header */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {team.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {team.description || 'No description'}
                      </p>
                    </div>
                    {isTeamAdmin(team) && (
                      <Badge variant="success">Admin</Badge>
                    )}
                  </div>
                </div>

                {/* Team Info */}
                <div className="space-y-4 p-4">
                  {/* Admin Info */}
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary-600" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Team Admin
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {team.admin.name}
                      </p>
                      <p className="text-xs text-gray-500">{team.admin.email}</p>
                    </div>
                  </div>

                  {/* Members Count */}
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary-600" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Members
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {team.members.length} member
                        {team.members.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Members List */}
                  <div className="space-y-2 rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Team Members
                    </p>
                    <div className="space-y-2">
                      {team.members.slice(0, 3).map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center gap-2 rounded bg-white p-2"
                        >
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      ))}
                      {team.members.length > 3 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          +{team.members.length - 3} more member
                          {team.members.length - 3 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {isTeamAdmin(team) && (
                  <div className="border-t border-gray-200 p-4">
                    <Button
                      variant="primary"
                      onClick={() => handleAddMemberClick(team)}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && selectedTeam && (
        <AddMemberModal
          team={selectedTeam}
          onClose={() => {
            setShowAddMemberModal(false);
            setSelectedTeam(null);
          }}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
};

export default Teams;
