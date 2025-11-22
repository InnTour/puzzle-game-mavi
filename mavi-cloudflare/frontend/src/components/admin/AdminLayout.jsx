import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SyncButton from './SyncButton';
import './AdminLayout.css';

/**
 * Layout Admin Unificato con Sidebar
 * 
 * Struttura:
 * - Header con logo e logout
 * - Sidebar con navigazione
 * - Main content area
 * 
 * Props:
 * - children: contenuto da renderizzare nell'area principale
 */
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Menu items
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/admin',
      exact: true
    },
    {
      id: 'puzzles',
      label: 'Gestione Puzzle',
      icon: '🎮',
      path: '/admin/puzzles'
    },
    {
      id: 'upload',
      label: 'Carica Immagini',
      icon: '📤',
      path: '/admin/upload'
    },
    {
      id: 'settings',
      label: 'Impostazioni',
      icon: '🎨',
      path: '/admin/settings'
    },
    {
      id: 'stats',
      label: 'Statistiche',
      icon: '📈',
      path: '/admin/stats'
    }
  ];

  // Check if menu item is active
  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  // Handle logout
  const handleLogout = () => {
    // Rimuovi token/sessione da localStorage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_session');
    
    // Redirect a home
    navigate('/');
  };

  // Toggle sidebar (per mobile)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <button 
            className="btn-menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="header-brand">
            <span className="brand-icon">🧩</span>
            <h1 className="brand-title">MAVI Admin</h1>
          </div>
        </div>
        <div className="header-right">
          <div className="admin-info">
            <span className="admin-badge">👤</span>
            <span className="admin-name">Admin</span>
          </div>
          <button 
            className="btn-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive(item) ? 'active' : ''}`}
              onClick={() => {
                // Chiudi sidebar su mobile dopo click
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer sidebar con info */}
        <div className="sidebar-footer">
          <div className="footer-info">
            <p className="footer-text">MAVI Puzzle Admin</p>
            <p className="footer-version">v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="main-content">
          {children}
        </div>
      </main>

      {/* Sync Button */}
      <SyncButton />

      {/* Overlay per mobile quando sidebar aperta */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
