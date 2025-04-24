<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Event Platform</v-app-bar-title>
      <v-spacer />
      <template v-if="auth.isLoggedIn()">
        <router-link to="/my-events">
          <v-btn text>Мои мероприятия</v-btn>
        </router-link>
        <v-chip>{{ getEmail() }}</v-chip>
        <v-btn text @click="logout">Выйти</v-btn>
      </template>
      <template v-else>
        <v-btn text to="/login">Вход</v-btn>
        <v-btn text to="/register">Регистрация</v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.clearToken()
  router.push('/login')
}

const getEmail = (): string => {
  try {
    const payload = JSON.parse(atob(auth.token.split('.')[1]))
    return payload.email
  } catch {
    return ''
  }
}
</script>
