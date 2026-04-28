import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  dockerApi,
  type Container,
  type ContainerAction,
} from '@/modules/docker/api'

export const useDockerStore = defineStore('docker', () => {
  const items = ref<Container[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const acting = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      items.value = await dockerApi.list()
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  async function act(id: string, action: ContainerAction) {
    acting.value = id
    error.value = null
    try {
      await dockerApi[action](id)
      await load()
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      acting.value = null
    }
  }

  return { items, loading, error, acting, load, act }
})
