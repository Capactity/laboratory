<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>
    <p>这是一个全局组件示例</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<style scoped>
.hello-world {
  padding: 20px;
  text-align: center;
}

.hello-world h1 {
  color: #409eff;
  margin-bottom: 10px;
}

.hello-world p {
  color: #666;
}
</style>
