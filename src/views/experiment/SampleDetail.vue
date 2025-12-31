<template>
  <div class="sample-detail-page">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">查看样品信息</h2>
      </div>

      <div class="sample-detail">
        <!-- 实验样品信息 -->
        <div class="detail-section">
          <h3 class="section-title">实验样品信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">实验名称：</span>
              <span class="value">这里是实验名称</span>
            </div>
            <div class="info-item">
              <span class="label">实验编号：</span>
              <span class="value">SY393745</span>
            </div>
            <div class="info-item">
              <span class="label">实验状态：</span>
              <span class="value">实验样品1</span>
            </div>
            <div class="info-item">
              <span class="label">样品数量：</span>
              <span class="value">3</span>
            </div>
            <div class="info-item">
              <span class="label">实验负责人：</span>
              <span class="value">成白</span>
            </div>
            <div class="info-item">
              <span class="label">实验开始时间：</span>
              <span class="value">2025-10-09 12:03:09</span>
            </div>
            <div class="info-item">
              <span class="label">计划结束时间：</span>
              <span class="value">2025-10-10 11:00:08</span>
            </div>
            <div class="info-item">
              <span class="label">实际结束时间：</span>
              <span class="value">2025-10-11 11:00:08</span>
            </div>
            <div class="info-item">
              <span class="label">实验类型：</span>
              <span class="value">实验类型1</span>
            </div>
          </div>
        </div>

        <!-- 样品信息表格 -->
        <div class="detail-section">
          <h3 class="section-title">样品信息</h3>
          <el-table :data="sampleDetailData" border style="width: 100%" size="small">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="样品名称" width="120" />
            <el-table-column prop="code" label="样品编号" width="130" />
            <el-table-column prop="quantity" label="样品数量" width="90" />
            <el-table-column prop="spec" label="样品规格" width="90" />
            <el-table-column prop="type" label="样品类型" width="90" />
            <el-table-column prop="form" label="样品形态" width="90" />
            <el-table-column prop="status" label="样品状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 实验进度表格 -->
        <div class="detail-section">
          <h3 class="section-title">实验进度</h3>
          <el-table :data="progressData" border style="width: 100%" size="small">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="deviceName" label="设备名称" min-width="180" />
            <el-table-column prop="deviceCode" label="设备编号" width="120" />
            <el-table-column prop="deviceType" label="设备类型" width="120" />
            <el-table-column prop="protocol" label="连接协议" width="120" />
            <el-table-column prop="deviceStatus" label="设备状态" width="100">
              <template #default="{ row }">
                <span :class="['status-dot', getDeviceStatusClass(row.deviceStatus)]"></span>
                {{ row.deviceStatus }}
              </template>
            </el-table-column>
            <el-table-column prop="execStatus" label="执行状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getExecStatusType(row.execStatus)" size="small">{{ row.execStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="handleStartExperiment(row)"
                  :disabled="row.execStatus === '进行中'"
                >
                  {{ row.execStatus === '进行中' ? '进行中' : '开始实验' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 关闭按钮 -->
        <div class="footer-actions">
          <el-button @click="handleClose">关闭</el-button>
        </div>
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

// 样品详情数据
const sampleDetailData = ref([
  { id: 1, name: '样品名称1', code: '22-TZ2Hu01', quantity: 22, spec: '规格1', type: '类型1', form: '固态', status: '进行中' }
])

// 实验进度数据
const progressData = ref([
  {
    id: 1,
    deviceName: '双炉体自动差热分析天平',
    deviceCode: 'HQST-1',
    deviceType: '同步热分析',
    protocol: '这里是连接协议',
    deviceStatus: '上线',
    execStatus: '进行中'
  },
  {
    id: 2,
    deviceName: '双炉体自动差热分析天平',
    deviceCode: 'HQST-2',
    deviceType: '同步热分析',
    protocol: '这里是连接协议',
    deviceStatus: '关机',
    execStatus: '已完成'
  },
  {
    id: 3,
    deviceName: '全自动泰勒天平（综合热分析仪）',
    deviceCode: 'HQT-1',
    deviceType: '同步热分析',
    protocol: '这里是连接协议',
    deviceStatus: '通讯正常',
    execStatus: '已完成'
  }
])

// 执行弹窗
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

// 获取设备状态样式
const getDeviceStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '上线': 'online',
    '关机': 'offline',
    '通讯正常': 'normal'
  }
  return statusMap[status] || ''
}

// 获取执行状态类型
const getExecStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    '进行中': 'success',
    '已完成': ''
  }
  return statusMap[status] || ''
}

// 开始实验
const handleStartExperiment = (_row: any) => {
  executeDialogVisible.value = true
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

// 关闭返回
const handleClose = () => {
  router.back()
}
</script>

<style scoped>
.sample-detail-page {
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

.sample-detail {
  padding: 20px 0;
}

.detail-section {
  margin-bottom: 30px;
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px 30px;
  margin-bottom: 20px;
}

.info-item {
  font-size: 14px;
  line-height: 1.8;
}

.info-item .label {
  color: #606266;
}

.info-item .value {
  color: #303133;
  font-weight: 500;
}

/* 设备状态指示器 */
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-dot.online {
  background: #67c23a;
}

.status-dot.offline {
  background: #f56c6c;
}

.status-dot.normal {
  background: #67c23a;
}

.footer-actions {
  margin-top: 30px;
  text-align: center;
}
</style>
