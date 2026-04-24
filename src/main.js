import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/global.css'
import { BaseButton } from './components'

const app = createApp(App)
app.use(createPinia())
app.component('BaseButton', BaseButton)
app.use(router)
app.mount('#app')