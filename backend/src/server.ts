import 'dotenv/config';
import { app } from './app';
import { env } from './config/env';
import { testConnection } from './database/connection';

async function start(): Promise<void> {
  try {
    await testConnection();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[db] MySQL indisponível, continuando com dados em memória:', msg);
  }

  const server = app.listen(env.port, () => {
    console.log(`[server] http://localhost:${env.port}/api`);
    console.log(`[server] ambiente: ${env.nodeEnv}`);
    console.log(`[server] CORS permitido para: ${env.cors.origin}`);

    if (env.isDev) {
      console.log('[server] endpoints disponíveis:');
      console.log('  GET    /api/health');
      console.log('  GET    /api/children');
      console.log('  GET    /api/children/:id');
      console.log('  POST   /api/children');
      console.log('  PATCH  /api/children/:id');
      console.log('  DELETE /api/children/:id');
      console.log('  GET    /api/caregivers');
      console.log('  GET    /api/caregivers/:id');
      console.log('  POST   /api/caregivers');
      console.log('  PATCH  /api/caregivers/:id');
      console.log('  DELETE /api/caregivers/:id');
      console.log('  GET    /api/activities');
      console.log('  GET    /api/activities/:code');
      console.log('  GET    /api/recommendations/children/:childId');
    }
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('[server] encerrado');
      process.exit(0);
    });
  });
}

start();
