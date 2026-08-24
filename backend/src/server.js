import app from './app.js';
import { config } from './config/config.js';
import { testDbConnection } from './db/database.js';
import { seedInitialData } from './db/seed.js';

async function startServer() {
  console.log('🚀 [Skillora Backend] Initializing server...');

  // 1. Check PostgreSQL Connection
  await testDbConnection();

  // 2. Seed default data (admin, student, courses, quizzes)
  await seedInitialData();

  // 3. Start Express HTTP Server
  app.listen(config.port, () => {
    console.log(`
🎓 ======================================================
   SKILLORA BACKEND API — RUNNING SUCCESSFULLY
   Port:        ${config.port}
   Environment: ${config.nodeEnv}
   API URL:     http://localhost:${config.port}/api
   Health:      http://localhost:${config.port}/api/health
====================================================== 🎓
    `);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
