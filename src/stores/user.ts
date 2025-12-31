/**
 * 用户状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/api/types'
import { userApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.nickname || userInfo.value?.username || '')
  const userRole = computed(() => userInfo.value?.role || '')

  /**
   * 设置 Token
   */
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  /**
   * 设置用户信息
   */
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  /**
   * 登录
   */
  const login = async (username: string, password: string) => {
    try {
      loading.value = true
      const res = await userApi.login({ username, password })
      
      if (res.data) {
        setToken(res.data.token)
        setUserInfo(res.data.userInfo)
      }
      
      return res
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    try {
      loading.value = true
      const res = await userApi.getUserInfo()
      
      if (res.data) {
        setUserInfo(res.data)
      }
      
      return res
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 退出登录
   */
  const logout = async () => {
    try {
      await userApi.logout()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      // 清除本地数据
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    // 状态
    token,
    userInfo,
    loading,
    // 计算属性
    isLoggedIn,
    userName,
    userRole,
    // 方法
    setToken,
    setUserInfo,
    login,
    getUserInfo,
    logout,
    reset
  }
})
