import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, Library, Trophy, Users, LogOut, Home } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin_token');
      navigate('/admin');
    }
  };

  return (
    <aside className="admin-sidebar" data-testid="admin-sidebar">
      <div className="admin-sidebar-header">
        <img 
          src="/logo-mavi.png" 
          alt="MAVI Logo" 
          className="w-24 h-auto mx-auto mb-3"
        />
        <h2 className="text-xl font-bold text-[#C4A574] text-center">MAVI Admin</h2>
        <p className="text-[#A89B8C] text-sm text-center">Puzzle Management</p>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          data-testid="nav-dashboard"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/upload"
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          data-testid="nav-upload"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Puzzle</span>
        </NavLink>

        <NavLink
          to="/admin/library"
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          data-testid="nav-library"
        >
          <Library className="w-5 h-5" />
          <span>Puzzle Library</span>
        </NavLink>

        <NavLink
          to="/admin/leaderboard"
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          data-testid="nav-leaderboard"
        >
          <Trophy className="w-5 h-5" />
          <span>Leaderboard</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          data-testid="nav-users"
        >
          <Users className="w-5 h-5" />
          <span>Users</span>
        </NavLink>

        <div className="admin-nav-divider"></div>

        <button
          onClick={() => navigate('/')}
          className="admin-nav-link"
          data-testid="nav-home"
        >
          <Home className="w-5 h-5" />
          <span>View Site</span>
        </button>

        <button
          onClick={handleLogout}
          className="admin-nav-link logout"
          data-testid="nav-logout"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
