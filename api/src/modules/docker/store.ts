// MOCK: core ещё не готов. При появлении core этот стор заменяется на проксирование
// в core, а сигнатуры роутов остаются прежними.

import type { Container, ContainerAction, ContainerStatus } from './types.ts';

const containers: Container[] = [
  {
    id: 'a1b2c3d4e5f6',
    name: 'nginx-proxy',
    image: 'nginx:1.27-alpine',
    status: 'running',
    createdAt: '2026-04-20T10:15:00Z',
    ports: [
      { host: 80, container: 80, protocol: 'tcp' },
      { host: 443, container: 443, protocol: 'tcp' },
    ],
  },
  {
    id: 'f6e5d4c3b2a1',
    name: 'postgres-main',
    image: 'postgres:16',
    status: 'running',
    createdAt: '2026-04-18T08:42:11Z',
    ports: [{ host: 5432, container: 5432, protocol: 'tcp' }],
  },
  {
    id: '0123456789ab',
    name: 'redis-cache',
    image: 'redis:7-alpine',
    status: 'paused',
    createdAt: '2026-04-25T19:03:50Z',
    ports: [{ host: 6379, container: 6379, protocol: 'tcp' }],
  },
  {
    id: 'cafebabedead',
    name: 'worker-old',
    image: 'linx/worker:0.3.1',
    status: 'exited',
    createdAt: '2026-03-30T12:00:00Z',
    ports: [],
  },
  {
    id: 'ter43vfgdfbb',
    name: 'ubuntu',
    image: 'ubuntu/ubuntu:latest',
    status: 'running',
    createdAt: '2026-02-30T12:00:00Z',
    ports: [{ host: 1271, container: 6379, protocol: 'tcp' }],
  },
];

const transitions: Record<ContainerAction, ContainerStatus> = {
  start: 'running',
  stop: 'exited',
  pause: 'paused',
  restart: 'running',
};

function clone(c: Container): Container {
  return { ...c, ports: c.ports.map((p) => ({ ...p })) };
}

export const dockerStore = {
  list(): Container[] {
    return containers.map(clone);
  },

  find(id: string): Container | undefined {
    const c = containers.find((x) => x.id === id);
    return c ? clone(c) : undefined;
  },

  apply(id: string, action: ContainerAction): boolean {
    const c = containers.find((x) => x.id === id);
    if (!c) return false;
    c.status = transitions[action];
    return true;
  },
};
