import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Esto busca automáticamente src/router/index.js

import './assets/global.css'
import { BaseButton } from './components'

const app = createApp(App)
app.use(createPinia())
app.component('BaseButton', BaseButton)
app.use(router)
app.mount('#app')