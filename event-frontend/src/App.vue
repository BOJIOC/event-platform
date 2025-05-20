<template>
  <v-app :dark="isDark">
    <!-- Навигационное выдвижное меню -->
    <v-navigation-drawer app v-model="drawer" clipped>
      <v-list dense nav>
        <v-list-item to="/" link>
          <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
          <v-list-item-title>Главная</v-list-item-title>
        </v-list-item>

        <template v-if="isLoggedIn">
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
            <v-list-item-title>Выйти ({{ userName }})</v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <v-divider class="my-2"/>
          <v-list-item to="/login" link>
            <v-list-item-icon><v-icon>mdi-login</v-icon></v-list-item-icon>
            <v-list-item-title>Вход</v-list-item-title>
          </v-list-item>
          <v-list-item to="/register" link>
            <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
            <v-list-item-title>Регистрация</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Верхняя панель без переключателя темы -->
    <v-app-bar app color="indigo" dark clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title>Event Platform</v-toolbar-title>
      <v-spacer/>
      <!-- Отображаем email, если залогинен -->
      <div v-if="isLoggedIn" class="mr-4">
        <v-icon left>mdi-account</v-icon>{{ userName }}
      </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const drawer   = ref(false)
const snackbar = ref({ show: false, text: '', color: 'success' })
const router   = useRouter()
const auth     = useAuthStore()

const isLoggedIn = computed(() => auth.isLoggedIn)
const userName   = computed(() => auth.user?.email || '')

function logout() {
  auth.logout()
  router.push('/login')
  snackbar.value = {
    show: true,
    text: 'Вы вышли из системы',
    color: 'info',
  }
}
</script>

<style>
/* Ваши дополнительные стили */
</style>
