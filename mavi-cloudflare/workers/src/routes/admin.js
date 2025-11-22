/**
 * Admin Routes - Authentication & Management
 */

import { Hono } from 'hono';

const adminRoutes = new Hono();

/**
 * POST /api/admin/login - Admin login
 */
adminRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  // TODO: Implement proper authentication with bcrypt
  // For now, simple check
  if (email === 'admin@mavi.com' && password === 'mavi2025') {
    return c.json({
      token: 'demo-token-' + Date.now(),
      user: {
        id: 'admin-001',
        email: 'admin@mavi.com',
        name: 'MAVI Admin',
        role: 'admin',
      },
    });
  }

  return c.json({ error: 'Invalid credentials' }, 401);
});

/**
 * GET /api/admin/stats - Dashboard statistics
 */
adminRoutes.get('/stats', async (c) => {
  const db = c.env.DB;

  try {
    // Get puzzle count
    const puzzleCount = await db
      .prepare('SELECT COUNT(*) as count FROM puzzles WHERE status = ?')
      .bind('published')
      .first();

    // Get total plays
    const totalPlays = await db
      .prepare('SELECT COUNT(*) as count FROM scores')
      .first();

    // Get recent scores
    const recentScores = await db
      .prepare('SELECT COUNT(*) as count FROM scores WHERE completed_at > ?')
      .bind(Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60) // Last 7 days
      .first();

    return c.json({
      puzzles: puzzleCount.count || 0,
      total_plays: totalPlays.count || 0,
      recent_plays: recentScores.count || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

export { adminRoutes };
