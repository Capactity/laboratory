# Vue3 Admin - 企业级后台管理系统

一个基于 Vue 3 + TypeScript + Element Plus 的现代化企业级后台管理系统模板。

## 技术栈

- **框架**: Vue 3.4+ (Composition API + `<script setup>`)
- **语言**: TypeScript 5.3+
- **构建工具**: Vite 5+
- **UI 组件库**: Element Plus 2.5+
- **状态管理**: Pinia 2.1+
- **路由**: Vue Router 4.2+
- **HTTP 客户端**: Axios 1.6+
- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## 项目特性

✅ 最新的 Vue 3 Composition API  
✅ 完整的 TypeScript 类型支持  
✅ Vite 5+ 极速开发体验  
✅ Element Plus 组件按需导入  
✅ 完善的 Axios 封装（请求/响应拦截、错误处理、Loading）  
✅ Pinia 状态管理最佳实践  
✅ Vue Router 路由守卫  
✅ ESLint + Prettier 代码规范  
✅ 组件自动导入  
✅ 响应式布局设计  

## 项目结构

```
src/
├── api/              # API 接口封装
│   ├── index.ts      # axios 全局配置和拦截器
│   ├── types/        # 接口类型定义
│   └── modules/      # 按业务模块划分的 API
├── components/       # 全局公共组件
├── composables/      # 组合式函数
│   └── useFetch.ts
├── router/           # 路由配置
│   └── index.ts
├── stores/           # Pinia 状态管理
│   ├── index.ts
│   └── user.ts
├── utils/            # 工具函数
│   ├── request.ts    # axios 封装
│   └── validate.ts
├── views/            # 页面组件
│   ├── Home.vue
│   ├── About.vue
│   ├── Login.vue
│   └── NotFound.vue
├── App.vue           # 根组件
├── main.ts           # 应用入口
└── env.d.ts          # 类型声明文件
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 开发环境运行

```bash
npm run dev
```

项目将在 http://localhost:3000 启动

### 生产环境构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 核心功能说明

### 1. Axios 封装

位于 `src/utils/request.ts`，提供：

- ✅ 请求/响应拦截器
- ✅ Token 自动携带
- ✅ 统一错误处理
- ✅ Loading 状态管理
- ✅ 请求取消功能
- ✅ 完整的 TypeScript 类型支持

### 2. Pinia 状态管理

位于 `src/stores/`，示例包含：

- ✅ 用户信息管理
- ✅ 登录/登出逻辑
- ✅ Token 持久化
- ✅ 计算属性使用

### 3. 路由配置

位于 `src/router/index.ts`，包含：

- ✅ 路由懒加载
- ✅ 路由守卫（登录验证）
- ✅ 页面标题设置
- ✅ 404 页面处理

### 4. Element Plus 配置

- ✅ 按需导入（减小打包体积）
- ✅ 中文国际化
- ✅ 组件自动导入
- ✅ 图标自动导入

## 示例页面

### Home.vue

完整的数据管理示例，包含：

- 搜索表单
- 数据表格（支持选择、排序）
- 分页组件
- 增删改查操作
- Loading 状态
- Pinia 状态演示

### About.vue

项目介绍页面

### Login.vue

登录页面，包含：

- 表单验证
- 登录逻辑
- 路由跳转

## 环境变量

在 `.env` 文件中配置：

```env
VITE_APP_TITLE=Vue3 Admin
VITE_API_BASE_URL=/api
```

## 浏览器支持

现代浏览器和 IE11+（需要 polyfills）

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
