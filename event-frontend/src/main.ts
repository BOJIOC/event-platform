import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import router from './router'
import axios from 'axios'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Настройка Axios
axios.defaults.baseURL = 'http://localhost:3000/api'
axios.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Vuetify
const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: { /* ваши цвета */ },
      dark:  { /* ваши цвета */ },
    },
  },
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// **Восстанавливаем токен до подключения роутера!**
const auth = useAuthStore(pinia)
const saved = localStorage.getItem('token')
if (saved) {
  auth.setToken(saved)
}

app.use(router)
app.use(vuetify)
app.mount('#app')
