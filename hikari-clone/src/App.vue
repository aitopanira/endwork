<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/Footer.vue'
import { NConfigProvider } from 'naive-ui'

// 配置 Naive UI 的主题色，让它和 Tailwind 的粉色一致
const themeOverrides = {
  common: {
    primaryColor: '#fb7299',
    primaryColorHover: '#fc8bab',
    primaryColorPressed: '#d05c7c',
  }
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="min-h-screen flex flex-col font-sans text-gray-700">
      
      <NavBar />
      
      <main class="container mx-auto px-4 flex-grow py-6">
        <RouterView />
      </main>

      <AppFooter />
      
    </div>
  </n-config-provider>
</template>