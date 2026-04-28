import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { config } from './config.ts';
import { healthRoutes } from './routes/health.ts';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.isDev
      ? {
          level: config.logLevel,
          transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } },
        }
      : { level: config.logLevel },
  });

  await app.register(sensible);
  await app.register(cors, { origin: true });

  await app.register(healthRoutes, { prefix: '/health' });

  return app;
}
