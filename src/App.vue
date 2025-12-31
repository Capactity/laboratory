<template>
  <div id="app">
    <el-config-provider>
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
// App.vue 作为应用根组件，仅负责提供 router-view
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 60px;
  line-height: 60px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.logo {
  margin-right: 40px;
}

.logo h2 {
  margin: 0;
  color: #409eff;
  font-size: 20px;
}

.main {
  flex: 1;
  background-color: #f5f7fa;
  padding: 0;
}

.footer {
  background-color: #fff;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #e4e7ed;
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
</style>
