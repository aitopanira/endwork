<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue' // 引入导航栏
import { NMessageProvider } from 'naive-ui' // 引入消息提示组件
import { onMounted } from 'vue'
import axios from 'axios'

onMounted(async () => {
  console.log('🚀 开始尝试连接后端...')
  try {
    // 注意：这里的 /a/users/ 会被 vite.config.js 里的代理转发到 http://127.0.0.1:8000/a/users/
    const res = await axios.get('/a/users/')
    console.log('✅ 连接成功！后端返回的数据：', res.data)
    window.$message?.success('后端连接成功！')
  } catch (error) {
    console.error('❌ 连接失败:', error)
    window.$message?.error('后端连接失败')
  }
})
const route = useRoute()

// 判断当前是否为阅读页面
// 注意：这需要你在 router/index.js 中把阅读页的 name 设为 'reader'
const isReaderPage = computed(() => route.name === 'reader')


</script>

<template>
  <n-message-provider>
    
    <NavBar v-if="!isReaderPage" />

    <main :class="isReaderPage ? 'w-screen h-screen overflow-hidden' : 'container mx-auto px-4 py-6'">
      <RouterView />
    </main>
    
  </n-message-provider>
</template>

<style>
/* 全局背景色 */
body {
  background-color: #f9fafb;
  margin: 0; /* 确保没有默认边距 */
}
</style>