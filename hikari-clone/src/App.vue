<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue' // 引入导航栏
import { NMessageProvider } from 'naive-ui' // 引入消息提示组件
</script>

<template>
  <n-message-provider>
    
    <NavBar />

    <main class="container mx-auto px-4 py-6">
      <RouterView />
    </main>
    
  </n-message-provider>
</template>

<style>
/* 全局背景色，避免只有中间白，两边没颜色 */
body {
  background-color: #f9fafb; 
}
</style>