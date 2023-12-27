import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import P5UI from 'p5-ui'
import 'p5-ui/dist/style.css'
import { createI18n } from 'vue-i18n' // Import createI18n function

const messages = {
    en: {
        question1: 'Would you <span style="color: red; font-size: 16px;">join the Phantom Thieves</span>?',
        question2: 'Do you believe in the <span style="color: red; font-size: 16px;">Phantom Thieves?</span>',
        question3: 'Are the Phantom Thieves <span style="color: red; font-size: 16px;">just?</span>',
        question4: 'Are the Phantom Thieves <span style="color: red; font-size: 16px;">innocent?</span>',
        question5: 'Do you <span style="color: red; font-size: 16px;">support</span> the Phantom Thieves?',
        question6: 'Do the Phantom Thieves <span style="color: red; font-size: 16px;">really exist</span>?',
        buttons: {
            yes: 'Yes',
            no: 'No'
        }
    },
    zh: {
        question1: '你会想<span style="color: red; font-size: 16px;">加入怪盗团</span>吗？',
        question2: '你相信<span style="color: red; font-size: 16px;">心灵怪盗</span>吗？',
        question3: '你认为怪盗团拥有<span style="color: red; font-size: 16px;">正义</span>吗？',
        question4: '你认为怪盗团是<span style="color: red; font-size: 16px;">清白</span>的吗？',
        question5: '你会<span style="color: red; font-size: 16px;">支持怪盗团</span>吗？',
        question6: '你认为怪盗团是<span style="color: red; font-size: 16px;"">真实存在</span>的吗？',
        buttons: {
            yes: '是',
            no: '不是'
        }
    }
  };
// Create the i18n instance with the messages
const i18n = createI18n({
  locale: 'zh-cn', // Set default locale
  fallbackLocale: 'en', // Set fallback locale
  messages, // Set the messages
})

const app = createApp(App)
app.use(P5UI)
app.use(i18n)
app.mount('#app')
//createApp(App).mount('#app')
