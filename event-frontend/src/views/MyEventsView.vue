<template>
  <v-container>
    <h1 class="text-h4 mb-4">Мои мероприятия</h1>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

    <v-card
      v-for="event in events"
      :key="event.id"
      class="mb-4"
      elevation="2"
    >
      <v-card-title>{{ event.title }}</v-card-title>
      <v-card-subtitle>{{ formatDate(event.date) }}</v-card-subtitle>
      <v-card-text>{{ event.description }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const events = ref<any[]>([])
const error = ref<string | null>(null)

console.log('front token =', auth.token);
const loadMyEvents = async () => {
  try {
    const token = auth.token
    const res = await axios.get('/events/participated', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    events.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки мероприятий:', err)
    error.value = 'Не удалось загрузить мероприятия'
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(loadMyEvents)
</script>
