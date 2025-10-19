import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, Library, LogOut, Home } from 'lucide-react';

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
        <h2 className="text-xl font-bold text-cyan-400">MAVI Admin</h2>
        <p className="text-slate-400 text-sm">Puzzle Management</p>
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
