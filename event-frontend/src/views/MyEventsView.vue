<!-- src/views/ParticipatedEventsView.vue -->
<template>
  <v-container class="pa-6">
    <v-row>
      <!-- Если не авторизованы -->
      <v-col cols="12" v-if="!auth.user">
        <v-alert type="warning">
          Пожалуйста, войдите, чтобы увидеть ваши мероприятия.
        </v-alert>
      </v-col>

      <!-- Если нет мероприятий и нет ошибки -->
      <v-col cols="12" v-else-if="!events.length && !error">
        <v-alert type="info">Вы пока не участвуете ни в одном мероприятии.</v-alert>
      </v-col>

      <!-- Карточки мероприятий -->
      <v-col
        v-else
        v-for="event in events"
        :key="event.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mb-4">
          <v-card-title>{{ event.title }}</v-card-title>
          <v-card-text>
            <div>{{ event.description }}</div>
            <div class="text--secondary mt-2">
              Дата: {{ formatDate(event.date) }}
            </div>
          </v-card-text>
          <v-card-actions>
            <!-- Отписаться от события -->
            <v-btn color="warning" text @click="unjoin(event.id)">
              Отписаться
            </v-btn>

            <!-- Удалить (если ты организатор или админ) -->
            <v-btn
              v-if="event.organizer.id === userId || auth.user?.role === 'admin'"
              color="error"
              text
              @click="removeEvent(event.id)"
            >
              Удалить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ошибка -->
    <v-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/axios'

interface Event {
  id: number
  title: string
  description: string
  date: string
  organizer: { id: number; name: string }
  participants: Array<{ id: number }>
}

const auth = useAuthStore()
const userId = computed(() => auth.user?.id ?? 0)

const events = ref<Event[]>([])
const error = ref<string | null>(null)

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

async function loadParticipated() {
  error.value = null
  try {
    const res = await api.get<Event[]>('/events/participated')
    events.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки мероприятий', err)
    error.value = 'Не удалось загрузить мероприятия.'
  }
}

async function unjoin(eventId: number) {
  try {
    await api.post(`/events/${eventId}/unjoin`)
    await loadParticipated()
  } catch (err) {
    console.error('Ошибка отписки', err)
    error.value = 'Не удалось отписаться.'
  }
}

async function removeEvent(eventId: number) {
  if (!confirm('Вы уверены, что хотите удалить мероприятие?')) return
  try {
    await api.delete(`/events/${eventId}`)
    await loadParticipated()
  } catch (err) {
    console.error('Ошибка удаления', err)
    error.value = 'Не удалось удалить мероприятие.'
  }
}

onMounted(loadParticipated)
</script>

<style scoped>
.mb-4 { margin-bottom: 1rem; }
.mt-4 { margin-top: 1rem; }
.pa-6 { padding: 1.5rem; }
</style>
