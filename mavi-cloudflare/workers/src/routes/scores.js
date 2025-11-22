/**
 * Score Routes - Leaderboard
 */

import { Hono } from 'hono';
import { nanoid } from 'nanoid';

const scoreRoutes = new Hono();

/**
 * GET /api/scores - Get leaderboard
 */
scoreRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const { puzzle_id, difficulty, limit = 100 } = c.req.query();

  try {
    let query = `
      SELECT s.*, p.title as puzzle_title, p.category
      FROM scores s
      LEFT JOIN puzzles p ON s.puzzle_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (puzzle_id) {
      query += ' AND s.puzzle_id = ?';
      params.push(puzzle_id);
    }

    if (difficulty) {
      query += ' AND s.difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY s.score DESC, s.time_seconds ASC LIMIT ?';
    params.push(parseInt(limit));

    const { results } = await db.prepare(query).bind(...params).all();

    return c.json(results);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return c.json({ error: 'Failed to fetch scores' }, 500);
  }
});

/**
 * POST /api/scores - Submit new score
 */
scoreRoutes.post('/', async (c) => {
  const db = c.env.DB;
  const data = await c.req.json();

  try {
    const id = `score-${nanoid(12)}`;
    const now = Math.floor(Date.now() / 1000);

    // Calculate score (similar to gameLogic.js)
    const difficultyMultipliers = {
      easy: 1.0,
      medium: 2.0,
      hard: 3.0,
    };

    const baseScore = 10000;
    const multiplier = difficultyMultipliers[data.difficulty] || 1.0;
    const timePenalty = Math.floor(data.time_seconds * 2);
    const movePenalty = Math.floor(data.moves * 10);
    const score = Math.max(0, Math.floor((baseScore * multiplier) - timePenalty - movePenalty));

    await db
      .prepare(
        `INSERT INTO scores (
          id, puzzle_id, player_name, difficulty, 
          score, time_seconds, moves, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        data.puzzle_id,
        data.player_name || 'Anonymous',
        data.difficulty,
        score,
        data.time_seconds,
        data.moves,
        now
      )
      .run();

    // Update puzzle metadata
    await updatePuzzleStats(db, data.puzzle_id);

    return c.json({
      id,
      score,
      message: 'Score submitted successfully',
    }, 201);
  } catch (error) {
    console.error('Error submitting score:', error);
    return c.json({ error: 'Failed to submit score' }, 500);
  }
});

/**
 * GET /api/scores/top/:puzzle_id - Get top scores for puzzle
 */
scoreRoutes.get('/top/:puzzle_id', async (c) => {
  const db = c.env.DB;
  const { puzzle_id } = c.req.param();
  const { difficulty, limit = 10 } = c.req.query();

  try {
    let query = `
      SELECT player_name, difficulty, score, time_seconds, moves, completed_at
      FROM scores
      WHERE puzzle_id = ?
    `;
    const params = [puzzle_id];

    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY score DESC LIMIT ?';
    params.push(parseInt(limit));

    const { results } = await db.prepare(query).bind(...params).all();

    return c.json(results);
  } catch (error) {
    console.error('Error fetching top scores:', error);
    return c.json({ error: 'Failed to fetch top scores' }, 500);
  }
});

/**
 * Helper: Update puzzle statistics
 */
async function updatePuzzleStats(db, puzzleId) {
  try {
    const { results } = await db
      .prepare(
        `SELECT 
          COUNT(*) as total_plays,
          AVG(time_seconds) as avg_time,
          AVG(score) as avg_score
        FROM scores
        WHERE puzzle_id = ?`
      )
      .bind(puzzleId)
      .all();

    const stats = results[0];
    const metadata = {
      total_plays: stats.total_plays,
      avg_time: Math.round(stats.avg_time || 0),
      avg_score: Math.round(stats.avg_score || 0),
    };

    await db
      .prepare('UPDATE puzzles SET metadata = ? WHERE id = ?')
      .bind(JSON.stringify(metadata), puzzleId)
      .run();
  } catch (error) {
    console.error('Error updating puzzle stats:', error);
  }
}

export { scoreRoutes };
