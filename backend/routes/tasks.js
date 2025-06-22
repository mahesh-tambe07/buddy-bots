// 📁 backend/routes/tasks.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ GET /api/tasks - Fetch all tasks
router.get('/', async (req, res) => {
  try {
    const [tasks] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(tasks);
  } catch (error) {
    console.error('GET /tasks error:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ✅ POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  const { task, due_date } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (task, due_date, status, created_at) VALUES (?, ?, ?, NOW())',
      [task, due_date || null, 'pending']
    );
    const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error('POST /tasks error:', error.message);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// ✅ PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  const { task, status, due_date } = req.body;
  const updates = [];
  const values = [];

  if (task !== undefined) {
    updates.push('task = ?');
    values.push(task);
  }
  if (status !== undefined) {
    updates.push('status = ?');
    values.push(status);
  }
  if (due_date !== undefined) {
    updates.push('due_date = ?');
    values.push(due_date);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(req.params.id);

  try {
    await db.query(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
    const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(updatedTask[0]);
  } catch (error) {
    console.error('PUT /tasks/:id error:', error.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ✅ DELETE /api/tasks/:id - Remove a task
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('DELETE /tasks/:id error:', error.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
