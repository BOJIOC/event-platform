<template>
  <v-container>
    <h1 class="text-h4 mb-6">Создать новое мероприятие</h1>

    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="title"
        label="Название"
        required
      />

      <v-textarea
        v-model="description"
        label="Описание"
        rows="4"
        required
      />

      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template #activator="{ props }">
          <v-text-field
            v-model="formattedDate"
            label="Дата мероприятия"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="props"
            required
          />
        </template>

        <v-date-picker
          v-model="date"
          @update:modelValue="onPick"
        />
      </v-menu>

      <v-btn
        type="submit"
        color="primary"
        class="mt-4"
        :loading="loading"
      >
        Создать
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// store/router
const auth = useAuthStore()
const router = useRouter()

// поля формы
const title = ref('')
const description = ref('')
const date = ref<Date | null>(null)      
const formattedDate = ref('')            
const menu = ref(false)                  
const error = ref<string | null>(null)
const loading = ref(false)

// хелпер для строки даты
function toISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// выбор даты в календаре
function onPick(picked: Date) {
  date.value = picked
  formattedDate.value = toISO(picked)
  menu.value = false
}

// отправка формы
async function submit() {
  if (!title.value || !description.value || !formattedDate.value) {
    error.value = 'Заполните все поля'
    return
  }
  loading.value = true
  error.value = null

  try {
    const res = await axios.post(
      '/events',
      {
        title: title.value,
        description: description.value,
        date: formattedDate.value,
      },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )
    router.push({ name: 'event-detail', params: { id: res.data.id } })
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Ошибка при создании'
  } finally {
    loading.value = false
  }
}
</script>
