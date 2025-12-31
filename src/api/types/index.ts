/**
 * API 响应基础类型定义
 */

// 通用响应结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
}

// 分页响应数据
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 用户信息类型
export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  avatar?: string
  role: string
  token?: string
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应数据
export interface LoginResult {
  token: string
  userInfo: UserInfo
}

// 表格数据项类型（示例）
export interface TableItem {
  id: number
  name: string
  status: number
  createTime: string
  updateTime: string
  description?: string
}
