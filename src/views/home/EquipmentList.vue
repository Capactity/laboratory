<template>
  <div class="equipment-list-page">
    <!-- 设备分类区块 -->
    <div v-for="category in equipmentCategories" :key="category.id" class="category-section">
      <h2 class="category-title">{{ category.name }}</h2>
      
      <div class="equipment-grid">
        <div 
          v-for="item in category.items" 
          :key="item.id"
          class="equipment-card"
        >
          <div class="equipment-image" @click="handleEquipmentPreview(item)">
            <img :src="item.image" :alt="item.name">
          </div>
          <div class="equipment-name" @click="goToDetail(item)">{{ item.name }}</div>
          <div class="equipment-line"></div>
        </div>
      </div>
    </div>

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
            v-for="(_item, index) in currentCategoryItems" 
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
          :disabled="currentEquipmentIndex === currentCategoryItems.length - 1"
          @click="nextEquipment"
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

// 设备弹窗相关
const dialogVisible = ref(false)
const currentEquipmentIndex = ref(0)
const currentCategoryId = ref('')

// 设备分类数据
const equipmentCategories = ref([
  {
    id: 'thermal',
    name: '热分析仪',
    items: [
      { id: 't1', name: '双炉体自动差热分析天平', image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400&h=300&fit=crop' },
      { id: 't2', name: '全自动泰勒天平（全自动熔融法分级仪）', image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop' },
      { id: 't3', name: '差热分析仪', image: 'https://images.unsplash.com/photo-1581092160607-ee67f7d2c4f1?w=400&h=300&fit=crop' },
      { id: 't4', name: '全自动差热分析仪', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop' },
      { id: 't5', name: '磁热差示扫描量热仪', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop' }
    ]
  },
  {
    id: 'physical',
    name: '物理化学类实验仪器',
    items: [
      { id: 'p1', name: '双炉体自动差热分析天平', image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400&h=300&fit=crop' },
      { id: 'p2', name: '全自动泰勒天平（全自动熔融法分级仪）', image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop' },
      { id: 'p3', name: '差热分析仪', image: 'https://images.unsplash.com/photo-1581092160607-ee67f7d2c4f1?w=400&h=300&fit=crop' },
      { id: 'p4', name: '全自动差热分析仪', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop' },
      { id: 'p5', name: '磁热差示扫描量热仪', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop' }
    ]
  },
  {
    id: 'optical',
    name: '物理光学仪器',
    items: [
      { id: 'o1', name: '双炉体自动差热分析天平', image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400&h=300&fit=crop' },
      { id: 'o2', name: '全自动泰勒天平（全自动熔融法分级仪）', image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop' },
      { id: 'o3', name: '差热分析仪', image: 'https://images.unsplash.com/photo-1581092160607-ee67f7d2c4f1?w=400&h=300&fit=crop' },
      { id: 'o4', name: '全自动差热分析仪', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop' },
      { id: 'o5', name: '磁热差示扫描量热仪', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop' }
    ]
  }
])

// 当前分类的设备列表
const currentCategoryItems = computed(() => {
  const category = equipmentCategories.value.find(cat => cat.id === currentCategoryId.value)
  return category ? category.items : []
})

// 当前选中的设备
const currentEquipment = computed(() => currentCategoryItems.value[currentEquipmentIndex.value])

// 跳转到设备详情页
const goToDetail = (item: any) => {
  router.push(`/home/equipment-detail/${item.id}`)
}

// 预览设备（打开弹窗）
const handleEquipmentPreview = (item: any) => {
  // 找到该设备所属的分类
  for (const category of equipmentCategories.value) {
    const index = category.items.findIndex(eq => eq.id === item.id)
    if (index !== -1) {
      currentCategoryId.value = category.id
      currentEquipmentIndex.value = index
      dialogVisible.value = true
      break
    }
  }
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
  if (currentEquipmentIndex.value < currentCategoryItems.value.length - 1) {
    currentEquipmentIndex.value++
  }
}
</script>

<style scoped>
.equipment-list-page {
  padding: 20px;
  background: #f0f2f5;
}

.category-section {
  margin-bottom: 40px;
  background: white;
  padding: 30px;
  border-radius: 8px;
}

.category-title {
  margin: 0 0 25px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 15px;
  border-bottom: 2px solid #e4e7ed;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 25px;
}

.equipment-card {
  text-align: center;
  transition: transform 0.3s;
  padding: 15px;
  border-radius: 8px;
}

.equipment-card:hover {
  transform: translateY(-5px);
  background: #f9f9f9;
}

.equipment-image {
  width: 100%;
  height: 160px;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
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
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
  cursor: pointer;
  transition: color 0.3s;
}

.equipment-name:hover {
  color: #409eff;
}

.equipment-line {
  width: 40px;
  height: 3px;
  background: #409eff;
  margin: 0 auto;
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

/* 响应式 */
@media (max-width: 1600px) {
  .equipment-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .equipment-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .equipment-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .category-section {
    padding: 20px;
  }
}
</style>
