const express = require('express');
const cors = require('cors');
const { pool, init } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error' });
  }
});

app.get('/api/items', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/items', async (req, res, next) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal error' });
});

const port = process.env.PORT || 3000;

async function start() {
  for (let i = 0; i < 10; i++) {
    try {
      await init();
      break;
    } catch (err) {
      if (i === 9) throw err;
      console.log('Waiting for database...');
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  app.listen(port, () => console.log(`API listening on ${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
