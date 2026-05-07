import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  LogOut,
  Settings,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderKanban,
    },
    {
      name: 'My Tasks',
      path: '/tasks',
      icon: CheckSquare,
    },
    {
      name: 'Teams',
      path: '/teams',
      icon: Users,
    },
  ];

  if (user?.role === 'Admin') {
    menuItems.push({
      name: 'Users',
      path: '/users',
      icon: Users,
    });
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-primary-600 p-2 text-white md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gradient-to-b from-primary-900 to-primary-800 text-white transition-transform duration-300 ${
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="mb-8 text-2xl font-bold">
            TaskManager
          </h1>

          {/* User Info */}
          <div className="mb-8 rounded-lg bg-primary-700 p-4">
            <p className="text-sm font-semibold">
              {user?.name}
            </p>

            <p className="text-xs text-primary-200">
              {user?.email}
            </p>

            <span className="mt-2 inline-block rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold">
              {user?.role}
            </span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center rounded-lg px-4 py-3 font-medium transition-colors hover:bg-primary-700"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 space-y-2 border-t border-primary-700 p-4">
          <Link
            to="/settings"
            className="flex items-center rounded-lg px-4 py-2 transition-colors hover:bg-primary-700"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-2 text-left transition-colors hover:bg-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;