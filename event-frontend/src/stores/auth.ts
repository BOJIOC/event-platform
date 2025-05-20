import { defineStore } from 'pinia'

/** Декодируем JWT без библиотек */
function decodeJwt<T>(token: string): T {
  const base64Url = token.split('.')[1] || ''
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2,'0'))
      .join(''),
  )
  return JSON.parse(json) as T
}

interface JwtPayload {
  sub: number
  email: string
  role: string
  exp: number
}

export interface User {
  id: number
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as User | null,
  }),
  getters: {
    isLoggedIn: state => state.user !== null,
  },
  actions: {
    setToken(token: string) {
      try {
        const p = decodeJwt<JwtPayload>(token)
        // проверяем, не просрочен ли токен
        if (Date.now() < p.exp * 1000) {
          this.token = token
          this.user = { id: p.sub, email: p.email, role: p.role }
          localStorage.setItem('token', token)
          return
        }
      } catch {
        // декод не удался
      }
      // если что-то пошло не так, чистим
      this.logout()
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
