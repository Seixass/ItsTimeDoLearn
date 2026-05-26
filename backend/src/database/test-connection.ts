import 'dotenv/config';
import { testConnection } from './connection';

testConnection()
  .then(() => {
    console.log('[test] OK — MySQL conectado com sucesso');
    process.exit(0);
  })
  .catch((err: unknown) => {
    console.error('[test] FALHA —', err instanceof Error ? err.message : err);
    process.exit(1);
  });
