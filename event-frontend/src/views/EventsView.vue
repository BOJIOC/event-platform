<template>
  <v-container>
    <!-- Заголовок + кнопка создать -->
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4 flex-grow-1">Все мероприятия</h1>
      <router-link to="/events/new">
        <v-btn color="secondary" dark>Создать событие</v-btn>
      </router-link>
    </div>

    <v-btn @click="loadEvents" color="primary" class="mb-4">
      Обновить список
    </v-btn>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

    <v-card
      v-for="event in events"
      :key="event.id"
      class="mb-4"
      elevation="2"
    >
      <!-- Заголовок + ссылка "Подробнее" -->
      <v-card-title class="d-flex align-center">
        <div class="flex-grow-1">{{ event.title }}</div>
        <router-link :to="{ name: 'event-detail', params: { id: event.id } }">
          <v-btn text small class="ms-2">Подробнее</v-btn>
        </router-link>
      </v-card-title>

      <v-card-subtitle>{{ formatDate(event.date) }}</v-card-subtitle>
      <v-card-text>{{ event.description }}</v-card-text>

      <v-card-actions>
        <v-btn
          v-if="!isParticipated(event)"
          color="success"
          @click="joinEvent(event.id)"
        >
          Присоединиться
        </v-btn>

        <v-btn
          v-else
          color="error"
          @click="unjoinEvent(event.id)"
        >
          Отписаться
        </v-btn>

        <v-spacer />
        <v-icon left>mdi-account-multiple</v-icon>{{ event.participants.length }}
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Получаем токен и userId из JWT
const auth = useAuthStore()
const payload = auth.token ? JSON.parse(atob(auth.token.split('.')[1])) : {}
const userId: number = payload.sub || payload.id

const events = ref<any[]>([])
const error = ref<string | null>(null)

async function loadEvents() {
  try {
    const res = await axios.get('/events', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    events.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки событий:', err)
    error.value = 'Не удалось загрузить события'
  }
}

// Проверяем, участвует ли текущий пользователь
function isParticipated(event: any): boolean {
  return event.participants?.some((p: any) => p.id === userId)
}

async function joinEvent(eventId: number) {
  try {
    await axios.post(
      `/events/${eventId}/join`,
      {},
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )
    await loadEvents()
  } catch (err) {
    console.error('Ошибка при присоединении:', err)
    error.value = 'Не удалось присоединиться'
  }
}

async function unjoinEvent(eventId: number) {
  try {
    await axios.post(
      `/events/${eventId}/unjoin`,
      {},
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )
    await loadEvents()
  } catch (err) {
    console.error('Ошибка при отписке:', err)
    error.value = 'Не удалось отписаться'
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(loadEvents)
</script>
