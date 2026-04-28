import type { FastifyPluginAsync } from 'fastify';
import { dockerStore } from './store.ts';
import type { Container, ContainerAction } from './types.ts';

interface IdParams {
  id: string;
}

const actions: ContainerAction[] = ['start', 'stop', 'pause', 'restart'];

export const dockerRoutes: FastifyPluginAsync = async (app) => {
  app.get('/containers', async (): Promise<Container[]> => {
    return dockerStore.list();
  });

  app.get<{ Params: IdParams }>('/containers/:id', async (req): Promise<Container> => {
    const c = dockerStore.find(req.params.id);
    if (!c) throw app.httpErrors.notFound(`container ${req.params.id} not found`);
    return c;
  });

  for (const action of actions) {
    app.post<{ Params: IdParams }>(`/containers/:id/${action}`, async (req, reply) => {
      const ok = dockerStore.apply(req.params.id, action);
      if (!ok) throw app.httpErrors.notFound(`container ${req.params.id} not found`);
      reply.code(204).send();
    });
  }
};
