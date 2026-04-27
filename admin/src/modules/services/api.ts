import { api } from '@/shared/api/client'

export interface ServiceUnit {
  name: string
  description: string
  loadState: 'loaded' | 'not-found' | 'error'
  activeState: 'active' | 'inactive' | 'failed' | 'activating' | 'deactivating'
  subState: string
}

export const servicesApi = {
  list: () => api.get<ServiceUnit[]>('/services'),
  get: (name: string) => api.get<ServiceUnit>(`/services/${encodeURIComponent(name)}`),
  start: (name: string) => api.post<void>(`/services/${encodeURIComponent(name)}/start`),
  stop: (name: string) => api.post<void>(`/services/${encodeURIComponent(name)}/stop`),
  restart: (name: string) => api.post<void>(`/services/${encodeURIComponent(name)}/restart`),
}
