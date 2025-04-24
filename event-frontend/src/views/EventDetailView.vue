<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h4">{{ event.title }}</v-card-title>
      <v-card-subtitle>
        {{ formatDate(event.date) }} • Организатор: {{ event.organizer.name }}
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
          v-if="!isParticipated"
          color="success"
          @click="joinEvent"
        >
          Присоединиться
        </v-btn>
        <v-btn
          v-else
          color="error"
          @click="unjoinEvent"
        >
          Отписаться
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Табы -->
    <v-tabs v-model="tab" class="mt-6">
      <v-tab value="desc">Описание</v-tab>
      <v-tab value="parts">Участники ({{ event.participants.length }})</v-tab>
      <v-tab value="chat">Обсуждение</v-tab>
    </v-tabs>

    <!-- Контент табов -->
    <v-tabs-items v-model="tab" class="mt-4">
      <!-- Описание -->
      <v-tabs-item value="desc">
        <v-card outlined class="pa-4">
          <div v-html="event.description"></div>
        </v-card>
      </v-tabs-item>

      <!-- Участники -->
      <v-tabs-item value="parts">
        <v-card outlined class="pa-4">
          <v-list two-line>
            <v-list-item
              v-for="p in event.participants"
              :key="p.id"
            >
              <v-list-item-avatar>
                <v-icon>mdi-account</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ p.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ p.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-tabs-item>

      <!-- Обсуждение -->
      <v-tabs-item value="chat">
        <v-card outlined class="pa-4">
          <!-- Список комментариев -->
          <v-list two-line>
            <v-list-item
              v-for="c in comments"
              :key="c.id"
            >
              <v-list-item-avatar>
                <v-icon>mdi-comment</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ c.author.name }}
                  <small class="grey--text ms-2">{{ formatDateTime(c.createdAt) }}</small>
                </v-list-item-title>
                <v-list-item-subtitle>{{ c.content }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <!-- Форма нового комментария -->
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
            >
              Отправить
            </v-btn>
          </v-form>
        </v-card>
      </v-tabs-item>
    </v-tabs-items>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()

// Состояние
const event = ref<any>({
  title: '',
  description: '',
  date: '',
  organizer: { name: '' },
  participants: [],
})
const comments = ref<any[]>([])
const newComment = ref('')
const tab = ref<'desc'|'parts'|'chat'>('desc')

// Получаем userId из токена
const payload = auth.token ? JSON.parse(atob(auth.token.split('.')[1])) : {}
const userId: number = payload.sub || payload.id

// Загрузчики
async function loadEvent() {
  const { data } = await axios.get(`/events/${route.params.id}`, {
    headers: { Authorization: `Bearer ${auth.token}` },
  })
  event.value = data
}

async function loadComments() {
  const { data } = await axios.get(`/events/${route.params.id}/comments`, {
    headers: { Authorization: `Bearer ${auth.token}` },
  })
  comments.value = data
}

// Участие
const isParticipated = computed(() =>
  event.value.participants.some((p: any) => p.id === userId)
)

async function joinEvent() {
  await axios.post(
    `/events/${route.params.id}/join`, {}, 
    { headers: { Authorization: `Bearer ${auth.token}` } }
  )
  await loadEvent()
}

async function unjoinEvent() {
  await axios.post(
    `/events/${route.params.id}/unjoin`, {}, 
    { headers: { Authorization: `Bearer ${auth.token}` } }
  )
  await loadEvent()
}

// Комментарии
async function postComment() {
  if (!newComment.value.trim()) return
  await axios.post(
    `/events/${route.params.id}/comments`,
    { content: newComment.value },
    { headers: { Authorization: `Bearer ${auth.token}` } }
  )
  newComment.value = ''
  await loadComments()
}

// Форматирование дат
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}
function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Инициализация
onMounted(async () => {
  await loadEvent()
  await loadComments()
})
</script>
