<template>
  <div class="experiment-sample-page">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">样品信息</h2>
      </div>

      <!-- 搜索表单 -->
      <div class="search-form">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="样品名称:">
            <el-input v-model="searchForm.name" placeholder="请输入" clearable style="width: 200px" />
          </el-form-item>
          
          <el-form-item label="样品编号:">
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
        <el-button type="primary" @click="handleExport">导出数据</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="sampleName" label="样品名称" min-width="120" />
        <el-table-column prop="sampleCode" label="样品编号" width="130" />
        <el-table-column prop="quantity" label="样品数量" width="90" />
        <el-table-column prop="spec" label="样品规格" width="90" />
        <el-table-column prop="type" label="样品类型" width="90" />
        <el-table-column prop="form" label="样品形态" width="90" />
        <el-table-column prop="experimentName" label="实验名称" min-width="150" />
        <el-table-column prop="experimentCode" label="实验编号" width="130" />
        <el-table-column prop="status" label="实验状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="manager" label="负责人" width="90" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link size="small" @click="handleExperiment(row)">实验</el-button>
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

    <!-- 执行实验弹窗 -->
    <el-dialog
      v-model="executeDialogVisible"
      title="执行"
      width="500px"
    >
      <el-form :model="executeForm" :rules="executeRules" ref="executeFormRef" label-width="80px">
        <el-form-item label="速度:" prop="speed">
          <el-input v-model="executeForm.speed" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="时间:" prop="time">
          <el-input v-model="executeForm.time" placeholder="请选择" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="executeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleExecuteSubmit">开始实验</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

const router = useRouter()

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
    sampleName: '样品名称1',
    sampleCode: 'EXP-20251201',
    quantity: 15,
    spec: '规格1',
    type: '类型1',
    form: '固态',
    experimentName: '材料热稳定性分析实验',
    experimentCode: 'EXP-20251201',
    status: '已完成',
    manager: '张三'
  },
  {
    id: 2,
    sampleName: '样品名称2',
    sampleCode: 'EXP-20251202',
    quantity: 20,
    spec: '规格2',
    type: '类型2',
    form: '液态',
    experimentName: '金属材料表面改性实验',
    experimentCode: 'EXP-20251202',
    status: '进行中',
    manager: '张三'
  },
  {
    id: 3,
    sampleName: '样品名称3',
    sampleCode: 'EXP-20251203',
    quantity: 10,
    spec: '规格3',
    type: '类型3',
    form: '液态',
    experimentName: '复合材料检测物系统实验',
    experimentCode: 'EXP-20251203',
    status: '已完成',
    manager: '张三'
  },
  {
    id: 4,
    sampleName: '样品名称4',
    sampleCode: 'EXP-20251204',
    quantity: 8,
    spec: '规格4',
    type: '类型4',
    form: '固态',
    experimentName: '塑料物理检测基础实验',
    experimentCode: 'EXP-20251204',
    status: '已完成',
    manager: '张三'
  }
])

// 弹窗
const executeDialogVisible = ref(false)

// 执行表单
const executeForm = reactive({
  speed: '',
  time: ''
})

const executeFormRef = ref<FormInstance>()

const executeRules: FormRules = {
  speed: [{ required: true, message: '请输入速度', trigger: 'blur' }],
  time: [{ required: true, message: '请选择时间', trigger: 'blur' }]
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const statusMap: Record<string, any> = {
    '已完成': 'success',
    '进行中': ''
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
  searchForm.name = ''
  searchForm.code = ''
  pagination.page = 1
}

// 导出
const handleExport = () => {
  ElMessage.info('导出数据功能')
}

// 查看 - 跳转到详情页
const handleView = (row: any) => {
  router.push(`/experiment/sample/detail/${row.id}`)
}

// 实验
const handleExperiment = (row: any) => {
  ElMessage.info(`实验: ${row.sampleName}`)
}

// 提交执行
const handleExecuteSubmit = () => {
  if (!executeFormRef.value) return
  
  executeFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('开始实验成功')
      executeDialogVisible.value = false
      executeForm.speed = ''
      executeForm.time = ''
    }
  })
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
.experiment-sample-page {
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
