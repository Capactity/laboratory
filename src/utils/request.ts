/**
 * Axios 请求封装
 * 包含请求拦截器、响应拦截器、错误处理等
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { ApiResponse } from '@/api/types'

// 加载实例计数器
let loadingInstance: any = null
let requestCount = 0

// 显示 loading
const showLoading = () => {
  if (requestCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  requestCount++
}

// 隐藏 loading
const hideLoading = () => {
  requestCount--
  if (requestCount === 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

// 请求配置接口扩展
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean // 是否显示 loading
  showError?: boolean // 是否显示错误提示
  showSuccess?: boolean // 是否显示成功提示
  successMsg?: string // 成功提示文本
}

class Request {
  private instance: AxiosInstance
  private abortControllerMap: Map<string, AbortController>

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.abortControllerMap = new Map()
    this.setupInterceptors()
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 处理 loading
        if (config.showLoading !== false) {
          showLoading()
        }

        // 添加请求取消功能
        const controller = new AbortController()
        const url = config.url || ''
        config.signal = controller.signal
        this.abortControllerMap.set(url, controller)

        return config
      },
      (error: AxiosError) => {
        hideLoading()
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        hideLoading()

        const config = response.config as RequestConfig
        const { data } = response

        // 从 map 中删除已完成的请求
        this.abortControllerMap.delete(response.config.url || '')

        // 业务错误处理
        if (data.code !== 200 && data.code !== 0) {
          if (config.showError !== false) {
            ElMessage.error(data.message || '请求失败')
          }
          return Promise.reject(data)
        }

        // 显示成功提示
        if (config.showSuccess) {
          ElMessage.success(config.successMsg || data.message || '操作成功')
        }

        return data
      },
      (error: AxiosError<ApiResponse>) => {
        hideLoading()

        // 从 map 中删除已完成的请求
        this.abortControllerMap.delete(error.config?.url || '')

        const config = error.config as RequestConfig

        // 请求被取消
        if (axios.isCancel(error)) {
          console.log('请求已取消:', error.message)
          return Promise.reject(error)
        }

        // HTTP 错误处理
        let message = '请求失败'

        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            case 400:
              message = data?.message || '请求参数错误'
              break
            case 401:
              message = '未授权，请重新登录'
              // 清除 token 并跳转到登录页
              localStorage.removeItem('token')
              window.location.href = '/login'
              break
            case 403:
              message = '拒绝访问'
              break
            case 404:
              message = '请求地址不存在'
              break
            case 500:
              message = '服务器内部错误'
              break
            case 502:
              message = '网关错误'
              break
            case 503:
              message = '服务不可用'
              break
            case 504:
              message = '网关超时'
              break
            default:
              message = data?.message || `请求失败: ${status}`
          }
        } else if (error.request) {
          message = '网络错误，请检查网络连接'
        }

        // 显示错误提示
        if (config?.showError !== false) {
          ElMessage.error(message)
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * 通用请求方法
   */
  request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.request(config)
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request({ ...config, method: 'GET', url })
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request({ ...config, method: 'PUT', url, data })
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request({ ...config, method: 'DELETE', url })
  }

  /**
   * 取消指定请求
   */
  cancelRequest(url: string | string[]) {
    const urls = Array.isArray(url) ? url : [url]
    urls.forEach((u) => {
      const controller = this.abortControllerMap.get(u)
      if (controller) {
        controller.abort()
        this.abortControllerMap.delete(u)
      }
    })
  }

  /**
   * 取消所有请求
   */
  cancelAllRequest() {
    this.abortControllerMap.forEach((controller) => {
      controller.abort()
    })
    this.abortControllerMap.clear()
  }
}

// 创建请求实例
const request = new Request({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

export default request
