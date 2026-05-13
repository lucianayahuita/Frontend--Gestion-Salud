import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/global.css'
import { BaseButton } from './components'

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App)
app.use(VCalendar, {});
app.use(createPinia())
app.component('BaseButton', BaseButton)
app.use(router)
app.mount('#app')