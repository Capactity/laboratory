<template>
  <div class="equipment-detail-management-page">
    <el-card class="page-card">
      <!-- 设备基本信息 -->
      <div class="equipment-header">
        <div class="header-left">
          <h2 class="equipment-title">设备名称：双炉体自动差热分析天平</h2>
          <p class="equipment-subtitle">设备型号：HGST-1</p>
          <p class="equipment-subtitle">设备类别：同步热分析</p>
        </div>
        <div class="header-right">
          <span class="status-label">状态：</span>
          <el-switch v-model="equipmentStatus" active-text="使用" />
        </div>
      </div>

      <!-- 标签页 -->
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- 实例信息 -->
        <el-tab-pane label="实例信息" name="instance">
          <div class="tab-content">
            <h4 class="section-title">设备信息</h4>
            <div class="instance-info-container">
              <div class="info-left">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="设备名称">双炉体自动差热分析天平</el-descriptions-item>
                  <el-descriptions-item label="设备型号">HGST-1</el-descriptions-item>
                  <el-descriptions-item label="设备类别">同步热分析</el-descriptions-item>
                  <el-descriptions-item label="创建人">张三</el-descriptions-item>
                  <el-descriptions-item label="连接协议">Modbus</el-descriptions-item>
                  <el-descriptions-item label="创建时间">2025-04-23 12:00:32</el-descriptions-item>
                  <el-descriptions-item label="设备厂家">设备厂家</el-descriptions-item>
                  <el-descriptions-item label="服务人员">李四</el-descriptions-item>
                  <el-descriptions-item label="采购金额">18万</el-descriptions-item>
                  <el-descriptions-item label="检修时间">2026-04-23 12:00:32</el-descriptions-item>
                  <el-descriptions-item label="安装位置">实验室1</el-descriptions-item>
                  <el-descriptions-item label="负责人">李四</el-descriptions-item>
                  <el-descriptions-item label="" :span="2"></el-descriptions-item>
                  <el-descriptions-item label="服务电话">13121908899</el-descriptions-item>
                </el-descriptions>
              </div>
              <div class="info-right">
                <div class="equipment-image-box">
                  <div class="image-label">设备图片</div>
                  <img src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=200&h=200&fit=crop" alt="设备图片" class="equipment-img">
                  <div class="image-phone">13121908899</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 设备接入 -->
        <el-tab-pane label="设备接入" name="access">
          <div class="tab-content">
            <div class="access-container">
              <!-- 左侧区域 -->
              <div class="access-left">
                <div class="access-section">
                  <h4 class="section-title">接入方式</h4>
                  <el-button size="small">更换</el-button>
                </div>

                <div class="access-description">
                  <p class="device-name">双炉体自动差热分析天平</p>
                  <p class="device-desc">将设备连接到平台内置HTTP服务。</p>
                </div>

                <div class="access-section">
                  <h4 class="section-title">消息协议</h4>
                  <p class="protocol-name">双炉体自动差热分析天平</p>
                </div>

                <!-- 富文本编辑器区域 -->
                <div class="editor-wrapper">
                  <div class="line-numbers">
                    <div v-for="n in editorLineCount" :key="n" class="line-number">{{ n }}</div>
                  </div>
                  <textarea
                    v-model="editorContent"
                    class="editor-textarea"
                    placeholder="请输入内容..."
                    @input="updateLineCount"
                    @scroll="syncScroll"
                    ref="editorTextarea"
                  ></textarea>
                </div>

                <div class="access-section">
                  <h4 class="section-title">连接信息</h4>
                  <el-tag type="success" size="small">http://192.168.100.205:8805</el-tag>
                </div>

                <div class="access-section">
                  <h4 class="section-title">HTTP认证配置</h4>
                  <el-form label-width="80px" style="margin-top: 15px">
                    <el-form-item label="Token:">
                      <el-input v-model="httpToken" readonly size="small">
                        <template #append>
                          <el-button :icon="CopyDocument" @click="copyToken" />
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>

                <div class="access-section">
                  <h4 class="section-title">存储策略</h4>
                  <el-form label-width="80px" style="margin-top: 15px">
                    <el-form-item label="存储策略:">
                      <el-select v-model="storageStrategy" size="small" style="width: 100%">
                        <el-option label="ElasticSearch-打点存储" value="elasticsearch" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </div>

              <!-- 右侧URL信息表格 -->
              <div class="access-right">
                <h4 class="section-title">URL信息</h4>
                <el-table :data="urlData" border style="width: 100%" size="small">
                  <el-table-column prop="category" label="分组" width="100" />
                  <el-table-column prop="deviceId" label="设备型号" min-width="180" show-overflow-tooltip />
                  <el-table-column prop="deviceType" label="设备类别" min-width="150" show-overflow-tooltip />
                  <el-table-column prop="description" label="说明" width="150" />
                </el-table>
              </div>
            </div>

            <div class="form-footer">
              <el-button type="primary" @click="handleSave">保存</el-button>
            </div>
          </div>
        </el-tab-pane>

        <!-- 上行模型 -->
        <el-tab-pane label="上行模型" name="uplink">
          <div class="tab-content">
            <div class="model-input-section">
              <h4 class="section-title">快速导入</h4>
              <el-table :data="modelData" border style="width: 100%">
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column label="标识" width="150">
                  <template #default="{ row }">
                    <el-input v-model="row.identifier" placeholder="请输入标识" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="名称" width="150">
                  <template #default="{ row }">
                    <el-input v-model="row.name" placeholder="请输入名称" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="数据类型" width="150">
                  <template #default="{ row }">
                    <el-select v-model="row.dataType" placeholder="请选择" size="small">
                      <el-option label="字符串" value="string" />
                      <el-option label="数字" value="number" />
                      <el-option label="布尔" value="boolean" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="属性来源" width="150">
                  <template #default="{ row }">
                    <el-select v-model="row.source" placeholder="请选择" size="small">
                      <el-option label="设备" value="device" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="其他配置" width="100" align="center">
                  <template #default>
                    <el-button :icon="Edit" circle size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="{ row, $index }">
                    <el-button type="primary" size="small" @click="handleConfigModel(row)">配置</el-button>
                    <el-button type="danger" size="small" @click="handleDeleteModelRow($index, 'uplink')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="table-actions">
                <el-button type="primary" size="small" @click="handleAddModelRow('uplink')">新增行</el-button>
              </div>
            </div>

            <div class="form-footer">
              <el-button type="primary" @click="handleSave">保存</el-button>
            </div>
          </div>
        </el-tab-pane>

        <!-- 下行模型 -->
        <el-tab-pane label="下行模型" name="downlink">
          <div class="tab-content">
            <div class="model-input-section">
              <h4 class="section-title">快速导入</h4>
              <el-table :data="downlinkModelData" border style="width: 100%">
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column label="标识" width="150">
                  <template #default="{ row }">
                    <el-input v-model="row.identifier" placeholder="请输入标识" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="名称" width="150">
                  <template #default="{ row }">
                    <el-input v-model="row.name" placeholder="请输入名称" size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="数据类型" width="150">
                  <template #default="{ row }">
                    <el-select v-model="row.dataType" placeholder="请选择" size="small">
                      <el-option label="字符串" value="string" />
                      <el-option label="数字" value="number" />
                      <el-option label="布尔" value="boolean" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="属性来源" width="150">
                  <template #default="{ row }">
                    <el-select v-model="row.source" placeholder="请选择" size="small">
                      <el-option label="设备" value="device" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="其他配置" width="100" align="center">
                  <template #default>
                    <el-button :icon="Edit" circle size="small" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="{ row, $index }">
                    <el-button type="primary" size="small" @click="handleConfigModel(row)">配置</el-button>
                    <el-button type="danger" size="small" @click="handleDeleteModelRow($index, 'downlink')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="table-actions">
                <el-button type="primary" size="small" @click="handleAddModelRow('downlink')">新增行</el-button>
              </div>
            </div>

            <div class="form-footer">
              <el-button type="primary" @click="handleSave">保存</el-button>
            </div>
          </div>
        </el-tab-pane>

        <!-- 日志管理 -->
        <el-tab-pane label="日志管理" name="log">
          <div class="tab-content">
            <div class="search-bar">
              <el-form :inline="true">
                <el-form-item label="类型:">
                  <el-input v-model="logSearch.type" placeholder="请输入" style="width: 200px" />
                </el-form-item>
                <el-form-item label="时间:">
                  <el-date-picker
                    v-model="logSearch.dateRange"
                    type="daterange"
                    range-separator="→"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button>重置</el-button>
                  <el-button type="primary">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-table :data="logData" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="type" label="类型" width="150" />
              <el-table-column prop="time" label="时间" width="180" />
              <el-table-column prop="content" label="内容" min-width="300" />
              <el-table-column label="操作" width="100">
                <template #default>
                  <el-button type="primary" link size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 保养记录 -->
        <el-tab-pane label="保养记录" name="maintenance">
          <div class="tab-content">
            <div class="search-bar">
              <el-form :inline="true">
                <el-form-item label="保养时间:">
                  <el-date-picker
                    v-model="maintenanceSearch.dateRange"
                    type="daterange"
                    range-separator="→"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button>重置</el-button>
                  <el-button type="primary">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-table :data="maintenanceData" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="maintenanceTime" label="保养时间" width="120" />
              <el-table-column prop="content" label="保养内容" min-width="200" />
              <el-table-column prop="nextTime" label="下次保养时间" width="140" />
              <el-table-column prop="owner" label="设备厂家" width="120" />
              <el-table-column prop="maintainer" label="联系人" width="100" />
              <el-table-column prop="contact" label="联系方式" width="130" />
              <el-table-column label="备注" width="100" />
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 较准记录 -->
        <el-tab-pane label="较准记录" name="calibration">
          <div class="tab-content">
            <div class="search-bar">
              <el-form :inline="true">
                <el-form-item label="校准时间:">
                  <el-date-picker
                    v-model="calibrationSearch.dateRange"
                    type="daterange"
                    range-separator="→"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button>重置</el-button>
                  <el-button type="primary">查询</el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-table :data="calibrationData" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="calibrationTime" label="校准时间" width="120" />
              <el-table-column prop="result" label="校准结果" width="120" />
              <el-table-column prop="nextTime" label="下次校准时间" width="140" />
              <el-table-column prop="unit" label="校准单位" width="120" />
              <el-table-column prop="contact" label="联系人" width="100" />
              <el-table-column prop="phone" label="联系方式" width="130" />
              <el-table-column label="备注" width="100" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { CopyDocument, Edit } from '@element-plus/icons-vue'

const activeTab = ref('instance')
const equipmentStatus = ref(true)
const httpToken = ref('i87249334490429389904')
const storageStrategy = ref('elasticsearch')

// 富文本编辑器
const editorTextarea = ref<HTMLTextAreaElement>()
const editorContent = ref(`#### 使用HTTP请求接收数据

上报属性数据：

\`\`\` http request
POST /{productId}/{deviceId}/properties/report
Authorization: Bearer {产品密钥:查询产品密钥}
Content-Type: application/json

{
  "properties":{`)

const editorLineCount = ref(11)

// 更新行号
const updateLineCount = () => {
  const lines = editorContent.value.split('\n').length
  editorLineCount.value = Math.max(lines, 1)
}

// 同步滚动
const syncScroll = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const lineNumbers = target.previousElementSibling as HTMLElement
  if (lineNumbers) {
    lineNumbers.scrollTop = target.scrollTop
  }
}

// URL数据
const urlData = ref([
  {
    category: '属性上报',
    deviceId: '/{productId/产品ID}/{deviceId 设备ID}/properties/report',
    deviceType: '{"properties":{"属性ID":"属性"}',
    description: '上报物模型属性数据'
  },
  {
    category: '事件上报',
    deviceId: '/{productId/产品ID}/{deviceId 设备ID}/...',
    deviceType: '{"data":{"key":"value"}}',
    description: '上报物模型事件数据'
  },
  {
    category: '设备上线',
    deviceId: '/{productId/产品ID}/{deviceId 设备ID}/',
    deviceType: '',
    description: '设备上线'
  },
  {
    category: '状态管理',
    deviceId: '/{productId/产品ID}/{deviceId 设备ID}/',
    deviceType: '',
    description: '设备离线'
  }
])

// 上行模型数据
const modelData = ref(Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  identifier: '',
  name: '',
  dataType: '',
  source: 'device'
})))

// 下行模型数据
const downlinkModelData = ref(Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  identifier: '',
  name: '',
  dataType: '',
  source: 'device'
})))

// 日志管理搜索
const logSearch = reactive({
  type: '',
  dateRange: []
})

// 日志数据
const logData = ref([
  { id: 1, type: '这里是日志类型', time: '2023-01-02 11:59', content: '这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容' },
  { id: 2, type: '这里是日志类型', time: '2023-01-02 11:59', content: '这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容' },
  { id: 3, type: '这里是日志类型', time: '2023-01-02 11:59', content: '这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容' },
  { id: 4, type: '这里是日志类型', time: '2023-01-02 11:59', content: '这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容这里是日志内容' }
])

// 保养记录搜索
const maintenanceSearch = reactive({
  dateRange: []
})

// 保养数据
const maintenanceData = ref([
  { id: 1, maintenanceTime: '2025-01-02', content: '日常保养', nextTime: '2026-01-02', owner: '设备厂家', maintainer: '张三', contact: '13121809922' },
  { id: 2, maintenanceTime: '2025-01-02', content: '日常保养', nextTime: '2026-01-02', owner: '设备厂家', maintainer: '张三', contact: '13121809922' },
  { id: 3, maintenanceTime: '2025-01-02', content: '日常保养', nextTime: '2026-01-02', owner: '设备厂家', maintainer: '张三', contact: '13121809922' },
  { id: 4, maintenanceTime: '2025-01-02', content: '日常保养', nextTime: '2026-01-02', owner: '设备厂家', maintainer: '张三', contact: '13121809922' }
])

// 较准记录搜索
const calibrationSearch = reactive({
  dateRange: []
})

// 较准数据
const calibrationData = ref([
  { id: 1, calibrationTime: '2025-01-02', result: '已进行校准', nextTime: '2026-01-02', unit: '设备厂家', contact: '张三', phone: '13121809922' },
  { id: 2, calibrationTime: '2025-01-02', result: '已进行校准', nextTime: '2026-01-02', unit: '设备厂家', contact: '张三', phone: '13121809922' },
  { id: 3, calibrationTime: '2025-01-02', result: '已进行校准', nextTime: '2026-01-02', unit: '设备厂家', contact: '张三', phone: '13121809922' },
  { id: 4, calibrationTime: '2025-01-02', result: '已进行校准', nextTime: '2026-01-02', unit: '设备厂家', contact: '张三', phone: '13121809922' }
])

// 复制Token
const copyToken = () => {
  navigator.clipboard.writeText(httpToken.value)
  ElMessage.success('Token已复制')
}

// 保存
const handleSave = () => {
  ElMessage.success('保存成功')
}

// 新增模型行
const handleAddModelRow = (type: string) => {
  const newRow = {
    id: Date.now(),
    identifier: '',
    name: '',
    dataType: '',
    source: 'device'
  }
  
  if (type === 'uplink') {
    modelData.value.push(newRow)
  } else if (type === 'downlink') {
    downlinkModelData.value.push(newRow)
  }
  
  ElMessage.success('新增行成功')
}

// 删除模型行
const handleDeleteModelRow = (index: number, type: string) => {
  if (type === 'uplink') {
    if (modelData.value.length <= 1) {
      ElMessage.warning('至少保留一行')
      return
    }
    modelData.value.splice(index, 1)
  } else if (type === 'downlink') {
    if (downlinkModelData.value.length <= 1) {
      ElMessage.warning('至少保留一行')
      return
    }
    downlinkModelData.value.splice(index, 1)
  }
  
  ElMessage.success('删除成功')
}

// 配置模型
const handleConfigModel = (row: any) => {
  ElMessage.info(`配置: ${row.name || '未命名'}`)
}
</script>

<style scoped>
.equipment-detail-management-page {
  padding: 20px;
  background: #f0f2f5;
}

.page-card {
  min-height: calc(100vh - 100px);
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.header-left {
  flex: 1;
}

.equipment-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.equipment-subtitle {
  margin: 5px 0;
  font-size: 14px;
  color: #606266;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-size: 14px;
  color: #606266;
}

.detail-tabs {
  padding: 0 20px;
}

.tab-content {
  padding: 20px 0;
}

.section-title {
  margin: 20px 0 15px 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.connection-info {
  margin: 15px 0;
}

.model-input-section {
  margin-bottom: 30px;
}

.search-bar {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

:deep(.search-bar .el-form-item) {
  margin-bottom: 0;
}

.form-footer {
  margin-top: 30px;
  text-align: center;
}

.instance-info-container {
  display: flex;
  gap: 30px;
}

.info-left {
  flex: 1;
}

.info-right {
  width: 250px;
  flex-shrink: 0;
}

.equipment-image-box {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  background: #fafafa;
}

.image-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
  font-weight: 500;
}

.equipment-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
}

.image-phone {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

:deep(.el-descriptions) {
  margin-top: 0;
}

:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: 500;
}

/* 设备接入左右布局 */
.access-container {
  display: flex;
  gap: 30px;
}

.access-left {
  flex: 1;
  min-width: 0;
}

.access-right {
  width: 500px;
  flex-shrink: 0;
}

.access-section {
  margin-bottom: 20px;
}

.access-section .section-title {
  display: inline-block;
  margin: 0 15px 0 0;
  font-size: 14px;
}

.access-description {
  margin: 15px 0;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.device-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.device-desc {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.protocol-name {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: #303133;
}

/* 富文本编辑器样式 */
.editor-wrapper {
  display: flex;
  margin: 15px 0;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fafafa;
  overflow: hidden;
}

.line-numbers {
  background: #f5f7fa;
  padding: 10px 5px;
  text-align: right;
  color: #999;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  line-height: 20px;
  user-select: none;
  border-right: 1px solid #dcdfe6;
  overflow: hidden;
  min-width: 40px;
}

.line-number {
  height: 20px;
  padding-right: 10px;
}

.editor-textarea {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  line-height: 20px;
  color: #303133;
  resize: none;
  min-height: 220px;
  max-height: 400px;
  overflow-y: auto;
}

.editor-textarea::placeholder {
  color: #c0c4cc;
}

/* 表格操作按钮样式 */
.table-actions {
  margin-top: 15px;
  text-align: left;
}

.model-input-section :deep(.el-table) {
  font-size: 13px;
}

.model-input-section :deep(.el-input__inner),
.model-input-section :deep(.el-select) {
  font-size: 13px;
}
</style>
