import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './src/home/HomeView.vue'
import PicsView from './src/pics/client/PicsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/pics', name: 'pics', component: PicsView }
  ]
})

export default router
