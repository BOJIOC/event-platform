<template>
  <v-container class="pa-4" max-width="600">
    <v-card>
      <v-card-title>Создать новое мероприятие</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="onSubmit">
          <!-- Название -->
          <v-text-field
            v-model="title"
            label="Название"
            :rules="[v => !!v || 'Введите название']"
            required
          />

          <!-- Описание -->
          <v-textarea
            v-model="description"
            label="Описание"
            rows="4"
            :rules="[v => !!v || 'Введите описание']"
            required
          />

          <!-- Дата мероприятия -->
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="formattedDate"
                label="Дата мероприятия"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="props"
                :rules="[v => !!v || 'Выберите дату']"
                required
              />
            </template>

            <v-card>
              <v-date-picker
                v-model="date"
                locale="ru"
                :first-day-of-week="1"
                @input="menu = false"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn text color="primary" @click="menu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <!-- Кнопка создать -->
          <v-btn class="mt-4" color="primary" type="submit" block>
            Создать
          </v-btn>

          <!-- Ошибка -->
          <v-alert v-if="error" type="error" dense class="mt-4">
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/axios'
import { useAuthStore } from '@/stores/auth'

// Поля формы
const title       = ref('')
const description = ref('')
const date        = ref<string|null>(null)

// Попап-меню и ошибка
const menu  = ref(false)
const error = ref<string|null>(null)

const router = useRouter()
const auth   = useAuthStore()

// Отображаем DD.MM.YYYY через Intl
const formattedDate = computed({
  get: () => {
    if (!date.value) return ''
    const d = new Date(date.value)
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(d)
  },
  set: () => {}
})

async function onSubmit() {
  error.value = null

  if (!title.value || !description.value || !date.value) {
    error.value = 'Заполните все поля'
    return
  }

  try {
    await api.post(
      '/events',
      { title: title.value, description: description.value, date: date.value },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )
    router.push('/events')
  } catch (e: any) {
    console.error('Ошибка при создании события', e)
    error.value = e.response?.data?.message || 'Не удалось создать событие'
  }
}
</script>

<style scoped>
/* Стили берет Vuetify */
</style>
