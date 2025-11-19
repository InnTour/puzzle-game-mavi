import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { puzzleAPI } from '../../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPuzzles: 0,
    publishedPuzzles: 0,
    draftPuzzles: 0,
    totalPlays: 0,
  });

  useEffect(() => {
    // Check admin auth
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const puzzles = await puzzleAPI.getAll();
      const published = puzzles.filter(p => p.status === 'published').length;
      const draft = puzzles.filter(p => p.status === 'draft').length;
      const totalPlays = puzzles.reduce((sum, p) => sum + (p.metadata?.total_plays || 0), 0);

      setStats({
        totalPuzzles: puzzles.length,
        publishedPuzzles: published,
        draftPuzzles: draft,
        totalPlays,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  return (
    <AdminLayout>
      <header className="admin-header-section">
        <h1 className="text-3xl font-bold text-[#2d3748]">📊 Dashboard</h1>
        <p className="text-[#718096] mt-1">Overview of your puzzle collection</p>
      </header>

      <div className="admin-stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="admin-stat-card" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>🎮</div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>Total Puzzles</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2d3748', margin: '0.25rem 0 0 0' }}>{stats.totalPuzzles}</p>
          </div>
        </div>

        <div className="admin-stat-card" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: '#48bb78',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>✅</div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>Published</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2d3748', margin: '0.25rem 0 0 0' }}>{stats.publishedPuzzles}</p>
          </div>
        </div>

        <div className="admin-stat-card" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: '#ed8936',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>📝</div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>Draft</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2d3748', margin: '0.25rem 0 0 0' }}>{stats.draftPuzzles}</p>
          </div>
        </div>

        <div className="admin-stat-card" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: '#9f7aea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>👥</div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>Total Plays</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2d3748', margin: '0.25rem 0 0 0' }}>{stats.totalPlays}</p>
          </div>
        </div>
      </div>

      <div className="admin-quick-actions" style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2d3748', marginBottom: '1.5rem' }}>⚡ Quick Actions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          <button
            onClick={() => navigate('/admin/upload')}
            style={{
              padding: '1.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              background: '#f7fafc',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📤</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2d3748', margin: '0 0 0.5rem 0' }}>Upload New Puzzle</h3>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>Add a new puzzle to your collection</p>
          </button>

          <button
            onClick={() => navigate('/admin/puzzles')}
            style={{
              padding: '1.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              background: '#f7fafc',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎮</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2d3748', margin: '0 0 0.5rem 0' }}>Manage Puzzles</h3>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>View and manage existing puzzles</p>
          </button>

          <button
            onClick={() => navigate('/admin/settings')}
            style={{
              padding: '1.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              background: '#f7fafc',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎨</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2d3748', margin: '0 0 0.5rem 0' }}>Customize Style</h3>
            <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>Personalize colors and branding</p>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
