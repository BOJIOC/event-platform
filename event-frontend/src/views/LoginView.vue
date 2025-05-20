<template>
  <v-container class="pa-8">
    <v-card class="mx-auto" max-width="400">
      <v-card-title class="text-h5">Вход</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            :error="!!errors.email"
            :error-messages="errors.email"
          />
          <v-text-field
            v-model="password"
            label="Пароль"
            type="password"
            required
            :error="!!errors.password"
            :error-messages="errors.password"
          />
          <v-btn
            type="submit"
            color="primary"
            class="mt-4"
            :loading="loading"
            block
          >
            Войти
          </v-btn>
        </v-form>
        <v-alert
          v-if="errors.general"
          type="error"
          class="mt-4"
          dense
        >
          {{ errors.general }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth   = useAuthStore()

const email    = ref('')
const password = ref('')
const loading  = ref(false)
const errors   = reactive<{ email?:string; password?:string; general?:string }>({})

async function login() {
  // сброс ошибок
  errors.email = errors.password = errors.general = ''

  // клиентская валидация
  if (!email.value.trim())    errors.email    = 'Введите email'
  if (!password.value.trim()) errors.password = 'Введите пароль'
  if (errors.email || errors.password) return

  loading.value = true
  try {
    const res = await api.post('/auth/login', {
      email:    email.value,
      password: password.value,
    })
    const token = res.data.access_token
    // Сохраняем токен и распарсим user
    auth.setToken(token)
    // Перенаправляем на список событий
    router.push({ name: 'events' })
  } catch (e: any) {
    // 401 Unauthorized
    if (e.response?.status === 401) {
      errors.general = 'Неверный email или пароль'
    } else {
      errors.general = e.response?.data?.message || 'Ошибка при логине'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.pa-8 { padding: 2rem; }
.mt-4 { margin-top: 1rem; }
</style>
