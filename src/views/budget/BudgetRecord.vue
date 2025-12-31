<template>
  <div class="budget-record-page">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">预警记录</h2>
      </div>

      <!-- 搜索表单 -->
      <div class="search-form">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="预警类型:">
            <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 200px">
              <el-option label="设备预警" value="设备预警" />
              <el-option label="样品预警" value="样品预警" />
              <el-option label="安全监控预警" value="安全监控预警" />
              <el-option label="环境预警" value="环境预警" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="预警级别:">
            <el-input v-model="searchForm.level" placeholder="请输入" clearable style="width: 200px" />
          </el-form-item>
          
          <el-form-item label="处理结果:">
            <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
              <el-option label="已解决" value="已解决" />
              <el-option label="已忽略" value="已忽略" />
              <el-option label="处理中" value="处理中" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="预警时间:">
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

      <!-- 导出按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="handleExport">导出数据</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="预警名称" min-width="150" />
        <el-table-column prop="type" label="预警类型" width="120" />
        <el-table-column prop="level" label="预警级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.level)" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="预警信息" min-width="180" show-overflow-tooltip />
        <el-table-column prop="alertTime" label="预警时间" width="160" />
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column prop="handleTime" label="处理时间" width="160" />
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="{ row }">
            <span class="status-dot" :class="getStatusClass(row.status)"></span>
            <span>{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleProcess(row)">处理预警</el-button>
            <el-button type="primary" link size="small" @click="handleView(row)">查看预警</el-button>
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

    <!-- 处理预警弹窗 -->
    <el-dialog
      v-model="processDialogVisible"
      title="处理预警"
      width="500px"
    >
      <el-form ref="processFormRef" :model="processForm" :rules="processRules" label-width="100px">
        <el-form-item label="处理结果:" prop="result">
          <el-select v-model="processForm.result" placeholder="请选择" style="width: 100%">
            <el-option label="已解决" value="已解决" />
            <el-option label="已忽略" value="已忽略" />
            <el-option label="处理中" value="处理中" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitProcess">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看预警弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="查看预警"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="预警名称:">
          <el-input v-model="currentItem.name" readonly />
        </el-form-item>
        <el-form-item label="预警类型:">
          <el-input v-model="currentItem.type" readonly />
        </el-form-item>
        <el-form-item label="预警级别:">
          <el-input v-model="currentItem.level" readonly />
        </el-form-item>
        <el-form-item label="预警信息:">
          <el-input v-model="currentItem.message" readonly />
        </el-form-item>
        <el-form-item label="预警时间:">
          <el-input v-model="currentItem.alertTime" readonly />
        </el-form-item>
        <el-form-item label="处理人:">
          <el-input v-model="currentItem.handler" readonly />
        </el-form-item>
        <el-form-item label="处理时间:">
          <el-input v-model="currentItem.handleTime" readonly />
        </el-form-item>
        <el-form-item label="处理状态:">
          <el-input v-model="currentItem.status" readonly />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  type: '',
  level: '',
  status: '',
  dateRange: [] as any[]
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 100
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '高温供暖器固管理器',
    type: '设备预警',
    level: '中风险',
    message: '这里是预警预警信息',
    alertTime: '2023-01-01 11:59',
    handler: '张三',
    handleTime: '2023-01-02 11:59',
    status: '已解决'
  },
  {
    id: 2,
    name: '冷藏柜成绩存储器',
    type: '样品预警',
    level: '低风险',
    message: '这里是预警预警信息',
    alertTime: '2023-01-01 11:59',
    handler: '张三',
    handleTime: '2023-01-02 11:59',
    status: '已忽略'
  },
  {
    id: 3,
    name: '试剂液品管理器',
    type: '安全监控预警',
    level: '高风险',
    message: '这里是预警预警信息',
    alertTime: '2023-01-01 11:59',
    handler: '张三',
    handleTime: '2023-01-02 11:59',
    status: '已解决'
  },
  {
    id: 4,
    name: '实验室管理规制',
    type: '环境预警',
    level: '高风险',
    message: '这里是预警预警信息',
    alertTime: '2023-01-01 11:59',
    handler: '张三',
    handleTime: '2023-01-02 11:59',
    status: '已解决'
  }
])

// 弹窗相关
const processDialogVisible = ref(false)
const viewDialogVisible = ref(false)

// 当前操作的数据
const currentItem = ref<any>({})
const processForm = reactive({
  result: ''
})

const processFormRef = ref<FormInstance>()

// 处理表单验证规则
const processRules: FormRules = {
  result: [
    { required: true, message: '请选择处理结果', trigger: 'change' }
  ]
}

// 获取级别标签类型
const getLevelTagType = (level: string) => {
  const levelMap: Record<string, any> = {
    '低风险': 'success',
    '中风险': 'warning',
    '高风险': 'danger'
  }
  return levelMap[level] || ''
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '已解决': 'status-resolved',
    '已忽略': 'status-ignored',
    '处理中': 'status-processing'
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
  searchForm.type = ''
  searchForm.level = ''
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.page = 1
  ElMessage.info('重置搜索条件')
}

// 导出数据
const handleExport = () => {
  ElMessage.info('导出数据功能')
}

// 处理预警
const handleProcess = (row: any) => {
  currentItem.value = { ...row }
  processForm.result = ''
  processDialogVisible.value = true
}

// 查看预警
const handleView = (row: any) => {
  currentItem.value = { ...row }
  viewDialogVisible.value = true
}

// 提交处理
const handleSubmitProcess = () => {
  if (!processFormRef.value) return
  
  processFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('处理成功')
      processDialogVisible.value = false
      // 实际项目中这里应该调用接口
    }
  })
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // 重新加载数据
}

const handlePageChange = (page: number) => {
  pagination.page = page
  // 重新加载数据
}
</script>

<style scoped>
.budget-record-page {
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

/* 状态圆点 */
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-dot.status-resolved {
  background-color: #67c23a;
}

.status-dot.status-ignored {
  background-color: #909399;
}

.status-dot.status-processing {
  background-color: #e6a23c;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
