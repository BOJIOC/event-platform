<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="400" elevation="2">
      <v-card-title class="text-h5">Регистрация</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field v-model="name" label="Имя" required />
          <v-text-field v-model="email" label="Email" type="email" required />
          <v-text-field v-model="password" label="Пароль" type="password" required />
          <v-btn type="submit" block color="primary" class="mt-4">Зарегистрироваться</v-btn>
        </v-form>
        <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const register = async () => {
  try {
    await axios.post('/users', { name: name.value, email: email.value, password: password.value })
    router.push('/login')
  } catch (err) {
    error.value = 'Ошибка при регистрации'
  }
}
</script>
