import { createRouter, createWebHistory } from 'vue-router'
import HomeView         from '@/views/HomeView.vue'
import LoginView        from '@/views/LoginView.vue'
import RegisterView     from '@/views/RegisterView.vue'
import EventsView       from '@/views/EventsView.vue'
import EventDetailView  from '@/views/EventDetailView.vue'
import MyEventsView     from '@/views/MyEventsView.vue'
import CreateEventView  from '@/views/CreateEventView.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/',              name: 'home',             component: HomeView },
  { path: '/login',         name: 'login',            component: LoginView },
  { path: '/register',      name: 'register',         component: RegisterView },
  { path: '/my-events',     name: 'my-events',        component: MyEventsView,        meta: { requiresAuth: true } },
  { path: '/events',        name: 'events',           component: EventsView,          meta: { requiresAuth: true } },
  { path: '/events/new',    name: 'event-create',     component: CreateEventView,     meta: { requiresAuth: true } },
  { path: '/events/:id',    name: 'event-detail',     component: EventDetailView,     meta: { requiresAuth: true } },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/login')
  }
  next()
})

export default router
