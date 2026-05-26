import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();

/* ── Segurança ── */
app.use(helmet());

/* ── CORS ── */
app.use(
  cors({
    origin: env.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

/* ── Body parsing ── */
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false }));

/* ── Rotas ── */
app.use('/api', router);

/* ── Fallback e erro ── */
app.use(notFound);
app.use(errorHandler);

export { app };
