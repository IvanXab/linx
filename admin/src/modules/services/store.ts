import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicesApi, type ServiceUnit } from '@/modules/services/api'

export const useServicesStore = defineStore('services', () => {
  const items = ref<ServiceUnit[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      items.value = await servicesApi.list()
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  async function act(name: string, action: 'start' | 'stop' | 'restart') {
    await servicesApi[action](name)
    await load()
  }

  return { items, loading, error, load, act }
})
