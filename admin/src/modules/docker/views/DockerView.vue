<script setup lang="ts">
import { onMounted } from 'vue'
import { useDockerStore } from '@/modules/docker/store'
import type {
  Container,
  ContainerAction,
  ContainerStatus,
} from '@/modules/docker/api'

const store = useDockerStore()
onMounted(store.load)

const allowedActions: Record<ContainerStatus, ContainerAction[]> = {
  running: ['pause', 'restart', 'stop'],
  paused: ['start', 'restart', 'stop'],
  restarting: [],
  exited: ['start'],
  created: ['start'],
  dead: [],
}

const actionLabel: Record<ContainerAction, string> = {
  start: 'Запуск',
  pause: 'Пауза',
  restart: 'Рестарт',
  stop: 'Стоп',
}

const actionsOrder: ContainerAction[] = ['start', 'pause', 'restart', 'stop']

function can(c: Container, action: ContainerAction): boolean {
  return allowedActions[c.status].includes(action)
}

function formatPorts(ports: Container['ports']): string {
  if (ports.length === 0) return '—'
  return ports
    .map((p) => `${p.host ? `${p.host}:` : ''}${p.container}/${p.protocol}`)
    .join(', ')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}
</script>

<template>
  <section class="docker">
    <header class="docker__header">
      <h1>Docker</h1>
      <button :disabled="store.loading" @click="store.load">Обновить</button>
    </header>

    <p v-if="store.loading">Загрузка…</p>
    <p v-else-if="store.error" class="docker__error">{{ store.error }}</p>
    <table v-else class="docker__table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Образ</th>
          <th>Статус</th>
          <th>Порты</th>
          <th>Создан</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in store.items" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.image }}</td>
          <td>
            <span :class="['docker__status', `docker__status--${c.status}`]">
              {{ c.status }}
            </span>
          </td>
          <td>{{ formatPorts(c.ports) }}</td>
          <td>{{ formatDate(c.createdAt) }}</td>
          <td class="docker__actions">
            <button
              v-for="action in actionsOrder"
              :key="action"
              :disabled="!can(c, action) || store.acting === c.id"
              @click="store.act(c.id, action)"
            >
              {{ actionLabel[action] }}
            </button>
          </td>
        </tr>
        <tr v-if="store.items.length === 0">
          <td colspan="6">Нет контейнеров</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style lang="scss" scoped>
.docker {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__error {
    color: #c00;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--border);
      text-align: left;
    }
  }

  &__actions {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  &__status {
    text-transform: uppercase;
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    border-radius: 999px;
    background: var(--color-hover);

    &--running {
      background: rgba(34, 197, 94, 0.18);
    }

    &--paused {
      background: rgba(234, 179, 8, 0.22);
    }

    &--exited,
    &--dead {
      background: rgba(239, 68, 68, 0.2);
    }
  }
}
</style>
