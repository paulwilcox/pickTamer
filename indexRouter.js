import { createRouter, createWebHistory } from 'vue-router'
import homeView from './src/home/home.vue'
import picsView from './src/pics/pics.vue';

let router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: homeView },
    { path: '/pics', name: 'pics', component: picsView }
  ]
})

export default router
