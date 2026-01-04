<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue' // 引入导航栏
import { NMessageProvider } from 'naive-ui' // 引入消息提示组件

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