<template>
  <div class="about-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>关于本项目</span>
        </div>
      </template>
      
      <div class="content">
        <h2>Vue 3 + TypeScript + Element Plus 企业级后台管理系统</h2>
        
        <el-divider />
        
        <h3>技术栈</h3>
        <el-tag v-for="tech in techStack" :key="tech" class="tech-tag" type="primary">
          {{ tech }}
        </el-tag>
        
        <el-divider />
        
        <h3>项目特性</h3>
        <ul class="feature-list">
          <li>✅ 使用 Vue 3 Composition API 和 `&lt;script setup&gt;` 语法</li>
          <li>✅ TypeScript 严格类型检查</li>
          <li>✅ Vite 5+ 快速构建工具</li>
          <li>✅ Element Plus UI 组件库</li>
          <li>✅ Pinia 状态管理</li>
          <li>✅ Vue Router 4 路由管理</li>
          <li>✅ Axios 完整封装（请求/响应拦截、错误处理、Loading 状态）</li>
          <li>✅ ESLint + Prettier 代码规范</li>
          <li>✅ 组件自动导入</li>
          <li>✅ 响应式布局</li>
        </ul>
        
        <el-divider />
        
        <h3>项目结构</h3>
        <pre class="code-block">{{ projectStructure }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const techStack = ref([
  'Vue 3.4+',
  'TypeScript 5.3+',
  'Vite 5+',
  'Element Plus 2.5+',
  'Vue Router 4.2+',
  'Pinia 2.1+',
  'Axios 1.6+'
])

const projectStructure = `src/
├── api/              # API 接口封装
│   ├── index.ts      # 统一导出
│   ├── types/        # 类型定义
│   └── modules/      # 业务模块
├── components/       # 全局组件
├── composables/      # 组合式函数
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── utils/            # 工具函数
├── views/            # 页面组件
├── App.vue           # 根组件
└── main.ts           # 入口文件`
</script>

<style scoped>
.about-container {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.content {
  line-height: 1.8;
}

.content h2 {
  color: #409eff;
  margin-bottom: 20px;
}

.content h3 {
  color: #333;
  margin: 20px 0 10px 0;
}

.tech-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.feature-list {
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 10px;
  font-size: 14px;
}

.code-block {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}
</style>
