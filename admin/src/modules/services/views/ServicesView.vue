<script setup lang="ts">
import { onMounted } from 'vue'
import { useServicesStore } from '@/modules/services/store'

const store = useServicesStore()
onMounted(store.load)
</script>

<template>
  <section>
    <h1>Сервисы</h1>
    <p v-if="store.loading">Загрузка…</p>
    <p v-else-if="store.error" class="error">{{ store.error }}</p>
    <table v-else>
      <thead>
        <tr><th>Юнит</th><th>Состояние</th><th>Описание</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="unit in store.items" :key="unit.name">
          <td>{{ unit.name }}</td>
          <td>{{ unit.activeState }} ({{ unit.subState }})</td>
          <td>{{ unit.description }}</td>
          <td>
            <button @click="store.act(unit.name, 'restart')">restart</button>
            <button @click="store.act(unit.name, 'stop')">stop</button>
            <button @click="store.act(unit.name, 'start')">start</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
