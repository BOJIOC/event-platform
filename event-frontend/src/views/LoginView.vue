<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="400" elevation="2">
      <v-card-title class="text-h5">Вход</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
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
            Войти
          </v-btn>
        </v-form>
      </v-card-text>
      <v-alert v-if="error" type="error" class="mt-2">{{ error }}</v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const router = useRouter()
const auth = useAuthStore()

const login = async () => {
  try {
    const response = await axios.post('/auth/login', {
      email: email.value,
      password: password.value,
    })
    const token = response.data.access_token
    auth.setToken(token)
	localStorage.setItem('token', token)
    router.push('/events')
  } catch (err) {
    error.value = 'Неверный email или пароль'
  }
}
</script>
