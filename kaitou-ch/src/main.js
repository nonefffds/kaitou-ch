import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import P5UI from 'p5-ui'
import 'p5-ui/dist/style.css'

const app = createApp(App)
app.use(P5UI)
app.mount('#app')
//createApp(App).mount('#app')
