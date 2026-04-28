import { api } from '@/shared/api/client'

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

export const dockerApi = {
  list: () => api.get<Container[]>('/docker/containers'),

  get: (id: string) =>
    api.get<Container>(`/docker/containers/${encodeURIComponent(id)}`),

  start: (id: string) =>
    api.post<void>(`/docker/containers/${encodeURIComponent(id)}/start`),
  stop: (id: string) =>
    api.post<void>(`/docker/containers/${encodeURIComponent(id)}/stop`),
  pause: (id: string) =>
    api.post<void>(`/docker/containers/${encodeURIComponent(id)}/pause`),
  restart: (id: string) =>
    api.post<void>(`/docker/containers/${encodeURIComponent(id)}/restart`),
}
