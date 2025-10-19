import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple auth for MVP - hardcoded
    if (email === 'admin@mavi.com' && password === 'mavi2025') {
      localStorage.setItem('admin_token', 'admin_authenticated');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use: admin@mavi.com / mavi2025');
    }
  };

  return (
    <div className="admin-login-screen" data-testid="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <Lock className="w-12 h-12 text-cyan-400" />
          <h1 className="text-3xl font-bold text-cyan-400 mt-4">MAVI Admin Panel</h1>
          <p className="text-slate-400 mt-2">Login to manage puzzles</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">
              <User className="w-4 h-4" />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mavi.com"
              className="form-input"
              required
              data-testid="admin-email-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
              data-testid="admin-password-input"
            />
          </div>

          {error && (
            <div className="admin-error-message" data-testid="login-error">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" data-testid="admin-login-button">
            Login to Admin Panel
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="text-slate-500 text-sm">MVP Credentials:</p>
          <p className="text-slate-400 text-xs">admin@mavi.com / mavi2025</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
