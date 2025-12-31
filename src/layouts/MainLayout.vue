<template>
  <div class="main-layout">
    <!-- 左侧菜单栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <el-icon v-if="!isCollapse" class="logo-icon" :size="20"><Menu /></el-icon>
        <h2 v-if="!isCollapse">实验室管理平台</h2>
        <h2 v-else>实</h2>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        class="sidebar-menu"
        background-color="#3d6bd9"
        text-color="#d4e2ff"
        active-text-color="#ffffff"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        
        <el-sub-menu index="budget">
          <template #title>
            <el-icon><Wallet /></el-icon>
            <span>预警管理</span>
          </template>
          <el-menu-item index="/budget/setting">预警设置</el-menu-item>
          <el-menu-item index="/budget/record">预警记录</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="experiment">
          <template #title>
            <el-icon><List /></el-icon>
            <span>实验管理</span>
          </template>
          <el-menu-item index="/experiment/info">实验信息</el-menu-item>
          <el-menu-item index="/experiment/sample">实验样品</el-menu-item>
          <el-menu-item index="/experiment/plan">实验方案</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="equipment">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>设备管理</span>
          </template>
          <el-menu-item index="/equipment/management">实验设备</el-menu-item>
          <el-menu-item index="/equipment/maintenance">保养记录</el-menu-item>
          <el-menu-item index="/equipment/detection">检测记录</el-menu-item>
          <el-menu-item index="/equipment/robot">智能机器人</el-menu-item>
          <el-menu-item index="/equipment/door">智能门禁</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="other">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>其他设置</span>
          </template>
          <el-menu-item index="/other/system">系统设置</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 右侧主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <span class="user-name">{{ userStore.userInfo?.nickname || '管理员' }}</span>
          <el-dropdown @command="handleCommand">
            <span class="user-avatar">
              <el-avatar :size="32" :src="userStore.userInfo?.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <!-- 底部 -->
      <el-footer class="footer">
        <p>© 2024 Vue3 Admin. All rights reserved.</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  HomeFilled,
  Setting,
  Expand,
  Fold,
  User,
  Wallet,
  List,
  Monitor,
  Menu
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)
const activeMenu = ref(route.path)

// 监听路由变化，更新当前激活的菜单
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  }
)

// 切换菜单栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  router.push(index)
}

// 下拉菜单命令处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心')
      break
    case 'settings':
      ElMessage.info('设置')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userStore.reset()
          router.push('/login')
          ElMessage.success('已退出登录')
        })
        .catch(() => {
          // 取消退出
        })
      break
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background-color: #3d6bd9;
  transition: width 0.3s;
  overflow-x: hidden;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3461c7;
  gap: 8px;
  padding: 0 15px;
}

.logo-icon {
  color: white;
  flex-shrink: 0;
}

.logo h2 {
  margin: 0;
  color: white;
  font-size: 16px;
  white-space: nowrap;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background: linear-gradient(90deg, #4a7cff 0%, #6b8fff 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
  color: white;
}

.collapse-icon:hover {
  color: #e6f0ff;
}

.breadcrumb {
  font-size: 14px;
}

:deep(.breadcrumb .el-breadcrumb__inner) {
  color: white;
}

:deep(.breadcrumb .el-breadcrumb__separator) {
  color: rgba(255, 255, 255, 0.7);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  font-size: 14px;
  color: white;
}

.user-avatar {
  cursor: pointer;
}

.main {
  flex: 1;
  background-color: #f0f2f5;
  overflow-y: auto;
  padding: 20px;
}

.footer {
  background-color: #fff;
  text-align: center;
  padding: 16px;
  border-top: 1px solid #e4e7ed;
  height: 50px;
}

.footer p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
