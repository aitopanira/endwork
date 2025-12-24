<script setup>
import { RouterLink } from 'vue-router'
import { NButton, NInput, NAvatar } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5' 
</script>

<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      
      <div class="flex items-center gap-8">
        <h1 class="text-2xl font-bold text-hikari-pink cursor-pointer tracking-wider">
          Hikarinagi
        </h1>
        
        <div class="hidden md:flex gap-6 text-gray-600 font-medium text-sm">
          <RouterLink to="/" class="hover:text-hikari-blue transition duration-200">首页</RouterLink>
          <a href="#" class="hover:text-hikari-blue transition duration-200">社区</a>
          <a href="#" class="hover:text-hikari-blue transition duration-200">Galgame</a>
          <a href="#" class="hover:text-hikari-blue transition duration-200">轻小说</a>
          <a href="#" class="hover:text-hikari-blue transition duration-200">AI女友</a>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="w-64 hidden sm:block">
          <n-input round placeholder="搜索资源 / 帖子..." size="small">
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
        </div>
        
        <div class="flex gap-3 text-sm">
         <router-link to="/login" class="text-gray-500 hover:text-hikari-blue cursor-pointer">
            登录
        </router-link>
           <span class="bg-hikari-pink text-white px-4 py-1 rounded-full cursor-pointer hover:bg-pink-500 transition">
             注册
           </span>
        </div>
      </div>

    </div>
  </nav>
</template>