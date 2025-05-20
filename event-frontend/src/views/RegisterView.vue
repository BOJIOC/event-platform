<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="400">
      <v-card-title class="text-h5">Регистрация</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="name"
            label="Имя"
            required
          />
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            label="Пароль"
            type="password"
            required
          />
          <v-btn color="primary" type="submit" block class="mt-4">
            Зарегистрироваться
          </v-btn>
        </v-form>
        <!-- Показываем ошибку -->
        <v-alert v-if="error" type="error" class="mt-4">
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/axios'          // ваш настроенный axios-инстанс

const name     = ref('')
const email    = ref('')
const password = ref('')
const error    = ref<string | null>(null)
const router   = useRouter()

async function register() {
  error.value = null
  try {
    console.log('Регистрация:', { name: name.value, email: email.value, password: password.value })
    const res = await api.post('/users', {
      name:     name.value,
      email:    email.value,
      password: password.value,
    })
    console.log('Успешная регистрация, ответ сервера:', res.data)
    // При желании сразу логиним или идём на /login
    router.push('/login')
  } catch (err: any) {
    // Показываем в консоли весь ответ от сервера
    console.error('Ошибка при регистрации:', err)
    if (err.response && err.response.data) {
      // Если сервер вернул поле message как строку или массив ошибок
      const data = err.response.data
      if (Array.isArray(data.message)) {
        // если массив ошибок валидации
        error.value = data.message.join('; ')
      } else if (typeof data.message === 'string') {
        error.value = data.message
      } else {
        error.value = 'Неизвестная ошибка'
      }
    } else {
      error.value = 'Сервер недоступен'
    }
  }
}
</script>
