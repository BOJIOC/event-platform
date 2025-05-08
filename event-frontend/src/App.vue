<template>
  <v-app :dark="isDark">
    <!-- Навигационное выдвижное меню -->
    <v-navigation-drawer app v-model="drawer" clipped>
      <v-list dense nav>
        <v-list-item to="/" link>
          <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
          <v-list-item-title>Главная</v-list-item-title>
        </v-list-item>
        <v-list-item to="/events" link>
          <v-list-item-icon><v-icon>mdi-calendar-multiselect</v-icon></v-list-item-icon>
          <v-list-item-title>Мероприятия</v-list-item-title>
        </v-list-item>
        <v-list-item to="/my-events" link>
          <v-list-item-icon><v-icon>mdi-account-clock</v-icon></v-list-item-icon>
          <v-list-item-title>Мои мероприятия</v-list-item-title>
        </v-list-item>
        <v-divider class="my-2"/>
        <v-list-item @click="logout">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-title>Выйти</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Верхняя панель -->
    <v-app-bar app color="indigo" dark clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title>Event Platform</v-toolbar-title>
      <v-spacer/>
      <!-- Переключение светлой/тёмной темы -->
      <v-btn icon @click="isDark = !isDark">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main>
      <v-container fluid class="pa-4">
        <router-view/>
      </v-container>
    </v-main>

    <!-- Снизу – общий снэкбар для уведомлений -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" bottom right>
      {{ snackbar.text }}
      <template #action>
        <v-btn text @click="snackbar.show = false">Закрыть</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// состояние бокового меню, темы и снекбара
const drawer = ref(false)
const isDark = ref(false)
const snackbar = ref({ show: false, text: '', color: 'success' })
const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.clearToken()
  router.push('/login')
  snackbar.value = { show: true, text: 'Вы вышли', color: 'info' }
}
</script>

<style>
/* Можно добавить кастомные цвета, шрифты и т.п. */
</style>
