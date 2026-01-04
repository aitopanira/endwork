<script setup>
// ⚠️ 修复点 1：从 vue 中引入 'h' 函数 (用于渲染图标)
import { h } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { NInput, NAvatar, NIcon, NDropdown } from 'naive-ui'
import { SearchOutline, LogOutOutline, PersonOutline } from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 渲染图标的辅助函数
const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 下拉菜单选项
// ⚠️ 修复点 2：正确使用 h 函数渲染图标
const userOptions = [
  { 
    label: '个人中心', 
    key: 'profile', 
    icon: renderIcon(PersonOutline) 
  },
  { 
    label: '退出登录', 
    key: 'logout', 
    icon: renderIcon(LogOutOutline) 
  }
]

// 处理下拉菜单点击
const handleSelect = (key) => {
  if (key === 'logout') {
    userStore.logout()
    window.$message?.success('已退出登录')
    router.push('/login')
  } else if (key === 'profile') {
    // === 修改这里 ===
    // 之前是 alert，现在改成跳转
    router.push('/profile')
  }
}
</script>

<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      
      <div class="flex items-center gap-8">
        <h1 class="text-2xl font-bold text-hikari-pink cursor-pointer tracking-wider" @click="router.push('/')">
          Hikarinagi
        </h1>
        <div class="hidden md:flex gap-6 text-gray-600 font-medium text-sm">
          <RouterLink to="/" class="hover:text-hikari-blue transition">首页</RouterLink>
          <RouterLink to="/community" class="hover:text-hikari-blue transition">社区</RouterLink>
          <RouterLink to="/galgame" class="hover:text-hikari-blue transition">Galgame</RouterLink>
           <RouterLink to="/novel" class="hover:text-hikari-blue transition">轻小说</RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="w-64 hidden sm:block">
          <n-input round placeholder="搜索资源..." size="small">
            <template #prefix><n-icon :component="SearchOutline" /></template>
          </n-input>
        </div>
        
        <div v-if="userStore.userInfo" class="flex items-center gap-3">
           <span class="text-sm text-gray-600 hidden sm:block">
             {{ userStore.userInfo.name }}
           </span>
           
           <n-dropdown trigger="hover" :options="userOptions" @select="handleSelect">
             <div class="cursor-pointer">
               <n-avatar 
                 round 
                 size="small" 
                 :src="userStore.userInfo.avatar" 
                 class="border border-gray-200" 
               />
             </div>
           </n-dropdown>
        </div>

        <div v-else class="flex gap-3 text-sm">
           <router-link to="/login" class="text-gray-500 hover:text-hikari-blue cursor-pointer self-center">
             登录
           </router-link>
           <span class="bg-hikari-pink text-white px-4 py-1 rounded-full cursor-pointer hover:bg-pink-500 transition text-xs flex items-center" @click="router.push('/login')">
             注册
           </span>
        </div>
        
      </div>
    </div>
  </nav>
</template>