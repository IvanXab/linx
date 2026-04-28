// MOCK: бэкенд ещё не готов. Сигнатуры методов и DTO ниже — будущий контракт
// для core/api. При готовности бэка тела методов заменить на вызовы `api.*`,
// сохранив сигнатуры. Закомментированные строки показывают целевые эндпоинты.

// import { api } from '@/shared/api/client'

export type ContainerStatus =
  | 'running'
  | 'paused'
  | 'restarting'
  | 'exited'
  | 'created'
  | 'dead'

export interface ContainerPort {
  host?: number
  container: number
  protocol: 'tcp' | 'udp'
}

export interface Container {
  id: string
  name: string
  image: string
  status: ContainerStatus
  createdAt: string
  ports: ContainerPort[]
}

export type ContainerAction = 'start' | 'stop' | 'pause' | 'restart'

const mockContainers: Container[] = [
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
]

const delay = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function findOrThrow(id: string): Container {
  const c = mockContainers.find((x) => x.id === id)
  if (!c) throw new Error(`container ${id} not found`)
  return c
}

const transitions: Record<ContainerAction, ContainerStatus> = {
  start: 'running',
  stop: 'exited',
  pause: 'paused',
  restart: 'running',
}

export const dockerApi = {
  // list: () => api.get<Container[]>('/docker/containers'),
  list: async (): Promise<Container[]> => {
    await delay()
    return mockContainers.map((c) => ({ ...c, ports: [...c.ports] }))
  },

  // get: (id: string) =>
  //   api.get<Container>(`/docker/containers/${encodeURIComponent(id)}`),
  get: async (id: string): Promise<Container> => {
    await delay()
    return { ...findOrThrow(id) }
  },

  // start/stop/pause/restart:
  // (id: string) =>
  //   api.post<void>(`/docker/containers/${encodeURIComponent(id)}/<action>`),
  start: async (id: string): Promise<void> => act(id, 'start'),
  stop: async (id: string): Promise<void> => act(id, 'stop'),
  pause: async (id: string): Promise<void> => act(id, 'pause'),
  restart: async (id: string): Promise<void> => act(id, 'restart'),
}

async function act(id: string, action: ContainerAction): Promise<void> {
  await delay()
  const c = findOrThrow(id)
  c.status = transitions[action]
}
