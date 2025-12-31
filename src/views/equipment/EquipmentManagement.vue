<template>
  <div class="equipment-management-page">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">实验设备</h2>
      </div>

      <!-- 搜索表单 -->
      <div class="search-form">
        <el-form :model="searchForm" :inline="true">
          <el-form-item label="设备名称:">
            <el-input v-model="searchForm.name" placeholder="请选择" clearable style="width: 200px" />
          </el-form-item>
          
          <el-form-item label="设备编号:">
            <el-input v-model="searchForm.code" placeholder="请选择" clearable style="width: 200px" />
          </el-form-item>
          
          <el-form-item label="设备状态:">
            <el-input v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px" />
          </el-form-item>
          
          <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 设备卡片网格 -->
      <div class="equipment-grid">
        <div v-for="item in equipmentList" :key="item.id" class="equipment-card" @click="handleViewDetail(item)">
          <div class="card-header">
            <el-tag :type="getStatusTagType(item.status)" size="small" class="status-tag">{{ item.statusText }}</el-tag>
          </div>
          <div class="card-body">
            <div class="equipment-icon">
              <el-icon :size="60" color="#409eff"><Box /></el-icon>
            </div>
            <div class="equipment-info">
              <h3 class="equipment-name">{{ item.name }}</h3>
              <p class="equipment-model">{{ item.model }}</p>
            </div>
          </div>
          <div class="card-footer">
            <el-button text size="small" @click.stop="handleViewEquipment(item)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button text size="small" @click.stop="handleUseEquipment(item)">
              <el-icon><CircleCheck /></el-icon>
              使用
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Box, View, CircleCheck } from '@element-plus/icons-vue'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  name: '',
  code: '',
  status: ''
})

// 设备列表数据
const equipmentList = ref([
  { id: 1, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'using', statusText: '使用中' },
  { id: 2, name: '双炉体自动差热分析天平', model: 'HGST-2', status: 'using', statusText: '使用中' },
  { id: 3, name: '全自动泰勒天平（自动熔融法分析仪）', model: 'HGST-1', status: 'available', statusText: '空闲' },
  { id: 4, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'available', statusText: '空闲' },
  { id: 5, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'using', statusText: '使用中' },
  { id: 6, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'using', statusText: '使用中' },
  { id: 7, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'maintenance', statusText: '离线' },
  { id: 8, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'maintenance', statusText: '离线' },
  { id: 9, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'maintenance', statusText: '离线' },
  { id: 10, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'maintenance', statusText: '离线' },
  { id: 11, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'maintenance', statusText: '离线' },
  { id: 12, name: '双炉体自动差热分析天平', model: 'HGST-1', status: 'maintenance', statusText: '离线' }
])


// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const statusMap: Record<string, any> = {
    'using': '',
    'available': 'success',
    'maintenance': 'info'
  }
  return statusMap[status] || ''
}

// 搜索
const handleSearch = () => {
  ElMessage.info('搜索功能')
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.code = ''
  searchForm.status = ''
}

// 查看设备详情
const handleViewDetail = (item: any) => {
  router.push(`/equipment/detail/${item.id}`)
}

// 查看设备
const handleViewEquipment = (item: any) => {
  ElMessage.info(`查看设备: ${item.name}`)
}

// 使用设备
const handleUseEquipment = (item: any) => {
  ElMessage.info(`使用设备: ${item.name}`)
}
</script>

<style scoped>
.equipment-management-page {
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

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.equipment-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.equipment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  justify-content: flex-end;
}

.status-tag {
  font-size: 12px;
}

.card-body {
  padding: 24px 16px;
  text-align: center;
}

.equipment-icon {
  margin-bottom: 16px;
}

.equipment-info {
  margin-top: 12px;
}

.equipment-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.equipment-model {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

.card-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f2f5;
  display: flex;
  justify-content: space-around;
}

.card-footer .el-button {
  font-size: 13px;
}

/* 响应式 */
@media (max-width: 1600px) {
  .equipment-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .equipment-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .equipment-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
