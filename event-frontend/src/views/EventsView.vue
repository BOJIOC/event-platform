<template>
  <v-container>
    <!-- Заголовок + кнопка создать -->
    <v-row align="center" class="mb-4">
      <v-col>
        <h1 class="text-h4">Все мероприятия</h1>
      </v-col>
      <v-col class="d-flex justify-end" v-if="isLoggedIn">
        <router-link to="/events/new">
          <v-btn color="secondary" dark>Создать событие</v-btn>
        </router-link>
      </v-col>
    </v-row>

    <!-- Поиск по названию -->
    <v-text-field
      v-model="filter.title"
      label="Поиск по названию"
      clearable
      prepend-inner-icon="mdi-magnify"
      class="mb-4"
      @input="loadEvents"
    />

    <!-- Фильтр по дате через Flatpickr -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="5">
        <label class="d-block mb-1">Дата с</label>
        <FlatPickr
          v-model="filter.from"
          :config="fpConfig"
          class="w-100"
          placeholder="Начало периода"
          @on-change="loadEvents"
        />
      </v-col>
      <v-col cols="12" md="5">
        <label class="d-block mb-1">Дата по</label>
        <FlatPickr
          v-model="filter.to"
          :config="fpConfig"
          class="w-100"
          placeholder="Конец периода"
          @on-change="loadEvents"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn color="primary" class="mt-4" block @click="clearDates">
          Сбросить дату
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

    <!-- Список событий -->
    <v-card
      v-for="event in events"
      :key="event.id"
      class="mb-4"
      elevation="2"
    >
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
          v-if="isLoggedIn && !isParticipated(event)"
          color="success"
          @click="joinEvent(event.id)"
        >
          Присоединиться
        </v-btn>
        <v-btn
          v-else-if="isLoggedIn && isParticipated(event)"
          color="error"
          @click="unjoinEvent(event.id)"
        >
          Отписаться
        </v-btn>
        <v-spacer />
        <v-icon left>mdi-account-multiple</v-icon
        >{{ event.participants.length }}
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/axios'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useAuthStore } from '@/stores/auth'

/** Настройка Flatpickr */
const fpConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'd.m.Y',
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  organizer: { id: number; name: string }
  participants: Array<{ id: number }>
}

const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isLoggedIn)

const events = ref<Event[]>([])
const error = ref<string | null>(null)
const filter = ref<{ title: string; from: string; to: string }>({
  title: '',
  from: '',
  to: '',
})

/** Загрузка с фильтрацией */
async function loadEvents() {
  error.value = null
  const params: any = {}
  if (filter.value.title) params.title = filter.value.title
  if (filter.value.from) params.from = filter.value.from
  if (filter.value.to) params.to = filter.value.to

  try {
    const res = await api.get<Event[]>('/events/search', { params })
    events.value = res.data
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось загрузить события'
  }
}

/** Очистить фильтры по дате */
function clearDates() {
  filter.value.from = ''
  filter.value.to = ''
  loadEvents()
}

/** Проверка участия */
function isParticipated(ev: Event): boolean {
  return auth.user
    ? ev.participants.some((p) => p.id === auth.user!.id)
    : false
}

/** Присоединиться / отписаться */
async function joinEvent(id: number) {
  try {
    await api.post(`/events/${id}/join`)
    loadEvents()
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось присоединиться'
  }
}
async function unjoinEvent(id: number) {
  try {
    await api.post(`/events/${id}/unjoin`)
    loadEvents()
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось отписаться'
  }
}

/** Формат даты для отображения */
function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(loadEvents)
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>
