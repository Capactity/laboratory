<template>
  <div class="equipment-detail-page">
    <el-card class="detail-card">
      <!-- 顶部设备基本信息 -->
      <div class="equipment-header">
        <div class="equipment-image-wrapper">
          <img :src="equipment.image" :alt="equipment.name" class="equipment-main-image">
        </div>
        
        <div class="equipment-basic-info">
          <h1 class="equipment-name">{{ equipment.name }}</h1>
          
          <div class="info-row">
            <span class="info-label">类型：</span>
            <span class="info-value">{{ equipment.type }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">型号：</span>
            <span class="info-value">{{ equipment.model }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">用途：</span>
            <span class="info-value">{{ equipment.usage }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ equipment.phone }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 设备详情标签页 -->
    <el-card class="detail-tabs-card">
      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="设备详情" name="detail">
          <div class="tab-content">
            <!-- 仪器特点 -->
            <div class="section">
              <h3 class="section-title">仪器特点</h3>
              <div class="feature-list">
                <div v-for="(feature, index) in equipment.features" :key="index" class="feature-item">
                  <span class="feature-number">{{ index + 1 }}.</span>
                  <span class="feature-text">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- 仪器用途 -->
            <div class="section">
              <h3 class="section-title">仪器用途</h3>
              <p class="section-text">{{ equipment.applicationDescription }}</p>
            </div>

            <!-- 仪器指标 -->
            <div class="section">
              <h3 class="section-title">仪器指标</h3>
              <el-table :data="equipment.specifications" border class="spec-table">
                <el-table-column 
                  v-for="col in specColumns" 
                  :key="col.prop"
                  :prop="col.prop" 
                  :label="col.label"
                  :width="col.width"
                  align="center"
                />
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref('detail')

// 表格列配置
const specColumns = ref([
  { prop: 'category', label: '', width: '150' },
  { prop: 'spec1', label: '测温系统', width: '' },
  { prop: 'spec2', label: '天平系统', width: '' }
])

// 设备详细信息（模拟数据）
const equipment = ref({
  id: route.params.id || '1',
  name: '双炉体自动差热分析天平',
  type: '同步热分析仪',
  model: 'HGST-1/HGST-2',
  usage: '主要用量与热量有关的物理、化学变化，如物质的熔点、熔化物、结晶与结晶热、相变反应热、热稳定性（氧化作用等）、玻璃化转变温度、固相反应量、成分的含量分析、分解、化合、脱水、添加剂等多元化对比研究。',
  phone: '400-188-7666',
  image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400&h=300&fit=crop',
  
  features: [
    '采用自动动作控制"体设计，搭载24位全自动选择模块，可在有限空间精准自调温度等传播术，24小时连续无人值守运行；',
    '支持炉盘、变温、恒样扫描等多处延实验模式选择；',
    '进样容差位精度<±0.05MM，确保样品与传感器精准对齐；',
    '支持两段运行操纵，实现中途可加入高差性质实验监督序，实现自动化化；',
    '自有多重安全保护装置，出现进击，异常状态升监显占自的保护，投壶、样品的护等；',
    '可选延长后应配复试，通过红盘自动呼叫尺控焙点红线传量自助切割，真可升放细口切比火，能与其身处途人协同工作。',
    '炉听自动升率可控、定位精准、提高商测量要性；',
    '全自动测量升温速率，实时控制温量过程，COS等待数据统处理、及DSC矫正项、标准计算、动力学参数计算、数据比较、多样程云计算选化能、玻璃化转变涩度、比较法测量比热等智能化处理；',
    '仪器扩展性，选配恒温反应木系统、可与红外光谱仪、质谱仪、气相色谱仪使用，可进行板放气体二次检测，检温范围：室温-200℃，控温精度：±0.1℃',
    '特殊附件（选配）：UV光固化系统、反应泣样板欧视频路，多趋势毛洋器系统，水蒸气发生器的测系统。'
  ],
  
  applicationDescription: '可测量与热量性关的物理、化学变化、研究物质熔点、热稳定性、成分含量等多种特性。',
  
  specifications: [
    {
      category: '测温范围',
      spec1: 'HGST-1：室温-1150℃\nHGST-2：室温-1550℃\n(可选不同炉体)',
      spec2: '炉壁范重量更类天平'
    },
    {
      category: '温度准确度',
      spec1: '±0.1℃',
      spec2: '热量量程：1-200mg\n天平量程：0.1μg\n热量类声：<0.1μg'
    },
    {
      category: '升率温速率',
      spec1: '0.1℃/min-100℃/min',
      spec2: ''
    },
    {
      category: 'DSC范围',
      spec1: '0-±500mW',
      spec2: '更坐检测'
    },
    {
      category: 'DSC灵敏',
      spec1: '±0.1μW',
      spec2: 'DTA量程：±2000μV\n测样器：0.01μV'
    },
    {
      category: '反应参数',
      spec1: '▶固体补偿：100mW/K',
      spec2: '样品气载：氨化、还击、惰性、真空'
    },
    {
      category: '热计精度',
      spec1: '±0.1%(s)',
      spec2: '标称：商家提供0.06ml或0.12ml\n地域：完题、短直线、右贯穿线、铝金词调'
    },
    {
      category: '温度/指时控卡',
      spec1: '多点校维、温性转至控卡术',
      spec2: ''
    }
  ]
})
</script>

<style scoped>
.equipment-detail-page {
  padding: 20px;
  background: #f0f2f5;
}

.detail-card {
  margin-bottom: 20px;
}

.equipment-header {
  display: flex;
  gap: 40px;
  padding: 20px;
}

.equipment-image-wrapper {
  flex: 0 0 300px;
  height: 300px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.equipment-main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.equipment-basic-info {
  flex: 1;
}

.equipment-name {
  margin: 0 0 25px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.info-row {
  margin-bottom: 15px;
  line-height: 1.8;
  font-size: 14px;
}

.info-label {
  color: #606266;
  font-weight: 500;
  min-width: 80px;
  display: inline-block;
}

.info-value {
  color: #303133;
  line-height: 1.8;
}

.detail-tabs-card {
  margin-bottom: 20px;
}

.detail-tabs {
  min-height: 500px;
}

.tab-content {
  padding: 20px 0;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 10px;
  border-bottom: 2px solid #e4e7ed;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  line-height: 1.8;
  font-size: 14px;
  color: #606266;
}

.feature-number {
  flex-shrink: 0;
  margin-right: 8px;
  color: #909399;
}

.feature-text {
  flex: 1;
}

.section-text {
  line-height: 1.8;
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.spec-table {
  width: 100%;
  margin-top: 15px;
}

:deep(.spec-table .el-table__cell) {
  padding: 12px 0;
  font-size: 13px;
}

:deep(.spec-table .el-table__header th) {
  background: #f5f7fa;
  color: #303133;
  font-weight: 600;
}

:deep(.spec-table .cell) {
  white-space: pre-wrap;
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 968px) {
  .equipment-header {
    flex-direction: column;
  }
  
  .equipment-image-wrapper {
    flex: 0 0 auto;
    width: 100%;
    height: 250px;
  }
}
</style>
