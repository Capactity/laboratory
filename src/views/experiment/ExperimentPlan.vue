<template>
  <div class="experiment-plan-page">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">实验方案</h2>
      </div>

      <!-- 搜索表单 -->
      <div class="search-form">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="方案名称:">
            <el-input v-model="searchForm.name" placeholder="请输入" clearable style="width: 200px" />
          </el-form-item>
          
          <el-form-item label="方案编号:">
            <el-input v-model="searchForm.code" placeholder="请选择" clearable style="width: 200px" />
          </el-form-item>
          
          <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="handleExport">导出数据</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="planName" label="方案名称" min-width="120" />
        <el-table-column prop="planCode" label="方案编号" width="130" />
        <el-table-column prop="creator" label="创建人" width="90" />
        <el-table-column prop="description" label="实验说明" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="updateTime" label="修改时间" width="160" />
        <el-table-column label="停用/启用" width="100" align="center">
          <template #default="{ row }">
            <el-switch 
              v-model="row.enabled" 
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleCopy(row)">复制</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link size="small" @click="handleDelete(row)">删除</el-button>
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[8, 100]"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

// 搜索表单
const searchForm = reactive({
  name: '',
  code: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 8,
  total: 100
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    planName: '样品名称1',
    planCode: 'EXP-20251201',
    creator: '张三',
    description: '这里是实验说明这里是实验基本说明...',
    createTime: '2023-01-02 11:59',
    updateTime: '2023-01-02 11:59',
    enabled: false
  },
  {
    id: 2,
    planName: '样品名称2',
    planCode: 'EXP-20251202',
    creator: '张三',
    description: '这里是实验说明这里是实验基本说明...',
    createTime: '2023-01-02 11:59',
    updateTime: '2023-01-02 11:59',
    enabled: false
  },
  {
    id: 3,
    planName: '样品名称3',
    planCode: 'EXP-20251203',
    creator: '张三',
    description: '这里是实验说明这里是实验基本说明...',
    createTime: '2023-01-02 11:59',
    updateTime: '2023-01-02 11:59',
    enabled: true
  },
  {
    id: 4,
    planName: '样品名称4',
    planCode: 'EXP-20251204',
    creator: '张三',
    description: '这里是实验基本说明这里是实验基本说明...',
    createTime: '2023-01-02 11:59',
    updateTime: '2023-01-02 11:59',
    enabled: true
  }
])

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.info('搜索功能')
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.code = ''
  pagination.page = 1
}

// 新增
const handleAdd = () => {
  ElMessage.info('新增方案功能')
}

// 导出
const handleExport = () => {
  ElMessage.info('导出数据功能')
}

// 状态切换
const handleStatusChange = (row: any) => {
  const status = row.enabled ? '启用' : '停用'
  ElMessage.success(`已${status}方案: ${row.planName}`)
}

// 复制
const handleCopy = (row: any) => {
  ElMessage.success(`复制方案: ${row.planName}`)
}

// 编辑 - 预留空白，后续添加逻辑
const handleEdit = (row: any) => {
  router.push(`/experiment/plan/edit/${row.id}`)
  // TODO: 后续添加编辑逻辑
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除方案"${row.planName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 查看
const handleView = (row: any) => {
  ElMessage.info(`查看方案: ${row.planName}`)
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
.experiment-plan-page {
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
