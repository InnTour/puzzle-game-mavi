/**
 * MAVI Puzzle Game API
 * Cloudflare Workers + D1 + R2
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { puzzleRoutes } from './routes/puzzles';
import { scoreRoutes } from './routes/scores';
import { adminRoutes } from './routes/admin';
import uploadRoutes from './routes/upload';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*', // In production, specify exact domains
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'MAVI Puzzle API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.route('/api/puzzles', puzzleRoutes);
app.route('/api/scores', scoreRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/admin/upload', uploadRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
  }, 500);
});

export default app;
