import React, { useState, useEffect } from 'react';
import { Users, Search, Ban, Check, Eye } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Per ora mostriamo solo guest users e stats
      // TODO: implementare user registration completo
      const response = await axios.get(`${BACKEND_URL}/api/admin/users`);
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      // Placeholder data for MVP
      setUsers([
        {
          id: 'guest',
          username: 'Guest Players',
          email: 'N/A',
          role: 'player',
          stats: { total_puzzles_completed: 0 },
          is_banned: false,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;

    try {
      await axios.post(`${BACKEND_URL}/api/admin/users/${userId}/ban`, {
        reason: 'Admin action'
      });
      alert('User banned successfully');
      loadUsers();
    } catch (err) {
      console.error('Failed to ban user:', err);
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await axios.post(`${BACKEND_URL}/api/admin/users/${userId}/unban`);
      alert('User unbanned successfully');
      loadUsers();
    } catch (err) {
      console.error('Failed to unban user:', err);
      alert('Failed to unban user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !user.is_banned) ||
                         (filterStatus === 'banned' && user.is_banned);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="text-[#C4A574] mt-4">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout" data-testid="admin-users">
      <AdminSidebar />
      
      <div className="admin-content">
        <header className="admin-header">
          <div>
            <h1 className="text-3xl font-bold text-[#C4A574]">User Management</h1>
            <p className="text-[#A89B8C] mt-1">{users.length} total users</p>
          </div>
        </header>

        <div className="admin-filters">
          <div className="filter-search">
            <Search className="w-5 h-5 text-[#A89B8C]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username or email..."
              className="search-input"
              data-testid="search-input"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
            data-testid="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="player">Player</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
            data-testid="status-filter"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <div className="admin-info-banner">
          <p className="text-[#C4A574]">
            📝 Note: Full user registration system coming soon. Currently showing guest player stats.
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users className="w-16 h-16 text-[#8B7355]" />
            <p className="text-[#A89B8C] mt-4">No users found</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Puzzles Completed</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} data-testid={`user-row-${user.id}`}>
                    <td>
                      <span className="font-semibold text-[#6B8E6F]">{user.username}</span>
                    </td>
                    <td>
                      <span className="text-[#A89B8C] text-sm">{user.email || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="table-badge">{user.role.toUpperCase()}</span>
                    </td>
                    <td>
                      <span className="text-[#8B7355]">{user.stats?.total_puzzles_completed || 0}</span>
                    </td>
                    <td>
                      <span className={`table-status ${
                        user.is_banned ? 'status-draft' : 'status-published'
                      }`}>
                        {user.is_banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <span className="text-[#A89B8C] text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {user.is_banned ? (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="action-button"
                            title="Unban"
                            data-testid={`unban-button-${user.id}`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="action-button delete"
                            title="Ban"
                            data-testid={`ban-button-${user.id}`}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
