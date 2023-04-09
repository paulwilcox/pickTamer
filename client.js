import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router.js'

import './src/_assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
