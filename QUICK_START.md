# 快速启动指南

## 📦 安装依赖

在项目根目录下运行以下命令安装所有依赖：

```bash
npm install
```

或使用其他包管理器：

```bash
# 使用 pnpm（推荐，速度更快）
pnpm install

# 使用 yarn
yarn install
```

## 🚀 启动开发服务器

安装完成后，运行以下命令启动开发服务器：

```bash
npm run dev
```

项目将在 **http://localhost:3000** 自动打开。

## 📁 项目文件说明

### 核心文件

- **`src/main.ts`** - 应用入口文件
- **`src/App.vue`** - 根组件
- **`index.html`** - HTML 入口文件
- **`vite.config.ts`** - Vite 配置文件

### 重要目录

- **`src/api/`** - API 接口封装
  - `index.ts` - Axios 实例和用户 API
  - `modules/table.ts` - 表格数据 API 示例
  - `types/index.ts` - TypeScript 类型定义

- **`src/stores/`** - Pinia 状态管理
  - `user.ts` - 用户状态管理（登录、用户信息等）

- **`src/router/`** - Vue Router 路由配置
  - `index.ts` - 路由定义和守卫

- **`src/utils/`** - 工具函数
  - `request.ts` - Axios 完整封装（拦截器、错误处理）
  - `validate.ts` - 表单验证工具

- **`src/views/`** - 页面组件
  - `Home.vue` - 首页（完整示例：表格、搜索、分页）
  - `About.vue` - 关于页面
  - `Login.vue` - 登录页面
  - `NotFound.vue` - 404 页面

## 🎯 功能演示

### 1. 首页（Home.vue）

访问 http://localhost:3000 查看完整功能：

- ✅ **搜索表单** - 关键词搜索和重置
- ✅ **数据表格** - 支持选择、排序、操作
- ✅ **分页组件** - 完整的分页功能
- ✅ **CRUD 操作** - 增删改查按钮演示
- ✅ **Loading 状态** - 数据加载动画
- ✅ **Pinia 状态** - 用户信息展示和管理

### 2. 登录页面

访问 http://localhost:3000/login

- 表单验证演示
- 模拟登录（用户名：admin，密码：任意）
- 登录后自动跳转首页

### 3. 状态管理演示

在首页底部可以：
- 查看当前登录状态
- 模拟登录/退出
- 观察 Pinia 状态变化

## 🔧 常用命令

```bash
# 开发环境运行
npm run dev

# 生产环境构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📝 开发建议

### 1. 添加新页面

1. 在 `src/views/` 创建新的 `.vue` 文件
2. 在 `src/router/index.ts` 添加路由配置
3. 在导航菜单中添加链接

### 2. 添加新 API

1. 在 `src/api/types/` 定义 TypeScript 类型
2. 在 `src/api/modules/` 创建对应的 API 模块
3. 在组件中导入并使用

### 3. 添加新状态

1. 在 `src/stores/` 创建新的 store 文件
2. 使用 `defineStore` 定义状态和方法
3. 在组件中通过 `useXxxStore()` 使用

## 🎨 自定义配置

### 修改端口

在 `vite.config.ts` 中修改：

```typescript
server: {
  port: 3000, // 改为你想要的端口
}
```

### 修改 API 地址

在 `.env` 文件中修改：

```env
VITE_API_BASE_URL=http://your-api-url.com
```

### 修改主题色

Element Plus 主题色可以通过 CSS 变量覆盖，在 `src/App.vue` 的 `<style>` 中添加：

```css
:root {
  --el-color-primary: #409eff; /* 修改为你的主题色 */
}
```

## ⚠️ 注意事项

1. **TypeScript 错误** - 首次运行前需要安装依赖，否则会有类型错误提示
2. **ESLint 配置** - 首次运行会自动生成 `.eslintrc-auto-import.json`
3. **组件自动导入** - Element Plus 组件会自动导入，无需手动引入

## 🐛 常见问题

### 问题 1: 依赖安装失败

**解决方案**：
```bash
# 清除缓存
npm cache clean --force
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json
# 重新安装
npm install
```

### 问题 2: 端口被占用

**解决方案**：
- 修改 `vite.config.ts` 中的端口号
- 或者关闭占用 3000 端口的程序

### 问题 3: 热更新不生效

**解决方案**：
- 重启开发服务器
- 检查文件是否在 `src` 目录下

## 📚 学习资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/zh/)
- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)

## 💡 下一步

1. ✅ 熟悉项目结构
2. ✅ 查看示例代码
3. ✅ 尝试修改页面
4. ✅ 添加自己的功能
5. ✅ 连接真实的后端 API

祝你开发愉快！🎉
