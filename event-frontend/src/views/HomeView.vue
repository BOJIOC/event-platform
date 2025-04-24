<template>
  <v-container>
    <!-- Показываем только неавторизованным -->
    <div v-if="!auth.isLoggedIn()">
      <h1 class="text-h4 mb-2">Добро пожаловать 👋</h1>
      <p>Это платформа для совместного планирования мероприятий.</p>
      <v-btn to="/login" color="primary" class="me-2">Войти</v-btn>
      <v-btn to="/register" color="success">Зарегистрироваться</v-btn>
    </div>

    <div v-else>
      <h1 class="text-h4 mb-2">Привет, {{ getEmail() }}!</h1>
      <p>Перейдите в раздел <router-link to="/events">«Все мероприятия»</router-link> или <router-link to="/my-events">«Мои мероприятия»</router-link>.</p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const auth = useAuthStore()

const getEmail = (): string => {
  try {
    const payload = JSON.parse(atob(auth.token.split('.')[1]))
    return payload.email
  } catch {
    return ''
  }
}
</script>
