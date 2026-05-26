import 'dotenv/config';

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  port:    Number(optional('PORT', '3001')),
  nodeEnv: optional('NODE_ENV', 'development'),
  isDev:   optional('NODE_ENV', 'development') === 'development',

  db: {
    host:     optional('DB_HOST', 'localhost'),
    port:     Number(optional('DB_PORT', '3306')),
    user:     optional('DB_USER', 'root'),
    password: optional('DB_PASSWORD', ''),
    name:     optional('DB_NAME', 'its_time_do_learn'),
  },

  cors: {
    origin: optional('CORS_ORIGIN', 'http://localhost:5173'),
  },
} as const;
