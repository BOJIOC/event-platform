<template>
  <v-container fluid class="pa-0">
    <!-- Hero -->
    <v-sheet height="400" class="hero d-flex align-center justify-center">
      <div class="text-center hero-text">
        <h1 class="hero-title">Event Platform</h1>
        <p class="hero-subtitle">
          Планируйте и участвуйте в мероприятиях вместе с друзьями и коллегами.
        </p>
        <div v-if="!isLoggedIn" class="mt-6">
          <v-btn to="/register" color="secondary" large>
            Нет аккаунта? Зарегистрируйтесь!
          </v-btn>
        </div>
      </div>
    </v-sheet>

    <!-- Фичи -->
    <v-container class="pt-12 pb-20">
      <v-row dense>
        <v-col cols="12" md="4" v-for="(f,i) in features" :key="i">
          <v-card class="feature-card pa-6 text-center elevation-2">
            <v-icon size="48" color="primary">{{ f.icon }}</v-icon>
            <h3 class="mt-4 mb-2">{{ f.title }}</h3>
            <p>{{ f.text }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- CTA (нижняя секция) -->
    <v-sheet class="cta-flex pa-12">
      <div class="cta-content">
        <h2 class="display-1 hero-cta-title mb-6">Готовы начать?</h2>
        <div class="cta-button-wrapper">
          <v-btn to="/events/new" color="secondary" large class="me-4">
            Создать событие
          </v-btn>
          <v-btn to="/events" outlined large>
            Все мероприятия
          </v-btn>
        </div>
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const features = [
  { icon: 'mdi-calendar-multiselect', title: 'Управление событиями', text: 'Создавайте и редактируйте встречи.' },
  { icon: 'mdi-account-multiple',     title: 'Команда участников',   text: 'Следите, кто уже присоединился.' },
  { icon: 'mdi-comment-multiple',     title: 'Обсуждения',           text: 'Обменивайтесь идеями и комментариями.' },
]

const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isLoggedIn)
</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  background:
    linear-gradient(
      135deg,
      rgba(100,181,246,0.85) 0%,
      rgba(66,165,245,0.85)   50%,
      rgba(33,150,243,0.85)   100%
    ),
    url('https://source.unsplash.com/1600x900/?conference');
  background-size: cover;
  background-position: center;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
}
.hero-text {
  position: relative;
  color: #fff;
}
.hero-title {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}
.hero-subtitle {
  font-size: 1.25rem;
}

/* Фичи */
.feature-card {
  transition: transform .3s, box-shadow .3s;
}
.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

/* CTA */
.cta-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to right,
    rgba(100,181,246,1)  0%,
    rgba(66,165,245,1)   50%,
    rgba(33,150,243,1)  100%
  );
}
.cta-content {
  text-align: center;
  width: 100%;
  max-width: 500px;
}
.hero-cta-title {
  color: #FFFFFF;
  margin-bottom: 2rem;
}
.cta-button-wrapper {
  display: flex;
  justify-content: center;
}
</style>
