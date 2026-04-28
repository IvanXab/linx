export type ContainerStatus =
  | 'running'
  | 'paused'
  | 'restarting'
  | 'exited'
  | 'created'
  | 'dead';

export interface ContainerPort {
  host?: number;
  container: number;
  protocol: 'tcp' | 'udp';
}

export interface Container {
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
  createdAt: string;
  ports: ContainerPort[];
}

export type ContainerAction = 'start' | 'stop' | 'pause' | 'restart';
