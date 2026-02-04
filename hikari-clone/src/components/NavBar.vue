<script setup>
import { h } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { NInput, NAvatar, NIcon, NDropdown, NButton } from 'naive-ui'
// 1. 👇 引入 Search (实心粗体版)，去掉 SearchOutline
import { Search, LogOutOutline, PersonOutline, CreateOutline, LibraryOutline } from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const userOptions = [
  { 
    label: '个人中心', 
    key: 'profile', 
    icon: renderIcon(PersonOutline) 
  },
  {
    label: '创作者中心', 
    key: 'creator-center', 
    icon: renderIcon(CreateOutline) 
  },
  { 
    label: '我的收藏',
    key: 'library', 
    icon: renderIcon(LibraryOutline) 
  },
  { 
    label: '退出登录', 
    key: 'logout', 
    icon: renderIcon(LogOutOutline) 
  }
]

const handleSelect = (key) => {
  if (key === 'logout') {
    userStore.logout()
    window.$message?.success('已退出登录')
    router.push('/login')
  } else if (key === 'profile') {
    router.push('/profile')
  }
  else if (key === 'creator-center') {
    router.push('/creator')
  }
  else if (key === 'library') { 
    router.push('/library')
  }
}
</script>

<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      
      <div class="flex items-center gap-8">
        <h1 class="text-2xl font-bold text-hikari-pink cursor-pointer tracking-wider" @click="router.push('/')">
          AiHikari
        </h1>
        <div class="hidden md:flex gap-6 text-gray-600 font-medium text-sm">
          <RouterLink to="/" class="hover:text-hikari-blue transition">首页</RouterLink>
          <RouterLink to="/galgame" class="hover:text-hikari-blue transition">Galgame</RouterLink>
           <RouterLink to="/novel" class="hover:text-hikari-blue transition">轻小说</RouterLink>
           <RouterLink to="/music" class="hover:text-hikari-blue transition">音乐</RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <n-button square quaternary size="large" @click="router.push('/search')">
          <template #icon>
            <n-icon :component="Search" color="#fb7299" />
          </template>
        </n-button>
        
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