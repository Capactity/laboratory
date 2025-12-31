/**
 * Pinia Store 统一导出
 */

import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出各个 store
export * from './user'
