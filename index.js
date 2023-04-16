import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './indexApp.vue'
import router from './indexRouter.js'

import './src/_assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
