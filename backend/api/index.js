import app from '../src/app.js';
import { testDbConnection } from '../src/db/database.js';

// Ensure DB connection
testDbConnection().catch((err) => {
  console.error('Database connection error in Vercel handler:', err);
});

export default app;
