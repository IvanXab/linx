import { createApp } from 'vue'
import { registerProviders } from '@/app/providers'
import App from '@/App.vue'
import '@/app/styles/index.scss'

const app = createApp(App)

registerProviders(app)
app.mount('#app')