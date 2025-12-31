/**
 * 应用主入口文件
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// 引入 Element Plus 样式
import 'element-plus/dist/index.css'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(router)
app.use(pinia)

// 挂载应用
app.mount('#app')
