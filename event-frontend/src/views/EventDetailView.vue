<template>
  <v-container fluid>
    <!-- Карточка события -->
    <v-card class="pa-4 mb-6">
      <v-card-title class="text-h4">{{ event.title }}</v-card-title>
      <v-card-subtitle>
        {{ formatDate(event.date) }} • Организатор: {{ event.organizer.name }}
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
          v-if="!isParticipated"
          color="success"
          @click="joinEvent"
        >Присоединиться</v-btn>
        <v-btn
          v-else
          color="error"
          @click="unjoinEvent"
        >Отписаться</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Вкладки -->
    <v-tabs v-model="tab" class="mb-4">
      <v-tab value="desc">Описание</v-tab>
      <v-tab value="parts">Участники ({{ event.participants.length }})</v-tab>
      <v-tab value="tasks">Задачи ({{ tasks.length }})</v-tab>
      <v-tab value="chat">Обсуждение</v-tab>
    </v-tabs>

    <!-- Контент вкладок -->
    <v-window v-model="tab" class="mt-2">
      
      <!-- 1. Описание -->
      <v-window-item value="desc">
        <v-card outlined class="pa-4">
          <div v-html="event.description"></div>
        </v-card>
      </v-window-item>

      <!-- 2. Участники -->
      <v-window-item value="parts">
        <v-card outlined class="pa-4">
          <v-list two-line>
            <v-list-item 
              v-for="p in event.participants" 
              :key="p.id"
            >
              <template #prepend>
                <v-avatar size="32">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </template>
              <v-list-item-content>
                <v-list-item-title>{{ p.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ p.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-window-item>

      <!-- 3. Задачи -->
      <v-window-item value="tasks">
        <v-card outlined class="pa-4">

          <v-list>
            <v-list-item 
              v-for="task in tasks" 
              :key="task.id"
            >
              <template #prepend>
                <v-checkbox
                  v-model="task.done"
                  @change="toggleTask(task.id)"
                />
              </template>
              <v-list-item-content>
                <v-list-item-title
                  :class="{ 'text--line-through': task.done }"
                >
                  {{ task.content }}
                </v-list-item-title>
              </v-list-item-content>
              <template #append>
                <v-btn icon @click="removeTask(task.id)">
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-form @submit.prevent="addTask" class="d-flex mt-4">
            <v-text-field
              v-model="newTask"
              label="Новая задача"
              dense
              class="flex-grow-1 me-2"
            />
            <v-btn type="submit" color="primary">Добавить</v-btn>
          </v-form>

        </v-card>
      </v-window-item>

      <!-- 4. Обсуждение -->
      <v-window-item value="chat">
        <v-card outlined class="pa-4">
          <v-list two-line>
            <v-list-item 
              v-for="c in comments" 
              :key="c.id"
            >
              <template #prepend>
                <v-avatar size="32">
                  <v-icon>mdi-comment</v-icon>
                </v-avatar>
              </template>
              <v-list-item-content>
                <v-list-item-title>
                  {{ c.author.name }}
                  <span class="grey--text ms-2">
                    {{ formatDateTime(c.createdAt) }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle>{{ c.content }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-form @submit.prevent="postComment" class="mt-4">
            <v-textarea
              v-model="newComment"
              label="Ваш комментарий"
              rows="2"
              required
            />
            <v-btn
              type="submit"
              color="primary"
              :disabled="!newComment.trim()"
              class="mt-2"
            >Отправить</v-btn>
          </v-form>
        </v-card>
      </v-window-item>

    </v-window>

    <!-- Ошибка -->
    <v-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const eventId = Number(route.params.id)

const event = ref<any>({
  title: '', description: '', date: '',
  organizer: { name: '' }, participants: []
})
const comments = ref<any[]>([])
const tasks = ref<{ id: number; content: string; done: boolean }[]>([])
const newComment = ref('')
const newTask = ref('')
const tab = ref<'desc'|'parts'|'tasks'|'chat'>('desc')
const error = ref<string|null>(null)

// Получаем userId из токена
const payload = auth.token ? JSON.parse(atob(auth.token.split('.')[1])) : {}
const userId = payload.sub || payload.id

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}
function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

async function loadEvent() {
  try {
    const { data } = await api.get(`/events/${eventId}`)
    event.value = data
  } catch {
    error.value = 'Не удалось загрузить событие.'
  }
}
async function loadComments() {
  try {
    const { data } = await api.get(`/events/${eventId}/comments`)
    comments.value = data
  } catch {
    error.value = 'Не удалось загрузить комментарии.'
  }
}
async function loadTasks() {
  try {
    const { data } = await api.get(`/events/${eventId}/tasks`)
    tasks.value = data
  } catch {
    error.value = 'Не удалось загрузить задачи.'
  }
}

const isParticipated = computed(() =>
  event.value.participants.some((p: any) => p.id === userId)
)

async function joinEvent() {
  try {
    await api.post(`/events/${eventId}/join`)
    await loadEvent()
  } catch {
    error.value = 'Не удалось присоединиться.'
  }
}
async function unjoinEvent() {
  try {
    await api.post(`/events/${eventId}/unjoin`)
    await loadEvent()
  } catch {
    error.value = 'Не удалось отписаться.'
  }
}

async function postComment() {
  if (!newComment.value.trim()) return
  try {
    await api.post(`/events/${eventId}/comments`, { content: newComment.value })
    newComment.value = ''
    await loadComments()
  } catch {
    error.value = 'Не удалось отправить комментарий.'
  }
}

async function addTask() {
  if (!newTask.value.trim()) return
  try {
    await api.post(`/events/${eventId}/tasks`, { content: newTask.value })
    newTask.value = ''
    await loadTasks()
  } catch {
    error.value = 'Не удалось добавить задачу.'
  }
}
async function toggleTask(id: number) {
  try {
    await api.patch(`/events/${eventId}/tasks/${id}/toggle`)
    await loadTasks()
  } catch {
    error.value = 'Не удалось обновить задачу.'
  }
}
async function removeTask(id: number) {
  try {
    await api.delete(`/events/${eventId}/tasks/${id}`)
    await loadTasks()
  } catch {
    error.value = 'Не удалось удалить задачу.'
  }
}

onMounted(async () => {
  await loadEvent()
  await loadComments()
  await loadTasks()
})
</script>

<style scoped>
.pa-4 { padding: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.text--line-through { text-decoration: line-through; }
</style>
