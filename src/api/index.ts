/**
 * API 统一导出
 * 集中管理所有 API 接口
 */

import request from '@/utils/request'
import type { LoginParams, LoginResult, UserInfo } from './types'

/**
 * 用户相关 API
 */
export const userApi = {
  // 用户登录
  login(data: LoginParams) {
    return request.post<LoginResult>('/user/login', data, {
      showLoading: true,
      showSuccess: true,
      successMsg: '登录成功'
    })
  },

  // 获取用户信息
  getUserInfo() {
    return request.get<UserInfo>('/user/info', {
      showLoading: false
    })
  },

  // 退出登录
  logout() {
    return request.post('/user/logout', {}, {
      showSuccess: true,
      successMsg: '退出成功'
    })
  }
}

export default request
