/**
 * 通用数据请求组合式函数
 */

import { ref, Ref } from 'vue'

interface UseFetchOptions<T> {
  immediate?: boolean
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
}

export function useFetch<T = any>(
  fetcher: () => Promise<any>,
  options: UseFetchOptions<T> = {}
) {
  const { immediate = true, initialData = null as any, onSuccess, onError } = options

  const data: Ref<T> = ref(initialData)
  const loading = ref(false)
  const error = ref<any>(null)

  const execute = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await fetcher()
      data.value = result.data || result
      
      if (onSuccess) {
        onSuccess(data.value)
      }
      
      return data.value
    } catch (err) {
      error.value = err
      
      if (onError) {
        onError(err)
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    refresh: execute
  }
}
