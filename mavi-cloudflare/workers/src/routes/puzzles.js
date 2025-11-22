/**
 * Puzzle Routes - CRUD operations
 */

import { Hono } from 'hono';
import { nanoid } from 'nanoid';

const puzzleRoutes = new Hono();

/**
 * GET /api/puzzles - Get all published puzzles
 */
puzzleRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const { status = 'published', category, featured } = c.req.query();

  try {
    let query = 'SELECT * FROM puzzles WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured !== undefined) {
      query += ' AND is_featured = ?';
      params.push(featured === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';

    const { results } = await db.prepare(query).bind(...params).all();

    // Parse JSON fields
    const puzzles = results.map(p => ({
      ...p,
      difficulty_available: JSON.parse(p.difficulty_available || '[]'),
      metadata: JSON.parse(p.metadata || '{}'),
      is_featured: Boolean(p.is_featured),
    }));

    return c.json(puzzles);
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    return c.json({ error: 'Failed to fetch puzzles' }, 500);
  }
});

/**
 * GET /api/puzzles/:id - Get puzzle by ID
 */
puzzleRoutes.get('/:id', async (c) => {
  const db = c.env.DB;
  const { id } = c.req.param();

  try {
    const { results } = await db
      .prepare('SELECT * FROM puzzles WHERE id = ?')
      .bind(id)
      .all();

    if (results.length === 0) {
      return c.json({ error: 'Puzzle not found' }, 404);
    }

    const puzzle = results[0];
    puzzle.difficulty_available = JSON.parse(puzzle.difficulty_available || '[]');
    puzzle.metadata = JSON.parse(puzzle.metadata || '{}');
    puzzle.is_featured = Boolean(puzzle.is_featured);

    return c.json(puzzle);
  } catch (error) {
    console.error('Error fetching puzzle:', error);
    return c.json({ error: 'Failed to fetch puzzle' }, 500);
  }
});

/**
 * GET /api/puzzles/:id/pieces/:difficulty - Get puzzle pieces
 */
puzzleRoutes.get('/:id/pieces/:difficulty', async (c) => {
  const db = c.env.DB;
  const { id, difficulty } = c.req.param();

  try {
    const { results } = await db
      .prepare(
        'SELECT piece_index, image_url FROM puzzle_pieces WHERE puzzle_id = ? AND difficulty = ? ORDER BY piece_index'
      )
      .bind(id, difficulty)
      .all();

    const pieces = results.map(p => p.image_url);

    return c.json({
      puzzle_id: id,
      difficulty,
      pieces,
      total: pieces.length,
    });
  } catch (error) {
    console.error('Error fetching pieces:', error);
    return c.json({ error: 'Failed to fetch puzzle pieces' }, 500);
  }
});

/**
 * POST /api/puzzles - Create new puzzle (admin only)
 */
puzzleRoutes.post('/', async (c) => {
  const db = c.env.DB;
  const data = await c.req.json();

  // TODO: Add auth middleware to check admin token

  try {
    const id = data.id || `puzzle-${nanoid(12)}`;
    const now = Math.floor(Date.now() / 1000);

    await db
      .prepare(
        `INSERT INTO puzzles (
          id, title, description, category, image_url, thumbnail_url,
          status, is_featured, difficulty_available, metadata, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        data.title,
        data.description || null,
        data.category,
        data.image_url,
        data.thumbnail_url || null,
        data.status || 'draft',
        data.is_featured ? 1 : 0,
        JSON.stringify(data.difficulty_available || ['easy', 'medium', 'hard']),
        JSON.stringify(data.metadata || {}),
        now,
        now
      )
      .run();

    return c.json({ id, message: 'Puzzle created successfully' }, 201);
  } catch (error) {
    console.error('Error creating puzzle:', error);
    return c.json({ error: 'Failed to create puzzle' }, 500);
  }
});

/**
 * PUT /api/puzzles/:id - Update puzzle (admin only)
 */
puzzleRoutes.put('/:id', async (c) => {
  const db = c.env.DB;
  const { id } = c.req.param();
  const data = await c.req.json();

  // TODO: Add auth middleware

  try {
    const now = Math.floor(Date.now() / 1000);

    await db
      .prepare(
        `UPDATE puzzles SET 
          title = ?, description = ?, category = ?, 
          image_url = ?, thumbnail_url = ?,
          status = ?, is_featured = ?, 
          difficulty_available = ?, metadata = ?,
          updated_at = ?
        WHERE id = ?`
      )
      .bind(
        data.title,
        data.description,
        data.category,
        data.image_url,
        data.thumbnail_url,
        data.status,
        data.is_featured ? 1 : 0,
        JSON.stringify(data.difficulty_available),
        JSON.stringify(data.metadata),
        now,
        id
      )
      .run();

    return c.json({ message: 'Puzzle updated successfully' });
  } catch (error) {
    console.error('Error updating puzzle:', error);
    return c.json({ error: 'Failed to update puzzle' }, 500);
  }
});

/**
 * DELETE /api/puzzles/:id - Delete puzzle (admin only)
 */
puzzleRoutes.delete('/:id', async (c) => {
  const db = c.env.DB;
  const { id } = c.req.param();

  // TODO: Add auth middleware

  try {
    await db.prepare('DELETE FROM puzzles WHERE id = ?').bind(id).run();

    return c.json({ message: 'Puzzle deleted successfully' });
  } catch (error) {
    console.error('Error deleting puzzle:', error);
    return c.json({ error: 'Failed to delete puzzle' }, 500);
  }
});

export { puzzleRoutes };
