import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FetchApiExample from '../views/FetchApiExample.vue'
import pics from '../views/pics.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/FetchApiExample',
      name: 'fetchApiExample',
      component: FetchApiExample
    },
    {
      path: '/pics',
      name: 'pics',
      component: pics
    }
  ]
})

export default router
