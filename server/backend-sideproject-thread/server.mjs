import express from 'express';
import cors from 'cors';
import { db, initDatabase } from './db.mjs';
import { setupRoutes } from './threadRouter.mjs';

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
  initDatabase();
});

setupRoutes(app);

app.listen(3001, () => console.log('Server running on port 3001'));