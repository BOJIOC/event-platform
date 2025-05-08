import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router'
import axios from 'axios'

// 1. Устанавливаем базовый URL
axios.defaults.baseURL = 'http://localhost:3000/api'

// 2. Интерсептор, который добавляет Authorization во все запросы
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3f51b5',
          secondary: '#2196f3',
          accent: '#e91e63',
          info: '#00bcd4',
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
          background: '#f5f5f5',
        },
      },
      dark: {
        colors: {
          primary: '#1e88e5',
          secondary: '#29b6f6',
          accent: '#ff4081',
          info: '#26c6da',
          success: '#66bb6a',
          warning: '#ffa726',
          error: '#ef5350',
          background: '#121212',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
