import crypto from 'crypto';
import { db } from './db.mjs';

export function setupRoutes(app) {
  app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM threads', (err, threads) => {
      if (err) throw err;
      db.query('SELECT * FROM comments', (err, comments) => {
        if (err) throw err;
        res.json({ threads, comments });
      });
    });
  });

  app.post('/api/threads', (req, res) => {
    const { username, thread, idType } = req.body;
    let id_anonymus = null;

    if (idType === 'id_anonymus') {
      id_anonymus = crypto.randomBytes(16).toString('hex');
    }

    db.query(
      'INSERT INTO threads (id_anonymus, username, thread) VALUES (?, ?, ?)',
      [id_anonymus, username, thread],
      (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, id_anonymus, username, thread });
      }
    );
  });

  app.post('/api/comments', (req, res) => {
    const { thread_id, username, comment, idType } = req.body;
    let id_anonymus = null;

    if (idType === 'id_anonymus') {
      id_anonymus = crypto.randomBytes(16).toString('hex');
    }

    db.query(
      'INSERT INTO comments (thread_id, id_anonymus, username, comment) VALUES (?, ?, ?, ?)',
      [thread_id, id_anonymus, username, comment],
      (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, thread_id, id_anonymus, username, comment });
      }
    );
  });
}