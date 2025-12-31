<template>
  <div class="home-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <h1 class="welcome-title">欢迎登录实验室管理平台</h1>
      <div class="welcome-info">
        <span>{{ currentDate }}</span>
        <span class="separator">星期{{ weekDay }}</span>
        <span>{{ currentTime }}</span>
      </div>
    </div>

    <!-- 仪器分区展示 -->
    <el-card class="equipment-section">
      <el-tabs v-model="activeTab" class="equipment-tabs">
        <el-tab-pane label="热分析仪" name="thermal">
          <template #label>
            <span class="tab-label">热分析仪</span>
            <span class="tab-badge">已租借 1</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="物理化学类仪器" name="physical"></el-tab-pane>
        <el-tab-pane label="前处理类仪器" name="pretreatment"></el-tab-pane>
        <el-tab-pane label="制剂盒制品" name="preparation"></el-tab-pane>
      </el-tabs>

      <div class="equipment-grid">
        <div 
          v-for="item in equipmentList" 
          :key="item.id" 
          class="equipment-card"
        >
          <div class="equipment-image" @click="handleEquipmentClick(item)">
            <img :src="item.image" :alt="item.name">
          </div>
          <div class="equipment-name" @click="goToDetail(item)">{{ item.name }}</div>
        </div>
      </div>

      <div class="more-link">
        <el-link type="primary" @click="handleMoreClick">更多</el-link>
      </div>
    </el-card>

    <!-- 设备详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :show-close="true"
      width="700px"
      class="equipment-dialog"
      center
    >
      <div class="dialog-content">
        <div class="equipment-preview">
          <img :src="currentEquipment?.image" :alt="currentEquipment?.name">
        </div>
        <div class="equipment-title">{{ currentEquipment?.name }}</div>
        
        <!-- 分页指示器 -->
        <div class="pagination-dots">
          <span 
            v-for="(_item, index) in equipmentList" 
            :key="index"
            class="dot"
            :class="{ active: currentEquipmentIndex === index }"
            @click="switchEquipment(index)"
          ></span>
        </div>
      </div>
      
      <!-- 左右切换按钮 -->
      <div class="nav-buttons">
        <el-button 
          class="nav-btn prev-btn" 
          circle 
          :disabled="currentEquipmentIndex === 0"
          @click="prevEquipment"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <el-button 
          class="nav-btn next-btn" 
          circle 
          :disabled="currentEquipmentIndex === equipmentList.length - 1"
          @click="nextEquipment"
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </el-dialog>

    <!-- 底部三栏布局 -->
    <div class="bottom-section">
      <!-- 预警记录 -->
      <el-card class="budget-card">
        <template #header>
          <div class="card-header">
            <span>预警记录</span>
            <el-link type="primary" :underline="false">更多</el-link>
          </div>
        </template>
        
        <el-table :data="budgetList" style="width: 100%" :show-header="true">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="name" label="预警名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="type" label="预警类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="预警时间" width="110" />
          <el-table-column prop="period" label="预警时期" width="100" />
          <el-table-column label="操作" width="120">
            <template #default>
              <el-button type="primary" link size="small">处理</el-button>
              <el-button type="primary" link size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 实验样品统计 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>实验样品统计</span>
          </div>
        </template>
        <div ref="chartRef" class="chart-container"></div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-dot" style="background: #5B8FF9"></span>
            <span>已完成</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot" style="background: #FFD666"></span>
            <span>进行中</span>
          </div>
        </div>
      </el-card>

      <!-- 通知公告 -->
      <el-card class="notice-card">
        <template #header>
          <div class="card-header">
            <span>通知公告</span>
            <el-link type="primary" :underline="false">更多</el-link>
          </div>
        </template>
        
        <div class="notice-list">
          <div v-for="item in noticeList" :key="item.id" class="notice-item">
            <div class="notice-content">
              <span class="notice-title">{{ item.title }}</span>
            </div>
            <el-tag type="danger" size="small" round>{{ item.count }}篇</el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const router = useRouter()
const activeTab = ref('thermal')
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 时间相关
const currentDate = ref('')
const currentTime = ref('')
const weekDay = ref('')
let timer: number | null = null

// 设备弹窗相关
const dialogVisible = ref(false)
const currentEquipmentIndex = ref(0)

// 当前选中的设备
const currentEquipment = computed(() => equipmentList.value[currentEquipmentIndex.value])

// 更新时间
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  const days = ['日', '一', '二', '三', '四', '五', '六']
  
  currentDate.value = `${year}年${month}月${date}日`
  currentTime.value = `${hours}:${minutes}:${seconds}`
  weekDay.value = days[now.getDay()]
}

// 仪器列表
const equipmentList = ref([
  { 
    id: 1, 
    name: '双炉体自动差热分析天平', 
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400&h=300&fit=crop' 
  },
  { 
    id: 2, 
    name: '全自动泰勒天平（全自动熔融法分级仪）', 
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop' 
  },
  { 
    id: 3, 
    name: '差热分析仪', 
    image: 'https://images.unsplash.com/photo-1581092160607-ee67f7d2c4f1?w=400&h=300&fit=crop' 
  },
  { 
    id: 4, 
    name: '全自动差热分析仪', 
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop' 
  },
  { 
    id: 5, 
    name: '磁热差示扫描量热仪', 
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop' 
  }
])

// 预警记录
const budgetList = ref([
  { name: '高温供暖器固管理器', type: '设备预警', time: '2023-01-01 11:59', period: '处理' },
  { name: '冷藏柜成绩存储器', type: '样品预警', time: '2023-01-01 11:59', period: '处理' },
  { name: '试剂液品管理器', type: '安装维护预警', time: '2023-01-01 11:59', period: '高风险' },
  { name: '实验室管理规制', type: '环境预警', time: '2023-01-01 11:59', period: '高风险' }
])

// 通知公告
const noticeList = ref([
  { id: 1, title: '实验室标：XXXX实验室公室提交记录', count: 192 },
  { id: 2, title: '实验室标：XXXX实验室公室提交记录', count: 947 },
  { id: 3, title: '实验室标：XXXX实验室公室提交记录', count: 947 },
  { id: 4, title: '实验室标：XXXX实验室公室提交记录', count: 876 },
  { id: 5, title: '实验室标：XXXX实验室公室提交记录', count: 876 }
])

// 获取类型标签样式
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, any> = {
    '设备预警': 'warning',
    '样品预警': 'success',
    '安装维护预警': 'danger',
    '环境预警': 'danger'
  }
  return typeMap[type] || ''
}

// 查看更多设备
const handleMoreClick = () => {
  router.push('/home/equipment-list')
}

// 跳转到设备详情页
const goToDetail = (item: any) => {
  router.push(`/home/equipment-detail/${item.id}`)
}

// 设备弹窗处理函数
const handleEquipmentClick = (item: any) => {
  const index = equipmentList.value.findIndex(eq => eq.id === item.id)
  currentEquipmentIndex.value = index
  dialogVisible.value = true
}

// 切换设备
const switchEquipment = (index: number) => {
  currentEquipmentIndex.value = index
}

// 上一个设备
const prevEquipment = () => {
  if (currentEquipmentIndex.value > 0) {
    currentEquipmentIndex.value--
  }
}

// 下一个设备
const nextEquipment = () => {
  if (currentEquipmentIndex.value < equipmentList.value.length - 1) {
    currentEquipmentIndex.value++
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: [
          { value: 570, name: '已完成', itemStyle: { color: '#5B8FF9' } },
          { value: 314, name: '进行中', itemStyle: { color: '#FFD666' } }
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 生命周期
onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
  
  // 延迟初始化图表，确保DOM已渲染
  setTimeout(() => {
    initChart()
  }, 100)
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {
    chartInstance?.resize()
  })
})
</script>

<style scoped>
.home-container {
  padding: 0;
  background: #f0f2f5;
}

.welcome-banner {
  background: linear-gradient(135deg, #5b7cff 0%, #7b68ee 100%);
  padding: 30px 40px;
  margin-bottom: 20px;
  border-radius: 0;
  color: white;
  box-shadow: 0 2px 12px rgba(91, 124, 255, 0.3);
}

.welcome-title {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 500;
}

.welcome-info {
  font-size: 14px;
  opacity: 0.95;
}

.separator {
  margin: 0 15px;
}

.equipment-section {
  margin-bottom: 20px;
}

.equipment-tabs {
  margin-bottom: 20px;
}

:deep(.equipment-tabs .el-tabs__item) {
  font-size: 14px;
}

.tab-label {
  margin-right: 8px;
}

.tab-badge {
  background: #ecf5ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.equipment-card {
  text-align: center;
}

.equipment-image {
  width: 100%;
  height: 140px;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s;
}

.equipment-image:hover {
  opacity: 0.8;
}

.equipment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.equipment-name {
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: pointer;
  transition: color 0.3s;
}

.equipment-name:hover {
  color: #409eff;
}

.more-link {
  text-align: right;
  padding-top: 10px;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 380px 380px;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.chart-card {
  height: 400px;
}

.chart-container {
  width: 100%;
  height: 260px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.notice-card {
  height: 400px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
  transition: background 0.3s;
}

.notice-item:hover {
  background: #f0f0f0;
}

.notice-content {
  flex: 1;
  overflow: hidden;
}

.notice-title {
  font-size: 14px;
  color: #303133;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.budget-card {
  height: 400px;
}

:deep(.budget-card .el-card__body) {
  padding: 0;
}

/* 响应式 */
@media (max-width: 1400px) {
  .bottom-section {
    grid-template-columns: 1fr;
  }
  
  .chart-card,
  .notice-card,
  .budget-card {
    height: auto;
  }
}

@media (max-width: 768px) {
  .equipment-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
}

/* 设备详情弹窗 */
:deep(.equipment-dialog) {
  border-radius: 12px;
}

:deep(.equipment-dialog .el-dialog__header) {
  padding: 15px 20px;
}

:deep(.equipment-dialog .el-dialog__body) {
  padding: 20px;
  position: relative;
}

.dialog-content {
  text-align: center;
}

.equipment-preview {
  width: 100%;
  height: 400px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: hidden;
}

.equipment-preview img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.equipment-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #dcdfe6;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-dots .dot:hover {
  background: #b3b8c4;
}

.pagination-dots .dot.active {
  width: 24px;
  border-radius: 5px;
  background: #409eff;
}

.nav-buttons {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  pointer-events: none;
}

.nav-btn {
  pointer-events: all;
  background: white;
  border: 1px solid #dcdfe6;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover:not(:disabled) {
  background: #f5f7fa;
  border-color: #409eff;
  color: #409eff;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.prev-btn {
  margin-left: -25px;
}

.next-btn {
  margin-right: -25px;
}
</style>
