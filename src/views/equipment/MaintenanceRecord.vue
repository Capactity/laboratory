<template>
  <div class="maintenance-record-page">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">保养记录</h2>
      </div>

      <!-- 搜索表单 -->
      <div class="search-form">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="设备名称:">
            <el-input v-model="searchForm.equipmentName" placeholder="请输入" clearable style="width: 200px" />
          </el-form-item>
          
          <el-form-item label="保养状态:">
            <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
              <el-option label="已完成" value="已完成" />
              <el-option label="进行中" value="进行中" />
              <el-option label="待保养" value="待保养" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="保养时间:">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="→"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="handleAdd">新增保养记录</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="equipmentName" label="设备名称" min-width="150" />
        <el-table-column prop="maintenanceType" label="保养类型" width="120" />
        <el-table-column prop="maintenanceDate" label="保养日期" width="120" />
        <el-table-column prop="nextDate" label="下次保养日期" width="120" />
        <el-table-column prop="maintainer" label="保养人员" width="100" />
        <el-table-column prop="status" label="保养状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  equipmentName: '',
  status: '',
  dateRange: [] as any[]
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 30
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    equipmentName: '双炉体自动差热分析天平',
    maintenanceType: '定期保养',
    maintenanceDate: '2023-12-01',
    nextDate: '2024-03-01',
    maintainer: '张三',
    status: '已完成',
    remarks: '设备运行正常'
  },
  {
    id: 2,
    equipmentName: '全自动泰勒天平',
    maintenanceType: '定期保养',
    maintenanceDate: '2023-11-15',
    nextDate: '2024-02-15',
    maintainer: '李四',
    status: '已完成',
    remarks: '清洁校准完成'
  },
  {
    id: 3,
    equipmentName: '差热分析仪',
    maintenanceType: '故障维修',
    maintenanceDate: '2023-12-10',
    nextDate: '2024-06-10',
    maintainer: '王五',
    status: '进行中',
    remarks: '更换传感器'
  }
])

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const statusMap: Record<string, any> = {
    '已完成': 'success',
    '进行中': 'warning',
    '待保养': 'info'
  }
  return statusMap[status] || ''
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.info('搜索功能')
}

// 重置
const handleReset = () => {
  searchForm.equipmentName = ''
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.page = 1
}

// 新增
const handleAdd = () => {
  ElMessage.info('新增保养记录')
}

// 查看
const handleView = (row: any) => {
  ElMessage.info(`查看: ${row.equipmentName}`)
}

// 编辑
const handleEdit = (row: any) => {
  ElMessage.info(`编辑: ${row.equipmentName}`)
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handlePageChange = (page: number) => {
  pagination.page = page
}
</script>

<style scoped>
.maintenance-record-page {
  padding: 20px;
  background: #f0f2f5;
}

.page-card {
  min-height: calc(100vh - 100px);
}

.page-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

:deep(.search-form .el-form-item) {
  margin-bottom: 0;
}

.action-buttons {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
