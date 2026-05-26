import mysql from 'mysql2/promise';
import { env } from '../config/env';

/*
  Pool de conexão MySQL.

  Ainda não é utilizado — os repositories usam dados mockados.
  Quando o banco estiver pronto:
    1. Configure as variáveis no .env
    2. Chame testConnection() em server.ts antes de app.listen()
    3. Substitua os repositories mock por implementações que chamam getPool()
*/

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host:             env.db.host,
      port:             env.db.port,
      user:             env.db.user,
      password:         env.db.password,
      database:         env.db.name,
      waitForConnections: true,
      connectionLimit:  10,
      queueLimit:       0,
      timezone:         'Z',
    });
  }
  return pool;
}

export async function testConnection(): Promise<void> {
  const conn = await getPool().getConnection();
  conn.release();
  console.log('[db] conexão com MySQL estabelecida');
}
