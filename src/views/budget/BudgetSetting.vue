<template>
  <div class="budget-setting-page">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">预警设置</h2>
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
          
          <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="handleApplyData">申请数据</el-button>
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
        <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 查看弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="查看"
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
        <el-form-item label="说明:">
          <el-input
            v-model="currentItem.description"
            type="textarea"
            :rows="4"
            readonly
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="预警名称:" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="预警类型:" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择" style="width: 100%">
            <el-option label="设备预警" value="设备预警" />
            <el-option label="样品预警" value="样品预警" />
            <el-option label="安全监控预警" value="安全监控预警" />
            <el-option label="环境预警" value="环境预警" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警级别:" prop="level">
          <el-select v-model="editForm.level" placeholder="请选择" style="width: 100%">
            <el-option label="低风险" value="低风险" />
            <el-option label="中风险" value="中风险" />
            <el-option label="高风险" value="高风险" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明:">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  type: '',
  level: ''
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
    description: '这里是预警设明这里是预警设明这里是预警设明这里是预警设明',
    createTime: '2023-01-01 11:59'
  },
  {
    id: 2,
    name: '冷藏柜成绩存储器',
    type: '样品预警',
    level: '低风险',
    description: '这里是预警设明这里是预警设明这里是预警设明这里是预警设明',
    createTime: '2023-01-01 11:59'
  },
  {
    id: 3,
    name: '试剂液品管理器',
    type: '安全监控预警',
    level: '高风险',
    description: '这里是预警设明这里是预警设明这里是预警设明这里是预警设明',
    createTime: '2023-01-01 11:59'
  },
  {
    id: 4,
    name: '实验室管理规制',
    type: '环境预警',
    level: '高风险',
    description: '这里是预警设明这里是预警设明这里是预警设明这里是预警设明',
    createTime: '2023-01-01 11:59'
  }
])

// 弹窗相关
const viewDialogVisible = ref(false)
const editDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = computed(() => isEdit.value ? '编辑' : '新增')

// 当前操作的数据
const currentItem = ref<any>({})
const editForm = reactive({
  name: '',
  type: '',
  level: '',
  description: ''
})

const editFormRef = ref<FormInstance>()

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入预警名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择预警类型', trigger: 'change' }
  ],
  level: [
    { required: true, message: '请选择预警级别', trigger: 'change' }
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

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.info('搜索功能')
}

// 重置
const handleReset = () => {
  searchForm.type = ''
  searchForm.level = ''
  pagination.page = 1
  ElMessage.info('重置搜索条件')
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  editForm.name = ''
  editForm.type = ''
  editForm.level = ''
  editForm.description = ''
  editDialogVisible.value = true
}

// 申请数据
const handleApplyData = () => {
  ElMessage.info('申请数据功能')
}

// 查看
const handleView = (row: any) => {
  currentItem.value = { ...row }
  viewDialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  isEdit.value = true
  editForm.name = row.name
  editForm.type = row.type
  editForm.level = row.level
  editForm.description = row.description
  currentItem.value = { ...row }
  editDialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('删除成功')
      // 实际项目中这里应该调用删除接口
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 提交
const handleSubmit = () => {
  if (!editFormRef.value) return
  
  editFormRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        ElMessage.success('编辑成功')
      } else {
        ElMessage.success('新增成功')
      }
      editDialogVisible.value = false
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
.budget-setting-page {
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

:deep(.el-dialog__body) {
  padding-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
