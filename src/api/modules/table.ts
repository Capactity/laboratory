/**
 * 表格数据相关 API
 */

import request from '@/utils/request'
import type { PageParams, PageResult, TableItem } from '../types'

/**
 * 获取表格列表数据
 */
export function getTableList(params: PageParams & { keyword?: string }) {
  return request.get<PageResult<TableItem>>('/table/list', {
    params,
    showLoading: true
  })
}

/**
 * 获取表格详情
 */
export function getTableDetail(id: number) {
  return request.get<TableItem>(`/table/${id}`)
}

/**
 * 创建表格数据
 */
export function createTableItem(data: Partial<TableItem>) {
  return request.post('/table/create', data, {
    showSuccess: true,
    successMsg: '创建成功'
  })
}

/**
 * 更新表格数据
 */
export function updateTableItem(id: number, data: Partial<TableItem>) {
  return request.put(`/table/${id}`, data, {
    showSuccess: true,
    successMsg: '更新成功'
  })
}

/**
 * 删除表格数据
 */
export function deleteTableItem(id: number) {
  return request.delete(`/table/${id}`, {
    showSuccess: true,
    successMsg: '删除成功'
  })
}
